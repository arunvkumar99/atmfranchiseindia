import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simplified i18n setup for debugging
i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    debug: true,
    
    resources: {
      en: {
        common: {
          welcome: 'Welcome'
        }
      }
    },
    
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;