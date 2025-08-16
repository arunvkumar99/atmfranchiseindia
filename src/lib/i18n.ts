import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
];

// Language codes array for i18n config
const languageCodes = SUPPORTED_LANGUAGES.map(lang => lang.code);

// Custom language detector that checks URL path
const customLanguageDetector = {
  name: 'urlPathDetector',
  lookup() {
    const path = window.location.pathname;
    const langMatch = path.match(/^\/([a-z]{2})(\/|$)/);
    if (langMatch && languageCodes.includes(langMatch[1])) {
      return langMatch[1];
    }
    return null;
  },
  cacheUserLanguage(lng: string) {
    localStorage.setItem('i18nextLng', lng);
  }
};

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Supported languages
    supportedLngs: languageCodes,
    
    // Default language
    fallbackLng: 'en',
    
    // Debug mode (disable in production)
    debug: import.meta.env.DEV,
    
    // Namespace configuration
    ns: ['common', 'home', 'forms', 'products', 'blog'],
    defaultNS: 'common',
    
    // Backend configuration for loading JSON files
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      // Allow cross-domain requests
      crossDomain: true,
      // Cache responses
      requestOptions: {
        cache: 'default',
      }
    },
    
    // Language detection configuration
    detection: {
      order: ['urlPathDetector', 'localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
      checkWhitelist: true,
      // Custom detector for URL path
      detectors: [customLanguageDetector]
    },
    
    // React specific configuration
    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
    },
    
    // Interpolation configuration
    interpolation: {
      escapeValue: false, // React already escapes values
      formatSeparator: ',',
    },
    
    // Resource loading configuration
    load: 'languageOnly', // Don't load region-specific (e.g., en-US)
    
    // Fallback configuration
    fallbackNS: 'common',
    
    // Missing key handler
    saveMissing: import.meta.env.DEV, // Save missing translations in dev mode
    missingKeyHandler: (lngs, ns, key, fallbackValue) => {
      if (import.meta.env.DEV) {
        console.warn(`Missing translation: ${lngs.join(', ')} - ${ns}:${key}`);
      }
    },
    
    // Performance optimizations
    cleanCode: true,
    nonExplicitSupportedLngs: false,
    
    // Initial loading settings
    partialBundledLanguages: true,
    
    // Return empty string for missing translations in production
    returnEmptyString: false,
    returnNull: false,
  });

// Helper function to change language and update URL
export const changeLanguage = (langCode: string) => {
  const currentPath = window.location.pathname;
  const currentLangMatch = currentPath.match(/^\/([a-z]{2})(\/.*)?$/);
  
  let newPath: string;
  
  if (langCode === 'en') {
    // Remove language prefix for English
    if (currentLangMatch) {
      newPath = currentLangMatch[2] || '/';
    } else {
      newPath = currentPath;
    }
  } else {
    // Add or replace language prefix
    if (currentLangMatch) {
      newPath = `/${langCode}${currentLangMatch[2] || ''}`;
    } else {
      newPath = `/${langCode}${currentPath === '/' ? '' : currentPath}`;
    }
  }
  
  // Change language in i18n
  i18n.changeLanguage(langCode);
  
  // Update URL without page reload
  window.history.pushState({}, '', newPath);
};

// Helper function to get language from URL
export const getLanguageFromURL = (): string => {
  const path = window.location.pathname;
  const langMatch = path.match(/^\/([a-z]{2})(\/|$)/);
  
  if (langMatch && languageCodes.includes(langMatch[1])) {
    return langMatch[1];
  }
  
  return 'en';
};

// Helper function to get path without language prefix
export const getPathWithoutLanguage = (path: string): string => {
  const langMatch = path.match(/^\/([a-z]{2})(\/.*)?$/);
  
  if (langMatch && languageCodes.includes(langMatch[1])) {
    return langMatch[2] || '/';
  }
  
  return path;
};

// Helper function to add language prefix to path
export const addLanguageToPath = (path: string, langCode: string): string => {
  if (langCode === 'en') {
    return path;
  }
  
  // Remove existing language prefix if any
  const cleanPath = getPathWithoutLanguage(path);
  
  return `/${langCode}${cleanPath === '/' ? '' : cleanPath}`;
};

export default i18n;