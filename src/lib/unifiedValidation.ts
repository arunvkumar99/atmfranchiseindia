import { z } from 'zod';
import { 
  contactFormSchema, 
  agentFormSchema, 
  franchiseFormSchema, 
  atmEnquirySchema,
  locationSubmissionSchema,
  influencerFormSchema,
  validateFormData,
  sanitizeText,
  sanitizeEmail,
  sanitizePhone
} from './validation';
import { validateFile, FILE_VALIDATION_CONFIGS } from './fileValidation';
import { 
  FormValidationError, 
  FileUploadError, 
  ErrorSeverity,
  useErrorHandler 
} from './errorHandling';

// Unified Form Types
export type FormType = 
  | 'contact' 
  | 'agent' 
  | 'franchise' 
  | 'atm_enquiry' 
  | 'location' 
  | 'influencer'
  | 'job_application'
  | 'get_started';

// Unified Validation Result
export interface ValidationResult<T = any> {
  isValid: boolean;
  data?: T;
  errors: Record<string, string>;
  sanitizedData?: T;
}

// File validation result for forms
export interface FormFileValidation {
  isValid: boolean;
  errors: string[];
  files: Record<string, File>;
}

// Unified Form Validator Class
export class UnifiedFormValidator {
  private static instance: UnifiedFormValidator;
  private errorHandler: ReturnType<typeof useErrorHandler>;

  constructor() {
    this.errorHandler = useErrorHandler();
  }

  static getInstance(): UnifiedFormValidator {
    if (!UnifiedFormValidator.instance) {
      UnifiedFormValidator.instance = new UnifiedFormValidator();
    }
    return UnifiedFormValidator.instance;
  }

  // Get schema for form type
  private getSchema(formType: FormType): z.ZodSchema<any> {
    const schemas = {
      contact: contactFormSchema,
      agent: agentFormSchema,
      franchise: franchiseFormSchema,
      atm_enquiry: atmEnquirySchema,
      location: locationSubmissionSchema,
      influencer: influencerFormSchema,
      job_application: z.object({
        job_title: z.string().min(1, "Job title is required"),
        candidate_name: z.string().min(2, "Name must be at least 2 characters"),
        phone: z.string().regex(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number"),
        email: z.string().email("Please enter a valid email address").optional(),
        experience: z.string().optional(),
        current_location: z.string().optional(),
        expected_salary: z.string().optional(),
        notice_period: z.string().optional()
      }),
      get_started: z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().regex(/^[0-9+\-\s()]{10,15}$/, "Please enter a valid phone number"),
        location: z.string().min(2, "Location must be at least 2 characters"),
        investment: z.string().min(1, "Investment amount is required"),
        message: z.string().optional()
      })
    };

    return schemas[formType];
  }

  // Validate form data with unified approach
  validateForm<T>(formType: FormType, data: unknown): ValidationResult<T> {
    try {
      const schema = this.getSchema(formType);
      
      // First sanitize the data
      const sanitizedData = this.sanitizeFormData(data as Record<string, any>);
      
      // Then validate with schema
      const validationResult = validateFormData(schema, sanitizedData);
      
      if (!validationResult.success) {
        // Log validation errors
        this.errorHandler.handleFormError(
          new FormValidationError('validation', 'Form validation failed'),
          formType,
          undefined,
          ErrorSeverity.LOW
        );
        
      return {
        isValid: false,
        errors: validationResult.errors || {},
        sanitizedData: sanitizedData as T
      };
      }

      return {
        isValid: true,
        data: validationResult.data,
        errors: {},
        sanitizedData: validationResult.data
      };
    } catch (error) {
      this.errorHandler.handleFormError(
        error as Error,
        formType,
        undefined,
        ErrorSeverity.MEDIUM
      );
      
      return {
        isValid: false,
        errors: { general: 'Validation failed due to an unexpected error' }
      };
    }
  }

  // Sanitize form data
  private sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        continue;
      }

      if (typeof value === 'string') {
        if (key.toLowerCase().includes('email')) {
          sanitized[key] = sanitizeEmail(value);
        } else if (key.toLowerCase().includes('phone')) {
          sanitized[key] = sanitizePhone(value);
        } else {
          sanitized[key] = sanitizeText(value);
        }
      } else if (Array.isArray(value)) {
        sanitized[key] = value
          .filter(item => item && typeof item === 'string')
          .map(item => sanitizeText(item))
          .filter(item => item.length > 0);
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      } else if (typeof value === 'number') {
        sanitized[key] = value;
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  // Validate files for form
  validateFormFiles(files: Record<string, File>, formType: FormType): FormFileValidation {
    const errors: string[] = [];
    const validFiles: Record<string, File> = {};

    try {
      for (const [fieldName, file] of Object.entries(files)) {
        if (!file) continue;

        // Get appropriate validation config based on file type
        let config;
        
        if (fieldName.includes('photo') || fieldName.includes('image')) {
          config = {
            allowedTypes: [...FILE_VALIDATION_CONFIGS.images.allowedTypes],
            maxSizeBytes: FILE_VALIDATION_CONFIGS.images.maxSizeBytes,
            allowedExtensions: [...FILE_VALIDATION_CONFIGS.images.allowedExtensions]
          };
        } else if (fieldName.includes('cv') || fieldName.includes('resume')) {
          config = {
            allowedTypes: [...FILE_VALIDATION_CONFIGS.resume.allowedTypes],
            maxSizeBytes: FILE_VALIDATION_CONFIGS.resume.maxSizeBytes,
            allowedExtensions: [...FILE_VALIDATION_CONFIGS.resume.allowedExtensions]
          };
        } else {
          config = {
            allowedTypes: [...FILE_VALIDATION_CONFIGS.documents.allowedTypes],
            maxSizeBytes: FILE_VALIDATION_CONFIGS.documents.maxSizeBytes,
            allowedExtensions: [...FILE_VALIDATION_CONFIGS.documents.allowedExtensions]
          };
        }

        const validationResult = validateFile(file, config);
        
        if (!validationResult.isValid) {
          errors.push(`${fieldName}: ${validationResult.errors.join(', ')}`);
          this.errorHandler.handleFileError(
            new FileUploadError(`File validation failed for ${fieldName}`, 'VALIDATION_FAILED'),
            file.name,
            ErrorSeverity.MEDIUM
          );
        } else {
          validFiles[fieldName] = file;
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        files: validFiles
      };
    } catch (error) {
      this.errorHandler.handleFileError(
        new FileUploadError('File validation failed due to unexpected error', 'UNEXPECTED_ERROR'),
        undefined,
        ErrorSeverity.HIGH
      );
      
      return {
        isValid: false,
        errors: ['File validation failed due to an unexpected error'],
        files: {}
      };
    }
  }

  // Comprehensive form validation (data + files)
  validateCompleteForm<T>(
    formType: FormType, 
    data: unknown, 
    files?: Record<string, File>
  ): { formValid: ValidationResult<T>; filesValid: FormFileValidation } {
    const formValid = this.validateForm<T>(formType, data);
    const filesValid = files ? this.validateFormFiles(files, formType) : { isValid: true, errors: [], files: {} };

    return { formValid, filesValid };
  }

  // Pre-submit validation with comprehensive checks
  preSubmitValidation<T>(
    formType: FormType,
    data: unknown,
    files?: Record<string, File>,
    additionalChecks?: () => string[]
  ): { canSubmit: boolean; errors: string[]; validatedData?: T } {
    const { formValid, filesValid } = this.validateCompleteForm<T>(formType, data, files);
    
    const allErrors: string[] = [];
    
    // Collect form errors
    if (!formValid.isValid) {
      allErrors.push(...Object.values(formValid.errors));
    }
    
    // Collect file errors
    if (!filesValid.isValid) {
      allErrors.push(...filesValid.errors);
    }
    
    // Run additional custom checks
    if (additionalChecks) {
      try {
        const customErrors = additionalChecks();
        allErrors.push(...customErrors);
      } catch (error) {
        this.errorHandler.handleFormError(
          error as Error,
          formType,
          'custom_validation',
          ErrorSeverity.MEDIUM
        );
        allErrors.push('Custom validation failed');
      }
    }

    return {
      canSubmit: allErrors.length === 0,
      errors: allErrors,
      validatedData: formValid.data
    };
  }
}

// Singleton instance export
export const formValidator = UnifiedFormValidator.getInstance();

// Convenience hooks for React components
export function useFormValidation() {
  return {
    validateForm: formValidator.validateForm.bind(formValidator),
    validateFiles: formValidator.validateFormFiles.bind(formValidator),
    validateComplete: formValidator.validateCompleteForm.bind(formValidator),
    preSubmitValidation: formValidator.preSubmitValidation.bind(formValidator)
  };
}