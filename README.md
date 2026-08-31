# ⬡ Punk Records — MVP

> **Cross-document identity verification with purpose-scoped "Satellite" views.**

---

## 📌 Architecture & Novelty

Punk Records replaces monolithic, over-privileged identity queries with **purpose-scoped Satellite views**:
1. **Structural Privacy Boundaries**: Each Satellite route returns a strictly typed Pydantic response model (`TrafficCheckResponse`, `LegalCheckResponse`). Privacy isn't enforced by frontend filtering or stripping fields after retrieval — the API is structurally incapable of returning unauthorized fields.
2. **Single Shared Graph**: `citizens`, `documents`, and `cross_verification_results` tables are shared across all routes. No forked datasets.
3. **Deterministic Verification Pipeline**: Verhoeff checksum algorithm for Aadhaar, regex structural verification for PAN, and RapidFuzz ratio matching for cross-document field checks. No LLM in the loop.
4. **Precomputed Demo Mismatch**: Planted name mismatch (Ramesh Kumar DL vs Ram Kumar RC) is precomputed in seed data with score 85.7% (below the 90% threshold), ensuring 100% demo reproducibility.

---

## 🚀 Quickstart

### 1. Backend (FastAPI + SQLite / PostgreSQL)

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate      # Windows (or source .venv/bin/activate on Unix)
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Health & Disclosures: `http://localhost:8000/`
- OpenAPI Docs & Schema Verification: `http://localhost:8000/docs`

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173/`

---

## 🧪 Automated Access Control & Pipeline Tests

Run the full automated test suite (32 tests covering model isolation, checksum algorithms, fuzzy matching threshold, and endpoints):

```bash
cd backend
.\.venv\Scripts\python -m pytest tests/ -v
```

---

## 🔬 Seed Dataset for Demo

| Citizen | Surface | Outcome | Demonstration Value |
|---|---|---|---|
| **Ramesh Kumar** | Traffic Satellite (`/checkpoint/traffic`) | ⚠️ **Flagged Mismatch** | DL name "Ramesh Kumar" vs RC "Ram Kumar" (85.7% score). Expands into plain-language explanation. |
| **Priya Sharma** | Traffic Satellite (`/checkpoint/traffic`) | ✅ **Clean State** | All checks pass; DL valid, vehicle matched. |
| **Amit Patel** | Legal Satellite (`/checkpoint/legal`) | 📋 **1 Outstanding Challan** | Demonstrates different Satellite scope from same shared schema. |
| **Sunita Rao** | Vault (`/vault`) | 🔒 **Citizen Document View** | Demonstrates Pillar 2 (same verified graph from citizen perspective). |

---

## 📋 Disclosed MVP Scope Cuts (Phase A)

Per `docs/rules.md`:
1. **OCR Pipeline**: Intentionally disabled (`app/ocr/ocr_stub.py`) for demo stability. Citizen dropdown selector acts as the OCR scan stand-in with explicit in-app disclosure.
2. **Legal Satellite**: Disclosed seeded/static preview banner rendered visibly in UI. Full live challan integration is Phase B.
3. **Vault**: Read-only static view of citizen documents and flags. Interactive upload/sync omitted per design specs.
