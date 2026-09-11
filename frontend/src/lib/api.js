/**
 * Punk Records — API Client (Phase 2 Redesign)
 *
 * Centralized API communication with error handling.
 * Base URL configured via VITE_API_URL environment variable.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

class APIError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'APIError'
    this.status = status
    this.data = data
  }
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new APIError(
        data.detail || 'Request failed',
        response.status,
        data
      )
    }

    return data
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    // Network or parsing error
    throw new APIError(
      'Network error - unable to reach server',
      0,
      { original: error.message }
    )
  }
}

export const api = {
  // Auth endpoints
  auth: {
    citizen: async (idType, idValue) => {
      return fetchAPI('/api/auth/citizen', {
        method: 'POST',
        body: JSON.stringify({
          id_type: idType,
          id_value: idValue,
        }),
      })
    },

    officer: async (role, badgeId, password) => {
      return fetchAPI('/api/auth/officer', {
        method: 'POST',
        body: JSON.stringify({
          role,
          badge_id: badgeId,
          password,
        }),
      })
    },
  },

  // Checkpoint endpoints (existing - for reference)
  checkpoint: {
    traffic: async (citizenId, token) => {
      return fetchAPI(`/api/checkpoint/traffic/${citizenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    },

    legal: async (citizenId, token) => {
      return fetchAPI(`/api/checkpoint/legal/${citizenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    },
  },

  // Vault endpoint (existing - for reference)
  vault: {
    get: async (citizenId, token) => {
      return fetchAPI(`/api/vault/${citizenId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
    },
  },

  // Citizens list (existing - for reference)
  citizens: {
    list: async (token) => {
      return fetchAPI('/api/citizens', {
        headers: { Authorization: `Bearer ${token}` },
      })
    },
  },
}

export { APIError }
