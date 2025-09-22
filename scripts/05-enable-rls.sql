-- Enable Row Level Security (RLS) for all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_usage_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for login_history table
CREATE POLICY "Users can view their own login history" ON login_history
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create RLS policies for key_usage_history table
CREATE POLICY "Users can view their own key usage history" ON key_usage_history
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Create RLS policies for notifications table
CREATE POLICY "Users can view their own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Admin policies (these would need to be adjusted based on your auth setup)
CREATE POLICY "Admins can view all data" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all login history" ON login_history
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all notifications" ON notifications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view all security alerts" ON security_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
        )
    );

CREATE POLICY "Admins can view system settings" ON system_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM admin_users 
            WHERE id::text = auth.uid()::text
        )
    );
