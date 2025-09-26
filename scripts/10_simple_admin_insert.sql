-- সহজ টেস্টের জন্য plain text password দিয়ে অ্যাডমিন ইউজার
-- ইউজারনেম: billa
-- পাসওয়ার্ড: muthassim53@@

-- প্রথমে পুরানো এন্ট্রি মুছে ফেলুন
DELETE FROM admins WHERE username = 'billa';

-- Plain text password দিয়ে ইনসার্ট করুন (শুধুমাত্র টেস্টের জন্য)
INSERT INTO admins (username, full_name, password_hash) 
VALUES ('billa', 'বিল্লা অ্যাডমিন', 'muthassim53@@');

-- নোট: এটি টেস্টের জন্য। পরে সঠিক bcrypt hash ব্যবহার করতে হবে।
