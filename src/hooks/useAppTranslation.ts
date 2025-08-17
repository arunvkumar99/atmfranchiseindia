import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

/**
 * Custom translation hook for the ATM Franchise India app
 * Provides consistent translation functionality across all components
 */
export const useAppTranslation = (namespace: string = 'common') => {
  const { t, i18n, ready } = useTranslation(namespace);
  
  // Check if language is RTL (Urdu)
  const isRTL = i18n.language === 'ur';
  
  // Helper to translate with fallback
  const translate = useCallback((key: string, fallback?: string, options?: any) => {
    // If translation is not ready, return fallback or key
    if (!ready && fallback) return fallback;
    
    // Use namespace prefix if key doesn't include it
    const fullKey = key.includes(':') ? key : key;
    
    // Call t function with fallback
    return t(fullKey, fallback || key, options);
  }, [t, ready]);
  
  // Helper to translate with count (pluralization)
  const translateCount = useCallback((key: string, count: number, fallback?: string) => {
    return translate(key, fallback, { count });
  }, [translate]);
  
  // Helper to check if translation exists
  const hasTranslation = useCallback((key: string) => {
    const translation = t(key, { defaultValue: '___NOT_FOUND___' });
    return translation !== '___NOT_FOUND___';
  }, [t]);
  
  return {
    t: translate,
    tc: translateCount,
    i18n,
    ready,
    isRTL,
    hasTranslation,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage.bind(i18n),
  };
};

// Re-export for convenience
export default useAppTranslation;