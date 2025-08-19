import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, XCircle, WifiOff, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onDismiss?: () => void;
  className?: string;
}

export function ErrorMessage({ 
  message, 
  type = 'error', 
  onDismiss, 
  className 
}: ErrorMessageProps) {
  const getIcon = () => {
  const { t } = useTranslation('forms');
    if (message.toLowerCase().includes('offline') || message.toLowerCase().includes('network')) {
      return <WifiOff className="h-4 w-4" />;
    }
    if (message.toLowerCase().includes('timeout') || message.toLowerCase().includes('long')) {
      return <Clock className="h-4 w-4" />;
    }
    if (message.toLowerCase().includes('permission') || message.toLowerCase().includes('unauthorized')) {
      return <Shield className="h-4 w-4" />;
    }
    
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <XCircle className="h-4 w-4" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-red-50 border-red-200 text-red-800';
    }
  };

  return (
    <div 
      className={cn(
        'flex items-start gap-2 p-3 rounded-lg border fade-in',
        getStyles(),
        className
      )}
      role="alert"
    >
      <span className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </span>
      <span className="text-sm flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss message"
        >
          <XCircle className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

interface FieldErrorProps {
  error?: string | null;
  className?: string;
}

export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null;

  return (
    <p className={cn(
      'text-sm text-red-600 mt-1 flex items-center gap-1 fade-in',
      className
    )}>
      <AlertCircle className="h-3 w-3" />
      {error}
    </p>
  );
}