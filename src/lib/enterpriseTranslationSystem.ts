// Enterprise Translation System - Production Grade
// Implements: Caching, Selective Loading, Fallbacks, Performance Optimization

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

interface CachedTranslation {
  text: string;
  timestamp: number;
}

interface PageTranslations {
  [key: string]: CachedTranslation;
}

class EnterpriseTranslationSystem {
  private static instance: EnterpriseTranslationSystem;
  private currentLanguage = 'en';
  private pageTranslations = new Map<string, PageTranslations>();
  private globalTranslations = new Map<string, PageTranslations>();
  private isInitialized = false;
  private isProcessing = false;
  private pendingTranslations = new Set<string>();
  private fallbackTexts = new Map<string, string>();
  
  // Cache TTL: 1 hour
  private readonly CACHE_TTL = 60 * 60 * 1000;
  
  public static getInstance(): EnterpriseTranslationSystem {
    if (!EnterpriseTranslationSystem.instance) {
      EnterpriseTranslationSystem.instance = new EnterpriseTranslationSystem();
    }
    return EnterpriseTranslationSystem.instance;
  }

  constructor() {
    this.loadLanguageFromURL();
    this.loadCachedTranslations();
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
      }
    } else {
      const stored = localStorage.getItem('preferred-language');
      if (stored && SUPPORTED_LANGUAGES.find(l => l.code === stored)) {
        this.currentLanguage = stored;
      }
    }
  }

  private loadCachedTranslations(): void {
    try {
      const cached = localStorage.getItem('translation-cache');
      if (cached) {
        const data = JSON.parse(cached);
        Object.entries(data).forEach(([lang, translations]) => {
          this.pageTranslations.set(lang, translations as PageTranslations);
        });
        console.log('📦 Loaded cached translations');
      }
    } catch (error) {
      console.warn('⚠️ Failed to load translation cache:', error);
    }
  }

  private saveCachedTranslations(): void {
    try {
      const cacheData: { [key: string]: PageTranslations } = {};
      this.pageTranslations.forEach((translations, lang) => {
        cacheData[lang] = translations;
      });
      localStorage.setItem('translation-cache', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('⚠️ Failed to save translation cache:', error);
    }
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      console.log('🚀 Enterprise Translation System initializing...');
      
      // Load only current language translations
      if (this.currentLanguage !== 'en') {
        await this.loadLanguageTranslations(this.currentLanguage);
        await this.applyTranslations();
      }
      
      // Setup real-time translation for missing content
      this.setupContentObserver();
      
      this.isInitialized = true;
      console.log(`✅ Enterprise system ready for ${this.currentLanguage}`);
    } catch (error) {
      console.error('❌ Initialization failed:', error);
    }
  }

  private async loadLanguageTranslations(languageCode: string): Promise<void> {
    try {
      console.log(`📚 Loading ${languageCode} translations...`);
      
      const { data: translations, error } = await supabase
        .from('website_translations')
        .select('original_text, translated_text')
        .eq('language_code', languageCode)
        .not('translated_text', 'is', null)
        .neq('translated_text', '');

      if (error) {
        console.error('Database error:', error);
        return;
      }

      if (translations) {
        const langTranslations: PageTranslations = {};
        const now = Date.now();
        
        translations.forEach(t => {
          if (t.translated_text && 
              t.translated_text !== t.original_text &&
              !this.isLowQualityTranslation(t.original_text, t.translated_text)) {
            langTranslations[t.original_text] = {
              text: t.translated_text,
              timestamp: now
            };
          }
        });
        
        this.pageTranslations.set(languageCode, langTranslations);
        this.saveCachedTranslations();
        
        console.log(`📚 Loaded ${translations.length} translations for ${languageCode}`);
      }
    } catch (error) {
      console.error('❌ Error loading translations:', error);
    }
  }

  private async applyTranslations(): Promise<void> {
    if (this.isProcessing || this.currentLanguage === 'en') return;
    
    this.isProcessing = true;
    
    try {
      const translations = this.pageTranslations.get(this.currentLanguage);
      if (!translations) {
        console.warn(`⚠️ No translations found for ${this.currentLanguage}`);
        this.isProcessing = false;
        return;
      }

      let applied = 0;
      let missing = 0;

      // Target common UI elements first
      const selectors = [
        'nav a', 'nav button', 'nav span',
        'h1, h2, h3, h4, h5, h6',
        'p:not([data-no-translate])',
        'button:not([data-no-translate])',
        'label:not([data-no-translate])',
        'span:not([class*="icon"]):not([data-no-translate])'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((element: Element) => {
          if (element.closest('[data-no-translate]')) return;
          
          const text = element.textContent?.trim();
          if (!text || text.length < 2) return;
          
          if (this.isNonTranslatableContent(text)) return;
          
          const cached = translations[text];
          if (cached && this.isValidCache(cached)) {
            element.textContent = cached.text;
            applied++;
          } else if (!this.pendingTranslations.has(text)) {
            // Store fallback and queue for translation
            this.fallbackTexts.set(text, text);
            this.queueTranslation(text);
            missing++;
          }
        });
      });

      // Handle form placeholders and attributes
      ['placeholder', 'title', 'alt'].forEach(attr => {
        document.querySelectorAll(`[${attr}]`).forEach((element: Element) => {
          if (element.closest('[data-no-translate]')) return;
          
          const value = element.getAttribute(attr);
          if (!value || this.isNonTranslatableContent(value)) return;
          
          const cached = translations[value];
          if (cached && this.isValidCache(cached)) {
            element.setAttribute(attr, cached.text);
            applied++;
          } else if (!this.pendingTranslations.has(value)) {
            this.queueTranslation(value);
            missing++;
          }
        });
      });

      console.log(`✅ Applied ${applied} translations, ${missing} pending`);
      
    } catch (error) {
      console.error('❌ Error applying translations:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  private isValidCache(cached: CachedTranslation): boolean {
    return Date.now() - cached.timestamp < this.CACHE_TTL;
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
      /^\/lovable-uploads/,       // File paths
      /^\${.*}$/,                 // Template strings
      /^React\./,                 // React code
      /^window\./,                // JavaScript references
      /^[അ-ൿ]+$/ // Malayalam characters alone (likely poor translations)
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  private isLowQualityTranslation(original: string, translated: string): boolean {
    // Check if translation is just a repetition of characters
    if (/^(.)\1+$/.test(translated)) return true;
    
    // Check if translation contains repeated words (more than 3 same words)
    const words = translated.split(/\s+/);
    if (words.length > 3) {
      const wordCount: { [key: string]: number } = {};
      words.forEach(word => {
        wordCount[word] = (wordCount[word] || 0) + 1;
      });
      
      // If any word appears more than 3 times, it's likely low quality
      if (Object.values(wordCount).some(count => count > 3)) return true;
    }
    
    // Check if it's mostly the same script as original (poor translation)
    const originalScript = this.detectScript(original);
    const translatedScript = this.detectScript(translated);
    if (originalScript === translatedScript && originalScript !== 'latin') return true;
    
    // Check for repetitive patterns like "চিহ্ন চিহ্ন চিহ্ন"
    if (/(\S+)\s+\1\s+\1/.test(translated)) return true;
    
    return false;
  }

  private detectScript(text: string): string {
    if (/[a-zA-Z]/.test(text)) return 'latin';
    if (/[\u0900-\u097F]/.test(text)) return 'devanagari'; // Hindi
    if (/[\u0980-\u09FF]/.test(text)) return 'bengali';
    if (/[\u0B80-\u0BFF]/.test(text)) return 'tamil';
    if (/[\u0C00-\u0C7F]/.test(text)) return 'telugu';
    if (/[\u0D00-\u0D7F]/.test(text)) return 'malayalam';
    return 'unknown';
  }

  private async queueTranslation(text: string): Promise<void> {
    if (this.pendingTranslations.has(text)) return;
    
    this.pendingTranslations.add(text);
    
    try {
      const { data } = await supabase.functions.invoke('translate', {
        body: {
          text,
          target_language: this.currentLanguage,
          source_language: 'en'
        }
      });

      if (data?.translatedText && 
          data.translatedText.trim() !== '' &&
          data.translatedText !== text &&
          !this.isNonTranslatableContent(data.translatedText) &&
          !this.isLowQualityTranslation(text, data.translatedText)) {
        
        // Update cache
        const translations = this.pageTranslations.get(this.currentLanguage) || {};
        translations[text] = {
          text: data.translatedText,
          timestamp: Date.now()
        };
        this.pageTranslations.set(this.currentLanguage, translations);
        this.saveCachedTranslations();
        
        // Apply immediately
        this.applyInstantTranslation(text, data.translatedText);
        
        // Save to database only if translation is valid
        try {
          await supabase.from('website_translations').upsert({
            page_path: window.location.pathname,
            content_key: text,
            original_text: text,
            translated_text: data.translatedText,
            language_code: this.currentLanguage,
            content_type: 'dynamic'
          });
        } catch (dbError) {
          console.warn('Database save failed, continuing with cache:', dbError);
        }
      }
    } catch (error) {
      console.error('❌ Translation failed:', error);
    } finally {
      this.pendingTranslations.delete(text);
    }
  }

  private applyInstantTranslation(originalText: string, translatedText: string): void {
    // Find and update all elements with this text
    document.querySelectorAll('*').forEach((element: Element) => {
      if (element.closest('[data-no-translate]')) return;
      
      // Text content
      if (element.textContent?.trim() === originalText) {
        element.textContent = translatedText;
      }
      
      // Attributes
      ['placeholder', 'title', 'alt'].forEach(attr => {
        if (element.getAttribute(attr) === originalText) {
          element.setAttribute(attr, translatedText);
        }
      });
    });
  }

  private setupContentObserver(): void {
    if (typeof window === 'undefined') return;

    const observer = new MutationObserver((mutations) => {
      let hasNewContent = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          hasNewContent = true;
        }
      });

      if (hasNewContent && !this.isProcessing) {
        setTimeout(() => this.applyTranslations(), 100);
      }
    });

    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });
  }

  // Public API
  public async switchToLanguage(languageCode: string): Promise<void> {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!language) return;

    console.log(`🌍 Switching to: ${language.native}`);

    this.currentLanguage = languageCode;
    localStorage.setItem('preferred-language', languageCode);

    // Navigate to new URL
    const currentPath = window.location.pathname;
    const cleanPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const newPath = language.path + cleanPath;
    
    if (newPath !== currentPath) {
      window.location.href = newPath || '/';
      return;
    }

    // Apply translations if staying on same page
    if (languageCode !== 'en') {
      await this.loadLanguageTranslations(languageCode);
      await this.applyTranslations();
    }

    document.documentElement.lang = languageCode;
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: languageCode } 
    }));
  }

  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public getSupportedLanguages() {
    return SUPPORTED_LANGUAGES;
  }

  public async triggerBatchCompletion(): Promise<void> {
    try {
      console.log('🔄 Triggering batch translation completion...');
      await supabase.functions.invoke('fix-translation-completion');
      console.log('✅ Batch completion triggered');
    } catch (error) {
      console.error('❌ Batch completion failed:', error);
    }
  }
}

// Export singleton instance
export const enterpriseTranslationSystem = EnterpriseTranslationSystem.getInstance();

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      enterpriseTranslationSystem.initialize();
    });
  } else {
    enterpriseTranslationSystem.initialize();
  }
}