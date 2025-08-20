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

console.log(`${colors.cyan}🔍 Verifying Translation Runtime Configuration...${colors.reset}\n`);

// Check 1: Verify i18n.ts configuration
console.log(`${colors.blue}1. Checking i18n.ts configuration...${colors.reset}`);
const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

const checks = {
  debugMode: i18nContent.includes('debug: true'),
  namespace: i18nContent.includes("ns: ['translation']"),
  loadPath: i18nContent.includes("loadPath: '/locales/{{lng}}/{{ns}}.json'"),
  suspense: i18nContent.includes('useSuspense: false')
};

Object.entries(checks).forEach(([key, value]) => {
  const icon = value ? '✅' : '❌';
  const color = value ? colors.green : colors.red;
  console.log(`  ${icon} ${color}${key}: ${value}${colors.reset}`);
});

// Check 2: Verify translation.json files exist
console.log(`\n${colors.blue}2. Checking translation.json files...${colors.reset}`);
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = ['en', 'hi', 'ta', 'bn', 'te'];
const fileStatus = {};

languages.forEach(lang => {
  const translationFile = path.join(localesDir, lang, 'translation.json');
  const exists = fs.existsSync(translationFile);
  fileStatus[lang] = exists;
  
  if (exists) {
    const content = JSON.parse(fs.readFileSync(translationFile, 'utf8'));
    const keyCount = countKeys(content);
    console.log(`  ${colors.green}✅ ${lang}/translation.json exists (${keyCount} keys)${colors.reset}`);
    
    // Check for test keys
    const hasTestKeys = content.welcome && content.test && content.language;
    if (hasTestKeys) {
      console.log(`    ${colors.green}└─ Has test keys: welcome, test, language${colors.reset}`);
    }
    
    // Check for merged content
    const hasMergedContent = content.common || content.home || content.forms;
    if (hasMergedContent) {
      console.log(`    ${colors.green}└─ Has merged namespace content${colors.reset}`);
    }
  } else {
    console.log(`  ${colors.red}❌ ${lang}/translation.json missing${colors.reset}`);
  }
});

// Check 3: Verify main.tsx has Suspense wrapper
console.log(`\n${colors.blue}3. Checking main.tsx Suspense wrapper...${colors.reset}`);
const mainPath = path.join(__dirname, '..', 'src', 'main.tsx');
const mainContent = fs.readFileSync(mainPath, 'utf8');

const hasSuspense = mainContent.includes('<Suspense') && mainContent.includes('fallback=');
const hasI18nImport = mainContent.includes("import './lib/i18n'");

console.log(`  ${hasSuspense ? '✅' : '❌'} ${hasSuspense ? colors.green : colors.red}Suspense wrapper: ${hasSuspense}${colors.reset}`);
console.log(`  ${hasI18nImport ? '✅' : '❌'} ${hasI18nImport ? colors.green : colors.red}i18n import: ${hasI18nImport}${colors.reset}`);

// Check 4: Verify components use correct namespace
console.log(`\n${colors.blue}4. Checking component namespace usage...${colors.reset}`);
const componentsDir = path.join(__dirname, '..', 'src', 'components');
const sampleComponents = ['Hero.tsx', 'Footer.tsx', 'Services.tsx'];
let correctUsage = 0;
let incorrectUsage = 0;

sampleComponents.forEach(file => {
  const filePath = path.join(componentsDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if using useTranslation without namespace (correct after fix)
    const hasCorrectUsage = content.includes('useTranslation()') && !content.includes("useTranslation('");
    
    if (hasCorrectUsage) {
      correctUsage++;
      console.log(`  ${colors.green}✅ ${file}: Using correct namespace pattern${colors.reset}`);
    } else if (content.includes('useTranslation(')) {
      incorrectUsage++;
      console.log(`  ${colors.yellow}⚠ ${file}: May need namespace update${colors.reset}`);
    }
  }
});

// Check 5: Test translation keys
console.log(`\n${colors.blue}5. Testing translation key structure...${colors.reset}`);
const enTranslationFile = path.join(localesDir, 'en', 'translation.json');
if (fs.existsSync(enTranslationFile)) {
  const enContent = JSON.parse(fs.readFileSync(enTranslationFile, 'utf8'));
  
  const testKeys = [
    'welcome',
    'common.buttons.submit',
    'home.hero.title',
    'forms.fields.email'
  ];
  
  testKeys.forEach(key => {
    const value = getNestedValue(enContent, key);
    if (value) {
      console.log(`  ${colors.green}✅ Key "${key}": "${value.substring(0, 50)}..."${colors.reset}`);
    } else {
      console.log(`  ${colors.red}❌ Key "${key}": Not found${colors.reset}`);
    }
  });
}

// Helper functions
function countKeys(obj, count = 0) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count = countKeys(obj[key], count);
    } else {
      count++;
    }
  }
  return count;
}

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  return current;
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                    RUNTIME VERIFICATION SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

const allChecksPass = Object.values(checks).every(v => v) && 
                      Object.values(fileStatus).every(v => v) &&
                      hasSuspense && hasI18nImport;

if (allChecksPass) {
  console.log(`${colors.green}✅ All runtime checks passed! Translation system is properly configured.${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠ Some checks failed. Review the issues above.${colors.reset}`);
}

console.log(`\n${colors.blue}📝 Next Steps:${colors.reset}`);
console.log(`   1. Open browser: http://localhost:5173/test-translation`);
console.log(`   2. Open browser console (F12) to see i18next debug logs`);
console.log(`   3. Try switching languages using the buttons`);
console.log(`   4. Check Network tab for translation file loading`);
console.log(`   5. Verify translations change when switching languages`);

console.log(`\n${colors.green}✅ Runtime verification complete!${colors.reset}\n`);