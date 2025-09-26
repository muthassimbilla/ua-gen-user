-- Add IP and device tracking features to the database
-- This script adds tables and functions for single-device login and IP tracking

-- First, add additional columns to user_sessions table if they don't exist
DO $$ 
BEGIN
    -- Add device_fingerprint column for unique device identification
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_sessions' AND column_name = 'device_fingerprint') THEN
        ALTER TABLE user_sessions ADD COLUMN device_fingerprint TEXT;
    END IF;
    
    -- Add is_active column to track active sessions
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_sessions' AND column_name = 'is_active') THEN
        ALTER TABLE user_sessions ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add logout_reason column to track why session ended
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'user_sessions' AND column_name = 'logout_reason') THEN
        ALTER TABLE user_sessions ADD COLUMN logout_reason TEXT;
    END IF;
END $$;

-- Create user_devices table to track device information
CREATE TABLE IF NOT EXISTS user_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    device_fingerprint TEXT NOT NULL,
    device_name TEXT,
    browser_info TEXT,
    os_info TEXT,
    screen_resolution TEXT,
    timezone TEXT,
    language TEXT,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_trusted BOOLEAN DEFAULT false,
    is_blocked BOOLEAN DEFAULT false,
    total_logins INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, device_fingerprint)
);

-- Create user_ip_history table to track IP changes
CREATE TABLE IF NOT EXISTS user_ip_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id UUID REFERENCES user_sessions(id) ON DELETE CASCADE,
    ip_address INET NOT NULL,
    country TEXT,
    city TEXT,
    isp TEXT,
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_fingerprint ON user_devices(device_fingerprint);
CREATE INDEX IF NOT EXISTS idx_user_devices_last_seen ON user_devices(last_seen);
CREATE INDEX IF NOT EXISTS idx_user_ip_history_user_id ON user_ip_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_ip_history_session_id ON user_ip_history(session_id);
CREATE INDEX IF NOT EXISTS idx_user_ip_history_ip ON user_ip_history(ip_address);
CREATE INDEX IF NOT EXISTS idx_user_ip_history_current ON user_ip_history(is_current);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_sessions_ip_address ON user_sessions(ip_address);

-- Enable RLS for new tables
ALTER TABLE user_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_ip_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_devices
CREATE POLICY "Users can view own devices" ON user_devices
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update own devices" ON user_devices
    FOR UPDATE USING (user_id::text = auth.uid()::text);

-- RLS policies for user_ip_history  
CREATE POLICY "Users can view own IP history" ON user_ip_history
    FOR SELECT USING (user_id::text = auth.uid()::text);

-- Function to get user's current IP
CREATE OR REPLACE FUNCTION get_user_current_ip(p_user_id UUID)
RETURNS INET AS $$
DECLARE
    current_ip INET;
BEGIN
    SELECT ip_address INTO current_ip
    FROM user_sessions
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > NOW()
    ORDER BY last_accessed DESC
    LIMIT 1;
    
    RETURN current_ip;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's device count
CREATE OR REPLACE FUNCTION get_user_device_count(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    device_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT device_fingerprint) INTO device_count
    FROM user_devices
    WHERE user_id = p_user_id 
    AND is_blocked = false;
    
    RETURN COALESCE(device_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's active sessions count
CREATE OR REPLACE FUNCTION get_user_active_sessions(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
    session_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO session_count
    FROM user_sessions
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > NOW();
    
    RETURN COALESCE(session_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to logout user from all other devices (keep current session)
CREATE OR REPLACE FUNCTION logout_other_devices(p_user_id UUID, p_current_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE user_sessions 
    SET is_active = false, 
        logout_reason = 'logged_out_from_other_device'
    WHERE user_id = p_user_id 
    AND id != p_current_session_id 
    AND is_active = true;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to logout user from all devices due to IP change
CREATE OR REPLACE FUNCTION logout_due_to_ip_change(p_user_id UUID, p_old_ip INET, p_new_ip INET)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    UPDATE user_sessions 
    SET is_active = false, 
        logout_reason = 'ip_address_changed'
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND ip_address = p_old_ip;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- Log the IP change
    INSERT INTO user_ip_history (user_id, ip_address, is_current)
    VALUES (p_user_id, p_new_ip, true);
    
    -- Mark old IP as not current
    UPDATE user_ip_history 
    SET is_current = false 
    WHERE user_id = p_user_id 
    AND ip_address = p_old_ip;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track device login
CREATE OR REPLACE FUNCTION track_device_login(
    p_user_id UUID,
    p_device_fingerprint TEXT,
    p_device_name TEXT DEFAULT NULL,
    p_browser_info TEXT DEFAULT NULL,
    p_os_info TEXT DEFAULT NULL,
    p_screen_resolution TEXT DEFAULT NULL,
    p_timezone TEXT DEFAULT NULL,
    p_language TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    device_id UUID;
BEGIN
    -- Insert or update device information
    INSERT INTO user_devices (
        user_id, device_fingerprint, device_name, browser_info, 
        os_info, screen_resolution, timezone, language, 
        last_seen, total_logins
    )
    VALUES (
        p_user_id, p_device_fingerprint, p_device_name, p_browser_info,
        p_os_info, p_screen_resolution, p_timezone, p_language,
        NOW(), 1
    )
    ON CONFLICT (user_id, device_fingerprint) 
    DO UPDATE SET
        device_name = COALESCE(EXCLUDED.device_name, user_devices.device_name),
        browser_info = COALESCE(EXCLUDED.browser_info, user_devices.browser_info),
        os_info = COALESCE(EXCLUDED.os_info, user_devices.os_info),
        screen_resolution = COALESCE(EXCLUDED.screen_resolution, user_devices.screen_resolution),
        timezone = COALESCE(EXCLUDED.timezone, user_devices.timezone),
        language = COALESCE(EXCLUDED.language, user_devices.language),
        last_seen = NOW(),
        total_logins = user_devices.total_logins + 1,
        updated_at = NOW()
    RETURNING id INTO device_id;
    
    RETURN device_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if device is allowed (single device policy)
CREATE OR REPLACE FUNCTION is_device_allowed(p_user_id UUID, p_device_fingerprint TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    active_device_count INTEGER;
    is_current_device BOOLEAN;
BEGIN
    -- Check if this device is already registered for this user
    SELECT EXISTS(
        SELECT 1 FROM user_devices 
        WHERE user_id = p_user_id 
        AND device_fingerprint = p_device_fingerprint
        AND is_blocked = false
    ) INTO is_current_device;
    
    -- If this device is already registered, allow it
    IF is_current_device THEN
        RETURN true;
    END IF;
    
    -- Check how many active devices this user has
    SELECT COUNT(*) INTO active_device_count
    FROM user_devices ud
    WHERE ud.user_id = p_user_id 
    AND ud.is_blocked = false
    AND EXISTS (
        SELECT 1 FROM user_sessions us 
        WHERE us.user_id = p_user_id 
        AND us.device_fingerprint = ud.device_fingerprint
        AND us.is_active = true 
        AND us.expires_at > NOW()
    );
    
    -- Allow if no active devices (first login) or if single device policy allows
    RETURN active_device_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to cleanup expired sessions and update device status
CREATE OR REPLACE FUNCTION cleanup_expired_sessions_and_devices()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Mark expired sessions as inactive
    UPDATE user_sessions 
    SET is_active = false, logout_reason = 'session_expired'
    WHERE expires_at < NOW() AND is_active = true;
    
    -- Delete old expired sessions (older than 30 days)
    DELETE FROM user_sessions 
    WHERE expires_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Update device last_seen based on active sessions
    UPDATE user_devices 
    SET last_seen = (
        SELECT MAX(last_accessed) 
        FROM user_sessions 
        WHERE user_sessions.user_id = user_devices.user_id 
        AND user_sessions.device_fingerprint = user_devices.device_fingerprint
        AND user_sessions.is_active = true
    )
    WHERE EXISTS (
        SELECT 1 FROM user_sessions 
        WHERE user_sessions.user_id = user_devices.user_id 
        AND user_sessions.device_fingerprint = user_devices.device_fingerprint
        AND user_sessions.is_active = true
    );
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for admin to see user device information
CREATE OR REPLACE VIEW admin_user_devices AS
SELECT 
    u.id as user_id,
    u.full_name,
    u.telegram_username,
    ud.device_fingerprint,
    ud.device_name,
    ud.browser_info,
    ud.os_info,
    ud.first_seen,
    ud.last_seen,
    ud.total_logins,
    ud.is_trusted,
    ud.is_blocked,
    COUNT(us.id) as active_sessions,
    MAX(us.last_accessed) as last_session_activity,
    ARRAY_AGG(DISTINCT us.ip_address) FILTER (WHERE us.is_active = true) as current_ips
FROM users u
LEFT JOIN user_devices ud ON u.id = ud.user_id
LEFT JOIN user_sessions us ON u.id = us.user_id AND us.device_fingerprint = ud.device_fingerprint AND us.is_active = true
GROUP BY u.id, u.full_name, u.telegram_username, ud.id, ud.device_fingerprint, 
         ud.device_name, ud.browser_info, ud.os_info, ud.first_seen, 
         ud.last_seen, ud.total_logins, ud.is_trusted, ud.is_blocked;

-- Grant permissions for the view to authenticated users (for admin access)
GRANT SELECT ON admin_user_devices TO authenticated;
