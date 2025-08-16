-- Fix remaining function search path security issues

-- Update existing functions with proper search paths
CREATE OR REPLACE FUNCTION public.handle_null_translation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If translated_text is null, use the original_text as fallback
  IF NEW.translated_text IS NULL THEN
    NEW.translated_text = NEW.original_text;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_email text DEFAULT NULL::text)
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
    AND (user_email IS NULL OR u.email = user_email)
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin_with_role_check(required_role text DEFAULT 'admin'::text)
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
    AND (
      au.role = 'super_admin' OR 
      (required_role = 'admin' AND au.role IN ('admin', 'super_admin'))
    )
  )
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action(action_type text, table_name text DEFAULT NULL::text, record_id uuid DEFAULT NULL::uuid, old_values jsonb DEFAULT NULL::jsonb, new_values jsonb DEFAULT NULL::jsonb)
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

CREATE OR REPLACE FUNCTION public.track_admin_login()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
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

CREATE OR REPLACE FUNCTION public.has_admin_permission(permission_name text)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public, auth
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

CREATE OR REPLACE FUNCTION public.log_admin_action_enhanced(action_type text, table_name text DEFAULT NULL::text, record_id uuid DEFAULT NULL::uuid, old_values jsonb DEFAULT NULL::jsonb, new_values jsonb DEFAULT NULL::jsonb, ip_address inet DEFAULT NULL::inet, user_agent text DEFAULT NULL::text)
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

CREATE OR REPLACE FUNCTION public.can_manage_admin_role(target_role text)
RETURNS boolean
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public, auth
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

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_form_type text, p_max_attempts integer DEFAULT 5, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_attempts INTEGER;
  window_start_time TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Calculate window start time
  window_start_time := now() - (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Count attempts in current window
  SELECT COALESCE(SUM(attempt_count), 0)
  INTO current_attempts
  FROM public.form_rate_limits
  WHERE identifier = p_identifier
    AND form_type = p_form_type
    AND window_start > window_start_time
    AND (blocked_until IS NULL OR blocked_until < now());
  
  -- If under limit, record this attempt and allow
  IF current_attempts < p_max_attempts THEN
    INSERT INTO public.form_rate_limits (identifier, form_type, attempt_count, window_start)
    VALUES (p_identifier, p_form_type, 1, now())
    ON CONFLICT (identifier, form_type, window_start) 
    DO UPDATE SET attempt_count = form_rate_limits.attempt_count + 1;
    
    RETURN true;
  ELSE
    -- Block for additional time
    INSERT INTO public.form_rate_limits (identifier, form_type, attempt_count, window_start, blocked_until)
    VALUES (p_identifier, p_form_type, 1, now(), now() + INTERVAL '15 minutes')
    ON CONFLICT (identifier, form_type, window_start) 
    DO UPDATE SET 
      attempt_count = form_rate_limits.attempt_count + 1,
      blocked_until = now() + INTERVAL '15 minutes';
    
    RETURN false;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_translation_stats()
RETURNS TABLE(language_code text, total_count bigint, completed_count bigint)
LANGUAGE sql
STABLE 
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    wt.language_code,
    COUNT(*) as total_count,
    COUNT(wt.translated_text) as completed_count
  FROM public.website_translations wt
  WHERE wt.language_code != 'en'
  GROUP BY wt.language_code
  ORDER BY wt.language_code;
$$;

CREATE OR REPLACE FUNCTION public.log_security_event(event_type text, event_details jsonb DEFAULT NULL::jsonb, risk_level text DEFAULT 'low'::text)
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
      'timestamp', now()
    ),
    inet_client_addr(),
    now()
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.check_account_lockout(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    PERFORM public.log_security_event_secure(
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

CREATE OR REPLACE FUNCTION public.record_failed_login(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  PERFORM public.log_security_event_secure(
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

CREATE OR REPLACE FUNCTION public.reset_account_lockout(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.account_lockouts
  SET failed_attempts = 0, locked_until = NULL
  WHERE email = user_email;
  
  -- Log security event
  PERFORM public.log_security_event_secure(
    'successful_login',
    jsonb_build_object('email', user_email),
    'low'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.form_drafts 
  WHERE expires_at < now();
END;
$$;

CREATE OR REPLACE FUNCTION public.log_file_operation(operation_type text, file_name text, file_size bigint DEFAULT NULL::bigint, file_type text DEFAULT NULL::text, upload_success boolean DEFAULT true)
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
    created_at
  ) VALUES (
    auth.uid(),
    operation_type,
    'file_uploads',
    jsonb_build_object(
      'file_name', file_name,
      'file_size', file_size,
      'file_type', file_type,
      'success', upload_success,
      'timestamp', now()
    ),
    now()
  );
END;
$$;