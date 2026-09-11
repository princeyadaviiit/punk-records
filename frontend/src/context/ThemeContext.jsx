/**
 * Punk Records — Theme Context (Phase 2 Redesign)
 *
 * Manages app-wide dark/light theme state with localStorage persistence.
 *
 * Two themes:
 * - LIGHT: "The Government File" warm paper aesthetic (existing)
 * - DARK: "Identity Terminal" navy/charcoal checkpoint aesthetic (new)
 *
 * Theme choice applies globally via CSS custom properties and data-theme attribute.
 */

import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  // Initialize from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('punk-records-theme')
    return stored === 'dark' ? 'dark' : 'light'
  })

  // Apply theme to document root and persist to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('punk-records-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light')
  }

  const value = {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
