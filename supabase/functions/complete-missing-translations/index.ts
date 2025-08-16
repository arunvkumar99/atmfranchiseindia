import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SUPPORTED_LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    console.log(`🔄 Translating "${text.substring(0, 50)}..." to ${targetLang}`);
    
    const response = await fetch(`${supabaseUrl}/functions/v1/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        from: 'en',
        to: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const translatedText = data?.translatedText || text;
    
    console.log(`✅ Translation result: "${translatedText.substring(0, 50)}..."`);
    return translatedText;
    
  } catch (error) {
    console.error(`❌ Translation error for ${targetLang}:`, error);
    return text; // Return original text if translation fails
  }
}

async function getIncompleteTranslations(): Promise<Array<{
  id: string;
  original_text: string;
  language_code: string;
  page_path: string;
  content_key: string;
}>> {
  console.log('🔍 Fetching incomplete translations...');
  
  const { data, error } = await supabase
    .from('website_translations')
    .select('id, original_text, language_code, page_path, content_key, translated_text')
    .neq('language_code', 'en')
    .order('language_code');
    
  if (error) {
    console.error('❌ Error fetching incomplete translations:', error);
    return [];
  }
  
  if (!data) {
    console.log('⚠️ No translation data found');
    return [];
  }
  
  // Filter for incomplete translations in code logic
  const incomplete = data.filter(item => {
    const isPlaceholder = item.translated_text?.includes('translation') || 
                         item.translated_text?.includes('Good translation') ||
                         item.translated_text?.includes('Poor translation') ||
                         item.translated_text?.includes('खराब अनुवाद') ||
                         item.translated_text?.includes('अच्छा अनुवाद');
    const isUntranslated = item.translated_text === item.original_text;
    const isEmpty = !item.translated_text || item.translated_text.trim() === '';
    
    return isPlaceholder || isUntranslated || isEmpty;
  });
  
  console.log(`📊 Found ${incomplete.length} incomplete translations out of ${data.length} total`);
  return incomplete.map(item => ({
    id: item.id,
    original_text: item.original_text,
    language_code: item.language_code,
    page_path: item.page_path,
    content_key: item.content_key
  }));
}

async function updateTranslation(id: string, translatedText: string): Promise<void> {
  try {
    console.log(`🔄 Updating translation ${id} with: "${translatedText.substring(0, 50)}..."`);
    
    const { error } = await supabase
      .from('website_translations')
      .update({ 
        translated_text: translatedText,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error(`❌ Error updating translation ${id}:`, error);
    } else {
      console.log(`✅ Successfully updated translation ${id}`);
    }
  } catch (error) {
    console.error(`❌ Failed to update translation ${id}:`, error);
  }
}

Deno.serve(async (req) => {
  console.log(`📥 Complete missing translations request: ${req.method} ${req.url}`);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting comprehensive missing translation completion...');
    
    // Get all incomplete translations
    const incompleteTranslations = await getIncompleteTranslations();
    console.log(`📊 Found ${incompleteTranslations.length} incomplete translations`);
    
    if (incompleteTranslations.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'All translations are already complete!',
          stats: {
            processed: 0,
            completed: 0,
            failed: 0
          }
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    let processed = 0;
    let completed = 0;
    let failed = 0;
    const results: Record<string, any> = {};

    // Group by language for better organization
    const byLanguage: Record<string, typeof incompleteTranslations> = {};
    incompleteTranslations.forEach(item => {
      if (!byLanguage[item.language_code]) {
        byLanguage[item.language_code] = [];
      }
      byLanguage[item.language_code].push(item);
    });

    // Process each language
    for (const [langCode, items] of Object.entries(byLanguage)) {
      console.log(`🌍 Processing ${items.length} items for language: ${langCode}`);
      results[langCode] = { processed: 0, completed: 0, failed: 0 };
      
      for (const item of items) {
        try {
          processed++;
          
          // Skip image URLs and file paths - they don't need translation
          if (item.original_text.includes('/lovable-uploads/') || 
              item.original_text.includes('.png') || 
              item.original_text.includes('.jpg') ||
              item.original_text.includes('.jpeg') ||
              item.original_text.includes('.gif')) {
            console.log(`⏭️  Skipping file path: ${item.original_text}`);
            await updateTranslation(item.id, item.original_text);
            completed++;
            results[langCode].completed++;
            continue;
          }

          // Skip very short text that doesn't need translation
          if (item.original_text.trim().length < 2) {
            console.log(`⏭️  Skipping short text: "${item.original_text}"`);
            await updateTranslation(item.id, item.original_text);
            completed++;
            results[langCode].completed++;
            continue;
          }

          // Translate the text
          const translatedText = await translateText(item.original_text, item.language_code);
          
          // Update the translation in database
          await updateTranslation(item.id, translatedText);
          
          completed++;
          results[langCode].completed++;
          results[langCode].processed++;
          
          console.log(`✅ Completed: "${item.original_text}" → "${translatedText}" (${langCode})`);
          
          // Add small delay to respect API rate limits
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`❌ Failed to process "${item.original_text}" for ${langCode}:`, error);
          failed++;
          results[langCode].failed++;
        }
      }
      
      console.log(`🎉 Completed ${langCode}: ${results[langCode].completed}/${items.length} translations`);
    }

    console.log(`🎉 Translation completion finished!`);
    console.log(`📊 Stats: Processed: ${processed}, Completed: ${completed}, Failed: ${failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully completed ${completed} translations out of ${processed} items`,
        stats: {
          total_processed: processed,
          total_completed: completed,
          total_failed: failed,
          by_language: results
        },
        summary: {
          incomplete_before: incompleteTranslations.length,
          completed_now: completed,
          remaining_incomplete: failed
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Complete missing translations error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to complete missing translations'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});