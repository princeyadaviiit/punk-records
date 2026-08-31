import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <span className="navbar__logo">⬡ Punk Records</span>
      <ul className="navbar__links">
        <li>
          <NavLink
            to="/checkpoint/traffic"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Traffic Satellite
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/checkpoint/legal"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Legal Satellite
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/vault"
            className={({ isActive }) => isActive ? 'active' : ''}
          >
            Vault
          </NavLink>
        </li>
      </ul>
      <span className="navbar__scope-tag">MVP · Phase A</span>
    </nav>
  )
}
