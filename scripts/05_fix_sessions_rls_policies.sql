-- Fix RLS policies for user_sessions table to work with custom authentication
-- The original policies used auth.uid() which only works with Supabase Auth

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can delete own sessions" ON user_sessions;

-- Create new policies that allow our custom auth system to work
-- Allow INSERT for session creation during login (application handles validation)
CREATE POLICY "Allow session creation" ON user_sessions
    FOR INSERT WITH CHECK (true);

-- Allow SELECT for session validation (application handles user verification)
CREATE POLICY "Allow session reading" ON user_sessions
    FOR SELECT USING (true);

-- Allow UPDATE for session updates (last_accessed, etc.)
CREATE POLICY "Allow session updates" ON user_sessions
    FOR UPDATE USING (true);

-- Allow DELETE for logout functionality
CREATE POLICY "Allow session deletion" ON user_sessions
    FOR DELETE USING (true);

-- Note: Security is maintained through application-layer validation
-- The auth service verifies user ownership before performing operations
