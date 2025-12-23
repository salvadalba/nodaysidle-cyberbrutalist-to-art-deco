import { query } from '../config/db.js'

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function submitContact(req, res) {
  try {
    const { name, email, message } = req.body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Name must be at least 2 characters long'
      })
    }

    if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      })
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 2000 characters'
      })
    }

    // Sanitize inputs
    const sanitizedName = name.trim()
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedMessage = message.trim()

    // Insert into database
    const result = await query(
      `INSERT INTO contacts (name, email, message, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING id`,
      [sanitizedName, sanitizedEmail, sanitizedMessage]
    )

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      id: result.rows[0].id
    })

  } catch (error) {
    console.error('Contact form submission error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request. Please try again.'
    })
  }
}
