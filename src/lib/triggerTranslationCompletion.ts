import { supabase } from '@/integrations/supabase/client';

export async function triggerCompleteTranslations() {
  try {
    console.log('🚀 Starting FIXED translation completion (resolves duplicate key errors)...');
    console.log('📱 Device info:', {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      mobile: /Mobi|Android/i.test(navigator.userAgent)
    });
    
    const { data, error } = await supabase.functions.invoke('fix-translation-completion', {
      body: { action: 'complete_all_fixed', timestamp: new Date().toISOString() }
    });

    if (error) {
      console.error('❌ Translation completion error:', error);
      throw error;
    }

    console.log('✅ FIXED translation completion response:', data);
    return data;
    
  } catch (error) {
    console.error('❌ Failed to trigger FIXED translation completion:', error);
    throw error;
  }
}

// Auto-trigger disabled to prevent API calls and rate limiting
// To manually trigger: triggerCompleteTranslations()