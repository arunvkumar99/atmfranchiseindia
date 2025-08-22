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

// OPTIMIZED: Lazy loading configuration for better performance
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,
    
    // OPTIMIZED: Load only essential namespace initially
    ns: ['common'],
    defaultNS: 'common',
    
    // OPTIMIZED: Lazy load other namespaces on demand
    partialBundledLanguages: true,
    
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: true,
      
      // OPTIMIZED: Add caching headers for better performance
      requestOptions: {
        cache: 'default',
        credentials: 'same-origin',
        headers: {
          'Cache-Control': 'max-age=3600' // Cache for 1 hour
        }
      },
      
      // OPTIMIZED: Retry configuration
      retryTimeout: 2000,
      maxRetries: 2,
    },
    
    detection: {
      order: ['querystring', 'navigator', 'htmlTag', 'localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      
      // OPTIMIZED: Cache user language for 7 days
      cookieMinutes: 10080,
      cookieDomain: 'atmfranchiseindia.com'
    },
    
    // OPTIMIZED: Only preload critical languages
    preload: ['en', 'hi'], // English and Hindi as primary languages
    
    // OPTIMIZED: Load languages only when needed
    load: 'languageOnly',
    
    supportedLngs: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'],
    
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
      transWrapTextNodes: '',
      
      // OPTIMIZED: Wait for language to be loaded
      wait: true
    },
    
    // OPTIMIZED: Resource bundle configuration
    returnNull: false,
    returnEmptyString: false,
    
    // OPTIMIZED: Performance settings
    cleanCode: true,
    nonExplicitSupportedLngs: false,
    
    // Force English on initialization
    lng: 'en',
    
    // OPTIMIZED: Namespace loading strategy
    // Load namespaces dynamically when components need them
    fallbackNS: false,
  });

// OPTIMIZED: Helper function to preload namespaces for specific routes
export const preloadNamespacesForRoute = async (route: string) => {
  const namespaceMap: Record<string, string[]> = {
    '/': ['home', 'common'],
    '/submit-location': ['forms', 'common'],
    '/become-franchise': ['franchise', 'forms', 'common'],
    '/agent': ['agent', 'forms', 'common'],
    '/influencer': ['influencer', 'forms', 'common'],
    '/join-us': ['forms', 'common'],
    '/jobs': ['jobs', 'forms', 'common'],
    '/contact-us': ['contact', 'forms', 'common'],
    '/about-us': ['about', 'common'],
    '/our-products': ['products', 'common'],
    '/blog': ['blog', 'common'],
  };
  
  const namespacesToLoad = namespaceMap[route] || ['common'];
  const currentLang = i18n.language;
  
  // Load required namespaces for current language
  for (const ns of namespacesToLoad) {
    if (!i18n.hasResourceBundle(currentLang, ns)) {
      await i18n.loadNamespaces(ns);
    }
  }
};

// OPTIMIZED: Preload critical resources after initial mount
export const preloadCriticalResources = async () => {
  const criticalNamespaces = ['home', 'forms'];
  const primaryLanguages = ['en', 'hi'];
  
  // Use requestIdleCallback for non-blocking loading
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(async () => {
      for (const lang of primaryLanguages) {
        for (const ns of criticalNamespaces) {
          if (!i18n.hasResourceBundle(lang, ns)) {
            await i18n.loadLanguages(lang);
            await i18n.loadNamespaces(ns);
          }
        }
      }
    });
  }
};

// OPTIMIZED: Cache management utilities
export const clearTranslationCache = () => {
  if ('caches' in window) {
    caches.delete('i18n-cache');
  }
  localStorage.removeItem('i18nextLng');
};

export const getCachedLanguage = (): string | null => {
  return localStorage.getItem('i18nextLng');
};

export default i18n;