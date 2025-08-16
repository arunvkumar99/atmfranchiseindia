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
import { Loader2, CheckCircle, AlertCircle, WifiOff } from 'lucide-react';

// Form validation schema
const formSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter valid 10-digit phone number'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
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
          title: 'Submission Limit Reached',
          description: 'You can only submit 3 times per hour. Please try again later.',
          variant: 'destructive'
        });
        setSubmissionStatus('error');
        return;
      }

      // Validate data
      const validation = googleSheetsService.validateFormData(formType, data);
      if (!validation.valid) {
        toast({
          title: 'Validation Error',
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
          description: 'Your form has been submitted successfully.',
        });
        reset();
        onSuccess?.();
      } else if (result.error === 'OFFLINE') {
        setSubmissionStatus('offline');
        toast({
          title: 'Offline Mode',
          description: 'Your submission will be sent when you\'re back online.',
          variant: 'default'
        });
      } else {
        setSubmissionStatus('error');
        toast({
          title: 'Submission Failed',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      setSubmissionStatus('error');
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName')}
            placeholder="John Doe"
            className={errors.fullName ? 'border-red-500' : ''}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
          )}
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
            placeholder="john@example.com"
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
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
            placeholder="9876543210"
            maxLength={10}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
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
            placeholder="Mumbai"
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        {/* State Field */}
        <div>
          <Label htmlFor="state">State *</Label>
          <Input
            id="state"
            {...register('state')}
            placeholder="Maharashtra"
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
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
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
          {watchedValues.message && (
            <p className="text-gray-500 text-sm mt-1">
              {watchedValues.message.length}/500 characters
            </p>
          )}
        </div>

        {/* Status Messages */}
        {submissionStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Form submitted successfully!</span>
          </div>
        )}

        {submissionStatus === 'offline' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-yellow-600" />
            <span className="text-yellow-800">You're offline. Form will be sent when connected.</span>
          </div>
        )}

        {submissionStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">Submission failed. Please try again.</span>
          </div>
        )}

        {/* Submit Button */}
        <Button 
          type="submit" 
          disabled={!isValid || isSubmitting}
          className="w-full"
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