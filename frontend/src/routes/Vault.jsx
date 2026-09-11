/**
 * Punk Records — Vault (Phase 2 Redesign)
 *
 * Clean white aesthetic for citizen-facing document registry.
 * Features expandable document cards and educational facts section.
 */

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DocumentCard from '../components/DocumentCard'
import BridgeAssistant from '../components/BridgeAssistant'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const FACTS = [
  {
    title: "Taj Mahal",
    icon: "🕌",
    description: "Built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal is a UNESCO World Heritage Site and one of the Seven Wonders of the World. Located in Agra, it took 22 years to complete (1632-1653)."
  },
  {
    title: "India Gate",
    icon: "🏛️",
    description: "A war memorial located in New Delhi, India Gate commemorates the 70,000 Indian soldiers who died in World War I. It stands 42 meters tall and is a major tourist attraction."
  },
  {
    title: "Digital India",
    icon: "🇮🇳",
    description: "India has the world's fastest-growing digital economy. With over 800 million internet users, India is leveraging technology to provide transparent and efficient government services to its citizens."
  },
]

export default function Vault() {
  const { user } = useAuth()
  const [vaultData, setVaultData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [expandedDocId, setExpandedDocId] = useState(null)

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

  const toggleExpand = (docId) => {
    setExpandedDocId(expandedDocId === docId ? null : docId)
  }

  if (!user) {
    return (
      <div className="vault-container">
        <div className="vault-empty-state">
          <span className="vault-empty-state__icon">🔒</span>
          <h2 className="vault-empty-state__title">Authentication Required</h2>
          <p className="vault-empty-state__text">Please log in as a citizen to access your Vault.</p>
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
      <header className="vault-header">
        <h1 className="vault-title">My Vault</h1>
        <p className="vault-subtitle">Secure Identity for a Digital India</p>
      </header>

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

      {vaultData && (
        <>
          <section className="vault-section">
            <h3 className="vault-section__title">YOUR VERIFIED DOCUMENTS</h3>
            <div className="document-grid">
              {vaultData.documents.map((doc) => (
                <div key={doc.doc_id} onClick={() => toggleExpand(doc.doc_id)}>
                  <DocumentCard document={doc} isExpanded={expandedDocId === doc.doc_id} />
                </div>
              ))}
            </div>
          </section>

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
                    <p className="verification-flag-card__text">{flag.explanation}</p>
                    <p className="verification-flag-card__hint">
                      You can see this flag because it was detected during verification.
                      Officers see the same information in their checkpoint view.
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="vault-section">
            <BridgeAssistant />
          </section>

          <section className="vault-section vault-facts">
            <h3 className="vault-section__title">📚 Did You Know?</h3>
            <div className="facts-grid">
              {FACTS.map((fact, idx) => (
                <div key={idx} className="fact-card">
                  <div className="fact-card__icon">{fact.icon}</div>
                  <h4 className="fact-card__title">{fact.title}</h4>
                  <p className="fact-card__description">{fact.description}</p>
                </div>
              ))}
            </div>
          </section>

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
