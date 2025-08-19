import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

// Accessibility Enhancement Component
export const AccessibilityEnhancements = () => {
  const { t } = useTranslation('forms');
  const location = useLocation();

  useEffect(() => {
    // Skip to main content on route change
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // Don't focus on initial load, only on navigation
      if (location.key !== 'default') {
        mainContent.focus();
      }
    }

    // Add ARIA live region for announcements
    const liveRegion = document.getElementById('aria-live-region');
    if (!liveRegion) {
      const newLiveRegion = document.createElement('div');
      newLiveRegion.id = 'aria-live-region';
      newLiveRegion.setAttribute('aria-live', 'polite');
      newLiveRegion.setAttribute('aria-atomic', 'true');
      newLiveRegion.className = 'sr-only';
      document.body.appendChild(newLiveRegion);
    }

    // Announce page changes to screen readers
    const pageTitle = document.title;
    announceToScreenReader(`Navigated to ${pageTitle}`);
  }, [location]);

  return null;
};

// Helper function to announce messages to screen readers
export const announceToScreenReader = (message: string) => {
  const liveRegion = document.getElementById('aria-live-region');
  if (liveRegion) {
    liveRegion.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      liveRegion.textContent = '';
    }, 1000);
  }
};

// Skip Navigation Links Component
export const SkipNavigationLinks = () => {
  return (
    <div className="skip-navigation">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] bg-blue-700 text-white px-6 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to main content
      </a>
      <a 
        href="#footer" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] bg-blue-700 text-white px-6 py-3 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Skip to footer
      </a>
    </div>
  );
};

// Enhanced Link Component with ARIA
import { Link as RouterLink, LinkProps } from 'react-router-dom';
import { forwardRef } from 'react';

interface AccessibleLinkProps extends LinkProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  isExternal?: boolean;
  showExternalIcon?: boolean;
}

export const AccessibleLink = forwardRef<HTMLAnchorElement, AccessibleLinkProps>(
  ({ children, ariaLabel, ariaDescribedBy, isExternal, showExternalIcon = true, ...props }, ref) => {
    const externalProps = isExternal ? {
      target: '_blank',
      rel: 'noopener noreferrer',
      'aria-label': ariaLabel || `${children} (opens in new tab)`
    } : {};

    return (
      <RouterLink
        ref={ref}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...externalProps}
        {...props}
      >
        {children}
        {isExternal && showExternalIcon && (
          <span className="sr-only">(opens in new tab)</span>
        )}
      </RouterLink>
    );
  }
);

AccessibleLink.displayName = 'AccessibleLink';

// Focus Management Hook
import { useRef, useCallback } from 'react';

export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || !containerRef.current) return;

    if (e.key === 'Tab') {
      const focusableElements = containerRef.current.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      // Emit custom event for escape key handling
      const escapeEvent = new CustomEvent('focustrap:escape');
      containerRef.current.dispatchEvent(escapeEvent);
    }
  }, [isActive]);

  useEffect(() => {
    if (isActive) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus first focusable element
      setTimeout(() => {
        const firstFocusable = containerRef.current?.querySelector(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        firstFocusable?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, handleKeyDown]);

  return containerRef;
};

// Keyboard Navigation Provider
interface KeyboardNavigationProps {
  children: React.ReactNode;
}

export const KeyboardNavigationProvider = ({ children }: KeyboardNavigationProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + 1: Go to home
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        window.location.href = '/';
      }
      
      // Alt + 2: Go to main content
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        const mainContent = document.getElementById('main-content');
        mainContent?.focus();
      }
      
      // Alt + 3: Open search
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        const searchButton = document.querySelector('[aria-label*="search"]') as HTMLElement;
        searchButton?.click();
      }
      
      // Alt + 4: Go to footer
      if (e.altKey && e.key === '4') {
        e.preventDefault();
        const footer = document.getElementById('footer');
        footer?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return <>{children}</>;
};

// Screen Reader Announcements for Dynamic Content
interface ScreenReaderAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
  clearAfter?: number;
}

export const ScreenReaderAnnouncement = ({ 
  message, 
  priority = 'polite',
  clearAfter = 1000 
}: ScreenReaderAnnouncementProps) => {
  useEffect(() => {
    announceToScreenReader(message);
  }, [message]);

  return (
    <div 
      className="sr-only" 
      aria-live={priority}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};

// Form Field with proper ARIA
interface AccessibleFormFieldProps {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  description?: string;
  children: React.ReactNode;
}

export const AccessibleFormField = ({
  id,
  label,
  error,
  required,
  description,
  children
}: AccessibleFormFieldProps) => {
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-neutral-900"
      >
        {label}
        {required && (
          <span className="text-red-600 ml-1" aria-label="required">*</span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-neutral-600">
          {description}
        </p>
      )}
      
      <div
        aria-describedby={
          [description && descriptionId, error && errorId]
            .filter(Boolean)
            .join(' ')
        }
        aria-invalid={!!error}
      >
        {children}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

// Loading State with ARIA
interface AccessibleLoadingProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleLoading = ({ 
  isLoading, 
  loadingText = 'Loading...', 
  children 
}: AccessibleLoadingProps) => {
  if (isLoading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-busy="true"
        className="flex items-center justify-center p-8"
      >
        <svg 
          className="animate-spin h-8 w-8 text-blue-600" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="sr-only">{loadingText}</span>
      </div>
    );
  }

  return <>{children}</>;
};