import { useState, useEffect } from 'react'
import CitizenSelect from '../components/CitizenSelect'
import SeededBanner from '../components/SeededBanner'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Legal Satellite checkpoint page.
 *
 * MVP Status: SEEDED PREVIEW — disclosed via SeededBanner (mandatory, unmissable).
 * Reads from the same shared schema as Traffic Satellite (LegalCheckResponse).
 * Structural scope: outstanding challans + court summons only.
 * Cannot contain DL/vehicle or KYC fields — verifiable in OpenAPI schema.
 */
export default function CheckpointLegal() {
  const [citizens, setCitizens] = useState([])
  const [citizenId, setCitizenId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [citizensLoading, setCitizensLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/citizens`)
      .then(r => r.json())
      .then(data => { setCitizens(data); setCitizensLoading(false) })
      .catch(() => { setCitizensLoading(false) })
  }, [])

  useEffect(() => {
    if (!citizenId) { setResult(null); setError(null); return }

    setLoading(true)
    setError(null)
    setResult(null)

    fetch(`${API}/api/checkpoint/legal/${citizenId}`)
      .then(r => {
        if (!r.ok) return r.json().then(e => Promise.reject(e.detail || 'Request failed'))
        return r.json()
      })
      .then(data => { setResult(data); setLoading(false) })
      .catch(err => { setError(String(err)); setLoading(false) })
  }, [citizenId])

  return (
    <div className="page-content">
      <div className="satellite-header">
        <h1 className="satellite-header__title">
          ⚖️ Legal Satellite — Checkpoint View
        </h1>
        <span className="satellite-header__scope">
          Scope: Outstanding challans · Court summons status · Nothing else
        </span>
      </div>

      {/* Mandatory disclosed-preview banner — per rules.md #6 and design.md §3 */}
      <SeededBanner />

      <CitizenSelect
        citizens={citizens}
        value={citizenId}
        onChange={setCitizenId}
        loading={citizensLoading}
      />

      {/* Loading */}
      {loading && (
        <div className="state-loading">
          <div className="spinner" />
          Fetching legal status…
        </div>
      )}

      {/* Error */}
      {error && <div className="state-error" role="alert">⚠ {error}</div>}

      {/* Result — Legal-specific card, structurally different from Traffic */}
      {result && !loading && (
        <div className="result-panel">
          <div className={`legal-card ${result.outstanding_challans_count > 0 ? 'legal-card--has-challan' : ''}`}>
            <div className="legal-card__header">
              <span style={{ fontSize: '1.3rem' }}>
                {result.outstanding_challans_count > 0 || result.court_summons_pending ? '⚠️' : '✅'}
              </span>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1rem' }}>{result.citizen_name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                  Legal enforcement check
                </div>
              </div>
            </div>

            {/* Challan count */}
            <div className="status-pill">
              <span>📋</span>
              <div>
                <div className="status-pill__label">Outstanding Challans</div>
                <div className="status-pill__value" style={{
                  color: result.outstanding_challans_count > 0 ? 'var(--flag-amber)' : 'var(--ok-400)'
                }}>
                  {result.outstanding_challans_count > 0
                    ? `${result.outstanding_challans_count} pending`
                    : 'None'}
                </div>
              </div>
            </div>

            {/* Challan detail if present */}
            {result.outstanding_challans_count > 0 && (
              <div className="challan-row">
                ⚠ {result.outstanding_challans_count} unpaid challan(s) on record —
                manual verification required before clearing.
              </div>
            )}

            {/* Court summons */}
            <div className="status-pill">
              <span>🏛️</span>
              <div>
                <div className="status-pill__label">Court Summons</div>
                <div className="status-pill__value" style={{
                  color: result.court_summons_pending ? 'var(--flag-red)' : 'var(--ok-400)'
                }}>
                  {result.court_summons_pending ? 'Pending' : 'None'}
                </div>
              </div>
            </div>

            {/* Summons details if present */}
            {result.court_summons_pending && result.summons_details?.map(s => (
              <div key={s.summons_id} className="flagged-card__explanation">
                <strong>Summons {s.summons_id}:</strong> {s.description} (issued {s.issued_date})
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="scope-disclosure">
        <div className="scope-disclosure__title">Access scope — Legal Satellite</div>
        This view is structurally limited to challan and summons fields.
        The response type (<code>LegalCheckResponse</code>) cannot contain DL/vehicle
        or banking fields — verifiable in the{' '}
        <a href={`${API}/docs#/Legal%20Satellite%20(Seeded%20Preview)`} target="_blank" rel="noreferrer"
          style={{ color: 'var(--accent-400)' }}>OpenAPI schema</a>.
        · This Satellite reads the same shared schema as Traffic — no separate mock dataset.
        · Full live challan DB integration is Phase B.
      </div>
    </div>
  )
}
