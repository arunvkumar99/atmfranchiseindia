/**
 * Centralized type definitions for the application
 */

// ============================================
// Form Types
// ============================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'file';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  validation?: FormValidation;
}

export interface FormValidation {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  custom?: (value: unknown) => boolean | string;
}

export interface FormData {
  [key: string]: string | number | boolean | File | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormSubmission {
  formName: string;
  data: FormData;
  timestamp: string;
  source?: string;
}

// ============================================
// API Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: unknown;
}

export interface GoogleSheetsSubmission {
  values: string[][];
  range?: string;
  valueInputOption?: 'RAW' | 'USER_ENTERED';
}

// ============================================
// Component Props Types
// ============================================

export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'aria-label'?: string;
  'data-testid'?: string;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps extends BaseComponentProps {
  type?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  autoComplete?: string;
}

// ============================================
// Navigation Types
// ============================================

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
  external?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

// ============================================
// Translation Types
// ============================================

export interface TranslationNamespace {
  [key: string]: string | TranslationNamespace;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  direction?: 'ltr' | 'rtl';
}

// ============================================
// Performance Types
// ============================================

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

export interface PerformanceEntry {
  FCP?: number; // First Contentful Paint
  LCP?: number; // Largest Contentful Paint
  FID?: number; // First Input Delay
  CLS?: number; // Cumulative Layout Shift
  TTFB?: number; // Time to First Byte
}

// ============================================
// Error Types
// ============================================

export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// ============================================
// Utility Types
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// Type guard utilities
export const isString = (value: unknown): value is string => typeof value === 'string';
export const isNumber = (value: unknown): value is number => typeof value === 'number';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';
export const isObject = (value: unknown): value is Record<string, unknown> => 
  value !== null && typeof value === 'object' && !Array.isArray(value);
export const isArray = <T = unknown>(value: unknown): value is T[] => Array.isArray(value);
export const isFunction = (value: unknown): value is Function => typeof value === 'function';
export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined => value === undefined;
export const isNullOrUndefined = (value: unknown): value is null | undefined => 
  value === null || value === undefined;

// ============================================
// Event Types
// ============================================

export type FormEvent = React.FormEvent<HTMLFormElement>;
export type ChangeEvent<T = HTMLInputElement> = React.ChangeEvent<T>;
export type MouseEvent<T = HTMLElement> = React.MouseEvent<T>;
export type KeyboardEvent<T = HTMLElement> = React.KeyboardEvent<T>;
export type FocusEvent<T = HTMLElement> = React.FocusEvent<T>;

// ============================================
// Hook Return Types
// ============================================

export interface UseFormReturn {
  values: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isValid: boolean;
  handleChange: (name: string, value: unknown) => void;
  handleSubmit: (e: FormEvent) => Promise<void>;
  setFieldError: (name: string, error: string) => void;
  clearErrors: () => void;
  reset: () => void;
}

export interface UseApiReturn<T = unknown> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}

export interface UseDebounceReturn<T> {
  debouncedValue: T;
  isPending: boolean;
}

// ============================================
// Business Logic Types
// ============================================

export interface ATMLocation {
  id: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface FranchiseInquiry {
  name: string;
  email: string;
  phone: string;
  state: string;
  city: string;
  investment?: string;
  experience?: string;
  message?: string;
  source?: string;
  timestamp?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface NewsletterSubscription {
  email: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  topics?: string[];
}