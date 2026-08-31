"""
Punk Records — Legal Satellite Response Model

STRUCTURAL ACCESS CONTROL — LOAD-BEARING.
This model is the Privacy Boundary for the Legal Satellite.

Rule (rules.md #2): This response type must be structurally INCAPABLE of
containing another Satellite's fields. No DL/vehicle fields, no KYC/banking
fields, no Aadhaar fields may appear here, even as Optional[None].

MVP Status: SEEDED / DISCLOSED PREVIEW.
This Satellite's route returns a hardcoded fixture for the demo, but:
  (a) it routes through this proper Pydantic model — not a raw dict.
  (b) it queries the same shared citizens/documents/cross_verification_results
      tables — no separate mock dataset.
  (c) the UI carries an explicit, unavoidable seeded-preview banner.

Fields:
  - citizen_id                  : identity reference
  - citizen_name                : display name
  - outstanding_challans_count  : number of unpaid/pending challans
  - court_summons_pending       : is there a pending court summons?
  - summons_details             : list of summons detail, if any

Explicitly absent (enforced by omission):
  - dl_status / vehicle_match   — Traffic Satellite only
  - kyc_status                  — Banking Satellite only (Phase B)
  - ANY financial / PAN / Aadhaar field
"""

from __future__ import annotations

from typing import List, Optional
from pydantic import BaseModel, Field


class SummonsDetail(BaseModel):
    """A single pending court summons entry."""
    summons_id: str = Field(description="Reference number for the summons.")
    description: str = Field(description="Brief plain-language description of the matter.")
    issued_date: str = Field(description="Date summons was issued (ISO 8601).")


class LegalCheckResponse(BaseModel):
    """
    Legal Satellite — Checkpoint response.

    Scoped to: outstanding challan count + court summons status.
    This is a SEEDED PREVIEW for MVP — no live challan DB integration.
    The UI must carry the seeded-preview banner; this model does not
    embed that disclaimer (it belongs in the UI layer, not the API type).

    Structural guarantee: this model CANNOT carry DL/vehicle or banking fields.
    """

    # ── Identity anchor ─────────────────────────────────────────────────
    citizen_id: str = Field(description="Opaque citizen identifier.")
    citizen_name: str = Field(description="Full name — for officer confirmation.")

    # ── Legal Satellite scope ────────────────────────────────────────────
    outstanding_challans_count: int = Field(
        description="Number of unpaid / open challans on record for this citizen."
    )
    court_summons_pending: bool = Field(
        description="True if any court summons is currently pending."
    )
    summons_details: Optional[List[SummonsDetail]] = Field(
        default=None,
        description=(
            "Present only when court_summons_pending is True. "
            "List of pending summons with plain-language descriptions."
        ),
    )

    # ── INTENTIONALLY ABSENT (structural enforcement) ───────────────────
    # dl_status / vehicle_match         — Traffic Satellite only
    # kyc_status / account_flags        — Banking Satellite only (Phase B)
    # aadhaar_number / pan_number       — Not part of legal enforcement scope
    # address / financial balance data  — Not part of legal enforcement scope

    model_config = {
        "json_schema_extra": {
            "example": {
                "citizen_id": "33333333-0000-0000-0000-000000000003",
                "citizen_name": "Amit Patel",
                "outstanding_challans_count": 1,
                "court_summons_pending": False,
                "summons_details": None,
            }
        }
    }
