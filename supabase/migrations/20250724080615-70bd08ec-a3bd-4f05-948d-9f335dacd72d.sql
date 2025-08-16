-- Fix the security warnings by setting proper search_path for functions
CREATE OR REPLACE FUNCTION public.handle_null_translation()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- If translated_text is null, use the original_text as fallback
  IF NEW.translated_text IS NULL THEN
    NEW.translated_text = NEW.original_text;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Also fix the update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;