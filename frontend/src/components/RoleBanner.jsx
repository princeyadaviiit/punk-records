/**
 * Punk Records — Role Banner Component (Phase 2 Redesign)
 *
 * Blue banner showing officer role at top of checkpoint views.
 * Matches reference screenshot: "Role: Traffic Officer" / "Role: Bank Manager"
 */

export default function RoleBanner({ role, name }) {
  const roleLabels = {
    traffic: 'Traffic Officer',
    banking: 'Bank Manager',
  }

  const roleLabel = roleLabels[role] || 'Officer'

  return (
    <div className="role-banner">
      <span className="role-banner__label">Role:</span>
      <span className="role-banner__role">{roleLabel}</span>
      {name && (
        <span className="role-banner__name">— {name}</span>
      )}
    </div>
  )
}
