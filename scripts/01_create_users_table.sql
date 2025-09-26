-- Create users table for authentication system
-- This table will store user information with secure password hashing

CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    telegram_username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster telegram_username lookups
CREATE INDEX IF NOT EXISTS idx_users_telegram_username ON users(telegram_username);

-- Create index for faster created_at queries
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Add RLS (Row Level Security) policies for security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Policy: Allow insert for new user registration (handled by auth system)
CREATE POLICY "Allow user registration" ON users
    FOR INSERT WITH CHECK (true);
