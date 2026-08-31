# PRD — Punk Records

**Status:** Locked for MVP build
**Source of truth:** README (Ideation), Technical Architect Verdict, PoC Planner Verdict
**Owner:** You + build agent (Antigravity)

---

## 1. One-Line Pitch

A single verified cross-document identity graph, exposed through purpose-scoped "Satellite" views, so a traffic officer can verify a citizen's DL and vehicle in seconds — and see **nothing else about that citizen** — while the same graph also protects the citizen from being caught off guard by a mismatch or expiry.

## 2. Problem

India's identity ecosystem is fragmented and one-directional:

- **Officers in the field** (traffic police, primary use case) have no fast, reliable way to verify a document is genuine, current, and internally consistent, without trusting the citizen's word or escalating to a slow paper process.
- **Citizens** have no clear, authoritative answer to "what am I actually legally required to carry and show right now?" — the exact information gap that low-level roadside friction and informal payments exploit.

Every existing solution treats verification and citizen empowerment as separate, often adversarial, problems. Punk Records treats them as one graph with different access lenses.

## 3. Product Pillars (Novelty Claims — do not dilute these in build or pitch)

1. **Purpose-scoped access as the privacy answer to identity-linking concerns.** No Satellite ever sees more than its purpose requires. This is enforced structurally (at the API response-model level), not by UI hiding or a policy promise.
2. **One graph serves enforcement and citizen empowerment simultaneously**, not as adversarial functions.
3. **Deterministic verification** — OCR (stubbed for demo) + checksum validation + fuzzy cross-matching — chosen deliberately over an LLM-based matcher, for auditability and reliability.

Any build decision that quietly reintroduces "full object returned, fields hidden in the frontend" instead of a schema-enforced scoped response **breaks pillar 1** and must be rejected.

## 4. Users

| User | Need | Surface |
|---|---|---|
| Traffic officer (primary, demo-critical) | Verify DL + vehicle match in seconds, nothing else | Checkpoint — Traffic Satellite |
| Citizen | Know about a document mismatch/expiry before an officer does; know what's legally required to carry | Vault + Bridge |
| (Phase B) Bank / KYC officer | KYC-relevant fields only | Checkpoint — Banking Satellite |
| (Phase B) Legal/enforcement officer | Outstanding challan + court summons status only | Checkpoint — Legal Satellite |

## 5. Product Surfaces

### 5.1 The Vault (Citizen Surface)
Personal document vault. Citizen stores/syncs linked ID set; background cross-document consistency checks (checksum + fuzzy match, **not LLM**) flag mismatches/expiries to the citizen first.
- **MVP scope:** read-only static view of one seeded citizen, if built at all. No upload/reorder/sync.
- **Phase B:** full interactivity.

### 5.2 The Checkpoint (Officer Surface)
Field verification view, demonstrated via the traffic-stop use case.
- Officer selects a citizen (seeded list, MVP).
- Response is **structurally limited** to that Satellite's fields (Traffic → DL validity + vehicle match only).
- Flagged mismatches render as a clear UI state with a plain-language explanation on click — never raw JSON.
- **MVP scope:** Traffic Satellite fully live. One additional Satellite (Banking or Legal) shown as a **disclosed, seeded/static** preview of the same access pattern.

### 5.3 The Bridge (Civic Literacy Layer)
Answers "what is actually legally required here?" from the same graph — citizen side (what to carry) and officer side (protocol reference, e.g. emission/exhaust norms).
- **MVP scope:** slide-only / static mockup, 2–3 example rules. Not built as a live feature — this is a locked scope cut (see `rules.md`).
- **Phase B:** curated, cited ruleset (5–8 hand-sourced rules), not a general legal engine.

## 6. Core MVP Demo Loop (the one thing that must work)

> A judge/user picks a seeded citizen and watches the Traffic Satellite reveal a real, planted document mismatch using only DL + vehicle fields — and nothing else about that citizen.

1. Checkpoint — Traffic view opens. No login theater; officer role assumed active.
2. Officer selects a citizen from a seeded list (3–5 citizens).
3. System returns a response scoped to exactly two things: DL status and vehicle registration match. Nothing else renders, not even hidden in the DOM.
4. One seeded citizen has a planted, visible mismatch (e.g., DL name vs. RC name below fuzzy-match confidence threshold). UI shows a clear flagged state.
5. Officer clicks the flagged result → short plain-language explanation renders. Loop ends.

## 7. Explicit Non-Goals for MVP

- No live government API integration (UIDAI/PAN/RTO) — licensing unavailable to a student/indie build. This proves the mechanism, not production integration.
- No real OCR on live images — stubbed, dropdown citizen-select instead, disclosed as such.
- No full Citizen Vault interactivity.
- No live Civic Literacy Bridge.
- No 3-way live Satellite choreography (all three Satellites live simultaneously) — real engineering cost with no proportional payoff for MVP; two Satellites (one live, one convincingly faked and disclosed) tells the same story.
- No LLM-based document matching, ever — this is a deliberate architectural choice, not a stopgap.

## 8. Success Criteria for MVP

- The Traffic Satellite checkpoint flow works end-to-end, live, deterministically, for the seeded mismatch citizen.
- The access-control claim is structurally true and demonstrable: the Traffic route's response type cannot contain Banking/Legal fields, provably (e.g., by inspecting the Pydantic model / API schema, not just the rendered UI).
- A second Satellite view exists and is clearly, honestly labeled as a seeded/static preview, not a hidden gap.
- Every named scope cut (OCR, Bridge, Vault interactivity, 3rd live Satellite) is disclosed, not hidden.

## 9. Open Risks (carried forward)

1. Scope discipline — three surfaces is a lot; must ruthlessly tier what's live vs. faked vs. slide-only (see `phases.md`).
2. Bridge layer must visibly connect to the graph in any narrative, or it reads as bolted-on.
3. Any "reduces bribery" framing needs softening to "reduces the information asymmetry that enables informal payments."
4. A full 10×10×10 seed dataset is a real build-time cost, not trivial — MVP uses 3–5 citizens only.
