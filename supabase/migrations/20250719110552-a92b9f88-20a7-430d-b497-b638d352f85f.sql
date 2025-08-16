-- Fix storage policies for atmfranchiseforms bucket to allow anonymous uploads

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous uploads to atmfranchiseforms" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to atmfranchiseforms" ON storage.objects;

-- Create policy to allow anonymous uploads to atmfranchiseforms bucket
CREATE POLICY "Allow anonymous uploads to atmfranchiseforms" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'atmfranchiseforms');

-- Create policy to allow public read access to atmfranchiseforms bucket  
CREATE POLICY "Allow public access to atmfranchiseforms"
ON storage.objects
FOR SELECT
USING (bucket_id = 'atmfranchiseforms');

-- Also allow anonymous users to update files (for replace operations)
CREATE POLICY "Allow anonymous updates to atmfranchiseforms"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'atmfranchiseforms')
WITH CHECK (bucket_id = 'atmfranchiseforms');

-- Allow anonymous users to delete files if needed
CREATE POLICY "Allow anonymous deletes from atmfranchiseforms"
ON storage.objects
FOR DELETE
USING (bucket_id = 'atmfranchiseforms');