import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TranslationVerify = () => {
  const { t, i18n } = useTranslation(['home', 'common']);
  
  const testKeys = [
    { namespace: 'home', key: 'hero.title', component: 'Hero' },
    { namespace: 'home', key: 'hero.subtitle', component: 'Hero' },
    { namespace: 'home', key: 'testimonials.title', component: 'Testimonials' },
    { namespace: 'home', key: 'testimonials.subtitle', component: 'Testimonials' },
    { namespace: 'home', key: 'whyAtm.title', component: 'WhyATM' },
    { namespace: 'home', key: 'whyAtm.subtitle', component: 'WhyATM' },
    { namespace: 'common', key: 'footer.quickLinks', component: 'Footer' },
    { namespace: 'common', key: 'footer.copyright', component: 'Footer' },
    { namespace: 'home', key: 'services.title', component: 'WhyATMFranchiseIndia' },
    { namespace: 'home', key: 'services.subtitle', component: 'WhyATMFranchiseIndia' },
  ];
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
  ];
  
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };
  
  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Translation Verification Dashboard</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Language: {i18n.language}</h2>
          <div className="flex gap-2">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`px-4 py-2 rounded ${
                  i18n.language === lang.code 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Translation Keys Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testKeys.map((item, index) => {
                const value = t(`${item.namespace}:${item.key}`, { returnDetails: true });
                const isTranslated = typeof value === 'string' && !value.includes(item.key);
                
                return (
                  <div key={index} className="border-b pb-4">
                    <div className="flex items-start gap-2">
                      {isTranslated ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.component}</span>
                          <span className="text-sm text-gray-500">{item.namespace}:{item.key}</span>
                        </div>
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                          <span className="text-sm">
                            {typeof value === 'string' ? value : JSON.stringify(value)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Language Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {languages.map(lang => (
                <div key={lang.code} className="text-center">
                  <h3 className="font-semibold mb-2">{lang.name}</h3>
                  <button
                    onClick={() => changeLanguage(lang.code)}
                    className="text-blue-500 hover:underline"
                  >
                    Test {lang.name}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <div className="flex gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-semibold text-yellow-800">Instructions</h3>
              <p className="text-sm text-yellow-700 mt-1">
                1. Click on language buttons to switch languages<br/>
                2. Green checkmarks indicate properly translated keys<br/>
                3. Red X marks indicate missing or untranslated keys<br/>
                4. The text shown is what will be displayed in the component
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslationVerify;