/**
 * Punk Records — Banking Checkpoint (Phase 2 Redesign)
 *
 * KYC verification checkpoint for banking officers.
 * Dark terminal aesthetic with scan simulation.
 *
 * MVP Note: This is the seeded/disclosed Satellite per TRD.md §2.
 * Carries seeded banner indicating preview status.
 */

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import RoleBanner from '../components/RoleBanner'
import ScanButton from '../components/ScanButton'
import SatelliteCard from '../components/SatelliteCard'
import LockedCard from '../components/LockedCard'
import SeededBanner from '../components/SeededBanner'

// Simulated citizen pool for scan (using seeded data from backend)
const SEEDED_CITIZENS = [
  { id: '11111111-0000-0000-0000-000000000001', name: 'Ramesh Kumar', aadhaar: 'XXXX-XXXX-2346', pan: 'ABCDE1234F' },
  { id: '22222222-0000-0000-0000-000000000002', name: 'Priya Sharma', aadhaar: 'XXXX-XXXX-5678', pan: 'PQRST5678M' },
]

export default function CheckpointBanking() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    // Default to Ramesh Kumar for demo (first citizen in seeded pool)
    const defaultCitizen = SEEDED_CITIZENS[0]

    setLoading(true)
    setResult(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock KYC verification result
    setResult({
      citizen_id: defaultCitizen.id,
      citizen_name: defaultCitizen.name,
      aadhaar_number: defaultCitizen.aadhaar,
      pan_number: defaultCitizen.pan,
      aadhaar_status: 'verified',
      pan_status: 'verified',
      address_proof: 'Sector 12, Dwarka, Delhi',
      verified_via: 'Utility Bill',
    })

    setLoading(false)
  }

  return (
    <div className="checkpoint-container">
      <SeededBanner
        title="Seeded Preview"
        text="Banking Satellite is a disclosed preview with seeded data. Live cross-Satellite sync is the next milestone."
      />

      <RoleBanner role="banking" name={user?.name} />

      <h1 className="checkpoint-title">KYC Verification</h1>
      <p className="checkpoint-subtitle">Banking Satellite v1.0</p>

      <ScanButton onScanComplete={handleScan} disabled={loading} />

      {loading && (
        <div className="dossier-state-msg">Processing KYC verification...</div>
      )}

      {result && (
        <div className="satellite-cards-grid">
          {/* Identity Link Card */}
          <SatelliteCard
            title="Identity Link"
            icon="🪪"
            status="verified"
            statusLabel="VERIFIED"
            fields={[
              { label: 'Aadhaar No.', value: result.aadhaar_number },
              { label: 'PAN No.', value: result.pan_number },
            ]}
          />

          {/* Address Proof Card */}
          <SatelliteCard
            title="Address Proof"
            icon="📍"
            status="verified"
            statusLabel="VERIFIED"
            fields={[
              { label: 'Current Address', value: result.address_proof },
              { label: 'Verified via', value: result.verified_via },
            ]}
          />

          {/* Locked Card - Fields This Satellite Cannot See */}
          <LockedCard
            title="Traffic & Legal Records"
            hint="This Satellite cannot decrypt driving licence, vehicle registration, or court records"
          />
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
