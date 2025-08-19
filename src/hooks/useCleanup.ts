/**
 * Custom hooks for proper cleanup and memory leak prevention
 */

import { useEffect, useRef, useCallback, DependencyList } from 'react';
import { logger } from '@/lib/logger';

// ============================================
// Safe Async Effect Hook
// ============================================

/**
 * useAsyncEffect - Safely handle async operations in useEffect
 * Prevents state updates on unmounted components
 */
export function useAsyncEffect(
  effect: (isMounted: () => boolean) => Promise<void>,
  deps?: DependencyList
) {
  useEffect(() => {
    let isMounted = true;
    const checkMounted = () => isMounted;

    effect(checkMounted).catch((error) => {
      if (isMounted) {
        logger.error('Async effect error', error, 'useAsyncEffect');
      }
    });

    return () => {
      isMounted = false;
    };
  }, deps);
}

// ============================================
// Event Listener Hook with Cleanup
// ============================================

/**
 * useEventListener - Add event listeners with automatic cleanup
 */
export function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: HTMLElement | Window = window,
  options?: boolean | AddEventListenerOptions
) {
  const savedHandler = useRef(handler);

  // Update handler ref on each render
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Check if element supports addEventListener
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    // Create event listener that calls handler function
    const eventListener = (event: Event) => savedHandler.current(event as WindowEventMap[K]);

    // Add event listener
    element.addEventListener(eventName, eventListener, options);

    // Cleanup
    return () => {
      element.removeEventListener(eventName, eventListener, options);
    };
  }, [eventName, element, options]);
}

// ============================================
// Interval Hook with Cleanup
// ============================================

/**
 * useInterval - Set intervals with automatic cleanup
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const tick = () => savedCallback.current();
    const id = setInterval(tick, delay);

    return () => clearInterval(id);
  }, [delay]);
}

// ============================================
// Timeout Hook with Cleanup
// ============================================

/**
 * useTimeout - Set timeouts with automatic cleanup
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Update callback ref on each render
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the timeout
  useEffect(() => {
    if (delay === null) return;

    timeoutRef.current = setTimeout(() => savedCallback.current(), delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  // Cancel function
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return cancel;
}

// ============================================
// Resize Observer Hook with Cleanup
// ============================================

/**
 * useResizeObserver - Observe element resize with cleanup
 */
export function useResizeObserver(
  ref: React.RefObject<HTMLElement>,
  callback: (entry: ResizeObserverEntry) => void
) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        savedCallback.current(entries[0]);
      }
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);
}

// ============================================
// Intersection Observer Hook with Cleanup
// ============================================

/**
 * useIntersectionObserver - Observe element intersection with cleanup
 */
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options?: IntersectionObserverInit
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options?.root, options?.rootMargin, options?.threshold]);

  return entry;
}

// ============================================
// Abort Controller Hook
// ============================================

/**
 * useAbortController - Create abort controller with cleanup
 */
export function useAbortController() {
  const abortControllerRef = useRef<AbortController>();

  useEffect(() => {
    abortControllerRef.current = new AbortController();

    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return abortControllerRef.current?.signal;
}

// ============================================
// Previous Value Hook
// ============================================

/**
 * usePrevious - Store previous value with proper cleanup
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

// ============================================
// Mount State Hook
// ============================================

/**
 * useIsMounted - Check if component is mounted
 */
export function useIsMounted(): () => boolean {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return useCallback(() => isMountedRef.current, []);
}

// ============================================
// Cleanup on Unmount Hook
// ============================================

/**
 * useUnmount - Run cleanup function on unmount
 */
export function useUnmount(cleanup: () => void) {
  const cleanupRef = useRef(cleanup);

  // Update cleanup ref on each render
  useEffect(() => {
    cleanupRef.current = cleanup;
  }, [cleanup]);

  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);
}

// ============================================
// Debounced Callback Hook
// ============================================

/**
 * useDebouncedCallback - Debounce callback with cleanup
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    }) as T,
    [delay]
  );
}

// ============================================
// Throttled Callback Hook
// ============================================

/**
 * useThrottledCallback - Throttle callback with cleanup
 */
export function useThrottledCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRunRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);

  // Update callback ref on each render
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastRunRef.current >= delay) {
        lastRunRef.current = now;
        callbackRef.current(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastRunRef.current = Date.now();
          callbackRef.current(...args);
        }, delay - (now - lastRunRef.current));
      }
    }) as T,
    [delay]
  );
}