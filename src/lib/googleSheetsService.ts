/**
 * Google Sheets Direct Integration Service
 * Replaces Supabase with direct Google Sheets API calls
 * 
 * Benefits:
 * - No database dependency
 * - Lower costs (no Supabase fees)
 * - Simpler architecture
 * - Single source of truth
 */

interface FormSubmission {
  formType: string;
  data: Record<string, any>;
}

interface SubmissionResponse {
  success: boolean;
  message: string;
  id?: string;
  error?: string;
  retryAfter?: number;
}

class GoogleSheetsService {
  private baseUrl: string;
  private retryQueue: Map<string, FormSubmission> = new Map();
  private isOnline: boolean = navigator.onLine;

  constructor() {
    // Use environment variable or default to API route
    this.baseUrl = import.meta.env.VITE_API_URL || '/api/submit-to-sheets';
    
    // Monitor online status
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processRetryQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  /**
   * Submit form data directly to Google Sheets
   */
  async submitForm(submission: FormSubmission): Promise<SubmissionResponse> {
    // Check if offline
    if (!this.isOnline) {
      this.addToRetryQueue(submission);
      return {
        success: false,
        message: 'You are offline. Form will be submitted when connection is restored.',
        error: 'OFFLINE'
      };
    }

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      const result = await response.json();

      // Handle rate limiting
      if (response.status === 429) {
        this.addToRetryQueue(submission);
        return {
          success: false,
          message: 'Too many submissions. Please wait a moment.',
          error: 'RATE_LIMITED',
          retryAfter: result.retryAfter
        };
      }

      // Handle success
      if (response.ok) {
        // Store successful submission in localStorage for reference
        this.storeSubmissionRecord(submission, result.id);
        return result;
      }

      // Handle errors
      return {
        success: false,
        message: result.error || 'Submission failed',
        error: result.error
      };

    } catch (error) {
      // Network error - add to retry queue
      this.addToRetryQueue(submission);
      
      return {
        success: false,
        message: 'Network error. Form will be submitted automatically when connection is restored.',
        error: 'NETWORK_ERROR'
      };
    }
  }

  /**
   * Add failed submission to retry queue
   */
  private addToRetryQueue(submission: FormSubmission): void {
    const id = `${submission.formType}_${Date.now()}`;
    this.retryQueue.set(id, submission);
    
    // Store in localStorage for persistence
    const queue = this.getStoredRetryQueue();
    queue.push({ id, ...submission });
    localStorage.setItem('formRetryQueue', JSON.stringify(queue));
  }

  /**
   * Process retry queue when back online
   */
  private async processRetryQueue(): Promise<void> {
    const storedQueue = this.getStoredRetryQueue();
    
    for (const item of storedQueue) {
      const { id, ...submission } = item;
      
      try {
        const result = await this.submitForm(submission);
        
        if (result.success) {
          // Remove from queue
          this.removeFromRetryQueue(id);
        }
      } catch (error) {
        if (import.meta.env.DEV) { console.error('Retry failed for:', id); }
      }
      
      // Wait between retries to avoid rate limiting
      await this.delay(2000);
    }
  }

  /**
   * Get stored retry queue from localStorage
   */
  private getStoredRetryQueue(): any[] {
    try {
      const stored = localStorage.getItem('formRetryQueue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Remove item from retry queue
   */
  private removeFromRetryQueue(id: string): void {
    this.retryQueue.delete(id);
    
    const queue = this.getStoredRetryQueue();
    const filtered = queue.filter(item => item.id !== id);
    localStorage.setItem('formRetryQueue', JSON.stringify(filtered));
  }

  /**
   * Store submission record for user reference
   */
  private storeSubmissionRecord(submission: FormSubmission, id?: string): void {
    const records = this.getSubmissionRecords();
    records.push({
      id: id || `${submission.formType}_${Date.now()}`,
      formType: submission.formType,
      submittedAt: new Date().toISOString(),
      data: {
        name: submission.data.name || submission.data.fullName,
        email: submission.data.email,
        phone: submission.data.phone
      }
    });
    
    // Keep only last 50 records
    if (records.length > 50) {
      records.shift();
    }
    
    localStorage.setItem('formSubmissions', JSON.stringify(records));
  }

  /**
   * Get submission history
   */
  getSubmissionRecords(): any[] {
    try {
      const stored = localStorage.getItem('formSubmissions');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Check if user has recently submitted (rate limiting)
   */
  canSubmit(email: string, formType: string): boolean {
    const records = this.getSubmissionRecords();
    const recentSubmissions = records.filter(r => 
      r.data.email === email && 
      r.formType === formType &&
      new Date(r.submittedAt).getTime() > Date.now() - 3600000 // 1 hour
    );
    
    return recentSubmissions.length < 3; // Max 3 per hour per form type
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Validate form data before submission
   */
  validateFormData(formType: string, data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Common validations
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Valid email is required');
    }

    if (!data.phone || !/^[6-9]\d{9}$/.test(data.phone.replace(/\D/g, ''))) {
      errors.push('Valid 10-digit phone number is required');
    }

    if (!data.name && !data.fullName) {
      errors.push('Name is required');
    }

    // Form-specific validations
    switch (formType) {
      case 'franchise_applications':
        if (!data.investmentCapacity) {
          errors.push('Investment capacity is required');
        }
        if (!data.city || !data.state) {
          errors.push('Location details are required');
        }
        break;

      case 'job_applications':
        if (!data.position) {
          errors.push('Position is required');
        }
        if (!data.experience) {
          errors.push('Experience is required');
        }
        break;

      case 'location_submissions':
        if (!data.address) {
          errors.push('Address is required');
        }
        if (!data.locationType) {
          errors.push('Location type is required');
        }
        break;
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();

// Export types
export type { FormSubmission, SubmissionResponse };