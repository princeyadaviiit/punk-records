# Implementation Guide — Punk Records

**Status:** MVP build guide
**Read alongside:** `TRD.md`, `architecture.md`, `rules.md`, `phases.md`

---

## 1. Repo / Project Shape

```
punk-records/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models/            # Pydantic response models, one per Satellite
│   │   │   ├── traffic.py
│   │   │   ├── banking.py     # or legal.py — whichever is faked
│   │   │   └── common.py
│   │   ├── routes/
│   │   │   ├── checkpoint_traffic.py
│   │   │   ├── checkpoint_banking.py   # or legal
│   │   │   └── vault.py                 # if built
│   │   ├── verification/
│   │   │   ├── checksum.py    # PAN pattern, Aadhaar Verhoeff
│   │   │   ├── fuzzy_match.py # RapidFuzz wrapper
│   │   │   └── pipeline.py    # orchestrates checksum + fuzzy match → cross_verification_results
│   │   ├── ocr/
│   │   │   └── ocr_stub.py    # present, disabled, labeled
│   │   ├── db/
│   │   │   ├── schema.sql     # citizens, documents, cross_verification_results
│   │   │   └── client.py      # Supabase client
│   │   └── seed/
│   │       └── seed_data.py   # 3–5 citizens, one planted mismatch, precomputed
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── CheckpointTraffic.jsx
│   │   │   ├── CheckpointBanking.jsx   # or Legal
│   │   │   └── Vault.jsx                # if built
│   │   ├── components/
│   │   │   ├── CitizenSelect.jsx
│   │   │   ├── ResultPanel.jsx
│   │   │   ├── FlaggedState.jsx
│   │   │   └── SeededBanner.jsx
│   │   └── App.jsx
│   └── package.json
└── docs/          # this file set (PRD, TRD, architecture, rules, design, phases)
```

## 2. Build Order (do not reorder — sequencing is a locked constraint from `TRD.md` §9)

1. **DB schema first.** Create `citizens`, `documents`, `cross_verification_results` in Supabase/Postgres. Migrate/apply `schema.sql`.
2. **Seed data.** Write 3–5 citizens with structured document fields (JSON, no OCR). Plant one deterministic mismatch and precompute its `cross_verification_results` row.
3. **Verification pipeline.** Implement `checksum.py` (PAN pattern + Aadhaar Verhoeff) and `fuzzy_match.py` (RapidFuzz). Wire into `pipeline.py`. Run once against seed data to confirm the planted mismatch is correctly flagged — then treat that seed row as the source of truth for the demo (don't recompute live for the pitch-moment citizen).
4. **Pydantic response models.** `TrafficCheckResponse`, `BankingCheckResponse` (or `LegalCheckResponse`) — narrow, non-overlapping field sets. This is the load-bearing step; do not proceed to routes until these are reviewed against `rules.md` #2.
5. **Traffic Satellite route.** `GET /checkpoint/traffic/{citizen_id}` — live query against `documents`/`cross_verification_results`, shaped through `TrafficCheckResponse`.
6. **Second Satellite route (faked/seeded).** `GET /checkpoint/banking/{citizen_id}` (or legal) — can be backed by a hardcoded fixture, but must still route through the same schema tables and a proper Pydantic model, not a raw dict.
7. **Frontend checkpoint shell.** Citizen selector, result panel, flagged-state component, seeded banner component. Build Traffic view first, then reuse the shell for the second Satellite.
8. **Wire and test the core loop end-to-end.** Follow the checklist in `rules.md` "Definition of Done."
9. **Vault (optional, only if time allows).** Read-only static view — do not attempt interactivity.
10. **Record the backup screen capture** of the working Traffic flow (30–45s) as soon as step 8 passes, while it's known-good.
11. **Buffer.** Stop touching working code. Polish visuals only if the core loop is untouched and stable.

## 3. Testing Priorities (in order)

1. The planted-mismatch citizen reliably flags on every run, without timing dependency.
2. The Traffic route's response schema, inspected directly (e.g., via `/docs` OpenAPI UI in FastAPI), contains only DL/vehicle fields — confirm this explicitly, it's a claim you'll need to defend.
3. A non-mismatch (clean) citizen renders the clean state correctly — don't only test the flagged path.
4. The second Satellite route returns via its own distinct model, and the seeded banner renders on that view.

## 4. What "Done" Looks Like for MVP Hand-off

- Core loop checklist in `rules.md` fully checked.
- Backup screen recording exists and matches the live flow's script.
- Every scope cut is labeled in-app where visible.
- `docs/` folder (this file set) travels with the repo so Phase B work has the same constraints available.

## 5. Phase B Pointers (do not start until MVP core loop is signed off — see `phases.md`)

- Real OCR re-enabled and tested against image variance.
- Third Satellite built live, matching the proven access-control pattern.
- Citizen Vault interactivity.
- Civic Literacy Bridge — research (curated, cited MV Act rules) before any code.
- Full 10×10×10 seed dataset.
- 3-way live Satellite choreography, once each Satellite independently works.
