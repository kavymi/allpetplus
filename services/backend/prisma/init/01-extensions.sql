-- PostgreSQL Extensions for All Pet Plus
-- This script initializes required extensions for optimal performance and security

-- UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Full-text search (future use)
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- JSON validation
CREATE EXTENSION IF NOT EXISTS "plpgsql";

-- Row-level security helpers
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Set up performance defaults
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';

-- Create application roles
DO $$
BEGIN
    -- Read-only role for replicas and analytics
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_reader') THEN
        CREATE ROLE app_reader;
    END IF;
    
    -- Read-write role for application
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_writer') THEN
        CREATE ROLE app_writer;
    END IF;
    
    -- Admin role for migrations
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_admin') THEN
        CREATE ROLE app_admin;
    END IF;
END
$$;

-- Grant basic permissions
GRANT CONNECT ON DATABASE harness_hero TO app_reader, app_writer, app_admin;
GRANT USAGE ON SCHEMA public TO app_reader, app_writer, app_admin;

-- Set statement timeout for application connections
ALTER DATABASE harness_hero SET statement_timeout = '30s';

-- Create audit schema
CREATE SCHEMA IF NOT EXISTS audit AUTHORIZATION postgres;

-- Create helper function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
