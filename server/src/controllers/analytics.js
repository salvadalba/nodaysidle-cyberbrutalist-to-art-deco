import { query } from '../config/db.js'

export async function trackEvent(req, res) {
  try {
    const { event, page, timestamp } = req.body

    // Validation
    if (!event || typeof event !== 'string' || event.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required'
      })
    }

    if (!page || typeof page !== 'string' || page.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Page path is required'
      })
    }

    // Sanitize inputs
    const sanitizedEvent = event.trim()
    const sanitizedPage = page.trim()
    const eventTimestamp = timestamp ? new Date(timestamp) : new Date()
    const userAgent = req.get('user-agent') || ''

    // Insert into database
    const result = await query(
      `INSERT INTO analytics (event_type, page_path, timestamp, user_agent)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [sanitizedEvent, sanitizedPage, eventTimestamp, userAgent]
    )

    res.status(201).json({
      success: true,
      id: result.rows[0].id
    })

  } catch (error) {
    console.error('Analytics tracking error:', error)
    res.status(500).json({
      success: false,
      message: 'An error occurred while tracking the event'
    })
  }
}
