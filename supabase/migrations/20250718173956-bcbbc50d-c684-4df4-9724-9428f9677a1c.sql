-- Clean up conflicting RLS policies and enhance admin security
-- First, drop the old conflicting policies that use deprecated JWT role checking
DROP POLICY IF EXISTS "Admin read access" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admin read access" ON public.agent_submissions;
DROP POLICY IF EXISTS "Admin read access" ON public.franchise_applications;
DROP POLICY IF EXISTS "Admin read access" ON public.atm_enquiry_submissions;
DROP POLICY IF EXISTS "Admin read access" ON public.location_submissions;

-- Enhanced admin role validation to prevent privilege escalation
CREATE OR REPLACE FUNCTION public.is_admin_with_role_check(required_role TEXT DEFAULT 'admin')
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN auth.users u ON au.user_id = u.id
    WHERE u.id = auth.uid()
    AND au.is_active = true
    AND (
      au.role = 'super_admin' OR 
      (required_role = 'admin' AND au.role IN ('admin', 'super_admin'))
    )
  )
$$;

-- Enhanced audit logging function with IP and user agent tracking
CREATE OR REPLACE FUNCTION public.log_admin_action_enhanced(
  action_type TEXT, 
  table_name TEXT DEFAULT NULL, 
  record_id UUID DEFAULT NULL, 
  old_values JSONB DEFAULT NULL, 
  new_values JSONB DEFAULT NULL,
  ip_address INET DEFAULT NULL,
  user_agent TEXT DEFAULT NULL
) 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    table_name,
    record_id,
    old_values,
    new_values,
    COALESCE(ip_address, inet_client_addr()),
    user_agent,
    now()
  );
END;
$$;

-- Add role hierarchy validation
CREATE OR REPLACE FUNCTION public.can_manage_admin_role(target_role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT CASE 
    WHEN target_role = 'super_admin' THEN 
      EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
      )
    WHEN target_role = 'admin' THEN
      EXISTS (
        SELECT 1 FROM public.admin_users 
        WHERE user_id = auth.uid() AND role IN ('super_admin', 'admin') AND is_active = true
      )
    ELSE false
  END
$$;

-- Add constraint to prevent self-role elevation
ALTER TABLE public.admin_users 
ADD CONSTRAINT check_role_elevation 
CHECK (
  CASE 
    WHEN role = 'super_admin' THEN public.can_manage_admin_role('super_admin')
    ELSE true
  END
);

-- Add failed login tracking table
CREATE TABLE IF NOT EXISTS public.failed_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  attempt_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on failed login attempts
ALTER TABLE public.failed_login_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view failed login attempts
CREATE POLICY "Admins can view failed login attempts" 
ON public.failed_login_attempts 
FOR SELECT 
USING (public.is_admin());

-- Add input validation constraints
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 320),
ADD CONSTRAINT check_name_length CHECK (char_length(name) <= 100),
ADD CONSTRAINT check_subject_length CHECK (char_length(subject) <= 200),
ADD CONSTRAINT check_message_length CHECK (char_length(message) <= 2000);

ALTER TABLE public.agent_submissions 
ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 320),
ADD CONSTRAINT check_name_length CHECK (char_length(full_name) <= 100);

ALTER TABLE public.franchise_applications 
ADD CONSTRAINT check_email_length CHECK (char_length(email) <= 320),
ADD CONSTRAINT check_first_name_length CHECK (char_length(first_name) <= 50),
ADD CONSTRAINT check_last_name_length CHECK (char_length(last_name) <= 50);

-- Add rate limiting table
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP or email
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system can manage rate limits
CREATE POLICY "System can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (false);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_email ON public.failed_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_failed_login_attempts_ip ON public.failed_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON public.audit_logs(user_id, action);