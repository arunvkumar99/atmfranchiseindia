import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGE_CODES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// This component handles URL-based language detection and applies translations
const FixedLanguageRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const path = location.pathname;
    
    // Check if URL starts with a supported language code
    const languageMatch = path.match(/^\/([a-z]{2})(\/.*)?$/);
    
    if (languageMatch) {
      const [, langCode, remainingPath] = languageMatch;
      
      if (SUPPORTED_LANGUAGE_CODES.includes(langCode)) {
        // Valid language code found - apply translation without URL manipulation
        console.log(`🌍 Detected language: ${langCode} for path: ${path}`);
        
        // Apply translation using unified system
        i18n.changeLanguage(langCode);
      } else {
        // Invalid language code - redirect to clean URL
        console.log(`❌ Invalid language code: ${langCode}, redirecting to clean URL`);
        const cleanPath = remainingPath || '/';
        navigate(cleanPath, { replace: true });
      }
    } else {
      // No language prefix - check for user preference
      const preferredLang = localStorage.getItem('preferred-language');
      
      if (preferredLang && preferredLang !== 'en' && path === '/') {
        // Only auto-redirect on homepage for non-English preferences
        if (SUPPORTED_LANGUAGE_CODES.includes(preferredLang)) {
          console.log(`🔄 Auto-redirecting to preferred language: ${preferredLang}`);
          navigate(`/${preferredLang}/`, { replace: true });
          return;
        }
      }
      
      // Apply English as default
      i18n.changeLanguage('en');
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default FixedLanguageRouter;