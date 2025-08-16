-- Create a table to store website content for search indexing
CREATE TABLE IF NOT EXISTS public.search_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT NOT NULL,
  content_section TEXT NOT NULL,
  content_text TEXT NOT NULL,
  content_type TEXT DEFAULT 'page_content',
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.search_content ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (search content should be publicly searchable)
CREATE POLICY "Public can read search content" 
ON public.search_content 
FOR SELECT 
USING (true);

-- Create policy for admin management
CREATE POLICY "Admins can manage search content" 
ON public.search_content 
FOR ALL 
USING (is_admin());

-- Create indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_search_content_path ON public.search_content(page_path);
CREATE INDEX IF NOT EXISTS idx_search_content_text ON public.search_content USING gin(to_tsvector('english', content_text));
CREATE INDEX IF NOT EXISTS idx_search_content_keywords ON public.search_content USING gin(keywords);