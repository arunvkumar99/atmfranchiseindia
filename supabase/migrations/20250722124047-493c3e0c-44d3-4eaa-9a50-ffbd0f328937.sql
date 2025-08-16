-- Fix RLS policy for website_translations to allow system insertions
DROP POLICY IF EXISTS "Only admins can modify translations" ON public.website_translations;

CREATE POLICY "System can insert translations" 
ON public.website_translations 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can update and delete translations" 
ON public.website_translations 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());