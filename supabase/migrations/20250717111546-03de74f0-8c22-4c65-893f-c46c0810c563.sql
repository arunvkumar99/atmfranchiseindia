-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  experience TEXT,
  current_location TEXT,
  expected_salary TEXT,
  notice_period TEXT,
  cv_file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow anonymous inserts" 
ON public.job_applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can view all job applications" 
ON public.job_applications 
FOR SELECT 
USING (is_admin());