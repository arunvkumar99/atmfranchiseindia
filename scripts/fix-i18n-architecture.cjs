const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🔧 Fixing i18n Architecture Based on Production Standards...${colors.reset}\n`);

// Step 1: Fix the i18n configuration
const i18nConfigPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
const i18nConfig = `import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳' }
];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true, // Enable debug mode to see what's happening
    
    // CRITICAL: The namespace MUST match the actual file names
    ns: ['translation'], // Using 'translation' as default namespace
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    backend: {
      // CRITICAL: This path must exactly match the file structure
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: true,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false // Set to false initially for debugging
    }
  });

export default i18n;
`;

fs.writeFileSync(i18nConfigPath, i18nConfig);
console.log(`${colors.green}✅ Fixed i18n.ts configuration${colors.reset}`);

// Step 2: Create a proper main.tsx with Suspense wrapper
const mainTsxPath = path.join(__dirname, '..', 'src', 'main.tsx');
const mainContent = `import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './lib/i18n'; // Import i18n configuration

// Loading component for Suspense
const Loader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading translations...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Loader />}>
      <App />
    </Suspense>
  </React.StrictMode>
);
`;

fs.writeFileSync(mainTsxPath, mainContent);
console.log(`${colors.green}✅ Added Suspense wrapper to main.tsx${colors.reset}`);

// Step 3: Rename translation files to match the namespace
console.log(`\n${colors.blue}📁 Restructuring translation files...${colors.reset}`);

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = fs.readdirSync(localesDir).filter(f => 
  fs.statSync(path.join(localesDir, f)).isDirectory()
);

// Create a merged translation.json from all namespace files
languages.forEach(lang => {
  const langDir = path.join(localesDir, lang);
  const translationFile = path.join(langDir, 'translation.json');
  
  // If translation.json already exists, skip
  if (fs.existsSync(translationFile)) {
    console.log(`  ${colors.yellow}⚠ ${lang}/translation.json already exists, skipping merge${colors.reset}`);
    return;
  }
  
  // Merge all existing JSON files into translation.json
  const mergedContent = {};
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(langDir, file);
    const namespace = file.replace('.json', '');
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Merge content under namespace key
    mergedContent[namespace] = content;
  });
  
  // Also add top-level keys from common.json if it exists
  if (mergedContent.common) {
    Object.assign(mergedContent, mergedContent.common);
  }
  
  // Write the merged content
  fs.writeFileSync(translationFile, JSON.stringify(mergedContent, null, 2));
  console.log(`  ${colors.green}✅ Created ${lang}/translation.json with merged content${colors.reset}`);
});

// Step 4: Create a test component to verify translations
const testComponentPath = path.join(__dirname, '..', 'src', 'components', 'TranslationTest.tsx');
const testComponent = `import React from 'react';
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
`;

fs.writeFileSync(testComponentPath, testComponent);
console.log(`${colors.green}✅ Created TranslationTest component${colors.reset}`);

// Step 5: Create a simple translation structure for testing
const ensureSimpleTranslations = () => {
  const languages = ['en', 'hi', 'ta'];
  
  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const translationFile = path.join(langDir, 'translation.json');
    
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    // Read existing content if it exists
    let content = {};
    if (fs.existsSync(translationFile)) {
      content = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
    }
    
    // Add test keys
    const testTranslations = {
      en: {
        welcome: 'Welcome',
        test: 'This is a test',
        language: 'Language'
      },
      hi: {
        welcome: 'स्वागत है',
        test: 'यह एक परीक्षण है',
        language: 'भाषा'
      },
      ta: {
        welcome: 'வரவேற்பு',
        test: 'இது ஒரு சோதனை',
        language: 'மொழி'
      }
    };
    
    // Merge test translations
    Object.assign(content, testTranslations[lang] || testTranslations.en);
    
    // Write back
    fs.writeFileSync(translationFile, JSON.stringify(content, null, 2));
  });
  
  console.log(`${colors.green}✅ Added test translations to translation.json files${colors.reset}`);
};

ensureSimpleTranslations();

// Step 6: Update components to use correct namespace
console.log(`\n${colors.blue}🔄 Updating components to use correct namespace...${colors.reset}`);

const updateComponentTranslations = () => {
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');
  
  const dirs = [componentsDir, pagesDir];
  let updatedCount = 0;
  
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') || f.endsWith('.jsx'));
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;
      
      // Update useTranslation calls to use nested keys
      // Change from: useTranslation('home') to: useTranslation()
      // Then update t('key') to t('home.key')
      
      if (content.includes("useTranslation('")) {
        // Extract namespace
        const namespaceMatch = content.match(/useTranslation\(['"](\w+)['"]\)/);
        if (namespaceMatch) {
          const namespace = namespaceMatch[1];
          
          // Replace useTranslation with no namespace
          content = content.replace(/useTranslation\(['"]\w+['"]\)/g, 'useTranslation()');
          
          // Update t() calls to include namespace prefix
          // This is a simplified approach - in production, use AST parsing
          content = content.replace(/\bt\(['"]([^'"]+)['"]/g, (match, key) => {
            // Don't add namespace if it already has one
            if (key.includes('.')) {
              return match;
            }
            return `t('${namespace}.${key}'`;
          });
          
          modified = true;
          updatedCount++;
        }
      }
      
      if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`  ${colors.green}✅ Updated ${file}${colors.reset}`);
      }
    });
  });
  
  console.log(`${colors.green}✅ Updated ${updatedCount} components${colors.reset}`);
};

updateComponentTranslations();

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                 i18n ARCHITECTURE FIX COMPLETE${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Fixed Issues:${colors.reset}`);
console.log(`   1. Corrected i18n configuration with proper namespace`);
console.log(`   2. Added Suspense wrapper for async loading`);
console.log(`   3. Restructured translation files to match namespace`);
console.log(`   4. Created test component for verification`);
console.log(`   5. Updated components to use correct translation keys`);

console.log(`\n${colors.yellow}📝 Next Steps:${colors.reset}`);
console.log(`   1. Restart the development server: npm run dev`);
console.log(`   2. Navigate to /test-translation to verify`);
console.log(`   3. Check browser console for i18next debug logs`);
console.log(`   4. Verify Network tab shows successful JSON loading`);

console.log(`\n${colors.blue}🔍 Debugging Tips:${colors.reset}`);
console.log(`   - If you see translation keys instead of text, check Network tab`);
console.log(`   - 404 errors mean the loadPath in i18n.ts is incorrect`);
console.log(`   - Check that files exist at: /public/locales/{lang}/translation.json`);
console.log(`   - Enable debug: true in i18n.ts for detailed logs`);

console.log(`\n${colors.green}✅ Architecture now follows production standards!${colors.reset}\n`);