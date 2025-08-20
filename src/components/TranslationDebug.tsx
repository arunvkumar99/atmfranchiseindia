import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

export const TranslationDebug = () => {
  const { t, i18n } = useTranslation();
  const [loadedNamespaces, setLoadedNamespaces] = useState<string[]>([]);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);

  useEffect(() => {
    // Check if resources are loaded
    const checkResources = () => {
      const resources = i18n.store.data;
      console.log('i18n Store Data:', resources);
      console.log('Current Language:', i18n.language);
      console.log('Loaded Languages:', i18n.languages);
      console.log('Resource Bundle:', i18n.getResourceBundle(i18n.language, 'common'));
      
      setResourcesLoaded(Object.keys(resources).length > 0);
      
      if (resources[i18n.language]) {
        setLoadedNamespaces(Object.keys(resources[i18n.language]));
      }
    };

    checkResources();

    // Listen for language changes
    i18n.on('languageChanged', checkResources);
    i18n.on('loaded', checkResources);

    return () => {
      i18n.off('languageChanged', checkResources);
      i18n.off('loaded', checkResources);
    };
  }, [i18n]);

  const handleLanguageChange = async (lang: string) => {
    console.log(`Changing language to: ${lang}`);
    await i18n.changeLanguage(lang);
    console.log(`Language changed to: ${i18n.language}`);
  };

  return (
    <div className="fixed bottom-20 right-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg z-50 max-w-md">
      <h3 className="font-bold text-lg mb-2">Translation Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Current Language:</strong> {i18n.language}
        </div>
        
        <div>
          <strong>Resources Loaded:</strong> {resourcesLoaded ? '✅ Yes' : '❌ No'}
        </div>
        
        <div>
          <strong>Loaded Namespaces:</strong> {loadedNamespaces.join(', ') || 'None'}
        </div>
        
        <div>
          <strong>Test Translation:</strong> {t('nav.home')}
        </div>
        
        <div>
          <strong>Backend Connected:</strong> {i18n.options.backend ? '✅ Yes' : '❌ No'}
        </div>
      </div>

      <div className="mt-4">
        <p className="font-semibold mb-2">Test Languages:</p>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.slice(0, 5).map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-3 py-1 rounded text-xs ${
                i18n.language === lang.code 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {lang.flag} {lang.code}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-600">
        Check console for detailed logs
      </div>
    </div>
  );
};