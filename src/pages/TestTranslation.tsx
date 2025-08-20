import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

const TestTranslation: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };
  
  // Log current state for debugging
  console.log('Current language:', i18n.language);
  console.log('Loaded languages:', i18n.languages);
  console.log('Has loaded namespace:', i18n.hasLoadedNamespace('translation'));
  
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Translation Test Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Debug Information:</h2>
            <div className="bg-gray-100 p-4 rounded">
              <p>Current Language: <strong>{i18n.language}</strong></p>
              <p>Available Languages: <strong>{i18n.languages.join(', ')}</strong></p>
              <p>Namespace Loaded: <strong>{i18n.hasLoadedNamespace('translation') ? 'Yes' : 'No'}</strong></p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Language Switcher:</h2>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <Button 
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)} 
                  variant={i18n.language === lang.code ? 'default' : 'outline'}
                  size="sm"
                >
                  {lang.flag} {lang.native} ({lang.code})
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Translation Tests:</h2>
            <div className="space-y-2 bg-gray-50 p-4 rounded">
              <p>Test 1 - Simple key: <strong>{t('welcome', 'Welcome')}</strong></p>
              <p>Test 2 - Common namespace: <strong>{t('common.buttons.submit', 'Submit')}</strong></p>
              <p>Test 3 - Hero title: <strong>{t('home.hero.title', 'Your ATM – Your Income')}</strong></p>
              <p>Test 4 - Form field: <strong>{t('forms.fields.email', 'Email Address')}</strong></p>
              <p>Test 5 - Navigation: <strong>{t('common.header.navigation.home', 'Home')}</strong></p>
              <p>Test 6 - Footer: <strong>{t('common.footer.quickLinks.title', 'Quick Links')}</strong></p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Hero Section Test:</h2>
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="text-2xl font-bold">{t('home.hero.title', 'Your ATM – Your Income')}</h3>
              <p className="text-lg mt-2">{t('home.hero.subtitle', 'Join India\'s fastest-growing ATM franchise network and secure your financial future with consistent passive income.')}</p>
              <div className="flex gap-4 mt-4">
                <Button>{t('home.hero.buttons.getStarted', 'Get Started Today')}</Button>
                <Button variant="outline">{t('home.hero.buttons.learn', 'Learn More')}</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-100 rounded">
            <p className="text-sm">
              <strong>Note:</strong> Check the browser console (F12) for detailed i18next debug logs.
              If translations show fallback values, check Network tab for 404 errors on JSON files.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestTranslation;