/**
 * Punk Records — Citizen Login (Phase 2 Redesign)
 *
 * Citizen authentication flow:
 * 1. Pick ID type: Aadhaar / PAN / Driving License
 * 2. Enter document number
 * 3. Submit → API lookup → JWT token → Vault
 *
 * MVP Disclosure: This is a simulated identity verification (no real OTP/2FA).
 * Labeled explicitly in UI, consistent with OCR-stub disclosure pattern.
 */

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api, APIError } from '../lib/api'

const ID_TYPES = [
  {
    value: 'aadhaar',
    label: 'Aadhaar Card',
    icon: '🪪',
    placeholder: '1234 5678 9012',
    pattern: '^[0-9]{12}$',
    hint: '12-digit number',
  },
  {
    value: 'pan',
    label: 'PAN Card',
    icon: '💳',
    placeholder: 'ABCDE1234F',
    pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$',
    hint: '10 characters (e.g., ABCDE1234F)',
  },
  {
    value: 'dl',
    label: 'Driving License',
    icon: '🚗',
    placeholder: 'MH0120100012345',
    pattern: '^[A-Z0-9]{10,20}$',
    hint: 'State code + numbers',
  },
]

export default function LoginCitizen() {
  const [selectedType, setSelectedType] = useState(null)
  const [idValue, setIdValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const { login } = useAuth()

  const selectedIDType = ID_TYPES.find(t => t.value === selectedType)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedType || !idValue) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.auth.citizen(selectedType, idValue)

      // Store auth data
      login(response.token, {
        user_id: response.user_id,
        role: response.role,
        name: response.name,
      })

      // Navigate to Vault
      navigate('/vault')
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
      <div className="login-card">
        <div className="login-header">
          <Link to="/" className="login-back-link">← Back to Role Selection</Link>
          <h1 className="login-title">Citizen Login</h1>
          <p className="login-subtitle">Access your Vault by verifying your identity document</p>
        </div>

        {!selectedType ? (
          // Step 1: ID Type Selection
          <div className="id-type-selector">
            <p className="id-type-label">Select your identity document:</p>
            <div className="id-type-grid">
              {ID_TYPES.map((type) => (
                <button
                  key={type.value}
                  className="id-type-card"
                  onClick={() => setSelectedType(type.value)}
                >
                  <span className="id-type-card__icon">{type.icon}</span>
                  <span className="id-type-card__label">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Step 2: Document Number Entry
          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form__selected-type">
              <span className="login-form__type-icon">{selectedIDType.icon}</span>
              <span className="login-form__type-label">{selectedIDType.label}</span>
              <button
                type="button"
                className="login-form__change-btn"
                onClick={() => {
                  setSelectedType(null)
                  setIdValue('')
                  setError(null)
                }}
              >
                Change
              </button>
            </div>

            <div className="form-field">
              <label htmlFor="id-value" className="form-label">
                Enter {selectedIDType.label} Number
              </label>
              <input
                id="id-value"
                type="text"
                className="form-input"
                placeholder={selectedIDType.placeholder}
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                required
                autoFocus
              />
              <span className="form-hint">{selectedIDType.hint}</span>
            </div>

            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !idValue}
            >
              {loading ? 'Verifying...' : 'Verify Identity'}
            </button>

            <div className="login-disclosure">
              <span className="disclosure-icon">ℹ️</span>
              <p className="disclosure-text">
                <strong>MVP Disclosure:</strong> This is a simulated identity verification lookup.
                No real OTP or 2FA is implemented. This system demonstrates the architectural
                concept of purpose-scoped data access.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
