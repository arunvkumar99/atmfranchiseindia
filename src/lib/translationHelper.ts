/**
 * Translation Helper Utilities
 * Best practices for i18n implementation
 */

import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

/**
 * Custom hook with automatic namespace detection
 * @param namespace - Optional namespace, defaults to component path
 */
export function useAppTranslation(namespace?: string) {
  const ns = namespace || detectNamespace();
  const { t, i18n } = useTranslation(ns);
  
  return {
    t: createSafeTranslation(t),
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
}

/**
 * Detect namespace based on component file path
 */
function detectNamespace(): string {
  // In production, use a default namespace
  if (process.env.NODE_ENV === 'production') {
    return 'common';
  }
  
  // In development, try to detect from stack trace
  try {
    const stack = new Error().stack;
    if (stack) {
      const match = stack.match(/at\s+\w+\s+\(.*[\/\\](pages|components)[\/\\](\w+)/);
      if (match && match[2]) {
        return match[2].toLowerCase();
      }
    }
  } catch (e) {
    // Fallback to common namespace
  }
  
  return 'common';
}

/**
 * Create a safe translation function with fallback
 */
function createSafeTranslation(t: TFunction) {
  return (key: string, fallback?: string, options?: any) => {
    const translated = t(key, options);
    
    // If translation key is returned as-is, use fallback
    if (translated === key && fallback) {
      console.warn(`Missing translation for key: ${key}`);
      return fallback;
    }
    
    return translated;
  };
}

/**
 * Format currency with locale support
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  const locale = localStorage.getItem('i18nextLng') || 'en';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date with locale support
 */
export function formatDate(date: Date | string, format = 'medium'): string {
  const locale = localStorage.getItem('i18nextLng') || 'en';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  }[format] || { month: 'long', day: 'numeric', year: 'numeric' };
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format number with locale support
 */
export function formatNumber(num: number): string {
  const locale = localStorage.getItem('i18nextLng') || 'en';
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Get direction for RTL languages
 */
export function getTextDirection(): 'ltr' | 'rtl' {
  const lang = localStorage.getItem('i18nextLng') || 'en';
  const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}

/**
 * Translation key generator for forms
 */
export function formKey(section: string, field: string, type: 'label' | 'placeholder' | 'error' = 'label'): string {
  return `forms.${section}.${field}.${type}`;
}

/**
 * Batch translation loader for performance
 */
export async function preloadTranslations(languages: string[], namespaces: string[]) {
  const promises = languages.flatMap(lang =>
    namespaces.map(ns =>
      fetch(`/locales/${lang}/${ns}.json`)
        .then(res => res.json())
        .catch(err => {
          if (import.meta.env.DEV) { console.error(`Failed to preload ${lang}/${ns}:`, err); }
          return {};
        })
    )
  );
  
  return Promise.all(promises);
}

export default {
  useAppTranslation,
  formatCurrency,
  formatDate,
  formatNumber,
  getTextDirection,
  formKey,
  preloadTranslations,
};
