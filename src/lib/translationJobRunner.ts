// Translation Job Runner - Complete all missing translations
// Extracts content from all pages and runs batch translation

import { supabase } from '@/integrations/supabase/client';

interface PageContent {
  path: string;
  title: string;
  content: string[];
}

// Define all website pages and their key content
const websitePages: PageContent[] = [
  {
    path: '/',
    title: 'Home Page',
    content: [
      'Your ATM - Your Income',
      'Start your own ATM franchise business with minimal investment and maximum returns',
      'Partner with RBI licensed operators across India',
      'Submit ATM Location',
      'Become Franchise',
      'Monthly Income',
      'Investment Required',
      'Success Rate',
      'Why Choose ATM Franchise India?',
      'Proven Business Model',
      'Expert Guidance',
      'Nationwide Support',
      'Quick ROI',
    ]
  },
  {
    path: '/become-franchise',
    title: 'Become Franchise',
    content: [
      'Become an ATM Partner',
      'Join 200+ successful partners',
      'profitable ATM business',
      'minimal investment',
      'Apply Now',
      'Simple 4-Step Process',
      'Apply',
      'Submit your franchise application online',
      'Agreement',
      'Complete documentation and sign agreement',
      'Installation',
      'We handle ATM setup and installation',
      'Start Earning',
      'Begin generating monthly passive income',
    ]
  },
  {
    path: '/contact-us',
    title: 'Contact Us',
    content: [
      'Get in Touch',
      'Contact our expert team for ATM franchise guidance',
      'Business Hours',
      'Monday to Saturday',
      'Response Time',
      'Within 24 hours',
      'Expert Consultation',
      'Free business guidance',
      'Send Message',
      'Your Message',
      'How can we help you?',
    ]
  },
  {
    path: '/our-products',
    title: 'Our Products',
    content: [
      'Our ATM Solutions',
      'Comprehensive ATM franchise products and services',
      'Brown Label ATM',
      'Complete ATM management solution',
      'White Label ATM',
      'Own your ATM network',
      'Cash Management',
      'Professional cash handling services',
      'Technical Support',
      '24/7 technical assistance',
      'Business Support',
      'Ongoing business guidance',
    ]
  },
  {
    path: '/submit-location',
    title: 'Submit ATM Location',
    content: [
      'Submit Your ATM Location',
      'Suggest the perfect location for ATM installation',
      'Location Requirements',
      'High footfall area preferred',
      'Site Evaluation',
      'Professional site assessment',
      'Quick Approval',
      'Fast approval process',
      'Location Type',
      'Commercial',
      'Residential',
      'Mixed Use',
      'Submit Location Details',
    ]
  },
  {
    path: '/join-us',
    title: 'Join Us',
    content: [
      'Join Our Team',
      'Career opportunities in ATM franchise industry',
      'Sales Agent',
      'Field sales opportunities',
      'Business Development',
      'Grow franchise network',
      'Technical Support',
      'ATM technical assistance',
      'Customer Service',
      'Client relationship management',
    ]
  },
  {
    path: '/about-us',
    title: 'About Us',
    content: [
      'About ATM Franchise India',
      'Leading ATM franchise consultancy with 5+ years experience',
      'Our Mission',
      'Empowering entrepreneurs through ATM business',
      'Our Vision',
      'ATM accessibility across India',
      'Why Trust Us',
      '200+ successful partnerships',
      '95% success rate',
      'Expert guidance',
      'Proven track record',
    ]
  }
];

export class TranslationJobRunner {
  private static instance: TranslationJobRunner;
  
  public static getInstance(): TranslationJobRunner {
    if (!TranslationJobRunner.instance) {
      TranslationJobRunner.instance = new TranslationJobRunner();
    }
    return TranslationJobRunner.instance;
  }

  // Extract all unique content that needs translation
  private extractUniqueContent(): string[] {
    const allContent = new Set<string>();
    
    websitePages.forEach(page => {
      allContent.add(page.title);
      page.content.forEach(text => {
        if (text.trim().length > 2) {
          allContent.add(text.trim());
        }
      });
    });

    return Array.from(allContent);
  }

  // Check what translations are missing for each language
  public async getMissingTranslations(): Promise<{ [language: string]: string[] }> {
    const allContent = this.extractUniqueContent();
    const missingTranslations: { [language: string]: string[] } = {};
    
    const languages = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
    
    for (const lang of languages) {
      console.log(`🔍 Checking missing translations for ${lang}...`);
      
      const { data: existingTranslations } = await supabase
        .from('website_translations')
        .select('original_text')
        .eq('language_code', lang);
      
      const existing = new Set(existingTranslations?.map(t => t.original_text) || []);
      const missing = allContent.filter(text => !existing.has(text));
      
      if (missing.length > 0) {
        missingTranslations[lang] = missing;
      }
      
      console.log(`📊 ${lang}: ${missing.length} missing, ${existing.size} existing`);
    }
    
    return missingTranslations;
  }

  // Run complete translation job for all missing content
  public async runCompleteTranslationJob(): Promise<{
    success: boolean;
    totalTranslated: number;
    languageStats: { [language: string]: number };
    errors: string[];
  }> {
    console.log('🚀 Starting complete translation job...');
    
    const missingTranslations = await this.getMissingTranslations();
    const languageStats: { [language: string]: number } = {};
    const errors: string[] = [];
    let totalTranslated = 0;

    // Prepare content for batch translation
    const websiteContent = websitePages.map(page => ({
      path: page.path,
      title: page.title,
      content_items: page.content.map((text, index) => ({
        id: `${page.path}_${index}`,
        text: text.trim(),
        type: index === 0 ? 'title' : 'content'
      }))
    }));

    try {
      console.log('📤 Calling batch-translate function...');
      
      const { data, error } = await supabase.functions.invoke('batch-translate', {
        body: { 
          action: 'batch_translate',
          pages: websiteContent 
        }
      });

      if (error) {
        console.error('❌ Batch translate error:', error);
        errors.push(`Batch translation failed: ${error.message}`);
        return {
          success: false,
          totalTranslated: 0,
          languageStats: {},
          errors
        };
      }

      console.log('✅ Batch translation completed successfully');
      console.log('📊 Translation stats:', data?.stats);

      // Calculate stats
      if (data?.stats) {
        totalTranslated = data.stats.totalTranslations || 0;
        
        // Estimate translations per language
        const languages = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
        const avgPerLanguage = Math.floor(totalTranslated / languages.length);
        languages.forEach(lang => {
          languageStats[lang] = avgPerLanguage;
        });
      }

      return {
        success: true,
        totalTranslated,
        languageStats,
        errors
      };

    } catch (error) {
      console.error('❌ Translation job failed:', error);
      errors.push(`Job execution failed: ${error}`);
      
      return {
        success: false,
        totalTranslated: 0,
        languageStats: {},
        errors
      };
    }
  }

  // Get translation statistics
  public async getTranslationStats(): Promise<{
    totalPages: number;
    totalLanguages: number;
    translationsPerLanguage: { [language: string]: number };
    completionPercentage: { [language: string]: number };
  }> {
    const { data: languageCounts } = await supabase
      .from('website_translations')
      .select('language_code')
      .then(result => ({
        data: result.data?.reduce((acc: any, row: any) => {
          acc[row.language_code] = (acc[row.language_code] || 0) + 1;
          return acc;
        }, {})
      }));

    const { data: totalPages } = await supabase
      .from('website_translations')
      .select('page_path')
      .then(result => ({
        data: new Set(result.data?.map((row: any) => row.page_path)).size
      }));

    const allContent = this.extractUniqueContent();
    const maxPossiblePerLanguage = allContent.length;

    const completionPercentage: { [language: string]: number } = {};
    Object.entries(languageCounts || {}).forEach(([lang, count]) => {
      completionPercentage[lang] = Math.round((count as number / maxPossiblePerLanguage) * 100);
    });

    return {
      totalPages: totalPages || 0,
      totalLanguages: Object.keys(languageCounts || {}).length,
      translationsPerLanguage: languageCounts || {},
      completionPercentage
    };
  }
}

// Export singleton instance
export const translationJobRunner = TranslationJobRunner.getInstance();