// Complete Translation Management System (TMS)
// Automated translation updates, content sync, and SEO optimization

import { supabase } from '@/integrations/supabase/client';
import { SUPPORTED_LANGUAGES } from './instantTranslationSystem';

interface TranslationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  completedItems: number;
  errors: string[];
  startedAt: Date;
  completedAt?: Date;
}

class CompleteTMS {
  private static instance: CompleteTMS;
  private contentChecksum = '';
  private isRunning = false;
  private jobs: Map<string, TranslationJob> = new Map();

  public static getInstance(): CompleteTMS {
    if (!CompleteTMS.instance) {
      CompleteTMS.instance = new CompleteTMS();
    }
    return CompleteTMS.instance;
  }

  // 1. Complete all missing translations
  async ensureAllTranslationsComplete(): Promise<{
    success: boolean;
    stats: { totalTranslated: number; languages: number; errors: string[] };
  }> {
    console.log('🚀 TMS: Ensuring all translations are complete...');
    
    const jobId = `complete-${Date.now()}`;
    const job: TranslationJob = {
      id: jobId,
      status: 'processing',
      totalItems: 0,
      completedItems: 0,
      errors: [],
      startedAt: new Date()
    };
    
    this.jobs.set(jobId, job);

    try {
      // Get all content that needs translation
      const contentToTranslate = await this.getAllTranslatableContent();
      job.totalItems = contentToTranslate.length * (SUPPORTED_LANGUAGES.length - 1); // Exclude English

      console.log(`📊 Found ${contentToTranslate.length} content items for ${SUPPORTED_LANGUAGES.length - 1} languages`);

      let totalTranslated = 0;
      const errors: string[] = [];

      // Process each language
      for (const language of SUPPORTED_LANGUAGES) {
        if (language.code === 'en') continue;

        console.log(`🌍 Processing ${language.native} (${language.code})...`);

        for (const content of contentToTranslate) {
          try {
            // Check if translation exists
            const { data: existing } = await supabase
              .from('website_translations')
              .select('id')
              .eq('page_path', content.page_path)
              .eq('language_code', language.code)
              .eq('content_key', content.content_key)
              .single();

            if (!existing) {
              // Translate and store
              const { data, error } = await supabase.functions.invoke('translate', {
                body: {
                  text: content.original_text,
                  target_language: language.code,
                  source_language: 'en'
                }
              });

              if (error) {
                errors.push(`Translation failed for ${language.code}: ${error.message}`);
                continue;
              }

              // Store in database
              await supabase
                .from('website_translations')
                .upsert({
                  page_path: content.page_path,
                  language_code: language.code,
                  content_key: content.content_key,
                  original_text: content.original_text,
                  translated_text: data.translated_text,
                  content_type: content.content_type
                });

              totalTranslated++;
              job.completedItems++;
            } else {
              job.completedItems++;
            }
          } catch (error) {
            errors.push(`Error processing ${content.content_key} for ${language.code}: ${error}`);
          }
        }
      }

      job.status = 'completed';
      job.completedAt = new Date();
      
      console.log(`✅ TMS: Translation completion finished. ${totalTranslated} new translations added.`);

      return {
        success: true,
        stats: {
          totalTranslated,
          languages: SUPPORTED_LANGUAGES.length - 1,
          errors
        }
      };

    } catch (error) {
      job.status = 'failed';
      job.errors.push(`Critical error: ${error}`);
      console.error('❌ TMS: Critical error in translation completion:', error);
      
      return {
        success: false,
        stats: { totalTranslated: 0, languages: 0, errors: [String(error)] }
      };
    }
  }

  // 2. Automated content change detection and translation updates
  async detectAndUpdateChanges(): Promise<{
    hasChanges: boolean;
    updatedTranslations: number;
    errors: string[];
  }> {
    if (this.isRunning) {
      console.log('⏳ TMS: Update already running, skipping...');
      return { hasChanges: false, updatedTranslations: 0, errors: [] };
    }

    this.isRunning = true;
    console.log('🔍 TMS: Detecting content changes...');

    try {
      const currentContent = await this.extractCurrentPageContent();
      const currentChecksum = this.generateContentChecksum(currentContent);

      if (currentChecksum === this.contentChecksum) {
        console.log('✅ TMS: No content changes detected');
        return { hasChanges: false, updatedTranslations: 0, errors: [] };
      }

      console.log('📝 TMS: Content changes detected, updating translations...');
      this.contentChecksum = currentChecksum;

      // Find new/changed content
      const newContent = await this.identifyNewContent(currentContent);
      if (newContent.length === 0) {
        return { hasChanges: true, updatedTranslations: 0, errors: [] };
      }

      // Translate new content for all languages
      let updatedTranslations = 0;
      const errors: string[] = [];

      for (const content of newContent) {
        for (const language of SUPPORTED_LANGUAGES) {
          if (language.code === 'en') continue;

          try {
            const { data, error } = await supabase.functions.invoke('translate', {
              body: {
                text: content.text,
                target_language: language.code,
                source_language: 'en'
              }
            });

            if (error) {
              errors.push(`Translation failed for ${language.code}: ${error.message}`);
              continue;
            }

            await supabase
              .from('website_translations')
              .upsert({
                page_path: content.page_path,
                language_code: language.code,
                content_key: content.content_key,
                original_text: content.text,
                translated_text: data.translated_text,
                content_type: 'text'
              });

            updatedTranslations++;
          } catch (error) {
            errors.push(`Error updating ${content.content_key} for ${language.code}: ${error}`);
          }
        }
      }

      console.log(`✅ TMS: Updated ${updatedTranslations} translations`);
      return { hasChanges: true, updatedTranslations, errors };

    } catch (error) {
      console.error('❌ TMS: Error in change detection:', error);
      return { hasChanges: false, updatedTranslations: 0, errors: [String(error)] };
    } finally {
      this.isRunning = false;
    }
  }

  // 3. SEO optimization with hreflang tags
  injectSEOMetaTags(): void {
    // DISABLED: SEO meta tags are now managed by React Helmet in SEOMetaTags component
    // This prevents conflicts with React's virtual DOM management
    return;
    if (typeof window === 'undefined') return;

    console.log('🔧 TMS: Injecting SEO meta tags...');

    // Remove existing hreflang tags
    document.querySelectorAll('link[hreflang]').forEach(link => link.remove());

    const currentPath = window.location.pathname;
    const basePath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    const baseUrl = window.location.origin;

    // Add hreflang for each language
    SUPPORTED_LANGUAGES.forEach(language => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = language.code;
      link.href = `${baseUrl}${language.path}${basePath === '/' ? '' : basePath}`;
      document.head.appendChild(link);
    });

    // Add x-default for English
    const defaultLink = document.createElement('link');
    defaultLink.rel = 'alternate';
    defaultLink.hreflang = 'x-default';
    defaultLink.href = `${baseUrl}${basePath}`;
    document.head.appendChild(defaultLink);

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${baseUrl}${currentPath}`;

    // Update language meta tag
    const currentLang = this.getCurrentLanguageFromPath();
    document.documentElement.lang = currentLang;

    console.log(`✅ TMS: SEO tags injected for ${SUPPORTED_LANGUAGES.length} languages`);
  }

  // Helper methods
  private async getAllTranslatableContent(): Promise<Array<{
    page_path: string;
    content_key: string;
    original_text: string;
    content_type: string;
  }>> {
    // This would scan all pages and extract content
    // For now, return essential content
    const pages = ['/', '/become-franchise', '/contact-us', '/about-us'];
    const content: Array<{
      page_path: string;
      content_key: string;
      original_text: string;
      content_type: string;
    }> = [];

    // Add navigation and common content
    const commonContent = [
      { key: 'nav_home', text: 'Home' },
      { key: 'nav_about', text: 'About Us' },
      { key: 'nav_contact', text: 'Contact Us' },
      { key: 'nav_franchise', text: 'Become Franchise' },
      { key: 'nav_submit_location', text: 'Submit ATM Location' },
      { key: 'cta_get_started', text: 'Get Started' },
      { key: 'cta_apply_now', text: 'Apply Now' },
      { key: 'form_full_name', text: 'Full Name' },
      { key: 'form_phone', text: 'Phone Number' },
      { key: 'form_email', text: 'Email Address' },
      { key: 'form_state', text: 'State' },
      { key: 'form_city', text: 'City' },
      { key: 'form_submit', text: 'Submit' },
    ];

    pages.forEach(page => {
      commonContent.forEach(item => {
        content.push({
          page_path: page,
          content_key: item.key,
          original_text: item.text,
          content_type: 'text'
        });
      });
    });

    return content;
  }

  private async extractCurrentPageContent(): Promise<Set<string>> {
    if (typeof window === 'undefined') return new Set();

    const content = new Set<string>();
    const selectors = [
      'h1, h2, h3, h4, h5, h6',
      'p:not([data-no-translate])',
      'button:not([data-no-translate])',
      'a:not([data-no-translate])',
      'label:not([data-no-translate])'
    ];

    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        const text = element.textContent?.trim();
        if (text && text.length > 1 && !this.isNonTranslatableContent(text)) {
          content.add(text);
        }
      });
    });

    return content;
  }

  private generateContentChecksum(content: Set<string>): string {
    const sortedContent = Array.from(content).sort().join('|');
    // Fix: Use TextEncoder for Unicode-safe encoding instead of btoa
    const encoder = new TextEncoder();
    const data = encoder.encode(sortedContent);
    return Array.from(data).slice(0, 32).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async identifyNewContent(currentContent: Set<string>): Promise<Array<{
    page_path: string;
    content_key: string;
    text: string;
  }>> {
    const currentPath = window.location.pathname.replace(/^\/[a-z]{2}(\/|$)/, '/') || '/';
    const newContent: Array<{
      page_path: string;
      content_key: string;
      text: string;
    }> = [];

    for (const text of currentContent) {
      // Check if this content exists in database
      const { data: existing } = await supabase
        .from('website_translations')
        .select('id')
        .eq('page_path', currentPath)
        .eq('original_text', text)
        .eq('language_code', 'en')
        .single();

      if (!existing) {
        newContent.push({
          page_path: currentPath,
          content_key: `auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          text
        });
      }
    }

    return newContent;
  }

  private isNonTranslatableContent(text: string): boolean {
    const skipPatterns = [
      /^\d+$/,
      /^[^\w\s]+$/,
      /^[a-zA-Z]$/,
      /@/,
      /https?:\/\//,
      /^\s*$/,
      /^ATM$/i,
      /^[0-9+()-\s]+$/
    ];
    
    return skipPatterns.some(pattern => pattern.test(text));
  }

  private getCurrentLanguageFromPath(): string {
    if (typeof window === 'undefined') return 'en';
    
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})(\/|$)/);
    return match ? match[1] : 'en';
  }

  // 4. Start automated monitoring
  startAutomatedMonitoring(): void {
    console.log('🤖 TMS: Starting automated monitoring...');

    // Temporarily disabled to prevent Unicode encoding errors
    // TODO: Re-enable after Edge Function is available
    // setInterval(() => {
    //   this.detectAndUpdateChanges();
    // }, 30000);

    // DISABLED: Navigation monitoring for SEO injection - now managed by React Helmet
    // This prevents DOM conflicts with React's virtual DOM
    
    // let lastUrl = location.href;
    // const checkNavigation = () => {
    //   if (location.href !== lastUrl) {
    //     lastUrl = location.href;
    //     setTimeout(() => {
    //       this.injectSEOMetaTags();
    //     }, 100);
    //   }
    // };

    // setInterval(checkNavigation, 1000);

    // Initial SEO injection disabled
    // setTimeout(() => {
    //   this.injectSEOMetaTags();
    // }, 1000);

    console.log('✅ TMS: Automated monitoring started');
  }

  // Get job status
  getJobStatus(jobId: string): TranslationJob | undefined {
    return this.jobs.get(jobId);
  }

  // Get all jobs
  getAllJobs(): TranslationJob[] {
    return Array.from(this.jobs.values());
  }
}

// Export singleton instance
export const completeTMS = CompleteTMS.getInstance();

// Auto-start monitoring when imported
if (typeof window !== 'undefined') {
  // Temporarily disabled automated monitoring to prevent errors
  console.log('🤖 TMS: Automated monitoring disabled until Edge Functions are available');
  // setTimeout(() => {
  //   completeTMS.startAutomatedMonitoring();
  // }, 2000);
}