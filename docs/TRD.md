# TRD — Punk Records

**Status:** Locked for MVP build
**Source of truth:** Technical Architect Verdict, PoC Planner Verdict
**Read alongside:** `architecture.md`, `rules.md`

---

## 1. Locked Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + Vite, single codebase, role-gated routes (`/vault`, `/checkpoint/traffic`, `/checkpoint/banking`, `/checkpoint/legal`) | One app, not three — proves "one graph, purpose-scoped views" live, not as a slide claim |
| Backend | FastAPI (Python) | Fast to stand up; native fit for OCR/fuzzy-match libraries, no cross-language glue |
| Access control | Pydantic response models, scoped per route | **Structural** enforcement, not policy enforcement — the load-bearing technical claim of the whole project |
| Database | Postgres via Supabase | One shared schema for `citizens`, `documents`, `cross_verification_results` |
| OCR | Tesseract (`pytesseract`) — **stubbed for MVP**, real pipeline present in code but disabled | De-risks live-demo OCR failure; honest, named scope cut |
| Checksum validation | Hand-implemented — PAN structural pattern, Aadhaar Verhoeff algorithm | Deterministic, auditable, zero external dependency |
| Fuzzy matching | RapidFuzz | Fast, MIT-licensed, handles OCR-variance-style name/address/DOB mismatches |

**Non-negotiable:** No LLM-based document matching anywhere in the verification pipeline. This is architectural, not a shortcut.

## 2. Satellite Scope (Locked: 3, MVP builds 1 live + 1 faked)

1. **Traffic Satellite** (MVP — live) — DL validity + vehicle registration match only.
2. **Banking Satellite** (MVP — faked, disclosed) OR **Legal Satellite** (MVP — faked, disclosed) — pick whichever has less code debt for the static/hardcoded seeded response.
   - **Legal Satellite** — outstanding challan status + court summons pending only. Chosen over SEBI/Banking for cleaner narrative fit with the Civic Literacy Bridge (revisit only if a target audience explicitly wants a financial/SEBI angle).
3. **The unbuilt-live Satellite** — Phase B.

Each Satellite's API response type must be **structurally incapable** of containing another Satellite's fields — enforced at the Pydantic model level per route, never via UI hiding or post-fetch filtering.

## 3. Data Model

### `citizens`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| name | text | canonical name |
| dob | date | |
| seeded | boolean | true for demo seed data |

### `documents`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| citizen_id | uuid, FK → citizens | |
| doc_type | enum | `DL`, `RC` (vehicle registration), `PAN`, `AADHAAR`, `CHALLAN`, `KYC_FIELD`, etc. |
| fields | jsonb | structured extracted fields (name, number, dob, address, vehicle_no, etc.) — pre-structured, not OCR'd images for MVP |
| status | enum | `valid`, `expired`, `flagged` |
| department | text | which issuing department, for cross-referencing |

### `cross_verification_results`
| Field | Type | Notes |
|---|---|---|
| id | uuid, PK | |
| citizen_id | uuid, FK → citizens | |
| doc_a_id | uuid, FK → documents | |
| doc_b_id | uuid, FK → documents | |
| match_field | text | e.g. `name`, `dob`, `address` |
| match_score | float | RapidFuzz score |
| below_threshold | boolean | precomputed for the pitch-moment citizen — see §6 |
| explanation | text | plain-language reason for the flag |

**Architectural rule:** one shared `documents` + `cross_verification_results` table serves *all* Satellite routes. If a Satellite is secretly reading from a separate mock dataset, the "one shared graph" claim collapses — this is Risk #3 in the Technical Architect's red-team list and must not happen even in the faked Satellite.

## 4. API Contract Pattern

Each Satellite route returns a **distinct, narrow Pydantic response model**. Example shape (illustrative, not final code):

```
GET /api/checkpoint/traffic/{citizen_id}
→ TrafficCheckResponse {
    dl_status: Literal["valid","expired","flagged"]
    vehicle_match: bool
    mismatch: Optional[MismatchDetail]
  }

GET /api/checkpoint/banking/{citizen_id}   # or /legal
→ BankingCheckResponse {           # structurally cannot include DL/vehicle fields
    kyc_status: Literal["complete","incomplete","flagged"]
    ...
  }
```

- No endpoint returns a superset object with fields hidden by the frontend. This is checked by inspecting the FastAPI-generated OpenAPI schema — the schema itself should make the scoping claim provable.
- The faked/seeded Satellite (Banking or Legal) can be backed by a hardcoded fixture instead of a live query, but it must still return through the same narrow response model, not a raw JSON blob.

## 5. Verification Pipeline (Deterministic, Non-LLM)

1. **Ingest** — structured JSON/CSV fields per document (OCR stubbed for MVP).
2. **Checksum validation** — PAN structural pattern check; Aadhaar Verhoeff checksum.
3. **Fuzzy cross-match** — RapidFuzz compares fields across document pairs for the same citizen (e.g., DL name vs. RC name).
4. **Threshold flagging** — below-threshold match → `below_threshold = true`, `cross_verification_results` row created with plain-language `explanation`.

For the **pitch/demo-moment citizen**, the mismatch flag must be **precomputed and stored in seed data**, not dependent on live recomputation succeeding under pressure. RapidFuzz can still run live elsewhere in the system.

## 6. Seed Dataset (MVP)

- 3–5 citizens (not the full 10×10×10 target).
- One citizen has a planted, deterministic mismatch (e.g., DL name vs. RC name below fuzzy-match confidence threshold), precomputed into `cross_verification_results`.
- Documents seeded as pre-structured JSON, not rendered fake-ID images.
- Full 10×10×10 cross-referenced dataset across banking/SEBI/legal/traffic/other departments is **Phase B**.

## 7. Explicit Scope Cuts (named, disclosed — not hidden)

1. **OCR → stubbed.** Module present in code, labeled and disabled: *"OCR runs in production; disabled here for image-generation build-time cost."* Dropdown citizen-select replaces image scan in the UI.
2. **Civic Literacy Bridge → not built live.** Slide/static mockup only for MVP; curated 5–8 hand-sourced cited rules is Phase B, not a general rules engine.
3. **Third Satellite → not built live.** Two Satellites (one live, one disclosed-fake) for MVP.
4. **Citizen Vault → read-only static view at most**, no interactivity.

## 8. Top Structural Risks (Red-Team, carry into build)

| Risk | Mitigation |
|---|---|
| Bridge legal claims have no clean data source (MV Act rules scattered across sections/state rules) | Curated, cited ruleset only, Phase B; slide-only for MVP |
| Access-control claim collapses if built as "full object, fields hidden in frontend" | Pydantic response models per route, sequenced **first**, before any other backend work |
| "One shared graph" claim collapses if Satellites secretly hit separate mock datasets | One shared `documents` + `cross_verification_results` table from day one, even for the faked Satellite |
| Fuzzy-match doesn't visibly trigger live (threshold tuning, race condition) | Precompute and store the mismatch flag in seed data for the pitch-moment citizen |

## 9. Build Sequencing Constraint (non-negotiable)

The **access-control schema pattern must be built before any other route.** Technical Architect rates this "S if built first / L if retrofitted" — retrofitting scoped access control after routes exist is a materially larger job and risks silently reintroducing the full-object-hidden-in-frontend anti-pattern.
