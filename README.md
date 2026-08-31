# ⬡ Punk Records

> **Cross-document identity verification with purpose-scoped "Satellite" views and structural privacy boundaries.**

[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?logo=react&logoColor=black)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF.svg?logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Tests](https://img.shields.io/badge/Tests-32%20Passed-10B981.svg)]()

---

## 📖 Executive Summary

Modern public identity systems suffer from **monolithic, over-privileged queries**: when a traffic officer checks a citizen’s driving licence during a routine road stop, the underlying systems frequently expose full identity dossiers—including residential addresses, tax identifiers (PAN), family links, or banking KYC data.

This excess data exposure creates **information asymmetry**, privacy violations, and subjective ambiguity that enables informal settlements at field checkpoints.

**Punk Records** solves this with a novel **Satellite Architecture**: a single verified cross-document knowledge graph queried through **strictly typed, purpose-scoped Satellite views**. Each department receives only the exact structural fields required for their statutory duty—enforced at the API schema level, not by cosmetic frontend filtering.

---

## 🏛️ The Three Pillars of Punk Records

```
                     ┌──────────────────────────────────────────────┐
                     │          SINGLE SHARED KNOWLEDGE GRAPH       │
                     │   citizens · documents · verification_flags   │
                     └──────────────────────┬───────────────────────┘
                                            │
           ┌────────────────────────────────┼────────────────────────────────┐
           ▼                                ▼                                ▼
┌──────────────────────┐        ┌──────────────────────┐        ┌──────────────────────┐
│       PILLAR 1       │        │       PILLAR 2       │        │       PILLAR 3       │
│  Purpose-Scoped      │        │  One Graph,          │        │  Civic Literacy      │
│  Satellites          │        │  Two Directions      │        │  Bridge              │
│                      │        │                      │        │                      │
│  • Traffic Satellite │        │  • Citizen Vault     │        │  • Rule 139 CMVR     │
│  • Legal Satellite   │        │  • Audit Transparency│        │  • Sec 206(4) MV Act │
│  • Structurally      │        │  • Equal visibility  │        │  • Seizure receipt   │
│    narrow schemas    │        │    into flags        │        │    boundaries        │
└──────────────────────┘        └──────────────────────┘        └──────────────────────┘
```

### 1. Pillar 1: Purpose-Scoped Satellites (Structural Access Control)
Rather than returning a wide identity object and stripping unauthorized fields in the client, each Satellite route outputs an **isolated Pydantic response model**:
- **Traffic Satellite** (`/api/checkpoint/traffic/{id}`): Returns *only* `dl_status`, `vehicle_match`, and field-level `mismatch` findings. Structurally incapable of returning PAN, Aadhaar, court summons, or tax data.
- **Legal Satellite** (`/api/checkpoint/legal/{id}`): Returns *only* `outstanding_challans_count` and `court_summons_pending`. Structurally incapable of returning vehicle registration or driving licence fields.

### 2. Pillar 2: One Graph, Two Directions (Citizen Empowerment)
The exact same database tables read by enforcement officers are surfaced directly to the citizen via the **Citizen Vault** (`/vault`). When a mismatch (e.g. name discrepancy between DL and RC) is flagged during a checkpoint stop, the citizen sees the exact same finding in their own dossier—eliminating asymmetric leverage.

### 3. Pillar 3: Civic Literacy Bridge (Dismantling Asymmetry)
Provides cited, statutory legal protections under the **Motor Vehicles Act, 1988** and **Central Motor Vehicles Rules, 1989** (e.g. DigiLocker electronic document validity under Rule 139, mandatory licence seizure receipts under Section 206(4)).

---

## 🎯 Real-World Use Cases

| Domain | Scenario | Problem Solved |
|---|---|---|
| 🚦 **Traffic Checkpoints** | Police officer verifies a driver on a highway. | The officer sees whether the driving licence is valid and if the vehicle registration matches the driver's name. They cannot browse the driver's home address, financial status, or Aadhaar number. |
| ⚖️ **Judicial Enforcement** | Traffic authority checking outstanding legal liabilities. | Surfaces unpaid challans and active court summons without exposing vehicle technical specs or personal identity records. |
| 🔒 **Citizen Dispute Audit** | Citizen receives a citation for mismatched records. | Citizen inspects their own Vault to see the exact RapidFuzz confidence score and field comparison that triggered the flag, enabling structured correction at the RTO. |
| 🏦 **Fintech / KYC (Phase B)** | Lending institution verifying identity for a micro-loan. | Scoped Satellite verifying Aadhaar/PAN checksum validity without exposing traffic violations or vehicle ownership history. |

---

## 🔬 Deterministic, LLM-Free Verification Pipeline

Punk Records intentionally avoids generative LLMs in the critical verification loop to guarantee **100% auditability, zero hallucination, and deterministic execution**:

1. **Aadhaar Validation**: Hand-implemented **Verhoeff Checksum Algorithm** (dihedral group $D_5$ permutations) validating 12-digit Indian national identity numbers without external network dependencies.
2. **PAN Validation**: Structural regex pattern validation (`[A-Z]{5}[0-9]{4}[A-Z]{1}`) with character-class verification.
3. **Cross-Document Fuzzy Matching**: **RapidFuzz** normalized character-ratio matching with a strict **90% confidence threshold** to distinguish legitimate transcription variations from fraudulent mismatches.
4. **Precomputed Planted Mismatch**: The pitch-moment demonstration case (Ramesh Kumar DL `"Ramesh Kumar"` vs RC `"Ram Kumar"`, 85.7% ratio) is baked into the seed database, ensuring 100% demo reliability under live conditions.

---

## 🎨 Design Philosophy: "The Government File"

The user interface is grounded in the physical metaphors of Indian bureaucratic paperwork rather than generic SaaS dashboard kits:

- **Flat Color Palette (Zero Gradients)**:
  - `--paper` (`#DCD6C6`): Aged file-folder tan base sheet.
  - `--ink` (`#2B2A28`): Warm charcoal administrative typography.
  - `--tape-red` (`#9B2226`): Seal red-tape binding accents.
  - `--stamp-green` (`#3A5A40`): Verified clean rubber ink stamp.
  - `--flag-ochre` (`#C97A2B`): Mismatch alert rubber ink stamp.
  - `--carbon-slate` (`#4B5A6A`): Solid carbon-copy statutory disclosure bar.
  - `--rule-line` (`#B8AF98`): Hairline dividers on ruled ledger paper.
- **Physical Layout Signature**:
  - **File-Folder Tabs**: Overlapping physical dossier tabs along the top edge. Active tab pulls forward seamlessly with the dossier sheet.
  - **Punch-Hole Margin**: Left-hand margin with 3 ring-binder circular punch-holes.
  - **Rubber Ink Stamps**: Physics-grounded stamped-down keyframe animation (`scale(1.22) → scale(1.0)`) angled off-axis.
  - **Typography Pairing**: `Source Serif 4` for institutional gazette headings, `IBM Plex Sans` for forms/body, and `IBM Plex Mono` *strictly* for document serial numbers.

---

## 📂 Repository Structure

```
punk-records/
├── backend/
│   ├── app/
│   │   ├── db/
│   │   │   ├── client.py           # Dual-mode database client (SQLite / Postgres)
│   │   │   └── schema.sql          # Unified single shared schema DDL
│   │   ├── models/
│   │   │   ├── common.py           # Base identity schemas
│   │   │   ├── traffic.py          # TrafficCheckResponse (structurally scoped)
│   │   │   ├── legal.py            # LegalCheckResponse (structurally scoped)
│   │   │   └── vault.py            # VaultViewResponse (citizen transparency)
│   │   ├── ocr/
│   │   │   └── ocr_stub.py         # Labeled, intentionally disabled OCR stub
│   │   ├── routes/
│   │   │   ├── citizens.py         # Citizen dropdown selector endpoint
│   │   │   ├── checkpoint_traffic.py# Traffic Satellite route
│   │   │   ├── checkpoint_legal.py  # Legal Satellite route
│   │   │   └── vault.py            # Citizen Vault route
│   │   ├── seed/
│   │   │   └── seed_data.py        # Seed dataset with precomputed mismatch
│   │   ├── verification/
│   │   │   ├── checksum.py         # Verhoeff Aadhaar & PAN regex validation
│   │   │   ├── fuzzy_match.py      # RapidFuzz 90% threshold comparison
│   │   │   └── pipeline.py         # Verification orchestration
│   │   └── main.py                 # FastAPI app, lifespan auto-seeder & CORS
│   ├── tests/
│   │   ├── conftest.py             # Session-scoped test client fixture
│   │   └── test_access_control.py  # 32 unit & access-control validation tests
│   └── requirements.txt            # Locked backend dependencies
├── frontend/
│   ├── public/
│   │   └── _redirects              # SPA rewrite rule for Netlify/Render
│   ├── src/
│   │   ├── components/
│   │   │   ├── CitizenSelect.jsx   # Docket-style citizen record selector
│   │   │   ├── CleanState.jsx      # Green rubber stamp verified card
│   │   │   ├── FlaggedState.jsx    # Ochre rubber stamp mismatch foldout
│   │   │   ├── ResultPanel.jsx     # Result state dispatcher
│   │   │   ├── SeededBanner.jsx    # Solid carbon-slate preview bar
│   │   │   ├── CivicLiteracyBridge.jsx # Statutory rights & legal aid docket
│   │   │   └── Navbar.jsx          # File-folder tab navigation
│   │   ├── routes/
│   │   │   ├── CheckpointTraffic.jsx# Traffic Satellite checkpoint view
│   │   │   ├── CheckpointLegal.jsx  # Legal Satellite checkpoint view
│   │   │   └── Vault.jsx           # Citizen Vault document registry
│   │   ├── App.jsx                 # Main dossier shell & router
│   │   └── index.css               # 'The Government File' design system
│   ├── vercel.json                 # SPA client-side rewrite configuration
│   └── package.json
└── docs/                           # Architectural specifications & rules
    ├── PRD.md
    ├── TRD.md
    ├── architecture.md
    ├── rules.md
    ├── design.md
    ├── implementation.md
    └── phases.md
```

---

## ⚡ Quickstart (Run Locally)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv .venv

# Activate Virtual Environment:
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies:
pip install -r requirements.txt

# Start the server (runs on SQLite with automatic schema seeding):
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
- API Server: `http://localhost:8000`
- Interactive OpenAPI Docs: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🧪 Running the Automated Test Suite

The test suite validates structural model isolation, Verhoeff checksum correctness, RapidFuzz threshold behavior, and endpoint security:

```bash
cd backend
.\.venv\Scripts\python -m pytest tests/ -v
```

```
============================= test session starts =============================
tests/test_access_control.py::TestModelIsolation::test_traffic_fields_are_scoped PASSED
tests/test_access_control.py::TestModelIsolation::test_traffic_has_no_legal_fields PASSED
tests/test_access_control.py::TestModelIsolation::test_legal_has_no_traffic_fields PASSED
tests/test_access_control.py::TestModelIsolation::test_neither_model_has_sensitive_cross_fields PASSED
tests/test_access_control.py::TestChecksumValidation::test_valid_pan PASSED
tests/test_access_control.py::TestChecksumValidation::test_valid_aadhaar_seeded PASSED
tests/test_access_control.py::TestFuzzyMatch::test_planted_mismatch_below_threshold PASSED
tests/test_access_control.py::TestTrafficSatelliteEndpoint::test_ramesh_flagged PASSED
tests/test_access_control.py::TestTrafficSatelliteEndpoint::test_mismatch_reproducible PASSED
tests/test_access_control.py::TestLegalSatelliteEndpoint::test_amit_has_challan PASSED
tests/test_access_control.py::TestVaultEndpoint::test_vault_ramesh_has_flag PASSED
======================== 32 passed in 0.65s ========================
```

---

## 🌐 Production Cloud Deployment

### Backend (Render / Railway)
1. Link your GitHub repository `punk-records` to [Render](https://render.com).
2. Create a **Web Service**:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Database**: Runs on local SQLite with self-healing startup auto-seeding (no external database required).

### Frontend (Vercel)
1. Link your GitHub repository to [Vercel](https://vercel.com).
2. Create a **Project**:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
   - **Environment Variable**: `VITE_API_URL` = `https://your-backend-service.onrender.com`
3. SPA client-side routing is pre-configured via `vercel.json`.

---

## 🔬 Seed Dataset Walkthrough & Demo Guide

| Citizen Name | View / Tab | Outcome | What Judges/Reviewers Should Notice |
|---|---|---|---|
| **Ramesh Kumar** | **Traffic Satellite** | ⚠️ **RECORD FLAGGED** | DL name `"Ramesh Kumar"` vs RC owner name `"Ram Kumar"`. Click *View Verification Note* to see the plain-language RapidFuzz finding (85.7% match). |
| **Priya Sharma** | **Traffic Satellite** | ✅ **VERIFIED · CLEAR** | All checks pass; DL valid, vehicle registration matched. |
| **Amit Patel** | **Legal Satellite** | 📋 **1 UNPAID CHALLAN** | Demonstrates different Satellite scope reading from the exact same database. Notice that no DL or vehicle specs are leaked. |
| **Sunita Rao** | **Citizen Vault** | 🔒 **DOCUMENT REGISTRY** | Demonstrates Pillar 2 (*one graph, two directions*). Displays all 4 registered documents with issuing authorities and status mini-stamps. |
| **Any Citizen** | **Civic Literacy** | 📜 **STATUTORY RIGHTS** | Demonstrates Pillar 3. Displays cited legal rules (Rule 139 CMVR, Sec 206(4) MV Act) protecting citizens from arbitrary seizure. |

---

## 📋 MVP Scope Discipline (Phase A vs Phase B)

To guarantee 100% demo reliability, explicit scope cuts were established per `docs/rules.md`:

- **Camera OCR on live images**: Intentionally disabled (`ocr/ocr_stub.py`) to prevent camera hardware or lighting variance failures. The citizen dropdown selector acts as the disclosed OCR stand-in.
- **Citizen Vault Upload/Sync**: Maintained strictly read-only for MVP (no disabled/broken buttons; interactive syncing is Phase B).
- **Third Live Satellite**: Banking/Fintech live satellite is scheduled for Phase B.

---

## ⚖️ Language & Ethical Guardrails

- **Framing**: Punk Records does not claim to "eliminate human corruption." It **reduces the informational asymmetry** and discretionary ambiguity that enables informal settlements at field checkpoints.
- **Verification**: Zero generative AI in the decision pipeline—all validations are deterministic, transparent, and auditable.

---

## 📄 License
MIT License. Built for the Smart India Hackathon (SIH) identity verification and public service delivery track.
