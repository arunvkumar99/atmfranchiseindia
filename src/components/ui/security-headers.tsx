import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityHeadersProps {
  children: React.ReactNode;
}

export const SecurityHeaders = ({ children }: SecurityHeadersProps) => {
  useEffect(() => {
    // Fetch server-side security headers from edge function
    const initializeSecurityHeaders = async () => {
      try {
        const currentPath = window.location.pathname;
        const hasGoogleTranslate = document.querySelector('#google_translate_element') !== null;
        
        const { data, error } = await supabase.functions.invoke('security-headers', {
          body: { 
            path: currentPath,
            hasGoogleTranslate 
          }
        });

        if (error) {
          console.warn('Failed to fetch security headers from server:', error);
          // Fallback to basic client-side headers
          setFallbackHeaders();
          return;
        }

        if (data?.headers) {
          // Apply server-provided security headers via meta tags
          Object.entries(data.headers).forEach(([name, content]) => {
            if (typeof content === 'string') {
              setMetaTag(name, content);
            }
          });
          console.log('✅ Server-side security headers applied');
        }
      } catch (error) {
        console.warn('Security headers initialization failed:', error);
        setFallbackHeaders();
      }
    };

    const setMetaTag = (name: string, content: string) => {
      // Convert header names to appropriate meta tag format
      const httpEquivHeaders = [
        'Content-Security-Policy',
        'X-Frame-Options', 
        'X-Content-Type-Options',
        'Referrer-Policy',
        'Strict-Transport-Security'
      ];

      let meta = document.querySelector(`meta[http-equiv="${name}"], meta[name="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (httpEquivHeaders.includes(name)) {
          meta.setAttribute('http-equiv', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    const setFallbackHeaders = () => {
      // Secure fallback CSP without unsafe directives
      setMetaTag('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' https://translate.google.com https://translate.googleapis.com https://cdn.jsdelivr.net; " +
        "style-src 'self' https://fonts.googleapis.com https://translate.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " +
        "frame-src https://translate.google.com; " +
        "object-src 'none'; " +
        "base-uri 'self'; " +
        "form-action 'self';"
      );

      setMetaTag('X-Frame-Options', 'SAMEORIGIN');
      setMetaTag('X-Content-Type-Options', 'nosniff');
      setMetaTag('Referrer-Policy', 'strict-origin-when-cross-origin');
      setMetaTag('Permissions-Policy', 
        'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), accelerometer=()'
      );
      
      console.log('⚠️ Fallback security headers applied');
    };

    // Initialize security headers
    initializeSecurityHeaders();
  }, []);

  return <>{children}</>;
};