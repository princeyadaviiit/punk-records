import { useState } from 'react'

/**
 * FlaggedState — the demo-critical mismatch component.
 *
 * Visual treatment: high-contrast rubber ink stamp in --flag-ochre,
 * angled off-axis with sharp stamped-down motion, accompanied by a
 * ruled ledger table and foldout mismatch explanation docket.
 */
export default function FlaggedState({ data }) {
  const [expanded, setExpanded] = useState(false)
  const mismatch = data.mismatch

  return (
    <div className="stamp-container" role="region" aria-label="Verification outcome: Record Flagged Mismatch">
      {/* Rubber Stamp Mark */}
      <div className="rubber-stamp rubber-stamp--flagged">
        <div className="rubber-stamp__title">RECORD FLAGGED</div>
        <div className="rubber-stamp__sub">CROSS-DOCUMENT MISMATCH DETECTED</div>
      </div>

      {/* Ledger Table */}
      <table className="ledger-table">
        <tbody>
          <tr>
            <th>Subject Name</th>
            <td>{data.citizen_name}</td>
          </tr>
          <tr>
            <th>Subject Identifier</th>
            <td className="mono-field">{data.citizen_id}</td>
          </tr>
          <tr>
            <th>Driving Licence Status</th>
            <td>{data.dl_status.toUpperCase()}</td>
          </tr>
          <tr>
            <th>Vehicle Registration Match</th>
            <td style={{ color: 'var(--flag-ochre)', fontWeight: 700 }}>MISMATCH DETECTED</td>
          </tr>
        </tbody>
      </table>

      {/* Mismatch Docket Section */}
      <div className="mismatch-docket">
        <div>
          <strong>Finding:</strong> Name discrepancy between driving licence and vehicle registration records.
        </div>
        <button
          className="mismatch-docket__toggle"
          onClick={() => setExpanded(prev => !prev)}
          aria-expanded={expanded}
          aria-controls="mismatch-record-details"
          id="expand-mismatch-btn"
        >
          {expanded ? 'Close Verification Note' : 'View Verification Note'}
        </button>

        {expanded && mismatch && (
          <div
            className="mismatch-docket__content"
            id="mismatch-record-details"
            role="alert"
          >
            <strong>Verification finding ({mismatch.match_field} comparison):</strong>{' '}
            {mismatch.explanation}
          </div>
        )}
      </div>
    </div>
  )
}
