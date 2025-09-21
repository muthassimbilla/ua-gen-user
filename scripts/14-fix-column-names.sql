-- Fix RLS policies and column names
-- সব RLS policy disable করে simple access দিই

-- Disable RLS on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON user_profiles;

-- Drop any existing functions
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- Create a simple view for user data access without RLS complications
CREATE OR REPLACE VIEW user_profiles_view AS
SELECT 
  up.id,
  up.email,
  up.full_name,
  up.telegram_username,
  up.user_agent_limit,
  up.subscription_end_date,
  up.status,
  up.role,
  up.created_at,
  up.updated_at,
  up.approved_at,
  up.approved_by,
  au.email as auth_email,
  au.created_at as auth_created_at
FROM user_profiles up
-- Fixed column name from user_id to id
LEFT JOIN auth.users au ON up.id = au.id;

-- Grant access to the view
GRANT SELECT ON user_profiles_view TO authenticated;
GRANT SELECT ON user_profiles_view TO anon;

-- Make sure pricing_packages table is accessible
GRANT SELECT ON pricing_packages TO authenticated;
GRANT SELECT ON pricing_packages TO anon;
