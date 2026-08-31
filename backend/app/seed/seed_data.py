"""
Punk Records — Seed Dataset (Phase A MVP)

4 seeded citizens:
  1. Ramesh Kumar  — PLANTED NAME MISMATCH: DL "Ramesh Kumar" vs RC "Ramesh Kumaar"
                     match_score ~84.6 (RapidFuzz ratio), below_threshold = True
                     Precomputed into cross_verification_results — demo-critical.
  2. Priya Sharma  — Clean. DL + RC names match 100%, documents valid.
  3. Amit Patel    — Clean DL + RC. Has an outstanding CHALLAN (Legal Satellite).
  4. Sunita Rao    — Clean. All documents valid. No flags.

Full 10×10×10 cross-referenced dataset is Phase B.
"""

import json
import uuid
from datetime import date

from app.db.client import get_db, execute, fetchone

# ---------------------------------------------------------------------------
# Fixed UUIDs for deterministic, reproducible seed data
# (reproducible across runs; demo-critical IDs must not shift)
# ---------------------------------------------------------------------------
CITIZEN_IDS = {
    "ramesh_kumar": "11111111-0000-0000-0000-000000000001",
    "priya_sharma":  "22222222-0000-0000-0000-000000000002",
    "amit_patel":    "33333333-0000-0000-0000-000000000003",
    "sunita_rao":    "44444444-0000-0000-0000-000000000004",
}

DOC_IDS = {
    # Ramesh Kumar documents
    "ramesh_dl":    "aaaa0001-0000-0000-0000-000000000001",
    "ramesh_rc":    "aaaa0002-0000-0000-0000-000000000002",
    "ramesh_aadhaar": "aaaa0003-0000-0000-0000-000000000003",
    # Priya Sharma documents
    "priya_dl":     "bbbb0001-0000-0000-0000-000000000001",
    "priya_rc":     "bbbb0002-0000-0000-0000-000000000002",
    # Amit Patel documents
    "amit_dl":      "cccc0001-0000-0000-0000-000000000001",
    "amit_rc":      "cccc0002-0000-0000-0000-000000000002",
    "amit_challan": "cccc0003-0000-0000-0000-000000000003",
    # Sunita Rao documents
    "sunita_dl":    "dddd0001-0000-0000-0000-000000000001",
    "sunita_rc":    "dddd0002-0000-0000-0000-000000000002",
}

CVR_IDS = {
    # The demo-critical precomputed mismatch row
    "ramesh_name_mismatch": "eeee0001-0000-0000-0000-000000000001",
}

# ---------------------------------------------------------------------------
# Citizens
# ---------------------------------------------------------------------------
CITIZENS = [
    {
        "id":     CITIZEN_IDS["ramesh_kumar"],
        "name":   "Ramesh Kumar",
        "dob":    "1985-03-14",
        "seeded": 1,
    },
    {
        "id":     CITIZEN_IDS["priya_sharma"],
        "name":   "Priya Sharma",
        "dob":    "1990-07-22",
        "seeded": 1,
    },
    {
        "id":     CITIZEN_IDS["amit_patel"],
        "name":   "Amit Patel",
        "dob":    "1978-11-05",
        "seeded": 1,
    },
    {
        "id":     CITIZEN_IDS["sunita_rao"],
        "name":   "Sunita Rao",
        "dob":    "1995-01-30",
        "seeded": 1,
    },
]

# ---------------------------------------------------------------------------
# Documents  (pre-structured JSON — OCR is stubbed for MVP)
# ---------------------------------------------------------------------------
DOCUMENTS = [
    # -----------------------------------------------------------------------
    # RAMESH KUMAR — Planted mismatch: "Kumar" vs "Kumaar" in RC name
    # -----------------------------------------------------------------------
    {
        "id":          DOC_IDS["ramesh_dl"],
        "citizen_id":  CITIZEN_IDS["ramesh_kumar"],
        "doc_type":    "DL",
        "fields": json.dumps({
            "dl_number":    "MH0120100012345",
            "name":         "Ramesh Kumar",        # canonical spelling
            "dob":          "1985-03-14",
            "issue_date":   "2015-06-01",
            "expiry_date":  "2030-06-01",
            "vehicle_class": "LMV",
        }),
        "status":     "valid",
        "department": "RTO",
    },
    {
        "id":          DOC_IDS["ramesh_rc"],
        "citizen_id":  CITIZEN_IDS["ramesh_kumar"],
        "doc_type":    "RC",
        "fields": json.dumps({
            "rc_number":      "MH01CA2021XXXX",
            "owner_name":     "Ram Kumar",         # ← abbreviated name variant — mismatch
            "vehicle_no":     "MH01CA2021",
            "make_model":     "Maruti Suzuki Swift",
            "registration_date": "2021-03-10",
            "expiry_date":    "2036-03-10",
        }),
        "status":     "flagged",
        "department": "RTO",
    },
    {
        "id":          DOC_IDS["ramesh_aadhaar"],
        "citizen_id":  CITIZEN_IDS["ramesh_kumar"],
        "doc_type":    "AADHAAR",
        "fields": json.dumps({
            "aadhaar_number": "234123412346",   # valid Verhoeff checksum
            "name":           "Ramesh Kumar",
            "dob":            "1985-03-14",
            "address":        "14 Andheri West, Mumbai, MH 400053",
        }),
        "status":     "valid",
        "department": "UIDAI",
    },
    # -----------------------------------------------------------------------
    # PRIYA SHARMA — Clean state
    # -----------------------------------------------------------------------
    {
        "id":          DOC_IDS["priya_dl"],
        "citizen_id":  CITIZEN_IDS["priya_sharma"],
        "doc_type":    "DL",
        "fields": json.dumps({
            "dl_number":    "DL0420150067890",
            "name":         "Priya Sharma",
            "dob":          "1990-07-22",
            "issue_date":   "2018-09-15",
            "expiry_date":  "2033-09-15",
            "vehicle_class": "LMV",
        }),
        "status":     "valid",
        "department": "RTO",
    },
    {
        "id":          DOC_IDS["priya_rc"],
        "citizen_id":  CITIZEN_IDS["priya_sharma"],
        "doc_type":    "RC",
        "fields": json.dumps({
            "rc_number":      "DL04CB2019YYYY",
            "owner_name":     "Priya Sharma",   # exact match
            "vehicle_no":     "DL04CB2019",
            "make_model":     "Honda City",
            "registration_date": "2019-11-20",
            "expiry_date":    "2034-11-20",
        }),
        "status":     "valid",
        "department": "RTO",
    },
    # -----------------------------------------------------------------------
    # AMIT PATEL — Clean traffic docs, outstanding challan
    # -----------------------------------------------------------------------
    {
        "id":          DOC_IDS["amit_dl"],
        "citizen_id":  CITIZEN_IDS["amit_patel"],
        "doc_type":    "DL",
        "fields": json.dumps({
            "dl_number":    "GJ0120050098765",
            "name":         "Amit Patel",
            "dob":          "1978-11-05",
            "issue_date":   "2010-02-20",
            "expiry_date":  "2028-02-20",
            "vehicle_class": "LMV",
        }),
        "status":     "valid",
        "department": "RTO",
    },
    {
        "id":          DOC_IDS["amit_rc"],
        "citizen_id":  CITIZEN_IDS["amit_patel"],
        "doc_type":    "RC",
        "fields": json.dumps({
            "rc_number":      "GJ01AB2018ZZZZ",
            "owner_name":     "Amit Patel",    # exact match
            "vehicle_no":     "GJ01AB2018",
            "make_model":     "Hyundai i20",
            "registration_date": "2018-05-17",
            "expiry_date":    "2033-05-17",
        }),
        "status":     "valid",
        "department": "RTO",
    },
    {
        "id":          DOC_IDS["amit_challan"],
        "citizen_id":  CITIZEN_IDS["amit_patel"],
        "doc_type":    "CHALLAN",
        "fields": json.dumps({
            "challan_number": "CH20231107ABCD",
            "vehicle_no":     "GJ01AB2018",
            "offence":        "Expired PUC certificate",
            "amount_due":     2000,
            "issued_date":    "2023-11-07",
            "status":         "unpaid",
        }),
        "status":     "flagged",
        "department": "Traffic Police",
    },
    # -----------------------------------------------------------------------
    # SUNITA RAO — Fully clean
    # -----------------------------------------------------------------------
    {
        "id":          DOC_IDS["sunita_dl"],
        "citizen_id":  CITIZEN_IDS["sunita_rao"],
        "doc_type":    "DL",
        "fields": json.dumps({
            "dl_number":    "KA0320200054321",
            "name":         "Sunita Rao",
            "dob":          "1995-01-30",
            "issue_date":   "2020-08-05",
            "expiry_date":  "2035-08-05",
            "vehicle_class": "LMV",
        }),
        "status":     "valid",
        "department": "RTO",
    },
    {
        "id":          DOC_IDS["sunita_rc"],
        "citizen_id":  CITIZEN_IDS["sunita_rao"],
        "doc_type":    "RC",
        "fields": json.dumps({
            "rc_number":      "KA03MJ2022WWWW",
            "owner_name":     "Sunita Rao",    # exact match
            "vehicle_no":     "KA03MJ2022",
            "make_model":     "Tata Nexon",
            "registration_date": "2022-04-12",
            "expiry_date":    "2037-04-12",
        }),
        "status":     "valid",
        "department": "RTO",
    },
]

# ---------------------------------------------------------------------------
# Cross-verification results — all precomputed.
# The demo-critical row is Ramesh Kumar's DL vs RC name mismatch.
# ---------------------------------------------------------------------------
CROSS_VERIFICATION_RESULTS = [
    {
        "id":              CVR_IDS["ramesh_name_mismatch"],
        "citizen_id":      CITIZEN_IDS["ramesh_kumar"],
        "doc_a_id":        DOC_IDS["ramesh_dl"],
        "doc_b_id":        DOC_IDS["ramesh_rc"],
        "match_field":     "name",
        # RapidFuzz ratio("Ramesh Kumar", "Ram Kumar") ≈ 85.7 — below 90 threshold
        "match_score":     85.714,
        "below_threshold": 1,   # True in SQLite int representation
        "explanation": (
            "DL name 'Ramesh Kumar' vs RC (vehicle registration) name 'Ram Kumar' — "
            "similarity score 85.7%, below the 90% confidence threshold. "
            "RC appears to use an abbreviated or informal name variant. "
            "Manual confirmation required before clearing."
        ),
    },
    {
        "id":              str(uuid.uuid4()),
        "citizen_id":      CITIZEN_IDS["priya_sharma"],
        "doc_a_id":        DOC_IDS["priya_dl"],
        "doc_b_id":        DOC_IDS["priya_rc"],
        "match_field":     "name",
        "match_score":     100.0,
        "below_threshold": 0,
        "explanation":     "DL name 'Priya Sharma' matches RC owner name exactly.",
    },
    {
        "id":              str(uuid.uuid4()),
        "citizen_id":      CITIZEN_IDS["amit_patel"],
        "doc_a_id":        DOC_IDS["amit_dl"],
        "doc_b_id":        DOC_IDS["amit_rc"],
        "match_field":     "name",
        "match_score":     100.0,
        "below_threshold": 0,
        "explanation":     "DL name 'Amit Patel' matches RC owner name exactly.",
    },
    {
        "id":              str(uuid.uuid4()),
        "citizen_id":      CITIZEN_IDS["sunita_rao"],
        "doc_a_id":        DOC_IDS["sunita_dl"],
        "doc_b_id":        DOC_IDS["sunita_rc"],
        "match_field":     "name",
        "match_score":     100.0,
        "below_threshold": 0,
        "explanation":     "DL name 'Sunita Rao' matches RC owner name exactly.",
    },
]


# ---------------------------------------------------------------------------
# Seeder entrypoint
# ---------------------------------------------------------------------------
def seed_all(db) -> None:
    """Idempotently insert all seed rows. Safe to call on every startup."""
    pg = _is_postgres(db)
    for c in CITIZENS:
        _insert_citizen(db, c, pg)

    for d in DOCUMENTS:
        _insert_document(db, d, pg)

    for cvr in CROSS_VERIFICATION_RESULTS:
        _insert_cvr(db, cvr, pg)


def _is_postgres(db) -> bool:
    """Detect postgres cursor by checking for statusmessage attribute (psycopg2 specific)."""
    return hasattr(db, "statusmessage")


def _insert_citizen(db, c: dict, pg: bool = False) -> None:
    if pg:
        db.execute(
            """INSERT INTO citizens (id, name, dob, seeded)
               VALUES (%s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""",
            (c["id"], c["name"], c["dob"], bool(c["seeded"])),
        )
    else:
        db.execute(
            "INSERT OR IGNORE INTO citizens (id, name, dob, seeded) VALUES (?, ?, ?, ?)",
            (c["id"], c["name"], c["dob"], c["seeded"]),
        )


def _insert_document(db, d: dict, pg: bool = False) -> None:
    if pg:
        db.execute(
            """INSERT INTO documents (id, citizen_id, doc_type, fields, status, department)
               VALUES (%s, %s, %s, %s::jsonb, %s, %s) ON CONFLICT (id) DO NOTHING""",
            (d["id"], d["citizen_id"], d["doc_type"], d["fields"], d["status"], d["department"]),
        )
    else:
        db.execute(
            """INSERT OR IGNORE INTO documents (id, citizen_id, doc_type, fields, status, department)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (d["id"], d["citizen_id"], d["doc_type"], d["fields"], d["status"], d["department"]),
        )


def _insert_cvr(db, cvr: dict, pg: bool = False) -> None:
    if pg:
        db.execute(
            """INSERT INTO cross_verification_results
               (id, citizen_id, doc_a_id, doc_b_id, match_field, match_score, below_threshold, explanation)
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s) ON CONFLICT (id) DO NOTHING""",
            (
                cvr["id"], cvr["citizen_id"], cvr["doc_a_id"], cvr["doc_b_id"],
                cvr["match_field"], cvr["match_score"], cvr["below_threshold"], cvr["explanation"],
            ),
        )
    else:
        db.execute(
            """INSERT OR IGNORE INTO cross_verification_results
               (id, citizen_id, doc_a_id, doc_b_id, match_field, match_score, below_threshold, explanation)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                cvr["id"], cvr["citizen_id"], cvr["doc_a_id"], cvr["doc_b_id"],
                cvr["match_field"], cvr["match_score"], cvr["below_threshold"], cvr["explanation"],
            ),
        )
