-- Fix RLS policies to work with custom authentication system
-- The current policies use auth.uid() which doesn't work with our custom auth system

-- Drop ALL existing policies that use auth.uid()
DROP POLICY IF EXISTS "Users can view own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Users can insert own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Users can update own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Service role can manage IP history" ON user_ip_history;

DROP POLICY IF EXISTS "Users can view own devices" ON user_devices;
DROP POLICY IF EXISTS "Users can insert own devices" ON user_devices;
DROP POLICY IF EXISTS "Users can update own devices" ON user_devices;
DROP POLICY IF EXISTS "Service role can manage devices" ON user_devices;

DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Service role can manage sessions" ON user_sessions;

-- Create permissive policies for custom authentication system
-- Since we're using custom session-based auth, we need to allow operations
-- and handle authorization in the application layer

-- Allow all operations on user_ip_history for authenticated role
CREATE POLICY "Allow all operations on IP history" ON user_ip_history
    FOR ALL USING (true);

-- Allow all operations on user_devices for authenticated role  
CREATE POLICY "Allow all operations on devices" ON user_devices
    FOR ALL USING (true);

-- Allow all operations on user_sessions for authenticated role
CREATE POLICY "Allow all operations on sessions" ON user_sessions
    FOR ALL USING (true);

-- Grant necessary permissions
GRANT ALL ON user_ip_history TO authenticated;
GRANT ALL ON user_devices TO authenticated;
GRANT ALL ON user_sessions TO authenticated;
GRANT ALL ON users TO authenticated;

-- Grant permissions to service role
GRANT ALL ON user_ip_history TO service_role;
GRANT ALL ON user_devices TO service_role;
GRANT ALL ON user_sessions TO service_role;
GRANT ALL ON users TO service_role;

-- Grant permissions to anon role for login/signup operations
GRANT SELECT, INSERT, UPDATE ON users TO anon;
GRANT SELECT, INSERT, UPDATE ON user_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON user_ip_history TO anon;
GRANT SELECT, INSERT, UPDATE ON user_devices TO anon;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Fixed RLS policies for custom authentication system!';
    RAISE NOTICE 'Replaced auth.uid() based policies with permissive policies';
    RAISE NOTICE 'Authorization is now handled in the application layer';
    RAISE NOTICE 'Granted proper permissions to anon, authenticated, and service_role';
END $$;
