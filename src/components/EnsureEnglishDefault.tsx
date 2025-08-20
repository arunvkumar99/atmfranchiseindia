import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const EnsureEnglishDefault = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // More aggressive English default enforcement
    const storedLang = localStorage.getItem('i18nextLng');
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lng');
    
    // If URL doesn't specify language and stored isn't English, force English
    if (!urlLang) {
      if (!storedLang || storedLang === 'ta' || storedLang === 'ta-IN') {
        // Clear any Tamil or invalid language settings
        localStorage.removeItem('i18nextLng');
        localStorage.setItem('i18nextLng', 'en');
        i18n.changeLanguage('en');
        console.log('[Language Fix] Forced English as default, cleared Tamil');
      } else if (storedLang !== 'en') {
        // If any non-English language without URL param, default to English
        const supportedLngs = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
        if (!supportedLngs.includes(storedLang)) {
          localStorage.setItem('i18nextLng', 'en');
          i18n.changeLanguage('en');
          console.log('[Language Fix] Invalid language detected, defaulting to English');
        }
      }
    }
    
    // Ensure i18n is using English if no language is explicitly set
    if (!i18n.language || i18n.language === 'ta' || i18n.language === 'ta-IN') {
      i18n.changeLanguage('en');
      console.log('[Language Fix] Changed i18n language to English');
    }
  }, [i18n]);
  
  return null;
};
