-- Seed Data
-- এই স্ক্রিপ্ট initial data insert করবে

-- Insert default pricing packages
INSERT INTO pricing_packages (name, description, price, duration_days, user_agent_limit, features) VALUES
(
  'Basic Plan',
  'Perfect for individual users',
  9.99,
  7,
  50,
  '["50 User Agents per day", "Basic Support", "7 days access"]'
),
(
  'Pro Plan',
  'Great for small teams',
  29.99,
  30,
  200,
  '["200 User Agents per day", "Priority Support", "30 days access", "Advanced Features"]'
),
(
  'Enterprise Plan',
  'Unlimited access for businesses',
  99.99,
  365,
  -1,
  '["Unlimited User Agents", "24/7 Support", "1 year access", "Custom Integration", "API Access"]'
);

-- Create a sample admin user (you'll need to update this with actual admin email)
-- Note: This will only work after the user signs up through Supabase Auth
-- UPDATE user_profiles SET role = 'admin', status = 'approved' WHERE email = 'admin@gmail.com';
