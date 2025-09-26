-- Additional admin functions for device and IP management

-- Function to get users with multiple devices
CREATE OR REPLACE FUNCTION get_users_with_multiple_devices()
RETURNS TABLE (
    user_id UUID,
    full_name TEXT,
    telegram_username TEXT,
    device_count BIGINT,
    active_sessions BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id as user_id,
        u.full_name,
        u.telegram_username,
        COUNT(DISTINCT ud.device_fingerprint) as device_count,
        COUNT(DISTINCT us.id) FILTER (WHERE us.is_active = true AND us.expires_at > NOW()) as active_sessions
    FROM users u
    LEFT JOIN user_devices ud ON u.id = ud.user_id AND ud.is_blocked = false
    LEFT JOIN user_sessions us ON u.id = us.user_id
    GROUP BY u.id, u.full_name, u.telegram_username
    HAVING COUNT(DISTINCT ud.device_fingerprint) > 1
    ORDER BY device_count DESC, active_sessions DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user session summary
CREATE OR REPLACE FUNCTION get_user_session_summary(p_user_id UUID)
RETURNS TABLE (
    total_sessions BIGINT,
    active_sessions BIGINT,
    expired_sessions BIGINT,
    devices_count BIGINT,
    unique_ips BIGINT,
    current_ip INET,
    last_login TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(us.id) as total_sessions,
        COUNT(us.id) FILTER (WHERE us.is_active = true AND us.expires_at > NOW()) as active_sessions,
        COUNT(us.id) FILTER (WHERE us.expires_at <= NOW()) as expired_sessions,
        COUNT(DISTINCT ud.device_fingerprint) as devices_count,
        COUNT(DISTINCT uih.ip_address) as unique_ips,
        (SELECT ip_address FROM user_ip_history WHERE user_id = p_user_id AND is_current = true LIMIT 1) as current_ip,
        MAX(us.created_at) as last_login
    FROM user_sessions us
    LEFT JOIN user_devices ud ON us.user_id = ud.user_id
    LEFT JOIN user_ip_history uih ON us.user_id = uih.user_id
    WHERE us.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_users_with_multiple_devices() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_session_summary(UUID) TO authenticated;
