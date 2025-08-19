import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

// Loading component for route transitions
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-primary font-medium">Loading...</span>
    </div>
  </div>
);

// Error boundary for lazy loading failures
class LazyLoadErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 font-medium">Failed to load page</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => {
  const { t } = useTranslation('forms');
  return (props: any) => (
    <LazyLoadErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    </LazyLoadErrorBoundary>
  );
};

export { PageLoader, LazyLoadErrorBoundary };