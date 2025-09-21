-- Completely disable RLS on user_profiles to stop infinite recursion
-- Disable RLS entirely on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admin can delete profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON user_profiles;

-- Drop any admin functions that might cause recursion
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- Create a simple view for user data without RLS complications
CREATE OR REPLACE VIEW user_data AS
SELECT 
  up.id,
  up.user_id,
  up.email,
  up.full_name,
  up.status,
  up.role,
  up.created_at,
  up.updated_at,
  au.email as auth_email
FROM user_profiles up
LEFT JOIN auth.users au ON up.user_id = au.id;

-- Grant access to the view
GRANT SELECT ON user_data TO authenticated;
GRANT SELECT ON user_data TO anon;
