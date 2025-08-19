/**
 * Performance-optimized components using React.memo and other optimization techniques
 */

import React, { memo, useMemo, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { usePerformanceStore } from '@/stores';
import { logger } from '@/lib/logger';

// ============================================
// Performance HOC for tracking render times
// ============================================

export function withPerformanceTracking<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return memo((props: P) => {
    const startTime = useRef(performance.now());
    const recordComponentRender = usePerformanceStore((state) => state.recordComponentRender);

    useEffect(() => {
      const renderTime = performance.now() - startTime.current;
      recordComponentRender(componentName, renderTime);
      
      if (renderTime > 16) { // Log slow renders (> 1 frame)
        logger.warn(`Slow render detected: ${componentName}`, { renderTime }, 'Performance');
      }
    });

    return <Component {...props} />;
  });
}

// ============================================
// Optimized Image Component
// ============================================

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage = memo<OptimizedImageProps>(({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  priority = false,
  onLoad,
  onError,
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '50px',
  });
  
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // Generate srcset for responsive images
  const srcSet = useMemo(() => {
    if (!src) return '';
    
    const sizes = [640, 768, 1024, 1280, 1536];
    return sizes
      .map((size) => {
        const url = src.replace(/(\.\w+)$/, `@${size}w$1`);
        return `${url} ${size}w`;
      })
      .join(', ');
  }, [src]);

  // Load image when in view or priority
  useEffect(() => {
    if (priority || inView) {
      setImageSrc(src);
    }
  }, [src, inView, priority]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
    logger.error('Image failed to load', { src, alt }, 'OptimizedImage');
  }, [src, alt, onError]);

  return (
    <div ref={ref} className={cn('relative overflow-hidden', className)}>
      {/* Placeholder while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">Failed to load image</span>
        </div>
      )}
      
      {/* Actual image */}
      {imageSrc && !hasError && (
        <motion.img
          src={imageSrc}
          srcSet={srcSet}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={cn('w-full h-full object-cover', className)}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo
  return (
    prevProps.src === nextProps.src &&
    prevProps.alt === nextProps.alt &&
    prevProps.className === nextProps.className
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// ============================================
// Virtualized List Component
// ============================================

interface VirtualizedListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  containerHeight: number;
  className?: string;
  overscan?: number;
}

export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  className,
  overscan = 3,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = React.useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const end = Math.min(
      items.length,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );
    return { start, end };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  const visibleItems = useMemo(
    () => items.slice(visibleRange.start, visibleRange.end),
    [items, visibleRange]
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Debounced Input Component
// ============================================

interface DebouncedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;
}

export const DebouncedInput = memo<DebouncedInputProps>(({
  value: initialValue,
  onChange,
  debounceMs = 500,
  ...props
}) => {
  const [value, setValue] = React.useState(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update local value when prop changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, debounceMs);
  }, [onChange, debounceMs]);

  return (
    <input
      {...props}
      value={value}
      onChange={handleChange}
    />
  );
});

DebouncedInput.displayName = 'DebouncedInput';

// ============================================
// Lazy Load Component Wrapper
// ============================================

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  placeholder?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export const LazyLoadWrapper = memo<LazyLoadWrapperProps>(({
  children,
  placeholder = <div className="h-32 bg-gray-100 animate-pulse" />,
  rootMargin = '100px',
  threshold = 0.1,
  className,
}) => {
  const [ref, inView, entry] = useInView({
    triggerOnce: true,
    rootMargin,
    threshold,
  });

  return (
    <div ref={ref} className={className}>
      {inView ? children : placeholder}
    </div>
  );
});

LazyLoadWrapper.displayName = 'LazyLoadWrapper';

// ============================================
// Memoized List Item Component
// ============================================

interface ListItemProps {
  id: string;
  title: string;
  description?: string;
  onClick?: (id: string) => void;
  className?: string;
}

export const MemoizedListItem = memo<ListItemProps>(({
  id,
  title,
  description,
  onClick,
  className,
}) => {
  const handleClick = useCallback(() => {
    onClick?.(id);
  }, [id, onClick]);

  return (
    <div
      className={cn(
        'p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors',
        className
      )}
      onClick={handleClick}
    >
      <h3 className="font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.className === nextProps.className
  );
});

MemoizedListItem.displayName = 'MemoizedListItem';

// ============================================
// Error Boundary with Retry
// ============================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

export class OptimizedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error?: Error; retry: () => void }> },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Component error caught', { error, errorInfo }, 'ErrorBoundary');
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;
      
      if (Fallback) {
        return <Fallback error={this.state.error} retry={this.handleRetry} />;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again ({this.state.retryCount})
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================
// Export all optimized components
// ============================================

export default {
  OptimizedImage,
  VirtualizedList,
  DebouncedInput,
  LazyLoadWrapper,
  MemoizedListItem,
  OptimizedErrorBoundary,
  withPerformanceTracking,
};