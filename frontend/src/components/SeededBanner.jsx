/**
 * Punk Records — Seeded Banner Component (Phase 2 Redesign)
 *
 * Disclosed preview banner for seeded/static Satellites.
 * Consistent with existing seeded-banner-bar styling.
 */

export default function SeededBanner({ title, text }) {
  return (
    <div className="seeded-banner-bar">
      <div className="seeded-banner-bar__title">
        {title || 'Seeded Preview'}
      </div>
      <div className="seeded-banner-bar__text">
        {text || 'This view contains seeded data for demonstration purposes.'}
      </div>
    </div>
  )
}
