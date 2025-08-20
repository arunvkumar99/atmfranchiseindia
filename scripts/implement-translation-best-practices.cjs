const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

console.log(`${colors.cyan}🎯 Implementing Translation Best Practices...${colors.reset}\n`);

// Step 1: Create ESLint rules for translation enforcement
const eslintConfigPath = path.join(__dirname, '..', '.eslintrc.json');
let eslintConfig = {};

if (fs.existsSync(eslintConfigPath)) {
  eslintConfig = JSON.parse(fs.readFileSync(eslintConfigPath, 'utf8'));
} else {
  // Create new config if doesn't exist
  eslintConfig = {
    extends: ["react-app"],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks"]
  };
}

// Add custom rules for translations
eslintConfig.rules = eslintConfig.rules || {};
Object.assign(eslintConfig.rules, {
  // Warn about hardcoded text in JSX
  "react/jsx-no-literals": ["warn", {
    "noStrings": true,
    "ignoreProps": true,
    "allowedStrings": ["•", "×", "–", "—", "€", "$", "£", "¥", "₹", "%", "&", "|", "/", "\\", "-", "+", "=", ">", "<", ":", ";", ",", ".", "?", "!", "(", ")", "[", "]", "{", "}"]
  }],
  // Ensure useTranslation is used in components with text
  "no-restricted-syntax": [
    "warn",
    {
      "selector": "JSXText[value=/[a-zA-Z]{2,}/]",
      "message": "Use translation function t() instead of hardcoded text"
    }
  ]
});

fs.writeFileSync(eslintConfigPath, JSON.stringify(eslintConfig, null, 2));
console.log(`${colors.green}✅ Created/Updated .eslintrc.json with translation rules${colors.reset}`);

// Step 2: Create a translation helper utility
const translationHelperPath = path.join(__dirname, '..', 'src', 'lib', 'translationHelper.ts');
const translationHelperContent = `/**
 * Translation Helper Utilities
 * Best practices for i18n implementation
 */

import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

/**
 * Custom hook with automatic namespace detection
 * @param namespace - Optional namespace, defaults to component path
 */
export function useAppTranslation(namespace?: string) {
  const ns = namespace || detectNamespace();
  const { t, i18n } = useTranslation(ns);
  
  return {
    t: createSafeTranslation(t),
    i18n,
    currentLanguage: i18n.language,
    changeLanguage: i18n.changeLanguage,
  };
}

/**
 * Detect namespace based on component file path
 */
function detectNamespace(): string {
  // In production, use a default namespace
  if (process.env.NODE_ENV === 'production') {
    return 'common';
  }
  
  // In development, try to detect from stack trace
  try {
    const stack = new Error().stack;
    if (stack) {
      const match = stack.match(/at\\s+\\w+\\s+\\(.*[\\/\\\\](pages|components)[\\/\\\\](\\w+)/);
      if (match && match[2]) {
        return match[2].toLowerCase();
      }
    }
  } catch (e) {
    // Fallback to common namespace
  }
  
  return 'common';
}

/**
 * Create a safe translation function with fallback
 */
function createSafeTranslation(t: TFunction) {
  return (key: string, fallback?: string, options?: any) => {
    const translated = t(key, options);
    
    // If translation key is returned as-is, use fallback
    if (translated === key && fallback) {
      console.warn(\`Missing translation for key: \${key}\`);
      return fallback;
    }
    
    return translated;
  };
}

/**
 * Format currency with locale support
 */
export function formatCurrency(amount: number, currency = 'INR'): string {
  const locale = localStorage.getItem('i18nextLng') || 'en';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date with locale support
 */
export function formatDate(date: Date | string, format = 'medium'): string {
  const locale = localStorage.getItem('i18nextLng') || 'en';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    short: { month: 'short', day: 'numeric', year: 'numeric' },
    medium: { month: 'long', day: 'numeric', year: 'numeric' },
    long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
  }[format] || { month: 'long', day: 'numeric', year: 'numeric' };
  
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

/**
 * Format number with locale support
 */
export function formatNumber(num: number): string {
  const locale = localStorage.getItem('i18nextLng') || 'en';
  return new Intl.NumberFormat(locale).format(num);
}

/**
 * Get direction for RTL languages
 */
export function getTextDirection(): 'ltr' | 'rtl' {
  const lang = localStorage.getItem('i18nextLng') || 'en';
  const rtlLanguages = ['ar', 'ur', 'fa', 'he'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
}

/**
 * Translation key generator for forms
 */
export function formKey(section: string, field: string, type: 'label' | 'placeholder' | 'error' = 'label'): string {
  return \`forms.\${section}.\${field}.\${type}\`;
}

/**
 * Batch translation loader for performance
 */
export async function preloadTranslations(languages: string[], namespaces: string[]) {
  const promises = languages.flatMap(lang =>
    namespaces.map(ns =>
      fetch(\`/locales/\${lang}/\${ns}.json\`)
        .then(res => res.json())
        .catch(err => {
          console.error(\`Failed to preload \${lang}/\${ns}:\`, err);
          return {};
        })
    )
  );
  
  return Promise.all(promises);
}

export default {
  useAppTranslation,
  formatCurrency,
  formatDate,
  formatNumber,
  getTextDirection,
  formKey,
  preloadTranslations,
};
`;

fs.writeFileSync(translationHelperPath, translationHelperContent);
console.log(`${colors.green}✅ Created translation helper utilities${colors.reset}`);

// Step 3: Create a translation validation script
const validationScriptPath = path.join(__dirname, 'validate-translations.cjs');
const validationScriptContent = `const fs = require('fs');
const path = require('path');

// Validate that all languages have the same keys
function validateTranslations() {
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir).filter(f => 
    fs.statSync(path.join(localesDir, f)).isDirectory()
  );
  
  const enDir = path.join(localesDir, 'en');
  const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  
  const issues = [];
  
  enFiles.forEach(file => {
    const enPath = path.join(enDir, file);
    const enKeys = getAllKeys(JSON.parse(fs.readFileSync(enPath, 'utf8')));
    
    languages.forEach(lang => {
      if (lang === 'en') return;
      
      const langPath = path.join(localesDir, lang, file);
      if (!fs.existsSync(langPath)) {
        issues.push(\`Missing file: \${lang}/\${file}\`);
        return;
      }
      
      const langKeys = getAllKeys(JSON.parse(fs.readFileSync(langPath, 'utf8')));
      const missingKeys = enKeys.filter(key => !langKeys.includes(key));
      const extraKeys = langKeys.filter(key => !enKeys.includes(key));
      
      if (missingKeys.length > 0) {
        issues.push(\`\${lang}/\${file} missing keys: \${missingKeys.join(', ')}\`);
      }
      if (extraKeys.length > 0) {
        issues.push(\`\${lang}/\${file} extra keys: \${extraKeys.join(', ')}\`);
      }
    });
  });
  
  return issues;
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? \`\${prefix}.\${key}\` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Run validation
const issues = validateTranslations();

if (issues.length > 0) {
  console.log('\\n❌ Translation validation issues found:');
  issues.forEach(issue => console.log(\`  - \${issue}\`));
  process.exit(1);
} else {
  console.log('\\n✅ All translations are valid and consistent!');
}
`;

fs.writeFileSync(validationScriptPath, validationScriptContent);
console.log(`${colors.green}✅ Created translation validation script${colors.reset}`);

// Step 4: Create a translation namespace guide
const guideContent = `# Translation Best Practices Guide

## Namespace Organization

### Current Namespaces:
- **common**: Shared UI elements (buttons, labels, messages)
- **home**: Homepage specific content
- **forms**: All form labels, placeholders, and validation messages
- **navigation**: Menu items and navigation elements
- **footer**: Footer content
- **errors**: Error messages and alerts

## Key Naming Conventions

### Hierarchical Structure:
\`\`\`json
{
  "section": {
    "subsection": {
      "element": {
        "property": "value"
      }
    }
  }
}
\`\`\`

### Examples:
- \`home.hero.title\` - Homepage hero title
- \`forms.fields.email.label\` - Email field label
- \`forms.fields.email.placeholder\` - Email field placeholder
- \`forms.validation.emailInvalid\` - Email validation error

## Component Implementation

### ✅ Correct Implementation:
\`\`\`tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('namespace');
  
  return (
    <div>
      <h1>{t('title', 'Fallback Title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};
\`\`\`

### ❌ Common Mistakes:
1. **Hardcoded text in JSX**
2. **Using t() inside loops without unique keys**
3. **String concatenation with translations**
4. **Missing fallback values**

## Performance Optimization

### 1. Lazy Load Translations:
\`\`\`tsx
// Only load needed namespaces
const { t } = useTranslation(['forms', 'common']);
\`\`\`

### 2. Memoize Translations:
\`\`\`tsx
const translatedTitle = useMemo(
  () => t('title'),
  [t, i18n.language]
);
\`\`\`

### 3. Use Trans Component for Complex HTML:
\`\`\`tsx
<Trans i18nKey="termsAndConditions">
  I agree to the <Link to="/terms">Terms & Conditions</Link>
</Trans>
\`\`\`

## Testing Translations

### 1. Run validation script:
\`\`\`bash
npm run validate:translations
\`\`\`

### 2. Check coverage:
\`\`\`bash
npm run audit:translations
\`\`\`

### 3. Test all languages:
\`\`\`bash
npm run test:languages
\`\`\`

## Adding New Translations

### 1. Add to English first:
\`\`\`bash
# Edit public/locales/en/namespace.json
\`\`\`

### 2. Run auto-translate:
\`\`\`bash
npm run translate:all
\`\`\`

### 3. Validate consistency:
\`\`\`bash
npm run validate:translations
\`\`\`

## Debugging

### Check missing translations:
\`\`\`javascript
// Enable debug mode in i18n.ts
debug: true,
saveMissing: true,
\`\`\`

### Browser console helpers:
\`\`\`javascript
// Check current language
i18n.language

// Change language
i18n.changeLanguage('hi')

// Get available languages
i18n.languages
\`\`\`
`;

const guidePath = path.join(__dirname, '..', 'TRANSLATION_BEST_PRACTICES.md');
fs.writeFileSync(guidePath, guideContent);
console.log(`${colors.green}✅ Created translation best practices guide${colors.reset}`);

// Step 5: Update package.json with new scripts
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = packageJson.scripts || {};
Object.assign(packageJson.scripts, {
  "validate:translations": "node scripts/validate-translations.cjs",
  "audit:translations": "node scripts/comprehensive-translation-check.cjs",
  "fix:translations": "node scripts/fix-all-forms-translations.cjs",
  "lint:translations": "eslint src --ext .tsx,.ts --rule 'react/jsx-no-literals: error'",
  "translate:missing": "node scripts/auto-translate-missing.cjs"
});

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log(`${colors.green}✅ Updated package.json with translation scripts${colors.reset}`);

// Step 6: Create a pre-commit hook for translation validation
const huskyPath = path.join(__dirname, '..', '.husky', 'pre-commit');
const huskyContent = `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run translation validation before commit
npm run validate:translations

# Run ESLint with translation rules
npm run lint:translations

# Check for hardcoded texts
node scripts/comprehensive-translation-check.cjs --silent || echo "Warning: Hardcoded texts detected"
`;

// Create .husky directory if it doesn't exist
const huskyDir = path.join(__dirname, '..', '.husky');
if (!fs.existsSync(huskyDir)) {
  fs.mkdirSync(huskyDir, { recursive: true });
}

fs.writeFileSync(huskyPath, huskyContent);
if (process.platform !== 'win32') {
  fs.chmodSync(huskyPath, '755');
}
console.log(`${colors.green}✅ Created pre-commit hook for translation validation${colors.reset}`);

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}           TRANSLATION BEST PRACTICES IMPLEMENTATION${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Implemented:${colors.reset}`);
console.log(`   1. ESLint rules for detecting hardcoded text`);
console.log(`   2. Translation helper utilities with best practices`);
console.log(`   3. Translation validation script`);
console.log(`   4. Comprehensive best practices guide`);
console.log(`   5. NPM scripts for translation management`);
console.log(`   6. Pre-commit hooks for validation`);

console.log(`\n${colors.yellow}📝 Next Steps:${colors.reset}`);
console.log(`   1. Run: npm run validate:translations`);
console.log(`   2. Run: npm run lint:translations`);
console.log(`   3. Read: TRANSLATION_BEST_PRACTICES.md`);
console.log(`   4. Configure your IDE to use .eslintrc.json`);

console.log(`\n${colors.magenta}🎯 Best Practices Summary:${colors.reset}`);
console.log(`   • Always use t() function for user-facing text`);
console.log(`   • Provide fallback values for critical text`);
console.log(`   • Use proper namespace organization`);
console.log(`   • Follow hierarchical key naming`);
console.log(`   • Test all language switches before deployment`);
console.log(`   • Run validation scripts before commits`);

console.log(`\n${colors.green}✅ Translation best practices implementation complete!${colors.reset}\n`);