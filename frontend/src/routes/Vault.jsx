import { useState, useEffect } from 'react'
import CitizenSelect from '../components/CitizenSelect'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

/**
 * Vault — read-only citizen view of the same shared graph.
 *
 * MVP Status: read-only static view. No upload, reorder, or sync affordances
 * are rendered at all — they are intentionally omitted, per design.md §4:
 * "don't build disabled buttons — omit them, so it doesn't read as broken."
 *
 * Demonstrates Pillar 2: the same graph that serves the Traffic officer
 * also surfaces the citizen's own document status and flags.
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

  const statusIcon = (s) => s === 'valid' ? '✅' : s === 'expired' ? '⏰' : '⚠️'

  return (
    <div className="page-content">
      <div className="satellite-header">
        <h1 className="satellite-header__title">
          🔒 Vault — Citizen Document View
        </h1>
        <span className="satellite-header__scope">
          Scope: Your documents · Your verification flags · Read-only
        </span>
      </div>

      {/* MVP status disclosure */}
      <div className="seeded-banner" style={{
        background: 'rgba(59,130,246,0.08)',
        borderColor: 'rgba(59,130,246,0.3)',
        color: 'var(--accent-400)'
      }}>
        <span className="seeded-banner__icon">📖</span>
        <span>
          <strong>Read-only view (MVP)</strong> — upload, sync, and re-verification
          are Phase B features. This view shows what an officer can see about your
          documents from the same graph, from your perspective.
        </span>
      </div>

      <CitizenSelect
        citizens={citizens}
        value={citizenId}
        onChange={setCitizenId}
        loading={citizensLoading}
      />

      {loading && (
        <div className="state-loading">
          <div className="spinner" />
          Loading vault…
        </div>
      )}

      {error && <div className="state-error" role="alert">⚠ {error}</div>}

      {result && !loading && (
        <div className="result-panel">
          <div className="vault-card">
            {/* Citizen identity */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'var(--accent-glow)',
                border: '1px solid var(--accent-500)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', flexShrink: 0
              }}>👤</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem' }}>{result.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DOB: {result.dob}</div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <div className="section-label">Documents on record</div>
              <div className="vault-docs-grid">
                {result.documents.map(doc => (
                  <div
                    key={doc.doc_id}
                    className={`vault-doc-tile vault-doc-tile--${doc.status}`}
                  >
                    <div className="vault-doc-tile__label">
                      {statusIcon(doc.status)} {doc.display_label}
                    </div>
                    <div className="vault-doc-tile__dept">{doc.department}</div>
                    <div className={`vault-doc-tile__status vault-doc-tile__status--${doc.status}`}>
                      {doc.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-verification flags */}
            {result.verification_flags.length > 0 && (
              <div>
                <div className="section-label">⚠ Verification flags</div>
                <div className="vault-flags">
                  {result.verification_flags.map((f, i) => (
                    <div key={i} className="vault-flag-row">
                      <strong>Field: {f.match_field}</strong> — {f.explanation}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.verification_flags.length === 0 && (
              <div style={{ fontSize: '0.82rem', color: 'var(--ok-400)' }}>
                ✅ No cross-verification flags — all checked fields match across documents.
              </div>
            )}
          </div>
        </div>
      )}

      <div className="scope-disclosure">
        <div className="scope-disclosure__title">One graph, two directions</div>
        The Vault reads from the same <code>documents</code> and <code>cross_verification_results</code> tables
        as the Traffic and Legal Satellite routes. The same flag that an officer sees as a
        vehicle mismatch, you see here as a "name field" flag — same graph, different lens.
        · Upload / sync / reorder are Phase B features.
      </div>
    </div>
  )
}
