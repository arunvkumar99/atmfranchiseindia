import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LanguageSwitchTest = () => {
  const { t, i18n } = useTranslation(['common', 'home', 'forms']);
  const [testResults, setTestResults] = useState<any[]>([]);

  const languages = [
  {
    "code": "en",
    "name": "English",
    "nativeName": "English"
  },
  {
    "code": "hi",
    "name": "Hindi",
    "nativeName": "हिन्दी"
  },
  {
    "code": "bn",
    "name": "Bengali",
    "nativeName": "বাংলা"
  },
  {
    "code": "ta",
    "name": "Tamil",
    "nativeName": "தமிழ்"
  },
  {
    "code": "te",
    "name": "Telugu",
    "nativeName": "తెలుగు"
  },
  {
    "code": "mr",
    "name": "Marathi",
    "nativeName": "मराठी"
  },
  {
    "code": "gu",
    "name": "Gujarati",
    "nativeName": "ગુજરાતી"
  },
  {
    "code": "ur",
    "name": "Urdu",
    "nativeName": "اردو"
  },
  {
    "code": "kn",
    "name": "Kannada",
    "nativeName": "ಕನ್ನಡ"
  },
  {
    "code": "or",
    "name": "Odia",
    "nativeName": "ଓଡ଼ିଆ"
  },
  {
    "code": "pa",
    "name": "Punjabi",
    "nativeName": "ਪੰਜਾਬੀ"
  },
  {
    "code": "as",
    "name": "Assamese",
    "nativeName": "অসমীয়া"
  },
  {
    "code": "ml",
    "name": "Malayalam",
    "nativeName": "മലയാളം"
  }
];

  const testLanguageSwitch = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      
      // Test if language changed
      const currentLang = i18n.language;
      const success = currentLang === langCode;
      
      // Test if translations are loaded
      const testKeys = [
        'common:buttons.submit',
        'home:hero.title',
        'forms:fields.email'
      ];
      
      const translations = testKeys.map(key => ({
        key,
        value: t(key),
        isTranslated: t(key) !== key
      }));
      
      const result = {
        language: langCode,
        success,
        currentLang,
        translations,
        timestamp: new Date().toISOString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      return success;
    } catch (error) {
      if (import.meta.env.DEV) { console.error(`Failed to switch to ${langCode}:`, error); }
      return false;
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    for (const lang of languages) {
      await testLanguageSwitch(lang.code);
      // Wait a bit between switches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{t('components.languageswitchtest.text1')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <Button
              key={lang.code}
              onClick={() => testLanguageSwitch(lang.code)}
              variant={i18n.language === lang.code ? 'default' : 'outline'}
              size="sm"
            >
              {lang.nativeName} ({lang.code})
            </Button>
          ))}
        </div>
        
        <Button onClick={runAllTests} className="w-full">
          Run All Language Tests
        </Button>
        
        {testResults.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${
                  result.success ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                }`}
              >
                <div className="font-medium">
                  {result.language}: {result.success ? '✅ Success' : '❌ Failed'}
                </div>
                <div className="text-sm text-gray-600">
                  Current: {result.currentLang}
                </div>
                <div className="text-xs mt-1">
                  {result.translations.map((t: any) => (
                    <div key={t.key}>
                      {t.key}: {t.isTranslated ? '✅' : '❌'} {t.value.substring(0, 30)}...
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">Current Language Info:</h4>
          <div className="text-sm space-y-1">
            <div>Language: {i18n.language}</div>
            <div>Available: {i18n.languages.join(', ')}</div>
            <div>Direction: {i18n.dir()}</div>
            <div>
              Sample Translation: {t('common:buttons.submit', 'Submit')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSwitchTest;
