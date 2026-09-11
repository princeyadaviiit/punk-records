import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // Filter tabs based on user role
  const getVisibleTabs = () => {
    if (!isAuthenticated) {
      // Show all tabs when not logged in
      return [
        { path: '/checkpoint/traffic', label: 'Traffic Satellite' },
        { path: '/checkpoint/legal', label: 'Legal Satellite' },
        { path: '/vault', label: 'Citizen Vault' },
        { path: '/civic-literacy', label: 'Civic Literacy Bridge' },
      ]
    }

    // Citizens only see Vault
    if (user?.role === 'citizen') {
      return [
        { path: '/vault', label: 'Citizen Vault' },
      ]
    }

    // Traffic officers only see Traffic
    if (user?.role === 'traffic') {
      return [
        { path: '/checkpoint/traffic', label: 'Traffic Satellite' },
      ]
    }

    // Banking officers only see Banking
    if (user?.role === 'banking') {
      return [
        { path: '/checkpoint/banking', label: 'Banking Satellite' },
      ]
    }

    // Default: show all
    return [
      { path: '/checkpoint/traffic', label: 'Traffic Satellite' },
      { path: '/checkpoint/legal', label: 'Legal Satellite' },
      { path: '/vault', label: 'Citizen Vault' },
      { path: '/civic-literacy', label: 'Civic Literacy Bridge' },
    ]
  }

  const visibleTabs = getVisibleTabs()

  return (
    <header className="folder-header">
      <nav aria-label="Satellite File Folders">
        <ul className="folder-tabs">
          {visibleTabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) => `folder-tab ${isActive ? 'active' : ''}`}
              >
                {tab.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="dossier-serial">
          DOSSIER NO. PR-2026-MVP
        </div>
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="btn-secondary"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            Logout
          </button>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
