-- Fix location_submissions validation policy - we didn't add one in our previous migration
-- Check current policy and add proper validation

DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.location_submissions;
CREATE POLICY "location_submissions_validated_insert"
ON public.location_submissions
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(full_name)) > 0 AND
  length(trim(email)) > 5 AND
  length(trim(phone)) > 5 AND
  length(trim(whatsapp_phone)) > 5 AND
  length(trim(location_name)) > 0 AND
  length(trim(address)) > 0 AND
  length(trim(city)) > 0 AND
  length(trim(state)) > 0 AND
  length(trim(pincode)) >= 5 AND
  -- Email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- Phone validation (basic)
  phone ~ '^[0-9+\-\s()]{10,15}$' AND
  whatsapp_phone ~ '^[0-9+\-\s()]{10,15}$' AND
  -- Pincode validation (5-6 digits)
  pincode ~ '^[0-9]{5,6}$'
);

-- Add similar validation for other forms that were missing

-- Fix franchise applications
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.franchise_applications;
CREATE POLICY "franchise_applications_validated_insert"
ON public.franchise_applications
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(first_name)) > 0 AND
  length(trim(last_name)) > 0 AND
  length(trim(email)) > 5 AND
  length(trim(phone)) > 5 AND
  -- Email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- Phone validation
  phone ~ '^[0-9+\-\s()]{10,15}$' AND
  agreed_to_terms = true
);

-- Fix influencer submissions
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.influencer_submissions;
CREATE POLICY "influencer_submissions_validated_insert"
ON public.influencer_submissions
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(full_name)) > 0 AND
  length(trim(email)) > 5 AND
  length(trim(phone)) > 5 AND
  length(trim(pan_number)) = 10 AND
  length(trim(aadhaar_number)) = 12 AND
  -- Email validation
  email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  -- PAN validation (5 letters, 4 digits, 1 letter)
  pan_number ~* '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' AND
  -- Aadhaar validation (12 digits)
  aadhaar_number ~ '^[0-9]{12}$'
);

-- Fix ATM enquiry submissions
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.atm_enquiry_submissions;
CREATE POLICY "atm_enquiry_submissions_validated_insert"
ON public.atm_enquiry_submissions
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(full_name)) > 0 AND
  length(trim(phone)) > 5 AND
  length(trim(whatsapp_number)) > 5 AND
  length(trim(state)) > 0 AND
  length(trim(enquiry_purpose)) > 0 AND
  length(trim(occupation)) > 0 AND
  -- Phone validation
  phone ~ '^[0-9+\-\s()]{10,15}$' AND
  whatsapp_number ~ '^[0-9+\-\s()]{10,15}$' AND
  -- Email validation (optional field)
  (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Fix job applications
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.job_applications;
CREATE POLICY "job_applications_validated_insert"
ON public.job_applications
FOR INSERT
WITH CHECK (
  -- Ensure required fields are not empty
  length(trim(job_title)) > 0 AND
  length(trim(candidate_name)) > 0 AND
  length(trim(phone)) > 5 AND
  -- Phone validation
  phone ~ '^[0-9+\-\s()]{10,15}$' AND
  -- Email validation (optional field)
  (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);