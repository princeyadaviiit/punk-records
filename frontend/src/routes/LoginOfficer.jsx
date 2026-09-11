/**
 * Punk Records — Officer Login (Phase 2 Redesign)
 *
 * Officer authentication flow for Traffic and Banking checkpoint access:
 * 1. Badge/Employee ID + Password entry
 * 2. Submit → API validation → JWT token → Checkpoint
 *
 * Visual distinction from citizen login: internal ops tool aesthetic,
 * styled differently from consumer-grade citizen login.
 */

import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, APIError } from '../lib/api'

const ROLE_CONFIG = {
  traffic: {
    title: 'Traffic Officer Login',
    icon: '🚦',
    badgeLabel: 'Badge ID',
    badgePlaceholder: 'TRF001',
    checkpoint: '/checkpoint/traffic',
    description: 'Traffic Enforcement Surface',
  },
  banking: {
    title: 'Bank Officer Login',
    icon: '🏦',
    badgeLabel: 'Employee ID',
    badgePlaceholder: 'BNK001',
    checkpoint: '/checkpoint/banking',
    description: 'Banking Satellite — KYC Verification',
  },
}

export default function LoginOfficer() {
  const { role } = useParams()
  const [badgeId, setBadgeId] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const config = ROLE_CONFIG[role]

  if (!config) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="login-error">
            Invalid role. Please return to role selection.
          </div>
          <Link to="/" className="btn-secondary">← Back to Role Selection</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!badgeId || !password) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.auth.officer(role, badgeId, password)

      // Store auth data
      login(response.token, {
        user_id: response.user_id,
        role: response.role,
        name: response.name,
      })

      // Navigate to appropriate checkpoint
      navigate(config.checkpoint)
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card login-card--officer">
        <div className="login-header">
          <Link to="/" className="login-back-link">← Back to Role Selection</Link>
          <div className="login-role-badge">
            <span className="login-role-badge__icon">{config.icon}</span>
            <span className="login-role-badge__text">{config.description}</span>
          </div>
          <h1 className="login-title">{config.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form login-form--officer">
          <div className="form-field">
            <label htmlFor="badge-id" className="form-label">
              {config.badgeLabel}
            </label>
            <input
              id="badge-id"
              type="text"
              className="form-input form-input--mono"
              placeholder={config.badgePlaceholder}
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value.toUpperCase())}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-field">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary btn-primary--officer"
            disabled={loading || !badgeId || !password}
          >
            {loading ? 'Authenticating...' : 'Access Checkpoint'}
          </button>

          <div className="officer-login-hint">
            <p className="officer-login-hint__text">
              <strong>For demo:</strong> Use badge IDs TRF001/TRF002 (traffic) or BNK001/BNK002 (banking)
              with password "traffic123" or "banking123" respectively.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
