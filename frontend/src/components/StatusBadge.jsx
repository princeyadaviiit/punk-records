/**
 * Punk Records — Status Badge Component (Phase 2 Redesign)
 *
 * Reusable badge for VERIFIED / MATCHED / FLAGGED / etc. states.
 * Used across checkpoint views and vault.
 */

export default function StatusBadge({ status, label, size = 'medium' }) {
  const statusClasses = {
    verified: 'status-badge--verified',
    matched: 'status-badge--matched',
    flagged: 'status-badge--flagged',
    clean: 'status-badge--clean',
    warning: 'status-badge--warning',
  }

  const sizeClasses = {
    small: 'status-badge--small',
    medium: 'status-badge--medium',
    large: 'status-badge--large',
  }

  const statusClass = statusClasses[status] || 'status-badge--default'
  const sizeClass = sizeClasses[size] || 'status-badge--medium'

  return (
    <span className={`status-badge ${statusClass} ${sizeClass}`}>
      {label || status.toUpperCase()}
    </span>
  )
}
