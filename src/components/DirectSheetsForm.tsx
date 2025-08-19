/**
 * Direct Google Sheets Form Component
 * No database required - straight to Google Sheets
 * 
 * Features:
 * - Real-time validation
 * - Offline support with retry
 * - Rate limiting
 * - Zero data loss
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { googleSheetsService } from '@/lib/googleSheetsService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertCircle, WifiOff, Shield, Lock, CheckCircle2 } from 'lucide-react';
import { ERROR_MESSAGES, getUserFriendlyError } from '@/lib/errorMessages';
import { ErrorMessage, FieldError } from '@/components/ui/error-message';
import { useTranslation } from 'react-i18next';

// Form validation schema with improved error messages
const formSchema = z.object({
  fullName: z.string().min(2, ERROR_MESSAGES.FORM.MIN_LENGTH(2)),
  email: z.string().email(ERROR_MESSAGES.FORM.INVALID_EMAIL),
  phone: z.string().regex(/^[6-9]\d{9}$/, ERROR_MESSAGES.FORM.INVALID_PHONE),
  city: z.string().min(2, ERROR_MESSAGES.FORM.REQUIRED_FIELD),
  state: z.string().min(2, ERROR_MESSAGES.FORM.REQUIRED_FIELD),
  message: z.string().min(10, ERROR_MESSAGES.FORM.MIN_LENGTH(10))
});

type FormData = z.infer<typeof formSchema>;

interface DirectSheetsFormProps {
  formType: 'contact_submissions' | 'franchise_applications' | 'agent_submissions' | 
            'influencer_submissions' | 'location_submissions' | 'job_applications' | 
            'atm_enquiry_submissions' | 'enquiry_submissions';
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export function DirectSheetsForm({ 
  formType, 
  title = 'Contact Us',
  description = 'Fill out the form and we\'ll get back to you soon.',
  onSuccess 
}: DirectSheetsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error' | 'offline'>('idle');
  const { toast } = useToast();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange' // Real-time validation
  });

  // Watch form values for real-time feedback
  const watchedValues = watch();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmissionStatus('idle');

    try {
      // Check rate limiting
      if (!googleSheetsService.canSubmit(data.email, formType)) {
        toast({
          title: 'Please Wait',
          description: ERROR_MESSAGES.NETWORK.RATE_LIMIT,
          variant: 'destructive'
        });
        setSubmissionStatus('error');
        return;
      }

      // Validate data
      const validation = googleSheetsService.validateFormData(formType, data);
      if (!validation.valid) {
        toast({
          title: 'Please Check Your Information',
          description: validation.errors.join(', '),
          variant: 'destructive'
        });
        setSubmissionStatus('error');
        return;
      }

      // Submit to Google Sheets
      const result = await googleSheetsService.submitForm({
        formType,
        data
      });

      if (result.success) {
        setSubmissionStatus('success');
        toast({
          title: 'Success!',
          description: ERROR_MESSAGES.SUCCESS.FORM_SUBMITTED,
        });
        reset();
        onSuccess?.();
      } else if (result.error === 'OFFLINE') {
        setSubmissionStatus('offline');
        toast({
          title: 'Saved Offline',
          description: ERROR_MESSAGES.NETWORK.OFFLINE,
          variant: 'default'
        });
      } else {
        setSubmissionStatus('error');
        toast({
          title: 'Unable to Submit',
          description: getUserFriendlyError(result.message),
          variant: 'destructive'
        });
      }
    } catch (error) {
      setSubmissionStatus('error');
      toast({
        title: 'Something Went Wrong',
        description: getUserFriendlyError(error),
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">{title}</h2>
        <p className="text-sm sm:text-base text-gray-600">{description}</p>
      </div>

      {/* Security Badges */}
      <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green-700 dark:text-green-400">
          <Shield className="h-4 w-4" />
          <span className="font-medium">SSL Secured</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green-700 dark:text-green-400">
          <Lock className="h-4 w-4" />
          <span className="font-medium">Data Encrypted</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-4 w-4" />
          <span className="font-medium">GDPR Compliant</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder={t('placeholders.fullName', 'Enter your full name')}
            className={errors.fullName ? 'border-red-500 focus:border-red-500' : ''}
          />
          <FieldError error={errors.fullName?.message} />
          {!errors.fullName && watchedValues.fullName && (
            <p className="text-green-500 text-sm mt-1">✓ Valid name</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder={t('placeholders.email', 'your.email@example.com')}
            className={errors.email ? 'border-red-500' : ''}
          />
          <FieldError error={errors.email?.message} />
          {!errors.email && watchedValues.email && (
            <p className="text-green-500 text-sm mt-1">✓ Valid email</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            {...register('phone')}
            placeholder={t('placeholders.phone', '10-digit mobile number')}
            maxLength={10}
            className={errors.phone ? 'border-red-500' : ''}
          />
          <FieldError error={errors.phone?.message} />
          {!errors.phone && watchedValues.phone && (
            <p className="text-green-500 text-sm mt-1">✓ Valid phone number</p>
          )}
        </div>

        {/* City Field */}
        <div>
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            {...register('city')}
            placeholder={t('placeholders.city', 'Enter your city')}
            className={errors.city ? 'border-red-500' : ''}
          />
          <FieldError error={errors.city?.message} />
        </div>

        {/* State Field */}
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            {...register('state')}
            placeholder={t('placeholders.state', 'Select your state')}
            className={errors.state ? 'border-red-500' : ''}
          />
          <FieldError error={errors.state?.message} />
        </div>

        {/* Message Field */}
        <div>
          <Label htmlFor="message">Message *</Label>
          <Textarea
            id="message"
            {...register('message')}
            placeholder="Tell us about your requirements..."
            rows={4}
            className={errors.message ? 'border-red-500' : ''}
          />
          <FieldError error={errors.message?.message} />
          {watchedValues.message && (
            <p className="text-gray-500 text-sm mt-1">
              {watchedValues.message.length}/500 characters
            </p>
          )}
        </div>

        {/* Status Messages */}
        {submissionStatus === 'success' && (
          <ErrorMessage 
            message={ERROR_MESSAGES.SUCCESS.FORM_SUBMITTED}
            type="info"
            className="bg-green-50 border-green-200 text-green-800"
          />
        )}

        {submissionStatus === 'offline' && (
          <ErrorMessage 
            message={ERROR_MESSAGES.NETWORK.OFFLINE}
            type="warning"
          />
        )}

        {submissionStatus === 'error' && (
          <ErrorMessage 
            message={ERROR_MESSAGES.SUBMISSION.GENERIC}
            type="error"
          />
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={!isValid || isSubmitting}
          className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Form'
          )}
        </Button>

        {/* Offline Indicator */}
        {!navigator.onLine && (
          <div className="text-center text-sm text-gray-500">
            <WifiOff className="inline h-4 w-4 mr-1" />
            You're currently offline. Forms will be submitted when reconnected.
          </div>
        )}
      </form>
    </div>
  );
}