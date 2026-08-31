import { useState, useEffect } from 'react'
import CitizenSelect from '../components/CitizenSelect'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Vault — read-only citizen view of the shared graph.
 *
 * Grounded in "The Government File" design language:
 * Ruled document registry ledger, typewritten serial numbers,
 * mini status stamps, and cross-verification audit findings.
 *
 * Demonstrates Pillar 2: The same graph that an enforcement officer queries
 * also serves the citizen's own verification transparency.
 */
export default function Vault() {
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

    fetch(`${API}/api/vault/${citizenId}`)
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
            Citizen Records Registry — Identity Vault
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
            FORM PR-CV-3
          </span>
        </div>
        <h1 className="dossier-heading__title">
          Citizen Document Vault & Audit Record
        </h1>
        <p className="dossier-heading__scope">
          Personal record transparency: All registered documents, issuing authorities, and cross-verification flags.
        </p>
      </div>

      {/* Mandatory Read-Only Status Disclosure */}
      <div className="seeded-banner-bar" style={{ borderLeftColor: 'var(--ink)' }}>
        <div className="seeded-banner-bar__title">
          Statutory View Mode: Read-Only Record
        </div>
        <div className="seeded-banner-bar__text">
          Read-only citizen audit view (MVP Phase A). Self-triggered document synchronization and re-verification requests are scheduled for Phase B. This view reflects your verified standing across connected Satellites from the single shared knowledge graph.
        </div>
      </div>

      <CitizenSelect
        citizens={citizens}
        value={citizenId}
        onChange={setCitizenId}
        loading={citizensLoading}
      />

      {loading && (
        <div className="dossier-state-msg" role="status">
          Retrieving citizen document registry…
        </div>
      )}

      {error && (
        <div className="dossier-error-msg" role="alert">
          Statutory query error: {error}
        </div>
      )}

      {result && !loading && (
        <div className="stamp-container">
          {/* Citizen Identity Ledger */}
          <div className="ledger-label">Subject Identification Record</div>
          <table className="ledger-table" style={{ marginTop: '0.5rem', marginBottom: '1.75rem' }}>
            <tbody>
              <tr>
                <th>Registered Name</th>
                <td>{result.name}</td>
              </tr>
              <tr>
                <th>Date of Birth</th>
                <td>{result.dob}</td>
              </tr>
              <tr>
                <th>Citizen Identifier</th>
                <td className="mono-field">{result.id}</td>
              </tr>
            </tbody>
          </table>

          {/* Document Registry Table */}
          <div className="ledger-label">Registered Documents On Record ({result.documents.length})</div>
          <table className="vault-doc-table">
            <thead>
              <tr>
                <th>Document Type</th>
                <th>Serial / Registration ID</th>
                <th>Issuing Authority</th>
                <th>Validation Status</th>
              </tr>
            </thead>
            <tbody>
              {result.documents.map(doc => (
                <tr key={doc.doc_id}>
                  <td style={{ fontWeight: 600 }}>{doc.display_label}</td>
                  <td className="mono-field">{doc.doc_id}</td>
                  <td style={{ color: 'var(--ink-muted)' }}>{doc.department}</td>
                  <td>
                    <span className={`mini-stamp mini-stamp--${doc.status}`}>
                      {doc.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Cross-Verification Flags / Audit Findings */}
          <div style={{ marginTop: '2rem' }}>
            <div className="ledger-label">Cross-Verification Audit Findings</div>
            {result.verification_flags.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                {result.verification_flags.map((flag, idx) => (
                  <div key={idx} className="mismatch-docket">
                    <div>
                      <strong>Audit Finding — {flag.match_field.toUpperCase()} Field Discrepancy:</strong>
                    </div>
                    <div style={{ marginTop: '0.35rem', fontSize: '0.88rem' }}>
                      {flag.explanation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dossier-state-msg" style={{ padding: '0.75rem 0', color: 'var(--stamp-green)', fontStyle: 'normal' }}>
                All document fields match across issuing departments. No cross-verification flags on record.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Statutory Footer */}
      <div className="statutory-footer">
        <div className="statutory-footer__title">One Graph · Two Directions (Pillar 2)</div>
        The Citizen Vault queries the same <code>documents</code> and <code>cross_verification_results</code> tables as the Traffic and Legal Satellite routes. A mismatch flagged during a field checkpoint appears here transparently as a document discrepancy — ensuring citizens have equal audit visibility into their own verified identity graph.
      </div>
    </div>
  )
}
