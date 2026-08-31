# Rules — Punk Records Build Guardrails

**Purpose:** hard constraints for whoever (or whatever agent) is writing code for this MVP. These are not suggestions — several encode the project's entire novelty claim. Read this file before writing any backend route.

---

## Non-negotiables

1. **Build the access-control schema pattern first.** Pydantic response models, scoped per Satellite route, before any other backend route is written. Retrofitting this later is rated a materially larger job and risks silently breaking the core privacy claim.
2. **Never return a superset object and hide fields in the frontend.** Each Satellite route's response type must be structurally incapable of containing another Satellite's fields, at the Pydantic model level. If you find yourself writing `if (userRole === 'traffic') { delete response.kyc_status }` — stop, that's the anti-pattern this project exists to avoid.
3. **One shared schema, always.** `citizens`, `documents`, `cross_verification_results` are single tables read by every Satellite route, including the faked/seeded one. Never back a Satellite with a separate mock dataset, even for a disclosed "seeded preview."
4. **No LLM in the verification/matching pipeline.** Checksum validation (PAN pattern, Aadhaar Verhoeff) + RapidFuzz fuzzy matching only. This is a deliberate, stated architectural choice, not a stopgap to replace later.
5. **Precompute the pitch-moment mismatch into seed data.** The one flagged case that matters in the demo must not depend on live recomputation succeeding under pressure.
6. **Disclose every fake/stub, in-app or in the pitch, never hide it.** OCR stub, seeded second Satellite, static Vault, slide-only Bridge — all must be explicitly labeled where a user/judge would see them ("seeded preview — live cross-Satellite sync is on the roadmap"), not silently passed off as fully live.

## Named MVP Scope Cuts (do not build these now — see `phases.md` for when)

- Real OCR pipeline on live images — module present in code, disabled, labeled.
- Citizen Vault interactivity (upload, reorder, sync, self-triggered re-verification).
- Civic Literacy Bridge as a live feature — slide/static mockup only.
- Third live Satellite / full 3-way live choreography across Traffic + Banking + Legal.
- Full 10×10×10 seed dataset — MVP uses 3–5 citizens.
- Any live government API integration (UIDAI/PAN/RTO).

If you find yourself about to build any of the above "just because it's easy while you're in there" — don't. Scope discipline is an explicit, named risk for this project; each of these cuts exists because a compressed build window can't absorb them without endangering the one thing that must work.

## Language / Framing Rules (carry into UI copy, code comments, and any pitch material)

- Never claim or imply this "reduces bribery." Use: *reduces the information asymmetry that enables informal payments.*
- Never imply the Vault or Bridge are live/interactive if they're static or slide-only in the current build. Label explicitly.
- When describing the second (faked) Satellite anywhere user-visible, use language equivalent to: *"seeded preview — live cross-Satellite sync is the next milestone."*

## Definition of Done for the MVP Core Loop

The core loop (see `PRD.md` §6) is done when all of the following are true simultaneously:

- [ ] Officer can select from 3–5 seeded citizens on `/checkpoint/traffic`.
- [ ] The API response for that route is provably narrow (inspect the OpenAPI schema — it should contain only DL/vehicle fields, nothing else, for *any* citizen selected).
- [ ] The seeded mismatch citizen renders a clear flagged UI state, not raw JSON.
- [ ] Clicking the flagged result shows a plain-language explanation sourced from `cross_verification_results.explanation`.
- [ ] The mismatch is reproducible on every run without depending on live-timing (it's precomputed in seed data).
- [ ] A second Satellite view exists, is visibly and explicitly labeled as a seeded/static preview, and reads through the same schema/tables (even if the specific query is hardcoded).

Nothing outside this checklist is required for MVP sign-off. Do not let "while I'm here" scope creep delay this checklist.
