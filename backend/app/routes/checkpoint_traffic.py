"""
Punk Records — Traffic Satellite Route

GET /api/checkpoint/traffic/{citizen_id}
→ TrafficCheckResponse  (structurally scoped to DL status + vehicle match only)

Privacy boundary enforced at this response model — not downstream in the UI.
The FastAPI OpenAPI schema for this route proves the scoping claim structurally.

Access pattern:
  1. Load citizen's DL and RC documents from the shared 'documents' table.
  2. Read pre-existing cross_verification_results for name match.
  3. Shape and return only TrafficCheckResponse fields — nothing else.

No LLM. No superset return + frontend filter. DL/vehicle scope only.
"""

import json
from typing import Optional

from fastapi import APIRouter, HTTPException

from app.db.client import get_db, fetchone, fetchall
from app.models.traffic import TrafficCheckResponse, MismatchDetail

router = APIRouter(prefix="/api/checkpoint/traffic", tags=["Traffic Satellite"])


@router.get(
    "/{citizen_id}",
    response_model=TrafficCheckResponse,
    summary="Traffic Satellite — DL + vehicle match check",
    description=(
        "Returns DL validity and vehicle registration name-match status for the "
        "given citizen. **Structural scope: DL fields and vehicle match only.** "
        "The response type is incapable of containing KYC, challan, or other "
        "Satellite fields — inspect the OpenAPI schema to verify this claim."
    ),
)
def traffic_check(citizen_id: str) -> TrafficCheckResponse:
    with get_db() as db:
        # 1. Verify citizen exists
        citizen = fetchone(
            db, "SELECT id, name FROM citizens WHERE id = ?", (citizen_id,)
        )
        if not citizen:
            raise HTTPException(status_code=404, detail=f"Citizen '{citizen_id}' not found.")

        # 2. Load DL
        dl_doc = fetchone(
            db,
            "SELECT id, fields, status FROM documents WHERE citizen_id = ? AND doc_type = 'DL'",
            (citizen_id,),
        )
        if not dl_doc:
            raise HTTPException(
                status_code=404,
                detail=f"No Driving Licence on record for citizen '{citizen_id}'.",
            )

        dl_fields = json.loads(dl_doc["fields"]) if isinstance(dl_doc["fields"], str) else dl_doc["fields"]
        dl_status = dl_doc["status"]  # 'valid' | 'expired' | 'flagged'
        citizen_name = dl_fields.get("name", citizen["name"])

        # 3. Check for pre-computed cross-verification result (DL vs RC name)
        cvr = fetchone(
            db,
            """SELECT below_threshold, explanation, match_score
               FROM cross_verification_results
               WHERE citizen_id = ? AND match_field = 'name'
               ORDER BY match_score ASC
               LIMIT 1""",
            (citizen_id,),
        )

        vehicle_match: bool = True
        mismatch: Optional[MismatchDetail] = None

        if cvr:
            below = bool(cvr["below_threshold"])
            vehicle_match = not below
            if below:
                mismatch = MismatchDetail(
                    match_field="name",
                    explanation=cvr["explanation"],
                )
                # If DL is 'valid' but name mismatch exists, reflect that in dl_status
                if dl_status == "valid":
                    dl_status = "flagged"

        # 4. Return ONLY TrafficCheckResponse — no other fields escape this boundary
        return TrafficCheckResponse(
            citizen_id=citizen["id"],
            citizen_name=citizen_name,
            dl_status=dl_status,  # type: ignore[arg-type]
            vehicle_match=vehicle_match,
            mismatch=mismatch,
        )
