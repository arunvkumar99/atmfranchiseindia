-- Fix the translation system constraint issue
-- Make translated_text nullable temporarily to allow fallback handling
ALTER TABLE public.website_translations 
ALTER COLUMN translated_text DROP NOT NULL;

-- Add a trigger to handle null translations with fallback values
CREATE OR REPLACE FUNCTION public.handle_null_translation()
RETURNS TRIGGER AS $$
BEGIN
  -- If translated_text is null, use the original_text as fallback
  IF NEW.translated_text IS NULL THEN
    NEW.translated_text = NEW.original_text;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-handle null translations
DROP TRIGGER IF EXISTS handle_null_translation_trigger ON public.website_translations;
CREATE TRIGGER handle_null_translation_trigger
  BEFORE INSERT OR UPDATE ON public.website_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_null_translation();