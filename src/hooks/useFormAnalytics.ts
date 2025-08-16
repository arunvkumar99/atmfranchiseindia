
import { useEffect, useRef } from 'react';

interface FormAnalyticsOptions {
  formType: string;
  formData: Record<string, any>;
  enabled?: boolean;
}

interface AnalyticsEvent {
  formType: string;
  eventType: 'form_start' | 'field_complete' | 'field_error' | 'form_abandon' | 'form_submit' | 'step_complete';
  fieldName?: string;
  timestamp: string;
  sessionId: string;
  completionPercentage?: number;
}

export function useFormAnalytics({ formType, formData, enabled = true }: FormAnalyticsOptions) {
  const sessionId = useRef(`analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const startTime = useRef<Date>(new Date());
  const lastActivity = useRef<Date>(new Date());
  const trackedFields = useRef<Set<string>>(new Set());

  const trackEvent = (eventType: AnalyticsEvent['eventType'], fieldName?: string, additionalData?: any) => {
    if (!enabled) return;

    const event: AnalyticsEvent = {
      formType,
      eventType,
      fieldName,
      timestamp: new Date().toISOString(),
      sessionId: sessionId.current,
      completionPercentage: calculateCompletionPercentage(),
      ...additionalData
    };

    // Log to console for development
    console.log('📊 Form Analytics:', event);

    // In production, you would send this to your analytics service
    // Example: sendToAnalytics(event);
  };

  const calculateCompletionPercentage = () => {
    // Handle null/undefined formData
    if (!formData || typeof formData !== 'object') return 0;
    
    const totalFields = Object.keys(formData).length;
    if (totalFields === 0) return 0;

    const completedFields = Object.values(formData).filter(value => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === 'string') return value.trim().length > 0;
      if (typeof value === 'boolean') return true;
      return value !== null && value !== undefined && value !== '';
    }).length;

    return Math.round((completedFields / totalFields) * 100);
  };

  // Track form start
  useEffect(() => {
    trackEvent('form_start');
    
    // Track form abandon on page unload
    const handleBeforeUnload = () => {
      const completionPercentage = calculateCompletionPercentage();
      if (completionPercentage > 0 && completionPercentage < 100) {
        trackEvent('form_abandon', undefined, {
          timeSpent: Math.round((new Date().getTime() - startTime.current.getTime()) / 1000),
          completionPercentage
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track field completion
  useEffect(() => {
    if (!formData || typeof formData !== 'object') return;
    
    Object.entries(formData).forEach(([fieldName, value]) => {
      const hasValue = Array.isArray(value) 
        ? value.length > 0 
        : (typeof value === 'string' ? value.trim().length > 0 : value !== null && value !== undefined && value !== '');

      if (hasValue && !trackedFields.current.has(fieldName)) {
        trackedFields.current.add(fieldName);
        trackEvent('field_complete', fieldName);
        lastActivity.current = new Date();
      }
    });
  }, [formData]);

  const trackFieldError = (fieldName: string, errorMessage: string) => {
    trackEvent('field_error', fieldName, { errorMessage });
  };

  const trackFormSubmit = (isSuccess: boolean, errorMessage?: string) => {
    const timeSpent = Math.round((new Date().getTime() - startTime.current.getTime()) / 1000);
    trackEvent('form_submit', undefined, {
      isSuccess,
      errorMessage,
      timeSpent,
      completionPercentage: 100
    });
  };

  return {
    trackEvent,
    trackFieldError,
    trackFormSubmit,
    sessionId: sessionId.current,
    completionPercentage: calculateCompletionPercentage()
  };
}
