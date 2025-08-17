import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';

interface ValidationResult {
  component: string;
  namespace: string;
  keys: string[];
  missingKeys: string[];
  status: 'success' | 'partial' | 'error';
}

export const TranslationValidator = () => {
  const { t, i18n } = useTranslation();
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const componentsToCheck = [
    {
      name: 'Header',
      namespace: 'common',
      keys: ['nav.home', 'nav.aboutUs', 'nav.ourProducts', 'nav.submitLocation', 'nav.becomeFranchise']
    },
    {
      name: 'Hero',
      namespace: 'home',
      keys: ['hero.title', 'hero.subtitle', 'hero.submitLocation', 'hero.becomeFranchise']
    },
    {
      name: 'WhyATM',
      namespace: 'home',
      keys: ['whyAtm.title', 'whyAtm.subtitle', 'whyAtm.stats.roi.label', 'whyAtm.stats.penetration.label']
    },
    {
      name: 'Services',
      namespace: 'home',
      keys: ['services.title', 'services.subtitle', 'services.consultation.title', 'services.consultation.description']
    },
    {
      name: 'FAQ',
      namespace: 'home',
      keys: ['faq.title', 'faq.subtitle', 'faq.questions.q1.question', 'faq.questions.q1.answer']
    },
    {
      name: 'Footer',
      namespace: 'common',
      keys: ['footer.company.name', 'footer.company.tagline', 'footer.quickLinksTitle', 'footer.servicesTitle']
    },
    {
      name: 'TrustSignals',
      namespace: 'home',
      keys: ['trustSignals.title', 'trustSignals.subtitle', 'trustSignals.metrics.partners', 'trustSignals.metrics.uptime']
    },
    {
      name: 'Testimonials',
      namespace: 'home',
      keys: ['testimonials.badge', 'testimonials.title', 'testimonials.subtitle', 'testimonials.items.0.name']
    }
  ];

  const validateTranslations = async () => {
    setIsValidating(true);
    const results: ValidationResult[] = [];

    for (const component of componentsToCheck) {
      const missingKeys: string[] = [];
      
      // Load the namespace
      await i18n.loadNamespaces(component.namespace);
      
      // Check each key
      for (const key of component.keys) {
        const fullKey = `${component.namespace}:${key}`;
        const translation = t(fullKey);
        
        // If translation equals the key, it's missing
        if (translation === fullKey || translation === key) {
          missingKeys.push(key);
        }
      }

      results.push({
        component: component.name,
        namespace: component.namespace,
        keys: component.keys,
        missingKeys,
        status: missingKeys.length === 0 ? 'success' : 
                missingKeys.length < component.keys.length ? 'partial' : 'error'
      });
    }

    setValidationResults(results);
    setIsValidating(false);
  };

  useEffect(() => {
    validateTranslations();
  }, [i18n.language]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed bottom-20 left-4 bg-white border-2 border-blue-500 rounded-lg p-4 shadow-lg z-50 max-w-lg max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Translation Validator</h3>
        <button
          onClick={validateTranslations}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          disabled={isValidating}
        >
          {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Revalidate'}
        </button>
      </div>

      <div className="mb-4 p-2 bg-gray-100 rounded">
        <p className="text-sm">
          <strong>Current Language:</strong> {i18n.language}
        </p>
        <p className="text-sm">
          <strong>Loaded Namespaces:</strong> {Object.keys(i18n.store.data[i18n.language] || {}).join(', ') || 'None'}
        </p>
      </div>

      <div className="space-y-2">
        {validationResults.map((result) => (
          <div
            key={result.component}
            className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold flex items-center gap-2">
                {getStatusIcon(result.status)}
                {result.component}
              </h4>
              <span className="text-xs text-gray-600">
                {result.namespace}
              </span>
            </div>
            
            <div className="text-xs">
              <p className="text-gray-700">
                Checked: {result.keys.length} keys
              </p>
              {result.missingKeys.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-600 font-semibold">Missing Keys:</p>
                  <ul className="list-disc list-inside text-red-500">
                    {result.missingKeys.map((key) => (
                      <li key={key}>{key}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <h4 className="font-semibold text-sm mb-2">Quick Test:</h4>
        <div className="space-y-1 text-xs">
          <p><strong>nav.home:</strong> {t('common:nav.home')}</p>
          <p><strong>hero.title:</strong> {t('home:hero.title')}</p>
          <p><strong>whyAtm.title:</strong> {t('home:whyAtm.title')}</p>
        </div>
      </div>

      {!isValidating && validationResults.length > 0 && (
        <div className="mt-4 text-xs text-gray-600">
          <p>
            ✅ Success: {validationResults.filter(r => r.status === 'success').length} |
            ⚠️ Partial: {validationResults.filter(r => r.status === 'partial').length} |
            ❌ Error: {validationResults.filter(r => r.status === 'error').length}
          </p>
        </div>
      )}
    </div>
  );
};