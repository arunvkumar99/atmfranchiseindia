import { useTranslation } from 'react-i18next';
/**
 * Performance monitoring component for tracking Core Web Vitals
 */

import { useEffect } from 'react';
import { usePerformanceStore } from '@/stores';
import { logger } from '@/lib/logger';

// Core Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
  FCP: { good: 1800, needsImprovement: 3000 }, // First Contentful Paint
  LCP: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint
  FID: { good: 100, needsImprovement: 300 },    // First Input Delay
  CLS: { good: 0.1, needsImprovement: 0.25 },   // Cumulative Layout Shift
  TTFB: { good: 800, needsImprovement: 1800 },  // Time to First Byte
};

export const PerformanceMonitor: React.FC = () => {
  const recordPageLoadTime = usePerformanceStore((state) => state.recordPageLoadTime);

  useEffect(() => {
    // Track page load performance
    const measurePageLoad = () => {
      if (typeof window !== 'undefined' && window.performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
          recordPageLoadTime(pageLoadTime);
          
          // Log performance metrics
          const metrics = {
            DNS: navigation.domainLookupEnd - navigation.domainLookupStart,
            TCP: navigation.connectEnd - navigation.connectStart,
            Request: navigation.responseStart - navigation.requestStart,
            Response: navigation.responseEnd - navigation.responseStart,
            DOM: navigation.domComplete - navigation.domInteractive,
            Load: pageLoadTime,
          };
          
          logger.logPerformance('Page Load Metrics', metrics);
        }
      }
    };

    // Track Core Web Vitals
    const observeWebVitals = () => {
      if ('PerformanceObserver' in window) {
        // First Contentful Paint (FCP)
        try {
          const fcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.name === 'first-contentful-paint') {
                const fcp = entry.startTime;
                const rating = fcp <= THRESHOLDS.FCP.good ? 'good' : 
                              fcp <= THRESHOLDS.FCP.needsImprovement ? 'needs-improvement' : 'poor';
                
                logger.logPerformance('FCP', { value: fcp, rating });
                
                // Send to analytics if enabled
                if (window.gtag) {
                  window.gtag('event', 'FCP', {
                    event_category: 'Web Vitals',
                    value: Math.round(fcp),
                    event_label: rating,
                  });
                }
              }
            });
          });
          fcpObserver.observe({ entryTypes: ['paint'] });
        } catch (e) {
          logger.debug('FCP observer not supported');
        }

        // Largest Contentful Paint (LCP)
        try {
          const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            const lcp = lastEntry.startTime;
            const rating = lcp <= THRESHOLDS.LCP.good ? 'good' : 
                          lcp <= THRESHOLDS.LCP.needsImprovement ? 'needs-improvement' : 'poor';
            
            logger.logPerformance('LCP', { value: lcp, rating });
            
            if (window.gtag) {
              window.gtag('event', 'LCP', {
                event_category: 'Web Vitals',
                value: Math.round(lcp),
                event_label: rating,
              });
            }
          });
          lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          logger.debug('LCP observer not supported');
        }

        // First Input Delay (FID)
        try {
          const fidObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              const fid = entry.processingStart - entry.startTime;
              const rating = fid <= THRESHOLDS.FID.good ? 'good' : 
                            fid <= THRESHOLDS.FID.needsImprovement ? 'needs-improvement' : 'poor';
              
              logger.logPerformance('FID', { value: fid, rating });
              
              if (window.gtag) {
                window.gtag('event', 'FID', {
                  event_category: 'Web Vitals',
                  value: Math.round(fid),
                  event_label: rating,
                });
              }
            });
          });
          fidObserver.observe({ entryTypes: ['first-input'] });
        } catch (e) {
          logger.debug('FID observer not supported');
        }

        // Cumulative Layout Shift (CLS)
        try {
          let clsValue = 0;
          let clsEntries: PerformanceEntry[] = [];
          
          const clsObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry: any) => {
              if (!entry.hadRecentInput) {
                clsValue += entry.value;
                clsEntries.push(entry);
              }
            });
            
            const rating = clsValue <= THRESHOLDS.CLS.good ? 'good' : 
                          clsValue <= THRESHOLDS.CLS.needsImprovement ? 'needs-improvement' : 'poor';
            
            logger.logPerformance('CLS', { value: clsValue, rating });
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          logger.debug('CLS observer not supported');
        }
      }
    };

    // Monitor long tasks
    const observeLongTasks = () => {
      if ('PerformanceObserver' in window) {
        try {
          const longTaskObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            entries.forEach((entry) => {
              if (entry.duration > 50) { // Tasks longer than 50ms
                logger.warn('Long task detected', {
                  duration: entry.duration,
                  startTime: entry.startTime,
                  name: entry.name,
                });
              }
            });
          });
          longTaskObserver.observe({ entryTypes: ['longtask'] });
        } catch (e) {
          logger.debug('Long task observer not supported');
        }
      }
    };

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const checkMemory = () => {
          const memory = (performance as any).memory;
          const usedMemoryMB = Math.round(memory.usedJSHeapSize / 1048576);
          const totalMemoryMB = Math.round(memory.totalJSHeapSize / 1048576);
          const limitMemoryMB = Math.round(memory.jsHeapSizeLimit / 1048576);
          
          const usagePercentage = (usedMemoryMB / limitMemoryMB) * 100;
          
          if (usagePercentage > 90) {
            logger.error('High memory usage detected', {
              used: usedMemoryMB,
              total: totalMemoryMB,
              limit: limitMemoryMB,
              percentage: usagePercentage,
            });
          } else if (usagePercentage > 70) {
            logger.warn('Elevated memory usage', {
              used: usedMemoryMB,
              percentage: usagePercentage,
            });
          }
        };
        
        // Check memory every 30 seconds
        const memoryInterval = setInterval(checkMemory, 30000);
        return () => clearInterval(memoryInterval);
      }
    };

    // Initialize monitoring
    if (document.readyState === 'complete') {
      measurePageLoad();
    } else {
      window.addEventListener('load', measurePageLoad);
    }
    
    observeWebVitals();
    observeLongTasks();
    const cleanupMemory = monitorMemory();

    return () => {
      window.removeEventListener('load', measurePageLoad);
      cleanupMemory?.();
    };
  }, [recordPageLoadTime]);

  // This component doesn't render anything
  return null;
};

// Helper function to report vitals to analytics
export const reportWebVitals = (metric: {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}) => {
  const { name, value, rating } = metric;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${name}:`, value, `(${rating})`);
  }
  
  // Send to analytics
  if (window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      value: Math.round(value),
      event_label: rating,
      non_interaction: true,
    });
  }
};

// Declare gtag on window
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}