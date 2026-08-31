/**
 * CleanState — renders when dl_status is 'valid' and vehicle_match is true.
 * Neutral, calm, operationally clear.
 */
export default function CleanState({ data }) {
  return (
    <div className="clean-card" role="region" aria-label="Verification result: clear">
      <div className="clean-card__header">
        <div className="clean-card__icon">✅</div>
        <div>
          <div className="clean-card__name">{data.citizen_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ok-400)', fontWeight: 600 }}>
            All checks passed
          </div>
        </div>
      </div>

      <div className="clean-card__status-row">
        <div className="status-pill status-pill--ok">
          <span className="status-pill__indicator">🪪</span>
          <div>
            <div className="status-pill__label">DL Status</div>
            <div className="status-pill__value">
              {data.dl_status.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="status-pill status-pill--ok">
          <span className="status-pill__indicator">🚗</span>
          <div>
            <div className="status-pill__label">Vehicle Match</div>
            <div className="status-pill__value">Confirmed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
