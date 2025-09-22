-- Insert default admin user (password: admin123 - should be changed in production)
INSERT INTO admin_users (username, password_hash, email, role) 
VALUES (
    'admin',
    '$2b$10$rQZ8vQZ8vQZ8vQZ8vQZ8vOZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQZ8vQ', -- This should be properly hashed
    'admin@example.com',
    'super_admin'
) ON CONFLICT (username) DO NOTHING;

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
    ('max_failed_login_attempts', '5', 'Maximum failed login attempts before blocking'),
    ('key_expiry_warning_days', '3', 'Days before key expiry to send warning'),
    ('session_timeout_minutes', '60', 'Session timeout in minutes'),
    ('enable_ip_restriction', 'true', 'Enable IP-based device restriction'),
    ('enable_notifications', 'true', 'Enable system notifications')
ON CONFLICT (setting_key) DO NOTHING;
