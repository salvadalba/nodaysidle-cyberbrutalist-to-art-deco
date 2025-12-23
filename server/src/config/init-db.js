import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pkg from 'pg'
import dotenv from 'dotenv'
const { Pool } = pkg

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function initDatabase() {
  // Read schema file
  const schemaPath = path.join(__dirname, '../../schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf-8')

  // Create a separate connection for initialization
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // Connect to default database first
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
  })

  try {
    console.log('Creating database...')

    // Create database if it doesn't exist
    await pool.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME || 'fabrizio_corona'}`)
    await pool.query(`CREATE DATABASE ${process.env.DB_NAME || 'fabrizio_corona'}`)

    console.log(`Database ${process.env.DB_NAME || 'fabrizio_corona'} created successfully`)

    // Close connection and reconnect to the new database
    await pool.end()

    const dbPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'fabrizio_corona',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD,
    })

    console.log('Running schema migrations...')
    await dbPool.query(schema)
    console.log('Database schema created successfully!')

    await dbPool.end()
    console.log('Database initialization complete!')

  } catch (error) {
    console.error('Database initialization error:', error)
    await pool.end()
    process.exit(1)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
}

export default initDatabase
