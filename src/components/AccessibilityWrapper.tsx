import React from 'react';
import { useTranslation } from 'react-i18next';

interface AccessibilityWrapperProps {
  children: React.ReactNode;
  skipToContentId?: string;
}

export default function AccessibilityWrapper({ 
  children, 
  skipToContentId = 'main-content' 
}: AccessibilityWrapperProps) {
  return (
    <div>
      {/* Skip to main content link */}
      <a
        href={`#${skipToContentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-ring"
      >
        Skip to main content
      </a>
      
      {/* Main content with proper landmark */}
      <main id={skipToContentId} role="main" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

// Focus management hook for route changes
export function useFocusManagement() {
  React.useEffect(() => {
    // Focus main content area when route changes
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, []);
}