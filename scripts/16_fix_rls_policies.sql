-- Fix RLS policies for user_ip_history table
-- The table needs INSERT and UPDATE policies for proper functionality

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Users can insert own IP history" ON user_ip_history;
DROP POLICY IF EXISTS "Users can update own IP history" ON user_ip_history;

DROP POLICY IF EXISTS "Users can insert own devices" ON user_devices;
DROP POLICY IF EXISTS "Users can update own devices" ON user_devices;

-- RLS policies for user_ip_history table
CREATE POLICY "Users can view own IP history" ON user_ip_history
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Added INSERT policy for user_ip_history
CREATE POLICY "Users can insert own IP history" ON user_ip_history
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Added UPDATE policy for user_ip_history  
CREATE POLICY "Users can update own IP history" ON user_ip_history
    FOR UPDATE USING (user_id::text = auth.uid()::text);

-- RLS policies for user_devices table
CREATE POLICY "Users can view own devices" ON user_devices
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Added INSERT policy for user_devices
CREATE POLICY "Users can insert own devices" ON user_devices
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

-- Added UPDATE policy for user_devices
CREATE POLICY "Users can update own devices" ON user_devices
    FOR UPDATE USING (user_id::text = auth.uid()::text);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON user_ip_history TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_devices TO authenticated;

-- Also need to allow service role to bypass RLS for functions
-- Added policies for service role to allow function execution
CREATE POLICY "Service role can manage IP history" ON user_ip_history
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage devices" ON user_devices  
    FOR ALL USING (auth.role() = 'service_role');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'RLS policies updated successfully!';
    RAISE NOTICE 'Added INSERT and UPDATE policies for user_ip_history';
    RAISE NOTICE 'Added INSERT and UPDATE policies for user_devices';
    RAISE NOTICE 'Added service role policies for function execution';
END $$;
