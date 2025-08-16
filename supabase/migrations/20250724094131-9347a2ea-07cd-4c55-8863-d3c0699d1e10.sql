-- Ensure contact_submissions table allows anonymous inserts
-- First check if table exists and has RLS enabled

-- Disable RLS temporarily to reset policies
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable anonymous inserts for contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Enable authenticated inserts for contact submissions" ON public.contact_submissions; 
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;

-- Re-enable RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create new policies that definitely work
CREATE POLICY "contact_submissions_anon_insert"
ON public.contact_submissions 
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "contact_submissions_admin_select"
ON public.contact_submissions 
FOR SELECT
TO authenticated
USING (is_admin());

-- Grant necessary permissions
GRANT INSERT ON public.contact_submissions TO anon;
GRANT INSERT ON public.contact_submissions TO authenticated;