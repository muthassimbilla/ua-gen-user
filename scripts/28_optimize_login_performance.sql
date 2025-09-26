-- Optimize login performance by creating efficient database functions
-- This script creates optimized functions for faster login process

-- Create an optimized function to handle login with minimal queries
CREATE OR REPLACE FUNCTION handle_login_optimized(
    p_telegram_username TEXT,
    p_password_hash TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
    user_record RECORD;
    session_token TEXT;
    expires_at TIMESTAMP WITH TIME ZONE;
    result JSON;
BEGIN
    -- Get user data in a single query
    SELECT id, full_name, telegram_username, is_approved, account_status, is_active
    INTO user_record
    FROM users 
    WHERE telegram_username = p_telegram_username
    AND password_hash = p_password_hash
    AND is_active = true;
    
    -- If no user found, return error
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid credentials'
        );
    END IF;
    
    -- Check if user is approved
    IF NOT user_record.is_approved THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Account pending approval'
        );
    END IF;
    
    -- Generate session token and expiry
    session_token := gen_random_uuid()::text || '-' || extract(epoch from now())::text;
    expires_at := now() + interval '7 days';
    
    -- Logout other sessions for this user (if IP provided)
    IF p_ip_address IS NOT NULL THEN
        UPDATE user_sessions 
        SET is_active = false, 
            logout_reason = 'ip_changed'
        WHERE user_id = user_record.id 
        AND is_active = true
        AND ip_address != p_ip_address;
    END IF;
    
    -- Create new session
    INSERT INTO user_sessions (
        user_id, session_token, expires_at, ip_address, user_agent, is_active
    ) VALUES (
        user_record.id, session_token, expires_at, p_ip_address, p_user_agent, true
    );
    
    -- Log IP history (background operation)
    IF p_ip_address IS NOT NULL AND p_ip_address != '127.0.0.1'::inet THEN
        INSERT INTO user_ip_history (user_id, ip_address, is_current)
        VALUES (user_record.id, p_ip_address, true)
        ON CONFLICT (user_id, ip_address) 
        DO UPDATE SET is_current = true, last_seen = now();
        
        -- Mark other IPs as not current (background)
        UPDATE user_ip_history 
        SET is_current = false 
        WHERE user_id = user_record.id 
        AND ip_address != p_ip_address;
    END IF;
    
    -- Return success with user data and session token
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', user_record.id,
            'full_name', user_record.full_name,
            'telegram_username', user_record.telegram_username,
            'is_approved', user_record.is_approved,
            'account_status', user_record.account_status,
            'is_active', user_record.is_active
        ),
        'session_token', session_token,
        'expires_at', expires_at
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION handle_login_optimized(TEXT, TEXT, INET, TEXT) TO authenticated;

-- Create an optimized function to validate session
CREATE OR REPLACE FUNCTION validate_session_optimized(p_session_token TEXT)
RETURNS JSON AS $$
DECLARE
    session_record RECORD;
    user_record RECORD;
    result JSON;
BEGIN
    -- Get session and user data in a single query
    SELECT 
        s.id as session_id,
        s.user_id,
        s.expires_at,
        s.ip_address,
        s.is_active,
        u.full_name,
        u.telegram_username,
        u.is_approved,
        u.account_status,
        u.is_active as user_active
    INTO session_record
    FROM user_sessions s
    JOIN users u ON s.user_id = u.id
    WHERE s.session_token = p_session_token
    AND s.is_active = true
    AND s.expires_at > now();
    
    -- If no valid session found
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid or expired session'
        );
    END IF;
    
    -- Check if user is still active
    IF NOT session_record.user_active THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User account is deactivated'
        );
    END IF;
    
    -- Update last accessed time (background operation)
    UPDATE user_sessions 
    SET last_accessed = now()
    WHERE id = session_record.session_id;
    
    -- Return success with user data
    RETURN json_build_object(
        'success', true,
        'user', json_build_object(
            'id', session_record.user_id,
            'full_name', session_record.full_name,
            'telegram_username', session_record.telegram_username,
            'is_approved', session_record.is_approved,
            'account_status', session_record.account_status,
            'is_active', session_record.user_active
        ),
        'session', json_build_object(
            'id', session_record.session_id,
            'expires_at', session_record.expires_at,
            'ip_address', session_record.ip_address
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION validate_session_optimized(TEXT) TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_username_active ON users(telegram_username) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_active ON user_sessions(session_token) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id_active ON user_sessions(user_id) WHERE is_active = true;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Login performance optimization completed!';
    RAISE NOTICE 'New functions created: handle_login_optimized, validate_session_optimized';
    RAISE NOTICE 'Performance indexes added for faster queries';
    RAISE NOTICE 'Login process should now be significantly faster.';
END $$;
