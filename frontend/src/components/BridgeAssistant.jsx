/**
 * Punk Records — Bridge Assistant Component (Phase 2 Redesign)
 *
 * Disabled Bridge Assistant module for Vault.
 * MVP: Non-live, clearly marked as "coming soon".
 * Matches reference screenshot prompt-style input.
 */

export default function BridgeAssistant() {
  return (
    <div className="bridge-assistant">
      <div className="bridge-assistant__header">
        <span className="bridge-assistant__icon">💬</span>
        <h3 className="bridge-assistant__title">The Bridge Assistant</h3>
        <span className="bridge-assistant__badge">Coming Soon</span>
      </div>
      <div className="bridge-assistant__body">
        <input
          type="text"
          className="bridge-assistant__input"
          placeholder='Ask: "What do I need to show at a checkpoint?"'
          disabled
          aria-label="Bridge Assistant (coming soon)"
        />
        <p className="bridge-assistant__hint">
          Get instant answers about your statutory rights, required documents, and checkpoint procedures.
        </p>
      </div>
    </div>
  )
}
