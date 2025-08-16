import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ValidationRule {
  field: string;
  required?: boolean;
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  customValidator?: (value: string) => string | null;
  errorMessage?: string;
}

interface UseFormValidationOptions {
  rules: ValidationRule[];
  onValidationComplete?: (isValid: boolean, errors: Record<string, string>) => void;
}

export function useFormValidation({ rules, onValidationComplete }: UseFormValidationOptions) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateField = useCallback((field: string, value: string): string | null => {
    const rule = rules.find(r => r.field === field);
    if (!rule) return null;

    // Required validation
    if (rule.required && !value.trim()) {
      return rule.errorMessage || `${field} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value.trim() && !rule.required) return null;

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.errorMessage || `Invalid ${field} format`;
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      return rule.errorMessage || `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.errorMessage || `${field} must be less than ${rule.maxLength} characters`;
    }

    // Custom validation
    if (rule.customValidator) {
      return rule.customValidator(value);
    }

    return null;
  }, [rules]);

  const validateForm = useCallback((formData: Record<string, string>): boolean => {
    setIsValidating(true);
    const newErrors: Record<string, string> = {};

    rules.forEach(rule => {
      const value = formData[rule.field] || '';
      const error = validateField(rule.field, value);
      if (error) {
        newErrors[rule.field] = error;
      }
    });

    setErrors(newErrors);
    setIsValidating(false);

    const isValid = Object.keys(newErrors).length === 0;
    onValidationComplete?.(isValid, newErrors);

    // Show toast for validation errors
    if (!isValid) {
      const fieldCount = Object.keys(newErrors).length;
      toast({
        title: "Validation Error",
        description: `Please fix ${fieldCount} field${fieldCount > 1 ? 's' : ''} to continue`,
        variant: "destructive"
      });
    }

    return isValid;
  }, [rules, validateField, onValidationComplete, toast]);

  const validateSingleField = useCallback((field: string, value: string): boolean => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    return !error;
  }, [validateField]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  return {
    errors,
    isValidating,
    validateForm,
    validateSingleField,
    clearErrors,
    clearFieldError,
    hasErrors: Object.keys(errors).length > 0
  };
}

// Predefined validation rules for common fields
export const PHONE_VALIDATION: ValidationRule = {
  field: 'phone',
  required: true,
  pattern: /^[6-9]\d{9}$/,
  errorMessage: 'Phone number must be 10 digits starting with 6-9'
};

export const EMAIL_VALIDATION: ValidationRule = {
  field: 'email',
  required: true,
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  maxLength: 320,
  errorMessage: 'Please enter a valid email address (max 320 characters)'
};

export const NAME_VALIDATION: ValidationRule = {
  field: 'name',
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s]+$/,
  errorMessage: 'Name should contain only letters and spaces (2-100 characters)'
};

export const FULL_NAME_VALIDATION: ValidationRule = {
  field: 'fullName',
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s]+$/,
  errorMessage: 'Full name should contain only letters and spaces (2-100 characters)'
};

export const SUBJECT_VALIDATION: ValidationRule = {
  field: 'subject',
  required: true,
  minLength: 5,
  maxLength: 200,
  errorMessage: 'Subject must be between 5-200 characters'
};

export const MESSAGE_VALIDATION: ValidationRule = {
  field: 'message',
  required: true,
  minLength: 10,
  maxLength: 2000,
  errorMessage: 'Message must be between 10-2000 characters'
};

export const PINCODE_VALIDATION: ValidationRule = {
  field: 'pincode',
  required: true,
  pattern: /^[1-9][0-9]{5}$/,
  errorMessage: 'Pincode must be 6 digits and cannot start with 0'
};

export const PAN_VALIDATION: ValidationRule = {
  field: 'panNumber',
  required: true,
  pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  errorMessage: 'PAN number must be in format: ABCDE1234F'
};

export const AADHAAR_VALIDATION: ValidationRule = {
  field: 'aadhaarNumber',
  required: true,
  pattern: /^[0-9]{12}$/,
  errorMessage: 'Aadhaar number must be exactly 12 digits'
};

export const WHATSAPP_VALIDATION: ValidationRule = {
  field: 'whatsappNumber',
  required: false,
  pattern: /^[6-9]\d{9}$/,
  errorMessage: 'WhatsApp number must be 10 digits starting with 6-9'
};

export const CITY_VALIDATION: ValidationRule = {
  field: 'city',
  required: true,
  minLength: 2,
  maxLength: 100,
  pattern: /^[a-zA-Z\s]+$/,
  errorMessage: 'City name should contain only letters and spaces (2-100 characters)'
};

export const STATE_VALIDATION: ValidationRule = {
  field: 'state',
  required: true,
  errorMessage: 'Please select a state'
};

export const BUSINESS_VALIDATION: ValidationRule = {
  field: 'businessExperience',
  required: false,
  maxLength: 500,
  errorMessage: 'Business experience description should be less than 500 characters'
};