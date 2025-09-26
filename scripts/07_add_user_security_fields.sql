-- ইউজার টেবিলে সিকিউরিটি ফিল্ড যোগ করুন
-- expiration_date: ইউজার অ্যাকাউন্টের মেয়াদ উত্তীর্ণের তারিখ
-- account_status: অ্যাকাউন্টের বর্তমান অবস্থা (active, suspended, expired)

-- expiration_date কলাম যোগ করুন (NULL মানে কোনো মেয়াদ নেই)
ALTER TABLE users ADD COLUMN IF NOT EXISTS expiration_date TIMESTAMP WITH TIME ZONE;

-- account_status কলাম যোগ করুন (ডিফল্ট: active)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'account_status_enum') THEN
        CREATE TYPE account_status_enum AS ENUM ('active', 'suspended', 'expired');
    END IF;
END $$;

ALTER TABLE users ADD COLUMN IF NOT EXISTS account_status account_status_enum DEFAULT 'active';

-- ইন্ডেক্স তৈরি করুন দ্রুত স্ট্যাটাস চেকের জন্য
CREATE INDEX IF NOT EXISTS idx_users_account_status ON users(account_status);
CREATE INDEX IF NOT EXISTS idx_users_expiration_date ON users(expiration_date);

-- ভিউ তৈরি করুন রিয়েল-টাইম স্ট্যাটাস চেকের জন্য
CREATE OR REPLACE VIEW user_status_view AS
SELECT 
    id,
    full_name,
    telegram_username,
    account_status,
    expiration_date,
    created_at,
    updated_at,
    is_active,
    CASE 
        WHEN account_status = 'suspended' THEN 'suspended'
        WHEN expiration_date IS NOT NULL AND expiration_date < NOW() THEN 'expired'
        WHEN account_status = 'active' AND (expiration_date IS NULL OR expiration_date > NOW()) THEN 'active'
        ELSE 'inactive'
    END as current_status
FROM users;

-- ফাংশন তৈরি করুন ইউজার স্ট্যাটাস চেক করার জন্য
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
            WHEN current_status = 'suspended' THEN 'আপনার একাউন্ট সাসপেন্ড করা হয়েছে। ওয়েবসাইট ব্যবহার করতে পারবেন না।'
            WHEN current_status = 'expired' THEN 'আপনার একাউন্টের মেয়াদ শেষ হয়েছে। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।'
            WHEN current_status = 'active' THEN 'আপনার একাউন্ট সক্রিয় আছে।'
            ELSE 'আপনার একাউন্ট নিষ্ক্রিয়।'
        END as message
    FROM user_status_view
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS পলিসি আপডেট করুন
-- অ্যাডমিনরা সব ইউজারের স্ট্যাটাস দেখতে পারবে
CREATE POLICY "Admins can view all user status" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM admin_sessions 
            WHERE session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
            AND expires_at > NOW()
        )
    );

-- ইউজাররা শুধু নিজেদের স্ট্যাটাস দেখতে পারবে
CREATE POLICY "Users can view own status" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

COMMENT ON COLUMN users.expiration_date IS 'ইউজার অ্যাকাউন্টের মেয়াদ উত্তীর্ণের তারিখ। NULL মানে কোনো মেয়াদ নেই।';
COMMENT ON COLUMN users.account_status IS 'অ্যাকাউন্টের বর্তমান অবস্থা: active, suspended, expired';
COMMENT ON FUNCTION check_user_status(UUID) IS 'ইউজারের বর্তমান স্ট্যাটাস চেক করে এবং উপযুক্ত বার্তা প্রদান করে';
