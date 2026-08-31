"""
Punk Records — Citizens list route

GET /api/citizens
→ List[CitizenSummary]   (id, name, dob)

Used by the frontend citizen selector (the dropdown that replaces OCR scan for MVP).
Returns all seeded citizens. No sensitive fields — name and DOB only.
"""

from fastapi import APIRouter

from app.db.client import get_db, fetchall
from app.models.common import CitizenSummary

router = APIRouter(prefix="/api/citizens", tags=["Citizens"])


@router.get(
    "",
    response_model=list[CitizenSummary],
    summary="List all seeded citizens",
    description=(
        "Returns the list of demo-seeded citizens available for selection in the "
        "Checkpoint views. This endpoint replaces live OCR document scanning for "
        "the MVP — the UI labels this as 'demo mode, citizen select replaces DL scan'."
    ),
)
def list_citizens() -> list[CitizenSummary]:
    with get_db() as db:
        rows = fetchall(db, "SELECT id, name, dob FROM citizens WHERE seeded = 1 ORDER BY name")
    return [CitizenSummary(id=r["id"], name=r["name"], dob=r["dob"]) for r in rows]
