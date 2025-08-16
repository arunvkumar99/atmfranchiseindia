// Unified Translation System - Production Ready
// Eliminates all architectural issues and provides reliable translation

import { supabase } from '@/integrations/supabase/client';

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
  originalText: string;
  translationKey: string;
}

class UnifiedTranslationSystem {
  private static instance: UnifiedTranslationSystem;
  private currentLanguage = 'en';
  private translations = new Map<string, Map<string, string>>();
  private translatableElements: TranslatableElement[] = [];
  private isInitialized = false;
  private isProcessing = false;

  public static getInstance(): UnifiedTranslationSystem {
    if (!UnifiedTranslationSystem.instance) {
      UnifiedTranslationSystem.instance = new UnifiedTranslationSystem();
    }
    return UnifiedTranslationSystem.instance;
  }

  constructor() {
    this.loadLanguageFromURL();
  }

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
        console.log(`🌍 URL detected language: ${langCode}`);
      }
    } else {
      const stored = localStorage.getItem('preferred-language');
      if (stored && SUPPORTED_LANGUAGES.find(l => l.code === stored)) {
        this.currentLanguage = stored;
        console.log(`🌍 Using stored language: ${stored}`);
      }
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Unified Translation System...');
      
      // Load all translations from database
      await this.loadAllTranslations();
      
      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Scan and cache translatable elements
      this.scanTranslatableElements();
      
      // Apply current language if not English
      if (this.currentLanguage !== 'en') {
        console.log(`🔄 Applying translations for ${this.currentLanguage}...`);
        await this.applyTranslations(this.currentLanguage);
      }
      
      // Setup observers for dynamic content
      this.setupObservers();
      
      this.isInitialized = true;
      console.log(`✅ Unified Translation System initialized for ${this.currentLanguage}`);
    } catch (error) {
      console.error('❌ Failed to initialize Unified Translation System:', error);
    }
  }

  private async loadAllTranslations(): Promise<void> {
    try {
      console.log('📚 Loading all translations from database...');
      
      const { data: translations, error } = await supabase
        .from('website_translations')
        .select('*');

      if (error) {
        console.error('Database error:', error);
        return;
      }

      if (translations) {
        this.translations.clear();
        
        translations.forEach(translation => {
          if (!this.translations.has(translation.language_code)) {
            this.translations.set(translation.language_code, new Map());
          }
          
          const langMap = this.translations.get(translation.language_code)!;
          langMap.set(translation.original_text, translation.translated_text);
        });
        
        console.log(`📚 Loaded translations for ${this.translations.size} languages`);
        
        // Log counts for debugging
        SUPPORTED_LANGUAGES.forEach(lang => {
          const count = this.translations.get(lang.code)?.size || 0;
          if (count > 0) {
            console.log(`  ${lang.native}: ${count} translations`);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error loading translations:', error);
    }
  }

  private scanTranslatableElements(): void {
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
        
        // Handle text content
        const text = element.textContent?.trim();
        if (text && text.length > 1 && !this.isNonTranslatableContent(text)) {
          this.translatableElements.push({
            element,
            originalText: text,
            translationKey: text
          });
        }
        
        // Handle attributes
        ['placeholder', 'title', 'alt'].forEach(attr => {
          const value = element.getAttribute(attr);
          if (value && value.length > 1 && !this.isNonTranslatableContent(value)) {
            this.translatableElements.push({
              element,
              originalText: value,
              translationKey: value
            });
          }
        });
      });
    });

    console.log(`📝 Scanned ${this.translatableElements.length} translatable elements`);
  }

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
      /^[0-9+()-\s]+$/,           // Phone numbers
      /^\/lovable-uploads/        // File paths
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  private async applyTranslations(languageCode: string): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const langTranslations = this.translations.get(languageCode);
      
      if (!langTranslations) {
        console.warn(`⚠️ No translations found for ${languageCode}`);
        this.isProcessing = false;
        return;
      }

      let appliedCount = 0;
      let missingCount = 0;

      // Apply translations in batches for performance
      const batchSize = 50;
      for (let i = 0; i < this.translatableElements.length; i += batchSize) {
        const batch = this.translatableElements.slice(i, i + batchSize);
        
        batch.forEach(({ element, originalText, translationKey }) => {
          const translation = langTranslations.get(translationKey);
          
          if (translation && translation !== originalText) {
            // Check if this is an attribute or text content
            const isAttribute = element.getAttribute('placeholder') === originalText ||
                               element.getAttribute('title') === originalText ||
                               element.getAttribute('alt') === originalText;
            
            if (isAttribute) {
              // Handle attributes
              ['placeholder', 'title', 'alt'].forEach(attr => {
                if (element.getAttribute(attr) === originalText) {
                  element.setAttribute(attr, translation);
                }
              });
            } else {
              // Handle text content
              element.textContent = translation;
            }
            
            appliedCount++;
          } else {
            missingCount++;
          }
        });

        // Yield control to prevent UI blocking
        if (i % (batchSize * 4) === 0) {
          await new Promise(resolve => setTimeout(resolve, 0));
        }
      }

      console.log(`✅ Applied ${appliedCount} translations for ${languageCode}`);
      if (missingCount > 0) {
        console.log(`⚠️ ${missingCount} translations missing for ${languageCode}`);
      }
      
    } catch (error) {
      console.error('❌ Error applying translations:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private restoreEnglishContent(): void {
    this.translatableElements.forEach(({ element, originalText }) => {
      // Check if this is an attribute or text content
      const isAttribute = element.hasAttribute('placeholder') ||
                         element.hasAttribute('title') ||
                         element.hasAttribute('alt');
      
      if (isAttribute) {
        ['placeholder', 'title', 'alt'].forEach(attr => {
          if (element.hasAttribute(attr)) {
            // Find the original value for this attribute
            const currentValue = element.getAttribute(attr);
            if (currentValue && currentValue !== originalText) {
              element.setAttribute(attr, originalText);
            }
          }
        });
      } else {
        element.textContent = originalText;
      }
    });

    console.log('✅ Restored original English content');
  }

  private setupObservers(): void {
    if (typeof window === 'undefined') return;

    // Observe DOM changes for dynamic content
    const observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.textContent && element.textContent.trim().length > 3) {
                hasNewContent = true;
              }
            }
          });
        }
      });

      if (hasNewContent && !this.isProcessing) {
        console.log('🔄 New content detected, refreshing translations...');
        setTimeout(() => this.refreshTranslations(), 100);
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    // Handle SPA navigation
    let lastUrl = location.href;
    const handleNavigation = () => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(() => this.refreshTranslations(), 100);
      }
    };

    window.addEventListener('popstate', handleNavigation);
    
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleNavigation, 100);
    };
  }

  private async refreshTranslations(): Promise<void> {
    if (this.isProcessing) return;
    
    this.scanTranslatableElements();
    if (this.currentLanguage !== 'en') {
      await this.applyTranslations(this.currentLanguage);
    }
  }

  // Public API methods
  public async switchToLanguage(languageCode: string): Promise<void> {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!language) return;

    console.log(`🌍 Switching to: ${language.native} (${languageCode})`);

    this.currentLanguage = languageCode;
    localStorage.setItem('preferred-language', languageCode);

    // Update URL and reload the page to ensure clean state
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath = language.path + cleanPath;
    
    if (newPath !== currentPath) {
      window.location.href = newPath || '/';
      return;
    }

    // Apply translations for current page if URL doesn't change
    if (languageCode === 'en') {
      this.restoreEnglishContent();
    } else {
      await this.applyTranslations(languageCode);
    }

    // Update document language
    document.documentElement.lang = languageCode;

    // Dispatch event
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));

    console.log(`✅ Language switched to ${language.native}`);
  }

  private updateURL(path: string): void {
    if (typeof window === 'undefined') return;
    
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath = path + cleanPath;
    
    if (newPath !== currentPath) {
      window.history.pushState({}, '', newPath || '/');
    }
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  public isLanguageSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }

  public getTranslationStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    SUPPORTED_LANGUAGES.forEach(lang => {
      stats[lang.code] = this.translations.get(lang.code)?.size || 0;
    });
    return stats;
  }
}

// Export singleton instance
export const unifiedTranslationSystem = UnifiedTranslationSystem.getInstance();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      unifiedTranslationSystem.initialize();
    });
  } else {
    unifiedTranslationSystem.initialize();
  }
}