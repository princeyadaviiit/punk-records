# Design — Punk Records

**Status:** MVP UX guidance
**Scope:** Checkpoint (Traffic + faked second Satellite), read-only Vault (if built)

---

## 1. Design Principles

1. **The narrowness is the feature — show it, don't just build it.** The UI for each Satellite should visually communicate "this is all this view can show," not just happen to only show two fields. Consider a persistent header like "Traffic Satellite — scope: DL + vehicle match only" so the constraint reads as intentional, not incomplete.
2. **No raw JSON, ever, in a user-facing view.** Every response renders as a designed card/state, even in the demo.
3. **Flagged states must be unmistakable.** A mismatch is the entire point of the demo — it needs a clear, high-contrast visual treatment (not a subtle badge easy to miss under pitch-moment nerves).
4. **Disclosed fakes look disclosed.** The seeded/second Satellite view should carry a visible, unavoidable label (banner or tag), not a footnote.

## 2. Checkpoint — Traffic Satellite (primary MVP screen)

**Layout:**
- Header: role/context label ("Traffic Satellite — Checkpoint View"), scope statement ("Shows: DL status, vehicle match. Nothing else.").
- Citizen selector: simple dropdown/list of 3–5 seeded citizens (stands in for OCR scan — label as such: "Citizen select (demo) — replaces DL scan").
- Result panel, two states:
  - **Clean state:** DL status = valid, vehicle match = ✅. Neutral, calm color treatment (e.g., green/gray).
  - **Flagged state:** clear warning color treatment (amber/red), a distinct icon, and a one-line summary ("Name mismatch detected between DL and vehicle registration").
- Click-to-expand on flagged state: plain-language explanation panel. Keep the copy short — one or two sentences, referencing the specific fields compared (e.g., "DL name 'Ramesh Kumar' vs RC name 'Ramesh Kumaar' — below match confidence threshold").

**Explicitly avoid:** confidence scores, raw match percentages, or field names a non-technical officer wouldn't parse in the field. Keep it operational, not analytical.

## 3. Checkpoint — Second Satellite (Banking or Legal, faked/seeded)

- Same visual shell as Traffic, for consistency (proves "one app, purpose-scoped views," per the architecture claim).
- Different field set, per Satellite chosen (see `TRD.md` §2).
- **Mandatory:** a visible banner, not a tooltip — e.g. "Seeded preview — live cross-Satellite sync is the next milestone." This should be impossible to miss even on a quick glance.

## 4. Vault (Citizen Surface — if built for MVP)

- Read-only. No edit/upload/reorder affordances rendered at all (don't build disabled buttons — omit them, so it doesn't read as broken).
- Shows the same seeded citizen's document set and any flagged cross-verification result, from the citizen's point of view: "Here's what would show up if an officer checked your DL" style framing, reinforcing pillar 2 (same graph, both directions).
- If cut entirely for MVP, represent it only as a slide/mockup, not a half-built route.

## 5. Bridge (Civic Literacy Layer)

- **Not a live UI for MVP.** Represent as a static mockup or slide: 2–3 example rule cards (e.g., "PUC certificate: mandatory, carry physical or digital copy"), framed as "the layer that closes the information asymmetry loop."
- If mocked as a UI screenshot for the deck, keep the visual language consistent with the Checkpoint/Vault shell so it reads as part of the same product, not a bolted-on idea.

## 6. Visual/Brand Notes

- Keep a consistent shell (nav, header treatment, color system) across Traffic, second Satellite, and Vault — the "one app, not three" claim should be visually obvious, not just technically true.
- Use color deliberately and sparingly: one clear "flagged/warning" color, one "clean/verified" color, one "seeded/disclosed" accent color for banners. Don't let all three compete.
- Typography and layout: prioritize legibility and speed-of-scan for the officer view — this is meant to look like a tool used standing at a car window, not a dashboard for leisurely review.

## 7. Copy Tone

- Officer-facing copy: operational, terse, unambiguous ("Vehicle match: No", not "Hmm, looks like there might be an issue").
- Citizen-facing copy (Vault): reassuring and plain-language, since this is meant to reduce anxiety/friction, not add bureaucratic tone.
- Any seeded/disclosed label: matter-of-fact, not apologetic. It's a scope decision, not a shortcoming.
