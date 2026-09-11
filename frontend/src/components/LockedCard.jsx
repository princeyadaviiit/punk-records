/**
 * Punk Records — Locked Card Component (Phase 2 Redesign)
 *
 * Visibly locked/blurred card representing fields this Satellite cannot see.
 * Demonstrates structural access control at the UI level.
 */

export default function LockedCard({ title, hint }) {
  return (
    <div className="locked-card">
      <div className="locked-card__overlay">
        <svg className="locked-card__icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        <p className="locked-card__title">{title || 'SCOPE-LOCKED DATA'}</p>
        {hint && <p className="locked-card__hint">{hint}</p>}
      </div>
      <div className="locked-card__blur">
        <div className="locked-card__blur-line"></div>
        <div className="locked-card__blur-line"></div>
        <div className="locked-card__blur-line"></div>
      </div>
    </div>
  )
}
