-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check key expiry and send notifications
CREATE OR REPLACE FUNCTION check_key_expiry()
RETURNS void AS $$
BEGIN
    -- Insert notifications for keys expiring in 3 days
    INSERT INTO notifications (user_id, type, title, message)
    SELECT 
        u.id,
        'key_expiry',
        'Key Expiry Warning',
        'Your key will expire in ' || EXTRACT(DAY FROM (u.key_expires_at - NOW())) || ' days. Please renew your key.'
    FROM users u
    WHERE u.status = 'approved'
    AND u.key_expires_at IS NOT NULL
    AND u.key_expires_at BETWEEN NOW() AND NOW() + INTERVAL '3 days'
    AND NOT EXISTS (
        SELECT 1 FROM notifications n 
        WHERE n.user_id = u.id 
        AND n.type = 'key_expiry' 
        AND n.created_at > NOW() - INTERVAL '1 day'
    );
END;
$$ LANGUAGE plpgsql;

-- Function to log security alerts
CREATE OR REPLACE FUNCTION log_security_alert(
    p_user_id UUID,
    p_alert_type VARCHAR(50),
    p_description TEXT,
    p_ip_address INET DEFAULT NULL,
    p_device_info TEXT DEFAULT NULL,
    p_severity VARCHAR(20) DEFAULT 'medium'
)
RETURNS UUID AS $$
DECLARE
    alert_id UUID;
BEGIN
    INSERT INTO security_alerts (user_id, alert_type, description, ip_address, device_info, severity)
    VALUES (p_user_id, p_alert_type, p_description, p_ip_address, p_device_info, p_severity)
    RETURNING id INTO alert_id;
    
    -- Also create a notification for the user
    INSERT INTO notifications (user_id, type, title, message)
    VALUES (p_user_id, 'security_alert', 'Security Alert', p_description);
    
    RETURN alert_id;
END;
$$ LANGUAGE plpgsql;
