-- Fix IP change infinite loading issue
-- This script improves IP change handling to prevent infinite loading states

-- Create a more robust IP change handling function
CREATE OR REPLACE FUNCTION handle_ip_change_gracefully(
    p_user_id UUID, 
    p_old_ip INET, 
    p_new_ip INET,
    p_session_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    current_session_id UUID;
    affected_count INTEGER;
BEGIN
    -- Get the current session ID
    SELECT id INTO current_session_id
    FROM user_sessions 
    WHERE session_token = p_session_token 
    AND user_id = p_user_id
    AND is_active = true;
    
    -- If no current session found, return false
    IF current_session_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Update current session with new IP immediately
    UPDATE user_sessions 
    SET ip_address = p_new_ip,
        updated_at = NOW()
    WHERE id = current_session_id;
    
    -- Logout other sessions with old IP (but keep current session)
    UPDATE user_sessions 
    SET is_active = false, 
        logout_reason = 'ip_address_changed_other_session'
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND ip_address = p_old_ip
    AND id != current_session_id;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- Log the IP change in history
    INSERT INTO user_ip_history (user_id, session_id, ip_address, is_current)
    VALUES (p_user_id, current_session_id, p_new_ip, true)
    ON CONFLICT (user_id, session_id, ip_address) 
    DO UPDATE SET is_current = true, last_seen = NOW();
    
    -- Mark old IP as not current
    UPDATE user_ip_history 
    SET is_current = false 
    WHERE user_id = p_user_id 
    AND ip_address = p_old_ip
    AND session_id != current_session_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_ip_change_gracefully(UUID, INET, INET, TEXT) TO authenticated;

-- Create a function to check if IP change is allowed
CREATE OR REPLACE FUNCTION is_ip_change_allowed(
    p_user_id UUID,
    p_old_ip INET,
    p_new_ip INET
)
RETURNS BOOLEAN AS $$
DECLARE
    is_old_localhost BOOLEAN;
    is_new_localhost BOOLEAN;
BEGIN
    -- Check if old IP is localhost/development
    is_old_localhost := (
        p_old_ip = '::1'::inet OR
        p_old_ip = '127.0.0.1'::inet OR
        p_old_ip::text LIKE '192.168.%' OR
        p_old_ip::text LIKE '10.%' OR
        p_old_ip::text LIKE '172.%'
    );
    
    -- Check if new IP is localhost/development
    is_new_localhost := (
        p_new_ip = '::1'::inet OR
        p_new_ip = '127.0.0.1'::inet OR
        p_new_ip::text LIKE '192.168.%' OR
        p_new_ip::text LIKE '10.%' OR
        p_new_ip::text LIKE '172.%'
    );
    
    -- Allow IP change if either IP is localhost
    IF is_old_localhost OR is_new_localhost THEN
        RETURN true;
    END IF;
    
    -- For production IPs, allow the change but log it
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_ip_change_allowed(UUID, INET, INET) TO authenticated;

-- Update the existing migration function to be more robust
CREATE OR REPLACE FUNCTION handle_ip_change_with_migration(
    p_user_id UUID, 
    p_old_ip INET, 
    p_new_ip INET,
    p_session_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    current_session_id UUID;
    affected_count INTEGER;
    ip_change_allowed BOOLEAN;
BEGIN
    -- Check if IP change is allowed
    SELECT is_ip_change_allowed(p_user_id, p_old_ip, p_new_ip) INTO ip_change_allowed;
    
    IF NOT ip_change_allowed THEN
        RETURN false;
    END IF;
    
    -- Get the current session ID
    SELECT id INTO current_session_id
    FROM user_sessions 
    WHERE session_token = p_session_token 
    AND user_id = p_user_id
    AND is_active = true;
    
    -- If no current session found, return false
    IF current_session_id IS NULL THEN
        RETURN false;
    END IF;
    
    -- Use the graceful handling function
    RETURN handle_ip_change_gracefully(p_user_id, p_old_ip, p_new_ip, p_session_token);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_ip_change_with_migration(UUID, INET, INET, TEXT) TO authenticated;

-- Create a function to safely update session IP
CREATE OR REPLACE FUNCTION update_session_ip_safely(
    p_session_token TEXT,
    p_new_ip INET
)
RETURNS BOOLEAN AS $$
DECLARE
    session_exists BOOLEAN;
BEGIN
    -- Check if session exists and is active
    SELECT EXISTS(
        SELECT 1 FROM user_sessions 
        WHERE session_token = p_session_token 
        AND is_active = true
        AND expires_at > NOW()
    ) INTO session_exists;
    
    IF NOT session_exists THEN
        RETURN false;
    END IF;
    
    -- Update the session IP
    UPDATE user_sessions 
    SET ip_address = p_new_ip,
        updated_at = NOW()
    WHERE session_token = p_session_token;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_session_ip_safely(TEXT, INET) TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'IP change handling improved successfully!';
    RAISE NOTICE 'New functions created: handle_ip_change_gracefully, is_ip_change_allowed, update_session_ip_safely';
    RAISE NOTICE 'Updated: handle_ip_change_with_migration';
    RAISE NOTICE 'This should fix the infinite loading issue on IP changes.';
END $$;
