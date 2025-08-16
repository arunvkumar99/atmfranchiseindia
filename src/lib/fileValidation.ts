// Enhanced file validation utilities
import { validateFileType, validateFileSize, sanitizeFileName } from './validation';

export interface FileValidationConfig {
  allowedTypes: string[];
  maxSizeBytes: number;
  allowedExtensions?: string[];
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedName?: string;
}

// Common file validation configurations
export const FILE_VALIDATION_CONFIGS = {
  images: {
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.gif']
  },
  documents: {
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png']
  },
  resume: {
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSizeBytes: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['.pdf', '.doc', '.docx']
  }
} as const;

export function validateFile(file: File, config: FileValidationConfig): FileValidationResult {
  const errors: string[] = [];

  // Check file type
  if (!validateFileType(file, config.allowedTypes)) {
    errors.push(`File type not allowed. Allowed types: ${config.allowedTypes.join(', ')}`);
  }

  // Check file size
  if (!validateFileSize(file, config.maxSizeBytes)) {
    const maxSizeMB = (config.maxSizeBytes / (1024 * 1024)).toFixed(1);
    errors.push(`File size too large. Maximum size: ${maxSizeMB}MB`);
  }

  // Check file extension if specified
  if (config.allowedExtensions) {
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!config.allowedExtensions.includes(fileExtension)) {
      errors.push(`File extension not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`);
    }
  }

  // Enhanced security checks
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    errors.push('Invalid file name characters detected');
  }

  // Check for suspicious file names and extensions
  const suspiciousPatterns = [
    /\.exe$/i, /\.bat$/i, /\.cmd$/i, /\.com$/i, /\.pif$/i, /\.scr$/i,
    /\.vbs$/i, /\.js$/i, /\.jar$/i, /\.php$/i, /\.asp$/i, /\.jsp$/i,
    /\.sh$/i, /\.ps1$/i, /\.msi$/i, /\.app$/i, /\.deb$/i, /\.rpm$/i
  ];

  if (suspiciousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File type not allowed for security reasons');
  }

  // Check file extension matches MIME type
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  const expectedExtensions: { [key: string]: string[] } = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/gif': ['gif'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
    'text/plain': ['txt'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx']
  };

  if (expectedExtensions[file.type] && fileExtension) {
    if (!expectedExtensions[file.type].includes(fileExtension)) {
      errors.push('File extension does not match file type');
    }
  }

  // Check for potentially dangerous file names
  const dangerousPatterns = [
    /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i,  // Windows reserved names
    /[<>:"|?*]/,  // Invalid characters
    /\x00/,  // Null bytes
  ];

  if (dangerousPatterns.some(pattern => pattern.test(file.name))) {
    errors.push('File name contains potentially dangerous characters or patterns');
  }

  // Check for minimum file size (to prevent empty files being uploaded)
  if (file.size < 10) {
    errors.push('File appears to be empty or corrupted');
  }

  // Check for maximum reasonable file size even within allowed limits
  if (file.size > 50 * 1024 * 1024) { // 50MB hard limit
    errors.push('File is too large to process safely');
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedName: errors.length === 0 ? sanitizeFileName(file.name) : undefined
  };
}

// Validate multiple files
export function validateFiles(files: FileList | File[], config: FileValidationConfig): FileValidationResult[] {
  const fileArray = Array.from(files);
  return fileArray.map(file => validateFile(file, config));
}

// Get human-readable file size
export function getHumanFileSize(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}