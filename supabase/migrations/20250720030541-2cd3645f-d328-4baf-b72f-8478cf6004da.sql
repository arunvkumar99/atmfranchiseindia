-- Create the atmfranchiseforms storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('atmfranchiseforms', 'atmfranchiseforms', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ensure proper RLS policies for the bucket
INSERT INTO storage.policies (name, bucket_id, definition, action, target, command) VALUES
    ('Allow anonymous uploads to atmfranchiseforms', 'atmfranchiseforms', 'true', 'PERMISSIVE', 'objects', 'INSERT'),
    ('Allow public access to atmfranchiseforms', 'atmfranchiseforms', 'true', 'PERMISSIVE', 'objects', 'SELECT'),
    ('Allow anonymous updates to atmfranchiseforms', 'atmfranchiseforms', 'true', 'PERMISSIVE', 'objects', 'UPDATE'),
    ('Allow anonymous deletes from atmfranchiseforms', 'atmfranchiseforms', 'true', 'PERMISSIVE', 'objects', 'DELETE')
ON CONFLICT (name, bucket_id) DO UPDATE SET 
    definition = EXCLUDED.definition,
    action = EXCLUDED.action,
    target = EXCLUDED.target,
    command = EXCLUDED.command;