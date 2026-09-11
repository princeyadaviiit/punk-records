/**
 * Punk Records — Scan Button Component (Phase 2 Redesign)
 *
 * Simulated document scanning interaction for Traffic and Banking checkpoints.
 * Plays a short scanning animation, then resolves to scoped checkpoint data.
 *
 * MVP Disclosure: This is explicitly labeled as simulated, consistent with
 * the OCR-stub disclosure pattern from rules.md. No real image capture/OCR.
 */

import { useState } from 'react'

export default function ScanButton({ onScanComplete, disabled }) {
  const [scanning, setScanning] = useState(false)

  const handleScan = async () => {
    setScanning(true)

    // Simulate scanning animation duration (1.2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1200))

    setScanning(false)
    if (onScanComplete) {
      onScanComplete()
    }
  }

  return (
    <div className="scan-button-container">
      <button
        className="scan-button"
        onClick={handleScan}
        disabled={disabled || scanning}
        aria-label={scanning ? 'Scanning document...' : 'Scan document'}
      >
        <span className="scan-button__icon">
          {scanning ? (
            <svg className="scan-animation" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
              <line className="scan-line" x1="3" y1="12" x2="21" y2="12" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2m0 10v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" />
            </svg>
          )}
        </span>
        <span className="scan-button__text">
          {scanning ? 'Scanning...' : 'Scan Document'}
        </span>
      </button>
      <p className="scan-button__disclosure">
        Scan (simulated) — replaces live document capture
      </p>
    </div>
  )
}
