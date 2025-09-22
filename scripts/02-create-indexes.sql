-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_telegram_username ON users(telegram_username);
CREATE INDEX IF NOT EXISTS idx_users_key_value ON users(key_value);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_current_ip ON users(current_ip);
CREATE INDEX IF NOT EXISTS idx_users_key_expires_at ON users(key_expires_at);

CREATE INDEX IF NOT EXISTS idx_login_history_user_id ON login_history(user_id);
CREATE INDEX IF NOT EXISTS idx_login_history_ip_address ON login_history(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_history_login_attempt_at ON login_history(login_attempt_at);

CREATE INDEX IF NOT EXISTS idx_key_usage_history_user_id ON key_usage_history(user_id);
CREATE INDEX IF NOT EXISTS idx_key_usage_history_changed_at ON key_usage_history(changed_at);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_security_alerts_user_id ON security_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_security_alerts_alert_type ON security_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_security_alerts_severity ON security_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_security_alerts_is_resolved ON security_alerts(is_resolved);
