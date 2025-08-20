const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  bold: '\x1b[1m'
};

console.log(`${colors.cyan}${colors.bold}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}${colors.bold}     TEAM LEAD RAVI - DEEP TRANSLATION AUDIT${colors.reset}`);
console.log(`${colors.cyan}${colors.bold}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.magenta}Ravi: Let's cut the BS and see what's really happening...${colors.reset}\n`);

const issues = {
  critical: [],
  major: [],
  minor: [],
  suspicious: []
};

// Test 1: Check if translations actually exist and have content
console.log(`${colors.blue}${colors.bold}TEST 1: Checking Translation Files Content${colors.reset}`);
console.log('─'.repeat(50));

const languages = ['en', 'hi', 'bn', 'ta'];
const namespaces = ['home', 'forms', 'franchise', 'common', 'products'];
let emptyTranslations = 0;
let missingFiles = 0;
let totalKeys = 0;
let translatedKeys = 0;

namespaces.forEach(ns => {
  languages.forEach(lang => {
    const filePath = path.join(__dirname, '..', 'public', 'locales', lang, `${ns}.json`);
    
    if (!fs.existsSync(filePath)) {
      issues.critical.push(`Missing: ${lang}/${ns}.json`);
      missingFiles++;
    } else {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        function countKeys(obj) {
          let count = 0;
          for (const key in obj) {
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
              count += countKeys(obj[key]);
            } else {
              count++;
              totalKeys++;
              
              // Check if it's actually translated or just English
              if (lang !== 'en' && typeof obj[key] === 'string') {
                // Simple check - if it contains only ASCII characters, might be untranslated
                if (!/[^\x00-\x7F]/.test(obj[key])) {
                  issues.suspicious.push(`Possible untranslated: ${lang}/${ns}.json - "${key}": "${obj[key]}"`);
                } else {
                  translatedKeys++;
                }
              }
            }
          }
          return count;
        }
        
        const keyCount = countKeys(content);
        if (keyCount === 0) {
          issues.major.push(`Empty file: ${lang}/${ns}.json`);
          emptyTranslations++;
        } else if (keyCount < 5) {
          issues.major.push(`Sparse content: ${lang}/${ns}.json (only ${keyCount} keys)`);
        }
        
      } catch (e) {
        issues.critical.push(`Invalid JSON: ${lang}/${ns}.json`);
      }
    }
  });
});

const translationCoverage = totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;

console.log(`Missing files: ${colors.red}${missingFiles}${colors.reset}`);
console.log(`Empty translations: ${colors.yellow}${emptyTranslations}${colors.reset}`);
console.log(`Translation coverage (non-English): ${translationCoverage < 50 ? colors.red : colors.green}${translationCoverage}%${colors.reset}`);

if (translationCoverage < 30) {
  issues.critical.push(`Translation coverage is only ${translationCoverage}% - Most content is NOT translated!`);
}

// Test 2: Check components for actual translation usage
console.log(`\n${colors.blue}${colors.bold}TEST 2: Component Translation Usage Analysis${colors.reset}`);
console.log('─'.repeat(50));

const componentsDir = path.join(__dirname, '..', 'src', 'components');
const pagesDir = path.join(__dirname, '..', 'src', 'pages');
let hardcodedTextCount = 0;
let componentsWithHardcodedText = [];

function scanForHardcodedText(dir, isRecursive = true) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && isRecursive && !file.includes('node_modules')) {
      scanForHardcodedText(filePath);
    } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && !file.includes('.test.')) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Look for hardcoded text in JSX
      const hardcodedPatterns = [
        />([A-Z][a-z]+[\s\w]+)</g,  // Text starting with capital letter
        /placeholder="[A-Z]/g,       // Placeholder text
        /title="[A-Z]/g,            // Title attributes
        /alt="[A-Z]/g,              // Alt text
        /label="[A-Z]/g,            // Label text
        />\s*["']([A-Z][a-z]+[\s\w]+)["']\s*</g  // String literals in JSX
      ];
      
      let localHardcodedCount = 0;
      hardcodedPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          localHardcodedCount += matches.length;
        }
      });
      
      // Check if component uses useTranslation but still has hardcoded text
      const usesTranslation = content.includes('useTranslation');
      
      if (localHardcodedCount > 5) {
        if (usesTranslation) {
          issues.major.push(`${file} uses translations but has ${localHardcodedCount}+ hardcoded strings`);
        } else {
          issues.critical.push(`${file} has ${localHardcodedCount}+ hardcoded strings and NO translation usage`);
        }
        componentsWithHardcodedText.push(file);
        hardcodedTextCount += localHardcodedCount;
      }
    }
  });
}

scanForHardcodedText(componentsDir);
scanForHardcodedText(pagesDir);

console.log(`Components with hardcoded text: ${colors.red}${componentsWithHardcodedText.length}${colors.reset}`);
console.log(`Total hardcoded strings (estimate): ${colors.red}${hardcodedTextCount}+${colors.reset}`);

// Test 3: Check for common mistakes
console.log(`\n${colors.blue}${colors.bold}TEST 3: Common Translation Mistakes${colors.reset}`);
console.log('─'.repeat(50));

const testFiles = [
  'src/components/Hero.tsx',
  'src/components/EnquiryFormSinglePage.tsx',
  'src/pages/JoinUsPage.tsx',
  'src/pages/OurProducts.tsx'
];

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for t() with missing fallback
    const tCallsNoFallback = content.match(/t\(['"][^'"]+['"]\)\s*[,\)]/g);
    if (tCallsNoFallback && tCallsNoFallback.length > 5) {
      issues.minor.push(`${file} has ${tCallsNoFallback.length} t() calls without fallback text`);
    }
    
    // Check for multiple useTranslation calls
    const translationCalls = content.match(/useTranslation/g);
    if (translationCalls && translationCalls.length > 1) {
      issues.major.push(`${file} has ${translationCalls.length} useTranslation calls (should be 1)`);
    }
    
    // Check for inconsistent namespace usage
    const namespaceMatch = content.match(/useTranslation\(['"]([^'"]+)['"]\)/);
    if (namespaceMatch) {
      const namespace = namespaceMatch[1];
      const tCalls = content.match(/t\(['"]([^'"]+)['"]/g);
      if (tCalls) {
        tCalls.forEach(call => {
          if (call.includes('.') && !call.includes(`${namespace}.`)) {
            issues.suspicious.push(`${file} might be using wrong namespace in: ${call}`);
          }
        });
      }
    }
  }
});

// Test 4: Performance and Best Practices
console.log(`\n${colors.blue}${colors.bold}TEST 4: Performance & Best Practices${colors.reset}`);
console.log('─'.repeat(50));

// Check i18n config
const i18nPath = path.join(__dirname, '..', 'src', 'lib', 'i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

if (!i18nContent.includes('react: { useSuspense: false }')) {
  issues.major.push('i18n not configured with useSuspense: false - will cause loading issues');
}

if (!i18nContent.includes('load: "languageOnly"')) {
  issues.minor.push('i18n not optimized for language-only loading');
}

// Check for translation file sizes
let totalTranslationSize = 0;
languages.forEach(lang => {
  const localeDir = path.join(__dirname, '..', 'public', 'locales', lang);
  if (fs.existsSync(localeDir)) {
    const files = fs.readdirSync(localeDir);
    files.forEach(file => {
      const stats = fs.statSync(path.join(localeDir, file));
      totalTranslationSize += stats.size;
    });
  }
});

const sizeMB = (totalTranslationSize / 1024 / 1024).toFixed(2);
console.log(`Total translation files size: ${sizeMB > 1 ? colors.yellow : colors.green}${sizeMB} MB${colors.reset}`);

if (sizeMB > 2) {
  issues.major.push(`Translation files too large (${sizeMB} MB) - will impact performance`);
}

// FINAL VERDICT
console.log(`\n${colors.cyan}${colors.bold}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}${colors.bold}                    RAVI'S VERDICT${colors.reset}`);
console.log(`${colors.cyan}${colors.bold}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.red}${colors.bold}CRITICAL ISSUES: ${issues.critical.length}${colors.reset}`);
issues.critical.slice(0, 5).forEach(issue => {
  console.log(`  ❌ ${issue}`);
});

console.log(`\n${colors.yellow}${colors.bold}MAJOR ISSUES: ${issues.major.length}${colors.reset}`);
issues.major.slice(0, 5).forEach(issue => {
  console.log(`  ⚠️  ${issue}`);
});

console.log(`\n${colors.blue}MINOR ISSUES: ${issues.minor.length}${colors.reset}`);
console.log(`${colors.blue}SUSPICIOUS PATTERNS: ${issues.suspicious.length}${colors.reset}`);

console.log(`\n${colors.magenta}${colors.bold}TEAM LEAD ASSESSMENT:${colors.reset}`);

const totalIssues = issues.critical.length + issues.major.length;

if (issues.critical.length > 5) {
  console.log(`${colors.red}${colors.bold}❌ NOT PRODUCTION READY${colors.reset}`);
  console.log(`\nThe translation system is fundamentally broken:`);
  console.log(`- Translation coverage is abysmal (${translationCoverage}%)`);
  console.log(`- ${componentsWithHardcodedText.length} components still have hardcoded text`);
  console.log(`- Critical files are missing or empty`);
  console.log(`\n${colors.red}This is NOT ready for production. Period.${colors.reset}`);
} else if (totalIssues > 10) {
  console.log(`${colors.yellow}${colors.bold}⚠️  MAJOR CONCERNS${colors.reset}`);
  console.log(`\nThe system has significant issues:`);
  console.log(`- Many components aren't properly internationalized`);
  console.log(`- Translation coverage is poor`);
  console.log(`- Needs substantial work before production`);
} else {
  console.log(`${colors.green}${colors.bold}✓ ACCEPTABLE WITH FIXES${colors.reset}`);
  console.log(`\nThe core system works but needs:`);
  console.log(`- Complete translation content`);
  console.log(`- Remove remaining hardcoded text`);
  console.log(`- Performance optimization`);
}

console.log(`\n${colors.cyan}${colors.bold}RECOMMENDED ACTIONS:${colors.reset}`);
console.log(`1. ${colors.red}STOP claiming it's production ready${colors.reset}`);
console.log(`2. Actually translate the content (not just English everywhere)`);
console.log(`3. Fix the ${componentsWithHardcodedText.length} components with hardcoded text`);
console.log(`4. Implement proper fallback strategies`);
console.log(`5. Test with actual users who speak these languages`);

console.log(`\n${colors.magenta}Ravi out. Fix this properly or don't ship it.${colors.reset}\n`);