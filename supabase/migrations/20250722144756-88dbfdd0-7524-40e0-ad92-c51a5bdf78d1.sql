-- Create location-photos storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('location-photos', 'location-photos', true);

-- Create RLS policies for location-photos bucket to allow public access
CREATE POLICY "Allow public read access on location photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'location-photos');

CREATE POLICY "Allow public upload to location photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'location-photos');

CREATE POLICY "Allow public update of location photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'location-photos');

CREATE POLICY "Allow public delete of location photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'location-photos');