-- Fix RLS policies for pricing_plans table to allow proper access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read access" ON pricing_plans;
DROP POLICY IF EXISTS "Allow admin full access" ON pricing_plans;

-- Create policy for public read access (only active plans)
CREATE POLICY "pricing_plans_public_read" ON pricing_plans
  FOR SELECT 
  USING (is_active = true);

-- Create policy for authenticated users to read all plans (including inactive)
CREATE POLICY "pricing_plans_authenticated_read" ON pricing_plans
  FOR SELECT 
  USING (auth.role() = 'authenticated');

-- Create policy for service role to have full access (for admin operations)
CREATE POLICY "pricing_plans_service_role_all" ON pricing_plans
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT SELECT ON pricing_plans TO anon;
GRANT ALL ON pricing_plans TO authenticated;
GRANT ALL ON pricing_plans TO service_role;
