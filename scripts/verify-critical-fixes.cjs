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

console.log(`${colors.cyan}🔍 Verifying Critical Translation Fixes...${colors.reset}\n`);

const fixes = [];

// Fix 1: Check StrategicCrossPageLinks hook placement
console.log(`${colors.blue}1. Checking StrategicCrossPageLinks fix...${colors.reset}`);
const strategicPath = path.join(__dirname, '..', 'src', 'components', 'StrategicCrossPageLinks.tsx');
const strategicContent = fs.readFileSync(strategicPath, 'utf8');

// Check if useTranslation is at component level, not inside nested function
const hasCorrectHookPlacement = strategicContent.includes('export function StrategicCrossPageLinks') &&
                                strategicContent.includes('const { t } = useTranslation();\n  \n  const getRecommendedLinks');

if (hasCorrectHookPlacement) {
  console.log(`  ${colors.green}✅ useTranslation hook correctly placed at component level${colors.reset}`);
  fixes.push({ name: 'StrategicCrossPageLinks Hook', status: 'fixed' });
} else {
  console.log(`  ${colors.red}❌ Hook placement issue may still exist${colors.reset}`);
  fixes.push({ name: 'StrategicCrossPageLinks Hook', status: 'error' });
}

// Fix 2: Check ErrorBoundary hook placement
console.log(`\n${colors.blue}2. Checking ErrorBoundary fix...${colors.reset}`);
const errorBoundaryPath = path.join(__dirname, '..', 'src', 'components', 'ErrorBoundary.tsx');
const errorBoundaryContent = fs.readFileSync(errorBoundaryPath, 'utf8');

// Check if useTranslation is at component level in AsyncErrorBoundary
const hasCorrectErrorBoundaryHook = errorBoundaryContent.includes('const { t } = useTranslation();\n\n  React.useEffect');

if (hasCorrectErrorBoundaryHook) {
  console.log(`  ${colors.green}✅ useTranslation hook correctly placed in AsyncErrorBoundary${colors.reset}`);
  fixes.push({ name: 'ErrorBoundary Hook', status: 'fixed' });
} else {
  console.log(`  ${colors.red}❌ Hook placement issue in AsyncErrorBoundary${colors.reset}`);
  fixes.push({ name: 'ErrorBoundary Hook', status: 'error' });
}

// Fix 3: Check i18n default language configuration
console.log(`\n${colors.blue}3. Checking default language configuration...${colors.reset}`);
const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

const hasEnglishDefault = i18nContent.includes("lng: 'en'") && 
                          i18nContent.includes("fallbackLng: 'en'");
const hasSupportedLangs = i18nContent.includes('supportedLngs:');
const hasWhitelist = i18nContent.includes('whitelist:');

console.log(`  ${hasEnglishDefault ? '✅' : '❌'} English set as default language (lng: 'en')${colors.reset}`);
console.log(`  ${hasSupportedLangs ? '✅' : '❌'} Supported languages configured${colors.reset}`);
console.log(`  ${hasWhitelist ? '✅' : '❌'} Language whitelist configured${colors.reset}`);

if (hasEnglishDefault && hasSupportedLangs) {
  fixes.push({ name: 'Default Language', status: 'fixed' });
} else {
  fixes.push({ name: 'Default Language', status: 'error' });
}

// Fix 4: Check EnsureEnglishDefault component
console.log(`\n${colors.blue}4. Checking EnsureEnglishDefault component...${colors.reset}`);
const ensureEnglishPath = path.join(__dirname, '..', 'src', 'components', 'EnsureEnglishDefault.tsx');
const ensureEnglishExists = fs.existsSync(ensureEnglishPath);

if (ensureEnglishExists) {
  console.log(`  ${colors.green}✅ EnsureEnglishDefault component created${colors.reset}`);
  
  // Check if it's imported in App.tsx
  const appPath = path.join(__dirname, '..', 'src', 'App.tsx');
  const appContent = fs.readFileSync(appPath, 'utf8');
  const isImported = appContent.includes("import { EnsureEnglishDefault }");
  const isUsed = appContent.includes("<EnsureEnglishDefault />");
  
  console.log(`  ${isImported ? '✅' : '❌'} Component imported in App.tsx${colors.reset}`);
  console.log(`  ${isUsed ? '✅' : '❌'} Component used in App.tsx${colors.reset}`);
  
  if (isImported && isUsed) {
    fixes.push({ name: 'EnsureEnglishDefault', status: 'fixed' });
  } else {
    fixes.push({ name: 'EnsureEnglishDefault', status: 'partial' });
  }
} else {
  console.log(`  ${colors.red}❌ EnsureEnglishDefault component not found${colors.reset}`);
  fixes.push({ name: 'EnsureEnglishDefault', status: 'error' });
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                    CRITICAL FIXES SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

const allFixed = fixes.every(f => f.status === 'fixed');
const hasErrors = fixes.some(f => f.status === 'error');

fixes.forEach(fix => {
  const icon = fix.status === 'fixed' ? '✅' : fix.status === 'partial' ? '⚠️' : '❌';
  const color = fix.status === 'fixed' ? colors.green : fix.status === 'partial' ? colors.yellow : colors.red;
  console.log(`  ${icon} ${color}${fix.name}: ${fix.status.toUpperCase()}${colors.reset}`);
});

console.log(`\n${colors.blue}📝 Browser Console Fix:${colors.reset}`);
console.log(`   If language is still wrong, run this in browser console:`);
console.log(`   ${colors.yellow}localStorage.setItem('i18nextLng', 'en'); location.reload();${colors.reset}`);

console.log(`\n${colors.blue}📋 Testing Checklist:${colors.reset}`);
console.log(`   1. Clear browser cache and localStorage`);
console.log(`   2. Visit homepage - should load in English`);
console.log(`   3. Navigate between pages - no console errors`);
console.log(`   4. Switch languages - should work correctly`);
console.log(`   5. Refresh page - language should persist`);

if (allFixed) {
  console.log(`\n${colors.green}✅ All critical fixes successfully applied!${colors.reset}`);
} else if (hasErrors) {
  console.log(`\n${colors.red}❌ Some fixes may need attention. Review the issues above.${colors.reset}`);
} else {
  console.log(`\n${colors.yellow}⚠️ Fixes partially applied. Some manual steps may be needed.${colors.reset}`);
}

console.log(`\n${colors.green}✅ Verification complete!${colors.reset}\n`);