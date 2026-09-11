/**
 * Punk Records — Vault (Phase 2 Redesign)
 *
 * Light card grid aesthetic for citizen-facing document registry.
 * Matches reference screenshot: warm, rounded cards with status indicators.
 *
 * Demonstrates Pillar 2: Citizens see the same verification graph as officers.
 * MVP: Strictly read-only (no upload/sync/reorder affordances).
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DocumentCard from '../components/DocumentCard'
import BridgeAssistant from '../components/BridgeAssistant'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function Vault() {
  const { user } = useAuth()
  const [vaultData, setVaultData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Auto-load vault data if user is authenticated
  useEffect(() => {
    if (!user?.user_id) return

    setLoading(true)
    setError(null)

    fetch(`${API_BASE_URL}/api/vault/${user.user_id}`)
      .then(r => {
        if (!r.ok) return r.json().then(e => Promise.reject(e.detail || 'Request failed'))
        return r.json()
      })
      .then(data => {
        setVaultData(data)
        setLoading(false)
      })
      .catch(err => {
        setError(String(err))
        setLoading(false)
      })
  }, [user?.user_id])

  if (!user) {
    return (
      <div className="vault-container">
        <div className="vault-empty-state">
          <span className="vault-empty-state__icon">🔒</span>
          <h2 className="vault-empty-state__title">Authentication Required</h2>
          <p className="vault-empty-state__text">
            Please log in as a citizen to access your Vault.
          </p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="vault-container">
        <div className="vault-loading">
          <div className="vault-loading__spinner">⏳</div>
          <p className="vault-loading__text">Loading your Vault...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="vault-container">
        <div className="vault-error">
          <span className="vault-error__icon">⚠️</span>
          <h2 className="vault-error__title">Unable to Load Vault</h2>
          <p className="vault-error__text">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="vault-container">
      {/* Vault Header */}
      <header className="vault-header">
        <h1 className="vault-title">My Vault</h1>
        <p className="vault-subtitle">Secure Identity for a Digital India</p>
      </header>

      {/* User Profile Circle */}
      {vaultData && (
        <div className="vault-profile">
          <div className="vault-profile__circle">
            <span className="vault-profile__initial">
              {vaultData.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="vault-profile__name">{vaultData.name}</h2>
          <p className="vault-profile__dob">Born: {vaultData.dob}</p>
        </div>
      )}

      {/* Documents Section */}
      {vaultData && (
        <>
          <section className="vault-section">
            <h3 className="vault-section__title">YOUR VERIFIED DOCUMENTS</h3>
            <div className="document-grid">
              {vaultData.documents.map((doc) => (
                <DocumentCard key={doc.doc_id} document={doc} />
              ))}
            </div>
          </section>

          {/* Verification Flags Section */}
          {vaultData.verification_flags && vaultData.verification_flags.length > 0 && (
            <section className="vault-section">
              <h3 className="vault-section__title">⚠️ VERIFICATION NOTES</h3>
              <div className="verification-flags">
                {vaultData.verification_flags.map((flag, idx) => (
                  <div key={idx} className="verification-flag-card">
                    <div className="verification-flag-card__header">
                      <span className="verification-flag-card__icon">🔍</span>
                      <h4 className="verification-flag-card__title">
                        {flag.match_field.toUpperCase()} Discrepancy
                      </h4>
                    </div>
                    <p className="verification-flag-card__text">
                      {flag.explanation}
                    </p>
                    <p className="verification-flag-card__hint">
                      You can see this flag because it was detected during verification.
                      Officers see the same information in their checkpoint view.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Bridge Assistant Module */}
          <section className="vault-section">
            <BridgeAssistant />
          </section>

          {/* Pillar 2 Disclosure */}
          <div className="vault-footer">
            <div className="vault-footer__badge">
              <span className="vault-footer__icon">🔄</span>
              <strong>One Graph, Two Directions</strong>
            </div>
            <p className="vault-footer__text">
              Your Vault queries the same documents and verification results that enforcement
              officers see. Any flag that appears during a checkpoint is visible here first —
              giving you equal transparency into your identity verification status.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
