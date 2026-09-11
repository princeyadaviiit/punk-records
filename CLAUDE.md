# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Punk Records** is a cross-document identity verification system built for the Smart India Hackathon (SIH). The core innovation is a **Satellite Architecture**: a single shared knowledge graph queried through structurally scoped, purpose-limited API views that enforce access control at the schema level, not through frontend filtering.

**Stack**: FastAPI (Python 3.11+) + React 19 + Vite, SQLite/Postgres dual-mode database.

---

## Essential Commands

### Backend (FastAPI)
```bash
cd backend

# Activate virtual environment
.\.venv\Scripts\Activate.ps1   # Windows PowerShell
source .venv/bin/activate        # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Start development server (auto-seeds database on startup)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Run test suite (32 tests validating structural isolation + verification)
.\.venv\Scripts\python -m pytest tests/ -v
```

### Frontend (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**API Docs**: `http://localhost:8000/docs` (interactive OpenAPI schema - inspect this to verify structural access control)

---

## Core Architectural Principle: Structural Access Control

**THE CRITICAL RULE**: Access control is enforced at the **Pydantic response model level**, NOT by filtering fields in the frontend or database query.

### How Satellites Work

Each Satellite route returns a **structurally scoped Pydantic model** that is physically incapable of containing another Satellite's fields:

- **Traffic Satellite** (`backend/app/models/traffic.py` → `TrafficCheckResponse`):
  - Returns ONLY: `dl_status`, `vehicle_match`, field-level `mismatch` findings
  - Structurally cannot return PAN, Aadhaar, court summons, or financial data

- **Legal Satellite** (`backend/app/models/legal.py` → `LegalCheckResponse`):
  - Returns ONLY: `outstanding_challans_count`, `court_summons_pending`
  - Structurally cannot return vehicle registration or driving licence fields

- **Citizen Vault** (`backend/app/models/vault.py` → `VaultViewResponse`):
  - Returns the full document registry - demonstrates "one graph, two directions"
  - Citizens see the exact same verification flags that enforcement sees

### When Adding New Routes or Satellites

1. **Define the Pydantic response model FIRST** in `backend/app/models/` - this is the access control boundary
2. **Never return a superset object and hide fields in the frontend** - if you find yourself writing `if (userRole === 'traffic') { delete response.kyc_status }`, stop immediately. That violates the entire architectural claim.
3. **Read from the shared schema** (`citizens`, `documents`, `cross_verification_results` tables) - never create separate mock datasets per Satellite
4. **Inspect the OpenAPI schema** at `/docs` to verify the response model contains only the intended fields

---

## Database Architecture

### Dual-Mode Client (`backend/app/db/client.py`)

The database client automatically selects SQLite (local development) or Postgres (production via `DATABASE_URL` env var). **No configuration required** - it's auto-detecting.

### Auto-Seeding on Startup

The FastAPI `lifespan` context manager (`backend/app/main.py`) runs `seed_all()` on every startup. This is **idempotent** and safe - seed data uses `INSERT OR IGNORE` / `ON CONFLICT DO NOTHING`.

**Precomputed Demo Mismatch**: The critical demo case (Ramesh Kumar: DL name vs RC owner name mismatch at 85.7% RapidFuzz score) is **precomputed into seed data** (`backend/app/seed/seed_data.py`). The demo does NOT depend on live fuzzy-match recomputation succeeding under pressure.

### Schema Location

Single shared schema DDL: `backend/app/db/schema.sql`

---

## Verification Pipeline Architecture

**Location**: `backend/app/verification/`

The verification pipeline is **intentionally LLM-free** to guarantee deterministic, auditable results:

1. **Checksum Validation** (`checksum.py`):
   - **PAN**: Regex pattern validation `[A-Z]{5}[0-9]{4}[A-Z]{1}`
   - **Aadhaar**: Hand-implemented Verhoeff checksum algorithm (dihedral group D₅ permutations)

2. **Cross-Document Fuzzy Matching** (`fuzzy_match.py`):
   - Uses **RapidFuzz** with a strict **90% threshold**
   - Compares fields across documents (e.g., DL name vs RC owner_name)
   - Below-threshold matches are flagged as mismatches

3. **Pipeline Orchestration** (`pipeline.py`):
   - `run_pipeline_for_citizen(db, citizen_id)` orchestrates the full flow
   - Results written to `cross_verification_results` table
   - For seeded citizens, results are already present; pipeline uses `INSERT OR IGNORE`

**Do not introduce LLMs into this pipeline** - it's a stated architectural constraint, not a temporary limitation.

---

## MVP Scope Discipline & Phase Boundaries

**Current Status**: Phase A (MVP) - see `docs/phases.md` and `docs/rules.md`

### Explicitly Disabled/Stubbed in MVP

1. **OCR Pipeline** (`backend/app/ocr/ocr_stub.py`): Intentionally disabled and labeled. The citizen dropdown selector acts as the OCR stand-in.
2. **Legal Satellite**: Seeded/static preview only (not live challan database integration)
3. **Citizen Vault**: Read-only static view (no upload, sync, or re-verification triggers)
4. **Civic Literacy Bridge**: Slide/mockup component only, not a live backend route

### When Building New Features

- **Check `docs/rules.md` first** for non-negotiables and scope cuts
- **Do not build Phase B features "while you're in there"** - scope discipline is an explicit risk mitigation
- **Disclose all stubs/fakes in-app** - never silently pass off static/seeded data as fully live

---

## Design System: "The Government File"

**Location**: `frontend/src/index.css`

The UI is grounded in physical metaphors of Indian bureaucratic paperwork, not generic SaaS aesthetics.

### Color Palette (Flat, Zero Gradients)
- `--paper` (`#DCD6C6`): Aged file-folder tan base
- `--ink` (`#2B2A28`): Warm charcoal typography
- `--tape-red` (`#9B2226`): Seal red-tape accents
- `--stamp-green` (`#3A5A40`): Verified "clean" rubber stamp
- `--flag-ochre` (`#C97A2B`): Mismatch alert rubber stamp
- `--carbon-slate` (`#4B5A6A`): Statutory disclosure bar
- `--rule-line` (`#B8AF98`): Hairline dividers

### Physical Layout Signatures
- **File-Folder Tabs**: Overlapping dossier tabs at top edge (see `Navbar.jsx`)
- **Punch-Hole Margin**: Left-hand 3-ring binder holes
- **Rubber Ink Stamps**: `scale(1.22) → scale(1.0)` keyframe animation, angled off-axis
- **Typography**:
  - `Source Serif 4` for institutional gazette headings
  - `IBM Plex Sans` for forms/body
  - `IBM Plex Mono` **strictly** for document serial numbers

**When styling new components**: Match the file-folder physicality metaphor. No gradients, no SaaS gloss. Think aged government dossier, not startup dashboard.

---

## Testing Strategy

**Location**: `backend/tests/`

The test suite (`test_access_control.py`) validates:
1. **Structural Model Isolation**: Traffic models have no legal fields, legal models have no traffic fields
2. **Checksum Correctness**: PAN pattern and Aadhaar Verhoeff validation
3. **RapidFuzz Threshold Behavior**: Planted mismatch stays below 90% threshold
4. **Endpoint Security**: Satellite routes return only scoped fields

**Run tests before committing route changes** - these tests are the proof that access control claims are real.

---

## Language & Framing Rules

When writing UI copy, code comments, or documentation:

- **Never claim this "reduces bribery"** - use: *"reduces the information asymmetry that enables informal settlements"*
- **Disclose stubs/fakes explicitly** where user-visible - e.g., *"seeded preview — live cross-Satellite sync is on the roadmap"*
- **Frame carefully** - this system doesn't eliminate human corruption; it dismantles the structural preconditions that make informal checkpoint negotiations possible

---

## Key Files to Read Before Major Changes

- **`docs/rules.md`**: Hard constraints & non-negotiables - read BEFORE writing any backend route
- **`docs/architecture.md`**: Full Satellite pattern explanation
- **`backend/app/db/schema.sql`**: Single shared schema (all Satellites read from this)
- **`backend/app/main.py`**: Router registration order & startup seeding logic
- **`backend/tests/test_access_control.py`**: Structural access control proofs

---

## Common Pitfalls to Avoid

1. **Returning wide objects and hiding fields in the frontend** - violates the core architectural claim
2. **Creating separate mock datasets per Satellite** - breaks "one shared schema" principle
3. **Introducing LLMs into the verification pipeline** - contradicts the deterministic architecture claim
4. **Building Phase B features during MVP** - scope creep is an explicit named risk
5. **Not disclosing stubs/fakes in-app** - undermines demo transparency and trust
