-- Fix phone format constraints to allow common phone formats
-- Drop existing check constraints that are too restrictive
ALTER TABLE contact_submissions DROP CONSTRAINT IF EXISTS phone_format;
ALTER TABLE franchise_applications DROP CONSTRAINT IF EXISTS franchise_phone_format;

-- Add more flexible phone format constraints
ALTER TABLE contact_submissions 
ADD CONSTRAINT phone_format CHECK (
  phone ~ '^(\+91[-\s]?)?[6-9]\d{9}$|^\+91[-\s]?[6-9]\d{9}$|^[6-9]\d{9}$'
);

ALTER TABLE franchise_applications 
ADD CONSTRAINT franchise_phone_format CHECK (
  phone ~ '^(\+91[-\s]?)?[6-9]\d{9}$|^\+91[-\s]?[6-9]\d{9}$|^[6-9]\d{9}$'
);