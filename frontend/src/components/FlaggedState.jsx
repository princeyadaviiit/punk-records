import { useState } from 'react'

/**
 * FlaggedState — the demo-critical component.
 *
 * Per design.md §3: "A mismatch is the entire point of the demo — it needs
 * a clear, high-contrast visual treatment (not a subtle badge easy to miss
 * under pitch-moment nerves)."
 *
 * Click-to-expand reveals the plain-language explanation from
 * cross_verification_results.explanation.
 *
 * NEVER renders raw JSON. The explanation is a pre-formatted string from the DB.
 */
export default function FlaggedState({ data }) {
  const [expanded, setExpanded] = useState(false)
  const mismatch = data.mismatch

  return (
    <div className="flagged-card" role="region" aria-label="Verification result: mismatch flagged">
      {/* ── Header — always visible ───────────────────────── */}
      <div className="flagged-card__header">
        <div className="flagged-card__icon">⚠️</div>
        <div className="flagged-card__title">
          <div className="flagged-card__name">{data.citizen_name}</div>
          <div className="flagged-card__summary">
            Name mismatch detected between DL and vehicle registration
          </div>
        </div>
        <button
          className="flagged-card__expand-btn"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-controls="mismatch-explanation"
          id="expand-mismatch-btn"
        >
          {expanded ? 'Close ▲' : 'Details ▼'}
        </button>
      </div>

      {/* ── Body ─────────────────────────────────────────── */}
      <div className="flagged-card__body">
        <div className="flagged-card__status-row">
          <div className="status-pill status-pill--flagged">
            <span>🪪</span>
            <div>
              <div className="status-pill__label">DL Status</div>
              <div className="status-pill__value">
                {data.dl_status.toUpperCase()}
              </div>
            </div>
          </div>
          <div className="status-pill status-pill--mismatch">
            <span>🚗</span>
            <div>
              <div className="status-pill__label">Vehicle Match</div>
              <div className="status-pill__value">No</div>
            </div>
          </div>
        </div>

        {/* ── Expandable explanation from cross_verification_results ── */}
        {expanded && mismatch && (
          <div
            className="flagged-card__explanation"
            id="mismatch-explanation"
            role="alert"
          >
            <strong>Mismatch — {mismatch.match_field} field:</strong>{' '}
            {mismatch.explanation}
          </div>
        )}
      </div>
    </div>
  )
}
