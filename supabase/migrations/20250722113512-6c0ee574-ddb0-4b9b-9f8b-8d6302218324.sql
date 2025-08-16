-- Create comprehensive translation storage system
CREATE TABLE IF NOT EXISTS public.website_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  language_code TEXT NOT NULL,
  content_key TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page_path, language_code, content_key)
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_translations_lookup 
ON public.website_translations(page_path, language_code);

-- Create trigger for updated_at
CREATE TRIGGER update_translations_updated_at
  BEFORE UPDATE ON public.website_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.website_translations ENABLE ROW LEVEL SECURITY;

-- Allow read access to everyone (translations are public)
CREATE POLICY "Translations are publicly readable" 
ON public.website_translations FOR SELECT 
USING (true);

-- Only admins can modify translations
CREATE POLICY "Only admins can modify translations" 
ON public.website_translations FOR ALL 
USING (public.is_admin());