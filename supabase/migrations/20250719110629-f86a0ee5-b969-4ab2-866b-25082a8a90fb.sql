-- Create policies for the atmfranchiseforms storage bucket
-- First check if policies exist and drop them
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Allow anonymous uploads to atmfranchiseforms" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public access to atmfranchiseforms" ON storage.objects;
    DROP POLICY IF EXISTS "Allow anonymous updates to atmfranchiseforms" ON storage.objects;
    DROP POLICY IF EXISTS "Allow anonymous deletes from atmfranchiseforms" ON storage.objects;
EXCEPTION
    WHEN undefined_object THEN
        -- Policies don't exist, continue
        NULL;
END $$;

-- Insert policies into storage.policies table instead
INSERT INTO storage.policies (name, bucket_id, definition, action, target, command) VALUES
    ('Allow anonymous uploads to atmfranchiseforms', 'atmfranchiseforms', 'bucket_id = ''atmfranchiseforms''', 'PERMISSIVE', 'objects', 'INSERT'),
    ('Allow public access to atmfranchiseforms', 'atmfranchiseforms', 'bucket_id = ''atmfranchiseforms''', 'PERMISSIVE', 'objects', 'SELECT'),
    ('Allow anonymous updates to atmfranchiseforms', 'atmfranchiseforms', 'bucket_id = ''atmfranchiseforms''', 'PERMISSIVE', 'objects', 'UPDATE'),
    ('Allow anonymous deletes from atmfranchiseforms', 'atmfranchiseforms', 'bucket_id = ''atmfranchiseforms''', 'PERMISSIVE', 'objects', 'DELETE')
ON CONFLICT (name, bucket_id) DO UPDATE SET 
    definition = EXCLUDED.definition,
    action = EXCLUDED.action,
    target = EXCLUDED.target,
    command = EXCLUDED.command;