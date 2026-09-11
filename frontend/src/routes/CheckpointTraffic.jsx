/**
 * Punk Records — Traffic Checkpoint (Phase 2 Redesign)
 *
 * Dark terminal aesthetic matching reference screenshots.
 * Implements scan simulation + scoped satellite cards + locked card.
 */

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../lib/api'
import RoleBanner from '../components/RoleBanner'
import ScanButton from '../components/ScanButton'
import SatelliteCard from '../components/SatelliteCard'
import LockedCard from '../components/LockedCard'
import SeededBanner from '../components/SeededBanner'

// Simulated citizen pool for scan (using seeded data from backend)
const SEEDED_CITIZENS = [
  { id: '11111111-0000-0000-0000-000000000001', name: 'Ramesh Kumar' },
  { id: '22222222-0000-0000-0000-000000000002', name: 'Priya Sharma' },
  { id: '33333333-0000-0000-0000-000000000003', name: 'Amit Patel' },
  { id: '44444444-0000-0000-0000-000000000004', name: 'Sunita Rao' },
]

export default function CheckpointTraffic() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleScan = async () => {
    // Default to Ramesh Kumar for demo (first citizen in seeded pool)
    const defaultCitizen = SEEDED_CITIZENS[0]

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Note: In production, token would be sent in Authorization header
      // For MVP, endpoint works without token (will be gated in Session 6)
      const response = await fetch(`http://localhost:8000/api/checkpoint/traffic/${defaultCitizen.id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Verification failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkpoint-container">
      <RoleBanner role="traffic" name={user?.name} />

      <h1 className="checkpoint-title">Traffic Checkpoint</h1>
      <p className="checkpoint-subtitle">Enforcement Surface v1.0</p>

      <ScanButton onScanComplete={handleScan} disabled={loading} />

      {loading && (
        <div className="dossier-state-msg">Processing verification...</div>
      )}

      {error && (
        <div className="dossier-error-msg">{error}</div>
      )}

      {result && (
        <div className="satellite-cards-grid">
          {/* Driver Verification Card */}
          <SatelliteCard
            title="Driver Verification"
            icon="🪪"
            status={result.dl_status === 'valid' ? 'verified' : 'flagged'}
            statusLabel={result.dl_status === 'valid' ? 'VERIFIED' : 'FLAGGED'}
            fields={[
              { label: 'License No.', value: result.dl_number || 'N/A' },
              { label: 'Validity', value: result.dl_validity || 'N/A' },
              { label: 'Status', value: result.dl_status || 'N/A' },
            ]}
          />

          {/* Vehicle Match Card */}
          <SatelliteCard
            title="Vehicle Match"
            icon="🚗"
            status={result.vehicle_match === 'consistent' ? 'matched' : 'flagged'}
            statusLabel={result.vehicle_match === 'consistent' ? 'MATCHED' : 'MISMATCH'}
            fields={[
              { label: 'Reg Number', value: result.vehicle_no || 'N/A' },
              { label: 'Owner Link', value: result.vehicle_match || 'N/A' },
            ]}
          />

          {/* Locked Card - Fields This Satellite Cannot See */}
          <LockedCard
            title="Financial & Legal Data"
            hint="This Satellite cannot decrypt PAN, Aadhaar, court records, or tax data"
          />

          {/* Mismatch Details if Flagged */}
          {result.mismatches && result.mismatches.length > 0 && (
            <div className="mismatch-docket">
              <h4 style={{ marginBottom: '0.75rem', color: 'var(--flag-ochre)', fontWeight: 700 }}>
                ⚠️ Verification Notes
              </h4>
              {result.mismatches.map((mismatch, i) => (
                <p key={i} style={{ fontSize: '0.88rem', lineHeight: 1.55, marginTop: '0.5rem' }}>
                  {mismatch.explanation}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Zero Overreach Footer */}
      <div className="zero-overreach-footer">
        <div className="zero-overreach-footer__icon">🔒</div>
        <p className="zero-overreach-footer__text">
          <strong>Zero Overreach:</strong> Only scoped data is decrypted.
        </p>
      </div>
    </div>
  )
}
