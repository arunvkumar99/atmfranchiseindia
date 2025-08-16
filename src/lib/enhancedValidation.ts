// Enhanced validation system with real-time feedback
// Provides better UX with instant validation and helpful error messages

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
  suggestion?: string;
}

// Indian phone number validation with detailed feedback
export function validateIndianPhone(phone: string): ValidationResult {
  // Remove spaces, dashes, and country code
  const cleaned = phone.replace(/[\s-]/g, '').replace(/^(\+91|91|0)/, '');
  
  if (!cleaned) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  if (cleaned.length < 10) {
    return { 
      isValid: false, 
      error: `${10 - cleaned.length} more digit${10 - cleaned.length > 1 ? 's' : ''} required`,
      suggestion: 'Enter 10 digit mobile number'
    };
  }
  
  if (cleaned.length > 10) {
    return { 
      isValid: false, 
      error: 'Too many digits',
      suggestion: 'Remove country code if added'
    };
  }
  
  if (!/^[6-9]/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Indian mobile numbers start with 6-9',
      suggestion: 'Check the first digit'
    };
  }
  
  if (!/^[6-9]\d{9}$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Invalid phone number format'
    };
  }
  
  // Check for common test numbers
  if (/^(\d)\1{9}$/.test(cleaned)) {
    return { 
      isValid: true, 
      warning: 'This looks like a test number'
    };
  }
  
  return { isValid: true };
}

// Email validation with suggestions
export function validateEmail(email: string): ValidationResult {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const trimmed = email.trim().toLowerCase();
  
  // Check for common typos in domain names
  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'yahooo.com': 'yahoo.com',
    'yaho.com': 'yahoo.com',
    'hotmial.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
  };
  
  for (const [typo, correct] of Object.entries(commonTypos)) {
    if (trimmed.includes(typo)) {
      return {
        isValid: false,
        error: `Did you mean ${correct}?`,
        suggestion: trimmed.replace(typo, correct)
      };
    }
  }
  
  // Basic structure check
  if (!trimmed.includes('@')) {
    return { 
      isValid: false, 
      error: 'Email must contain @',
      suggestion: 'Format: name@domain.com'
    };
  }
  
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { 
      isValid: false, 
      error: 'Invalid email format',
      suggestion: 'Only one @ allowed'
    };
  }
  
  const [localPart, domain] = parts;
  
  if (!localPart) {
    return { 
      isValid: false, 
      error: 'Email username missing'
    };
  }
  
  if (!domain.includes('.')) {
    return { 
      isValid: false, 
      error: 'Domain must have extension',
      suggestion: 'Add .com, .in, etc.'
    };
  }
  
  if (domain.endsWith('.')) {
    return { 
      isValid: false, 
      error: 'Domain extension incomplete'
    };
  }
  
  // Full regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { 
      isValid: false, 
      error: 'Invalid email format'
    };
  }
  
  // Check for disposable email domains
  const disposableDomains = ['tempmail', 'throwaway', '10minutemail', 'guerrillamail'];
  if (disposableDomains.some(d => domain.includes(d))) {
    return { 
      isValid: true, 
      warning: 'Please use your permanent email address'
    };
  }
  
  return { isValid: true };
}

// PIN code validation with location hint
export function validatePinCode(pincode: string): ValidationResult {
  if (!pincode) {
    return { isValid: false, error: 'PIN code is required' };
  }
  
  const cleaned = pincode.replace(/\s/g, '');
  
  if (cleaned.length < 6) {
    return { 
      isValid: false, 
      error: `${6 - cleaned.length} more digit${6 - cleaned.length > 1 ? 's' : ''} required`
    };
  }
  
  if (cleaned.length > 6) {
    return { 
      isValid: false, 
      error: 'PIN code must be 6 digits only'
    };
  }
  
  if (!/^\d+$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'PIN code must contain only numbers'
    };
  }
  
  if (cleaned.startsWith('0')) {
    return { 
      isValid: false, 
      error: 'PIN code cannot start with 0'
    };
  }
  
  // PIN code zone validation
  const firstDigit = cleaned[0];
  const zones: Record<string, string> = {
    '1': 'Delhi, Haryana, Punjab, Himachal Pradesh, Jammu & Kashmir',
    '2': 'Uttar Pradesh, Uttarakhand',
    '3': 'Rajasthan, Gujarat',
    '4': 'Maharashtra, Madhya Pradesh, Chhattisgarh',
    '5': 'Andhra Pradesh, Telangana, Karnataka',
    '6': 'Tamil Nadu, Kerala, Puducherry',
    '7': 'West Bengal, Odisha, Assam, Northeast',
    '8': 'Bihar, Jharkhand',
    '9': 'Army Post Office'
  };
  
  if (!zones[firstDigit]) {
    return { 
      isValid: false, 
      error: 'Invalid PIN code range'
    };
  }
  
  return { 
    isValid: true,
    suggestion: `Zone: ${zones[firstDigit]}`
  };
}

// PAN card validation
export function validatePAN(pan: string): ValidationResult {
  if (!pan) {
    return { isValid: false, error: 'PAN number is required' };
  }
  
  const cleaned = pan.toUpperCase().replace(/\s/g, '');
  
  if (cleaned.length < 10) {
    return { 
      isValid: false, 
      error: `${10 - cleaned.length} more character${10 - cleaned.length > 1 ? 's' : ''} required`,
      suggestion: 'Format: ABCDE1234F'
    };
  }
  
  if (cleaned.length > 10) {
    return { 
      isValid: false, 
      error: 'PAN must be exactly 10 characters'
    };
  }
  
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  
  if (!panRegex.test(cleaned)) {
    // Detailed error based on position
    if (!/^[A-Z]{5}/.test(cleaned)) {
      return { 
        isValid: false, 
        error: 'First 5 characters must be letters',
        suggestion: 'Format: ABCDE1234F'
      };
    }
    if (!/^[A-Z]{5}[0-9]{4}/.test(cleaned)) {
      return { 
        isValid: false, 
        error: 'Characters 6-9 must be numbers',
        suggestion: 'Format: ABCDE1234F'
      };
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(cleaned)) {
      return { 
        isValid: false, 
        error: 'Last character must be a letter',
        suggestion: 'Format: ABCDE1234F'
      };
    }
  }
  
  // Check PAN type
  const fourthChar = cleaned[3];
  const types: Record<string, string> = {
    'P': 'Individual',
    'C': 'Company',
    'H': 'Hindu Undivided Family',
    'A': 'Association of Persons',
    'B': 'Body of Individuals',
    'G': 'Government',
    'J': 'Artificial Juridical Person',
    'L': 'Local Authority',
    'F': 'Firm/Partnership',
    'T': 'Trust'
  };
  
  if (types[fourthChar]) {
    return { 
      isValid: true,
      suggestion: `Type: ${types[fourthChar]}`
    };
  }
  
  return { isValid: true };
}

// Aadhaar validation (basic, without actual verification)
export function validateAadhaar(aadhaar: string): ValidationResult {
  if (!aadhaar) {
    return { isValid: false, error: 'Aadhaar number is required' };
  }
  
  const cleaned = aadhaar.replace(/[\s-]/g, '');
  
  if (cleaned.length < 12) {
    return { 
      isValid: false, 
      error: `${12 - cleaned.length} more digit${12 - cleaned.length > 1 ? 's' : ''} required`
    };
  }
  
  if (cleaned.length > 12) {
    return { 
      isValid: false, 
      error: 'Aadhaar must be exactly 12 digits'
    };
  }
  
  if (!/^\d{12}$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Aadhaar must contain only numbers'
    };
  }
  
  // Check for invalid patterns
  if (cleaned.startsWith('0') || cleaned.startsWith('1')) {
    return { 
      isValid: false, 
      error: 'Invalid Aadhaar number',
      suggestion: 'Aadhaar cannot start with 0 or 1'
    };
  }
  
  // Check for repeated digits
  if (/^(\d)\1{11}$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Invalid Aadhaar pattern'
    };
  }
  
  return { isValid: true };
}

// Name validation with Indian name support
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const trimmed = name.trim();
  
  if (trimmed.length < 2) {
    return { 
      isValid: false, 
      error: `${fieldName} too short`,
      suggestion: 'Minimum 2 characters'
    };
  }
  
  if (trimmed.length > 100) {
    return { 
      isValid: false, 
      error: `${fieldName} too long`,
      suggestion: 'Maximum 100 characters'
    };
  }
  
  // Allow letters, spaces, dots (for initials), and apostrophes
  if (!/^[a-zA-Z\s.']+$/.test(trimmed)) {
    // Check if it contains numbers
    if (/\d/.test(trimmed)) {
      return { 
        isValid: false, 
        error: 'Numbers not allowed in name'
      };
    }
    
    // Check for special characters
    if (/[!@#$%^&*()_+=\[\]{};:"\\|,<>\/?]/.test(trimmed)) {
      return { 
        isValid: false, 
        error: 'Special characters not allowed'
      };
    }
  }
  
  // Check for valid format
  if (/\s{2,}/.test(trimmed)) {
    return { 
      isValid: false, 
      error: 'Remove extra spaces'
    };
  }
  
  return { isValid: true };
}

// Investment amount validation
export function validateInvestmentAmount(amount: string): ValidationResult {
  if (!amount) {
    return { isValid: false, error: 'Investment amount is required' };
  }
  
  // Remove currency symbols and commas
  const cleaned = amount.replace(/[₹$,\s]/g, '');
  
  if (!/^\d+$/.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Enter numbers only',
      suggestion: 'Don\'t include currency symbols'
    };
  }
  
  const numAmount = parseInt(cleaned);
  
  if (numAmount < 50000) {
    return { 
      isValid: false, 
      error: 'Minimum investment is ₹50,000'
    };
  }
  
  if (numAmount > 10000000) {
    return { 
      isValid: true, 
      warning: 'For investments above ₹1 Crore, our team will contact you'
    };
  }
  
  return { isValid: true };
}

// GST number validation
export function validateGST(gst: string): ValidationResult {
  if (!gst) {
    return { isValid: true }; // GST is optional
  }
  
  const cleaned = gst.toUpperCase().replace(/\s/g, '');
  
  if (cleaned.length !== 15) {
    return { 
      isValid: false, 
      error: 'GST number must be 15 characters',
      suggestion: 'Format: 22ABCDE1234F1Z5'
    };
  }
  
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  
  if (!gstRegex.test(cleaned)) {
    return { 
      isValid: false, 
      error: 'Invalid GST format',
      suggestion: 'Format: 22ABCDE1234F1Z5'
    };
  }
  
  // Validate state code
  const stateCode = cleaned.substring(0, 2);
  const validStateCodes = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '26', '27', '28', '29', '30', '31',
    '32', '33', '34', '35', '36', '37', '38', '97', '99'
  ];
  
  if (!validStateCodes.includes(stateCode)) {
    return { 
      isValid: false, 
      error: 'Invalid state code in GST'
    };
  }
  
  // Check if PAN is embedded correctly (characters 3-12)
  const embeddedPAN = cleaned.substring(2, 12);
  const panResult = validatePAN(embeddedPAN);
  
  if (!panResult.isValid) {
    return { 
      isValid: false, 
      error: 'Invalid PAN in GST number'
    };
  }
  
  return { isValid: true };
}