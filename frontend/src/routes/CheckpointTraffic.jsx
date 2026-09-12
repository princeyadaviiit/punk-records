/**
 * Punk Records — Traffic Checkpoint (Phase 2 Redesign)
 *
 * Dark terminal aesthetic matching reference screenshots.
 * Implements scan simulation + location tracking + RTO rules.
 */

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import RoleBanner from '../components/RoleBanner'
import ScanButton from '../components/ScanButton'
import SatelliteCard from '../components/SatelliteCard'
import LockedCard from '../components/LockedCard'
import LocationBanner from '../components/LocationBanner'
import RTORules from '../components/RTORules'

// Default checkpoint location (Bhopal, Madhya Pradesh)
const CHECKPOINT_LOCATION = {
  city: 'Bhopal',
  state: 'Madhya Pradesh',
  rto_code: 'MP-04',
  latitude: 23.2599,
  longitude: 77.4126
}

// Bhopal/MP specific RTO rules
const BHOPAL_RTO_RULES = [
  {
    icon: '🪖',
    title: 'Helmet Mandatory',
    description: 'All two-wheeler riders and pillion riders must wear ISI-marked helmets. Madhya Pradesh has strict enforcement in urban areas.',
    penalty: '₹1,000 + 3 months license suspension'
  },
  {
    icon: '🚦',
    title: 'Red Light Violation',
    description: 'Jumping red signals is a major offense under MP Motor Vehicles Rules. CCTV surveillance is active at major intersections in Bhopal.',
    penalty: '₹1,000 first offense, ₹2,000 repeat'
  },
  {
    icon: '🍺',
    title: 'Drunk Driving - Zero Tolerance',
    description: 'MP follows strict alcohol limits: 30mg/100ml blood. Random breath analyzer checks conducted at night checkpoints.',
    penalty: '₹10,000 + 6 months imprisonment + license suspension'
  },
  {
    icon: '📱',
    title: 'Mobile Phone Usage',
    description: 'Using mobile phone while driving (calling, texting, or handheld) is prohibited. Hands-free devices are allowed.',
    penalty: '₹1,000 first offense, ₹2,000 repeat'
  },
  {
    icon: '🔧',
    title: 'Vehicle Fitness Certificate',
    description: 'Commercial vehicles over 8 years and private vehicles over 15 years require valid fitness certificates in MP.',
    penalty: '₹5,000 + vehicle impoundment'
  },
]

// Mock data for Ramesh Kumar (fallback when backend is not available)
const RAMESH_KUMAR_MOCK = {
  citizen_id: '11111111-0000-0000-0000-000000000001',
  dl_number: 'DL-1420110012345',
  dl_validity: '2028-03-15',
  dl_status: 'valid',
  vehicle_no: 'DL-01-AB-1234',
  vehicle_match: 'mismatch',
  mismatches: [
    {
      match_field: 'dl_name_vs_rc_owner',
      explanation: 'Name on driving licence (Ramesh Kumar) does not closely match vehicle registration owner name (R. Kumar). Fuzzy match score: 85.7% (threshold: 90%).'
    }
  ]
}

export default function CheckpointTraffic() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showLocation, setShowLocation] = useState(false)

  const handleScan = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    setShowLocation(false)

    try {
      // Try to fetch from backend API
      const response = await fetch(`http://localhost:8000/api/checkpoint/traffic/11111111-0000-0000-0000-000000000001`)

      if (!response.ok) {
        // Backend not available or error - use mock data
        console.log('Backend not available, using mock data')
        await new Promise(resolve => setTimeout(resolve, 800))
        setResult(RAMESH_KUMAR_MOCK)
        setShowLocation(true)
      } else {
        const data = await response.json()
        setResult(data)
        setShowLocation(true)
      }
    } catch (err) {
      // Network error - use mock data as fallback
      console.log('Network error, using mock data:', err.message)
      await new Promise(resolve => setTimeout(resolve, 800))
      setResult(RAMESH_KUMAR_MOCK)
      setShowLocation(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="checkpoint-container">
      <RoleBanner role="traffic" name={user?.name} />

      <h1 className="checkpoint-title">Traffic Checkpoint</h1>
      <p className="checkpoint-subtitle">Enforcement Surface v1.0</p>

      {/* Location Banner - shown after scan */}
      {showLocation && <LocationBanner location={CHECKPOINT_LOCATION} />}

      <ScanButton onScanComplete={handleScan} disabled={loading} />

      {loading && (
        <div className="dossier-state-msg">Processing verification...</div>
      )}

      {error && (
        <div className="dossier-error-msg">{error}</div>
      )}

      {result && (
        <>
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

          {/* RTO Rules for Bhopal */}
          <RTORules rules={BHOPAL_RTO_RULES} />
        </>
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
