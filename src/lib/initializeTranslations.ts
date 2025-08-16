// Complete Translation Initialization
// Runs once to populate all missing translations using TMS

import { completeTMS } from './completeTMS';
import { supabase } from '@/integrations/supabase/client';

export async function initializeCompleteTranslations(): Promise<{
  success: boolean;
  message: string;
  stats: any;
}> {
  console.log('🚀 Starting Complete Translation Initialization...');
  
  try {
    // Step 1: Ensure all translations are complete
    const completionResult = await completeTMS.ensureAllTranslationsComplete();
    
    if (!completionResult.success) {
      return {
        success: false,
        message: 'Failed to complete translations',
        stats: completionResult.stats
      };
    }

    // Step 2: Trigger batch translation for remaining items
    const { data, error } = await supabase.functions.invoke('batch-translate', {
      body: {
        action: 'complete_all_translations',
        force_update: true
      }
    });

    if (error) {
      console.error('❌ Batch translation failed:', error);
    } else if (data?.success) {
      console.log(`✅ Batch translation completed: ${data.stats?.totalTranslations} translations`);
    }

    return {
      success: true,
      message: `Translation system initialized successfully! ${completionResult.stats.totalTranslated} translations completed across ${completionResult.stats.languages} languages.`,
      stats: {
        ...completionResult.stats,
        batchTranslations: data?.stats?.totalTranslations || 0
      }
    };

  } catch (error) {
    console.error('❌ Translation initialization failed:', error);
    return {
      success: false,
      message: `Translation initialization failed: ${error}`,
      stats: { totalTranslated: 0, languages: 0, errors: [String(error)] }
    };
  }
}

// Auto-initialization disabled to prevent API calls and conflicts
// To manually run: initializeCompleteTranslations()