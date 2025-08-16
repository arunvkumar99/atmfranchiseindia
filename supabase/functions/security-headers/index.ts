import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Comprehensive security headers for production
const securityHeaders = {
  // Content Security Policy - Strict policy without unsafe directives
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' https://translate.google.com https://translate.googleapis.com https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' https://fonts.googleapis.com https://translate.googleapis.com 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", // Allow empty inline styles
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.perplexity.ai",
    "frame-src https://translate.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; '),

  // HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Prevent clickjacking
  'X-Frame-Options': 'SAMEORIGIN',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // XSS Protection
  'X-XSS-Protection': '1; mode=block',

  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions Policy - Restrict dangerous APIs
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()',
    'autoplay=()',
    'encrypted-media=()',
    'fullscreen=(self)',
    'picture-in-picture=()'
  ].join(', '),

  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-site',

  // Cache Control for security-sensitive responses
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0',

  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Download-Options': 'noopen',
  'X-DNS-Prefetch-Control': 'off'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const requestedPath = url.searchParams.get('path') || '/';

    console.log(`Security headers requested for path: ${requestedPath}`);

    // Adjust CSP based on path if needed
    let customCSP = securityHeaders['Content-Security-Policy'];
    
    // For pages with Google Translate, allow additional sources
    if (requestedPath.includes('translate') || req.headers.get('x-google-translate') === 'true') {
      customCSP = customCSP.replace(
        "script-src 'self'",
        "script-src 'self' 'unsafe-inline'"
      );
    }

    // Return security headers configuration
    const responseHeaders = {
      ...securityHeaders,
      'Content-Security-Policy': customCSP
    };

    return new Response(
      JSON.stringify({
        success: true,
        headers: responseHeaders,
        path: requestedPath,
        message: 'Security headers configured successfully'
      }),
      {
        headers: {
          ...corsHeaders,
          ...responseHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in security-headers function:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to configure security headers',
        details: error.message
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});