-- ইউজার অনুমোদন সিস্টেম যোগ করুন
-- is_approved: ইউজার অনুমোদিত কিনা (ডিফল্ট: false)
-- approved_at: অনুমোদনের তারিখ
-- approved_by: কে অনুমোদন করেছে (admin user id)

-- is_approved কলাম যোগ করুন (ডিফল্ট: false)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- approved_at কলাম যোগ করুন
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE;

-- approved_by কলাম যোগ করুন (admin user reference)
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID;

-- ইন্ডেক্স তৈরি করুন দ্রুত অনুমোদন স্ট্যাটাস চেকের জন্য
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);
CREATE INDEX IF NOT EXISTS idx_users_approved_at ON users(approved_at);

-- existing users কে approved করে দিন (backward compatibility)
UPDATE users SET is_approved = true, approved_at = NOW() WHERE is_approved IS NULL OR is_approved = false;

-- Drop existing view first to avoid column conflicts
DROP VIEW IF EXISTS user_status_view;

-- user_status_view পুনরায় তৈরি করুন approval status যোগ করে
CREATE VIEW user_status_view AS
SELECT 
    id,
    full_name,
    telegram_username,
    account_status,
    expiration_date,
    created_at,
    updated_at,
    is_active,
    is_approved,
    approved_at,
    approved_by,
    CASE 
        WHEN is_approved = false THEN 'pending'
        WHEN account_status = 'suspended' THEN 'suspended'
        WHEN expiration_date IS NOT NULL AND expiration_date < NOW() THEN 'expired'
        WHEN account_status = 'active' AND is_approved = true AND (expiration_date IS NULL OR expiration_date > NOW()) THEN 'active'
        ELSE 'inactive'
    END as current_status
FROM users;

-- check_user_status ফাংশন আপডেট করুন approval check যোগ করতে
CREATE OR REPLACE FUNCTION check_user_status(user_id UUID)
RETURNS TABLE(
    is_valid BOOLEAN,
    status TEXT,
    message TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN current_status = 'active' THEN true
            ELSE false
        END as is_valid,
        current_status as status,
        CASE 
            WHEN current_status = 'pending' THEN 'আপনার একাউন্ট অনুমোদনের অপেক্ষায় রয়েছে। অ্যাডমিন অনুমোদন করলে লগইন করতে পারবেন।'
            WHEN current_status = 'suspended' THEN 'আপনার একাউন্ট সাসপেন্ড করা হয়েছে। ওয়েবসাইট ব্যবহার করতে পারবেন না।'
            WHEN current_status = 'expired' THEN 'আপনার একাউন্টের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।'
            WHEN current_status = 'active' THEN 'আপনার একাউন্ট সক্রিয় আছে।'
            ELSE 'আপনার একাউন্ট নিষ্ক্রিয়।'
        END as message
    FROM user_status_view
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- approve_user ফাংশন তৈরি করুন
CREATE OR REPLACE FUNCTION approve_user(
    target_user_id UUID,
    admin_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Check if user exists and is not already approved
    SELECT EXISTS(
        SELECT 1 FROM users 
        WHERE id = target_user_id AND is_approved = false
    ) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN false;
    END IF;
    
    -- Approve the user
    UPDATE users 
    SET 
        is_approved = true,
        approved_at = NOW(),
        approved_by = admin_user_id,
        updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- reject_user ফাংশন তৈরি করুন (optional - for future use)
CREATE OR REPLACE FUNCTION reject_user(
    target_user_id UUID,
    admin_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    user_exists BOOLEAN;
BEGIN
    -- Check if user exists
    SELECT EXISTS(
        SELECT 1 FROM users 
        WHERE id = target_user_id
    ) INTO user_exists;
    
    IF NOT user_exists THEN
        RETURN false;
    END IF;
    
    -- Set user as not approved (can be used to revoke approval)
    UPDATE users 
    SET 
        is_approved = false,
        approved_at = NULL,
        approved_by = NULL,
        updated_at = NOW()
    WHERE id = target_user_id;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS পলিসি আপডেট করুন
-- অ্যাডমিনরা pending users দেখতে পারবে
CREATE POLICY "Admins can view pending users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_sessions 
            WHERE session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
            AND expires_at > NOW()
        )
    );

COMMENT ON COLUMN users.is_approved IS 'ইউজার অনুমোদিত কিনা। false = pending, true = approved';
COMMENT ON COLUMN users.approved_at IS 'অনুমোদনের তারিখ ও সময়';
COMMENT ON COLUMN users.approved_by IS 'যে অ্যাডমিন অনুমোদন করেছে তার ID';
COMMENT ON FUNCTION approve_user(UUID, UUID) IS 'ইউজারকে অনুমোদন করে এবং অনুমোদনের তথ্য সংরক্ষণ করে';
COMMENT ON FUNCTION reject_user(UUID, UUID) IS 'ইউজারের অনুমোদন বাতিল করে';
