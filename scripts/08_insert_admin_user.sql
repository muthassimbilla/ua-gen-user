-- নির্দিষ্ট অ্যাডমিন ইউজার যোগ করুন
-- ইউজারনেম: billa
-- পাসওয়ার্ড: muthassim53@@

INSERT INTO admins (username, full_name, password_hash) 
VALUES ('billa', 'বিল্লা অ্যাডমিন', '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON CONFLICT (username) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- নোট: এই পাসওয়ার্ড হ্যাশ 'muthassim53@@' এর জন্য bcrypt দিয়ে তৈরি করা হয়েছে
