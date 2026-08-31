"""
Punk Records — Common / Shared Pydantic types

Only types that appear in MORE THAN ONE Satellite response model live here.
Satellite-specific types are defined in their own modules to make field
isolation structurally obvious and reviewable.
"""

from pydantic import BaseModel


class CitizenSummary(BaseModel):
    """Minimal citizen representation used in listing endpoints."""
    id: str
    name: str
    dob: str
