// Batch Translation Completion - Enterprise Grade
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationJob {
  id: string;
  original_text: string;
  language_code: string;
  page_path: string;
  content_key: string;
}

const SUPPORTED_LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('🚀 Starting batch translation completion...');

    // Get completion status per language
    const { data: stats } = await supabase
      .from('website_translations')
      .select(`
        language_code,
        count:id.count(),
        completed:translated_text.count()
      `)
      .neq('language_code', 'en')
      .group('language_code');

    console.log('📊 Current completion status:', stats);

    // Find missing translations by getting all English content and checking coverage
    const { data: englishContent } = await supabase
      .from('website_translations')
      .select('original_text, page_path, content_key')
      .eq('language_code', 'en')
      .limit(1000);

    if (!englishContent) {
      return new Response(
        JSON.stringify({ error: 'No English content found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    let totalProcessed = 0;
    let totalCompleted = 0;

    // Process each language
    for (const language of SUPPORTED_LANGUAGES) {
      console.log(`🔄 Processing ${language}...`);
      
      // Get existing translations for this language
      const { data: existingTranslations } = await supabase
        .from('website_translations')
        .select('original_text')
        .eq('language_code', language);

      const existingSet = new Set(existingTranslations?.map(t => t.original_text) || []);
      
      // Find missing translations
      const missingContent = englishContent.filter(content => 
        !existingSet.has(content.original_text) && 
        content.original_text.length > 1 &&
        !isNonTranslatableContent(content.original_text)
      );

      console.log(`📝 Found ${missingContent.length} missing translations for ${language}`);

      // Process in batches
      const batchSize = 10;
      for (let i = 0; i < missingContent.length && i < 50; i += batchSize) {
        const batch = missingContent.slice(i, i + batchSize);
        
        await Promise.all(batch.map(async (content) => {
          try {
            // Call translate function
            const { data: translationResult } = await supabase.functions.invoke('translate', {
              body: {
                text: content.original_text,
                target_language: language,
                source_language: 'en'
              }
            });

            if (translationResult?.translatedText) {
              // Insert new translation
              await supabase
                .from('website_translations')
                .upsert({
                  page_path: content.page_path,
                  content_key: content.content_key,
                  original_text: content.original_text,
                  translated_text: translationResult.translatedText,
                  language_code: language,
                  content_type: 'batch'
                });

              totalCompleted++;
              console.log(`✅ Translated "${content.original_text}" to ${language}`);
            }
            
            totalProcessed++;
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
            
          } catch (error) {
            console.error(`❌ Translation failed for "${content.original_text}":`, error);
          }
        }));
      }
    }

    // Update completion status
    const { data: finalStats } = await supabase
      .from('website_translations')
      .select(`
        language_code,
        count:id.count(),
        completed:translated_text.count()
      `)
      .neq('language_code', 'en')
      .group('language_code');

    console.log('🎉 Batch completion finished!');
    console.log(`📊 Processed: ${totalProcessed}, Completed: ${totalCompleted}`);
    console.log('📈 Final stats:', finalStats);

    return new Response(
      JSON.stringify({
        success: true,
        processed: totalProcessed,
        completed: totalCompleted,
        finalStats
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('❌ Batch translation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function isNonTranslatableContent(text: string): boolean {
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
    /^\/lovable-uploads/        // File paths
  ];
  
  return skipPatterns.some(pattern => pattern.test(text));
}