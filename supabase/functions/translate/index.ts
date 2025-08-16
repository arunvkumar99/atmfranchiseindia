import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface TranslationRequest {
  text?: string;
  texts?: string[];
  from?: string;
  to?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  source_language?: string;
  target_language?: string;
}

interface BatchTranslationRequest {
  texts: string[];
  targetLanguage: string;
  sourceLanguage?: string;
}

interface TranslationResponse {
  translatedText?: string;
  translations?: { [key: string]: string };
  provider: string;
  cached: boolean;
}

// Circuit breaker to prevent infinite API calls
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly threshold = 5;
  private readonly timeout = 300000; // 5 minutes

  isOpen(): boolean {
    if (this.failureCount >= this.threshold) {
      const now = Date.now();
      if (now - this.lastFailureTime < this.timeout) {
        return true; // Circuit is open
      } else {
        // Reset circuit breaker after timeout
        this.failureCount = 0;
        return false;
      }
    }
    return false;
  }

  recordSuccess(): void {
    this.failureCount = 0;
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }
}

// Rate limiter to control API calls
class RateLimiter {
  private lastCallTime = 0;
  private readonly minInterval = 1000; // 1 second between calls

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCallTime;
    
    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    this.lastCallTime = Date.now();
  }
}

// Translation providers with fallbacks
class TranslationService {
  private cache = new Map<string, string>();
  private circuitBreakers = new Map<string, CircuitBreaker>();
  private rateLimiters = new Map<string, RateLimiter>();

  private getCircuitBreaker(provider: string): CircuitBreaker {
    if (!this.circuitBreakers.has(provider)) {
      this.circuitBreakers.set(provider, new CircuitBreaker());
    }
    return this.circuitBreakers.get(provider)!;
  }

  private getRateLimiter(provider: string): RateLimiter {
    if (!this.rateLimiters.has(provider)) {
      this.rateLimiters.set(provider, new RateLimiter());
    }
    return this.rateLimiters.get(provider)!;
  }

  // Provider 1: MyMemory API (Free, reliable)
  private async translateWithMyMemory(text: string, from: string, to: string): Promise<string> {
    const circuitBreaker = this.getCircuitBreaker('MyMemory');
    const rateLimiter = this.getRateLimiter('MyMemory');

    if (circuitBreaker.isOpen()) {
      throw new Error('MyMemory circuit breaker is open');
    }

    try {
      await rateLimiter.waitIfNeeded();
      
      console.log(`🔄 MyMemory: Translating "${text}" from ${from} to ${to}`);
      
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
        {
          headers: {
            'User-Agent': 'ATM-Franchise-Website'
          },
          signal: AbortSignal.timeout(10000) // 10 second timeout
        }
      );

      if (!response.ok) {
        if (response.status === 429) {
          console.warn('🚫 MyMemory rate limit hit, backing off');
          // Longer backoff for rate limit
          await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
        }
        throw new Error(`MyMemory API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData?.translatedText) {
        const translated = data.responseData.translatedText;
        console.log(`✅ MyMemory: Success - "${translated}"`);
        circuitBreaker.recordSuccess();
        return translated;
      }
      
      throw new Error('MyMemory: Invalid response format');
      
    } catch (error) {
      console.error('❌ MyMemory translation failed:', error);
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  // Provider 2: LibreTranslate (if API key available)
  private async translateWithLibre(text: string, from: string, to: string): Promise<string> {
    const apiKey = Deno.env.get('LIBRETRANSLATE_API_KEY');
    if (!apiKey) {
      throw new Error('LibreTranslate API key not configured');
    }

    const circuitBreaker = this.getCircuitBreaker('LibreTranslate');
    const rateLimiter = this.getRateLimiter('LibreTranslate');

    if (circuitBreaker.isOpen()) {
      throw new Error('LibreTranslate circuit breaker is open');
    }

    try {
      await rateLimiter.waitIfNeeded();
      
      console.log(`🔄 LibreTranslate: Translating "${text}" from ${from} to ${to}`);
      
      const response = await fetch('https://libretranslate.de/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: 'text'
        }),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`LibreTranslate API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.translatedText) {
        console.log(`✅ LibreTranslate: Success - "${data.translatedText}"`);
        circuitBreaker.recordSuccess();
        return data.translatedText;
      }
      
      throw new Error('LibreTranslate: Invalid response format');
      
    } catch (error) {
      console.error('❌ LibreTranslate translation failed:', error);
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  // Provider 3: Google Translate (if API key available)
  private async translateWithGoogle(text: string, from: string, to: string): Promise<string> {
    const apiKey = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
    if (!apiKey) {
      throw new Error('Google Translate API key not configured');
    }

    const circuitBreaker = this.getCircuitBreaker('Google');
    const rateLimiter = this.getRateLimiter('Google');

    if (circuitBreaker.isOpen()) {
      throw new Error('Google circuit breaker is open');
    }

    try {
      await rateLimiter.waitIfNeeded();
      
      console.log(`🔄 Google: Translating "${text}" from ${from} to ${to}`);
      
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source: from,
            target: to,
            format: 'text'
          }),
          signal: AbortSignal.timeout(10000)
        }
      );

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.data?.translations?.[0]?.translatedText) {
        const translated = data.data.translations[0].translatedText;
        console.log(`✅ Google: Success - "${translated}"`);
        circuitBreaker.recordSuccess();
        return translated;
      }
      
      throw new Error('Google: Invalid response format');
      
    } catch (error) {
      console.error('❌ Google translation failed:', error);
      circuitBreaker.recordFailure();
      throw error;
    }
  }

  // Main translation method with multiple providers
  public async translate(text: string, from: string, to: string): Promise<TranslationResponse> {
    // Check cache first
    const cacheKey = `${text}|${from}|${to}`;
    const cached = this.cache.get(cacheKey);
    if (cached) {
      console.log(`💾 Cache hit: "${text}" → "${cached}"`);
      return {
        translatedText: cached,
        provider: 'cache',
        cached: true
      };
    }

    // If same language, return original
    if (from === to) {
      return {
        translatedText: text,
        provider: 'none',
        cached: false
      };
    }

    // Limit text length to prevent abuse
    if (text.length > 5000) {
      console.warn('🚫 Text too long, truncating');
      text = text.substring(0, 5000);
    }

    const providers = [
      { name: 'MyMemory', func: this.translateWithMyMemory.bind(this) },
      { name: 'LibreTranslate', func: this.translateWithLibre.bind(this) },
      { name: 'Google', func: this.translateWithGoogle.bind(this) }
    ];

    // Try each provider in order (but skip if circuit breaker is open)
    for (const provider of providers) {
      const circuitBreaker = this.getCircuitBreaker(provider.name);
      
      if (circuitBreaker.isOpen()) {
        console.warn(`🚫 ${provider.name} circuit breaker is open, skipping`);
        continue;
      }

      try {
        const result = await provider.func(text, from, to);
        
        // Cache successful translation
        this.cache.set(cacheKey, result);
        
        return {
          translatedText: result,
          provider: provider.name,
          cached: false
        };
        
      } catch (error) {
        console.warn(`⚠️ ${provider.name} failed, trying next provider...`);
        continue;
      }
    }

    // All providers failed, return original text as fallback
    console.error('❌ All translation providers failed');
    
    // Cache the fallback to prevent repeated attempts
    this.cache.set(cacheKey, text);
    
    return {
      translatedText: text,
      provider: 'fallback',
      cached: false
    };
  }

  // Batch translation method
  public async batchTranslate(texts: string[], from: string, to: string): Promise<{ [key: string]: string }> {
    const translations: { [key: string]: string } = {};
    
    // Limit batch size to prevent overwhelming APIs
    const maxBatchSize = 10;
    const limitedTexts = texts.slice(0, maxBatchSize);
    
    for (let i = 0; i < limitedTexts.length; i++) {
      const text = limitedTexts[i];
      
      try {
        const result = await this.translate(text, from, to);
        translations[text] = result.translatedText;
        
        // Add delay between batch translations to be respectful to APIs
        if (i < limitedTexts.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
      } catch (error) {
        console.error(`Failed to translate "${text}":`, error);
        translations[text] = text; // Fallback to original text
      }
    }
    
    return translations;
  }
}

const translationService = new TranslationService();

serve(async (req) => {
  console.log(`📥 Translation request: ${req.method} ${req.url}`);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await req.json() as TranslationRequest;
    console.log('📄 Request body:', JSON.stringify(body, null, 2));

    // Handle batch translation
    if (body.texts && Array.isArray(body.texts)) {
      const targetLang = body.targetLanguage || body.target_language || body.to || 'en';
      const sourceLang = body.sourceLanguage || body.source_language || body.from || 'en';
      
      console.log(`🌍 Batch translating ${body.texts.length} texts from ${sourceLang} to ${targetLang}`);
      
      const translations = await translationService.batchTranslate(body.texts, sourceLang, targetLang);
      
      return new Response(
        JSON.stringify({
          translations,
          provider: 'batch',
          cached: false
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Handle single translation
    const text = body.text;
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Support multiple parameter naming conventions
    const targetLang = body.targetLanguage || body.target_language || body.to || 'en';
    const sourceLang = body.sourceLanguage || body.source_language || body.from || 'en';

    console.log(`🌍 Translating: "${text}" (${sourceLang} → ${targetLang})`);
    
    const result = await translationService.translate(text, sourceLang, targetLang);
    
    console.log(`✅ Translation result:`, JSON.stringify(result, null, 2));

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Translation service error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Translation failed',
        details: error.message,
        translatedText: '', // Return empty string to prevent null issues
        provider: 'error',
        cached: false
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

console.log('Listening on http://localhost:9999/');