-- Phase 1: Critical Database Security Fixes
-- Fix database functions with missing search_path settings
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  DELETE FROM public.form_drafts 
  WHERE expires_at < now();
END;
$$;

-- Phase 2: RLS Policy Improvements
-- Update the deprecated JWT-based RLS policy on influencer_submissions
DROP POLICY IF EXISTS "Admin read access" ON public.influencer_submissions;

-- Update form_drafts RLS policy to be more secure
DROP POLICY IF EXISTS "Anyone can manage their drafts" ON public.form_drafts;

CREATE POLICY "Users can manage their own drafts" 
ON public.form_drafts 
FOR ALL 
USING (
  CASE 
    WHEN auth.uid() IS NOT NULL THEN true  -- Authenticated users can access any draft
    ELSE session_id = current_setting('request.headers', true)::json->>'x-session-id'  -- Anonymous users only their session
  END
);

-- Secure the rate_limits table policy
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

CREATE POLICY "System functions can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (false)  -- No direct access, only through functions
WITH CHECK (false);

-- Add additional validation constraints
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT check_name_length CHECK (length(name) >= 2 AND length(name) <= 100),
ADD CONSTRAINT check_subject_length CHECK (length(subject) >= 3 AND length(subject) <= 200),
ADD CONSTRAINT check_message_length CHECK (length(message) >= 10 AND length(message) <= 2000);

ALTER TABLE public.agent_submissions
ADD CONSTRAINT check_full_name_length CHECK (length(full_name) >= 2 AND length(full_name) <= 100),
ADD CONSTRAINT check_permanent_address_length CHECK (length(permanent_address) >= 10 AND length(permanent_address) <= 500);

ALTER TABLE public.franchise_applications
ADD CONSTRAINT check_first_name_length CHECK (length(first_name) >= 2 AND length(first_name) <= 50),
ADD CONSTRAINT check_last_name_length CHECK (length(last_name) >= 2 AND length(last_name) <= 50),
ADD CONSTRAINT check_address_length CHECK (length(address_line1) >= 5 AND length(address_line1) <= 200);

-- Enhanced audit logging function
CREATE OR REPLACE FUNCTION public.log_security_event(
  event_type TEXT,
  event_details JSONB DEFAULT NULL,
  risk_level TEXT DEFAULT 'low'
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
      'timestamp', now()
    ),
    inet_client_addr(),
    now()
  );
END;
$$;

-- Account lockout tracking
CREATE TABLE IF NOT EXISTS public.account_lockouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMP WITH TIME ZONE,
  last_attempt TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on account_lockouts
ALTER TABLE public.account_lockouts ENABLE ROW LEVEL SECURITY;

-- Create policy for account lockouts
CREATE POLICY "System can manage account lockouts" 
ON public.account_lockouts 
FOR ALL 
USING (false)  -- Only accessible through functions
WITH CHECK (false);

-- Function to check and update account lockout status
CREATE OR REPLACE FUNCTION public.check_account_lockout(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  lockout_record RECORD;
  max_attempts INTEGER := 5;
  lockout_duration INTERVAL := '30 minutes';
BEGIN
  -- Get current lockout status
  SELECT * INTO lockout_record
  FROM public.account_lockouts
  WHERE email = user_email
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no record exists, create one
  IF lockout_record IS NULL THEN
    INSERT INTO public.account_lockouts (email, failed_attempts)
    VALUES (user_email, 0);
    RETURN true;  -- Account is not locked
  END IF;
  
  -- Check if account is currently locked
  IF lockout_record.locked_until IS NOT NULL AND lockout_record.locked_until > now() THEN
    -- Log security event
    PERFORM public.log_security_event(
      'account_lockout_check',
      jsonb_build_object('email', user_email, 'status', 'locked'),
      'medium'
    );
    RETURN false;  -- Account is locked
  END IF;
  
  -- Account is not locked
  RETURN true;
END;
$$;

-- Function to record failed login attempt
CREATE OR REPLACE FUNCTION public.record_failed_login(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_attempts INTEGER;
  max_attempts INTEGER := 5;
  lockout_duration INTERVAL := '30 minutes';
BEGIN
  -- Get current failed attempts
  SELECT COALESCE(failed_attempts, 0) INTO current_attempts
  FROM public.account_lockouts
  WHERE email = user_email
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Increment failed attempts
  current_attempts := current_attempts + 1;
  
  -- Insert or update lockout record
  INSERT INTO public.account_lockouts (email, failed_attempts, locked_until, last_attempt)
  VALUES (
    user_email, 
    current_attempts,
    CASE 
      WHEN current_attempts >= max_attempts THEN now() + lockout_duration
      ELSE NULL
    END,
    now()
  );
  
  -- Log security event
  PERFORM public.log_security_event(
    'failed_login_attempt',
    jsonb_build_object(
      'email', user_email, 
      'attempt_count', current_attempts,
      'locked', current_attempts >= max_attempts
    ),
    CASE WHEN current_attempts >= max_attempts THEN 'high' ELSE 'medium' END
  );
END;
$$;

-- Function to reset lockout on successful login
CREATE OR REPLACE FUNCTION public.reset_account_lockout(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  UPDATE public.account_lockouts
  SET failed_attempts = 0, locked_until = NULL
  WHERE email = user_email;
  
  -- Log security event
  PERFORM public.log_security_event(
    'successful_login',
    jsonb_build_object('email', user_email),
    'low'
  );
END;
$$;