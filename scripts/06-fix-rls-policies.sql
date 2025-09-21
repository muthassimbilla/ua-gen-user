-- Fix RLS Policies to prevent infinite recursion
-- এই স্ক্রিপ্ট RLS policy এর infinite recursion সমস্যা ঠিক করবে

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage packages" ON pricing_packages;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON user_sessions;
DROP POLICY IF EXISTS "Admins can view admin actions" ON admin_actions;
DROP POLICY IF EXISTS "Admins can create admin actions" ON admin_actions;

-- Create a function to check if user is admin (using service role)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role IN ('admin', 'super_admin')
  );
END;
$$;

-- Recreate admin policies using the function
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON user_profiles
  FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR is_admin(auth.uid()));

-- Pricing packages policies
CREATE POLICY "Admins can manage packages" ON pricing_packages
  FOR ALL USING (is_admin(auth.uid()));

-- Transactions policies
CREATE POLICY "Admins can view all transactions" ON transactions
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update transactions" ON transactions
  FOR UPDATE USING (is_admin(auth.uid()));

-- User sessions policies
CREATE POLICY "Admins can view all sessions" ON user_sessions
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can insert sessions" ON user_sessions
  FOR INSERT WITH CHECK (true);

-- Admin actions policies
CREATE POLICY "Admins can view admin actions" ON admin_actions
  FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can create admin actions" ON admin_actions
  FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;
