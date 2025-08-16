-- Fix the remaining function security warning
-- Update all other functions to have proper search_path
CREATE OR REPLACE FUNCTION public.cleanup_expired_drafts()
RETURNS void
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.form_drafts 
  WHERE expires_at < now();
END;
$$;