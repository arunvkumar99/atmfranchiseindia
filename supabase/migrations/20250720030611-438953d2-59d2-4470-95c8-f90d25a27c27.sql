-- Ensure the atmfranchiseforms storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('atmfranchiseforms', 'atmfranchiseforms', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create proper RLS policies for the atmfranchiseforms bucket on storage.objects table
CREATE POLICY IF NOT EXISTS "Allow anonymous uploads to atmfranchiseforms" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'atmfranchiseforms');

CREATE POLICY IF NOT EXISTS "Allow public access to atmfranchiseforms"
ON storage.objects
FOR SELECT
USING (bucket_id = 'atmfranchiseforms');

CREATE POLICY IF NOT EXISTS "Allow anonymous updates to atmfranchiseforms"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'atmfranchiseforms')
WITH CHECK (bucket_id = 'atmfranchiseforms');

CREATE POLICY IF NOT EXISTS "Allow anonymous deletes from atmfranchiseforms"
ON storage.objects
FOR DELETE
USING (bucket_id = 'atmfranchiseforms');