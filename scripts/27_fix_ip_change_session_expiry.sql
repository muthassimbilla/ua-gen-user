-- Fix IP change behavior to properly expire sessions when IP changes
-- This ensures that IP changes result in session expiration, not migration

-- Update the logout_due_to_ip_change function to be more robust
CREATE OR REPLACE FUNCTION logout_due_to_ip_change(
    p_user_id UUID,
    p_old_ip INET,
    p_new_ip INET
)
RETURNS INTEGER AS $$
DECLARE
    affected_count INTEGER;
BEGIN
    -- Logout all active sessions for this user
    UPDATE user_sessions 
    SET is_active = false, 
        logout_reason = 'ip_address_changed'
    WHERE user_id = p_user_id 
    AND is_active = true;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- Log the IP change in history
    INSERT INTO user_ip_history (user_id, ip_address, is_current)
    VALUES (p_user_id, p_new_ip, true)
    ON CONFLICT (user_id, ip_address) 
    DO UPDATE SET is_current = true, last_seen = NOW();
    
    -- Mark old IP as not current
    UPDATE user_ip_history 
    SET is_current = false 
    WHERE user_id = p_user_id 
    AND ip_address = p_old_ip;
    
    RETURN affected_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION logout_due_to_ip_change(UUID, INET, INET) TO authenticated;

-- Create a function to check if session should be expired due to IP change
CREATE OR REPLACE FUNCTION should_expire_session_for_ip_change(
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
    
    -- Don't expire session if either IP is localhost (for development)
    IF is_old_localhost OR is_new_localhost THEN
        RETURN false;
    END IF;
    
    -- For production IPs, expire session if IP changes
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION should_expire_session_for_ip_change(UUID, INET, INET) TO authenticated;

-- Create a function to handle IP change with proper session expiry
CREATE OR REPLACE FUNCTION handle_ip_change_with_expiry(
    p_user_id UUID,
    p_old_ip INET,
    p_new_ip INET
)
RETURNS BOOLEAN AS $$
DECLARE
    should_expire BOOLEAN;
    affected_count INTEGER;
BEGIN
    -- Check if session should be expired
    SELECT should_expire_session_for_ip_change(p_user_id, p_old_ip, p_new_ip) INTO should_expire;
    
    IF NOT should_expire THEN
        -- For localhost/development, just update the IP
        UPDATE user_sessions 
        SET ip_address = p_new_ip,
            updated_at = NOW()
        WHERE user_id = p_user_id 
        AND is_active = true;
        
        RETURN true;
    END IF;
    
    -- For production IPs, expire all sessions
    SELECT logout_due_to_ip_change(p_user_id, p_old_ip, p_new_ip) INTO affected_count;
    
    RETURN affected_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_ip_change_with_expiry(UUID, INET, INET) TO authenticated;

-- Update the existing migration function to use expiry instead of migration
CREATE OR REPLACE FUNCTION handle_ip_change_with_migration(
    p_user_id UUID, 
    p_old_ip INET, 
    p_new_ip INET,
    p_session_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    should_expire BOOLEAN;
BEGIN
    -- Check if session should be expired due to IP change
    SELECT should_expire_session_for_ip_change(p_user_id, p_old_ip, p_new_ip) INTO should_expire;
    
    IF should_expire THEN
        -- Expire all sessions for this user
        PERFORM logout_due_to_ip_change(p_user_id, p_old_ip, p_new_ip);
        RETURN false; -- Session expired
    ELSE
        -- For localhost/development, just update the session IP
        UPDATE user_sessions 
        SET ip_address = p_new_ip,
            updated_at = NOW()
        WHERE session_token = p_session_token 
        AND user_id = p_user_id
        AND is_active = true;
        
        RETURN true; -- Session updated
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_ip_change_with_migration(UUID, INET, INET, TEXT) TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'IP change session expiry behavior fixed successfully!';
    RAISE NOTICE 'New functions created: should_expire_session_for_ip_change, handle_ip_change_with_expiry';
    RAISE NOTICE 'Updated: logout_due_to_ip_change, handle_ip_change_with_migration';
    RAISE NOTICE 'Sessions will now properly expire when IP changes (except for localhost/development)';
END $$;
