// Comprehensive Translation System for ATM Franchise India
// Features: 1. Pre-translated content stored in DB, 2. URL-based language routing, 3. Instant switching

import { supabase } from '@/integrations/supabase/client';

export interface LanguageConfig {
  code: string;
  name: string;
  native: string;
  direction: 'ltr' | 'rtl';
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', native: 'English', direction: 'ltr', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', direction: 'ltr', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', direction: 'ltr', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', direction: 'ltr', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', direction: 'ltr', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', direction: 'ltr', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', direction: 'rtl', flag: '🇵🇰' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', direction: 'ltr', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', direction: 'ltr', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', direction: 'ltr', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', direction: 'ltr', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', direction: 'ltr', flag: '🇮🇳' }
];

interface ContentItem {
  id: string;
  type: 'text' | 'attribute' | 'meta';
  originalText: string;
  selector?: string;
  attribute?: string;
}

interface TranslationEntry {
  contentId: string;
  translatedText: string;
}

class ComprehensiveTranslationSystem {
  private static instance: ComprehensiveTranslationSystem;
  private currentLanguage = 'en';
  private originalContent = new Map<string, ContentItem>();
  private isTranslating = false;
  private translationCache = new Map<string, Map<string, string>>();

  public static getInstance(): ComprehensiveTranslationSystem {
    if (!ComprehensiveTranslationSystem.instance) {
      ComprehensiveTranslationSystem.instance = new ComprehensiveTranslationSystem();
    }
    return ComprehensiveTranslationSystem.instance;
  }

  constructor() {
    this.loadLanguageFromURL();
    this.setupPageObserver();
  }

  // Load language from URL (e.g., /hi/contact-us)
  private loadLanguageFromURL() {
    const path = window.location.pathname;
    const languageMatch = path.match(/^\/([a-z]{2})(\/|$)/);
    
    if (languageMatch) {
      const langCode = languageMatch[1];
      const supportedLang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
      if (supportedLang && langCode !== 'en') {
        this.currentLanguage = langCode;
        // Remove language from URL for internal routing
        const newPath = path.replace(/^\/[a-z]{2}/, '') || '/';
        if (newPath !== path) {
          window.history.replaceState(null, '', newPath);
        }
      }
    }
  }

  // Setup observer for page changes
  private setupPageObserver() {
    let lastUrl = location.href;
    
    const observer = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(() => {
          if (this.currentLanguage !== 'en') {
            this.applyStoredTranslations();
          }
        }, 100);
      }
    });

    observer.observe(document, { subtree: true, childList: true });

    // Apply initial translations if needed
    if (this.currentLanguage !== 'en') {
      setTimeout(() => this.applyStoredTranslations(), 500);
    }
  }

  // Extract all translatable content from current page
  private extractPageContent(): Map<string, ContentItem> {
    const content = new Map<string, ContentItem>();
    let index = 0;

    // Extract text content
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;

          // Skip script, style, and system elements
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'code', 'pre'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          // Skip translation system elements
          if (parent.className?.includes('translation') || 
              parent.id?.includes('translation') ||
              parent.closest('[data-no-translate]')) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.textContent?.trim() || '';
          if (text.length < 3 || /^\d+$/.test(text) || /^[^\w\s]+$/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while (node = walker.nextNode()) {
      const text = node.textContent?.trim() || '';
      if (text) {
        const id = `text_${index++}`;
        content.set(id, {
          id,
          type: 'text',
          originalText: text
        });
      }
    }

    // Extract important attributes (alt, title, placeholder)
    const elements = document.querySelectorAll('[alt], [title], [placeholder], [aria-label]');
    elements.forEach((element, idx) => {
      ['alt', 'title', 'placeholder', 'aria-label'].forEach(attr => {
        const value = element.getAttribute(attr);
        if (value && value.trim().length > 2) {
          const id = `attr_${attr}_${idx}`;
          content.set(id, {
            id,
            type: 'attribute',
            originalText: value,
            selector: this.getElementSelector(element as HTMLElement),
            attribute: attr
          });
        }
      });
    });

    // Extract meta content
    const metaTags = document.querySelectorAll('meta[content]');
    metaTags.forEach((meta, idx) => {
      const content_value = meta.getAttribute('content');
      const name = meta.getAttribute('name') || meta.getAttribute('property');
      if (content_value && name && content_value.length > 5) {
        const id = `meta_${name}_${idx}`;
        content.set(id, {
          id,
          type: 'meta',
          originalText: content_value,
          selector: `meta[name="${name}"], meta[property="${name}"]`,
          attribute: 'content'
        });
      }
    });

    return content;
  }

  // Generate CSS selector for element
  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    
    let selector = element.tagName.toLowerCase();
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c && !c.includes('translation'));
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    return selector;
  }

  // Get stored translations from database
  private async getStoredTranslations(languageCode: string): Promise<Map<string, string>> {
    try {
      const pageKey = window.location.pathname;
      const { data, error } = await supabase
        .from('website_translations')
        .select('content_key, translated_text')
        .eq('page_path', pageKey)
        .eq('language_code', languageCode);

      if (error) throw error;

      const translations = new Map<string, string>();
      data?.forEach(item => {
        translations.set(item.content_key, item.translated_text);
      });

      return translations;
    } catch (error) {
      console.warn('Failed to fetch translations:', error);
      return new Map();
    }
  }

  // Store translations to database
  private async storeTranslations(languageCode: string, translations: TranslationEntry[]): Promise<void> {
    try {
      const pageKey = window.location.pathname;
      const upsertData = translations.map(t => ({
        page_path: pageKey,
        language_code: languageCode,
        content_key: t.contentId,
        original_text: this.originalContent.get(t.contentId)?.originalText || '',
        translated_text: t.translatedText,
        content_type: this.originalContent.get(t.contentId)?.type || 'text'
      }));

      const { error } = await supabase
        .from('website_translations')
        .upsert(upsertData, { 
          onConflict: 'page_path,language_code,content_key' 
        });

      if (error) throw error;
      console.log(`✅ Stored ${translations.length} translations for ${languageCode}`);
    } catch (error) {
      console.error('Failed to store translations:', error);
    }
  }

  // Translate text using Supabase edge function
  private async translateText(text: string, targetLang: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('translate', {
        body: { text, from: 'en', to: targetLang }
      });

      if (error) throw error;
      return data?.translatedText || text;
    } catch (error) {
      console.warn('Translation failed:', error);
      return text;
    }
  }

  // Apply stored translations to current page
  private async applyStoredTranslations(): Promise<void> {
    if (this.currentLanguage === 'en') return;

    const storedTranslations = await this.getStoredTranslations(this.currentLanguage);
    if (storedTranslations.size === 0) {
      console.log('No stored translations found, triggering pre-translation');
      await this.preTranslatePage(this.currentLanguage);
      return;
    }

    // Apply text content translations
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          
          const tagName = parent.tagName.toLowerCase();
          if (['script', 'style', 'noscript', 'code', 'pre'].includes(tagName)) {
            return NodeFilter.FILTER_REJECT;
          }

          if (parent.className?.includes('translation') || 
              parent.id?.includes('translation') ||
              parent.closest('[data-no-translate]')) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.textContent?.trim() || '';
          return text.length >= 3 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let index = 0;
    let applied = 0;
    let node;

    while (node = walker.nextNode()) {
      const key = `text_${index++}`;
      const translation = storedTranslations.get(key);
      
      if (translation && node.textContent !== translation) {
        node.textContent = translation;
        applied++;
      }
    }

    // Apply attribute translations
    storedTranslations.forEach((translation, key) => {
      if (key.startsWith('attr_')) {
        const contentItem = this.originalContent.get(key);
        if (contentItem?.selector && contentItem?.attribute) {
          const elements = document.querySelectorAll(contentItem.selector);
          elements.forEach(element => {
            if (element.getAttribute(contentItem.attribute!) === contentItem.originalText) {
              element.setAttribute(contentItem.attribute!, translation);
              applied++;
            }
          });
        }
      }
    });

    // Apply meta tag translations
    storedTranslations.forEach((translation, key) => {
      if (key.startsWith('meta_')) {
        const contentItem = this.originalContent.get(key);
        if (contentItem?.selector && contentItem?.attribute) {
          const elements = document.querySelectorAll(contentItem.selector);
          elements.forEach(element => {
            if (element.getAttribute(contentItem.attribute!) === contentItem.originalText) {
              element.setAttribute(contentItem.attribute!, translation);
              applied++;
            }
          });
        }
      }
    });

    console.log(`✅ Applied ${applied} stored translations`);
    this.updateDocumentLanguage();
  }

  // Pre-translate entire page
  private async preTranslatePage(languageCode: string): Promise<void> {
    if (this.isTranslating || languageCode === 'en') return;

    this.isTranslating = true;
    console.log(`🔄 Pre-translating page for ${languageCode}`);

    try {
      // Extract content
      const content = this.extractPageContent();
      this.originalContent = content;

      // Get existing translations
      const existingTranslations = await this.getStoredTranslations(languageCode);
      
      // Find content that needs translation
      const needsTranslation: ContentItem[] = [];
      content.forEach((item, id) => {
        if (!existingTranslations.has(id)) {
          needsTranslation.push(item);
        }
      });

      if (needsTranslation.length === 0) {
        console.log('All content already translated');
        this.isTranslating = false;
        return;
      }

      console.log(`Translating ${needsTranslation.length} items`);

      // Translate in batches
      const batchSize = 5;
      const newTranslations: TranslationEntry[] = [];

      for (let i = 0; i < needsTranslation.length; i += batchSize) {
        const batch = needsTranslation.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (item) => {
          const translated = await this.translateText(item.originalText, languageCode);
          return {
            contentId: item.id,
            translatedText: translated
          };
        });

        const results = await Promise.allSettled(batchPromises);
        results.forEach(result => {
          if (result.status === 'fulfilled') {
            newTranslations.push(result.value);
          }
        });
      }

      // Store new translations
      await this.storeTranslations(languageCode, newTranslations);
      
      // Apply translations to page
      await this.applyStoredTranslations();

    } catch (error) {
      console.error('Pre-translation failed:', error);
    } finally {
      this.isTranslating = false;
    }
  }

  // Update document language attributes
  private updateDocumentLanguage(): void {
    const language = SUPPORTED_LANGUAGES.find(l => l.code === this.currentLanguage);
    if (language) {
      document.documentElement.lang = language.code;
      document.documentElement.dir = language.direction;
    }
  }

  // Main method: Switch to language
  public async switchToLanguage(languageCode: string, updateURL: boolean = true): Promise<void> {
    if (this.isTranslating || languageCode === this.currentLanguage) return;

    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    if (!language) return;

    console.log(`🌍 Switching to: ${language.native}`);

    // Update URL if requested
    if (updateURL) {
      const currentPath = window.location.pathname;
      let newPath = currentPath;
      
      // Remove existing language prefix
      newPath = newPath.replace(/^\/[a-z]{2}/, '');
      
      // Add new language prefix (except for English)
      if (languageCode !== 'en') {
        newPath = `/${languageCode}${newPath}`;
      }
      
      if (newPath !== currentPath) {
        window.history.pushState(null, '', newPath);
      }
    }

    this.currentLanguage = languageCode;
    localStorage.setItem('preferred-language', languageCode);

    if (languageCode === 'en') {
      // Restore English content
      window.location.reload(); // Simple approach for English
    } else {
      // Apply translations
      await this.applyStoredTranslations();
    }
  }

  // Get current language
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  // Pre-translate all supported languages for current page
  public async preTranslateAllLanguages(): Promise<void> {
    console.log('🚀 Pre-translating all languages for current page');
    
    for (const language of SUPPORTED_LANGUAGES) {
      if (language.code !== 'en') {
        await this.preTranslatePage(language.code);
      }
    }
    
    console.log('✅ Pre-translation complete for all languages');
  }

  // Check if page has translations for a language
  public async hasTranslations(languageCode: string): Promise<boolean> {
    if (languageCode === 'en') return true;
    
    const translations = await this.getStoredTranslations(languageCode);
    return translations.size > 0;
  }

  // Get language from URL
  public static getLanguageFromURL(): string {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})(\/|$)/);
    
    if (match) {
      const langCode = match[1];
      const supportedLang = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
      return supportedLang ? langCode : 'en';
    }
    
    return 'en';
  }

  // Generate language-specific URLs
  public generateLanguageURL(languageCode: string, path?: string): string {
    const targetPath = path || window.location.pathname;
    let cleanPath = targetPath.replace(/^\/[a-z]{2}/, '');
    
    if (languageCode === 'en') {
      return cleanPath || '/';
    }
    
    return `/${languageCode}${cleanPath}`;
  }
}

// Export singleton instance
export const comprehensiveTranslationSystem = ComprehensiveTranslationSystem.getInstance();

// Auto-initialize content extraction and translation triggers
export const initializeTranslationSystem = () => {
  // Auto-trigger content extraction when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      comprehensiveTranslationSystem.preTranslateAllLanguages();
    });
  } else {
    comprehensiveTranslationSystem.preTranslateAllLanguages();
  }
};