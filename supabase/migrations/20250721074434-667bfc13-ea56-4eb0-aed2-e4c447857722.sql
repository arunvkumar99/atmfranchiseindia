-- Fix the audit logging function variable name
CREATE OR REPLACE FUNCTION public.log_file_operation(
  operation_type TEXT,
  file_name TEXT,
  file_size BIGINT DEFAULT NULL,
  file_type TEXT DEFAULT NULL,
  upload_success BOOLEAN DEFAULT true
) RETURNS VOID
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
    created_at
  ) VALUES (
    auth.uid(),
    operation_type,  -- Fixed: was action_type, now operation_type
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