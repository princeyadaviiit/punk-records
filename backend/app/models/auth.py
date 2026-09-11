"""
Punk Records — Auth Models (Phase 2 Redesign)

Request/response models for citizen and officer authentication.
"""

from typing import Literal
from pydantic import BaseModel, Field


class CitizenLoginRequest(BaseModel):
    """Citizen login by document ID."""
    id_type: Literal["aadhaar", "pan", "dl"] = Field(
        description="Type of identity document used for login"
    )
    id_value: str = Field(
        description="Document number (e.g., Aadhaar 12-digit, PAN alphanumeric, DL alphanumeric)"
    )


class OfficerLoginRequest(BaseModel):
    """Officer login by badge/employee ID and password."""
    role: Literal["traffic", "banking"] = Field(
        description="Officer role (determines which Satellite checkpoint they access)"
    )
    badge_id: str = Field(
        description="Badge/Employee ID (e.g., TRF001, BNK001)"
    )
    password: str = Field(
        description="Officer password"
    )


class AuthResponse(BaseModel):
    """Successful authentication response."""
    token: str = Field(description="JWT token for authenticated session")
    user_id: str = Field(description="Citizen ID or Officer ID")
    role: str = Field(description="User role: 'citizen', 'traffic', or 'banking'")
    name: str = Field(description="Display name")


class AuthError(BaseModel):
    """Authentication error response."""
    detail: str
