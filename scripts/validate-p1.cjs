const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}           P1 VALIDATION CHECK${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

const validationResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Check P1 components
const p1Components = [
  {
    name: 'Hero.tsx',
    path: 'src/components/Hero.tsx',
    expectedNamespace: 'home',
    critical: true
  },
  {
    name: 'Home.tsx (Page)',
    path: 'src/pages/Home.tsx',
    expectedNamespace: 'home',
    critical: true
  },
  {
    name: 'SubmitLocationHero.tsx',
    path: 'src/components/SubmitLocationHero.tsx',
    expectedNamespace: 'forms',
    critical: true
  },
  {
    name: 'SubmitLocationSinglePage.tsx',
    path: 'src/components/SubmitLocationSinglePage.tsx',
    expectedNamespace: 'forms',
    critical: true
  },
  {
    name: 'SubmitLocationProgressive.tsx',
    path: 'src/components/SubmitLocationProgressive.tsx',
    expectedNamespace: 'forms',
    critical: true
  },
  {
    name: 'SubmitLocation.tsx (Page)',
    path: 'src/pages/SubmitLocation.tsx',
    expectedNamespace: 'forms',
    critical: true
  }
];

console.log(`${colors.blue}Checking P1 Components...${colors.reset}\n`);

p1Components.forEach(component => {
  const filePath = path.join(__dirname, '..', component.path);
  
  if (!fs.existsSync(filePath)) {
    validationResults.failed.push(`${component.name} - File not found`);
    console.log(`❌ ${component.name}: File not found`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for correct namespace usage
  const namespacePattern = new RegExp(`useTranslation\\(['"]${component.expectedNamespace}['"]\\)`);
  const hasCorrectNamespace = namespacePattern.test(content);
  
  // Check for any useTranslation without namespace
  const hasDefaultNamespace = content.includes('useTranslation()');
  
  if (hasCorrectNamespace) {
    validationResults.passed.push(`${component.name} - Correct namespace`);
    console.log(`✅ ${component.name}: Using '${component.expectedNamespace}' namespace`);
  } else if (hasDefaultNamespace) {
    if (component.critical) {
      validationResults.failed.push(`${component.name} - Using default namespace`);
      console.log(`❌ ${component.name}: Still using default namespace`);
    } else {
      validationResults.warnings.push(`${component.name} - Using default namespace`);
      console.log(`⚠️  ${component.name}: Using default namespace`);
    }
  } else {
    // Check what namespace it's actually using
    const match = content.match(/useTranslation\(['"]([^'"]+)['"]\)/);
    if (match) {
      if (match[1] !== component.expectedNamespace) {
        validationResults.warnings.push(`${component.name} - Using '${match[1]}' instead of '${component.expectedNamespace}'`);
        console.log(`⚠️  ${component.name}: Using '${match[1]}' namespace (expected '${component.expectedNamespace}')`);
      }
    } else if (content.includes('useTranslation')) {
      validationResults.warnings.push(`${component.name} - Unknown namespace pattern`);
      console.log(`⚠️  ${component.name}: Unknown translation pattern`);
    }
  }
});

// Check if translation files exist
console.log(`\n${colors.blue}Checking Translation Files...${colors.reset}\n`);

const requiredFiles = [
  'public/locales/en/home.json',
  'public/locales/en/forms.json',
  'public/locales/hi/home.json',
  'public/locales/hi/forms.json'
];

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} exists`);
    validationResults.passed.push(`Translation file: ${file}`);
  } else {
    console.log(`❌ ${file} missing`);
    validationResults.failed.push(`Missing translation file: ${file}`);
  }
});

// Summary
console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                 VALIDATION SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

const totalPassed = validationResults.passed.length;
const totalFailed = validationResults.failed.length;
const totalWarnings = validationResults.warnings.length;

console.log(`${colors.green}✅ Passed: ${totalPassed}${colors.reset}`);
console.log(`${colors.red}❌ Failed: ${totalFailed}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings: ${totalWarnings}${colors.reset}`);

if (totalFailed === 0) {
  console.log(`\n${colors.green}✅ P1 VALIDATION PASSED${colors.reset}`);
  console.log(`\n${colors.cyan}Ready for testing in browser!${colors.reset}`);
  console.log(`\n${colors.blue}Test Instructions:${colors.reset}`);
  console.log(`1. Clear browser cache: ${colors.yellow}localStorage.clear()${colors.reset}`);
  console.log(`2. Navigate to home page: ${colors.yellow}http://localhost:5173/${colors.reset}`);
  console.log(`3. Check for console errors`);
  console.log(`4. Navigate to submit location: ${colors.yellow}http://localhost:5173/submit-location${colors.reset}`);
  console.log(`5. Check for console errors`);
  console.log(`6. Test language switching on both pages`);
} else {
  console.log(`\n${colors.red}❌ P1 VALIDATION FAILED${colors.reset}`);
  console.log(`\n${colors.yellow}Issues must be fixed before testing${colors.reset}`);
  
  if (validationResults.failed.length > 0) {
    console.log(`\n${colors.red}Failed items:${colors.reset}`);
    validationResults.failed.forEach(item => {
      console.log(`  • ${item}`);
    });
  }
}

console.log(`\n${colors.cyan}Validation complete.${colors.reset}\n`);