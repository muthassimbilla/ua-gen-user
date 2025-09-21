-- Drop all admin-related policies first
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON user_profiles;

-- Now drop all versions of is_admin function
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS is_admin(uuid) CASCADE;

-- Create a simple admin check function that avoids recursion
-- This function checks if the current user's email is in the admin list
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users 
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email IN (
      'admin@example.com',
      'support@example.com'
    )
  );
$$;

-- Recreate admin policies using the new function
CREATE POLICY "Admins can view all user profiles"
ON user_profiles
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can update all user profiles"
ON user_profiles
FOR UPDATE
TO authenticated
USING (is_admin());

CREATE POLICY "Admins can delete user profiles"
ON user_profiles
FOR DELETE
TO authenticated
USING (is_admin());

-- Also update the regular user policies to be more explicit
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id OR is_admin());
