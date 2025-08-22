/**
 * Development File Handler
 * Stores files locally for development and testing
 * In production, this is replaced by actual Google Drive uploads
 */

class DevFileHandler {
  private fileStore: Map<string, { file: File; dataUrl: string }> = new Map();
  
  /**
   * Store file locally and return a URL that can be accessed
   */
  async storeFile(file: File, folder: string): Promise<{ url: string; fileId: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const fileId = `local_${folder}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        // Store in memory
        this.fileStore.set(fileId, { file, dataUrl });
        
        // Also store in localStorage for persistence
        try {
          const storedFiles = JSON.parse(localStorage.getItem('dev_uploaded_files') || '{}');
          storedFiles[fileId] = {
            name: file.name,
            size: file.size,
            type: file.type,
            folder,
            uploadedAt: new Date().toISOString(),
            dataUrl: dataUrl.substring(0, 100) + '...' // Store truncated for reference
          };
          localStorage.setItem('dev_uploaded_files', JSON.stringify(storedFiles));
        } catch (e) {
          console.warn('Could not persist file info to localStorage:', e);
        }
        
        // Return a URL that references the stored file
        // In development, this will be the data URL
        // In production, this would be the actual Google Drive URL
        resolve({
          url: dataUrl, // Use data URL for development
          fileId
        });
      };
      
      reader.onerror = (error) => {
        reject(new Error('Failed to read file: ' + error));
      };
      
      reader.readAsDataURL(file);
    });
  }
  
  /**
   * Get stored file by ID
   */
  getFile(fileId: string): { file: File; dataUrl: string } | undefined {
    return this.fileStore.get(fileId);
  }
  
  /**
   * Delete stored file
   */
  deleteFile(fileId: string): void {
    this.fileStore.delete(fileId);
    
    // Also remove from localStorage
    try {
      const storedFiles = JSON.parse(localStorage.getItem('dev_uploaded_files') || '{}');
      delete storedFiles[fileId];
      localStorage.setItem('dev_uploaded_files', JSON.stringify(storedFiles));
    } catch (e) {
      console.warn('Could not remove file from localStorage:', e);
    }
  }
  
  /**
   * Get all stored files info
   */
  getAllFiles(): Array<{ fileId: string; name: string; size: number; uploadedAt: string }> {
    try {
      const storedFiles = JSON.parse(localStorage.getItem('dev_uploaded_files') || '{}');
      return Object.entries(storedFiles).map(([fileId, info]: [string, any]) => ({
        fileId,
        name: info.name,
        size: info.size,
        uploadedAt: info.uploadedAt
      }));
    } catch (e) {
      return [];
    }
  }
}

export const devFileHandler = new DevFileHandler();