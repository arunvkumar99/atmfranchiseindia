/**
 * Centralized error message system for clear, user-friendly error communication
 */

export const ERROR_MESSAGES = {
  // Form validation errors
  FORM: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Please enter a valid 10-digit mobile number',
    INVALID_PINCODE: 'Please enter a valid 6-digit PIN code',
    MIN_LENGTH: (min: number) => `Must be at least ${min} characters`,
    MAX_LENGTH: (max: number) => `Must not exceed ${max} characters`,
    INVALID_NAME: 'Please enter a valid name (letters and spaces only)',
    INVALID_AMOUNT: 'Please enter a valid amount',
    TERMS_REQUIRED: 'You must accept the terms and conditions',
  },

  // Network errors
  NETWORK: {
    OFFLINE: 'You appear to be offline. Please check your internet connection.',
    TIMEOUT: 'The request took too long. Please try again.',
    SERVER_ERROR: 'Something went wrong on our end. Please try again later.',
    RATE_LIMIT: 'Too many requests. Please wait a moment and try again.',
  },

  // Submission errors
  SUBMISSION: {
    GENERIC: 'Unable to submit your form. Please try again.',
    DUPLICATE: 'It looks like you already submitted this form. We\'ll get back to you soon!',
    INCOMPLETE: 'Please fill in all required fields before submitting.',
    PROCESSING: 'Your submission is being processed. Please wait...',
  },

  // Success messages
  SUCCESS: {
    FORM_SUBMITTED: 'Thank you! Your form has been submitted successfully.',
    DATA_SAVED: 'Your information has been saved.',
    EMAIL_SENT: 'Email sent successfully!',
    PROFILE_UPDATED: 'Your profile has been updated.',
  },

  // Auth errors
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password. Please try again.',
    SESSION_EXPIRED: 'Your session has expired. Please log in again.',
    UNAUTHORIZED: 'You don\'t have permission to access this page.',
    ACCOUNT_LOCKED: 'Your account has been temporarily locked. Please try again later.',
  },

  // File upload errors
  FILE: {
    TOO_LARGE: (maxSize: string) => `File size must be less than ${maxSize}`,
    INVALID_TYPE: 'Please upload a valid file type (JPG, PNG, PDF)',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  },

  // Business logic errors
  BUSINESS: {
    LOCATION_EXISTS: 'An ATM location already exists at this address.',
    INVALID_INVESTMENT: 'Please select a valid investment amount.',
    SERVICE_UNAVAILABLE: 'This service is temporarily unavailable in your area.',
  },
};

/**
 * Get a user-friendly error message from an error object
 */
export function getUserFriendlyError(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    // Check for specific error types
    if (error.message.includes('Network')) {
      return ERROR_MESSAGES.NETWORK.OFFLINE;
    }
    if (error.message.includes('timeout')) {
      return ERROR_MESSAGES.NETWORK.TIMEOUT;
    }
    if (error.message.includes('429') || error.message.includes('rate limit')) {
      return ERROR_MESSAGES.NETWORK.RATE_LIMIT;
    }
    if (error.message.includes('500') || error.message.includes('Internal Server')) {
      return ERROR_MESSAGES.NETWORK.SERVER_ERROR;
    }
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
    }
    if (error.message.includes('403') || error.message.includes('Forbidden')) {
      return ERROR_MESSAGES.AUTH.UNAUTHORIZED;
    }

    // Return the error message if it seems user-friendly
    if (error.message.length < 100 && !error.message.includes('Error:')) {
      return error.message;
    }
  }

  // Default fallback
  return ERROR_MESSAGES.SUBMISSION.GENERIC;
}

/**
 * Format field-specific validation errors
 */
export function getFieldError(field: string, value: any): string | null {
  switch (field) {
    case 'email':
      if (!value) return ERROR_MESSAGES.FORM.REQUIRED_FIELD;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return ERROR_MESSAGES.FORM.INVALID_EMAIL;
      }
      break;

    case 'phone':
    case 'mobile':
      if (!value) return ERROR_MESSAGES.FORM.REQUIRED_FIELD;
      if (!/^[6-9]\d{9}$/.test(value.replace(/\D/g, ''))) {
        return ERROR_MESSAGES.FORM.INVALID_PHONE;
      }
      break;

    case 'pincode':
    case 'pin':
      if (!value) return ERROR_MESSAGES.FORM.REQUIRED_FIELD;
      if (!/^\d{6}$/.test(value)) {
        return ERROR_MESSAGES.FORM.INVALID_PINCODE;
      }
      break;

    case 'name':
    case 'fullName':
      if (!value) return ERROR_MESSAGES.FORM.REQUIRED_FIELD;
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        return ERROR_MESSAGES.FORM.INVALID_NAME;
      }
      if (value.length < 2) {
        return ERROR_MESSAGES.FORM.MIN_LENGTH(2);
      }
      break;

    default:
      if (!value && field.includes('required')) {
        return ERROR_MESSAGES.FORM.REQUIRED_FIELD;
      }
  }

  return null;
}