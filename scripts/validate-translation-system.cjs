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

console.log(`${colors.cyan}🔍 Comprehensive Translation System Validation${colors.reset}\n`);

const results = {
  passed: [],
  warnings: [],
  failed: []
};

// Test 1: Check i18n configuration
console.log(`${colors.blue}Test 1: i18n Configuration${colors.reset}`);
const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

if (i18nContent.includes("ns: ['common', 'home', 'forms', 'products', 'blog'")) {
  results.passed.push('i18n uses multi-namespace configuration');
  console.log(`  ${colors.green}✅ Multi-namespace configuration${colors.reset}`);
} else {
  results.failed.push('i18n not using multi-namespace');
  console.log(`  ${colors.red}❌ Wrong namespace configuration${colors.reset}`);
}

// Test 2: Check all required namespaces exist
console.log(`\n${colors.blue}Test 2: Translation Files${colors.reset}`);
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const requiredNamespaces = ['common', 'home', 'forms', 'franchise', 'products', 'blog'];
const languages = ['en', 'hi'];

let allFilesExist = true;
languages.forEach(lang => {
  requiredNamespaces.forEach(ns => {
    const filePath = path.join(localesDir, lang, `${ns}.json`);
    if (!fs.existsSync(filePath)) {
      results.warnings.push(`Missing ${lang}/${ns}.json`);
      allFilesExist = false;
    }
  });
});

if (allFilesExist) {
  results.passed.push('All core translation files exist');
  console.log(`  ${colors.green}✅ All core translation files present${colors.reset}`);
} else {
  console.log(`  ${colors.yellow}⚠ Some translation files missing${colors.reset}`);
}

// Test 3: Check component namespace consistency
console.log(`\n${colors.blue}Test 3: Component Namespace Usage${colors.reset}`);
const componentTests = [
  { name: 'Hero', path: 'components/Hero.tsx', expectedNs: 'home' },
  { name: 'Footer', path: 'components/Footer.tsx', expectedNs: 'footer' },
  { name: 'Services', path: 'components/Services.tsx', expectedNs: 'home' },
  { name: 'BecomefranchiseHero', path: 'components/BecomefranchiseHero.tsx', expectedNs: 'franchise' },
  { name: 'FAQ', path: 'components/FAQ.tsx', expectedNs: 'common' }
];

componentTests.forEach(test => {
  const filePath = path.join(__dirname, '..', 'src', test.path);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const pattern = new RegExp(`useTranslation\\(['"]${test.expectedNs}['"]\\)`);
    
    if (pattern.test(content)) {
      results.passed.push(`${test.name} uses correct namespace`);
      console.log(`  ${colors.green}✅ ${test.name}: '${test.expectedNs}' namespace${colors.reset}`);
    } else if (content.includes('useTranslation()')) {
      results.warnings.push(`${test.name} uses default namespace instead of '${test.expectedNs}'`);
      console.log(`  ${colors.yellow}⚠ ${test.name}: default namespace (expected '${test.expectedNs}')${colors.reset}`);
    } else {
      results.failed.push(`${test.name} namespace check failed`);
      console.log(`  ${colors.red}❌ ${test.name}: namespace issue${colors.reset}`);
    }
  }
});

// Test 4: Check for duplicate imports
console.log(`\n${colors.blue}Test 4: Duplicate Imports${colors.reset}`);
const srcDir = path.join(__dirname, '..', 'src');

function checkDuplicates(dir) {
  let hasDuplicates = false;
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      if (checkDuplicates(fullPath)) hasDuplicates = true;
    } else if ((file.endsWith('.tsx') || file.endsWith('.ts')) && !hasDuplicates) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      const imports = {};
      
      lines.forEach((line, index) => {
        if (line.includes('import') && line.includes('useTranslation')) {
          if (imports['useTranslation']) {
            hasDuplicates = true;
            results.failed.push(`Duplicate import in ${path.relative(srcDir, fullPath)}`);
          }
          imports['useTranslation'] = true;
        }
      });
    }
  });
  
  return hasDuplicates;
}

const hasDuplicates = checkDuplicates(srcDir);
if (!hasDuplicates) {
  results.passed.push('No duplicate imports found');
  console.log(`  ${colors.green}✅ No duplicate imports${colors.reset}`);
} else {
  console.log(`  ${colors.red}❌ Duplicate imports detected${colors.reset}`);
}

// Test 5: Check for hook violations
console.log(`\n${colors.blue}Test 5: React Hook Rules${colors.reset}`);
let hookViolations = 0;

function checkHooks(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      checkHooks(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Check for hooks inside callbacks or conditions
      if (content.match(/useEffect\s*\([^)]*\)\s*{\s*[^}]*use(Translation|State|Context)/)) {
        hookViolations++;
      }
    }
  });
}

checkHooks(srcDir);
if (hookViolations === 0) {
  results.passed.push('No hook violations detected');
  console.log(`  ${colors.green}✅ Hooks follow React rules${colors.reset}`);
} else {
  results.failed.push(`${hookViolations} hook violations found`);
  console.log(`  ${colors.red}❌ ${hookViolations} hook violations${colors.reset}`);
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                      VALIDATION SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ PASSED: ${results.passed.length} tests${colors.reset}`);
results.passed.forEach(msg => console.log(`   • ${msg}`));

if (results.warnings.length > 0) {
  console.log(`\n${colors.yellow}⚠ WARNINGS: ${results.warnings.length} issues${colors.reset}`);
  results.warnings.forEach(msg => console.log(`   • ${msg}`));
}

if (results.failed.length > 0) {
  console.log(`\n${colors.red}❌ FAILED: ${results.failed.length} tests${colors.reset}`);
  results.failed.forEach(msg => console.log(`   • ${msg}`));
}

// Overall status
const overallStatus = results.failed.length === 0 ? 'READY' : 'NEEDS ATTENTION';
const statusColor = results.failed.length === 0 ? colors.green : colors.yellow;

console.log(`\n${statusColor}System Status: ${overallStatus}${colors.reset}`);

if (results.failed.length === 0) {
  console.log(`\n${colors.green}✅ Translation system is properly configured and ready!${colors.reset}`);
  console.log(`\n${colors.blue}To test in browser:${colors.reset}`);
  console.log(`1. Clear cache: localStorage.clear(); location.reload();`);
  console.log(`2. Navigate to /become-franchise`);
  console.log(`3. Check for console errors`);
  console.log(`4. Test language switching`);
} else {
  console.log(`\n${colors.yellow}⚠ Some issues need attention before the system is fully functional.${colors.reset}`);
}

console.log(`\n${colors.cyan}Validation complete.${colors.reset}\n`);