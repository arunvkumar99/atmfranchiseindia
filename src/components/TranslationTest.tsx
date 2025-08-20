import React from 'react';
import { useTranslation } from 'react-i18next';

const TranslationTest: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  // Log current state for debugging
  console.log('Current language:', i18n.language);
  console.log('Loaded languages:', i18n.languages);
  console.log('Has loaded namespace:', i18n.hasLoadedNamespace('translation'));
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Translation Test Component</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Debug Information:</h2>
        <div className="bg-gray-100 p-4 rounded">
          <p>Current Language: <strong>{i18n.language}</strong></p>
          <p>Available Languages: <strong>{i18n.languages.join(', ')}</strong></p>
          <p>Namespace Loaded: <strong>{i18n.hasLoadedNamespace('translation') ? 'Yes' : 'No'}</strong></p>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Language Switcher:</h2>
        <div className="flex gap-2">
          <button onClick={() => changeLanguage('en')} className="px-4 py-2 bg-blue-500 text-white rounded">
            English
          </button>
          <button onClick={() => changeLanguage('hi')} className="px-4 py-2 bg-blue-500 text-white rounded">
            हिन्दी
          </button>
          <button onClick={() => changeLanguage('ta')} className="px-4 py-2 bg-blue-500 text-white rounded">
            தமிழ்
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Translation Tests:</h2>
        <div className="space-y-2">
          <p>Test 1 (common.buttons.submit): <strong>{t('common.buttons.submit', 'Submit')}</strong></p>
          <p>Test 2 (home.hero.title): <strong>{t('home.hero.title', 'Your ATM – Your Income')}</strong></p>
          <p>Test 3 (forms.fields.email): <strong>{t('forms.fields.email', 'Email Address')}</strong></p>
          <p>Test 4 (simple key): <strong>{t('welcome', 'Welcome')}</strong></p>
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-yellow-100 rounded">
        <p className="text-sm">
          <strong>Note:</strong> Check the browser console for detailed i18next debug logs.
          If translations show fallback values, check Network tab for 404 errors on JSON files.
        </p>
      </div>
    </div>
  );
};

export default TranslationTest;
