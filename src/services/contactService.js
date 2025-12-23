import { apiClient } from '../utils/apiClient'

/**
 * Contact Service - Handles contact form validation and submission
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate contact form data
 * @param {Object} data - Form data { name, email, message }
 * @returns {Object} - { valid: boolean, errors: Object }
 */
export function validateContactForm(data) {
  const errors = {}
  const { name, email, message } = data

  // Name validation
  if (!name || typeof name !== 'string') {
    errors.name = 'Name is required'
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
  } else if (name.trim().length > 100) {
    errors.name = 'Name must be less than 100 characters'
  }

  // Email validation
  if (!email || typeof email !== 'string') {
    errors.email = 'Email is required'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  // Message validation
  if (!message || typeof message !== 'string') {
    errors.message = 'Message is required'
  } else if (message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
  } else if (message.trim().length > 2000) {
    errors.message = 'Message must be less than 2000 characters'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * Submit contact form to backend
 * @param {Object} data - Form data { name, email, message }
 * @returns {Promise<Object>} - Response from server
 */
export async function submitContact(data) {
  // Client-side validation first
  const validation = validateContactForm(data)

  if (!validation.valid) {
    throw new Error(JSON.stringify(validation.errors))
  }

  // Sanitize data
  const sanitizedData = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    message: data.message.trim(),
  }

  try {
    const response = await apiClient.post('/api/contact', sanitizedData)
    return response
  } catch (error) {
    // Handle different error types
    if (error.message.includes('HTTP 429')) {
      throw new Error('Too many submissions. Please wait before trying again.')
    }
    if (error.message.includes('HTTP 400')) {
      throw new Error('Invalid form data. Please check your inputs.')
    }
    throw error
  }
}

export default {
  validateContactForm,
  submitContact,
}
