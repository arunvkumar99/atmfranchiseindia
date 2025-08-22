import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGE_CODES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// This component handles URL-based language detection and applies translations
const FixedLanguageRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const queryLang = searchParams.get('lng');
    
    // First check query parameter
    if (queryLang && (SUPPORTED_LANGUAGE_CODES.includes(queryLang) || queryLang === 'en')) {
      console.log(`🌍 Detected language from query: ${queryLang}`);
      if (i18n.language !== queryLang) {
        setIsChangingLanguage(true);
        i18n.changeLanguage(queryLang).then(() => {
          console.log(`✅ Language changed to: ${queryLang}`);
          setIsChangingLanguage(false);
        });
      }
      return; // Don't process further if query param is set
    }
    
    // Check if URL starts with a supported language code
    const languageMatch = path.match(/^\/([a-z]{2})(\/.*)?$/);
    
    if (languageMatch) {
      const [, langCode, remainingPath] = languageMatch;
      
      if (SUPPORTED_LANGUAGE_CODES.includes(langCode)) {
        // Valid language code found - apply translation without URL manipulation
        console.log(`🌍 Detected language: ${langCode} for path: ${path}`);
        
        // Apply translation using unified system - await the promise
        if (i18n.language !== langCode) {
          setIsChangingLanguage(true);
          i18n.changeLanguage(langCode).then(() => {
            console.log(`✅ Language changed to: ${langCode}`);
            setIsChangingLanguage(false);
          });
        }
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
      
      // Apply English as default only if no query param
      if (!queryLang) {
        i18n.changeLanguage('en');
      }
    }
  }, [location.pathname, location.search, navigate]);

  // Show loading state while language is changing
  if (isChangingLanguage) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading language...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default FixedLanguageRouter;