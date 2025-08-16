// Instant Translation System - Enterprise-grade static translation with robust state management
// Implements expert-recommended batched DOM updates for zero-delay language switching

import { staticTranslations, getStaticTranslation, preloadCriticalTranslations } from './staticTranslations';
import { staticTranslationManager } from './staticTranslationManager';
import { completeTMS } from './completeTMS';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸', path: '' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', path: '/hi' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', path: '/bn' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', path: '/ta' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', path: '/te' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳', path: '/mr' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', path: '/gu' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', path: '/ur' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', path: '/kn' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', path: '/or' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', path: '/pa' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', path: '/as' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', path: '/ml' }
];

interface TranslatableElement {
  element: Element;
  originalText?: string;
  originalAttributes: Map<string, string>;
}

class InstantTranslationSystem {
  private static instance: InstantTranslationSystem;
  private currentLanguage = 'en';
  private translatableElements: TranslatableElement[] = [];
  private isInitialized = false;
  private isProcessing = false;
  private pendingLanguage: string | null = null;

  public static getInstance(): InstantTranslationSystem {
    if (!InstantTranslationSystem.instance) {
      InstantTranslationSystem.instance = new InstantTranslationSystem();
    }
    return InstantTranslationSystem.instance;
  }

  constructor() {
    this.loadLanguageFromURL();
  }

  // Load language from URL path
  private loadLanguageFromURL(): void {
    if (typeof window === 'undefined') return;
    
    const path = window.location.pathname;
    const languageMatch = path.match(/^\/([a-z]{2})(\/|$)/);
    
    if (languageMatch) {
      const langCode = languageMatch[1];
      const supportedLang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
      if (supportedLang) {
        this.currentLanguage = langCode;
        localStorage.setItem('preferred-language', langCode);
      }
    } else {
      // Check localStorage for preferred language
      const stored = localStorage.getItem('preferred-language');
      if (stored && SUPPORTED_LANGUAGES.find(l => l.code === stored)) {
        this.currentLanguage = stored;
      }
    }
  }

  // Initialize system
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Enterprise Translation System...');
      console.time('Translation System Init');
      
      // Store original content immediately
      this.cacheTranslatableElements();
      
      // Apply current language if not English
      if (this.currentLanguage !== 'en') {
        await this.applyTranslationsInstantly(this.currentLanguage);
      }
      
      // Setup page observer for SPA navigation
      this.setupPageObserver();
      
      this.isInitialized = true;
      console.timeEnd('Translation System Init');
      console.log(`✅ Translation System initialized for ${this.currentLanguage}`);
    } catch (error) {
      console.error('❌ Failed to initialize Translation System:', error);
    }
  }

  // Cache all translatable elements with original content
  private cacheTranslatableElements(): void {
    if (typeof window === 'undefined') return;

    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p:not([data-no-translate])',
      'span:not([class*="icon"]):not([class*="lucide"]):not([data-no-translate])',
      'button:not([data-no-translate])',
      'a:not([data-no-translate])',
      'label:not([data-no-translate])',
      'li:not([data-no-translate])',
      '[placeholder]',
      '[title]',
      '[alt]'
    ];

    this.translatableElements = [];
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.closest('[data-no-translate]')) return;
        
        const text = element.textContent?.trim();
        const originalAttributes = new Map<string, string>();
        
        // Cache translatable attributes
        ['placeholder', 'title', 'alt'].forEach(attr => {
          const value = element.getAttribute(attr);
          if (value) originalAttributes.set(attr, value);
        });
        
        if ((text && text.length > 1 && !this.isNonTranslatableContent(text)) || originalAttributes.size > 0) {
          this.translatableElements.push({
            element,
            originalText: text,
            originalAttributes
          });
        }
      });
    });

    console.log(`📝 Cached ${this.translatableElements.length} translatable elements`);
  }

  // Check if content should not be translated
  private isNonTranslatableContent(text: string): boolean {
    const skipPatterns = [
      /^\d+$/,                    // Pure numbers
      /^[^\w\s]+$/,               // Only symbols
      /^[a-zA-Z]$/,               // Single letters
      /@/,                        // Email addresses
      /https?:\/\//,              // URLs
      /^\s*$/,                    // Empty or whitespace
      /^ATM$/i,                   // ATM (brand name)
      /^Pixell\s*Pay$/i,          // PixellPay (brand name)
      /^[0-9+()-\s]+$/            // Phone numbers
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  // Expert-recommended batched translation implementation
  private async applyTranslationsInBatches(elements: TranslatableElement[], languageCode: string, batchSize = 100): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      let appliedCount = 0;

      const processBatch = () => {
        for (let i = 0; i < batchSize && index < elements.length; i++, index++) {
          const { element, originalText, originalAttributes } = elements[index];
          
          // Translate text content
          if (originalText) {
            const translation = getStaticTranslation(originalText, languageCode);
            if (translation && translation !== originalText) {
              element.textContent = translation;
              appliedCount++;
            }
          }
          
          // Translate attributes
          originalAttributes.forEach((originalValue, attr) => {
            const translation = getStaticTranslation(originalValue, languageCode);
            if (translation && translation !== originalValue) {
              element.setAttribute(attr, translation);
              appliedCount++;
            }
          });
        }

        if (index < elements.length) {
          requestAnimationFrame(processBatch);
        } else {
          console.log(`⚡ Applied ${appliedCount} translations in batches`);
          resolve();
        }
      };

      processBatch();
    });
  }

  // Apply static translations instantly with robust state management
  private async applyTranslationsInstantly(languageCode: string): Promise<void> {
    if (this.isProcessing) {
      this.pendingLanguage = languageCode;
      return;
    }

    this.isProcessing = true;
    console.time(`Translation to ${languageCode}`);

    try {
      if (languageCode === 'en') {
        await this.restoreEnglishContent();
      } else {
        await this.applyTranslationsInBatches(this.translatableElements, languageCode);
      }
      
      this.updateDocumentLanguage(languageCode);
      console.timeEnd(`Translation to ${languageCode}`);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      this.isProcessing = false;
      
      // Process pending language switch if any
      if (this.pendingLanguage && this.pendingLanguage !== languageCode) {
        const nextLanguage = this.pendingLanguage;
        this.pendingLanguage = null;
        setTimeout(() => this.applyTranslationsInstantly(nextLanguage), 0);
      }
    }
  }

  // Restore English content
  private async restoreEnglishContent(): Promise<void> {
    return new Promise((resolve) => {
      let index = 0;
      let restoredCount = 0;
      const batchSize = 100;

      const processBatch = () => {
        for (let i = 0; i < batchSize && index < this.translatableElements.length; i++, index++) {
          const { element, originalText, originalAttributes } = this.translatableElements[index];
          
          // Restore text content
          if (originalText) {
            element.textContent = originalText;
            restoredCount++;
          }
          
          // Restore attributes
          originalAttributes.forEach((originalValue, attr) => {
            element.setAttribute(attr, originalValue);
            restoredCount++;
          });
        }

        if (index < this.translatableElements.length) {
          requestAnimationFrame(processBatch);
        } else {
          console.log(`✅ Restored ${restoredCount} items to English`);
          resolve();
        }
      };

      processBatch();
    });
  }

  // Update document language attributes
  private updateDocumentLanguage(languageCode: string): void {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (language) {
      document.documentElement.lang = language.code;
      document.documentElement.dir = 'ltr'; // All supported languages are LTR
    }
  }

  // Setup observer for SPA navigation
  private setupPageObserver(): void {
    if (typeof window === 'undefined') return;

    let lastUrl = location.href;
    
    // React Router navigation handling
    const handleNavigation = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log('🔄 SPA navigation detected, refreshing translations...');
        setTimeout(() => {
          this.refreshPage();
        }, 50); // Reduced delay for faster response
      }
    };

    // Listen for pushstate/popstate events (React Router navigation)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleNavigation, 50);
    };

    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handleNavigation, 50);
    };

    window.addEventListener('popstate', handleNavigation);

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              // Check if new content contains translatable text
              if (element.textContent && element.textContent.trim().length > 3) {
                hasNewContent = true;
              }
            }
          });
        }
      });

      if (hasNewContent && !this.isProcessing) {
        console.log('🔄 New content detected, refreshing translations...');
        setTimeout(() => {
          this.refreshPage();
        }, 100);
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  // Refresh translations when page content changes
  refreshPage(): void {
    if (this.isProcessing) return;
    
    // Re-cache elements and apply translations (no API calls)
    this.cacheTranslatableElements();
    if (this.currentLanguage !== 'en') {
      this.applyTranslationsInstantly(this.currentLanguage);
    }
  }

  // Main method: Switch to language INSTANTLY with robust state management
  public async switchToLanguage(languageCode: string): Promise<void> {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!language || languageCode === this.currentLanguage) return;

    console.log(`🌍 Switching to: ${language.native} (${languageCode})`);

    // Update internal state immediately
    this.currentLanguage = languageCode;
    localStorage.setItem('preferred-language', languageCode);

    // Update URL (without page reload)
    this.updateURL(language.path);

    // Apply translations instantly
    await this.applyTranslationsInstantly(languageCode);

    // Preload critical translations for performance
    preloadCriticalTranslations(languageCode);

    // SEO meta tags are now managed by React Helmet in SEOMetaTags component
    // completeTMS.injectSEOMetaTags(); // DISABLED to prevent DOM conflicts

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));

    console.log(`✅ Language switched to ${language.native} instantly`);
  }

  // Update URL without page reload
  private updateURL(path: string): void {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath = path + cleanPath;
    
    if (newPath !== currentPath) {
      window.history.pushState({}, '', newPath || '/');
    }
  }

  // Get current language
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Get supported languages
  public getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  // Check if language is supported
  public isLanguageSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }

  // Get processing status
  public isTranslationInProgress(): boolean {
    return this.isProcessing;
  }
}

// Export singleton instance
export const instantTranslationSystem = InstantTranslationSystem.getInstance();

// Auto-initialization disabled - preventing conflicts with unified system
// To manually initialize: instantTranslationSystem.initialize()