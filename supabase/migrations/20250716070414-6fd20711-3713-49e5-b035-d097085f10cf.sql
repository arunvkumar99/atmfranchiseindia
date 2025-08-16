-- Create audit log table for security monitoring
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log access (admins only)
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs 
FOR SELECT 
TO authenticated
USING (public.is_admin());

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type TEXT,
  table_name TEXT DEFAULT NULL,
  record_id UUID DEFAULT NULL,
  old_values JSONB DEFAULT NULL,
  new_values JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    action_type,
    table_name,
    record_id,
    old_values,
    new_values,
    now()
  );
END;
$$;

-- Enhanced admin user roles
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{"export": true, "manage_users": false, "view_audit": false}';
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;

-- Create function to track admin logins
CREATE OR REPLACE FUNCTION public.track_admin_login()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.admin_users 
  SET 
    last_login = now(),
    login_count = COALESCE(login_count, 0) + 1
  WHERE user_id = auth.uid();
  
  -- Log the login action
  PERFORM public.log_admin_action('admin_login');
END;
$$;

-- Create enhanced is_admin function with permission checking
CREATE OR REPLACE FUNCTION public.has_admin_permission(permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users au
    WHERE au.user_id = auth.uid()
    AND au.is_active = true
    AND (
      au.role = 'super_admin' 
      OR (au.permissions->permission_name)::boolean = true
    )
  )
$$;

-- Add input validation constraints
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT phone_format CHECK (phone ~* '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT name_length CHECK (char_length(name) BETWEEN 2 AND 100),
ADD CONSTRAINT subject_length CHECK (char_length(subject) BETWEEN 5 AND 200),
ADD CONSTRAINT message_length CHECK (char_length(message) BETWEEN 10 AND 2000);

ALTER TABLE public.agent_submissions
ADD CONSTRAINT agent_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT agent_phone_format CHECK (phone ~* '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT agent_name_length CHECK (char_length(full_name) BETWEEN 2 AND 100),
ADD CONSTRAINT pan_format CHECK (pan_number ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$'),
ADD CONSTRAINT aadhaar_format CHECK (aadhaar_number ~* '^[0-9]{12}$');

ALTER TABLE public.franchise_applications
ADD CONSTRAINT franchise_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
ADD CONSTRAINT franchise_phone_format CHECK (phone ~* '^\+?[1-9]\d{1,14}$'),
ADD CONSTRAINT franchise_name_length CHECK (char_length(first_name) BETWEEN 2 AND 50 AND char_length(last_name) BETWEEN 2 AND 50),
ADD CONSTRAINT pincode_format CHECK (pincode ~* '^[0-9]{6}$');