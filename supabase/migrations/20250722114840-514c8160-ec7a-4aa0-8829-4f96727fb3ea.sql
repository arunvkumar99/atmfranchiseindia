-- Add missing city column to atm_enquiry_submissions table
ALTER TABLE public.atm_enquiry_submissions 
ADD COLUMN city text NOT NULL DEFAULT '';