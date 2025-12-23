import { useState, useEffect } from 'react'
import { useAnimationState } from '../contexts/AnimationStateContext'
import { submitContact, validateContactForm } from '../services/contactService'
import { trackContactFormView, trackContactFormSubmit } from '../services/analyticsService'

/**
 * ContactForm - Contact form with validation and submission
 */
function ContactForm() {
  const { activeTheme } = useAnimationState()
  const isDeco = activeTheme === 'deco'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  // Track form view on mount
  useEffect(() => {
    trackContactFormView()
  }, [])

  // Handle input changes with validation
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    // Validate field on change if already touched
    if (touched[name]) {
      const validation = validateContactForm({ ...formData, [name]: value })
      setErrors(prev => ({
        ...prev,
        [name]: validation.errors[name],
      }))
    }
  }

  // Handle blur (field was touched)
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))

    // Validate on blur
    const validation = validateContactForm(formData)
    setErrors(prev => ({
      ...prev,
      [name]: validation.errors[name],
    }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Mark all fields as touched
    setTouched({ name: true, email: true, message: true })

    // Validate all fields
    const validation = validateContactForm(formData)
    if (!validation.valid) {
      setErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      await submitContact(formData)
      setSubmitStatus('success')
      trackContactFormSubmit(true)

      // Reset form
      setFormData({ name: '', email: '', message: '' })
      setErrors({})
      setTouched({})
    } catch (error) {
      setSubmitStatus('error')
      trackContactFormSubmit(false)

      // Parse error message
      let errorMessage = 'An error occurred. Please try again.'
      try {
        const parsed = JSON.parse(error.message)
        if (typeof parsed === 'string') {
          errorMessage = parsed
        } else if (parsed.errors) {
          setErrors(parsed.errors)
          return
        }
      } catch {
        errorMessage = error.message
      }

      setErrors({ form: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getInputStyle = (fieldName) => {
    const baseStyle = "w-full px-4 py-3 border-2 bg-transparent transition-all duration-300"
    const errorStyle = errors[fieldName] ? 'border-cyber-error' : ''
    const focusStyle = 'focus:outline-none'

    return `${baseStyle} ${errorStyle} ${focusStyle}`.trim()
  }

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name field */}
        <div>
          <label
            htmlFor="name"
            className={`block text-sm uppercase tracking-wide mb-2 transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputStyle('name')}
            style={{
              borderColor: errors.name ? '#ff003c' : (isDeco ? '#d4af37' : '#00ff41'),
              color: isDeco ? '#2c2c2c' : '#00ff41',
            }}
            placeholder={isDeco ? 'Your Name' : 'ENTER_YOUR_NAME'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-cyber-error">{errors.name}</p>
          )}
        </div>

        {/* Email field */}
        <div>
          <label
            htmlFor="email"
            className={`block text-sm uppercase tracking-wide mb-2 transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={getInputStyle('email')}
            style={{
              borderColor: errors.email ? '#ff003c' : (isDeco ? '#d4af37' : '#00ff41'),
              color: isDeco ? '#2c2c2c' : '#00ff41',
            }}
            placeholder={isDeco ? 'your@email.com' : 'YOUR@EMAIL.COM'}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-cyber-error">{errors.email}</p>
          )}
        </div>

        {/* Message field */}
        <div>
          <label
            htmlFor="message"
            className={`block text-sm uppercase tracking-wide mb-2 transition-all duration-300 ${
              isDeco ? 'font-deco text-deco-charcoal' : 'font-brutalist text-cyber-neon'
            }`}
          >
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            rows={6}
            className={getInputStyle('message')}
            style={{
              borderColor: errors.message ? '#ff003c' : (isDeco ? '#d4af37' : '#00ff41'),
              color: isDeco ? '#2c2c2c' : '#00ff41',
            }}
            placeholder={isDeco ? 'Your message...' : 'ENTER_YOUR_MESSAGE...'}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-cyber-error">{errors.message}</p>
          )}
        </div>

        {/* Form-level error */}
        {errors.form && (
          <div className="p-4 border-2 border-cyber-error text-cyber-error text-sm">
            {errors.form}
          </div>
        )}

        {/* Success message */}
        {submitStatus === 'success' && (
          <div
            className="p-4 border-2 text-sm"
            style={{
              borderColor: '#00ff41',
              backgroundColor: isDeco ? 'rgba(0, 255, 65, 0.1)' : 'rgba(0, 255, 65, 0.05)',
              color: isDeco ? '#2c2c2c' : '#00ff41',
            }}
          >
            {isDeco ? '✦ Thank you for your message! We will get back to you soon. ✦' : 'MESSAGE_SENT_SUCCESSFULLY'}
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full px-6 py-4 uppercase tracking-wider font-bold
            border-2 transition-all duration-300
            ${isDeco ? 'font-deco' : 'font-brutalist'}
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
          `}
          style={{
            borderColor: isDeco ? '#d4af37' : '#00ff41',
            backgroundColor: isDeco ? '#d4af37' : '#00ff41',
            color: isDeco ? '#f5f0e1' : '#0a0a0a',
          }}
        >
          {isSubmitting
            ? (isDeco ? 'Sending...' : 'SENDING...')
            : (isDeco ? '✦ Send Message ✦' : '[ SEND_MESSAGE ]')
          }
        </button>
      </form>
    </div>
  )
}

export default ContactForm
