-- Database Views
-- এই স্ক্রিপ্ট analytics এবং reporting এর জন্য views তৈরি করবে

-- User statistics view
CREATE OR REPLACE VIEW user_stats AS
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_users,
  COUNT(*) FILTER (WHERE status = 'approved') as approved_users,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected_users,
  COUNT(*) FILTER (WHERE status = 'suspended') as suspended_users,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) as new_today,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as new_this_week,
  COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as new_this_month
FROM user_profiles;

-- Transaction statistics view
CREATE OR REPLACE VIEW transaction_stats AS
SELECT 
  COUNT(*) as total_transactions,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_transactions,
  COUNT(*) FILTER (WHERE status = 'pending') as pending_transactions,
  SUM(amount) FILTER (WHERE status = 'completed') as total_revenue,
  SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE) as revenue_today,
  SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as revenue_this_week,
  SUM(amount) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '30 days') as revenue_this_month
FROM transactions;

-- Popular packages view
CREATE OR REPLACE VIEW popular_packages AS
SELECT 
  pp.name,
  pp.price,
  COUNT(t.id) as purchase_count,
  SUM(t.amount) as total_revenue
FROM pricing_packages pp
LEFT JOIN transactions t ON pp.id = t.package_id AND t.status = 'completed'
GROUP BY pp.id, pp.name, pp.price
ORDER BY purchase_count DESC;

-- Recent admin actions view
CREATE OR REPLACE VIEW recent_admin_actions AS
SELECT 
  aa.action,
  aa.created_at,
  admin_profile.email as admin_email,
  target_profile.email as target_email,
  aa.details
FROM admin_actions aa
LEFT JOIN user_profiles admin_profile ON aa.admin_id = admin_profile.id
LEFT JOIN user_profiles target_profile ON aa.target_user_id = target_profile.id
ORDER BY aa.created_at DESC
LIMIT 100;
