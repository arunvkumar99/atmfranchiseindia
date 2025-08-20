import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const EnsureEnglishDefault = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Check if no language is set in localStorage
    const storedLang = localStorage.getItem('i18nextLng');
    
    // If no language is stored or it's not in our supported list, set to English
    const supportedLngs = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
    
    if (!storedLang || !supportedLngs.includes(storedLang)) {
      localStorage.setItem('i18nextLng', 'en');
      i18n.changeLanguage('en');
    }
  }, [i18n]);
  
  return null;
};
