import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { supabase } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

// Define supported languages
const SUPPORTED_LANGUAGES = [
  'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'
];

// MyMemory API for translation
async function translateWithMyMemory(text: string, from: string, to: string): Promise<string> {
  try {
    console.log(`🔄 MyMemory: Translating "${text}" from ${from} to ${to}`);
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`MyMemory API error: ${response.status}`);
    }
    
    const data = await response.json();
    const translatedText = data.responseData?.translatedText;
    
    if (!translatedText || translatedText === text) {
      throw new Error('No translation returned from MyMemory');
    }
    
    console.log(`✅ MyMemory: Success - "${translatedText}"`);
    return translatedText;
  } catch (error) {
    console.error(`❌ MyMemory failed:`, error);
    throw error;
  }
}

// Auto-translate content when new content is detected
async function autoTranslateContent(content: any[]): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabaseClient = supabase(supabaseUrl, supabaseKey);

  console.log(`🚀 Auto-translating content for ${content.length} items`);

  for (const item of content) {
    const { page_path, content_key, original_text } = item;

    // Skip if original text is too short or just numbers/symbols
    if (!original_text || original_text.length < 3 || /^\d+$/.test(original_text) || /^[^\w\s]+$/.test(original_text)) {
      continue;
    }

    console.log(`📝 Processing: "${original_text}" for page ${page_path}`);

    // Translate to all supported languages
    for (const languageCode of SUPPORTED_LANGUAGES) {
      try {
        // Check if translation already exists
        const { data: existing } = await supabaseClient
          .from('website_translations')
          .select('id')
          .eq('page_path', page_path)
          .eq('language_code', languageCode)
          .eq('content_key', content_key)
          .single();

        if (existing) {
          console.log(`⏭️ Translation already exists for ${languageCode}`);
          continue;
        }

        // Translate the text
        const translatedText = await translateWithMyMemory(original_text, 'en', languageCode);

        // Store the translation
        const { error: insertError } = await supabaseClient
          .from('website_translations')
          .insert({
            page_path,
            language_code: languageCode,
            content_key,
            original_text,
            translated_text: translatedText,
            content_type: 'text'
          });

        if (insertError) {
          console.error(`❌ Failed to store translation for ${languageCode}:`, insertError);
        } else {
          console.log(`✅ Stored translation for ${languageCode}: "${translatedText}"`);
        }

        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));

      } catch (error) {
        console.error(`❌ Failed to translate to ${languageCode}:`, error);
      }
    }
  }

  console.log('✅ Auto-translation completed');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();

    console.log(`📥 Auto-translate request: ${type}`);

    switch (type) {
      case 'translate_content':
        // Auto-translate provided content
        if (!data || !Array.isArray(data)) {
          throw new Error('Invalid content data provided');
        }
        
        await autoTranslateContent(data);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Auto-translated ${data.length} content items`,
            processed: data.length
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );

      case 'translate_page':
        // Extract and translate all content from a specific page
        const { page_path, content_items } = data;
        
        if (!page_path || !content_items) {
          throw new Error('Page path and content items are required');
        }

        await autoTranslateContent(content_items.map((item: any, index: number) => ({
          page_path,
          content_key: `auto_${index}`,
          original_text: item.text,
          content_type: item.type || 'text'
        })));

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Auto-translated page: ${page_path}`,
            processed: content_items.length
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );

      case 'batch_translate':
        // Bulk translate multiple pages
        const { pages } = data;
        
        if (!pages || !Array.isArray(pages)) {
          throw new Error('Pages array is required');
        }

        let totalProcessed = 0;

        for (const page of pages) {
          const { page_path, content_items } = page;
          
          if (page_path && content_items) {
            await autoTranslateContent(content_items.map((item: any, index: number) => ({
              page_path,
              content_key: `batch_${index}`,
              original_text: item.text,
              content_type: item.type || 'text'
            })));
            
            totalProcessed += content_items.length;
          }
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Batch translated ${pages.length} pages`,
            processed: totalProcessed
          }),
          { 
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );

      default:
        throw new Error(`Unknown request type: ${type}`);
    }

  } catch (error) {
    console.error('❌ Auto-translate error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});