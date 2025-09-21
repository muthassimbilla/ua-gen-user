-- Completely disable RLS to avoid infinite recursion
-- This will allow all users to read their own profiles and packages

-- Disable RLS on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to clean up
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can update all user profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can delete user profiles" ON user_profiles;

-- Drop the problematic admin function
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS is_admin(uuid);

-- Enable RLS but with simple policies that don't cause recursion
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Simple policy: users can only see their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Simple policy: users can update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Admin policy using direct email check (no function)
CREATE POLICY "Admin can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'muthassim16@gmail.com'
        )
    );

CREATE POLICY "Admin can update all profiles" ON user_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'muthassim16@gmail.com'
        )
    );

CREATE POLICY "Admin can delete profiles" ON user_profiles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email = 'muthassim16@gmail.com'
        )
    );

-- Ensure pricing_packages table is accessible to all authenticated users
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view active packages" ON pricing_packages;

-- Allow all authenticated users to view active packages
CREATE POLICY "Anyone can view active packages" ON pricing_packages
    FOR SELECT USING (is_active = true);
