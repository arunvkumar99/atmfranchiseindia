import { supabase } from '@/integrations/supabase/client';

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

class MultiLanguageSystem {
  private currentLanguage: string = 'en';
  private translations: Map<string, Map<string, string>> = new Map();
  private originalContent: Map<Element, string> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.currentLanguage = this.getStoredLanguage();
    this.initializeSystem();
  }

  private getStoredLanguage(): string {
    return localStorage.getItem('preferred-language') || 'en';
  }

  private setStoredLanguage(languageCode: string): void {
    localStorage.setItem('preferred-language', languageCode);
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  async initializeSystem(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Initializing Multi-Language System...');
      
      // Load all translations from database
      await this.loadAllTranslations();
      
      // Mark translatable elements and store original content
      this.markTranslatableElements();
      
      // If not English, apply translations immediately
      if (this.currentLanguage !== 'en') {
        await this.applyTranslations(this.currentLanguage);
      }
      
      this.isInitialized = true;
      console.log(`✅ Multi-Language System initialized for ${this.currentLanguage}`);
    } catch (error) {
      console.error('❌ Failed to initialize Multi-Language System:', error);
    }
  }

  private async loadAllTranslations(): Promise<void> {
    try {
      const { data: translations } = await supabase
        .from('website_translations')
        .select('*')
        .eq('page_path', window.location.pathname);

      if (translations) {
        translations.forEach(translation => {
          const langMap = this.translations.get(translation.language_code) || new Map();
          langMap.set(translation.original_text, translation.translated_text);
          this.translations.set(translation.language_code, langMap);
        });
        
        console.log(`📚 Loaded translations for ${this.translations.size} languages`);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    }
  }

  private markTranslatableElements(): void {
    // Store original content and mark elements
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p',
      'span:not([class*="icon"]):not([class*="lucide"]):not([class*="svg"])',
      'button',
      'a',
      'label',
      'li',
      '[data-translatable]'
    ];

    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        const text = element.textContent?.trim();
        
        if (text && 
            text.length > 1 && 
            !element.closest('[data-no-translate]') &&
            !element.hasAttribute('data-original-stored') &&
            !this.isNonTranslatableContent(text)) {
          
          // Store original content
          this.originalContent.set(element, text);
          element.setAttribute('data-original-stored', 'true');
          element.setAttribute('data-translatable', 'true');
        }
      });
    });
  }

  private isNonTranslatableContent(text: string): boolean {
    // Skip numbers, emails, URLs, single characters, etc.
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

  async switchToLanguage(languageCode: string): Promise<void> {
    if (languageCode === this.currentLanguage) return;

    try {
      this.currentLanguage = languageCode;
      this.setStoredLanguage(languageCode);

      if (languageCode === 'en') {
        this.restoreOriginalContent();
      } else {
        await this.applyTranslations(languageCode);
      }

      console.log(`🌍 Switched to language: ${languageCode}`);
    } catch (error) {
      console.error(`❌ Failed to switch to language ${languageCode}:`, error);
    }
  }

  private async applyTranslations(languageCode: string): Promise<void> {
    const langTranslations = this.translations.get(languageCode);
    
    if (!langTranslations || langTranslations.size === 0) {
      console.warn(`⚠️ No translations found for ${languageCode}, triggering batch translation`);
      await this.triggerBatchTranslation();
      return;
    }

    // Apply translations to all marked elements
    this.originalContent.forEach((originalText, element) => {
      const translation = langTranslations.get(originalText);
      if (translation && translation !== originalText) {
        element.textContent = translation;
      }
    });
    
    console.log(`✅ Applied ${langTranslations.size} translations for ${languageCode}`);
  }

  private restoreOriginalContent(): void {
    this.originalContent.forEach((originalText, element) => {
      element.textContent = originalText;
    });
    console.log('✅ Restored original English content');
  }

  private async triggerBatchTranslation(): Promise<void> {
    try {
      console.log('🔄 Triggering batch translation for missing content...');
      
      const response = await supabase.functions.invoke('batch-translate', {
        body: { 
          path: window.location.pathname,
          trigger: 'missing_translations'
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      // Reload translations after batch processing
      await this.loadAllTranslations();
      
      // Try applying translations again
      await this.applyTranslations(this.currentLanguage);
      
      console.log('✅ Batch translation completed');
    } catch (error) {
      console.error('❌ Batch translation failed:', error);
    }
  }

  // Method to refresh translations when new content is added
  async refreshTranslations(): Promise<void> {
    this.markTranslatableElements();
    if (this.currentLanguage !== 'en') {
      await this.applyTranslations(this.currentLanguage);
    }
  }

  // Method to manually trigger full website translation
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
      await this.loadAllTranslations();
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

// Export singleton instance
export const multiLanguageSystem = new MultiLanguageSystem();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      multiLanguageSystem.initializeSystem();
    });
  } else {
    multiLanguageSystem.initializeSystem();
  }

  // Re-initialize when page changes (for SPAs)
  let currentPath = window.location.pathname;
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== currentPath) {
      currentPath = window.location.pathname;
      setTimeout(() => multiLanguageSystem.refreshTranslations(), 100);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}