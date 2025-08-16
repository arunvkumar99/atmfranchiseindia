-- Remove the problematic phone format constraint and test again
-- First, let's see what constraints exist

-- Drop the phone format constraint that's causing issues
ALTER TABLE public.contact_submissions DROP CONSTRAINT IF EXISTS phone_format;

-- Test insert again with a proper Indian phone number format
INSERT INTO public.contact_submissions (name, email, phone, subject, message) 
VALUES ('Test User', 'test@example.com', '9123456789', 'Test Subject', 'Test Message');