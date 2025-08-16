/**
 * Performance Monitoring Utilities
 * Tracks and reports application performance metrics
 */

interface PerformanceMetrics {
  pageLoad: number;
  domReady: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
  timeToInteractive: number;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'performance' in window) {
      this.initializeMonitoring();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializeMonitoring(): void {
    // Monitor page load metrics
    this.measurePageLoad();
    
    // Monitor Core Web Vitals
    this.measureWebVitals();
    
    // Monitor long tasks
    this.monitorLongTasks();
    
    // Monitor memory usage
    this.monitorMemory();
  }

  /**
   * Measure page load performance
   */
  private measurePageLoad(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        this.metrics.pageLoad = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.domReady = navigation.domContentLoadedEventEnd - navigation.fetchStart;
        
        if (import.meta.env.DEV) {
          console.log('Page Load Metrics:', {
            pageLoad: `${this.metrics.pageLoad}ms`,
            domReady: `${this.metrics.domReady}ms`
          });
        }
      }
    });
  }

  /**
   * Measure Core Web Vitals
   */
  private measureWebVitals(): void {
    // First Contentful Paint (FCP)
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            fcpObserver.disconnect();
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    } catch (e) {
      // PerformanceObserver not supported
    }

    // Largest Contentful Paint (LCP)
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    } catch (e) {
      // LCP not supported
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        for (const entry of entries) {
          const eventEntry = entry as PerformanceEventTiming;
          this.metrics.firstInputDelay = eventEntry.processingStart - eventEntry.startTime;
          fidObserver.disconnect();
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    } catch (e) {
      // FID not supported
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const layoutShift = entry as any;
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            this.metrics.cumulativeLayoutShift = clsValue;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    } catch (e) {
      // CLS not supported
    }
  }

  /**
   * Monitor long tasks that block the main thread
   */
  private monitorLongTasks(): void {
    try {
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (import.meta.env.DEV) {
            console.warn('Long task detected:', {
              duration: `${entry.duration}ms`,
              startTime: `${entry.startTime}ms`
            });
          }
          
          // Report long tasks in production
          this.reportMetric('long_task', {
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });
      longTaskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(longTaskObserver);
    } catch (e) {
      // Long task monitoring not supported
    }
  }

  /**
   * Monitor memory usage
   */
  private monitorMemory(): void {
    if ('memory' in performance) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usedMemory = memory.usedJSHeapSize / 1048576; // Convert to MB
        const totalMemory = memory.totalJSHeapSize / 1048576;
        
        if (usedMemory > 50) { // Warn if using more than 50MB
          if (import.meta.env.DEV) {
            console.warn('High memory usage:', {
              used: `${usedMemory.toFixed(2)}MB`,
              total: `${totalMemory.toFixed(2)}MB`
            });
          }
          
          this.reportMetric('high_memory', {
            used: usedMemory,
            total: totalMemory
          });
        }
      }, 30000); // Check every 30 seconds
    }
  }

  /**
   * Get current metrics
   */
  public getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Report metrics to analytics service
   */
  private reportMetric(name: string, value: any): void {
    // In production, send to analytics service
    if (!import.meta.env.DEV) {
      // Example: Send to Google Analytics
      if (typeof gtag !== 'undefined') {
        gtag('event', name, {
          value: value,
          metric_name: name,
          metric_value: value
        });
      }
      
      // Or send to custom endpoint
      // fetch('/api/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, value, timestamp: Date.now() })
      // }).catch(() => {});
    }
  }

  /**
   * Log all metrics
   */
  public logMetrics(): void {
    console.table(this.metrics);
  }

  /**
   * Clean up observers
   */
  public cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Measure component render time
 */
export function measureComponentPerformance(componentName: string) {
  return function <T extends { new(...args: any[]): any }>(constructor: T) {
    return class extends constructor {
      componentDidMount() {
        performance.mark(`${componentName}-mount-start`);
        super.componentDidMount?.();
        performance.mark(`${componentName}-mount-end`);
        performance.measure(
          `${componentName}-mount`,
          `${componentName}-mount-start`,
          `${componentName}-mount-end`
        );
        
        const measure = performance.getEntriesByName(`${componentName}-mount`)[0];
        if (import.meta.env.DEV && measure) {
          console.log(`${componentName} mounted in ${measure.duration.toFixed(2)}ms`);
        }
      }
    };
  };
}

/**
 * Measure function execution time
 */
export function measureFunction<T extends (...args: any[]) => any>(
  fn: T,
  name?: string
): T {
  return ((...args: Parameters<T>) => {
    const fnName = name || fn.name || 'anonymous';
    const start = performance.now();
    
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start;
          if (import.meta.env.DEV && duration > 100) {
            console.warn(`Slow async function: ${fnName} took ${duration.toFixed(2)}ms`);
          }
        });
      }
      
      const duration = performance.now() - start;
      if (import.meta.env.DEV && duration > 16) { // Longer than one frame
        console.warn(`Slow function: ${fnName} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Function ${fnName} failed after ${duration.toFixed(2)}ms`);
      throw error;
    }
  }) as T;
}

/**
 * Debounce function with performance tracking
 */
export function debounceWithMetrics<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
  name?: string
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  let callCount = 0;
  
  return (...args: Parameters<T>) => {
    callCount++;
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      if (import.meta.env.DEV && callCount > 10) {
        console.warn(`Function ${name || fn.name} called ${callCount} times in ${delay}ms`);
      }
      callCount = 0;
      fn(...args);
    }, delay);
  };
}

/**
 * Track user interactions
 */
export function trackInteraction(action: string, category: string, label?: string): void {
  const timestamp = performance.now();
  
  if (import.meta.env.DEV) {
    console.log('User Interaction:', {
      action,
      category,
      label,
      timestamp: `${timestamp.toFixed(2)}ms`
    });
  }
  
  // Send to analytics in production
  if (!import.meta.env.DEV && typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label
    });
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

// Export instance and utilities
export {
  performanceMonitor,
  PerformanceMonitor,
  PerformanceMetrics
};

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
const gtag = window.gtag;

export default performanceMonitor;