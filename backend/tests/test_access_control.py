"""
Punk Records — Access Control & Verification Tests

Verifies the rules.md Definition of Done checklist:

1. Structural isolation of Pydantic response models (non-overlapping field sets).
2. Verhoeff checksum algorithm correctness.
3. PAN format validation.
4. RapidFuzz threshold flagging logic.
5. API endpoint correctness via FastAPI TestClient.
6. Demo-critical: Ramesh Kumar mismatch is reproducible on every run.

Run with: python -m pytest tests/ -v  (from backend/ directory)
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.models.traffic import TrafficCheckResponse
from app.models.legal import LegalCheckResponse
from app.seed.seed_data import CITIZEN_IDS
from app.verification.checksum import validate_pan_format, validate_aadhaar
from app.verification.fuzzy_match import compute_match_score, MATCH_THRESHOLD, is_below_threshold

RAMESH_ID = CITIZEN_IDS["ramesh_kumar"]
PRIYA_ID  = CITIZEN_IDS["priya_sharma"]
AMIT_ID   = CITIZEN_IDS["amit_patel"]


# ===========================================================================
# 1. Structural isolation — model fields must not overlap
# ===========================================================================
class TestModelIsolation:
    """
    rules.md #2: Each Satellite route's response type must be structurally
    incapable of containing another Satellite's fields.
    """

    def test_traffic_fields_are_scoped(self):
        traffic_fields = set(TrafficCheckResponse.model_fields.keys())
        legal_fields   = set(LegalCheckResponse.model_fields.keys())
        traffic_specific = traffic_fields - {'citizen_id', 'citizen_name'}
        legal_specific   = legal_fields   - {'citizen_id', 'citizen_name'}
        overlap = traffic_specific & legal_specific
        assert not overlap, (
            f"Traffic and Legal response models share non-identity fields: {overlap}. "
            "This violates the structural access-control claim (rules.md #2)."
        )

    def test_traffic_has_no_legal_fields(self):
        traffic_fields = set(TrafficCheckResponse.model_fields.keys())
        assert 'outstanding_challans_count' not in traffic_fields
        assert 'court_summons_pending'      not in traffic_fields
        assert 'summons_details'            not in traffic_fields

    def test_legal_has_no_traffic_fields(self):
        legal_fields = set(LegalCheckResponse.model_fields.keys())
        assert 'dl_status'      not in legal_fields
        assert 'vehicle_match'  not in legal_fields
        assert 'mismatch'       not in legal_fields

    def test_neither_model_has_sensitive_cross_fields(self):
        for model in (TrafficCheckResponse, LegalCheckResponse):
            fields = set(model.model_fields.keys())
            assert 'aadhaar_number' not in fields
            assert 'pan_number'     not in fields
            assert 'kyc_status'     not in fields


# ===========================================================================
# 2. Checksum Validation
# ===========================================================================
class TestChecksumValidation:
    def test_valid_pan(self):
        valid, _ = validate_pan_format("ABCDE1234F")
        assert valid is True

    def test_invalid_pan_lowercase_is_normalised(self):
        # Function uppercases, so lowercase valid PAN should pass
        valid, _ = validate_pan_format("abcde1234f")
        assert valid is True

    def test_invalid_pan_wrong_length(self):
        valid, _ = validate_pan_format("ABCD1234F")
        assert valid is False

    def test_invalid_pan_wrong_pattern(self):
        valid, _ = validate_pan_format("1BCDE1234F")
        assert valid is False

    def test_empty_pan(self):
        valid, _ = validate_pan_format("")
        assert valid is False

    def test_valid_aadhaar_seeded(self):
        """The seeded Aadhaar number must pass Verhoeff validation."""
        # 234123412346 — computed valid Verhoeff checksum
        valid, reason = validate_aadhaar("234123412346")
        assert valid is True, f"Seeded Aadhaar failed: {reason}"

    def test_invalid_aadhaar_too_short(self):
        valid, _ = validate_aadhaar("12345678901")  # 11 digits
        assert valid is False

    def test_invalid_aadhaar_starts_with_0(self):
        valid, _ = validate_aadhaar("012345678905")
        assert valid is False

    def test_invalid_aadhaar_starts_with_1(self):
        valid, _ = validate_aadhaar("123456789056")
        assert valid is False

    def test_invalid_aadhaar_wrong_checksum(self):
        valid, _ = validate_aadhaar("234123412347")  # last digit off
        assert valid is False


# ===========================================================================
# 3. Fuzzy match threshold logic
# ===========================================================================
class TestFuzzyMatch:
    def test_exact_match_score_100(self):
        score = compute_match_score("Priya Sharma", "Priya Sharma")
        assert score == 100.0

    def test_planted_mismatch_below_threshold(self):
        """
        Ramesh Kumar vs Ram Kumar (abbreviated RC name) must be below threshold.
        This is the core demo-critical claim — if this fails, the mismatch won't flag.
        """
        score = compute_match_score("Ramesh Kumar", "Ram Kumar")
        assert is_below_threshold(score), (
            f"Score {score:.1f}% should be below threshold {MATCH_THRESHOLD}%. "
            "This is the planted mismatch — if it passes, the demo-moment is broken."
        )

    def test_exact_match_above_threshold(self):
        score = compute_match_score("Amit Patel", "Amit Patel")
        assert not is_below_threshold(score)

    def test_threshold_boundary(self):
        assert is_below_threshold(MATCH_THRESHOLD - 0.01)
        assert not is_below_threshold(MATCH_THRESHOLD)


# ===========================================================================
# 4. API endpoint tests — use http_client fixture from conftest.py
#    The fixture uses `with TestClient(app)` to trigger lifespan seeding.
# ===========================================================================
class TestCitizenListEndpoint:
    def test_citizens_list_returns_seeded(self, http_client):
        r = http_client.get("/api/citizens")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 4
        names = {c["name"] for c in data}
        assert "Ramesh Kumar" in names
        assert "Priya Sharma" in names

    def test_citizens_list_fields_minimal(self, http_client):
        """Citizens list must not expose document or sensitive fields."""
        r = http_client.get("/api/citizens")
        for citizen in r.json():
            assert set(citizen.keys()) == {"id", "name", "dob"}


class TestTrafficSatelliteEndpoint:
    def test_ramesh_flagged(self, http_client):
        """Demo-critical: Ramesh Kumar must return a flagged mismatch."""
        r = http_client.get(f"/api/checkpoint/traffic/{RAMESH_ID}")
        assert r.status_code == 200
        data = r.json()
        assert data["vehicle_match"] is False, "Ramesh Kumar should have vehicle_match=False"
        assert data["dl_status"] == "flagged"
        assert data["mismatch"] is not None
        assert "Ram Kumar" in data["mismatch"]["explanation"]

    def test_priya_clean(self, http_client):
        """Non-mismatch citizen must return clean state."""
        r = http_client.get(f"/api/checkpoint/traffic/{PRIYA_ID}")
        assert r.status_code == 200
        data = r.json()
        assert data["vehicle_match"] is True
        assert data["dl_status"] == "valid"
        assert data["mismatch"] is None

    def test_traffic_response_schema_has_no_legal_fields(self, http_client):
        """Structural: response JSON must not contain Legal Satellite fields."""
        r = http_client.get(f"/api/checkpoint/traffic/{RAMESH_ID}")
        data = r.json()
        assert "outstanding_challans_count" not in data
        assert "court_summons_pending"      not in data
        assert "summons_details"            not in data

    def test_not_found(self, http_client):
        r = http_client.get("/api/checkpoint/traffic/00000000-0000-0000-0000-999999999999")
        assert r.status_code == 404

    def test_mismatch_reproducible(self, http_client):
        """Mismatch must be reproducible on every run — precomputed seed."""
        for _ in range(3):
            r = http_client.get(f"/api/checkpoint/traffic/{RAMESH_ID}")
            assert r.json()["vehicle_match"] is False


class TestLegalSatelliteEndpoint:
    def test_amit_has_challan(self, http_client):
        r = http_client.get(f"/api/checkpoint/legal/{AMIT_ID}")
        assert r.status_code == 200
        data = r.json()
        assert data["outstanding_challans_count"] >= 1

    def test_legal_response_has_no_traffic_fields(self, http_client):
        """Structural: response JSON must not contain Traffic Satellite fields."""
        r = http_client.get(f"/api/checkpoint/legal/{RAMESH_ID}")
        data = r.json()
        assert "dl_status"     not in data
        assert "vehicle_match" not in data
        assert "mismatch"      not in data

    def test_legal_response_model_distinct(self, http_client):
        """Response must use LegalCheckResponse fields, not TrafficCheckResponse."""
        r = http_client.get(f"/api/checkpoint/legal/{RAMESH_ID}")
        data = r.json()
        assert "outstanding_challans_count" in data
        assert "court_summons_pending"      in data

    def test_priya_no_challan(self, http_client):
        r = http_client.get(f"/api/checkpoint/legal/{PRIYA_ID}")
        assert r.status_code == 200
        data = r.json()
        assert data["outstanding_challans_count"] == 0
        assert data["court_summons_pending"] is False


class TestVaultEndpoint:
    def test_vault_returns_documents(self, http_client):
        r = http_client.get(f"/api/vault/{RAMESH_ID}")
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "Ramesh Kumar"
        assert len(data["documents"]) > 0

    def test_vault_ramesh_has_flag(self, http_client):
        """Ramesh's flag must appear in Vault — same shared graph as Traffic Satellite."""
        r = http_client.get(f"/api/vault/{RAMESH_ID}")
        flags = r.json()["verification_flags"]
        assert len(flags) > 0
        assert any("Ram Kumar" in f["explanation"] for f in flags)

    def test_vault_priya_no_flags(self, http_client):
        r = http_client.get(f"/api/vault/{PRIYA_ID}")
        assert r.json()["verification_flags"] == []
