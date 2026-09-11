/**
 * Punk Records — Auth Context (Phase 2 Redesign)
 *
 * Manages authentication state and session persistence.
 * Stores JWT token and user info (citizen or officer).
 *
 * Auth flow:
 * - User logs in via RolePicker → LoginCitizen or LoginOfficer
 * - JWT token + user info stored in context + sessionStorage
 * - Token sent in Authorization header for protected API calls
 * - Logout clears session
 */

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize from sessionStorage on mount
  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem('punk-records-token')
      const storedUser = sessionStorage.getItem('punk-records-user')

      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Failed to restore auth session:', error)
      sessionStorage.removeItem('punk-records-token')
      sessionStorage.removeItem('punk-records-user')
    } finally {
      setLoading(false)
    }
  }, [])

  // Persist to sessionStorage whenever auth state changes
  useEffect(() => {
    if (token && user) {
      sessionStorage.setItem('punk-records-token', token)
      sessionStorage.setItem('punk-records-user', JSON.stringify(user))
    } else {
      sessionStorage.removeItem('punk-records-token')
      sessionStorage.removeItem('punk-records-user')
    }
  }, [token, user])

  const login = (authToken, userData) => {
    setToken(authToken)
    setUser(userData)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('punk-records-token')
    sessionStorage.removeItem('punk-records-user')
  }

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isCitizen: user?.role === 'citizen',
    isOfficer: user?.role === 'traffic' || user?.role === 'banking',
    login,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
