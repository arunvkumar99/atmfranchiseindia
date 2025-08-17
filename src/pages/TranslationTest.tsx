import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';

const TranslationTest = () => {
  const { t, i18n } = useTranslation(['common', 'home']);

  const testKeys = [
    { key: 'common:nav.home', expected: { en: 'Home', hi: 'घर' } },
    { key: 'common:nav.aboutUs', expected: { en: 'About Us', hi: 'हमारे बारे में' } },
    { key: 'home:hero.title', expected: { en: 'Your ATM – Your Income', hi: 'आपका एटीएम - आपकी आय' } },
    { key: 'home:hero.submitLocation', expected: { en: 'Submit ATM Location', hi: 'एटीएम स्थान सबमिट करें' } },
    { key: 'home:whyAtm.title', expected: { en: 'Why ATM Business?', hi: 'एटीएम व्यवसाय क्यों?' } },
    { key: 'home:stats.atmsAcrossIndia', expected: { en: 'ATMs across India', hi: 'पूरे भारत में एटीएम' } },
  ];

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Translation System Test Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">System Status</h2>
        <div className="space-y-2">
          <p><strong>Current Language:</strong> {i18n.language}</p>
          <p><strong>Loaded Languages:</strong> {i18n.languages.join(', ')}</p>
          <p><strong>Ready:</strong> {i18n.isInitialized ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Namespaces:</strong> {Object.keys(i18n.store.data[i18n.language] || {}).join(', ') || 'None'}</p>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Language Switcher</h2>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LANGUAGES.slice(0, 5).map(lang => (
            <Button
              key={lang.code}
              onClick={() => i18n.changeLanguage(lang.code)}
              variant={i18n.language === lang.code ? 'default' : 'outline'}
              size="sm"
            >
              {lang.flag} {lang.name}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Translation Tests</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">Key</th>
                <th className="border border-gray-300 p-2 text-left">Current Value</th>
                <th className="border border-gray-300 p-2 text-left">Expected ({i18n.language})</th>
                <th className="border border-gray-300 p-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {testKeys.map((test) => {
                const currentValue = t(test.key);
                const expectedValue = test.expected[i18n.language as keyof typeof test.expected] || test.expected.en;
                const isCorrect = currentValue === expectedValue || currentValue !== test.key;
                
                return (
                  <tr key={test.key}>
                    <td className="border border-gray-300 p-2 font-mono text-sm">{test.key}</td>
                    <td className="border border-gray-300 p-2">{currentValue}</td>
                    <td className="border border-gray-300 p-2">{expectedValue}</td>
                    <td className="border border-gray-300 p-2 text-center">
                      {isCorrect ? '✅' : '❌'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Live Component Test</h2>
        <div className="space-y-4 p-4 border rounded-lg">
          <div>
            <h3 className="font-semibold">Navigation Items:</h3>
            <div className="flex gap-4 mt-2">
              <span>{t('common:nav.home')}</span>
              <span>{t('common:nav.aboutUs')}</span>
              <span>{t('common:nav.ourProducts')}</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold">Hero Section:</h3>
            <h1 className="text-2xl font-bold mt-2">{t('home:hero.title')}</h1>
            <p className="mt-2">{t('home:hero.subtitle')}</p>
            <div className="flex gap-4 mt-4">
              <Button>{t('home:hero.submitLocation')}</Button>
              <Button variant="outline">{t('home:hero.becomeFranchise')}</Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold">Stats Section:</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">200+</span>
              <span className="ml-2">{t('home:stats.atmsAcrossIndia')}</span>
              <span className="ml-2 text-gray-600">{t('home:stats.andCounting')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationTest;