import { supabase } from '@/integrations/supabase/client';
import { staticTranslations, getStaticTranslation, preloadCriticalTranslations } from './staticTranslations';

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

interface TranslationCache {
  [languageCode: string]: {
    [originalText: string]: string;
  };
}

class RobustTranslationSystem {
  private translationCache: TranslationCache = {};
  private currentLanguage: string = 'en';
  private originalContentMap = new Map<Element, string>();
  private isInitialized = false;
  private translationQueue = new Set<string>();

  constructor() {
    this.currentLanguage = this.getStoredLanguage();
  }

  private getStoredLanguage(): string {
    if (typeof window === 'undefined') return 'en';
    
    // Check URL path first
    const urlLanguage = this.getLanguageFromURL();
    if (urlLanguage) {
      localStorage.setItem('preferred-language', urlLanguage);
      return urlLanguage;
    }
    
    return localStorage.getItem('preferred-language') || 'en';
  }

  private getLanguageFromURL(): string | null {
    if (typeof window === 'undefined') return null;
    
    const path = window.location.pathname;
    const languageMatch = path.match(/^\/([a-z]{2})(\/|$)/);
    
    if (languageMatch) {
      const code = languageMatch[1];
      if (SUPPORTED_LANGUAGES.find(l => l.code === code)) {
        return code;
      }
    }
    
    return null;
  }

  private setStoredLanguage(language: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('preferred-language', language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Robust Translation System...');
      
      // Store original content
      this.storeOriginalContent();
      
      // Load existing translations from database
      await this.loadExistingTranslations();
      
      // Apply current language if not English
      if (this.currentLanguage !== 'en') {
        await this.switchToLanguage(this.currentLanguage);
      }
      
      this.isInitialized = true;
      console.log('✅ Robust Translation System initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Robust Translation System:', error);
    }
  }

  private async loadExistingTranslations(): Promise<void> {
    try {
      const currentPath = window.location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
      
      const { data } = await supabase
        .from('website_translations')
        .select('language_code, original_text, translated_text')
        .eq('page_path', currentPath);

      if (data) {
        data.forEach(item => {
          if (!this.translationCache[item.language_code]) {
            this.translationCache[item.language_code] = {};
          }
          this.translationCache[item.language_code][item.original_text] = item.translated_text;
        });
        console.log(`📚 Loaded existing translations for ${Object.keys(this.translationCache).length} languages`);
      }
    } catch (error) {
      console.error('Error loading existing translations:', error);
    }
  }

  private extractTranslatableContent(): string[] {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p:not([data-no-translate])',
      'span:not([class*="icon"]):not([class*="lucide"]):not([data-no-translate])',
      'button:not([data-no-translate])',
      'a:not([data-no-translate])',
      'label:not([data-no-translate])',
      'li:not([data-no-translate])'
    ];

    const texts = new Set<string>();
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const text = element.textContent?.trim();
        if (text && 
            text.length > 1 && 
            !element.closest('[data-no-translate]') &&
            !this.isNonTranslatableContent(text)) {
          texts.add(text);
        }
      });
    });

    return Array.from(texts);
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
      /^[0-9+()-\s]+$/            // Phone numbers
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  private storeOriginalContent(): void {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p:not([data-no-translate])',
      'span:not([class*="icon"]):not([class*="lucide"]):not([data-no-translate])',
      'button:not([data-no-translate])',
      'a:not([data-no-translate])',
      'label:not([data-no-translate])',
      'li:not([data-no-translate])'
    ];

    this.originalContentMap.clear();
    
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const text = element.textContent?.trim();
        if (text && 
            text.length > 1 && 
            !element.closest('[data-no-translate]') &&
            !this.isNonTranslatableContent(text)) {
          this.originalContentMap.set(element, text);
        }
      });
    });
  }

  async switchToLanguage(languageCode: string): Promise<void> {
    if (languageCode === this.currentLanguage) return;

    console.log(`🌍 Instantly switching to ${languageCode}`);
    
    const targetLanguage = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!targetLanguage) {
      console.error(`Unsupported language: ${languageCode}`);
      return;
    }

    this.currentLanguage = languageCode;
    this.setStoredLanguage(languageCode);

    if (languageCode === 'en') {
      this.restoreEnglishContent();
      this.updateURL('');
    } else {
      // Apply translations immediately using static first, then cached
      this.applyTranslationsInstantly(languageCode);
      this.updateURL(targetLanguage.path);
      
      // Preload critical static translations
      preloadCriticalTranslations(languageCode);
      
      // Load missing translations in background
      this.translateMissingContentBackground(languageCode);
    }

    // Dispatch event for other components to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: languageCode } }));
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

  private applyTranslationsInstantly(languageCode: string): void {
    const translations = this.translationCache[languageCode] || {};
    let appliedCount = 0;

    this.originalContentMap.forEach((originalText, element) => {
      // Try static translation first (fastest)
      let translation = getStaticTranslation(originalText, languageCode);
      
      // Fallback to cached translation
      if (translation === originalText) {
        translation = translations[originalText];
      }
      
      if (translation && translation !== originalText) {
        element.textContent = translation;
        appliedCount++;
      }
    });

    console.log(`⚡ Instantly applied ${appliedCount} translations (static + cached) for ${languageCode}`);
  }

  private async applyTranslations(languageCode: string): Promise<void> {
    // Check if we have cached translations
    if (!this.translationCache[languageCode]) {
      await this.translateMissingContent(languageCode);
    }

    this.applyTranslationsInstantly(languageCode);
  }

  private async translateMissingContentBackground(languageCode: string): Promise<void> {
    // Run in background without blocking UI
    setTimeout(async () => {
      await this.translateMissingContent(languageCode);
      // Re-apply translations after background loading
      this.applyTranslationsInstantly(languageCode);
    }, 100);
  }

  private async translateMissingContent(languageCode: string): Promise<void> {
    const translatableContent = this.extractTranslatableContent();
    const existingTranslations = this.translationCache[languageCode] || {};
    const missingContent = translatableContent.filter(text => !existingTranslations[text]);

    if (missingContent.length === 0) {
      console.log(`No missing translations for ${languageCode}`);
      return;
    }

    console.log(`🔄 Translating ${missingContent.length} missing items for ${languageCode}`);

    try {
      const response = await supabase.functions.invoke('translate', {
        body: {
          texts: missingContent,
          targetLanguage: languageCode,
          sourceLanguage: 'en'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const newTranslations = response.data?.translations || {};
      
      // Store in cache
      if (!this.translationCache[languageCode]) {
        this.translationCache[languageCode] = {};
      }
      Object.assign(this.translationCache[languageCode], newTranslations);

      // Store in database
      await this.storeTranslations(languageCode, newTranslations);

      console.log(`✅ Translated and stored ${Object.keys(newTranslations).length} items`);

    } catch (error) {
      console.error(`Failed to translate content for ${languageCode}:`, error);
    }
  }

  private async storeTranslations(languageCode: string, translations: {[key: string]: string}): Promise<void> {
    try {
      const currentPath = window.location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '/');
      const translationEntries = Object.entries(translations).map(([original, translated]) => ({
        page_path: currentPath,
        language_code: languageCode,
        original_text: original,
        translated_text: translated,
        content_key: `${currentPath}_${languageCode}_${original.slice(0, 50)}`, // Make content_key unique
        content_type: 'text',
        translation_status: 'AI'
      }));

      // Use INSERT with ON CONFLICT to handle duplicates properly
      for (const entry of translationEntries) {
        const { error } = await supabase
          .from('website_translations')
          .upsert(entry, {
            onConflict: 'page_path,language_code,original_text',
            ignoreDuplicates: true
          });

        if (error && !error.message.includes('duplicate')) {
          console.error('Error storing translation:', error);
        }
      }
    } catch (error) {
      console.error('Error storing translations:', error);
    }
  }

  private restoreEnglishContent(): void {
    let restoredCount = 0;
    this.originalContentMap.forEach((originalText, element) => {
      element.textContent = originalText;
      restoredCount++;
    });
    
    console.log(`✅ Restored ${restoredCount} items to English`);
  }

  // Method to refresh when new content is added
  refreshPage(): void {
    this.storeOriginalContent();
    if (this.currentLanguage !== 'en') {
      this.applyTranslations(this.currentLanguage);
    }
  }

  // Method to manually trigger website-wide translation
  async translateWholeWebsite(): Promise<void> {
    try {
      console.log('🌐 Starting full website translation...');
      
      const response = await supabase.functions.invoke('batch-translate', {
        body: { 
          fullWebsite: true,
          trigger: 'manual_full_translation'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      console.log('✅ Full website translation completed!');
      
      // Clear cache and reload
      this.translationCache = {};
      await this.loadExistingTranslations();
      if (this.currentLanguage !== 'en') {
        await this.applyTranslations(this.currentLanguage);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Full website translation failed:', error);
      throw error;
    }
  }

  // Get supported languages for UI
  getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  // Check if language is supported
  isLanguageSupported(code: string): boolean {
    return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
  }
}

// Export singleton instance
export const robustTranslationSystem = new RobustTranslationSystem();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      robustTranslationSystem.initialize();
    });
  } else {
    robustTranslationSystem.initialize();
  }

  // Re-initialize when page changes (for SPAs)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(() => robustTranslationSystem.refreshPage(), 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}