-- Gilded Glitch Portfolio Database Schema
-- PostgreSQL schema for contact submissions and analytics

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;

-- Contacts table for storing form submissions
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Analytics table for tracking events
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  page_path VARCHAR(500) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Indexes for better query performance
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_page_path ON analytics(page_path);
CREATE INDEX idx_analytics_timestamp ON analytics(timestamp DESC);

-- Function to clean up old analytics data (optional, for data retention)
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS void AS $$
BEGIN
  DELETE FROM analytics
  WHERE timestamp < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Comment on tables
COMMENT ON TABLE contacts IS 'Stores contact form submissions from portfolio visitors';
COMMENT ON TABLE analytics IS 'Tracks user behavior and events for analytics';
