-- ============================================================
-- Punk Records — Shared Schema
-- One schema, read by every Satellite route.
-- Architectural rule: no Satellite may have its own backing table.
-- ============================================================

-- Enum types
DO $$ BEGIN
    CREATE TYPE doc_type_enum AS ENUM (
        'DL', 'RC', 'PAN', 'AADHAAR', 'CHALLAN', 'SUMMONS', 'KYC_FIELD'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE doc_status_enum AS ENUM ('valid', 'expired', 'flagged');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- citizens
-- ============================================================
CREATE TABLE IF NOT EXISTS citizens (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    TEXT NOT NULL,
    dob     DATE NOT NULL,
    seeded  BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================
-- documents
-- Pre-structured JSON fields; OCR stubbed for MVP.
-- fields JSONB holds doc-type-specific extracted fields.
-- ============================================================
CREATE TABLE IF NOT EXISTS documents (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id  UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    doc_type    doc_type_enum NOT NULL,
    fields      JSONB NOT NULL DEFAULT '{}',
    status      doc_status_enum NOT NULL DEFAULT 'valid',
    department  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_citizen_id ON documents(citizen_id);
CREATE INDEX IF NOT EXISTS idx_documents_doc_type   ON documents(doc_type);

-- ============================================================
-- cross_verification_results
-- Populated by the verification pipeline (checksum + RapidFuzz).
-- The pitch-moment mismatch is precomputed into seed data.
-- ============================================================
CREATE TABLE IF NOT EXISTS cross_verification_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id      UUID NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    doc_a_id        UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    doc_b_id        UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    match_field     TEXT NOT NULL,
    match_score     FLOAT NOT NULL,
    below_threshold BOOLEAN NOT NULL DEFAULT FALSE,
    explanation     TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_cvr_citizen_id ON cross_verification_results(citizen_id);
