/**
 * Punk Records — Satellite Card Component (Phase 2 Redesign)
 *
 * Dark terminal section card with status badge and data fields.
 * Used for DRIVER VERIFICATION, VEHICLE MATCH, IDENTITY LINK, etc.
 */

import StatusBadge from './StatusBadge'

export default function SatelliteCard({ title, status, statusLabel, fields, icon }) {
  return (
    <div className="satellite-card">
      <div className="satellite-card__header">
        <div className="satellite-card__title-row">
          {icon && <span className="satellite-card__icon">{icon}</span>}
          <h3 className="satellite-card__title">{title}</h3>
        </div>
        {status && (
          <StatusBadge status={status} label={statusLabel} size="medium" />
        )}
      </div>
      <div className="satellite-card__body">
        {fields && fields.map((field, index) => (
          <div key={index} className="satellite-field">
            <span className="satellite-field__label">{field.label}</span>
            <span className="satellite-field__value">{field.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
