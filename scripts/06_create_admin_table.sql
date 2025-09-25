-- অ্যাডমিন টেবিল তৈরি করুন
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- অ্যাডমিন সেশন টেবিল তৈরি করুন
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES admins(id) ON DELETE CASCADE,
    session_token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- ইউজার টেবিলে is_active কলাম যোগ করুন (যদি না থাকে)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ডিফল্ট অ্যাডমিন তৈরি করুন (পাসওয়ার্ড: admin123)
INSERT INTO admins (username, full_name, password_hash) 
VALUES ('admin', 'সুপার অ্যাডমিন', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9S/EG')
ON CONFLICT (username) DO NOTHING;

-- অ্যাডমিন টেবিলের জন্য RLS নীতি
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- অ্যাডমিন টেবিলের জন্য নীতি (শুধুমাত্র অ্যাডমিনরা অ্যাক্সেস করতে পারবে)
CREATE POLICY "Admins can access admin table" ON admins
    FOR ALL USING (true);

CREATE POLICY "Admins can access admin sessions" ON admin_sessions
    FOR ALL USING (true);
