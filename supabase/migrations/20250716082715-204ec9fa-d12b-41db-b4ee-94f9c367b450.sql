-- First, you need to sign up a regular user account through your app
-- Then find that user's ID and add them as an admin

-- Example: Add an admin user (replace with your actual user details)
-- First, get the user_id from auth.users table for the email you want to make admin

INSERT INTO public.admin_users (
  user_id, 
  email, 
  role, 
  is_active,
  permissions,
  created_by
) 
VALUES (
  -- You'll need to replace this with the actual user_id from auth.users
  -- For example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
  (SELECT id FROM auth.users WHERE email = 'your-admin-email@domain.com' LIMIT 1),
  'your-admin-email@domain.com',
  'super_admin',
  true,
  '{"export": true, "view_audit": true, "manage_users": true}'::jsonb,
  (SELECT id FROM auth.users WHERE email = 'your-admin-email@domain.com' LIMIT 1)
);

-- Verify the admin was created
SELECT 
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.permissions,
  u.email as auth_email
FROM admin_users au
JOIN auth.users u ON au.user_id = u.id;