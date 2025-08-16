import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
}

/**
 * Reusable loading spinner component
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

/**
 * Full page loading state
 */
export const PageLoader: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
};

/**
 * Card/Section loading skeleton
 */
export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-6 animate-pulse"
        >
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-4/6"></div>
        </div>
      ))}
    </>
  );
};

/**
 * Form submission loading overlay
 */
export const FormLoadingOverlay: React.FC<{ 
  isLoading: boolean;
  text?: string;
}> = ({ 
  isLoading, 
  text = 'Submitting...' 
}) => {
  if (!isLoading) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

/**
 * Button loading state
 */
export const ButtonLoader: React.FC<{
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
}> = ({ isLoading, children, loadingText = 'Loading...' }) => {
  if (isLoading) {
    return (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText}
      </>
    );
  }
  return <>{children}</>;
};

/**
 * Data table loading state
 */
export const TableSkeleton: React.FC<{ 
  rows?: number;
  columns?: number;
}> = ({ 
  rows = 5, 
  columns = 4 
}) => {
  return (
    <div className="w-full">
      <div className="bg-gray-100 p-4 rounded-t-lg animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="bg-white rounded-b-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th key={index} className="px-6 py-3">
                  <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-t">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div className="h-3 bg-gray-100 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Inline loading for async data
 */
export const InlineLoader: React.FC<{ text?: string }> = ({ 
  text = 'Loading' 
}) => {
  return (
    <span className="inline-flex items-center text-sm text-gray-600">
      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
      {text}
    </span>
  );
};

/**
 * List loading skeleton
 */
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Image loading placeholder
 */
export const ImageSkeleton: React.FC<{ 
  className?: string;
}> = ({ className }) => {
  return (
    <div className={cn(
      'bg-gray-200 animate-pulse rounded-lg',
      className || 'w-full h-64'
    )}>
      <div className="flex items-center justify-center h-full">
        <svg
          className="w-12 h-12 text-gray-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 5h-16c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2v-10c0-1.103-.897-2-2-2zm-16 12v-10h16v10h-16zm4-7h4v4h-4v-4zm6-2h4v2h-4v-2zm0 4h4v2h-4v-2zm-6 4h8v2h-8v-2z"/>
        </svg>
      </div>
    </div>
  );
};

/**
 * Progress bar for long operations
 */
export const ProgressLoader: React.FC<{
  progress: number;
  text?: string;
}> = ({ progress, text }) => {
  return (
    <div className="w-full">
      {text && <p className="text-sm text-gray-600 mb-2">{text}</p>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">{progress}%</p>
    </div>
  );
};

export default {
  LoadingSpinner,
  PageLoader,
  CardSkeleton,
  FormLoadingOverlay,
  ButtonLoader,
  TableSkeleton,
  InlineLoader,
  ListSkeleton,
  ImageSkeleton,
  ProgressLoader
};