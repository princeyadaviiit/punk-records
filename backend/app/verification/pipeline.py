"""
Punk Records — Verification Pipeline

Orchestrates checksum validation + fuzzy cross-match for a given citizen,
and writes results to cross_verification_results.

Pipeline flow:
  1. Load citizen's documents from the shared schema.
  2. Per-document checksum validation (PAN pattern / Aadhaar Verhoeff).
  3. Cross-document fuzzy field match (DL ↔ RC name, etc.) via RapidFuzz.
  4. Threshold flagging → upsert cross_verification_results rows.

For the pitch-moment (demo-critical) mismatch citizen (Ramesh Kumar),
the cross_verification_results row is ALREADY seeded with below_threshold = True.
This pipeline can confirm it, but the Satellite routes read the precomputed
seed row as the source of truth — not a live recomputation outcome.
"""

import json
import uuid
from typing import Any

from app.db.client import fetchall, execute
from app.verification.checksum import validate_pan_format, validate_aadhaar
from app.verification.fuzzy_match import compare_field

# Cross-document field comparisons we check when both docs are present
_CROSS_DOC_CHECKS = [
    # (doc_type_a, doc_type_b, field_in_a,   field_in_b,  logical_field_name)
    ("DL", "RC",     "name",       "owner_name", "name"),
]


def run_pipeline_for_citizen(db: Any, citizen_id: str) -> list[dict]:
    """
    Run the full verification pipeline for a citizen.
    Returns a list of result dicts matching cross_verification_results schema.

    NOTE: For the demo-critical citizen (Ramesh Kumar), the result is already
    in seed data. This pipeline may produce duplicate attempts which are
    silently ignored by INSERT OR IGNORE / ON CONFLICT DO NOTHING.
    """
    # Load documents
    docs = fetchall(
        db,
        "SELECT id, doc_type, fields, status FROM documents WHERE citizen_id = ?",
        (citizen_id,),
    )

    # Parse JSONB fields
    parsed_docs: dict[str, list[dict]] = {}
    for doc in docs:
        dtype = doc["doc_type"]
        fields = json.loads(doc["fields"]) if isinstance(doc["fields"], str) else doc["fields"]
        entry = {"id": doc["id"], "fields": fields, "status": doc["status"]}
        parsed_docs.setdefault(dtype, []).append(entry)

    # 1. Checksum validation (updates document status flags if invalid)
    _run_checksum_validation(db, parsed_docs)

    # 2. Cross-document fuzzy matching
    results = []
    for (type_a, type_b, field_a, field_b, logical_field) in _CROSS_DOC_CHECKS:
        docs_a = parsed_docs.get(type_a, [])
        docs_b = parsed_docs.get(type_b, [])
        if not docs_a or not docs_b:
            continue
        doc_a = docs_a[0]
        doc_b = docs_b[0]
        val_a = doc_a["fields"].get(field_a, "")
        val_b = doc_b["fields"].get(field_b, "")
        if not val_a or not val_b:
            continue

        score, below, explanation = compare_field(val_a, val_b, logical_field)

        result = {
            "id":              str(uuid.uuid4()),
            "citizen_id":      citizen_id,
            "doc_a_id":        doc_a["id"],
            "doc_b_id":        doc_b["id"],
            "match_field":     logical_field,
            "match_score":     score,
            "below_threshold": 1 if below else 0,
            "explanation":     explanation,
        }
        results.append(result)

        # Upsert — seed rows are already present for the demo-critical citizen;
        # INSERT OR IGNORE silently skips conflicts.
        execute(
            db,
            """INSERT OR IGNORE INTO cross_verification_results
               (id, citizen_id, doc_a_id, doc_b_id, match_field, match_score,
                below_threshold, explanation)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                result["id"], result["citizen_id"], result["doc_a_id"], result["doc_b_id"],
                result["match_field"], result["match_score"],
                result["below_threshold"], result["explanation"],
            ),
        )

    return results


def _run_checksum_validation(db: Any, parsed_docs: dict) -> None:
    """
    Run per-document checksum validation and flag documents that fail.
    Updates in-memory parsed_docs dict; does NOT write to DB for MVP
    (seed data already has correct status values).
    """
    for doc in parsed_docs.get("PAN", []):
        pan_num = doc["fields"].get("pan_number", "")
        if pan_num:
            is_valid, _ = validate_pan_format(pan_num)
            if not is_valid:
                doc["status"] = "flagged"

    for doc in parsed_docs.get("AADHAAR", []):
        aadhaar_num = doc["fields"].get("aadhaar_number", "")
        if aadhaar_num:
            is_valid, _ = validate_aadhaar(aadhaar_num)
            if not is_valid:
                doc["status"] = "flagged"
