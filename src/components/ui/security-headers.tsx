import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface SecurityHeadersProps {
  children: React.ReactNode;
}

export const SecurityHeaders = ({ children }: SecurityHeadersProps) => {
  const { t } = useTranslation('forms');
  useEffect(() => {
    // Apply client-side security headers directly
    const initializeSecurityHeaders = () => {
      try {
        console.log('🔒 Applying client-side security headers');
        setFallbackHeaders();
      } catch (error) {
        console.warn('Security headers initialization failed:', error);
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
      // Secure fallback CSP without Supabase references
      setMetaTag('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' https://translate.google.com https://translate.googleapis.com https://cdn.jsdelivr.net; " +
        "style-src 'self' https://fonts.googleapis.com https://translate.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: blob:; " +
        "connect-src 'self' https://sheets.googleapis.com https://translate.googleapis.com; " +
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
      
      console.log('🔒 Security headers applied');
    };

    // Initialize security headers
    initializeSecurityHeaders();
  }, []);

  return <>{children}</>;
};