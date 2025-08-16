
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseRateLimitedSubmissionOptions {
  formType: string;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

export function useRateLimitedSubmission({
  formType,
  onSuccess,
  onError
}: UseRateLimitedSubmissionOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const { toast } = useToast();

  const submitWithRateLimit = useCallback(async (
    submitFunction: () => Promise<any>,
    identifier?: string
  ) => {
    if (isSubmitting || isBlocked) return;

    try {
      setIsSubmitting(true);
      
      // Execute the actual submission directly
      const submissionResult = await submitFunction();
      
      // Only show success if we reach here without errors
      onSuccess?.(submissionResult);
      return submissionResult;

    } catch (error) {
      console.error('Submission error:', error);
      onError?.(error);
      
      // Only show error toast, not conflicting with success messages
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly if the problem persists.",
        variant: "destructive"
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, isBlocked, onSuccess, onError, toast]);

  return {
    submitWithRateLimit,
    isSubmitting,
    isBlocked
  };
}
