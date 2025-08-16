-- Create admin users table for role-based access control
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_email TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN auth.users u ON au.user_id = u.id
    WHERE u.id = auth.uid()
    AND au.is_active = true
    AND (user_email IS NULL OR u.email = user_email)
  )
$$;

-- Fix the existing update function security
DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Update RLS policies to allow admin access
-- Drop existing policies
DROP POLICY IF EXISTS "Admin can view all" ON public.agent_submissions;
DROP POLICY IF EXISTS "Admin can view all" ON public.influencer_submissions;
DROP POLICY IF EXISTS "Admin can view all" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin can view all" ON public.atm_enquiry_submissions;
DROP POLICY IF EXISTS "Admin can view all" ON public.get_started_submissions;
DROP POLICY IF EXISTS "Admin can view all" ON public.franchise_applications;
DROP POLICY IF EXISTS "Admin can view all" ON public.location_submissions;

-- Create new admin-only SELECT policies
CREATE POLICY "Admins can view all agent submissions" 
ON public.agent_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view all influencer submissions" 
ON public.influencer_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view all contact submissions" 
ON public.contact_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view all atm enquiry submissions" 
ON public.atm_enquiry_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view all get started submissions" 
ON public.get_started_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view all franchise applications" 
ON public.franchise_applications 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can view all location submissions" 
ON public.location_submissions 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Admin users policies
CREATE POLICY "Admins can view admin users" 
ON public.admin_users 
FOR SELECT 
TO authenticated
USING (public.is_admin());

CREATE POLICY "Admins can manage admin users" 
ON public.admin_users 
FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Create trigger for admin_users updated_at
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert a default admin user (you'll need to replace this email with your admin email)
-- This creates the first admin who can then add others
INSERT INTO public.admin_users (user_id, email, role, created_at, updated_at)
SELECT 
  id,
  email,
  'super_admin',
  now(),
  now()
FROM auth.users 
WHERE email = 'admin@example.com'  -- Change this to your admin email
ON CONFLICT (email) DO NOTHING;