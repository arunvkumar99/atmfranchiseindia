import { useToast } from "@/hooks/use-toast";

// Enhanced Error Types
export class FormValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = 'FormValidationError';
  }
}

export class FileUploadError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'FileUploadError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class RateLimitError extends Error {
  constructor(message: string, public retryAfter?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

// Error Severity Levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error Context Interface
export interface ErrorContext {
  formType?: string;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  timestamp: string;
  additionalData?: Record<string, any>;
}

// Enhanced Error Logger
export class ErrorLogger {
  private static instance: ErrorLogger;

  static getInstance(): ErrorLogger {
    if (!ErrorLogger.instance) {
      ErrorLogger.instance = new ErrorLogger();
    }
    return ErrorLogger.instance;
  }

  private formatError(error: Error, context: ErrorContext, severity: ErrorSeverity): string {
    return JSON.stringify({
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        severity,
        context,
        timestamp: new Date().toISOString()
      }
    }, null, 2);
  }

  logError(error: Error, context: Partial<ErrorContext> = {}, severity: ErrorSeverity = ErrorSeverity.MEDIUM): void {
    const fullContext: ErrorContext = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      ...context
    };

    const formattedError = this.formatError(error, fullContext, severity);
    
    // Console logging with appropriate level
    switch (severity) {
      case ErrorSeverity.LOW:
        console.info('📝 INFO:', formattedError);
        break;
      case ErrorSeverity.MEDIUM:
        console.warn('⚠️ WARNING:', formattedError);
        break;
      case ErrorSeverity.HIGH:
        console.error('🚨 ERROR:', formattedError);
        break;
      case ErrorSeverity.CRITICAL:
        console.error('💀 CRITICAL:', formattedError);
        break;
    }

    // Send to monitoring service in production
    if (import.meta.env.PROD && severity >= ErrorSeverity.HIGH) {
      this.sendToMonitoring(error, fullContext, severity);
    }
  }

  private async sendToMonitoring(error: Error, context: ErrorContext, severity: ErrorSeverity): Promise<void> {
    try {
      // Here you would send to your monitoring service
      // For now, we'll use a placeholder
      console.log('📊 Sending to monitoring service:', { error: error.message, severity, context });
    } catch (monitoringError) {
      console.error('Failed to send error to monitoring:', monitoringError);
    }
  }
}

// Enhanced Error Handler Hook
export function useErrorHandler() {
  const { toast } = useToast();
  const logger = ErrorLogger.getInstance();

  const handleError = (
    error: Error, 
    context: Partial<ErrorContext> = {},
    userMessage?: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void => {
    // Log the error with context
    logger.logError(error, context, severity);

    // Determine user-friendly message
    const displayMessage = userMessage || getUserFriendlyMessage(error);

    // Show toast notification based on severity
    toast({
      title: severity >= ErrorSeverity.HIGH ? "Error" : "Warning",
      description: displayMessage,
      variant: severity >= ErrorSeverity.HIGH ? "destructive" : "default",
    });
  };

  const handleFormError = (
    error: Error,
    formType: string,
    field?: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void => {
    const context: Partial<ErrorContext> = {
      formType,
      additionalData: field ? { field } : undefined
    };

    handleError(error, context, undefined, severity);
  };

  const handleFileError = (
    error: FileUploadError,
    fileName?: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): void => {
    const context: Partial<ErrorContext> = {
      additionalData: { fileName, errorCode: error.code }
    };

    handleError(error, context, undefined, severity);
  };

  const handleNetworkError = (
    error: NetworkError,
    endpoint?: string,
    severity: ErrorSeverity = ErrorSeverity.HIGH
  ): void => {
    const context: Partial<ErrorContext> = {
      additionalData: { endpoint, statusCode: error.statusCode }
    };

    const userMessage = error.statusCode === 429 
      ? "Too many requests. Please wait a moment and try again."
      : "Network error. Please check your connection and try again.";

    handleError(error, context, userMessage, severity);
  };

  return {
    handleError,
    handleFormError,
    handleFileError,
    handleNetworkError,
    logger
  };
}

// User-friendly error messages
function getUserFriendlyMessage(error: Error): string {
  if (error instanceof FormValidationError) {
    return `Please check the ${error.field} field: ${error.message}`;
  }
  
  if (error instanceof FileUploadError) {
    return `File upload failed: ${error.message}`;
  }
  
  if (error instanceof NetworkError) {
    if (error.statusCode === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }
    if (error.statusCode === 403) {
      return "Access denied. Please check your permissions.";
    }
    if (error.statusCode === 500) {
      return "Server error. Please try again later.";
    }
    return "Network error. Please check your connection and try again.";
  }
  
  if (error instanceof RateLimitError) {
    const waitTime = error.retryAfter ? ` Please wait ${error.retryAfter} seconds.` : "";
    return `Too many attempts.${waitTime}`;
  }

  // Default fallback for unknown errors
  return "An unexpected error occurred. Please try again.";
}

// Error Recovery Utilities
export class ErrorRecovery {
  static withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    return new Promise(async (resolve, reject) => {
      let lastError: Error;
      
      for (let i = 0; i <= maxRetries; i++) {
        try {
          const result = await fn();
          resolve(result);
          return;
        } catch (error) {
          lastError = error as Error;
          
          if (i === maxRetries) {
            reject(lastError);
            return;
          }
          
          // Exponential backoff
          await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
        }
      }
    });
  }

  static withFallback<T>(
    primaryFn: () => Promise<T>,
    fallbackFn: () => Promise<T>
  ): Promise<T> {
    return primaryFn().catch(() => fallbackFn());
  }
}

// Enhanced async error boundary
export function withErrorBoundary<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  errorHandler: (error: Error) => void
): (...args: T) => Promise<R | undefined> {
  return async (...args: T): Promise<R | undefined> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorHandler(error as Error);
      return undefined;
    }
  };
}