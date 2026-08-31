# Architecture — Punk Records

**Status:** Locked for MVP build
**Read alongside:** `TRD.md`, `rules.md`

---

## 1. Metaphor (keep this language in the code comments and docs — it's the narrative spine)

- **Punk Records** — the accumulated, verified cross-document knowledge graph. The single source of truth every surface reads from.
- **The Satellites** — purpose-scoped read-lenses into that graph. Each Satellite is a *differently permissioned view*, not a different copy of the data:
  - *Traffic Satellite* → DL + vehicle registration match only
  - *Banking Satellite* → KYC-relevant fields only
  - *Legal Satellite* → outstanding challan + court summons status only
  - *Citizen Satellite (Vault)* → full personal view of one's own documents, cross-verified

No Satellite ever sees more than its purpose requires. That constraint is the product's core privacy guarantee and must be structurally true, not a policy promise.

## 2. High-Level System Diagram (text form)

```
                        ┌─────────────────────────────┐
                        │        Supabase/Postgres     │
                        │  citizens                    │
                        │  documents                   │
                        │  cross_verification_results  │
                        └──────────────┬────────────────┘
                                       │  (single shared schema)
                    ┌──────────────────┼──────────────────┐
                    │                  │                   │
            ┌───────▼──────┐   ┌───────▼──────┐   ┌────────▼───────┐
            │ FastAPI route │   │ FastAPI route │   │ FastAPI route  │
            │ /checkpoint/  │   │ /checkpoint/  │   │ /vault         │
            │ traffic       │   │ banking|legal │   │ (read-only)    │
            │               │   │ (faked/seeded)│   │                │
            │ TrafficCheck  │   │ BankingCheck  │   │ VaultView      │
            │ Response      │   │ Response      │   │ Response       │
            │ (Pydantic,    │   │ (Pydantic,    │   │ (Pydantic,     │
            │  scoped)      │   │  scoped)      │   │  scoped)       │
            └───────┬───────┘   └───────┬───────┘   └────────┬───────┘
                    │                   │                     │
                    └─────────┬─────────┴──────────┬──────────┘
                              │                    │
                     ┌────────▼────────┐  ┌────────▼─────────┐
                     │ React + Vite SPA│  │  (role-gated       │
                     │ role-gated routes│  │   client-side)     │
                     └──────────────────┘  └────────────────────┘
```

Key point the diagram must prove, not just state: **the narrowing happens at the API response-model boundary**, before anything reaches the frontend. The frontend is not the privacy boundary; it's a renderer of an already-narrow payload.

## 3. Verification Pipeline (internal to backend, feeds `cross_verification_results`)

```
documents (structured fields, JSON-seeded, OCR stubbed)
   │
   ▼
Checksum validation  (PAN pattern check / Aadhaar Verhoeff)
   │
   ▼
Fuzzy cross-match  (RapidFuzz, per field, per document pair, same citizen)
   │
   ▼
Threshold flagging → cross_verification_results row
   │                   (match_score, below_threshold, explanation)
   ▼
Satellite routes read from cross_verification_results,
filtered/shaped per Satellite's Pydantic response model
```

No LLM sits anywhere in this pipeline. This is a deliberate, stated architectural choice — see `PRD.md` §3, pillar 3.

## 4. Frontend Route Map

| Route | Surface | MVP Status |
|---|---|---|
| `/checkpoint/traffic` | Officer — Traffic Satellite | **Live** |
| `/checkpoint/banking` or `/checkpoint/legal` | Officer — second Satellite | **Faked, disclosed as seeded** |
| `/checkpoint/legal` (whichever wasn't picked above) | Officer — third Satellite | Not built (Phase B) |
| `/vault` | Citizen — Vault | Read-only static view, or omitted entirely for MVP |
| Bridge (civic literacy) | N/A — not a live route for MVP | Slide/static mockup only |

Role-gating is client-side navigation only for MVP (no auth theater); the real privacy guarantee lives in the backend response models, not in route guards. Do not let route-gating be mistaken for the security boundary in the pitch/demo narrative.

## 5. Why This Architecture Satisfies the Novelty Claims

- **Purpose-scoped access as privacy answer:** proven by inspecting the FastAPI-generated OpenAPI schema per route — each Satellite's schema is a structurally different, narrower type. This is checkable, not just assertable.
- **One graph, two functions:** enforcement (Checkpoint) and empowerment (Vault) both read the same `documents` / `cross_verification_results` tables. No forked datasets.
- **Deterministic verification:** checksum + fuzzy match only, auditable end to end — every flag traces to a specific field comparison and score, not an opaque model output.

## 6. What Would Break This Architecture (avoid these anti-patterns)

1. Returning a full/superset object from any Satellite route and hiding fields in the React component — silently reintroduces UI-only privacy, which is exactly the anti-pattern this project exists to avoid.
2. Backing the faked Satellite with a separate hardcoded dataset that isn't derived from the same `citizens`/`documents` schema — breaks the "one shared graph" claim even if disclosed as seeded.
3. Computing the demo-moment mismatch live instead of precomputing it into seed data — turns a rehearsed, reliable pitch moment into a live-recomputation risk.
4. Any use of an LLM inside the matching/flagging pipeline itself (LLMs are fine elsewhere in the product — e.g. a future citizen-facing chatbot in the Bridge — but never inside document cross-verification).
