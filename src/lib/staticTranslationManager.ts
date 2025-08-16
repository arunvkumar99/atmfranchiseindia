// Static Translation Content Manager - DISABLED to prevent API loops
// Manages and updates static translations from website content changes

import { staticTranslations, getStaticTranslation } from './staticTranslations';
import { supabase } from '@/integrations/supabase/client';

interface ContentChange {
  oldText: string;
  newText: string;
  location: string;
  timestamp: Date;
}

interface TranslationUpdate {
  text: string;
  translations: { [languageCode: string]: string };
  lastUpdated: Date;
}

export class StaticTranslationManager {
  private static instance: StaticTranslationManager;
  private contentChecksum: string = '';
  private lastContentCheck: Date = new Date();

  public static getInstance(): StaticTranslationManager {
    if (!StaticTranslationManager.instance) {
      StaticTranslationManager.instance = new StaticTranslationManager();
    }
    return StaticTranslationManager.instance;
  }

  // Extract all translatable text from current DOM
  private extractCurrentContent(): Set<string> {
    const translatableContent = new Set<string>();
    
    // Define selectors for translatable content
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

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (element.closest('[data-no-translate]')) return;
        
        // Extract text content
        const text = element.textContent?.trim();
        if (text && text.length > 2 && !this.isNonTranslatableContent(text)) {
          translatableContent.add(text);
        }
        
        // Extract attributes
        ['placeholder', 'title', 'alt'].forEach(attr => {
          const value = element.getAttribute(attr);
          if (value && value.length > 2 && !this.isNonTranslatableContent(value)) {
            translatableContent.add(value);
          }
        });
      });
    });

    return translatableContent;
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
      /^[0-9+()-\s]+$/,           // Phone numbers
      /^₹[\d,]+$/,                // Currency amounts
      /^\d+%$/,                   // Percentages
      /^\d+-\d+$/,                // Number ranges
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  // Generate content checksum for change detection
  private generateContentChecksum(content: Set<string>): string {
    const sortedContent = Array.from(content).sort().join('|');
    // Fix: Use TextEncoder for Unicode-safe encoding instead of btoa
    const encoder = new TextEncoder();
    const data = encoder.encode(sortedContent);
    return Array.from(data).slice(0, 32).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Check what translations are missing from static translations
  public getMissingStaticTranslations(): {
    [languageCode: string]: string[]
  } {
    const currentContent = this.extractCurrentContent();
    const missingTranslations: { [languageCode: string]: string[] } = {};
    
    const languages = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
    
    languages.forEach(lang => {
      const missing: string[] = [];
      
      currentContent.forEach(text => {
        if (!staticTranslations[text] || !staticTranslations[text][lang]) {
          missing.push(text);
        }
      });
      
      if (missing.length > 0) {
        missingTranslations[lang] = missing;
      }
    });

    return missingTranslations;
  }

  // Detect content changes since last check
  public detectContentChanges(): {
    hasChanges: boolean;
    newContent: string[];
    totalContent: number;
    checksum: string;
  } {
    const currentContent = this.extractCurrentContent();
    const newChecksum = this.generateContentChecksum(currentContent);
    
    const hasChanges = newChecksum !== this.contentChecksum;
    const newContent = hasChanges ? Array.from(currentContent) : [];
    
    // Update stored checksum
    this.contentChecksum = newChecksum;
    this.lastContentCheck = new Date();
    
    return {
      hasChanges,
      newContent,
      totalContent: currentContent.size,
      checksum: newChecksum
    };
  }

  // Update static translations via API translation
  public async updateMissingTranslations(): Promise<{
    success: boolean;
    translatedCount: number;
    errors: string[];
  }> {
    console.log('🔍 Checking for missing static translations...');
    
    const missingTranslations = this.getMissingStaticTranslations();
    const errors: string[] = [];
    let translatedCount = 0;

    // Check if we have missing translations
    const totalMissing = Object.values(missingTranslations).reduce((sum, arr) => sum + arr.length, 0);
    
    if (totalMissing === 0) {
      console.log('✅ All static translations are up to date!');
      return { success: true, translatedCount: 0, errors: [] };
    }

    console.log(`📊 Found ${totalMissing} missing translations across languages`);

    try {
      // For each language with missing translations
      for (const [languageCode, missingTexts] of Object.entries(missingTranslations)) {
        console.log(`🌍 Translating ${missingTexts.length} texts to ${languageCode}...`);
        
        for (const text of missingTexts) {
          try {
            // Call our translation API
            const { data, error } = await supabase.functions.invoke('translate', {
              body: {
                text,
                from: 'en',
                to: languageCode
              }
            });

            if (error) {
              console.error(`❌ Translation API error for "${text}" to ${languageCode}:`, error);
              errors.push(`Failed to translate "${text}" to ${languageCode}: ${error.message}`);
              continue;
            }

            if (data?.translatedText && data.translatedText !== text) {
              // Store translation in database for static updates
              await supabase
                .from('website_translations')
                .upsert({
                  page_path: 'static-content',
                  content_key: text,
                  original_text: text,
                  translated_text: data.translatedText,
                  language_code: languageCode,
                  content_type: 'static'
                });

              translatedCount++;
              console.log(`✅ Translated "${text}" to ${languageCode}: "${data.translatedText}"`);
            }

            // Rate limiting delay
            await new Promise(resolve => setTimeout(resolve, 100));

          } catch (error) {
            console.error(`❌ Error translating "${text}" to ${languageCode}:`, error);
            errors.push(`Error translating "${text}" to ${languageCode}: ${error}`);
          }
        }
      }

      console.log(`🎉 Translation update complete! Translated ${translatedCount} items`);
      
      return {
        success: true,
        translatedCount,
        errors
      };

    } catch (error) {
      console.error('❌ Translation update failed:', error);
      return {
        success: false,
        translatedCount,
        errors: [...errors, `Translation update failed: ${error}`]
      };
    }
  }

  // Get translation statistics
  public getTranslationStats(): {
    totalContent: number;
    staticlyCovered: number;
    coveragePercentage: number;
    missingByLanguage: { [languageCode: string]: number };
    lastCheck: Date;
  } {
    const currentContent = this.extractCurrentContent();
    const missing = this.getMissingStaticTranslations();
    
    let staticlyCovered = 0;
    currentContent.forEach(text => {
      if (staticTranslations[text]) {
        staticlyCovered++;
      }
    });

    const missingByLanguage: { [languageCode: string]: number } = {};
    Object.entries(missing).forEach(([lang, texts]) => {
      missingByLanguage[lang] = texts.length;
    });

    return {
      totalContent: currentContent.size,
      staticlyCovered,
      coveragePercentage: Math.round((staticlyCovered / currentContent.size) * 100),
      missingByLanguage,
      lastCheck: this.lastContentCheck
    };
  }

  // Auto-run content check and update when page content changes
  public async autoUpdateOnContentChange(): Promise<void> {
    const changes = this.detectContentChanges();
    
    if (changes.hasChanges) {
      console.log(`🔄 Content changes detected! ${changes.totalContent} total translatable items`);
      console.log(`📋 Checksum: ${changes.checksum}`);
      
      // Only update translations if there are significant changes
      if (changes.newContent.length > 0) {
        console.log('🚀 Starting translation update for new content...');
        await this.updateMissingTranslations();
      }
    }
  }

  // Manual trigger for translation updates
  public async runFullTranslationUpdate(): Promise<{
    success: boolean;
    translatedCount: number;
    errors: string[];
    stats: ReturnType<typeof this.getTranslationStats>;
  }> {
    console.log('🚀 Running full static translation update...');
    
    const result = await this.updateMissingTranslations();
    const stats = this.getTranslationStats();
    
    return {
      ...result,
      stats
    };
  }
}

// Export singleton instance
export const staticTranslationManager = StaticTranslationManager.getInstance();

// Auto-initialize content monitoring - DISABLED to prevent infinite loops
if (typeof window !== 'undefined') {
  console.log('🚫 Static translation auto-monitoring disabled to prevent API loops');
  // TODO: Re-enable once translation API rate limiting is fully resolved
  /*
  // Monitor for content changes every 30 seconds
  setInterval(() => {
    staticTranslationManager.autoUpdateOnContentChange();
  }, 30000);

  // Initial check after page load
  setTimeout(() => {
    staticTranslationManager.autoUpdateOnContentChange();
  }, 5000);
  */
}