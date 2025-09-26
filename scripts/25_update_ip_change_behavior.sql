-- Update IP change behavior to allow new IP login while logging out old IP sessions
-- This replaces the current behavior of blocking login on IP change

-- Create new function to handle IP change with session migration
CREATE OR REPLACE FUNCTION handle_ip_change_with_migration(
    p_user_id UUID, 
    p_old_ip INET, 
    p_new_ip INET,
    p_session_token TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    affected_count INTEGER;
    current_session_id UUID;
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
    
    -- Logout all other sessions with the old IP (but keep current session)
    UPDATE user_sessions 
    SET is_active = false, 
        logout_reason = 'ip_address_changed_other_session'
    WHERE user_id = p_user_id 
    AND is_active = true 
    AND ip_address = p_old_ip
    AND id != current_session_id;
    
    GET DIAGNOSTICS affected_count = ROW_COUNT;
    
    -- Update current session with new IP
    UPDATE user_sessions 
    SET ip_address = p_new_ip,
        updated_at = NOW()
    WHERE id = current_session_id;
    
    -- Log the IP change in history
    INSERT INTO user_ip_history (user_id, session_id, ip_address, is_current)
    VALUES (p_user_id, current_session_id, p_new_ip, true)
    ON CONFLICT DO NOTHING;
    
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
GRANT EXECUTE ON FUNCTION handle_ip_change_with_migration(UUID, INET, INET, TEXT) TO authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'IP change behavior updated successfully!';
    RAISE NOTICE 'New function handle_ip_change_with_migration created';
    RAISE NOTICE 'Users can now continue with new IP while old IP sessions are logged out';
END $$;
