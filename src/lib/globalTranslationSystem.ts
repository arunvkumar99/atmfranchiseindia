// Global Site-wide Translation System
// Implements persistent translation across all pages with original content restoration

import { supabase } from '@/integrations/supabase/client';

export interface LanguageConfig {
  code: string;
  name: string;
  native: string;
  direction: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', native: 'English', direction: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', direction: 'ltr' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', direction: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', direction: 'ltr' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', direction: 'ltr' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', direction: 'ltr' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', direction: 'ltr' },
  { code: 'ur', name: 'Urdu', native: 'اردو', direction: 'rtl' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', direction: 'ltr' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', direction: 'ltr' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', direction: 'ltr' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', direction: 'ltr' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', direction: 'ltr' }
];

// Pre-translated content cache for instant loading
const BUSINESS_TRANSLATIONS: Record<string, Record<string, string>> = {
  // Navigation & Common Terms
  'ATM Franchise': {
    hi: 'एटीएम फ्रेंचाइजी',
    bn: 'এটিএম ফ্র্যাঞ্চাইজি',
    ta: 'ஏடிஎம் உரிமம்',
    te: 'ఎటిఎం ఫ్రాంచైజీ',
    mr: 'एटीएम फ्रँचायझी',
    gu: 'એટીએમ ફ્રેન્ચાઇઝી',
    ur: 'اے ٹی ایم فرنچائز',
    kn: 'ಎಟಿಎಂ ಫ್ರ್ಯಾಂಚೈಸ್',
    or: 'ଏଟିଏମ ଫ୍ରାଞ୍ଚାଇଜ୍',
    pa: 'ਏਟੀਐਮ ਫ੍ਰੈਂਚਾਇਜ਼ੀ',
    as: 'এটিএম ফ্ৰেঞ্চাইজ',
    ml: 'എടിഎം ഫ്രാഞ്ചൈസ്'
  },
  'Join Us': {
    hi: 'हमसे जुड़ें',
    bn: 'আমাদের সাথে যোগ দিন',
    ta: 'எங்களுடன் சேருங்கள்',
    te: 'మాతో చేరండి',
    mr: 'आमच्याशी सामील व्हा',
    gu: 'અમારી સાથે જોડાઓ',
    ur: 'ہمارے ساتھ شامل ہوں',
    kn: 'ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ',
    or: 'ଆମ ସହିତ ଯୋଗଦାନ କରନ୍ତୁ',
    pa: 'ਸਾਡੇ ਨਾਲ ਜੁੜੋ',
    as: 'আমাৰ লগত যোগদান কৰক',
    ml: 'ഞങ്ങളോടൊപ്പം ചേരുക'
  },
  'Contact Us': {
    hi: 'हमसे संपर्क करें',
    bn: 'আমাদের সাথে যোগাযোগ করুন',
    ta: 'எங்களை தொடர்பு கொள்ளுங்கள்',
    te: 'మమ్మల్ని సంప్రదించండి',
    mr: 'आमच्याशी संपर्क साधा',
    gu: 'અમારો સંપર્ક કરો',
    ur: 'ہم سے رابطہ کریں',
    kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    or: 'ଆମକୁ ଯୋଗାଯୋଗ କରନ୍ତୁ',
    pa: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    as: 'আমাৰ লগত যোগাযোগ কৰক',
    ml: 'ഞങ്ങളെ ബന്ധപ്പെടുക'
  },
  'Business Opportunity': {
    hi: 'व्यापार अवसर',
    bn: 'ব্যবসার সুযোগ',
    ta: 'வணிக வாய்ப்பு',
    te: 'వ్యాపార అవకాశం',
    mr: 'व्यापारिक संधी',
    gu: 'વ્યાપારિક તક',
    ur: 'کاروباری موقع',
    kn: 'ವ್ಯಾಪಾರ ಅವಕಾಶ',
    or: 'ବ୍ୟବସାୟ ସୁଯୋଗ',
    pa: 'ਕਾਰੋਬਾਰੀ ਮੌਕਾ',
    as: 'ব্যৱসায়িক সুযোগ',
    ml: 'ബിസിനസ് അവസരം'
  },
  'Get Started': {
    hi: 'शुरू करें',
    bn: 'শুরু করুন',
    ta: 'தொடங்குங்கள்',
    te: 'ప్రారంభించండి',
    mr: 'सुरुवात करा',
    gu: 'શરૂ કરો',
    ur: 'شروع کریں',
    kn: 'ಪ್ರಾರಂಭಿಸಿ',
    or: 'ଆରମ୍ଭ କରନ୍ତୁ',
    pa: 'ਸ਼ੁਰੂ ਕਰੋ',
    as: 'আৰম্ভ কৰক',
    ml: 'ആരംഭിക്കുക'
  }
};

interface TranslationCache {
  [key: string]: {
    [languageCode: string]: {
      translations: Record<string, string>;
      originalContent: Record<string, string>;
      timestamp: number;
    }
  }
}

class GlobalTranslationSystem {
  private static instance: GlobalTranslationSystem;
  private currentLanguage = 'en';
  private isTranslating = false;
  private cache: TranslationCache = {};
  private originalContentMap = new Map<string, string>();
  private progressCallback?: (progress: number) => void;

  public static getInstance(): GlobalTranslationSystem {
    if (!GlobalTranslationSystem.instance) {
      GlobalTranslationSystem.instance = new GlobalTranslationSystem();
    }
    return GlobalTranslationSystem.instance;
  }

  constructor() {
    this.loadState();
    this.setupPageLoadHandler();
  }

  // Load saved language preference and apply on page load
  private setupPageLoadHandler() {
    if (typeof window !== 'undefined') {
      // Apply saved language on page load
      const savedLanguage = localStorage.getItem('site-language');
      if (savedLanguage && savedLanguage !== 'en') {
        setTimeout(() => this.translateSite(savedLanguage), 500);
      }

      // Handle navigation - apply translation to new content
      let lastUrl = location.href;
      new MutationObserver(() => {
        if (location.href !== lastUrl) {
          lastUrl = location.href;
          if (this.currentLanguage !== 'en') {
            setTimeout(() => this.translateNewContent(), 100);
          }
        }
      }).observe(document, { subtree: true, childList: true });
    }
  }

  // Save/load state to localStorage
  private saveState() {
    try {
      localStorage.setItem('site-language', this.currentLanguage);
      localStorage.setItem('translation-cache', JSON.stringify(this.cache));
    } catch (error) {
      console.warn('Failed to save translation state:', error);
    }
  }

  private loadState() {
    try {
      const savedLanguage = localStorage.getItem('site-language');
      if (savedLanguage) {
        this.currentLanguage = savedLanguage;
      }

      const savedCache = localStorage.getItem('translation-cache');
      if (savedCache) {
        this.cache = JSON.parse(savedCache);
      }
    } catch (error) {
      console.warn('Failed to load translation state:', error);
    }
  }

  // Get current page identifier
  private getPageKey(): string {
    return location.pathname || '/';
  }

  // Store original content before translation
  private storeOriginalContent(textNodes: Text[]) {
    const pageKey = this.getPageKey();
    
    if (!this.cache[pageKey]) {
      this.cache[pageKey] = {};
    }

    if (!this.cache[pageKey]['original']) {
      this.cache[pageKey]['original'] = {
        translations: {},
        originalContent: {},
        timestamp: Date.now()
      };
    }

    textNodes.forEach((node, index) => {
      const nodeKey = `node_${index}`;
      const text = node.textContent?.trim() || '';
      this.cache[pageKey]['original'].originalContent[nodeKey] = text;
      this.originalContentMap.set(`${pageKey}_${nodeKey}`, text);
    });
  }

  // Restore original content
  private restoreOriginalContent(): boolean {
    const pageKey = this.getPageKey();
    const originalData = this.cache[pageKey]?.['original'];
    
    if (!originalData) {
      console.warn('No original content found for page:', pageKey);
      return false;
    }

    const textNodes = this.getTranslatableTextNodes();
    let restored = 0;

    textNodes.forEach((node, index) => {
      const nodeKey = `node_${index}`;
      const originalText = originalData.originalContent[nodeKey];
      
      if (originalText && node.textContent !== originalText) {
        node.textContent = originalText;
        restored++;
      }
    });

    console.log(`✅ Restored ${restored} text nodes to original content`);
    return restored > 0;
  }

  // Get instant translation from business dictionary
  private getInstantTranslation(text: string, targetLang: string): string | null {
    // Exact match
    if (BUSINESS_TRANSLATIONS[text]?.[targetLang]) {
      return BUSINESS_TRANSLATIONS[text][targetLang];
    }

    // Partial match for common phrases
    for (const [key, translations] of Object.entries(BUSINESS_TRANSLATIONS)) {
      if (text.toLowerCase().includes(key.toLowerCase()) && translations[targetLang]) {
        return text.replace(new RegExp(key, 'gi'), translations[targetLang]);
      }
    }

    return null;
  }

  // Translate text using Supabase function
  private async translateText(text: string, targetLang: string): Promise<string> {
    try {
      // Check instant translations first
      const instant = this.getInstantTranslation(text, targetLang);
      if (instant) return instant;

      // Try Supabase function
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

  // Get all translatable text nodes
  private getTranslatableTextNodes(): Text[] {
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

          // Skip translation system elements
          if (parent.id?.includes('translation') || parent.className?.includes('translation')) {
            return NodeFilter.FILTER_REJECT;
          }

          const text = node.textContent?.trim() || '';
          if (text.length < 2 || /^\d+$/.test(text) || /^[^\w\s]+$/.test(text)) {
            return NodeFilter.FILTER_REJECT;
          }

          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    const textNodes: Text[] = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node as Text);
    }
    
    return textNodes;
  }

  // Main site-wide translation method
  public async translateSite(languageCode: string): Promise<void> {
    if (this.isTranslating) {
      console.log('Translation already in progress');
      return;
    }

    if (languageCode === this.currentLanguage) {
      console.log('Already in target language');
      return;
    }

    this.isTranslating = true;
    const language = SUPPORTED_LANGUAGES.find(l => l.code === languageCode);
    
    if (!language) {
      console.error('Unsupported language:', languageCode);
      this.isTranslating = false;
      return;
    }

    try {
      console.log(`🌍 Translating site to: ${language.native}`);
      
      // Update document language attributes
      document.documentElement.lang = languageCode;
      document.documentElement.dir = language.direction;

      // Show progress
      this.showProgress(`Translating to ${language.native}`, 0);

      if (languageCode === 'en') {
        // Restore original content
        const restored = this.restoreOriginalContent();
        if (!restored) {
          // If no cached original content, reload page
          location.reload();
          return;
        }
      } else {
        // Translate to target language
        await this.performTranslation(languageCode, language.native);
      }

      this.currentLanguage = languageCode;
      this.saveState();
      this.hideProgress();
      this.showSuccess(language.native);

    } catch (error) {
      console.error('Translation error:', error);
      this.hideProgress();
      this.showError();
    } finally {
      this.isTranslating = false;
    }
  }

  // Perform the actual translation
  private async performTranslation(languageCode: string, languageName: string) {
    const pageKey = this.getPageKey();
    const textNodes = this.getTranslatableTextNodes();
    
    // Store original content on first translation
    if (!this.cache[pageKey]?.['original']) {
      this.storeOriginalContent(textNodes);
    }

    // Check if we have cached translations for this page
    const cachedTranslations = this.cache[pageKey]?.[languageCode];
    if (cachedTranslations && Date.now() - cachedTranslations.timestamp < 24 * 60 * 60 * 1000) {
      console.log('🎯 Using cached translations');
      this.applyCachedTranslations(textNodes, cachedTranslations.translations);
      return;
    }

    // Translate content
    const batchSize = 5;
    const newTranslations: Record<string, string> = {};

    for (let i = 0; i < textNodes.length; i += batchSize) {
      const batch = textNodes.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (node, batchIndex) => {
        const globalIndex = i + batchIndex;
        const text = node.textContent?.trim() || '';
        const nodeKey = `node_${globalIndex}`;
        
        if (text.length > 1) {
          const translated = await this.translateText(text, languageCode);
          newTranslations[nodeKey] = translated;
          return { node, translated, nodeKey };
        }
        return null;
      });

      const results = await Promise.allSettled(batchPromises);
      
      // Apply translations immediately
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const { node, translated } = result.value;
          if (translated !== node.textContent) {
            node.textContent = translated;
          }
        }
      });

      // Update progress
      const progress = Math.round(((i + batchSize) / textNodes.length) * 100);
      this.updateProgress(Math.min(progress, 100));
    }

    // Cache the translations
    if (!this.cache[pageKey]) {
      this.cache[pageKey] = {};
    }
    
    this.cache[pageKey][languageCode] = {
      translations: newTranslations,
      originalContent: {},
      timestamp: Date.now()
    };

    this.saveState();
  }

  // Apply cached translations to nodes
  private applyCachedTranslations(textNodes: Text[], translations: Record<string, string>) {
    textNodes.forEach((node, index) => {
      const nodeKey = `node_${index}`;
      const translation = translations[nodeKey];
      
      if (translation && node.textContent !== translation) {
        node.textContent = translation;
      }
    });
  }

  // Translate new content (for SPA navigation)
  private async translateNewContent() {
    if (this.currentLanguage === 'en' || this.isTranslating) return;

    const newNodes = this.getTranslatableTextNodes().filter(node => {
      return !this.originalContentMap.has(`${this.getPageKey()}_node_${Array.from(document.body.querySelectorAll('*')).indexOf(node.parentElement!)}`);
    });

    if (newNodes.length === 0) return;

    console.log(`🔄 Translating ${newNodes.length} new content nodes`);

    for (const node of newNodes) {
      const text = node.textContent?.trim() || '';
      if (text.length > 1) {
        const translated = await this.translateText(text, this.currentLanguage);
        if (translated !== text) {
          node.textContent = translated;
        }
      }
    }
  }

  // UI feedback methods
  private showProgress(message: string, progress: number) {
    this.hideProgress(); // Remove any existing progress

    const progressDiv = document.createElement('div');
    progressDiv.id = 'global-translation-progress';
    progressDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      backdrop-filter: blur(10px);
      min-width: 280px;
      animation: slideInRight 0.3s ease-out;
    `;
    
    progressDiv.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <div style="width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.3); border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <div style="font-weight: 600; font-size: 14px;">${message}</div>
      </div>
      <div style="background: rgba(255,255,255,0.2); height: 4px; border-radius: 2px; overflow: hidden;">
        <div id="translation-progress-bar" style="background: white; height: 100%; width: ${progress}%; transition: width 0.3s ease; border-radius: 2px;"></div>
      </div>
    `;

    // Add CSS for animations
    if (!document.getElementById('translation-animations')) {
      const style = document.createElement('style');
      style.id = 'translation-animations';
      style.textContent = `
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(progressDiv);
  }

  private updateProgress(progress: number) {
    const bar = document.getElementById('translation-progress-bar');
    if (bar) {
      bar.style.width = `${progress}%`;
    }
  }

  private hideProgress() {
    const progress = document.getElementById('global-translation-progress');
    if (progress) {
      progress.remove();
    }
  }

  private showSuccess(languageName: string) {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
        <div style="font-weight: 600;">Site translated to ${languageName}</div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      try {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      } catch (error) {
        console.debug('Notification already removed:', error);
      }
    }, 3000);
  }

  private showError() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #EF4444, #DC2626);
      color: white;
      padding: 16px 24px;
      border-radius: 12px;
      z-index: 10000;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <div style="font-weight: 600;">Translation temporarily unavailable</div>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      try {
        if (notification && notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      } catch (error) {
        console.debug('Error notification already removed:', error);
      }
    }, 3000);
  }

  // Public API methods
  public getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  public getSupportedLanguages(): LanguageConfig[] {
    return SUPPORTED_LANGUAGES;
  }

  public isTranslationInProgress(): boolean {
    return this.isTranslating;
  }

  // Clear cache (for testing/debugging)
  public clearCache() {
    this.cache = {};
    this.originalContentMap.clear();
    localStorage.removeItem('translation-cache');
    localStorage.removeItem('site-language');
  }
}

// Export singleton instance
export const globalTranslationSystem = GlobalTranslationSystem.getInstance();