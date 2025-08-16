-- Fix critical RLS policy issues

-- 1. Fix audit_logs table - add proper INSERT policy for system functions
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;
CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- 2. Create a security definer function for admin checks to prevent recursion
CREATE OR REPLACE FUNCTION public.is_admin_secure()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users au
    JOIN auth.users u ON au.user_id = u.id
    WHERE u.id = auth.uid()
    AND au.is_active = true
  )
$$;

-- 3. Improve anonymous access policies with proper validation
-- Add basic validation for contact submissions
DROP POLICY IF EXISTS "contact_submissions_anon_insert" ON public.contact_submissions;
CREATE POLICY "contact_submissions_anon_insert"
ON public.contact_submissions
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(name)) > 0 AND
  length(trim(email)) > 5 AND
  length(trim(phone)) > 5 AND
  length(trim(subject)) > 0 AND
  length(trim(message)) > 10 AND
  -- Basic email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- Basic phone validation (digits only, reasonable length)
  phone ~ '^[0-9+\-\s()]{10,15}$'
);

-- 4. Add validation to agent submissions
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.agent_submissions;
CREATE POLICY "agent_submissions_validated_insert"
ON public.agent_submissions
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(full_name)) > 0 AND
  length(trim(email)) > 5 AND
  length(trim(phone)) > 5 AND
  length(trim(pan_number)) = 10 AND
  length(trim(aadhaar_number)) = 12 AND
  -- Email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- PAN validation (5 letters, 4 digits, 1 letter)
  pan_number ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' AND
  -- Aadhaar validation (12 digits)
  aadhaar_number ~ '^[0-9]{12}$'
);

-- 5. Improve rate limiting security
-- Add additional validation to form_rate_limits
ALTER TABLE public.form_rate_limits ADD CONSTRAINT valid_form_type 
CHECK (form_type IN ('contact', 'agent', 'franchise', 'influencer', 'location', 'job', 'atm_enquiry'));

ALTER TABLE public.form_rate_limits ADD CONSTRAINT valid_attempt_count 
CHECK (attempt_count > 0 AND attempt_count <= 100);

-- 6. Add IP-based rate limiting enhancement
CREATE OR REPLACE FUNCTION public.enhanced_rate_limit_check(
  p_identifier text, 
  p_form_type text, 
  p_ip_address inet DEFAULT NULL,
  p_max_attempts integer DEFAULT 5, 
  p_window_minutes integer DEFAULT 60
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts INTEGER;
  ip_attempts INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  window_start_time := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Check identifier-based rate limit
  SELECT COALESCE(SUM(attempt_count), 0)
  INTO current_attempts
  FROM public.form_rate_limits
  WHERE identifier = p_identifier
    AND form_type = p_form_type
    AND window_start > window_start_time
    AND (blocked_until IS NULL OR blocked_until < now());
  
  -- Check IP-based rate limit if provided
  IF p_ip_address IS NOT NULL THEN
    SELECT COALESCE(SUM(attempt_count), 0)
    INTO ip_attempts
    FROM public.form_rate_limits
    WHERE identifier = host(p_ip_address)
      AND form_type = p_form_type
      AND window_start > window_start_time
      AND (blocked_until IS NULL OR blocked_until < now());
    
    -- Block if either identifier or IP exceeds limit
    IF current_attempts >= p_max_attempts OR ip_attempts >= (p_max_attempts * 2) THEN
      RETURN false;
    END IF;
  ELSE
    IF current_attempts >= p_max_attempts THEN
      RETURN false;
    END IF;
  END IF;
  
  -- Record this attempt
  INSERT INTO public.form_rate_limits (identifier, form_type, attempt_count, window_start)
  VALUES (p_identifier, p_form_type, 1, now())
  ON CONFLICT (identifier, form_type, window_start) 
  DO UPDATE SET attempt_count = form_rate_limits.attempt_count + 1;
  
  RETURN true;
END;
$$;

-- 7. Add security logging function with proper search path
CREATE OR REPLACE FUNCTION public.log_security_event_secure(
  event_type text, 
  event_details jsonb DEFAULT NULL::jsonb, 
  risk_level text DEFAULT 'low'::text,
  ip_address inet DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    new_values,
    ip_address,
    created_at
  ) VALUES (
    auth.uid(),
    event_type,
    'security_events',
    jsonb_build_object(
      'event_details', event_details,
      'risk_level', risk_level,
      'timestamp', now(),
      'client_ip', COALESCE(ip_address, inet_client_addr())
    ),
    COALESCE(ip_address, inet_client_addr()),
    now()
  );
END;
$$;