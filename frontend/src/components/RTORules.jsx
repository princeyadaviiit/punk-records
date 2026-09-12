/**
 * Punk Records — RTO Rules Component
 *
 * Displays region-specific RTO traffic rules and regulations.
 * Rules are based on the checkpoint location.
 */

export default function RTORules({ rules }) {
  if (!rules || rules.length === 0) return null

  return (
    <div className="rto-rules">
      <div className="rto-rules__header">
        <span className="rto-rules__icon">⚖️</span>
        <h3 className="rto-rules__title">Regional RTO Rules</h3>
      </div>
      <div className="rto-rules__body">
        {rules.map((rule, index) => (
          <div key={index} className="rto-rule-item">
            <div className="rto-rule-item__icon">{rule.icon}</div>
            <div className="rto-rule-item__content">
              <h4 className="rto-rule-item__title">{rule.title}</h4>
              <p className="rto-rule-item__description">{rule.description}</p>
              {rule.penalty && (
                <div className="rto-rule-item__penalty">
                  Penalty: {rule.penalty}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
