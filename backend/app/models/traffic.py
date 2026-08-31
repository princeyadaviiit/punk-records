"""
Punk Records — Traffic Satellite Response Model

STRUCTURAL ACCESS CONTROL — LOAD-BEARING.
This model is the Privacy Boundary for the Traffic Satellite.

Rule (rules.md #2): This response type must be structurally INCAPABLE of
containing another Satellite's fields. No KYC, no challan number, no
Aadhaar, no court summons fields may appear here, even as Optional[None].

Fields:
  - citizen_id     : identity reference (opaque, not personal data)
  - citizen_name   : display name for officer confirmation
  - dl_status      : Literal — 'valid' | 'expired' | 'flagged'
  - vehicle_match  : did DL owner name cross-match RC owner name above threshold?
  - mismatch       : present ONLY when vehicle_match is False — plain-language detail

Explicitly absent (enforced by omission, not by None defaults):
  - ANY KYC / banking field
  - ANY challan / legal / court field
  - ANY Aadhaar or PAN field
  - ANY address or financial field

The FastAPI-generated OpenAPI schema for this route is checkable — the schema
itself is the structural proof of the access-control claim.
"""

from __future__ import annotations

from typing import Literal, Optional
from pydantic import BaseModel, Field


class MismatchDetail(BaseModel):
    """
    Plain-language mismatch explanation — rendered in the UI on click.
    Never expose raw match scores or field-technical language to the officer.
    """
    match_field: str = Field(
        description="The document field that failed cross-verification (e.g. 'name')."
    )
    explanation: str = Field(
        description=(
            "Plain-language explanation of the mismatch, suitable for direct "
            "display to a field officer without technical interpretation."
        )
    )


class TrafficCheckResponse(BaseModel):
    """
    Traffic Satellite — Checkpoint response.

    Structurally scoped to DL validity and vehicle registration match only.
    This is the ENTIRE field set this route is permitted to return.
    No superset object is returned and filtered downstream.
    """

    # ── Identity anchor ─────────────────────────────────────────────────
    citizen_id: str = Field(description="Opaque citizen identifier.")
    citizen_name: str = Field(description="Full name from DL — for officer confirmation.")

    # ── Traffic Satellite scope ──────────────────────────────────────────
    dl_status: Literal["valid", "expired", "flagged"] = Field(
        description="Current status of the Driving Licence."
    )
    vehicle_match: bool = Field(
        description=(
            "True when the DL owner name cross-matches the RC owner name above "
            "the confidence threshold. False triggers a mismatch flag."
        )
    )
    mismatch: Optional[MismatchDetail] = Field(
        default=None,
        description=(
            "Present only when vehicle_match is False. "
            "Contains plain-language explanation for the field officer."
        ),
    )

    # ── INTENTIONALLY ABSENT (structural enforcement) ───────────────────
    # kyc_status          — Banking Satellite only
    # outstanding_challans_count — Legal Satellite only
    # court_summons_pending      — Legal Satellite only
    # aadhaar_number / pan_number — Not part of traffic enforcement scope
    # address / financial data    — Not part of traffic enforcement scope

    model_config = {
        "json_schema_extra": {
            "example": {
                "citizen_id": "11111111-0000-0000-0000-000000000001",
                "citizen_name": "Ramesh Kumar",
                "dl_status": "flagged",
                "vehicle_match": False,
                "mismatch": {
                    "match_field": "name",
                    "explanation": (
                        "DL name 'Ramesh Kumar' vs RC (vehicle registration) name "
                        "'Ramesh Kumaar' — similarity score 84.6%, below the 90% "
                        "confidence threshold."
                    ),
                },
            }
        }
    }
