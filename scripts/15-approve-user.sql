-- Approve the specific user who is currently pending
UPDATE user_profiles 
SET 
  status = 'approved',
  approved_at = NOW(),
  approved_by = 'system',
  updated_at = NOW()
WHERE email = 'muthassim16@gmail.com' AND status = 'pending';

-- Verify the update
SELECT id, email, full_name, status, role, approved_at, approved_by 
FROM user_profiles 
WHERE email = 'muthassim16@gmail.com';
