-- Add the existing user as an admin
INSERT INTO public.admin_users (
  user_id, 
  email, 
  role, 
  is_active,
  permissions,
  created_by
) 
VALUES (
  '66f909e1-7f78-426b-a4af-153f49856410',
  'arun@pixellpay.com',
  'super_admin',
  true,
  '{"export": true, "view_audit": true, "manage_users": true}'::jsonb,
  '66f909e1-7f78-426b-a4af-153f49856410'
);

-- Verify the admin was created
SELECT 
  au.id,
  au.email,
  au.role,
  au.is_active,
  au.permissions
FROM admin_users au
WHERE au.email = 'arun@pixellpay.com';