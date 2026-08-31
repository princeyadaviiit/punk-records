import { useState, useEffect } from 'react'
import CitizenSelect from '../components/CitizenSelect'
import SeededBanner from '../components/SeededBanner'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Legal Satellite checkpoint view.
 *
 * MVP Status: Seeded / static preview (disclosed).
 * Reads from the same shared schema as Traffic Satellite.
 * Structural scope: outstanding challans + court summons status only.
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
    <div>
      {/* Gazette-style departmental header */}
      <div className="dossier-heading">
        <div className="dossier-heading__topline">
          <span className="dossier-heading__dept">
            Judicial & Traffic Enforcement Division
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
            FORM PR-LG-2
          </span>
        </div>
        <h1 className="dossier-heading__title">
          Legal Satellite Enforcement Record
        </h1>
        <p className="dossier-heading__scope">
          Statutory Access Scope: Outstanding traffic challans and court summons records only.
        </p>
      </div>

      {/* Mandatory Disclosed Preview Banner */}
      <SeededBanner />

      <CitizenSelect
        citizens={citizens}
        value={citizenId}
        onChange={setCitizenId}
        loading={citizensLoading}
      />

      {loading && (
        <div className="dossier-state-msg" role="status">
          Retrieving judicial enforcement records…
        </div>
      )}

      {error && (
        <div className="dossier-error-msg" role="alert">
          Statutory query error: {error}
        </div>
      )}

      {result && !loading && (
        <div className="stamp-container">
          {/* Stamp based on challan / summons existence */}
          {result.outstanding_challans_count > 0 || result.court_summons_pending ? (
            <div className="rubber-stamp rubber-stamp--flagged">
              <div className="rubber-stamp__title">ACTION REQUIRED</div>
              <div className="rubber-stamp__sub">
                {result.outstanding_challans_count > 0 ? `${result.outstanding_challans_count} UNPAID CHALLAN(S)` : 'PENDING COURT SUMMONS'}
              </div>
            </div>
          ) : (
            <div className="rubber-stamp rubber-stamp--clean">
              <div className="rubber-stamp__title">CLEAR · NO DUES</div>
              <div className="rubber-stamp__sub">NO ACTIVE CHALLANS OR SUMMONS</div>
            </div>
          )}

          {/* Ledger Table */}
          <table className="ledger-table">
            <tbody>
              <tr>
                <th>Subject Name</th>
                <td>{result.citizen_name}</td>
              </tr>
              <tr>
                <th>Subject Identifier</th>
                <td className="mono-field">{result.citizen_id}</td>
              </tr>
              <tr>
                <th>Outstanding Challans</th>
                <td style={{
                  color: result.outstanding_challans_count > 0 ? 'var(--flag-ochre)' : 'var(--ink)',
                  fontWeight: result.outstanding_challans_count > 0 ? 700 : 400
                }}>
                  {result.outstanding_challans_count > 0
                    ? `${result.outstanding_challans_count} unpaid challan(s) recorded`
                    : 'Nil (No outstanding dues)'}
                </td>
              </tr>
              <tr>
                <th>Court Summons Status</th>
                <td style={{
                  color: result.court_summons_pending ? 'var(--tape-red)' : 'var(--ink)',
                  fontWeight: result.court_summons_pending ? 700 : 400
                }}>
                  {result.court_summons_pending ? 'Active Summons Pending' : 'None on record'}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Summons Details Docket if present */}
          {result.court_summons_pending && result.summons_details?.map(s => (
            <div key={s.summons_id} className="mismatch-docket" style={{ borderLeftColor: 'var(--tape-red)', marginTop: '1rem' }}>
              <strong>Summons Record No. <span className="mono-field">{s.summons_id}</span>:</strong> {s.description} (Date of issue: {s.issued_date})
            </div>
          ))}
        </div>
      )}

      {/* Statutory Footer */}
      <div className="statutory-footer">
        <div className="statutory-footer__title">Access Scope & Privacy Boundary</div>
        This legal enforcement view is structurally limited to challan count and court summons status. The underlying API response model (<code>LegalCheckResponse</code>) cannot contain driving licence or vehicle registration details — verifiable via the{' '}
        <a href={`${API}/docs#/Legal%20Satellite%20(Seeded%20Preview)`} target="_blank" rel="noreferrer">
          OpenAPI Specification
        </a>. All routes read the same shared schema without mock dataset duplication.
      </div>
    </div>
  )
}
