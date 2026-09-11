/**
 * Punk Records — Banking Checkpoint (Phase 2 Redesign)
 *
 * KYC verification checkpoint for banking officers.
 * Dark terminal aesthetic with scan simulation.
 */

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import RoleBanner from '../components/RoleBanner'
import ScanButton from '../components/ScanButton'
import SatelliteCard from '../components/SatelliteCard'
import LockedCard from '../components/LockedCard'
import SeededBanner from '../components/SeededBanner'

// Mock data for Ramesh Kumar
const RAMESH_KUMAR_MOCK = {
  citizen_id: '11111111-0000-0000-0000-000000000001',
  citizen_name: 'Ramesh Kumar',
  aadhaar_number: 'XXXX-XXXX-2346',
  pan_number: 'ABCDE1234F',
  aadhaar_status: 'verified',
  pan_status: 'verified',
  address_proof: 'Sector 12, Dwarka, Delhi',
  verified_via: 'Utility Bill',
}

export default function CheckpointBanking() {
  const { user } = useAuth()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async () => {
    setLoading(true)
    setResult(null)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Use mock data for Ramesh Kumar
    setResult(RAMESH_KUMAR_MOCK)
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
