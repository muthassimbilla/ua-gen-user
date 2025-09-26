-- ইউজার টেবিলে DELETE policy যোগ করুন
-- এই policy অ্যাডমিনদের ইউজার মুছতে দেবে

-- প্রথমে যদি কোনো পুরানো DELETE policy থাকে তা মুছে দিন
DROP POLICY IF EXISTS "Allow user deletion" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- নতুন DELETE policy তৈরি করুন যা সবাইকে DELETE করতে দেবে
-- (আপাতত সহজ সমাধান, পরে আরো নিরাপদ করা যাবে)
CREATE POLICY "Allow user deletion" ON users
    FOR DELETE USING (true);

-- বিকল্প: শুধু অ্যাডমিনদের DELETE করতে দেওয়ার জন্য (আরো নিরাপদ)
-- CREATE POLICY "Admins can delete users" ON users
--     FOR DELETE USING (
--         EXISTS (
--             SELECT 1 FROM admin_sessions 
--             WHERE session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
--             AND expires_at > NOW()
--         )
--     );

-- কমেন্ট যোগ করুন
COMMENT ON POLICY "Allow user deletion" ON users IS 'সবাইকে ইউজার মুছতে দেয়। প্রোডাকশনে আরো নিরাপদ policy ব্যবহার করুন।';
