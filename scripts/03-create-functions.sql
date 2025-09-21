-- Database Functions
-- এই স্ক্রিপ্ট সব helper functions তৈরি করবে

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON pricing_packages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = user_id AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to approve user
CREATE OR REPLACE FUNCTION public.approve_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID := auth.uid();
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only admins can approve users';
  END IF;

  -- Update user status
  UPDATE user_profiles 
  SET 
    status = 'approved',
    approved_at = NOW(),
    approved_by = admin_user_id
  WHERE id = target_user_id;

  -- Log admin action
  INSERT INTO admin_actions (admin_id, target_user_id, action, details)
  VALUES (admin_user_id, target_user_id, 'approve_user', '{"status": "approved"}');

  -- Create notification for user
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    target_user_id,
    'Account Approved',
    'Your account has been approved! You now have full access to the platform.',
    'success'
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reject user
CREATE OR REPLACE FUNCTION public.reject_user(target_user_id UUID, reason TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  admin_user_id UUID := auth.uid();
BEGIN
  -- Check if current user is admin
  IF NOT public.is_admin(admin_user_id) THEN
    RAISE EXCEPTION 'Only admins can reject users';
  END IF;

  -- Update user status
  UPDATE user_profiles 
  SET status = 'rejected'
  WHERE id = target_user_id;

  -- Log admin action
  INSERT INTO admin_actions (admin_id, target_user_id, action, details)
  VALUES (admin_user_id, target_user_id, 'reject_user', jsonb_build_object('reason', reason));

  -- Create notification for user
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (
    target_user_id,
    'Account Rejected',
    COALESCE('Your account has been rejected. Reason: ' || reason, 'Your account has been rejected.'),
    'error'
  );

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
