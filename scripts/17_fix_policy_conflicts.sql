-- Fix RLS policy conflicts by properly dropping all existing policies first
-- This script ensures no duplicate policy errors occur

-- Drop ALL existing policies for user_ip_history table
DROP POLICY IF EXISTS "Users can view own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Users can insert own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Users can update own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Service role can manage IP history" ON user_ip_history;

-- Drop ALL existing policies for user_devices table  
DROP POLICY IF EXISTS "Users can view own devices" ON user_devices;
DROP POLICY IF EXISTS "Users can insert own devices" ON user_devices;
DROP POLICY IF EXISTS "Users can update own devices" ON user_devices;
DROP POLICY IF EXISTS "Service role can manage devices" ON user_devices;

-- Drop ALL existing policies for user_sessions table (if any)
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Service role can manage sessions" ON user_sessions;

-- Now create fresh policies for user_ip_history table
CREATE POLICY "Users can view own IP history" ON user_ip_history
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own IP history" ON user_ip_history
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own IP history" ON user_ip_history
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Service role can manage IP history" ON user_ip_history
    FOR ALL USING (auth.role() = 'service_role');

-- Create fresh policies for user_devices table
CREATE POLICY "Users can view own devices" ON user_devices
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own devices" ON user_devices
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own devices" ON user_devices
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Service role can manage devices" ON user_devices  
    FOR ALL USING (auth.role() = 'service_role');

-- Create fresh policies for user_sessions table (for device tracking)
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can insert own sessions" ON user_sessions
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own sessions" ON user_sessions
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Service role can manage sessions" ON user_sessions
    FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_ip_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_devices TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_sessions TO authenticated;

-- Grant permissions to service role for function execution
GRANT ALL ON user_ip_history TO service_role;
GRANT ALL ON user_devices TO service_role;
GRANT ALL ON user_sessions TO service_role;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'All RLS policies recreated successfully!';
    RAISE NOTICE 'Fixed policy conflicts by dropping all existing policies first';
    RAISE NOTICE 'Added comprehensive policies for user_ip_history, user_devices, and user_sessions';
    RAISE NOTICE 'Granted proper permissions to authenticated and service_role';
END $$;
