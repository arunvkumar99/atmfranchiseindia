// Quick script to generate a fix for the language default issue
const fs = require('fs');
const path = require('path');

console.log('Creating language reset component...\n');

const languageResetCode = `
// Add this to your browser console to reset language to English:
localStorage.setItem('i18nextLng', 'en');
location.reload();
`;

console.log('To fix the language issue immediately, run this in browser console:');
console.log('================================================');
console.log(languageResetCode);
console.log('================================================\n');

// Also create a component that ensures English is default
const ensureEnglishComponent = `import { useEffect } from 'react';
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
`;

const componentPath = path.join(__dirname, '..', 'src', 'components', 'EnsureEnglishDefault.tsx');
fs.writeFileSync(componentPath, ensureEnglishComponent);

console.log('✅ Created EnsureEnglishDefault component at:', componentPath);
console.log('\nTo use it, add <EnsureEnglishDefault /> to your App.tsx\n');