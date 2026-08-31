import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="folder-header">
      <nav aria-label="Satellite File Folders">
        <ul className="folder-tabs">
          <li>
            <NavLink
              to="/checkpoint/traffic"
              className={({ isActive }) => `folder-tab ${isActive ? 'active' : ''}`}
            >
              Traffic Satellite
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/checkpoint/legal"
              className={({ isActive }) => `folder-tab ${isActive ? 'active' : ''}`}
            >
              Legal Satellite
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/vault"
              className={({ isActive }) => `folder-tab ${isActive ? 'active' : ''}`}
            >
              Citizen Vault
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/civic-literacy"
              className={({ isActive }) => `folder-tab ${isActive ? 'active' : ''}`}
            >
              Civic Literacy Bridge
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="dossier-serial">
        DOSSIER NO. PR-2026-MVP
      </div>
    </header>
  )
}
