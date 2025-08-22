import { googleDriveService } from './googleDriveService';

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
    console.log(`Uploading file: ${file.name} (${file.size} bytes)`);
    
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

    // Check file extension
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      throw new Error('File has no extension');
    }

    // Upload to Google Drive
    console.log('Uploading to Google Drive...');
    const result = await googleDriveService.uploadFile(file, folder);

    console.log('File uploaded successfully:', result.url);

    // Return in expected format
    return {
      url: result.url,    // Public Google Drive URL
      path: result.fileId // Use fileId as path for reference
    };
  } catch (error) {
    if (import.meta.env?.DEV) { 
      console.error('File upload error:', error); 
    }
    throw error;
  }
};

export const deleteFile = async (
  path: string,
  bucket: string = 'atmfranchiseforms'
): Promise<void> => {
  try {
    console.log(`Deleting file: ${path}`);
    
    // Delete from Google Drive using fileId (stored as path)
    await googleDriveService.deleteFile(path);
    
    console.log('File deleted successfully');
  } catch (error) {
    if (import.meta.env?.DEV) { 
      console.error('File delete error:', error); 
    }
    throw error;
  }
};