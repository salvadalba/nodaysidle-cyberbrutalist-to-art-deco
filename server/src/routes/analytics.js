import express from 'express'
import rateLimit from 'express-rate-limit'
import { trackEvent } from '../controllers/analytics.js'

const router = express.Router()

// Rate limiting: 100 requests per minute
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many analytics requests.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// POST /api/analytics - Track analytics event
router.post('/', analyticsLimiter, trackEvent)

export default router
