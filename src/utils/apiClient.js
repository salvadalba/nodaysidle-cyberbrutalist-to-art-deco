/**
 * API Client - Reusable HTTP client for backend communication
 * Handles request/response, retry logic, and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

class APIClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl
    this.defaultTimeout = 10000 // 10 seconds
  }

  /**
   * Make an HTTP request with retry logic
   */
  async request(endpoint, options = {}, retries = 2) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    }

    try {
      const response = await this._fetchWithTimeout(url, config)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      // Retry on network errors
      if (retries > 0 && this._isRetryableError(error)) {
        console.log(`Retrying request to ${endpoint}, attempts left: ${retries}`)
        await this._delay(1000) // Wait before retry
        return this.request(endpoint, options, retries - 1)
      }

      throw error
    }
  }

  /**
   * Fetch with timeout
   */
  async _fetchWithTimeout(url, config) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.defaultTimeout)

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (error) {
      clearTimeout(timeoutId)
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    }
  }

  /**
   * Check if error is retryable
   */
  _isRetryableError(error) {
    return (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('timeout')
    )
  }

  /**
   * Delay helper
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * GET request
   */
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  /**
   * PUT request
   */
  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  /**
   * DELETE request
   */
  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new APIClient()
export default apiClient
