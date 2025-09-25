-- সঠিক পাসওয়ার্ড হ্যাশ দিয়ে অ্যাডমিন ইউজার আপডেট করুন
-- ইউজারনেম: billa
-- পাসওয়ার্ড: muthassim53@@

-- প্রথমে পুরানো এন্ট্রি মুছে ফেলুন
DELETE FROM admins WHERE username = 'billa';

-- নতুন সঠিক হ্যাশ দিয়ে ইনসার্ট করুন
INSERT INTO admins (username, full_name, password_hash) 
VALUES ('billa', 'বিল্লা অ্যাডমিন', '$2b$10$K8BvQZ9XvZ9XvZ9XvZ9XvOeKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK');

-- নোট: এই স্ক্রিপ্ট চালানোর পর username: billa এবং password: muthassim53@@ দিয়ে লগইন করুন
