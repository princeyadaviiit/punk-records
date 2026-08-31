"""
Punk Records — Legal Satellite Route

GET /api/checkpoint/legal/{citizen_id}
→ LegalCheckResponse (outstanding challans + court summons status)

⚠️  MVP STATUS: SEEDED / STATIC PREVIEW (DISCLOSED)
This route returns data from the same shared schema — not a separate mock.
The response is shaped through LegalCheckResponse, which is structurally
incapable of containing Traffic or Banking fields.

The UI carries a mandatory seeded-preview banner for this Satellite.
Language: "Seeded preview — live cross-Satellite sync is the next milestone."

Why Legal not Banking: Cleaner narrative fit with the traffic enforcement
context and the Civic Literacy Bridge (MV Act / challan rules).

Access pattern:
  1. Load citizen from shared 'citizens' table.
  2. Count CHALLAN documents where status = 'flagged' (unpaid/pending).
  3. Count SUMMONS documents where status = 'flagged'.
  4. Shape and return only LegalCheckResponse fields.
"""

import json

from fastapi import APIRouter, HTTPException

from app.db.client import get_db, fetchone, fetchall
from app.models.legal import LegalCheckResponse, SummonsDetail

router = APIRouter(prefix="/api/checkpoint/legal", tags=["Legal Satellite (Seeded Preview)"])


@router.get(
    "/{citizen_id}",
    response_model=LegalCheckResponse,
    summary="Legal Satellite — Challan + court summons check (seeded preview)",
    description=(
        "**SEEDED PREVIEW — live cross-Satellite sync is the next milestone.** "
        "Returns outstanding challan count and court summons status for the given "
        "citizen. Structural scope: legal enforcement fields only. "
        "Reads from the same shared schema as the Traffic Satellite — no separate mock dataset."
    ),
)
def legal_check(citizen_id: str) -> LegalCheckResponse:
    with get_db() as db:
        # 1. Verify citizen
        citizen = fetchone(
            db, "SELECT id, name FROM citizens WHERE id = ?", (citizen_id,)
        )
        if not citizen:
            raise HTTPException(status_code=404, detail=f"Citizen '{citizen_id}' not found.")

        # 2. Count open challans from shared documents table
        challan_docs = fetchall(
            db,
            """SELECT id, fields FROM documents
               WHERE citizen_id = ? AND doc_type = 'CHALLAN' AND status = 'flagged'""",
            (citizen_id,),
        )
        outstanding_challans_count = len(challan_docs)

        # 3. Count pending summons
        summons_docs = fetchall(
            db,
            """SELECT id, fields FROM documents
               WHERE citizen_id = ? AND doc_type = 'SUMMONS' AND status = 'flagged'""",
            (citizen_id,),
        )
        court_summons_pending = len(summons_docs) > 0

        summons_details = None
        if court_summons_pending:
            summons_details = []
            for s in summons_docs:
                fields = json.loads(s["fields"]) if isinstance(s["fields"], str) else s["fields"]
                summons_details.append(
                    SummonsDetail(
                        summons_id=fields.get("summons_id", s["id"]),
                        description=fields.get("description", "Court summons pending."),
                        issued_date=fields.get("issued_date", ""),
                    )
                )

        # 4. Return ONLY LegalCheckResponse — Traffic/Banking fields structurally absent
        return LegalCheckResponse(
            citizen_id=citizen["id"],
            citizen_name=citizen["name"],
            outstanding_challans_count=outstanding_challans_count,
            court_summons_pending=court_summons_pending,
            summons_details=summons_details,
        )
