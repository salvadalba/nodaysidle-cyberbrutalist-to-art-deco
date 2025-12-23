export function errorHandler(err, req, res, next) {
  console.error('Error:', err)

  // PostgreSQL errors
  if (err.code) {
    switch (err.code) {
      case '23505': // Unique violation
        return res.status(409).json({
          success: false,
          message: 'This record already exists'
        })
      case '23503': // Foreign key violation
        return res.status(400).json({
          success: false,
          message: 'Referenced record does not exist'
        })
      case '23502': // Not null violation
        return res.status(400).json({
          success: false,
          message: 'Required field is missing'
        })
      case '3D000': // Invalid database name
      case '08001': // Connection does not exist
        return res.status(503).json({
          success: false,
          message: 'Database connection error. Please try again later.'
        })
    }
  }

  // Default error response
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred'
  })
}
