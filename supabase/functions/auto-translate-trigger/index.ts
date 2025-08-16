import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Auto-translate trigger received');
    
    const body = await req.json();
    const { trigger_type = 'site_update' } = body;

    console.log(`📝 Trigger type: ${trigger_type}`);

    // Call the batch translate function to update all translations
    const batchResponse = await supabase.functions.invoke('batch-translate', {
      body: {
        fullWebsite: true,
        trigger: trigger_type,
        auto: true
      }
    });

    if (batchResponse.error) {
      throw new Error(`Batch translation failed: ${batchResponse.error.message}`);
    }

    console.log('✅ Auto-translation completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Auto-translation triggered successfully',
        trigger_type,
        timestamp: new Date().toISOString(),
        batch_result: batchResponse.data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Auto-translate trigger error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Auto-translation trigger failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});