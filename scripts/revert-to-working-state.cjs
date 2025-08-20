const fs = require('fs');
const path = require('path');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🔄 Reverting to Working Multi-Namespace Configuration...${colors.reset}\n`);

// Step 1: Fix i18n.ts configuration
console.log(`${colors.blue}Step 1: Restoring i18n.ts configuration...${colors.reset}`);
const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
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
    debug: false, // Set to true for debugging
    
    // Multiple namespaces for better organization
    ns: ['common', 'home', 'forms', 'products', 'blog', 'navigation', 'footer', 'errors'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false // React already escapes
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: true,
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    supportedLngs: ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'],
    
    react: {
      useSuspense: false
    }
  });

export default i18n;
`;

fs.writeFileSync(i18nPath, i18nConfig);
console.log(`  ${colors.green}✅ i18n.ts restored to multi-namespace configuration${colors.reset}`);

// Step 2: Fix specific components that have issues
console.log(`\n${colors.blue}Step 2: Fixing specific component issues...${colors.reset}`);

// Fix Hero component - should use 'home' namespace
const heroPath = path.join(__dirname, '..', 'src', 'components', 'Hero.tsx');
if (fs.existsSync(heroPath)) {
  let heroContent = fs.readFileSync(heroPath, 'utf8');
  heroContent = heroContent.replace(
    "const { t } = useTranslation();",
    "const { t } = useTranslation('home');"
  );
  // Fix translation keys - remove 'home.' prefix since we're using namespace
  heroContent = heroContent.replace(/t\('home\./g, "t('");
  fs.writeFileSync(heroPath, heroContent);
  console.log(`  ${colors.green}✅ Fixed Hero.tsx${colors.reset}`);
}

// Fix Footer component - should use 'footer' namespace  
const footerPath = path.join(__dirname, '..', 'src', 'components', 'Footer.tsx');
if (fs.existsSync(footerPath)) {
  let footerContent = fs.readFileSync(footerPath, 'utf8');
  footerContent = footerContent.replace(
    "const { t } = useTranslation();",
    "const { t } = useTranslation('footer');"
  );
  footerContent = footerContent.replace(/t\('footer\./g, "t('");
  fs.writeFileSync(footerPath, footerContent);
  console.log(`  ${colors.green}✅ Fixed Footer.tsx${colors.reset}`);
}

// Fix Services component - should use 'home' namespace
const servicesPath = path.join(__dirname, '..', 'src', 'components', 'Services.tsx');
if (fs.existsSync(servicesPath)) {
  let servicesContent = fs.readFileSync(servicesPath, 'utf8');
  servicesContent = servicesContent.replace(
    "const { t } = useTranslation();",
    "const { t } = useTranslation('home');"
  );
  servicesContent = servicesContent.replace(/t\('home\./g, "t('");
  fs.writeFileSync(servicesPath, servicesContent);
  console.log(`  ${colors.green}✅ Fixed Services.tsx${colors.reset}`);
}

// Fix CaptchaProtection - keep without namespace (uses common)
const captchaPath = path.join(__dirname, '..', 'src', 'components', 'ui', 'captcha-protection.tsx');
if (fs.existsSync(captchaPath)) {
  let captchaContent = fs.readFileSync(captchaPath, 'utf8');
  // Make sure hook is at component level (already fixed)
  // Use 'forms' namespace for form-related translations
  captchaContent = captchaContent.replace(
    "const { t } = useTranslation();",
    "const { t } = useTranslation('forms');"
  );
  fs.writeFileSync(captchaPath, captchaContent);
  console.log(`  ${colors.green}✅ Fixed captcha-protection.tsx${colors.reset}`);
}

// Step 3: Remove the problematic translation.json files
console.log(`\n${colors.blue}Step 3: Removing merged translation.json files...${colors.reset}`);
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = fs.readdirSync(localesDir).filter(f => 
  fs.statSync(path.join(localesDir, f)).isDirectory()
);

languages.forEach(lang => {
  const translationFile = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(translationFile)) {
    fs.unlinkSync(translationFile);
    console.log(`  ${colors.green}✅ Removed ${lang}/translation.json${colors.reset}`);
  }
});

// Step 4: Verify namespace files exist
console.log(`\n${colors.blue}Step 4: Verifying namespace files...${colors.reset}`);
const requiredNamespaces = ['common', 'home', 'forms', 'navigation', 'footer'];

languages.forEach(lang => {
  requiredNamespaces.forEach(ns => {
    const nsFile = path.join(localesDir, lang, `${ns}.json`);
    if (!fs.existsSync(nsFile)) {
      console.log(`  ${colors.yellow}⚠ Missing: ${lang}/${ns}.json${colors.reset}`);
    }
  });
});

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                    REVERT COMPLETE${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ System restored to multi-namespace configuration${colors.reset}`);
console.log(`${colors.green}✅ Component hooks fixed${colors.reset}`);
console.log(`${colors.green}✅ Translation files cleaned up${colors.reset}`);

console.log(`\n${colors.blue}📝 Next Steps:${colors.reset}`);
console.log(`1. Clear browser cache and localStorage:`);
console.log(`   ${colors.yellow}localStorage.clear(); location.reload();${colors.reset}`);
console.log(`2. Restart dev server if needed`);
console.log(`3. Test language switching`);
console.log(`4. Verify no console errors`);

console.log(`\n${colors.yellow}⚠️ Important:${colors.reset}`);
console.log(`The system is now using MULTIPLE namespaces as originally designed.`);
console.log(`Components use: useTranslation('namespace') pattern`);
console.log(`Translation keys don't need namespace prefix within components`);

console.log(`\n${colors.green}✅ Revert complete! The system should now work properly.${colors.reset}\n`);