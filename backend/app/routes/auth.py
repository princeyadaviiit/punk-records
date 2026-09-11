"""
Punk Records — Auth Routes (Phase 2 Redesign)

POST /api/auth/citizen — Citizen login by document ID (Aadhaar/PAN/DL)
POST /api/auth/officer — Officer login by badge ID + password

Authentication Strategy:
- Citizen: Lookup by document ID from documents.fields JSONB, return JWT with citizen_id
- Officer: Validate badge_id + password against officers table, return JWT with officer_id + role

JWT Payload: { user_id: str, role: str, name: str, exp: timestamp }

MVP Disclosure: Citizen auth is a simulated identity verification (no real OTP/2FA).
This is explicitly labeled in the frontend as such, consistent with the OCR-stub
disclosure pattern already established in rules.md.
"""

import json
from datetime import datetime, timedelta
from typing import Optional

import bcrypt
import jwt
from fastapi import APIRouter, HTTPException, status

from app.db.client import get_db, fetchone, fetchall
from app.models.auth import (
    CitizenLoginRequest,
    OfficerLoginRequest,
    AuthResponse,
    AuthError,
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

# JWT configuration (use environment variable in production)
JWT_SECRET = "punk-records-mvp-secret-change-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24


def _create_token(user_id: str, role: str, name: str) -> str:
    """Create JWT token with user_id, role, and name."""
    payload = {
        "user_id": user_id,
        "role": role,
        "name": name,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _find_citizen_by_document(
    db, id_type: str, id_value: str
) -> Optional[tuple[str, str]]:
    """
    Find citizen by document ID (Aadhaar/PAN/DL number).

    Queries documents.fields JSONB for the appropriate field based on id_type.
    Returns (citizen_id, citizen_name) or None if not found.
    """
    # Map id_type to document type and field name in JSONB
    field_mapping = {
        "aadhaar": ("AADHAAR", "aadhaar_number"),
        "pan": ("PAN", "pan_number"),
        "dl": ("DL", "dl_number"),
    }

    if id_type not in field_mapping:
        return None

    doc_type, field_name = field_mapping[id_type]

    # Query documents where fields->>field_name matches id_value
    docs = fetchall(
        db,
        f"""SELECT citizen_id FROM documents
            WHERE doc_type = ? AND json_extract(fields, '$.{field_name}') = ?""",
        (doc_type, id_value),
    )

    if not docs:
        return None

    citizen_id = docs[0]["citizen_id"]

    # Get citizen name
    citizen = fetchone(
        db,
        "SELECT name FROM citizens WHERE id = ?",
        (citizen_id,),
    )

    if not citizen:
        return None

    return (citizen_id, citizen["name"])


@router.post(
    "/citizen",
    response_model=AuthResponse,
    responses={401: {"model": AuthError}},
    summary="Citizen login by document ID",
    description=(
        "**MVP Disclosure:** This is a simulated identity verification lookup. "
        "Citizens log in by selecting their ID type (Aadhaar/PAN/DL) and entering "
        "the document number. No real OTP or 2FA is implemented for MVP. "
        "The frontend labels this as 'simulated identity verification' consistent "
        "with other MVP scope cuts."
    ),
)
def citizen_login(request: CitizenLoginRequest) -> AuthResponse:
    with get_db() as db:
        result = _find_citizen_by_document(db, request.id_type, request.id_value)

        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"No citizen found with {request.id_type.upper()} number: {request.id_value}",
            )

        citizen_id, citizen_name = result
        token = _create_token(citizen_id, "citizen", citizen_name)

        return AuthResponse(
            token=token,
            user_id=citizen_id,
            role="citizen",
            name=citizen_name,
        )


@router.post(
    "/officer",
    response_model=AuthResponse,
    responses={401: {"model": AuthError}},
    summary="Officer login by badge ID and password",
    description=(
        "Officer authentication for Traffic and Banking checkpoint access. "
        "Validates badge/employee ID and password against the officers table. "
        "Returns JWT token with officer_id and role claim."
    ),
)
def officer_login(request: OfficerLoginRequest) -> AuthResponse:
    with get_db() as db:
        # Find officer by badge_id and role
        officer = fetchone(
            db,
            "SELECT id, badge_id, password_hash, role, name FROM officers WHERE badge_id = ? AND role = ?",
            (request.badge_id, request.role),
        )

        if not officer:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Invalid badge ID or role",
            )

        # Verify password
        password_valid = bcrypt.checkpw(
            request.password.encode('utf-8'),
            officer["password_hash"].encode('utf-8'),
        )

        if not password_valid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password",
            )

        token = _create_token(officer["id"], officer["role"], officer["name"])

        return AuthResponse(
            token=token,
            user_id=officer["id"],
            role=officer["role"],
            name=officer["name"],
        )
