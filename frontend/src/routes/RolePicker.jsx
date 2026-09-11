/**
 * Punk Records — Role Picker (Phase 2 Redesign)
 *
 * Landing screen showing 5 roles:
 * - Citizen (enabled) → LoginCitizen
 * - Traffic Officer (enabled) → LoginOfficer
 * - Bank Officer (enabled) → LoginOfficer
 * - Legal Officer (disabled, "Coming soon")
 * - SEBI/Regulator (disabled, "Coming soon")
 *
 * This screen hosts the theme toggle and establishes the visual
 * framing for the entire application.
 */

import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useTheme } from '../context/ThemeContext'

const ROLES = [
  {
    id: 'citizen',
    label: 'Citizen',
    icon: '👤',
    description: 'Access your Vault and verified documents',
    enabled: true,
    route: '/login/citizen',
  },
  {
    id: 'traffic',
    label: 'Traffic Officer',
    icon: '🚦',
    description: 'Driving licence and vehicle verification',
    enabled: true,
    route: '/login/officer/traffic',
  },
  {
    id: 'banking',
    label: 'Bank Officer',
    icon: '🏦',
    description: 'KYC verification and identity checks',
    enabled: true,
    route: '/login/officer/banking',
  },
  {
    id: 'legal',
    label: 'Legal Officer',
    icon: '⚖️',
    description: 'Challans and court summons verification',
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'sebi',
    label: 'SEBI / Regulator',
    icon: '📊',
    description: 'Securities and regulatory compliance',
    enabled: false,
    comingSoon: true,
  },
]

export default function RolePicker() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleRoleClick = (role) => {
    if (role.enabled) {
      navigate(role.route)
    }
  }

  return (
    <div className="role-picker-container">
      <div className="role-picker-header">
        <div className="role-picker-branding">
          <h1 className="role-picker-title">⬡ Punk Records</h1>
          <p className="role-picker-subtitle">
            Cross-document identity verification with purpose-scoped Satellite views
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="role-picker-grid">
        {ROLES.map((role) => (
          <button
            key={role.id}
            className={`role-card ${role.enabled ? 'role-card--enabled' : 'role-card--disabled'}`}
            onClick={() => handleRoleClick(role)}
            disabled={!role.enabled}
            aria-label={role.enabled ? `Login as ${role.label}` : `${role.label} - Coming soon`}
          >
            <div className="role-card__icon">{role.icon}</div>
            <div className="role-card__content">
              <h2 className="role-card__label">{role.label}</h2>
              <p className="role-card__description">{role.description}</p>
            </div>
            {role.comingSoon && (
              <span className="role-card__badge">Coming Soon</span>
            )}
          </button>
        ))}
      </div>

      <footer className="role-picker-footer">
        <p className="role-picker-footer-text">
          Built for the Smart India Hackathon (SIH) — Identity verification and public service delivery track
        </p>
      </footer>
    </div>
  )
}
