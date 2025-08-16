import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface MonitoringEvent {
  type: 'error' | 'navigation' | 'performance' | 'user_action';
  data: Record<string, any>;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

export function useMonitoring() {
  useEffect(() => {
    // Performance monitoring
    const monitorPerformance = () => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          logEvent({
            type: 'performance',
            data: {
              loadTime: perfData.loadEventEnd - perfData.fetchStart,
              domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
              firstContentfulPaint: perfData.loadEventStart - perfData.fetchStart,
              duration: perfData.duration
            },
            timestamp: new Date().toISOString(),
            url: window.location.href
          });
        }
      }
    };

    // Error monitoring
    const handleError = (event: ErrorEvent) => {
      logEvent({
        type: 'error',
        data: {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    };

    // Unhandled promise rejection monitoring
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      logEvent({
        type: 'error',
        data: {
          message: 'Unhandled Promise Rejection',
          reason: event.reason?.toString(),
          stack: event.reason?.stack
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    };

    // Navigation monitoring
    const monitorNavigation = () => {
      logEvent({
        type: 'navigation',
        data: {
          path: window.location.pathname,
          search: window.location.search,
          referrer: document.referrer
        },
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      });
    };

    // Set up event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Monitor initial page load
    if (document.readyState === 'complete') {
      monitorPerformance();
      monitorNavigation();
    } else {
      window.addEventListener('load', () => {
        monitorPerformance();
        monitorNavigation();
      });
    }

    // Cleanup
    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

// Helper function to log events
async function logEvent(event: MonitoringEvent) {
  try {
    console.log('📊 Monitoring Event:', event);
    
    // Log to Supabase audit_logs for analysis
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        action: `monitoring_${event.type}`,
        table_name: 'monitoring_events',
        new_values: {
          event_type: event.type,
          event_data: event.data,
          timestamp: event.timestamp,
          user_agent: event.userAgent,
          url: event.url
        }
      });

    if (error) {
      console.warn('Failed to log monitoring event:', error);
    }
  } catch (error) {
    console.warn('Monitoring log error:', error);
  }
}

// Export monitoring utilities
export const monitoring = {
  logUserAction: (action: string, data?: Record<string, any>) => {
    logEvent({
      type: 'user_action',
      data: { action, ...data },
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  },
  
  logFormSubmission: (formType: string, success: boolean, error?: string) => {
    logEvent({
      type: 'user_action',
      data: { 
        action: 'form_submission',
        formType,
        success,
        error
      },
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    });
  }
};