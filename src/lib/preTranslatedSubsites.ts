import { supabase } from '@/integrations/supabase/client';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', native: 'தমிழ்', flag: '🇮🇳' },
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

interface TranslationCache {
  [languageCode: string]: {
    [originalText: string]: string;
  };
}

class PreTranslatedSubsiteSystem {
  private translationCache: TranslationCache = {};
  private currentLanguage: string = 'en';
  private originalContentMap = new Map<Element, string>();
  private isInitialized = false;
  private preTranslationPromise: Promise<void> | null = null;

  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.initialize();
  }

  private getStoredLanguage(): string {
    return localStorage.getItem('preferred-language') || 'en';
  }

  private setStoredLanguage(language: string): void {
    localStorage.setItem('preferred-language', language);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Pre-Translated Subsite System...');
      
      // Pre-translate all languages once
      if (!this.preTranslationPromise) {
        this.preTranslationPromise = this.preTranslateAllLanguages();
      }
      await this.preTranslationPromise;
      
      // Store original content
      this.storeOriginalContent();
      
      // Apply current language if not English
      if (this.currentLanguage !== 'en') {
        await this.switchToLanguage(this.currentLanguage);
      }
      
      this.isInitialized = true;
      console.log('✅ Pre-Translated Subsite System initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Pre-Translated Subsite System:', error);
    }
  }

  private async preTranslateAllLanguages(): Promise<void> {
    console.log('🚀 Pre-translating all languages for current page');
    
    // Get all translatable content from current page
    const translatableContent = this.extractTranslatableContent();
    
    if (translatableContent.length === 0) {
      console.log('No translatable content found');
      return;
    }

    const currentPath = window.location.pathname;

    // Pre-translate for each language
    for (const language of SUPPORTED_LANGUAGES) {
      if (language.code === 'en') continue;
      
      console.log(`🔄 Pre-translating page for ${language.code}`);
      
      // Check if translations already exist
      const existingTranslations = await this.loadPageTranslations(currentPath, language.code);
      const missingContent = translatableContent.filter(text => !existingTranslations[text]);
      
      if (missingContent.length === 0) {
        console.log('All content already translated');
        this.translationCache[language.code] = existingTranslations;
        continue;
      }

      // Translate missing content
      console.log(`Translating ${missingContent.length} items`);
      const newTranslations = await this.batchTranslate(missingContent, language.code);
      
      // Store in database
      await this.storeTranslations(currentPath, language.code, newTranslations);
      
      // Update cache
      this.translationCache[language.code] = {
        ...existingTranslations,
        ...newTranslations
      };
      
      console.log(`✅ Stored ${Object.keys(newTranslations).length} translations for ${language.code}`);
    }
    
    console.log('✅ Pre-translation complete for all languages');
  }

  private extractTranslatableContent(): string[] {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p',
      'span:not([class*="icon"]):not([class*="lucide"])',
      'button',
      'a',
      'label',
      'li'
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
      /^\s*$/                     // Empty or whitespace
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  private async loadPageTranslations(pagePath: string, languageCode: string): Promise<{[key: string]: string}> {
    try {
      const { data } = await supabase
        .from('website_translations')
        .select('original_text, translated_text')
        .eq('page_path', pagePath)
        .eq('language_code', languageCode);

      const translations: {[key: string]: string} = {};
      data?.forEach(item => {
        translations[item.original_text] = item.translated_text;
      });

      return translations;
    } catch (error) {
      console.error('Error loading translations:', error);
      return {};
    }
  }

  private async batchTranslate(texts: string[], targetLanguage: string): Promise<{[key: string]: string}> {
    try {
      const response = await supabase.functions.invoke('translate', {
        body: {
          texts,
          targetLanguage,
          sourceLanguage: 'en'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      return response.data.translations || {};
    } catch (error) {
      console.error('Batch translation failed:', error);
      return {};
    }
  }

  private async storeTranslations(pagePath: string, languageCode: string, translations: {[key: string]: string}): Promise<void> {
    try {
      const translationEntries = Object.entries(translations).map(([original, translated]) => ({
        page_path: pagePath,
        language_code: languageCode,
        original_text: original,
        translated_text: translated,
        content_key: `${pagePath}_${original}`,
        content_type: 'text'
      }));

      const { error } = await supabase
        .from('website_translations')
        .upsert(translationEntries, {
          onConflict: 'page_path,language_code,original_text'
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error storing translations:', error);
    }
  }

  private storeOriginalContent(): void {
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p',
      'span:not([class*="icon"]):not([class*="lucide"])',
      'button',
      'a',
      'label',
      'li'
    ];

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

    console.log(`🌍 Header: Translating to ${languageCode}`);
    console.log(`🌍 Header: Language change requested: ${languageCode}`);
    
    const targetLanguage = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (targetLanguage) {
      console.log(`🌍 Switching to: ${targetLanguage.native}`);
    }

    this.currentLanguage = languageCode;
    this.setStoredLanguage(languageCode);

    if (languageCode === 'en') {
      this.restoreEnglishContent();
    } else {
      await this.applyTranslations(languageCode);
    }
  }

  private async applyTranslations(languageCode: string): Promise<void> {
    const translations = this.translationCache[languageCode];
    
    if (!translations) {
      console.log('No stored translations found, page needs pre-translation');
      return;
    }

    let appliedCount = 0;
    this.originalContentMap.forEach((originalText, element) => {
      const translation = translations[originalText];
      if (translation && translation !== originalText) {
        element.textContent = translation;
        appliedCount++;
      }
    });

    console.log(`✅ Applied ${appliedCount} stored translations`);
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
      
      // Reload current page translations
      this.translationCache = {};
      await this.preTranslateAllLanguages();
      if (this.currentLanguage !== 'en') {
        await this.applyTranslations(this.currentLanguage);
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Full website translation failed:', error);
      throw error;
    }
  }
}

// Create and export singleton instance
const createPreTranslatedSubsiteSystem = () => new PreTranslatedSubsiteSystem();
export const preTranslatedSubsiteSystem = createPreTranslatedSubsiteSystem();

// Also export the class for type checking
export { PreTranslatedSubsiteSystem };

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      preTranslatedSubsiteSystem.initialize();
    });
  } else {
    preTranslatedSubsiteSystem.initialize();
  }

  // Re-initialize when page changes (for SPAs)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(() => preTranslatedSubsiteSystem.refreshPage(), 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}