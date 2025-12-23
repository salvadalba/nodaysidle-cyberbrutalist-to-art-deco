import express from 'express'
import rateLimit from 'express-rate-limit'
import { submitContact } from '../controllers/contact.js'

const router = express.Router()

// Rate limiting: 3 requests per 15 minutes
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: { success: false, message: 'Too many contact form submissions. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// POST /api/contact - Submit contact form
router.post('/', contactLimiter, submitContact)

export default router
