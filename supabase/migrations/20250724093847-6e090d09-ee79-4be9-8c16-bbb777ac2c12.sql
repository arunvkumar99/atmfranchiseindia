-- Fix RLS policies for contact_submissions table to allow anonymous inserts

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.contact_submissions;
DROP POLICY IF EXISTS "Admins can view all contact submissions" ON public.contact_submissions;

-- Create proper policies that allow anonymous inserts and admin viewing
CREATE POLICY "Enable anonymous inserts for contact submissions"
ON public.contact_submissions 
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Enable authenticated inserts for contact submissions"
ON public.contact_submissions 
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions"
ON public.contact_submissions 
FOR SELECT
USING (is_admin());

-- Ensure RLS is enabled
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;