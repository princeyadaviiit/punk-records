# Phases — Punk Records

**Status:** Locked build timeline
**Source of truth:** PoC Planner Verdict

---

## Phase A — MVP Build (~24–48hrs assumed; re-tier if your actual window differs)

| Window | Work |
|---|---|
| Hr 0–4 | Access-control schema pattern first (non-negotiable, sequence before anything else). Supabase schema for `citizens`, `documents`, `cross_verification_results`. Seed 3–5 citizens by hand. |
| Hr 4–10 | Traffic Satellite route + scoped Pydantic response model. The one thing that must be real. |
| Hr 10–14 | Frontend checkpoint view — selection UI, mismatch rendering. Plain, no visual polish yet. |
| Hr 14–18 | Plant the mismatch case, verify deterministic render. Record the backup screen capture now, while it works. |
| Hr 18–22 | Second Satellite (Banking or Legal) as static/hardcoded seeded response. |
| Hr 22+ | Buffer. Stop touching working code. Screenshot/record the flow for any deck or writeup. |

**Explicitly out of Phase A:** Vault interactivity, Bridge content, third Satellite, real OCR.

## Three-Tier Scope Split (reference while executing Phase A)

### Must ship live
- Traffic Satellite checkpoint flow (the core loop, see `PRD.md` §6).
- One planted mismatch case, deterministic and pre-seeded.

### Fake convincingly, disclosed
- Second Satellite view (Banking or Legal) — static/hardcoded response, same citizen ID, same shared schema. Label: "seeded preview — live cross-Satellite sync is the next milestone."
- OCR step — dropdown citizen-select instead of image scan, disclosed as such.
- Citizen Vault, if present at all — read-only static view of one seeded citizen, no interactivity.

### Do not attempt to build in Phase A
- Full Citizen Vault interactivity (upload, reorder, sync, self-triggered re-verification).
- Civic Literacy Bridge, entirely — needs curated/cited legal research, not code; will eat the whole window if allowed near it. Represent as a static slide/mockup with 2–3 example rules.
- 3-way live Satellite choreography (all three Satellites live, same mismatch visible three ways). Two Satellites (one live, one convincingly faked) tells the same story for a fraction of the engineering time.

## Failure-Mode Mitigations (demo/presentation-moment risk, not architectural risk)

1. **Link down/slow at demo time** (cold start, venue wifi) → Have the recorded 30–45s screen capture ready as a stated backup; switch openly, never pretend it's live.
2. **Someone asks for a citizen/Satellite outside the rehearsed path** → Pre-frame the demo verbally before clicking: "one rehearsed flagged case on Traffic, plus a labeled seeded preview on Banking/Legal." Set expectation to one path + one disclosed preview.
3. **Fuzzy-match doesn't visibly trigger** (threshold tuning, data edit, live-read race condition) → The pitch-moment mismatch flag is precomputed and stored in seed data, not dependent on live recomputation.

## Presentation/Demo Script (adapt if this isn't a formal pitch)

1. "I'm going to show you the Traffic checkpoint view — this is the live build, not a slide."
2. Open the checkpoint link. Let it fully load before touching anything.
3. Select the pre-identified citizen with the planted mismatch.
4. While the result renders: "Notice what's on screen — DL status and vehicle match. That's all this view is structurally capable of returning. It's a different response type at the API level, not hidden by the UI."
5. Point at the flagged mismatch: "This is a planted name mismatch between the DL and the vehicle registration — caught automatically."
6. Switch to the second Satellite view for the same citizen (if built): "This second view is a seeded preview of the same pattern applied to a different department — full live cross-Satellite sync is the next milestone."
7. Stop. No ad-lib clicks into unbuilt paths. Redirect "show me more" to the roadmap.
8. If it breaks: "Let me show you the recorded flow instead" — switch openly, finish the same script against it.

## Phase B — Post-MVP, Ongoing (the living build, no fixed deadline)

- Full 10×10×10 seeded dataset with real cross-referenced mismatches.
- Third Satellite built live, matching the proven access-control pattern.
- Citizen Vault interactivity — upload, reorder, self-triggered re-verification.
- Civic Literacy Bridge — research (curated, cited MV Act rules) before any code.
- Real OCR pipeline re-enabled and tested against real image variance.
- 3-way live Satellite choreography, once each Satellite independently works.

**Framing to carry forward:** always state the split explicitly — "here's what's live today, here's the roadmap" — rather than implying one finished product. Anyone reviewing the project after the fact may click through everything; the split must hold up under that scrutiny.
