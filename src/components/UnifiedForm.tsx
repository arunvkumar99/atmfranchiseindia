/**
 * Unified Form Component
 * Consolidates all form logic into a single configurable component
 */

import React, { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useRateLimitedSubmission } from '@/hooks/useRateLimitedSubmission';
import { logger } from '@/lib/logger';
import { stateOptions } from '@/lib/stateOptions';
import type { FormField, FormData, FormValidation } from '@/types';

// ============================================
// Form Configuration Interface
// ============================================

export interface UnifiedFormConfig {
  formName: string;
  fields: FormField[];
  submitUrl?: string;
  submitToGoogleSheets?: boolean;
  successMessage?: string;
  errorMessage?: string;
  redirectOnSuccess?: string;
  captchaRequired?: boolean;
  rateLimit?: {
    maxAttempts: number;
    windowMs: number;
  };
  customValidation?: (data: FormData) => Promise<boolean>;
  onSubmitSuccess?: (data: FormData) => void;
  onSubmitError?: (error: Error) => void;
}

// ============================================
// Validation Schema Builder
// ============================================

const buildValidationSchema = (fields: FormField[]) => {
  const { t } = useTranslation('forms');
  const schemaShape: Record<string, z.ZodType> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodType = z.string();

    // Base type validation
    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email('Invalid email address');
        break;
      case 'tel':
        fieldSchema = z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number');
        break;
      case 'checkbox':
        fieldSchema = z.boolean();
        break;
      case 'file':
        fieldSchema = z.instanceof(File).optional();
        break;
      default:
        fieldSchema = z.string();
    }

    // Apply additional validation rules
    if (field.validation) {
      const validation = field.validation;
      
      if (validation.minLength && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.min(validation.minLength, `Minimum ${validation.minLength} characters required`);
      }
      if (validation.maxLength && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.max(validation.maxLength, `Maximum ${validation.maxLength} characters allowed`);
      }
      if (validation.pattern && fieldSchema instanceof z.ZodString) {
        fieldSchema = fieldSchema.regex(validation.pattern, 'Invalid format');
      }
    }

    // Apply required validation
    if (!field.required && fieldSchema instanceof z.ZodString) {
      fieldSchema = fieldSchema.optional();
    }

    schemaShape[field.name] = fieldSchema;
  });

  return z.object(schemaShape);
};

// ============================================
// Unified Form Component
// ============================================

export const UnifiedForm: React.FC<UnifiedFormConfig> = ({
  formName,
  fields,
  submitUrl,
  submitToGoogleSheets = true,
  successMessage = 'Form submitted successfully!',
  errorMessage = 'Failed to submit form. Please try again.',
  redirectOnSuccess,
  captchaRequired = false,
  rateLimit = { maxAttempts: 3, windowMs: 60000 },
  customValidation,
  onSubmitSuccess,
  onSubmitError,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { toast } = useToast();
  const { checkRateLimit, recordAttempt } = useRateLimitedSubmission(formName, rateLimit);

  // Build validation schema
  const validationSchema = useMemo(() => buildValidationSchema(fields), [fields]);

  // Initialize form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(validationSchema),
  });

  // Handle form submission
  const onSubmit = useCallback(async (data: FormData) => {
    try {
      setIsSubmitting(true);
      setSubmitStatus('idle');

      // Check rate limit
      if (!checkRateLimit()) {
        throw new Error('Too many submission attempts. Please wait and try again.');
      }

      // Custom validation if provided
      if (customValidation) {
        const isValid = await customValidation(data);
        if (!isValid) {
          throw new Error('Validation failed');
        }
      }

      // Log form submission attempt
      logger.logFormSubmission(formName, true);

      // Submit to Google Sheets if configured
      if (submitToGoogleSheets) {
        const response = await fetch('/api/submit-to-sheets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formName,
            data,
            timestamp: new Date().toISOString(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit to Google Sheets');
        }
      }

      // Submit to custom URL if provided
      if (submitUrl) {
        const response = await fetch(submitUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
      }

      // Record successful attempt
      recordAttempt(true);

      // Success handling
      setSubmitStatus('success');
      toast({
        title: 'Success!',
        description: successMessage,
      });

      // Call success callback
      onSubmitSuccess?.(data);

      // Reset form
      reset();

      // Redirect if configured
      if (redirectOnSuccess) {
        setTimeout(() => {
          window.location.href = redirectOnSuccess;
        }, 2000);
      }
    } catch (error) {
      // Error handling
      setSubmitStatus('error');
      recordAttempt(false);
      
      const errorMsg = error instanceof Error ? error.message : errorMessage;
      
      logger.error('Form submission failed', error, formName);
      
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });

      // Call error callback
      onSubmitError?.(error instanceof Error ? error : new Error(errorMsg));
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formName,
    submitToGoogleSheets,
    submitUrl,
    successMessage,
    errorMessage,
    redirectOnSuccess,
    customValidation,
    onSubmitSuccess,
    onSubmitError,
    checkRateLimit,
    recordAttempt,
    toast,
    reset,
  ]);

  // Render form field based on type
  const renderField = (field: FormField) => {
    const errorMessage = errors[field.name]?.message;

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Select
              onValueChange={(value) => setValue(field.name, value)}
              disabled={isSubmitting}
            >
              <SelectTrigger id={field.name} className={errorMessage ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorMessage && (
              <p className="text-sm text-red-500">{String(errorMessage)}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              {...register(field.name)}
              placeholder={field.placeholder}
              disabled={isSubmitting}
              className={errorMessage ? 'border-red-500' : ''}
              rows={4}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{String(errorMessage)}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Checkbox
              id={field.name}
              {...register(field.name)}
              disabled={isSubmitting}
            />
            <Label htmlFor={field.name} className="cursor-pointer">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {errorMessage && (
              <p className="text-sm text-red-500 ml-6">{String(errorMessage)}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.name} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <RadioGroup
              onValueChange={(value) => setValue(field.name, value)}
              disabled={isSubmitting}
            >
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {errorMessage && (
              <p className="text-sm text-red-500">{String(errorMessage)}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type}
              {...register(field.name)}
              placeholder={field.placeholder}
              disabled={isSubmitting}
              className={errorMessage ? 'border-red-500' : ''}
              autoComplete={field.type === 'email' ? 'email' : field.type === 'tel' ? 'tel' : undefined}
            />
            {errorMessage && (
              <p className="text-sm text-red-500">{String(errorMessage)}</p>
            )}
          </div>
        );
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Form Fields */}
      <div className="space-y-4">
        {fields.map(renderField)}
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-green-500 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className="border-red-500 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </motion.form>
  );
};

// ============================================
// Preset Form Configurations
// ============================================

export const formConfigs = {
  contact: {
    formName: 'Contact Form',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text' as const, required: true },
      { name: 'email', label: 'Email Address', type: 'email' as const, required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
      { name: 'subject', label: 'Subject', type: 'text' as const, required: true },
      { name: 'message', label: 'Message', type: 'textarea' as const, required: true },
    ],
  },
  
  franchise: {
    formName: 'Franchise Inquiry',
    fields: [
      { name: 'name', label: 'Full Name', type: 'text' as const, required: true },
      { name: 'email', label: 'Email Address', type: 'email' as const, required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
      { 
        name: 'state', 
        label: 'State', 
        type: 'select' as const, 
        required: true,
        options: stateOptions.map(state => ({ value: state, label: state }))
      },
      { name: 'city', label: 'City', type: 'text' as const, required: true },
      { 
        name: 'investment', 
        label: 'Investment Capacity', 
        type: 'select' as const,
        options: [
          { value: '< 5 Lakhs', label: '< 5 Lakhs' },
          { value: '5-10 Lakhs', label: '5-10 Lakhs' },
          { value: '10-25 Lakhs', label: '10-25 Lakhs' },
          { value: '> 25 Lakhs', label: '> 25 Lakhs' },
        ]
      },
      { name: 'message', label: 'Additional Information', type: 'textarea' as const },
    ],
  },

  location: {
    formName: 'Submit Location',
    fields: [
      { name: 'name', label: 'Your Name', type: 'text' as const, required: true },
      { name: 'email', label: 'Email Address', type: 'email' as const, required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel' as const, required: true },
      { name: 'address', label: 'Location Address', type: 'text' as const, required: true },
      { name: 'city', label: 'City', type: 'text' as const, required: true },
      { 
        name: 'state', 
        label: 'State', 
        type: 'select' as const, 
        required: true,
        options: stateOptions.map(state => ({ value: state, label: state }))
      },
      { name: 'pincode', label: 'Pincode', type: 'text' as const, required: true },
      { name: 'landmark', label: 'Nearby Landmark', type: 'text' as const },
      { name: 'footfall', label: 'Estimated Daily Footfall', type: 'text' as const },
    ],
  },

  newsletter: {
    formName: 'Newsletter Subscription',
    fields: [
      { name: 'email', label: 'Email Address', type: 'email' as const, required: true },
      { 
        name: 'frequency', 
        label: 'Email Frequency', 
        type: 'radio' as const,
        options: [
          { value: 'weekly', label: 'Weekly Updates' },
          { value: 'monthly', label: 'Monthly Newsletter' },
        ]
      },
      { 
        name: 'consent', 
        label: 'I agree to receive marketing emails', 
        type: 'checkbox' as const, 
        required: true 
      },
    ],
  },
};