/**
 * Punk Records — Location Banner Component
 *
 * Displays current checkpoint location for enforcement officers.
 * Shows city, state, and RTO code.
 */

export default function LocationBanner({ location }) {
  return (
    <div className="location-banner">
      <div className="location-banner__icon">📍</div>
      <div className="location-banner__content">
        <div className="location-banner__label">CHECKPOINT LOCATION</div>
        <div className="location-banner__location">
          {location.city}, {location.state}
        </div>
        <div className="location-banner__rto">RTO Code: {location.rto_code}</div>
      </div>
    </div>
  )
}
