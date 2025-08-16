import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query } = await req.json()
    
    if (!query || query.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Search query is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the Perplexity API key from secrets
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY')
    
    if (!perplexityApiKey) {
      return new Response(
        JSON.stringify({ error: 'Perplexity API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // First, try to find direct matches in our search content database
    const { data: directMatches, error: dbError } = await supabase
      .from('search_content')
      .select('*')
      .or(`content_text.ilike.%${query}%,page_title.ilike.%${query}%,keywords.cs.{${query}}`)
      .limit(5)

    if (dbError) {
      console.error('Database search error:', dbError)
    }

    // Get all website content for context
    const { data: allContent, error: contentError } = await supabase
      .from('search_content')
      .select('*')

    if (contentError) {
      console.error('Content fetch error:', contentError)
    }

    // Create context from all website content
    const websiteContext = allContent?.map(item => 
      `Page: ${item.page_title} (${item.page_path})\nSection: ${item.content_section}\nContent: ${item.content_text}`
    ).join('\n\n') || ''

    // Use Perplexity for AI-powered search
    const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `You are a search assistant for ATM Franchise India website. Based on the user's search query, find the most relevant content from our website and provide helpful, accurate information. 

Website Content:
${websiteContext}

Instructions:
1. Search through the provided website content for information relevant to the user's query
2. Provide specific, helpful answers based on the website content
3. If you find relevant pages, mention them with their paths
4. Be concise but informative
5. If the query is about ATM business, franchises, agents, or related topics, prioritize that information
6. If no relevant content is found in the website, provide a brief explanation`
          },
          {
            role: 'user',
            content: `Search query: "${query}"`
          }
        ],
        temperature: 0.2,
        top_p: 0.9,
        max_tokens: 500,
        return_images: false,
        return_related_questions: false,
        frequency_penalty: 1,
        presence_penalty: 0
      }),
    })

    const perplexityData = await perplexityResponse.json()
    const aiResponse = perplexityData.choices?.[0]?.message?.content || 'No results found.'

    // Combine direct matches with AI response
    const searchResults = {
      ai_response: aiResponse,
      direct_matches: directMatches || [],
      total_results: (directMatches?.length || 0),
      search_query: query
    }

    return new Response(
      JSON.stringify(searchResults),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Search error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during search' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})