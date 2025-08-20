import { useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

// Reduce motion for users who prefer it
export const useReducedMotion = () => {
  const { t } = useTranslation();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Animation on scroll with performance optimization
interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'none';
  duration?: number;
  delay?: number;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const AnimateOnScroll = ({
  children,
  animation = 'fadeIn',
  duration = 600,
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = '',
}: AnimateOnScrollProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
  });

  useEffect(() => {
    if (inView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [inView, hasAnimated]);

  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion || animation === 'none') {
    return <div className={className}>{children}</div>;
  }

  const animationClasses = {
    fadeIn: `transition-opacity duration-${duration}`,
    slideUp: `transition-all duration-${duration} transform`,
    slideLeft: `transition-all duration-${duration} transform`,
    slideRight: `transition-all duration-${duration} transform`,
    scale: `transition-all duration-${duration} transform`,
  };

  const initialStyles = {
    fadeIn: { opacity: 0 },
    slideUp: { opacity: 0, transform: 'translateY(30px)' },
    slideLeft: { opacity: 0, transform: 'translateX(-30px)' },
    slideRight: { opacity: 0, transform: 'translateX(30px)' },
    scale: { opacity: 0, transform: 'scale(0.9)' },
  };

  const animatedStyles = {
    fadeIn: { opacity: 1 },
    slideUp: { opacity: 1, transform: 'translateY(0)' },
    slideLeft: { opacity: 1, transform: 'translateX(0)' },
    slideRight: { opacity: 1, transform: 'translateX(0)' },
    scale: { opacity: 1, transform: 'scale(1)' },
  };

  return (
    <div
      ref={ref}
      className={`${animationClasses[animation]} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        ...(hasAnimated ? animatedStyles[animation] : initialStyles[animation]),
      }}
    >
      {children}
    </div>
  );
};

// Stagger animations for lists
interface StaggerAnimationProps {
  children: ReactNode[];
  staggerDelay?: number;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
  className?: string;
}

export const StaggerAnimation = ({
  children,
  staggerDelay = 100,
  animation = 'fadeIn',
  className = '',
}: StaggerAnimationProps) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimateOnScroll
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          triggerOnce
        >
          {child}
        </AnimateOnScroll>
      ))}
    </div>
  );
};

// Performance Monitor Component
export const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memory: 0,
    loadTime: 0,
  });

  useEffect(() => {
    // Monitor FPS
    let lastTime = performance.now();
    let frames = 0;
    let fps = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      
      if (currentTime >= lastTime + 1000) {
        fps = Math.round((frames * 1000) / (currentTime - lastTime));
        frames = 0;
        lastTime = currentTime;
        
        setMetrics(prev => ({ ...prev, fps }));
      }
      
      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);

    // Monitor memory if available
    const measureMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        const usedMemory = Math.round(memory.usedJSHeapSize / 1048576);
        setMetrics(prev => ({ ...prev, memory: usedMemory }));
      }
    };

    const memoryInterval = setInterval(measureMemory, 1000);

    // Measure page load time
    const measureLoadTime = () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        const loadTime = Math.round(perfData.loadEventEnd - perfData.fetchStart);
        setMetrics(prev => ({ ...prev, loadTime }));
      }
    };

    measureLoadTime();

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(memoryInterval);
    };
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
      <div>FPS: {metrics.fps}</div>
      <div>Memory: {metrics.memory}MB</div>
      <div>Load: {metrics.loadTime}ms</div>
    </div>
  );
};

// Lazy Load Component with Loading State
interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
}

export const LazyLoad = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 h-64 rounded-lg" />,
  rootMargin = '100px',
  threshold = 0,
}: LazyLoadProps) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin,
    threshold,
  });

  return (
    <div ref={ref}>
      {inView ? children : fallback}
    </div>
  );
};

// Optimized Animation Wrapper - reduces complexity
export const OptimizedAnimation = ({
  children,
  className = '',
  enabled = true,
}: {
  children: ReactNode;
  className?: string;
  enabled?: boolean;
}) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Disable animations on low-end devices
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  
  useEffect(() => {
    // Check for low-end device indicators
    const checkDevice = () => {
      const isLowEnd = 
        navigator.hardwareConcurrency <= 2 || // Low CPU cores
        (navigator as any).deviceMemory <= 2 || // Low RAM
        (navigator as any).connection?.effectiveType === 'slow-2g' ||
        (navigator as any).connection?.effectiveType === '2g';
      
      setIsLowEndDevice(!!isLowEnd);
    };
    
    checkDevice();
  }, []);

  if (!enabled || prefersReducedMotion || isLowEndDevice) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`transition-all duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
};

// Progressive Enhancement Hook
export const useProgressiveEnhancement = () => {
  const [enhancementLevel, setEnhancementLevel] = useState<'basic' | 'enhanced' | 'full'>('basic');

  useEffect(() => {
    // Start with basic, then progressively enhance
    const timer1 = setTimeout(() => {
      setEnhancementLevel('enhanced');
    }, 100);

    const timer2 = setTimeout(() => {
      // Only go to full if device can handle it
      if (navigator.hardwareConcurrency > 2) {
        setEnhancementLevel('full');
      }
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return enhancementLevel;
};

// Resource Hints Component
export const ResourceHints = () => {
  useEffect(() => {
    // Preconnect to external domains
    const preconnectUrls = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    preconnectUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Prefetch critical resources
    const prefetchResources = [
      '/assets/atm-franchise-logo.png',
    ];

    prefetchResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = resource;
      document.head.appendChild(link);
    });

    // DNS prefetch for external domains
    const dnsPrefetchUrls = [
      'https://www.google-analytics.com',
    ];

    dnsPrefetchUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }, []);

  return null;
};