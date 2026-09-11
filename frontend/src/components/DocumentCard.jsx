/**
 * Punk Records — Document Card Component (Phase 2 Redesign)
 *
 * Individual document card for Vault grid.
 * Shows document icon, name, issuing authority, and status badge.
 * Expands to show document details when clicked.
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

export default function DocumentCard({ document, isExpanded }) {
  const icon = DOC_ICONS[document.doc_type] || '📄'
  const label = document.display_label || DOC_LABELS[document.doc_type] || document.doc_type

  const statusConfig = {
    valid: { badge: 'verified', label: 'Verified', color: 'green' },
    expired: { badge: 'warning', label: 'Expired', color: 'red' },
    flagged: { badge: 'flagged', label: 'Flagged', color: 'amber' },
  }

  const config = statusConfig[document.status] || statusConfig.valid

  return (
    <div className={`document-card ${isExpanded ? 'document-card-expanded' : ''}`}>
      <div className="document-card__icon-wrapper">
        <span className="document-card__icon">{icon}</span>
        <span className={`document-card__status-dot document-card__status-dot--${config.color}`} />
      </div>
      <div className="document-card__content">
        <h3 className="document-card__title">{label}</h3>
        <p className="document-card__department">{document.department}</p>
        <StatusBadge status={config.badge} label={config.label} size="small" />
        
        {isExpanded && document.doc_number && (
          <div className="document-card-details">
            <div className="document-card-details__row">
              <span className="document-card-details__label">Document No:</span>
              <span className="mono-field">{document.doc_number}</span>
            </div>
            {document.validity && (
              <div className="document-card-details__row">
                <span className="document-card-details__label">Validity:</span>
                <span>{document.validity}</span>
              </div>
            )}
            {document.issue_date && (
              <div className="document-card-details__row">
                <span className="document-card-details__label">Issue Date:</span>
                <span>{document.issue_date}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
