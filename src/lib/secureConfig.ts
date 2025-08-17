/**
 * Secure Configuration Manager
 * Handles secrets and sensitive configuration
 * 
 * Security Features:
 * - No secrets in client bundle
 * - Validation of all environment variables
 * - Secure defaults
 * - Platform-specific secret loading
 */

interface SecureConfig {
  googleSheets: {
    sheetId: string;
    serviceAccount: {
      email: string;
      privateKey: string;
    };
  };
  api: {
    baseUrl: string;
    allowedOrigins: string[];
  };
  security: {
    jwtSecret?: string;
    adminEmail?: string;
    rateLimitMax: number;
    rateLimitWindow: number;
  };
  environment: {
    isDevelopment: boolean;
    isProduction: boolean;
    debugMode: boolean;
  };
}

class ConfigurationManager {
  private static instance: ConfigurationManager;
  private config: SecureConfig | null = null;
  private validated: boolean = false;

  private constructor() {}

  static getInstance(): ConfigurationManager {
    if (!ConfigurationManager.instance) {
      ConfigurationManager.instance = new ConfigurationManager();
    }
    return ConfigurationManager.instance;
  }

  /**
   * Load and validate configuration
   * Should be called once at app startup
   */
  async initialize(): Promise<SecureConfig> {
    if (this.config && this.validated) {
      return this.config;
    }

    // Load based on environment
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';

    this.config = {
      googleSheets: {
        sheetId: this.getRequired('GOOGLE_SHEET_ID'),
        serviceAccount: {
          email: this.getRequired('GOOGLE_SERVICE_ACCOUNT_EMAIL'),
          privateKey: this.getPrivateKey()
        }
      },
      api: {
        baseUrl: this.getOptional('VITE_API_URL', '/api/submit-to-sheets'),
        allowedOrigins: this.getAllowedOrigins()
      },
      security: {
        jwtSecret: this.getOptional('JWT_SECRET'),
        adminEmail: this.getOptional('ADMIN_EMAIL'),
        rateLimitMax: parseInt(this.getOptional('RATE_LIMIT_MAX', '5')),
        rateLimitWindow: parseInt(this.getOptional('RATE_LIMIT_WINDOW', '60000'))
      },
      environment: {
        isDevelopment,
        isProduction,
        debugMode: this.getOptional('VITE_DEBUG', 'false') === 'true'
      }
    };

    // Validate configuration
    this.validateConfig();
    this.validated = true;

    // Log configuration status (not values!)
    if (isDevelopment) {
      console.log('✅ Configuration loaded successfully');
      console.log('Environment:', process.env.NODE_ENV);
      console.log('Debug mode:', this.config.environment.debugMode);
    }

    return this.config;
  }

  /**
   * Get required environment variable
   * Throws error if not found
   */
  private getRequired(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }

  /**
   * Get optional environment variable with default
   */
  private getOptional(key: string, defaultValue?: string): string | undefined {
    return process.env[key] || defaultValue;
  }

  /**
   * Parse and validate private key
   */
  private getPrivateKey(): string {
    const key = this.getRequired('GOOGLE_SERVICE_ACCOUNT_KEY');
    
    // Handle escaped newlines
    const processedKey = key.replace(/\\n/g, '\n');
    
    // Validate key format
    if (!processedKey.includes('BEGIN PRIVATE KEY')) {
      throw new Error('Invalid private key format');
    }
    
    return processedKey;
  }

  /**
   * Parse allowed origins
   */
  private getAllowedOrigins(): string[] {
    const origins = this.getOptional('ALLOWED_ORIGINS', 'http://localhost:8080');
    return origins.split(',').map(origin => origin.trim());
  }

  /**
   * Validate the loaded configuration
   */
  private validateConfig(): void {
    if (!this.config) {
      throw new Error('Configuration not loaded');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.config.googleSheets.serviceAccount.email)) {
      throw new Error('Invalid service account email format');
    }

    // Validate Google Sheet ID format
    const sheetIdRegex = /^[a-zA-Z0-9-_]+$/;
    if (!sheetIdRegex.test(this.config.googleSheets.sheetId)) {
      throw new Error('Invalid Google Sheet ID format');
    }

    // Validate origins
    this.config.api.allowedOrigins.forEach(origin => {
      try {
        new URL(origin);
      } catch {
        throw new Error(`Invalid origin URL: ${origin}`);
      }
    });

    // Validate rate limit values
    if (this.config.security.rateLimitMax < 1 || this.config.security.rateLimitMax > 100) {
      throw new Error('Rate limit max must be between 1 and 100');
    }

    if (this.config.security.rateLimitWindow < 1000 || this.config.security.rateLimitWindow > 3600000) {
      throw new Error('Rate limit window must be between 1 second and 1 hour');
    }
  }

  /**
   * Get current configuration
   * Throws if not initialized
   */
  getConfig(): SecureConfig {
    if (!this.config || !this.validated) {
      throw new Error('Configuration not initialized. Call initialize() first.');
    }
    return this.config;
  }

  /**
   * Check if configuration is loaded
   */
  isInitialized(): boolean {
    return this.validated && this.config !== null;
  }

  /**
   * Reset configuration (mainly for testing)
   */
  reset(): void {
    this.config = null;
    this.validated = false;
  }
}

// Export singleton instance
export const configManager = ConfigurationManager.getInstance();

// Export types
export type { SecureConfig };

// Helper function for API routes
export async function getSecureConfig(): Promise<SecureConfig> {
  if (!configManager.isInitialized()) {
    await configManager.initialize();
  }
  return configManager.getConfig();
}

// Validation helper for API endpoints
export function validateOrigin(origin: string | undefined): boolean {
  if (!origin) return false;
  
  const config = configManager.getConfig();
  return config.api.allowedOrigins.includes(origin);
}

// Rate limit helper
export function getRateLimitConfig() {
  const config = configManager.getConfig();
  return {
    max: config.security.rateLimitMax,
    windowMs: config.security.rateLimitWindow
  };
}