import DOMPurify from 'isomorphic-dompurify';

/**
 * Enhanced Security Module for ATM Franchise India
 * Implements input sanitization, CSP headers, and security best practices
 */

// ============================================
// INPUT SANITIZATION
// ============================================

/**
 * Sanitize HTML input to prevent XSS attacks
 */
export const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br', 'p'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
    SAFE_FOR_TEMPLATES: true
  });
};

/**
 * Sanitize form input to prevent injection attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script tags and events
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  // Trim whitespace
  return sanitized.trim();
};

/**
 * Validate and sanitize email addresses
 */
export const sanitizeEmail = (email: string): string => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const sanitized = sanitizeInput(email).toLowerCase();
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
};

/**
 * Validate and sanitize phone numbers (Indian format)
 */
export const sanitizePhone = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check for valid Indian phone number (10 digits, optionally with +91)
  const phoneRegex = /^(?:\+91)?[6-9]\d{9}$/;
  
  if (!phoneRegex.test(cleaned)) {
    throw new Error('Invalid Indian phone number');
  }
  
  return cleaned;
};

/**
 * Sanitize file names to prevent path traversal attacks
 */
export const sanitizeFileName = (fileName: string): string => {
  // Remove path components
  const name = fileName.replace(/^.*[\\\/]/, '');
  
  // Remove dangerous characters
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
};

// ============================================
// CONTENT SECURITY POLICY (CSP)
// ============================================

/**
 * Generate Content Security Policy headers
 */
export const getCSPHeaders = (): Record<string, string> => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.atmfranchiseindia.com https://sheets.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    isDevelopment ? "upgrade-insecure-requests" : ""
  ].filter(Boolean).join('; ');
  
  return {
    'Content-Security-Policy': cspDirectives,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
  };
};

// ============================================
// RATE LIMITING
// ============================================

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

/**
 * Simple in-memory rate limiter
 */
export const rateLimit = (
  identifier: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute
): boolean => {
  const now = Date.now();
  const record = rateLimitStore[identifier];
  
  if (!record || now > record.resetTime) {
    rateLimitStore[identifier] = {
      count: 1,
      resetTime: now + windowMs
    };
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

// ============================================
// CSRF PROTECTION
// ============================================

/**
 * Generate CSRF token
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate CSRF token
 */
export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

// ============================================
// DATA VALIDATION
// ============================================

/**
 * Validate JSON structure
 */
export const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate URL format
 */
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

/**
 * Validate Indian PIN code
 */
export const isValidPinCode = (pinCode: string): boolean => {
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pinCode);
};

/**
 * Validate PAN card number
 */
export const isValidPAN = (pan: string): boolean => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan.toUpperCase());
};

/**
 * Validate Aadhaar number (basic validation)
 */
export const isValidAadhaar = (aadhaar: string): boolean => {
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

// ============================================
// SECURE STORAGE
// ============================================

/**
 * Encrypt sensitive data before storing
 */
export const encryptData = async (data: string, key: CryptoKey): Promise<string> => {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    dataBuffer
  );
  
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);
  
  return btoa(String.fromCharCode(...combined));
};

/**
 * Decrypt sensitive data
 */
export const decryptData = async (encryptedData: string, key: CryptoKey): Promise<string> => {
  const combined = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
  
  const iv = combined.slice(0, 12);
  const encrypted = combined.slice(12);
  
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * Generate encryption key
 */
export const generateEncryptionKey = async (): Promise<CryptoKey> => {
  return await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// ============================================
// SQL INJECTION PREVENTION
// ============================================

/**
 * Escape SQL special characters
 */
export const escapeSQLString = (str: string): string => {
  if (typeof str !== 'string') return '';
  
  return str
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\x00/g, '\\0')
    .replace(/\x1a/g, '\\Z');
};

// ============================================
// PASSWORD VALIDATION
// ============================================

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ============================================
// EXPORTS
// ============================================

export default {
  sanitizeHTML,
  sanitizeInput,
  sanitizeEmail,
  sanitizePhone,
  sanitizeFileName,
  getCSPHeaders,
  rateLimit,
  generateCSRFToken,
  validateCSRFToken,
  isValidJSON,
  isValidURL,
  isValidPinCode,
  isValidPAN,
  isValidAadhaar,
  encryptData,
  decryptData,
  generateEncryptionKey,
  escapeSQLString,
  validatePasswordStrength
};