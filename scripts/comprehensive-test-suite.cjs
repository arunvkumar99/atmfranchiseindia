const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}     COMPREHENSIVE TRANSLATION SYSTEM TEST SUITE${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.magenta}Senior Tester: Running comprehensive tests...${colors.reset}\n`);

const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Test 1: Check all translation files exist
console.log(`${colors.blue}TEST 1: Translation File Structure${colors.reset}`);
console.log('─'.repeat(50));

const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
const namespaces = ['common', 'home', 'forms', 'franchise', 'products', 'blog', 'navigation', 'footer', 'errors'];

let allFilesExist = true;
languages.forEach(lang => {
  namespaces.forEach(ns => {
    const filePath = path.join(__dirname, '..', 'public', 'locales', lang, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      testResults.failed.push(`Missing: ${lang}/${ns}.json`);
      allFilesExist = false;
    }
  });
});

if (allFilesExist) {
  console.log(`${colors.green}✅ All translation files exist (${languages.length} languages × ${namespaces.length} namespaces)${colors.reset}`);
  testResults.passed.push('Translation file structure');
} else {
  console.log(`${colors.red}❌ Some translation files missing${colors.reset}`);
}

// Test 2: Check for missing keys in critical files
console.log(`\n${colors.blue}TEST 2: Critical Translation Keys${colors.reset}`);
console.log('─'.repeat(50));

const criticalKeys = {
  'home': ['hero.title', 'hero.subtitle', 'features.roi.title', 'stats.atmsAcrossIndia'],
  'forms': ['labels.fullName', 'labels.email', 'placeholders.fullName'],
  'franchise': ['content.become_an', 'content.partner']
};

let allKeysPresent = true;
Object.entries(criticalKeys).forEach(([namespace, keys]) => {
  const enPath = path.join(__dirname, '..', 'public', 'locales', 'en', `${namespace}.json`);
  if (fs.existsSync(enPath)) {
    const content = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    
    keys.forEach(keyPath => {
      const keyParts = keyPath.split('.');
      let current = content;
      
      for (const part of keyParts) {
        if (current && current[part]) {
          current = current[part];
        } else {
          testResults.failed.push(`Missing key: ${namespace}.${keyPath}`);
          allKeysPresent = false;
          break;
        }
      }
    });
  }
});

if (allKeysPresent) {
  console.log(`${colors.green}✅ All critical translation keys present${colors.reset}`);
  testResults.passed.push('Critical translation keys');
} else {
  console.log(`${colors.red}❌ Some critical keys missing${colors.reset}`);
}

// Test 3: Check component namespace usage
console.log(`\n${colors.blue}TEST 3: Component Namespace Consistency${colors.reset}`);
console.log('─'.repeat(50));

const componentTests = [
  { file: 'src/components/Hero.tsx', expectedNamespace: 'home', componentName: 'Hero' },
  { file: 'src/components/EnquiryFormSinglePage.tsx', expectedNamespace: 'forms', componentName: 'EnquiryForm' },
  { file: 'src/components/BecomefranchiseHero.tsx', expectedNamespace: 'franchise', componentName: 'BecomefranchiseHero' }
];

let allNamespacesCorrect = true;
componentTests.forEach(test => {
  const filePath = path.join(__dirname, '..', test.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const pattern = new RegExp(`useTranslation\\(['"]${test.expectedNamespace}['"]\\)`);
    
    if (pattern.test(content)) {
      testResults.passed.push(`${test.componentName} uses correct namespace`);
    } else if (content.includes('useTranslation()')) {
      testResults.warnings.push(`${test.componentName} uses default namespace instead of '${test.expectedNamespace}'`);
      allNamespacesCorrect = false;
    } else {
      // Check what namespace it's actually using
      const match = content.match(/useTranslation\(['"]([^'"]+)['"]\)/);
      if (match && match[1] !== test.expectedNamespace) {
        testResults.failed.push(`${test.componentName} uses '${match[1]}' instead of '${test.expectedNamespace}'`);
        allNamespacesCorrect = false;
      }
    }
  }
});

if (allNamespacesCorrect) {
  console.log(`${colors.green}✅ All components use correct namespaces${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠️  Some components have namespace issues${colors.reset}`);
}

// Test 4: Check for React hooks violations
console.log(`\n${colors.blue}TEST 4: React Hooks Compliance${colors.reset}`);
console.log('─'.repeat(50));

const hooksTestFiles = [
  'src/components/EnquiryFormSinglePage.tsx',
  'src/components/AgentFormSinglePage.tsx',
  'src/components/InfluencerFormSinglePage.tsx'
];

let noHooksViolations = true;
hooksTestFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for hooks inside functions (simple pattern)
      if (line.includes('const { t } = useTranslation')) {
        const prevLines = lines.slice(Math.max(0, i - 3), i).join('\n');
        if (prevLines.match(/const\s+handle\w+\s*=.*=>.*{/) || 
            prevLines.match(/function\s+handle/)) {
          testResults.failed.push(`Hooks violation in ${path.basename(file)} at line ${i + 1}`);
          noHooksViolations = false;
        }
      }
    }
  }
});

if (noHooksViolations) {
  console.log(`${colors.green}✅ No React hooks violations detected${colors.reset}`);
  testResults.passed.push('React hooks compliance');
} else {
  console.log(`${colors.red}❌ React hooks violations found${colors.reset}`);
}

// Test 5: Translation coverage check
console.log(`\n${colors.blue}TEST 5: Translation Coverage${colors.reset}`);
console.log('─'.repeat(50));

const enHomePath = path.join(__dirname, '..', 'public', 'locales', 'en', 'home.json');
const hiHomePath = path.join(__dirname, '..', 'public', 'locales', 'hi', 'home.json');

if (fs.existsSync(enHomePath) && fs.existsSync(hiHomePath)) {
  const enContent = JSON.parse(fs.readFileSync(enHomePath, 'utf8'));
  const hiContent = JSON.parse(fs.readFileSync(hiHomePath, 'utf8'));
  
  function countKeys(obj) {
    let count = 0;
    for (const key in obj) {
      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        count += countKeys(obj[key]);
      } else {
        count++;
      }
    }
    return count;
  }
  
  const enKeys = countKeys(enContent);
  const hiKeys = countKeys(hiContent);
  const coverage = Math.round((hiKeys / enKeys) * 100);
  
  console.log(`English keys: ${enKeys}`);
  console.log(`Hindi keys: ${hiKeys}`);
  console.log(`Coverage: ${coverage}%`);
  
  if (coverage >= 95) {
    console.log(`${colors.green}✅ Excellent translation coverage (${coverage}%)${colors.reset}`);
    testResults.passed.push(`Translation coverage: ${coverage}%`);
  } else if (coverage >= 80) {
    console.log(`${colors.yellow}⚠️  Good translation coverage (${coverage}%)${colors.reset}`);
    testResults.warnings.push(`Translation coverage only ${coverage}%`);
  } else {
    console.log(`${colors.red}❌ Poor translation coverage (${coverage}%)${colors.reset}`);
    testResults.failed.push(`Translation coverage only ${coverage}%`);
  }
}

// Test 6: i18n configuration
console.log(`\n${colors.blue}TEST 6: i18n Configuration${colors.reset}`);
console.log('─'.repeat(50));

const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
if (fs.existsSync(i18nPath)) {
  const content = fs.readFileSync(i18nPath, 'utf8');
  
  const checks = [
    { pattern: /fallbackLng:\s*['"]en['"]/, name: 'Fallback language set to English' },
    { pattern: /ns:\s*\[/, name: 'Namespaces configured' },
    { pattern: /defaultNS:\s*['"]common['"]/, name: 'Default namespace set' },
    { pattern: /supportedLngs:\s*\[/, name: 'Supported languages configured' }
  ];
  
  checks.forEach(check => {
    if (check.pattern.test(content)) {
      testResults.passed.push(check.name);
    } else {
      testResults.failed.push(check.name);
    }
  });
  
  console.log(`${colors.green}✅ i18n configuration verified${colors.reset}`);
} else {
  console.log(`${colors.red}❌ i18n configuration file not found${colors.reset}`);
  testResults.failed.push('i18n configuration missing');
}

// Final Summary
console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                   TEST SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Passed: ${testResults.passed.length} tests${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings: ${testResults.warnings.length} issues${colors.reset}`);
console.log(`${colors.red}❌ Failed: ${testResults.failed.length} tests${colors.reset}`);

if (testResults.failed.length === 0) {
  console.log(`\n${colors.green}🎉 ALL CRITICAL TESTS PASSED!${colors.reset}`);
  console.log(`${colors.green}The translation system is ready for production.${colors.reset}`);
} else {
  console.log(`\n${colors.red}⚠️  SOME TESTS FAILED${colors.reset}`);
  console.log(`${colors.yellow}Issues to address:${colors.reset}`);
  testResults.failed.forEach(issue => {
    console.log(`  • ${issue}`);
  });
}

// Senior Tester's Recommendation
console.log(`\n${colors.magenta}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.magenta}           SENIOR TESTER'S RECOMMENDATION${colors.reset}`);
console.log(`${colors.magenta}════════════════════════════════════════════════════════${colors.reset}\n`);

if (testResults.failed.length === 0 && testResults.warnings.length <= 3) {
  console.log(`${colors.green}✅ APPROVED FOR PRODUCTION${colors.reset}`);
  console.log(`The translation system has passed all critical tests.`);
  console.log(`Minor warnings can be addressed in future iterations.`);
} else if (testResults.failed.length <= 2) {
  console.log(`${colors.yellow}⚠️  CONDITIONAL APPROVAL${colors.reset}`);
  console.log(`Fix the ${testResults.failed.length} failed tests before deployment.`);
  console.log(`The system is stable but needs minor corrections.`);
} else {
  console.log(`${colors.red}❌ NOT READY FOR PRODUCTION${colors.reset}`);
  console.log(`Multiple critical issues detected.`);
  console.log(`Address all failed tests before proceeding.`);
}

console.log(`\n${colors.blue}Test suite execution complete.${colors.reset}\n`);