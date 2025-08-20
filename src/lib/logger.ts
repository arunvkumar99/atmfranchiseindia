/**
 * Production-safe logging service
 * Provides environment-aware logging with different levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  source?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private isProduction = import.meta.env.PROD;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  /**
   * Get current log level based on environment
   */
  private getLogLevel(): LogLevel {
    if (this.isProduction) return 'error';
    return 'debug';
  }

  /**
   * Check if should log based on level
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevel = this.getLogLevel();
    return levels.indexOf(level) >= levels.indexOf(currentLevel);
  }

  /**
   * Format log message with timestamp
   */
  private formatMessage(level: LogLevel, message: string, source?: string): string {
    const timestamp = new Date().toISOString();
    const prefix = source ? `[${source}]` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${prefix} ${message}`;
  }

  /**
   * Add to log buffer for debugging
   */
  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
  }

  /**
   * Debug level logging - only in development
   */
  debug(message: string, data?: unknown, source?: string): void {
    if (!this.shouldLog('debug')) return;
    
    const entry: LogEntry = {
      level: 'debug',
      message,
      data,
      timestamp: new Date().toISOString(),
      source,
    };

    this.addToBuffer(entry);

    if (this.isDevelopment) {
      console.log(this.formatMessage('debug', message, source), data || '');
    }
  }

  /**
   * Info level logging
   */
  info(message: string, data?: unknown, source?: string): void {
    if (!this.shouldLog('info')) return;

    const entry: LogEntry = {
      level: 'info',
      message,
      data,
      timestamp: new Date().toISOString(),
      source,
    };

    this.addToBuffer(entry);

    if (this.isDevelopment) {
      console.info(this.formatMessage('info', message, source), data || '');
    }
  }

  /**
   * Warning level logging
   */
  warn(message: string, data?: unknown, source?: string): void {
    if (!this.shouldLog('warn')) return;

    const entry: LogEntry = {
      level: 'warn',
      message,
      data,
      timestamp: new Date().toISOString(),
      source,
    };

    this.addToBuffer(entry);

    // Warnings show in development only
    if (this.isDevelopment) {
      console.warn(this.formatMessage('warn', message, source), data || '');
    }
  }

  /**
   * Error level logging - always logs
   */
  error(message: string, error?: Error | unknown, source?: string): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      data: error,
      timestamp: new Date().toISOString(),
      source,
    };

    this.addToBuffer(entry);

    // Errors always log, but with different detail levels
    if (this.isProduction) {
      // In production, log minimal info
      if (import.meta.env?.DEV) console.error(`[ERROR] ${message}`);
      
      // Could send to error tracking service here
      this.sendToErrorTracking(entry);
    } else {
      // In development, log full details
      if (import.meta.env?.DEV) console.error(this.formatMessage('error', message, source), error || '');
      if (error instanceof Error) {
        if (import.meta.env?.DEV) console.error('Stack trace:', error.stack);
      }
    }
  }

  /**
   * Group related logs
   */
  group(label: string): void {
    if (this.isDevelopment) {
      console.group(label);
    }
  }

  /**
   * End log group
   */
  groupEnd(): void {
    if (this.isDevelopment) {
      console.groupEnd();
    }
  }

  /**
   * Measure performance
   */
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  /**
   * End performance measurement
   */
  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }

  /**
   * Table logging
   */
  table(data: unknown): void {
    if (this.isDevelopment) {
      console.table(data);
    }
  }

  /**
   * Get log buffer for debugging
   */
  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  /**
   * Clear log buffer
   */
  clearBuffer(): void {
    this.logBuffer = [];
  }

  /**
   * Send errors to tracking service (placeholder)
   */
  private sendToErrorTracking(entry: LogEntry): void {
    // In production, you would send to Sentry, LogRocket, etc.
    // This is a placeholder for future implementation
  }

  /**
   * Log form submission (sanitized)
   */
  logFormSubmission(formName: string, success: boolean, error?: string): void {
    const message = success 
      ? `Form submitted successfully: ${formName}`
      : `Form submission failed: ${formName}`;
    
    if (success) {
      this.info(message, { formName }, 'FormSubmission');
    } else {
      this.error(message, { formName, error }, 'FormSubmission');
    }
  }

  /**
   * Log API calls (sanitized)
   */
  logApiCall(method: string, endpoint: string, status: number): void {
    const message = `API Call: ${method} ${endpoint} - ${status}`;
    
    if (status >= 400) {
      this.error(message, { method, endpoint, status }, 'API');
    } else if (this.isDevelopment) {
      this.debug(message, { method, endpoint, status }, 'API');
    }
  }

  /**
   * Log navigation events
   */
  logNavigation(from: string, to: string): void {
    if (this.isDevelopment) {
      this.debug(`Navigation: ${from} -> ${to}`, { from, to }, 'Router');
    }
  }

  /**
   * Log performance metrics
   */
  logPerformance(metric: string, value: number, unit: string = 'ms'): void {
    if (this.isDevelopment) {
      this.info(`Performance: ${metric} = ${value}${unit}`, { metric, value, unit }, 'Performance');
    }
  }

  /**
   * Backward compatibility method
   */
  log(...args: unknown[]): void {
    if (this.isDevelopment && args.length > 0) {
      const message = String(args[0]);
      const data = args.slice(1);
      this.debug(message, data.length > 0 ? data : undefined);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// For critical errors that should always be logged
export const logError = (error: Error, context?: string): void => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
    url: typeof window !== 'undefined' ? window.location.href : 'Unknown'
  };
  
  // Always log critical errors
  logger.error('Critical Error', errorInfo, context);
};

// Export type for use in other files
export type { LogLevel, LogEntry };