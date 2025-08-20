// SEO Meta Tags Component for Multi-language Support
// Automatically generates hreflang tags and language-specific meta data

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

interface SEOMetaTagsProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  currentLanguage?: string;
}

export const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title = 'ATM Franchise India - Your ATM, Your Income',
  description = 'Start your own ATM franchise business with minimal investment and maximum returns. Partner with RBI licensed operators across India.',
  keywords = 'ATM franchise, ATM business, passive income, franchise opportunity, India',
  image = 'https://via.placeholder.com/1200x630/333333/ffffff?text=ATM+Franchise+India',
  currentLanguage = 'en'
}) => {
  const { t } = useTranslation('common');
  const location = useLocation();

  // Generate URLs for all languages
  const generateLanguageURLs = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const currentPath = location.pathname;
    const basePath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, '/');
    
    return SUPPORTED_LANGUAGES.map(language => ({
      ...language,
      url: `${baseUrl}${language.code === 'en' ? '' : '/' + language.code}${basePath === '/' ? '' : basePath}`
    }));
  };

  const languageURLs = generateLanguageURLs();
  const canonicalUrl = languageURLs.find(lang => lang.code === currentLanguage)?.url || languageURLs[0].url;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="language" content={currentLanguage} />
      
      {/* Language and Direction */}
      <html lang={currentLanguage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Hreflang Tags for SEO */}
      {languageURLs.map(language => (
        <link
          key={language.code}
          rel="alternate"
          hrefLang={language.code}
          href={language.url}
        />
      ))}
      
      {/* Default language (English) */}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={languageURLs.find(lang => lang.code === 'en')?.url || languageURLs[0].url}
      />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={currentLanguage === 'en' ? 'en_US' : `${currentLanguage}_IN`} />
      
      {/* Alternate locales */}
      {SUPPORTED_LANGUAGES
        .filter(lang => lang.code !== currentLanguage)
        .map(language => (
          <meta
            key={language.code}
            property="og:locale:alternate"
            content={language.code === 'en' ? 'en_US' : `${language.code}_IN`}
          />
        ))}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ATM Franchise India" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Preconnect for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "ATM Franchise India",
          "description": description,
          "url": canonicalUrl,
          "logo": image,
          "sameAs": [
            "https://www.facebook.com/atmfranchiseindia",
            "https://www.linkedin.com/company/atmfranchiseindia"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-9876543210",
            "contactType": "Customer Service",
            "availableLanguage": SUPPORTED_LANGUAGES.map(lang => lang.name)
          },
          "offers": {
            "@type": "Offer",
            "name": "ATM Franchise Opportunity",
            "description": "Start your own ATM franchise business with minimal investment",
            "category": "Business Opportunity"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOMetaTags;