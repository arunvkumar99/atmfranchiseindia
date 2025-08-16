-- Remove potentially problematic format constraints that may be too strict
-- Keep reasonable length constraints but remove strict format validations

-- Remove email format constraint (we have client-side validation)
ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS email_format;

-- Remove duplicate length constraints (keep the check_* versions)
ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS message_length;
ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS name_length; 
ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS subject_length;

-- Verify the table is working by testing another insert
INSERT INTO public.contact_submissions (name, email, phone, subject, message) 
VALUES ('Test User 2', 'test2@example.com', '9987654321', 'Another Test', 'Another test message');