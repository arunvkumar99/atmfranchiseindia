import { useState, useCallback, useRef } from 'react';

export interface FileUploadState {
  file: File | null;
  preview: string | null;
  isUploaded: boolean;
  uploadedUrl?: string;
  error?: string;
}

export interface UseFileUploadManagerProps {
  maxSizeInMB?: number;
  acceptedTypes?: string[];
  onFileChange?: (file: File | null) => void;
}

export const useFileUploadManager = ({
  maxSizeInMB = 5,
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  onFileChange
}: UseFileUploadManagerProps = {}) => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    preview: null,
    isUploaded: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    console.log('🔍 File validation (permissive mode):', {
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified
    });

    // Check file size
    if (file.size > maxSizeInMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeInMB}MB`;
    }

    // Check for empty files
    if (file.size === 0) {
      return 'File appears to be empty';
    }

    // Accept ALL files - very permissive validation
    console.log('✅ File accepted with permissive validation');
    return null;
  }, [maxSizeInMB]);

  const generatePreview = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      // Only generate preview for images
      if (file.type.startsWith('image/') || !file.type || file.type === 'image/*') {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
      } else {
        resolve(null);
      }
    });
  }, []);

  const setFile = useCallback(async (file: File | null) => {
    console.log('📁 FileUploadManager setFile called:', {
      file: file ? { name: file.name, type: file.type, size: file.size } : null
    });

    if (!file) {
      setUploadState({
        file: null,
        preview: null,
        isUploaded: false
      });
      onFileChange?.(null);
      return { success: true };
    }

    // Fix camera files with missing MIME types
    let processedFile = file;
    const isCameraFile = 
      file.name.includes('image_') || 
      file.name.includes('IMG_') || 
      !file.type || 
      file.type === '' ||
      file.type === 'image/*';

    if (isCameraFile && (!file.type || file.type === '' || file.type === 'image/*')) {
      console.log('📱 Fixing camera file MIME type:', file.name);
      
      // Create a new File object with proper MIME type
      const fileExtension = file.name.toLowerCase().split('.').pop();
      let mimeType = 'image/jpeg'; // Default to JPEG
      
      if (fileExtension === 'png') mimeType = 'image/png';
      else if (fileExtension === 'jpg' || fileExtension === 'jpeg') mimeType = 'image/jpeg';
      
      processedFile = new File([file], file.name, {
        type: mimeType,
        lastModified: file.lastModified
      });
      
      console.log('📱 Camera file MIME type fixed:', {
        original: file.type,
        fixed: processedFile.type,
        name: processedFile.name
      });
    }

    // Validate file
    const validationError = validateFile(processedFile);
    if (validationError) {
      console.error('❌ File validation failed:', validationError);
      setUploadState(prev => ({
        ...prev,
        error: validationError
      }));
      return { success: false, error: validationError };
    }

    // Generate preview
    const preview = await generatePreview(processedFile);

    // Update state
    setUploadState({
      file: processedFile,
      preview,
      isUploaded: false,
      error: undefined
    });

    // Notify parent
    onFileChange?.(processedFile);

    console.log('✅ File successfully set in manager:', {
      name: processedFile.name,
      type: processedFile.type,
      hasPreview: !!preview,
      size: processedFile.size,
      isCameraFile: isCameraFile
    });

    return { success: true };
  }, [validateFile, generatePreview, onFileChange]);

  const openFileSelector = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const openCameraSelector = useCallback(() => {
    cameraInputRef.current?.click();
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    // Clear input values
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  }, [setFile]);

  return {
    uploadState,
    setFile,
    openFileSelector,
    openCameraSelector,
    clearFile,
    fileInputRef,
    cameraInputRef,
    hasFile: !!uploadState.file,
    isValid: !!uploadState.file && !uploadState.error
  };
};