"""
Punk Records — Vault Route (Read-only citizen view)

GET /api/vault/{citizen_id}
→ VaultViewResponse

MVP Status: Read-only static view of the seeded citizen's documents and flags.
No upload, sync, or reorder — those affordances are intentionally OMITTED,
not built as disabled buttons.

The Vault proves Pillar 2: the same graph that serves the Traffic officer
also surfaces the citizen's own document status and any flags they should
know about before an officer encounter.
"""

import json

from fastapi import APIRouter, HTTPException

from app.db.client import get_db, fetchone, fetchall
from app.models.vault import VaultViewResponse, VaultDocSummary, VaultFlagSummary

router = APIRouter(prefix="/api/vault", tags=["Vault (Citizen)"])

_DOC_TYPE_LABELS = {
    "DL":        "Driving Licence",
    "RC":        "Vehicle Registration Certificate",
    "PAN":       "PAN Card",
    "AADHAAR":   "Aadhaar Card",
    "CHALLAN":   "Traffic Challan",
    "SUMMONS":   "Court Summons",
    "KYC_FIELD": "KYC Document",
}


@router.get(
    "/{citizen_id}",
    response_model=VaultViewResponse,
    summary="Vault — citizen's own document and flag view (read-only)",
    description=(
        "**MVP: Read-only.** Returns the citizen's own document status and any "
        "cross-verification flags from the same shared graph the Traffic Satellite reads. "
        "No upload or sync functionality — this is a static view of seeded data."
    ),
)
def vault_view(citizen_id: str) -> VaultViewResponse:
    with get_db() as db:
        citizen = fetchone(
            db, "SELECT id, name, dob FROM citizens WHERE id = ?", (citizen_id,)
        )
        if not citizen:
            raise HTTPException(status_code=404, detail=f"Citizen '{citizen_id}' not found.")

        docs = fetchall(
            db,
            "SELECT id, doc_type, status, department FROM documents WHERE citizen_id = ?",
            (citizen_id,),
        )
        doc_summaries = [
            VaultDocSummary(
                doc_id=d["id"],
                doc_type=d["doc_type"],
                status=d["status"],
                department=d["department"],
                display_label=_DOC_TYPE_LABELS.get(d["doc_type"], d["doc_type"]),
            )
            for d in docs
        ]

        flags_raw = fetchall(
            db,
            """SELECT match_field, explanation, below_threshold
               FROM cross_verification_results
               WHERE citizen_id = ? AND below_threshold = 1""",
            (citizen_id,),
        )
        flags = [
            VaultFlagSummary(
                match_field=f["match_field"],
                explanation=f["explanation"],
                below_threshold=bool(f["below_threshold"]),
            )
            for f in flags_raw
        ]

        return VaultViewResponse(
            citizen_id=citizen["id"],
            name=citizen["name"],
            dob=citizen["dob"],
            documents=doc_summaries,
            verification_flags=flags,
        )
