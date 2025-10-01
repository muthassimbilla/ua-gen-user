-- Create pricing_plans table
CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  duration TEXT,
  original_price TEXT,
  discount TEXT,
  description TEXT,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_popular BOOLEAN DEFAULT false,
  icon TEXT,
  gradient TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('landing', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_pricing_plans_type ON pricing_plans(plan_type);
CREATE INDEX IF NOT EXISTS idx_pricing_plans_order ON pricing_plans(display_order);

-- Insert default landing page pricing plans
INSERT INTO pricing_plans (name, price, duration, description, features, is_popular, icon, gradient, display_order, plan_type) VALUES
('Starter', '$9', 'month', 'Perfect for small teams getting started', 
 '["Up to 10 team members", "5 projects", "Basic analytics", "Email support", "1GB storage"]'::jsonb,
 false, 'Zap', 'from-blue-500 to-cyan-500', 1, 'landing'),
 
('Professional', '$29', 'month', 'For growing teams that need more power',
 '["Up to 50 team members", "Unlimited projects", "Advanced analytics", "Priority support", "50GB storage", "Custom workflows", "Time tracking"]'::jsonb,
 true, 'Sparkles', 'from-purple-500 to-pink-500', 2, 'landing'),
 
('Enterprise', '$99', 'month', 'For large organizations with advanced needs',
 '["Unlimited team members", "Unlimited projects", "Advanced analytics & reporting", "24/7 dedicated support", "Unlimited storage", "Custom workflows", "Time tracking", "SSO & advanced security", "Custom integrations"]'::jsonb,
 false, 'Crown', 'from-orange-500 to-red-500', 3, 'landing');

-- Insert default premium tools pricing plans
INSERT INTO pricing_plans (name, price, duration, original_price, discount, features, is_popular, gradient, display_order, plan_type) VALUES
('1 Month', '৳500', '1 মাস', NULL, NULL,
 '["সকল Premium Tools এক্সেস", "Unlimited User Agent Generation", "Unlimited Address Generation", "24/7 সাপোর্ট", "Regular Updates"]'::jsonb,
 false, 'from-blue-500 to-indigo-600', 1, 'premium'),
 
('3 Months', '৳1,200', '3 মাস', '৳1,500', '20% ছাড়',
 '["সকল Premium Tools এক্সেস", "Unlimited User Agent Generation", "Unlimited Address Generation", "Priority 24/7 সাপোর্ট", "Regular Updates", "Advanced Features"]'::jsonb,
 true, 'from-purple-500 to-pink-600', 2, 'premium'),
 
('6 Months', '৳2,000', '6 মাস', '৳3,000', '33% ছাড়',
 '["সকল Premium Tools এক্সেস", "Unlimited User Agent Generation", "Unlimited Address Generation", "VIP 24/7 সাপোর্ট", "Regular Updates", "Advanced Features", "Custom Solutions"]'::jsonb,
 false, 'from-orange-500 to-red-600', 3, 'premium');

-- Enable Row Level Security
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access" ON pricing_plans
  FOR SELECT USING (is_active = true);

-- Create policy for admin full access (you'll need to adjust this based on your admin auth)
CREATE POLICY "Allow admin full access" ON pricing_plans
  FOR ALL USING (true);
