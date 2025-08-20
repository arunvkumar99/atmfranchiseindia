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
    console.log(`File upload disabled: ${file.name} (${file.size} bytes)`);
    
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

    // Generate unique filename for reference
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt) {
      throw new Error('File has no extension');
    }
    
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const fileName = `${folder}/${timestamp}-${randomId}.${fileExt}`;

    console.log(`File upload simulation: would upload to ${fileName}`);

    // For demo purposes, create a data URL from the file
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    console.log('File converted to data URL for local storage');

    // Store file info in localStorage for demo
    const fileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      dataUrl,
      path: fileName,
      uploadedAt: new Date().toISOString()
    };

    const storedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
    storedFiles.push(fileInfo);
    localStorage.setItem('uploaded_files', JSON.stringify(storedFiles));

    return {
      url: dataUrl, // Return data URL instead of public URL
      path: fileName
    };
  } catch (error) {
    if (import.meta.env?.DEV) if (import.meta.env.DEV) { console.error('File upload error:', error); }
    throw error;
  }
};

export const deleteFile = async (
  path: string,
  bucket: string = 'atmfranchiseforms'
): Promise<void> => {
  try {
    console.log(`File deletion disabled for: ${path}`);
    
    // Remove from localStorage for demo
    const storedFiles = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
    const updatedFiles = storedFiles.filter((file: any) => file.path !== path);
    localStorage.setItem('uploaded_files', JSON.stringify(updatedFiles));
    
    console.log('File removed from local storage');
  } catch (error) {
    if (import.meta.env?.DEV) if (import.meta.env.DEV) { console.error('File delete error:', error); }
    throw error;
  }
};