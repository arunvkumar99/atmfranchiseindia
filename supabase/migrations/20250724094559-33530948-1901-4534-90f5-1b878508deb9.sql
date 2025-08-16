-- Test direct insert to see if RLS is working
-- Create a completely open policy for testing

-- Drop existing policies
DROP POLICY IF EXISTS "contact_submissions_anon_insert" ON public.contact_submissions;
DROP POLICY IF EXISTS "contact_submissions_admin_select" ON public.contact_submissions;

-- Create a completely permissive insert policy for testing
CREATE POLICY "contact_submissions_open_insert"
ON public.contact_submissions 
FOR INSERT
WITH CHECK (true);

-- Create a permissive select policy for admins
CREATE POLICY "contact_submissions_admin_view"
ON public.contact_submissions 
FOR SELECT
USING (is_admin());

-- Test insert (this should work)
INSERT INTO public.contact_submissions (name, email, phone, subject, message) 
VALUES ('Test User', 'test@example.com', '1234567890', 'Test Subject', 'Test Message');