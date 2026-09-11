/**
 * Punk Records — Document Modal Component
 *
 * Full-screen modal displaying complete document details.
 * Shows all verification info, document numbers, dates, and status.
 */

import StatusBadge from './StatusBadge'

const DOC_ICONS = {
  AADHAAR: '🪪',
  DL: '🚗',
  RC: '🚙',
  PAN: '💳',
  CHALLAN: '📋',
  SUMMONS: '⚖️',
  KYC_FIELD: '🏦',
}

const DOC_LABELS = {
  AADHAAR: 'Aadhaar Card',
  DL: 'Driving License',
  RC: 'Vehicle Registration',
  PAN: 'PAN Card',
  CHALLAN: 'Traffic Challan',
  SUMMONS: 'Court Summons',
  KYC_FIELD: 'KYC Document',
}

export default function DocumentModal({ document, onClose }) {
  if (!document) return null

  const icon = DOC_ICONS[document.doc_type] || '📄'
  const label = document.display_label || DOC_LABELS[document.doc_type] || document.doc_type

  const statusConfig = {
    valid: { badge: 'verified', label: 'Verified', color: 'green' },
    expired: { badge: 'warning', label: 'Expired', color: 'red' },
    flagged: { badge: 'flagged', label: 'Flagged', color: 'amber' },
  }

  const config = statusConfig[document.status] || statusConfig.valid

  return (
    <div className="document-modal-overlay" onClick={onClose}>
      <div className="document-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="document-modal__header">
          <div className="document-modal__icon-wrapper">
            <span className="document-modal__icon">{icon}</span>
          </div>
          <div className="document-modal__title-section">
            <h2 className="document-modal__title">{label}</h2>
            <p className="document-modal__department">{document.department}</p>
          </div>
          <button className="document-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Status Badge */}
        <div className="document-modal__status">
          <StatusBadge status={config.badge} label={config.label} size="large" />
        </div>

        {/* Document Details */}
        <div className="document-modal__body">
          <section className="document-modal__section">
            <h3 className="document-modal__section-title">Document Information</h3>
            <table className="ledger-table">
              <tbody>
                {document.doc_number && (
                  <tr>
                    <th>Document Number</th>
                    <td className="mono-field">{document.doc_number}</td>
                  </tr>
                )}
                {document.issue_date && (
                  <tr>
                    <th>Issue Date</th>
                    <td>{document.issue_date}</td>
                  </tr>
                )}
                {document.validity && (
                  <tr>
                    <th>Valid Until</th>
                    <td>{document.validity}</td>
                  </tr>
                )}
                {document.issuing_authority && (
                  <tr>
                    <th>Issuing Authority</th>
                    <td>{document.issuing_authority}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* Verification Status */}
          <section className="document-modal__section">
            <h3 className="document-modal__section-title">Verification Status</h3>
            <div className={`document-modal__verification document-modal__verification--${config.color}`}>
              <div className="document-modal__verification-icon">
                {config.badge === 'verified' ? '✓' : config.badge === 'flagged' ? '⚠' : '⚠'}
              </div>
              <div className="document-modal__verification-content">
                <h4 className="document-modal__verification-title">{config.label}</h4>
                <p className="document-modal__verification-text">
                  {config.badge === 'verified' && 'This document has been verified and is in good standing.'}
                  {config.badge === 'flagged' && 'This document has been flagged for review. Please check with the issuing authority.'}
                  {config.badge === 'warning' && 'This document has expired. Please renew it as soon as possible.'}
                </p>
              </div>
            </div>
          </section>

          {/* Additional Info */}
          {document.additional_info && Object.keys(document.additional_info).length > 0 && (
            <section className="document-modal__section">
              <h3 className="document-modal__section-title">Additional Details</h3>
              <table className="ledger-table">
                <tbody>
                  {Object.entries(document.additional_info).map(([key, value]) => (
                    <tr key={key}>
                      <th>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</th>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="document-modal__footer">
          <p className="document-modal__footer-text">
            💡 This information is part of your unified identity vault. Any updates to this document 
            are automatically reflected across all government services.
          </p>
        </div>
      </div>
    </div>
  )
}
