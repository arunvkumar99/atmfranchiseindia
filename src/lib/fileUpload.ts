import { supabase } from '@/integrations/supabase/client';

export interface FileUploadResult {
  url: string;
  path: string;
}

export const uploadFile = async (
  file: File,
  bucket: string = 'atmfranchiseforms',
  folder: string = 'documents'
): Promise<FileUploadResult> => {
  try {
    console.log(`🔄 Starting file upload: ${file.name} (${file.size} bytes) to bucket: ${bucket}`);
    
    // Validate file
    if (!file) {
      throw new Error('No file provided for upload');
    }
    
    if (file.size === 0) {
      throw new Error('File is empty');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      throw new Error('File size exceeds 10MB limit');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      throw new Error('File has no extension');
    }
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileName = `${folder}/${timestamp}-${randomId}.${fileExt}`;

    console.log(`📤 Uploading to path: ${fileName}`);

    // Upload file to Supabase storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ Storage upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    console.log('✅ File uploaded successfully:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    console.log('📋 Public URL generated:', urlData.publicUrl);

    return {
      url: urlData.publicUrl,
      path: fileName
    };
  } catch (error) {
    console.error('💥 File upload error:', error);
    throw error;
  }
};

export const deleteFile = async (
  path: string,
  bucket: string = 'atmfranchiseforms'
): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
};