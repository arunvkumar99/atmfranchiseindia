import { useForm, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { sanitizeInput, sanitizeEmail, sanitizePhone, rateLimit } from '@/lib/security-enhanced';

/**
 * Optimized Form Hook with Performance and Security Enhancements
 * Implements validation optimization, input sanitization, and rate limiting
 */

// Form validation modes for different scenarios
export const FORM_MODES = {
  PERFORMANCE: {
    mode: 'onBlur' as const,
    reValidateMode: 'onSubmit' as const,
    criteriaMode: 'firstError' as const,
    shouldFocusError: true,
    delayError: 500
  },
  REALTIME: {
    mode: 'onChange' as const,
    reValidateMode: 'onChange' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
    delayError: 0
  },
  SUBMISSION: {
    mode: 'onSubmit' as const,
    reValidateMode: 'onSubmit' as const,
    criteriaMode: 'all' as const,
    shouldFocusError: true,
    delayError: 0
  }
} as const;

// Common validation schemas
export const commonSchemas = {
  email: z.string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .transform(val => sanitizeEmail(val)),
    
  phone: z.string()
    .min(10, 'Phone number must be 10 digits')
    .max(15, 'Phone number too long')
    .transform(val => sanitizePhone(val)),
    
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name too long')
    .transform(val => sanitizeInput(val)),
    
  pinCode: z.string()
    .regex(/^[1-9][0-9]{5}$/, 'Invalid PIN code')
    .transform(val => sanitizeInput(val)),
    
  pan: z.string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
    .transform(val => val.toUpperCase()),
    
  aadhaar: z.string()
    .regex(/^[2-9]{1}[0-9]{11}$/, 'Invalid Aadhaar number')
    .transform(val => val.replace(/\s/g, '')),
    
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(500, 'Message too long')
    .transform(val => sanitizeInput(val))
};

interface UseOptimizedFormOptions<T extends FieldValues> extends UseFormProps<T> {
  schema?: z.ZodSchema<T>;
  formMode?: keyof typeof FORM_MODES;
  enableRateLimit?: boolean;
  rateLimitKey?: string;
  onSubmitSuccess?: (data: T) => void | Promise<void>;
  onSubmitError?: (error: Error) => void;
  sanitizers?: Record<string, (value: any) => any>;
}

export function useOptimizedForm<T extends FieldValues>({
  schema,
  formMode = 'PERFORMANCE',
  enableRateLimit = true,
  rateLimitKey = 'form-submission',
  onSubmitSuccess,
  onSubmitError,
  sanitizers = {},
  ...formOptions
}: UseOptimizedFormOptions<T> = {}) {
  
  // Memoize form configuration
  const formConfig = useMemo(() => ({
    ...FORM_MODES[formMode],
    ...formOptions,
    ...(schema && { resolver: zodResolver(schema) })
  }), [formMode, formOptions, schema]);
  
  // Initialize form with optimized settings
  const form = useForm<T>(formConfig);
  
  // Memoized submit handler with rate limiting and sanitization
  const handleSubmit = useCallback(async (data: T) => {
    try {
      // Check rate limit
      if (enableRateLimit && !rateLimit(rateLimitKey, 3, 60000)) {
        throw new Error('Too many submissions. Please wait a moment.');
      }
      
      // Apply custom sanitizers
      const sanitizedData = Object.entries(data).reduce((acc, [key, value]) => {
        if (sanitizers[key]) {
          acc[key as keyof T] = sanitizers[key](value);
        } else if (typeof value === 'string') {
          acc[key as keyof T] = sanitizeInput(value) as T[keyof T];
        } else {
          acc[key as keyof T] = value;
        }
        return acc;
      }, {} as T);
      
      // Call success handler
      if (onSubmitSuccess) {
        await onSubmitSuccess(sanitizedData);
      }
      
      return sanitizedData;
    } catch (error) {
      if (onSubmitError) {
        onSubmitError(error as Error);
      }
      throw error;
    }
  }, [enableRateLimit, rateLimitKey, sanitizers, onSubmitSuccess, onSubmitError]);
  
  // Optimized field registration with memoization
  const registerField = useCallback((name: keyof T, options = {}) => {
    return form.register(name as any, {
      ...options,
      setValueAs: (value: any) => {
        // Apply sanitization during registration
        if (sanitizers[name as string]) {
          return sanitizers[name as string](value);
        }
        if (typeof value === 'string') {
          return sanitizeInput(value);
        }
        return value;
      }
    });
  }, [form, sanitizers]);
  
  // Batch field updates for better performance
  const batchUpdate = useCallback((updates: Partial<T>) => {
    Object.entries(updates).forEach(([key, value]) => {
      form.setValue(key as any, value as any, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: false
      });
    });
  }, [form]);
  
  // Clear form with optimization
  const clearForm = useCallback(() => {
    form.reset(undefined, {
      keepErrors: false,
      keepDirty: false,
      keepIsSubmitted: false,
      keepTouched: false,
      keepIsValid: false,
      keepSubmitCount: false
    });
  }, [form]);
  
  // Get form state with memoization
  const formState = useMemo(() => ({
    isSubmitting: form.formState.isSubmitting,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
    touchedFields: form.formState.touchedFields,
    dirtyFields: form.formState.dirtyFields
  }), [
    form.formState.isSubmitting,
    form.formState.isValid,
    form.formState.isDirty,
    form.formState.errors,
    form.formState.touchedFields,
    form.formState.dirtyFields
  ]);
  
  return {
    ...form,
    handleSubmit: form.handleSubmit(handleSubmit),
    registerField,
    batchUpdate,
    clearForm,
    formState
  };
}

// Example usage with a contact form
export const useContactForm = () => {
  const schema = z.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    message: commonSchemas.message
  });
  
  return useOptimizedForm({
    schema,
    formMode: 'PERFORMANCE',
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: ''
    }
  });
};

// Example usage with a franchise form
export const useFranchiseForm = () => {
  const schema = z.object({
    name: commonSchemas.name,
    email: commonSchemas.email,
    phone: commonSchemas.phone,
    pinCode: commonSchemas.pinCode,
    investment: z.enum(['5-10L', '10-25L', '25-50L', '50L+']),
    experience: z.enum(['0-2', '2-5', '5-10', '10+']),
    message: commonSchemas.message.optional()
  });
  
  return useOptimizedForm({
    schema,
    formMode: 'PERFORMANCE',
    enableRateLimit: true,
    rateLimitKey: 'franchise-form'
  });
};