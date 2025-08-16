/**
 * Input Sanitization Utilities
 * Prevents XSS attacks and SQL injection
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * Removes dangerous tags and attributes
 */
export function sanitizeHtml(input: string): string {
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove on* event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*'[^']*'/gi, '');
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  
  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');
  
  // Remove iframe tags
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Remove object and embed tags
  sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  sanitized = sanitized.replace(/<embed\b[^>]*>/gi, '');
  
  return sanitized;
}

/**
 * Sanitize user input for display
 * Escapes HTML special characters
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitize input for SQL queries
 * Prevents SQL injection attacks
 */
export function sanitizeSql(input: string): string {
  // Remove or escape dangerous SQL characters
  return input
    .replace(/'/g, "''") // Escape single quotes
    .replace(/;/g, '') // Remove semicolons
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove block comments
    .replace(/\*\//g, '') // Remove block comments
    .replace(/xp_/gi, '') // Remove extended stored procedures
    .replace(/sp_/gi, ''); // Remove stored procedures
}

/**
 * Sanitize file names
 * Prevents directory traversal attacks
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');
  sanitized = sanitized.replace(/[\/\\]/g, '');
  
  // Remove special characters except dot and hyphen
  sanitized = sanitized.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Limit length
  if (sanitized.length > 255) {
    const extension = sanitized.split('.').pop();
    const name = sanitized.substring(0, 240);
    sanitized = extension ? `${name}.${extension}` : name;
  }
  
  return sanitized;
}

/**
 * Sanitize URL parameters
 * Prevents URL manipulation attacks
 */
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return '';
    }
    
    // Remove dangerous URL components
    urlObj.username = '';
    urlObj.password = '';
    
    return urlObj.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize email addresses
 */
export function sanitizeEmail(email: string): string {
  // Basic email sanitization
  const sanitized = email.toLowerCase().trim();
  
  // Check for valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return '';
  }
  
  // Remove any HTML tags that might be in the email
  return sanitized.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize phone numbers
 * Removes all non-numeric characters
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Sanitize numeric input
 * Ensures only valid numbers are accepted
 */
export function sanitizeNumber(input: string | number): number {
  const num = typeof input === 'string' ? parseFloat(input) : input;
  return isNaN(num) ? 0 : num;
}

/**
 * Sanitize JSON input
 * Prevents JSON injection attacks
 */
export function sanitizeJson(input: string): object | null {
  try {
    // Remove any JavaScript code
    const sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Parse and re-stringify to ensure valid JSON
    const parsed = JSON.parse(sanitized);
    return JSON.parse(JSON.stringify(parsed));
  } catch {
    return null;
  }
}

/**
 * General purpose input sanitizer
 * Applies appropriate sanitization based on input type
 */
export function sanitizeInput(
  input: string,
  type: 'text' | 'html' | 'email' | 'phone' | 'url' | 'filename' | 'sql' = 'text'
): string {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  switch (type) {
    case 'html':
      return sanitizeHtml(input);
    case 'email':
      return sanitizeEmail(input);
    case 'phone':
      return sanitizePhone(input);
    case 'url':
      return sanitizeUrl(input);
    case 'filename':
      return sanitizeFileName(input);
    case 'sql':
      return sanitizeSql(input);
    case 'text':
    default:
      return escapeHtml(input.trim());
  }
}

/**
 * Sanitize form data object
 * Applies sanitization to all form fields
 */
export function sanitizeFormData<T extends Record<string, any>>(
  formData: T,
  fieldTypes?: Partial<Record<keyof T, 'text' | 'html' | 'email' | 'phone' | 'url'>>
): T {
  const sanitized = {} as T;
  
  for (const [key, value] of Object.entries(formData)) {
    const fieldType = fieldTypes?.[key as keyof T] || 'text';
    
    if (typeof value === 'string') {
      sanitized[key as keyof T] = sanitizeInput(value, fieldType) as T[keyof T];
    } else if (Array.isArray(value)) {
      sanitized[key as keyof T] = value.map(item => 
        typeof item === 'string' ? sanitizeInput(item, fieldType) : item
      ) as T[keyof T];
    } else {
      sanitized[key as keyof T] = value;
    }
  }
  
  return sanitized;
}

/**
 * Validate and sanitize Indian phone number
 */
export function sanitizeIndianPhone(phone: string): string {
  const cleaned = sanitizePhone(phone);
  
  // Indian phone numbers should be 10 digits starting with 6-9
  if (cleaned.length === 10 && /^[6-9]/.test(cleaned)) {
    return cleaned;
  }
  
  // Handle numbers with country code
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned.substring(2);
  }
  
  if (cleaned.length === 13 && cleaned.startsWith('+91')) {
    return cleaned.substring(3);
  }
  
  return '';
}

/**
 * Sanitize PAN number
 */
export function sanitizePAN(pan: string): string {
  const cleaned = pan.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // PAN format: ABCDE1234F
  if (/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleaned)) {
    return cleaned;
  }
  
  return '';
}

/**
 * Sanitize Aadhaar number
 */
export function sanitizeAadhaar(aadhaar: string): string {
  const cleaned = sanitizePhone(aadhaar);
  
  // Aadhaar should be 12 digits
  if (cleaned.length === 12 && /^\d{12}$/.test(cleaned)) {
    return cleaned;
  }
  
  return '';
}

export default {
  sanitizeHtml,
  escapeHtml,
  sanitizeSql,
  sanitizeFileName,
  sanitizeUrl,
  sanitizeEmail,
  sanitizePhone,
  sanitizeNumber,
  sanitizeJson,
  sanitizeInput,
  sanitizeFormData,
  sanitizeIndianPhone,
  sanitizePAN,
  sanitizeAadhaar
};