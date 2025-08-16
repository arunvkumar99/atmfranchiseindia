-- Update location_submissions table to match the new form structure
ALTER TABLE public.location_submissions 
DROP COLUMN IF EXISTS location_description,
DROP COLUMN IF EXISTS location_type,
DROP COLUMN IF EXISTS monthly_footfall,
DROP COLUMN IF EXISTS nearby_competition,
DROP COLUMN IF EXISTS space_ownership,
DROP COLUMN IF EXISTS space_size,
DROP COLUMN IF EXISTS monthly_rent,
DROP COLUMN IF EXISTS security_deposit,
ADD COLUMN IF NOT EXISTS assisted_by_agent boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS agent_code text,
ADD COLUMN IF NOT EXISTS address text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS location_name text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS district text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS pincode text NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS google_map_link text,
ADD COLUMN IF NOT EXISTS building_photo_url text,
ADD COLUMN IF NOT EXISTS room_photo_url text,
ADD COLUMN IF NOT EXISTS whatsapp_phone text NOT NULL DEFAULT '';

-- Rename city column to maintain consistency (if needed)
-- The city column already exists so we'll keep it