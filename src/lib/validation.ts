import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .max(255, "Email must be less than 255 characters");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must be less than 15 digits");

export const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes");

export const panSchema = z
  .string()
  .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "PAN must be in format: AAAAA9999A")
  .length(10, "PAN must be exactly 10 characters");

export const aadhaarSchema = z
  .string()
  .regex(/^[0-9]{12}$/, "Aadhaar must be exactly 12 digits")
  .length(12, "Aadhaar must be exactly 12 digits");

export const pincodeSchema = z
  .string()
  .regex(/^[0-9]{6}$/, "Pincode must be exactly 6 digits")
  .length(6, "Pincode must be exactly 6 digits");

// Contact form validation
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be less than 2000 characters")
});

// Agent form validation
export const agentFormSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  whatsapp_phone: phoneSchema,
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 18 && age <= 65;
    }, "Age must be between 18 and 65 years"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender"
  }),
  pan_number: panSchema,
  aadhaar_number: aadhaarSchema,
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  current_address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  permanent_address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  languages: z
    .array(z.string())
    .min(1, "Please select at least one language"),
  joining_as: z.enum(["Agent", "Distributor", "Super Distributor"], {
    required_error: "Please select a joining option"
  }),
  why_join: z
    .string()
    .min(20, "Please provide at least 20 characters explaining why you want to join")
    .max(1000, "Explanation must be less than 1000 characters")
});

// Franchise form validation
export const franchiseFormSchema = z.object({
  first_name: nameSchema.max(50, "First name must be less than 50 characters"),
  last_name: nameSchema.max(50, "Last name must be less than 50 characters"),
  email: emailSchema,
  phone: phoneSchema,
  alternate_phone: phoneSchema.optional(),
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 21 && age <= 65;
    }, "Age must be between 21 and 65 years for franchise ownership"),
  address_line1: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address line 1 must be less than 200 characters"),
  address_line2: z
    .string()
    .max(200, "Address line 2 must be less than 200 characters")
    .optional(),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  state: z.string().min(1, "State is required"),
  pincode: pincodeSchema,
  business_type: z.string().min(1, "Business type is required"),
  experience_years: z.string().min(1, "Experience is required"),
  current_occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(100, "Occupation must be less than 100 characters"),
  monthly_income: z.string().min(1, "Monthly income is required"),
  net_worth: z.string().min(1, "Net worth is required"),
  investment_budget: z.string().min(1, "Investment budget is required"),
  funding_source: z.string().min(1, "Funding source is required"),
  credit_score: z.string().min(1, "Credit score is required"),
  preferred_location: z
    .string()
    .min(2, "Preferred location must be at least 2 characters")
    .max(200, "Preferred location must be less than 200 characters"),
  space_availability: z.string().min(1, "Space availability is required"),
  space_size: z.string().min(1, "Space size is required"),
  additional_info: z
    .string()
    .max(1000, "Additional information must be less than 1000 characters")
    .optional(),
  agreed_to_terms: z
    .boolean()
    .refine(val => val === true, "You must agree to the terms and conditions")
});

// ATM Enquiry form validation
export const atmEnquirySchema = z.object({
  full_name: nameSchema,
  email: emailSchema.optional(),
  phone: phoneSchema,
  whatsapp_number: phoneSchema,
  state: z.string().min(1, "State is required"),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(100, "Occupation must be less than 100 characters"),
  has_own_space: z.enum(["Yes", "No"], {
    required_error: "Please specify if you have your own space"
  }),
  enquiry_purpose: z.string().min(1, "Enquiry purpose is required")
});

// Get Started form validation
export const getStartedSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(200, "Location must be less than 200 characters"),
  investment: z.string().min(1, "Investment amount is required"),
  message: z
    .string()
    .max(1000, "Message must be less than 1000 characters")
    .optional()
});

// Location submission validation
export const locationSubmissionSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  whatsapp_phone: phoneSchema,
  state: z.string().min(1, "State is required"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  location_type: z.string().min(1, "Location type is required"),
  location_description: z
    .string()
    .min(10, "Location description must be at least 10 characters")
    .max(500, "Location description must be less than 500 characters"),
  space_ownership: z.enum(["Own", "Rent", "Lease"], {
    required_error: "Please specify space ownership"
  }),
  space_size: z.string().min(1, "Space size is required"),
  monthly_rent: z
    .string()
    .max(20, "Monthly rent must be less than 20 characters")
    .optional(),
  security_deposit: z
    .string()
    .max(20, "Security deposit must be less than 20 characters")
    .optional(),
  monthly_footfall: z.string().min(1, "Monthly footfall is required"),
  nearby_competition: z.string().min(1, "Nearby competition information is required"),
  additional_info: z
    .string()
    .max(1000, "Additional information must be less than 1000 characters")
    .optional()
});

// Influencer form validation (similar to agent but with social media links)
export const influencerFormSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  whatsapp_phone: phoneSchema,
  date_of_birth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const age = new Date().getFullYear() - new Date(date).getFullYear();
      return age >= 18 && age <= 65;
    }, "Age must be between 18 and 65 years"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Please select a gender"
  }),
  pan_number: panSchema,
  aadhaar_number: aadhaarSchema,
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  current_address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  permanent_address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(500, "Address must be less than 500 characters"),
  languages: z
    .array(z.string())
    .min(1, "Please select at least one language"),
  facebook_link: z
    .string()
    .url("Please enter a valid Facebook URL")
    .min(1, "Facebook link is required"),
  instagram_link: z
    .string()
    .url("Please enter a valid Instagram URL")
    .min(1, "Instagram link is required"),
  youtube_link: z
    .string()
    .url("Please enter a valid YouTube URL")
    .min(1, "YouTube link is required"),
  linkedin_link: z
    .string()
    .url("Please enter a valid LinkedIn URL")
    .optional(),
  other_channel_1: z
    .string()
    .url("Please enter a valid URL")
    .optional(),
  other_channel_2: z
    .string()
    .url("Please enter a valid URL")
    .optional()
});

// Enhanced security patterns
const SECURITY_PATTERNS = {
  xss: /<script|javascript:|onload=|onerror=|onclick=/i,
  sqlInjection: /(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b).*(\bfrom\b|\binto\b|\bwhere\b)/i,
  htmlTags: /<[^>]*>/g,
  suspicious: /(\beval\b|\bexec\b|\bfunction\b.*\(.*\))/i
};

function detectSuspiciousContent(value: string): string[] {
  const issues: string[] = [];
  
  if (SECURITY_PATTERNS.xss.test(value)) {
    issues.push('Potentially malicious content detected');
  }
  
  if (SECURITY_PATTERNS.sqlInjection.test(value)) {
    issues.push('SQL injection attempt detected');
  }
  
  if (SECURITY_PATTERNS.suspicious.test(value)) {
    issues.push('Suspicious code patterns detected');
  }
  
  return issues;
}

// Enhanced data sanitization functions
export const sanitizeText = (text: string): string => {
  // Check for security issues first
  const securityIssues = detectSuspiciousContent(text);
  if (securityIssues.length > 0) {
    console.warn('Security issues detected in input:', securityIssues);
    // Return empty string for security violations
    return '';
  }
  
  return text
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(SECURITY_PATTERNS.htmlTags, '') // Remove HTML tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .substring(0, 2000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  return email
    .trim()
    .toLowerCase()
    .replace(/[^\w@.-]/g, '') // Only allow valid email characters
    .slice(0, 254);
};

export const sanitizePhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.slice(0, 15);
};

// Enhanced file validation
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}

export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 255);
}

// Validation helper function
export const validateFormData = <T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
} => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};