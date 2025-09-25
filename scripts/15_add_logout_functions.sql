-- Function to handle logout due to IP change
CREATE OR REPLACE FUNCTION logout_due_to_ip_change(
  p_user_id UUID,
  p_old_ip TEXT,
  p_new_ip TEXT
)
RETURNS VOID AS $$
BEGIN
  -- Deactivate all sessions for this user
  UPDATE user_sessions 
  SET 
    is_active = false,
    logout_reason = 'ip_changed',
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND is_active = true;

  -- Log the IP change event
  INSERT INTO user_ip_history (
    user_id,
    ip_address,
    is_current,
    change_reason,
    previous_ip
  ) VALUES (
    p_user_id,
    p_new_ip,
    false, -- Not current since user is logged out
    'auto_logout_ip_change',
    p_old_ip
  );

  -- Update previous IP records
  UPDATE user_ip_history 
  SET is_current = false 
  WHERE user_id = p_user_id 
    AND ip_address = p_old_ip;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to logout other devices (keep current session)
CREATE OR REPLACE FUNCTION logout_other_devices(
  p_user_id UUID,
  p_current_session_id UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_sessions 
  SET 
    is_active = false,
    logout_reason = 'other_device_logout',
    updated_at = NOW()
  WHERE user_id = p_user_id 
    AND id != p_current_session_id
    AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if device is allowed (single device policy)
CREATE OR REPLACE FUNCTION is_device_allowed(
  p_user_id UUID,
  p_device_fingerprint TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  active_sessions_count INTEGER;
  device_has_active_session BOOLEAN;
BEGIN
  -- Count active sessions for this user
  SELECT COUNT(*) INTO active_sessions_count
  FROM user_sessions 
  WHERE user_id = p_user_id 
    AND is_active = true 
    AND expires_at > NOW();

  -- Check if this device has an active session
  SELECT EXISTS(
    SELECT 1 FROM user_sessions 
    WHERE user_id = p_user_id 
      AND device_fingerprint = p_device_fingerprint
      AND is_active = true 
      AND expires_at > NOW()
  ) INTO device_has_active_session;

  -- Allow if no active sessions OR this device already has an active session
  RETURN (active_sessions_count = 0 OR device_has_active_session);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track device login
CREATE OR REPLACE FUNCTION track_device_login(
  p_user_id UUID,
  p_device_fingerprint TEXT,
  p_device_name TEXT DEFAULT NULL,
  p_browser_info TEXT DEFAULT NULL,
  p_os_info TEXT DEFAULT NULL,
  p_screen_resolution TEXT DEFAULT NULL,
  p_timezone TEXT DEFAULT NULL,
  p_language TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Insert or update device record
  INSERT INTO user_devices (
    user_id,
    device_fingerprint,
    device_name,
    browser_info,
    os_info,
    screen_resolution,
    timezone,
    language,
    first_seen,
    last_seen,
    is_trusted,
    is_blocked,
    total_logins
  ) VALUES (
    p_user_id,
    p_device_fingerprint,
    p_device_name,
    p_browser_info,
    p_os_info,
    p_screen_resolution,
    p_timezone,
    p_language,
    NOW(),
    NOW(),
    true, -- Default to trusted
    false,
    1
  )
  ON CONFLICT (user_id, device_fingerprint) 
  DO UPDATE SET
    device_name = COALESCE(EXCLUDED.device_name, user_devices.device_name),
    browser_info = COALESCE(EXCLUDED.browser_info, user_devices.browser_info),
    os_info = COALESCE(EXCLUDED.os_info, user_devices.os_info),
    screen_resolution = COALESCE(EXCLUDED.screen_resolution, user_devices.screen_resolution),
    timezone = COALESCE(EXCLUDED.timezone, user_devices.timezone),
    language = COALESCE(EXCLUDED.language, user_devices.language),
    last_seen = NOW(),
    total_logins = user_devices.total_logins + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
