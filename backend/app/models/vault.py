"""
Punk Records — Vault Response Model (Read-Only Citizen View)

STRUCTURAL ACCESS CONTROL — Citizen Satellite.

MVP Status: READ-ONLY STATIC VIEW of the seeded citizen's documents.
No upload, reorder, or sync affordances exist — they are intentionally
omitted, not built as disabled.

Fields shown are the citizen's own document set and any cross-verification
flags relevant to them. This is structurally a wider view than any officer
Satellite (citizen sees their own data) but still uses the same shared schema.

Phase B: full interactivity.
"""

from __future__ import annotations

from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class VaultDocSummary(BaseModel):
    """One document entry in the Vault view."""
    doc_id: str
    doc_type: Literal["DL", "RC", "PAN", "AADHAAR", "CHALLAN", "SUMMONS", "KYC_FIELD"]
    status: Literal["valid", "expired", "flagged"]
    department: str
    display_label: str = Field(description="Human-readable document label for the UI.")


class VaultFlagSummary(BaseModel):
    """A cross-verification flag surfaced to the citizen."""
    match_field: str
    explanation: str
    below_threshold: bool


class VaultViewResponse(BaseModel):
    """
    Vault Satellite — Read-only citizen view.

    The citizen sees their own document status and any flags.
    This response is scoped to the authenticated citizen's own data only —
    no other citizen's documents or cross-verification results appear.

    MVP: Static, read-only. No upload / sync actions are wired.
    """
    citizen_id: str
    name: str
    dob: str
    documents: List[VaultDocSummary]
    verification_flags: List[VaultFlagSummary]
