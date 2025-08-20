const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Function to check if text is likely hardcoded (not a variable or prop)
function isHardcodedText(text) {
  // Skip if it's too short or just punctuation
  if (text.length < 3) return false;
  
  // Skip if it's a number or special format
  if (/^\d+$/.test(text)) return false;
  if (/^[A-Z0-9_]+$/.test(text)) return false; // Likely a constant
  if (/^(true|false|null|undefined)$/.test(text)) return false;
  
  // Skip common code patterns
  if (text.includes('{') || text.includes('}')) return false;
  if (text.startsWith('$') || text.startsWith('#')) return false;
  
  // Check if it contains actual words (likely user-facing text)
  return /[a-zA-Z]{2,}/.test(text);
}

// Function to analyze a component file
function analyzeComponentFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const issues = {
    file: filePath,
    hasUseTranslation: false,
    useTranslationUsed: false,
    tFunctionCalls: 0,
    hardcodedTexts: [],
    missingNamespace: false,
    bestPracticeViolations: []
  };
  
  // Check if useTranslation is imported
  issues.hasUseTranslation = /import\s+{[^}]*useTranslation[^}]*}\s+from\s+['"]react-i18next/.test(content);
  
  // Check if useTranslation is actually used
  issues.useTranslationUsed = /const\s+{\s*t[^}]*}\s*=\s*useTranslation/.test(content);
  
  // Count t() function calls
  const tCalls = content.match(/\bt\(['"]/g);
  issues.tFunctionCalls = tCalls ? tCalls.length : 0;
  
  // Check for namespace usage
  if (issues.useTranslationUsed) {
    const namespaceMatch = content.match(/useTranslation\(['"]([^'"]+)['"]\)/);
    if (!namespaceMatch) {
      issues.missingNamespace = true;
      issues.bestPracticeViolations.push('Missing namespace in useTranslation()');
    }
  }
  
  // Find hardcoded texts in JSX
  const jsxTextPattern = />([^<>{}\n]+)</g;
  const buttonTextPattern = /<Button[^>]*>([^<]+)</g;
  const labelPattern = /label[=:][\s]*["']([^"']+)["']/g;
  const placeholderPattern = /placeholder[=:]?[\s]*["']([^"']+)["']/g;
  const titlePattern = /title[=:]?[\s]*["']([^"']+)["']/g;
  const altPattern = /alt[=:]?[\s]*["']([^"']+)["']/g;
  const valuePattern = /value[=:]?[\s]*["']([^"']+)["']/g;
  const headingPattern = /<h[1-6][^>]*>([^<]+)</g;
  const paragraphPattern = /<p[^>]*>([^<]+)</g;
  const spanPattern = /<span[^>]*>([^<]+)</g;
  
  const patterns = [
    jsxTextPattern,
    buttonTextPattern,
    labelPattern,
    placeholderPattern,
    titlePattern,
    altPattern,
    headingPattern,
    paragraphPattern,
    spanPattern
  ];
  
  const foundTexts = new Set();
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1].trim();
      if (isHardcodedText(text) && !text.includes('t(')) {
        foundTexts.add(text);
      }
    }
  });
  
  // Also check for hardcoded strings in arrays/objects
  const stringArrayPattern = /['"]([^'"]{3,})['"](?:\s*,|\s*\]|\s*})/g;
  let match;
  while ((match = stringArrayPattern.exec(content)) !== null) {
    const text = match[1].trim();
    if (isHardcodedText(text) && !content.includes(`t('${text}')`) && !content.includes(`t("${text}")`)) {
      foundTexts.add(text);
    }
  }
  
  issues.hardcodedTexts = Array.from(foundTexts);
  
  // Check for best practice violations
  if (issues.hasUseTranslation && !issues.useTranslationUsed) {
    issues.bestPracticeViolations.push('useTranslation imported but not used');
  }
  
  if (issues.useTranslationUsed && issues.tFunctionCalls === 0) {
    issues.bestPracticeViolations.push('t function obtained but never called');
  }
  
  if (issues.hardcodedTexts.length > 0 && !issues.hasUseTranslation) {
    issues.bestPracticeViolations.push('Component has text but no translation setup');
  }
  
  // Check for common anti-patterns
  if (/t\([^)]*\+[^)]*\)/.test(content)) {
    issues.bestPracticeViolations.push('String concatenation inside t() - use interpolation instead');
  }
  
  if (/dangerouslySetInnerHTML.*t\(/.test(content)) {
    issues.bestPracticeViolations.push('Using t() with dangerouslySetInnerHTML - security risk');
  }
  
  return issues;
}

// Function to get all component files
function getAllComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      getAllComponentFiles(filePath, fileList);
    } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && !file.includes('.test.') && !file.includes('.spec.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to check translation JSON completeness
function checkTranslationCompleteness() {
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());
  const enDir = path.join(localesDir, 'en');
  
  if (!fs.existsSync(enDir)) {
    console.log(`${colors.red}❌ English translations not found!${colors.reset}`);
    return {};
  }
  
  const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  const completeness = {};
  
  languages.forEach(lang => {
    if (lang === 'en') return;
    
    completeness[lang] = {
      total: 0,
      translated: 0,
      missing: []
    };
    
    enFiles.forEach(file => {
      const enPath = path.join(enDir, file);
      const langPath = path.join(localesDir, lang, file);
      
      if (!fs.existsSync(langPath)) {
        completeness[lang].missing.push(file);
        return;
      }
      
      const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      const langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      
      const enKeys = countKeys(enContent);
      const langKeys = countKeys(langContent);
      
      completeness[lang].total += enKeys;
      completeness[lang].translated += langKeys;
    });
    
    completeness[lang].percentage = completeness[lang].total > 0 
      ? Math.round((completeness[lang].translated / completeness[lang].total) * 100)
      : 0;
  });
  
  return completeness;
}

// Helper function to count keys in nested object
function countKeys(obj, count = 0) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      count = countKeys(obj[key], count);
    } else {
      count++;
    }
  }
  return count;
}

// Main execution
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}     COMPREHENSIVE TRANSLATION AUDIT - ATM FRANCHISE INDIA${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

const srcDir = path.join(__dirname, '..', 'src');
const componentFiles = getAllComponentFiles(srcDir);

console.log(`${colors.blue}📊 Analyzing ${componentFiles.length} component files...${colors.reset}\n`);

const stats = {
  totalFiles: componentFiles.length,
  filesWithTranslation: 0,
  filesUsingTranslation: 0,
  totalHardcodedTexts: 0,
  totalTFunctionCalls: 0,
  filesWithIssues: 0,
  bestPracticeViolations: 0,
  topOffenders: []
};

const allIssues = [];

componentFiles.forEach(file => {
  const issues = analyzeComponentFile(file);
  allIssues.push(issues);
  
  if (issues.hasUseTranslation) stats.filesWithTranslation++;
  if (issues.useTranslationUsed) stats.filesUsingTranslation++;
  stats.totalHardcodedTexts += issues.hardcodedTexts.length;
  stats.totalTFunctionCalls += issues.tFunctionCalls;
  
  if (issues.hardcodedTexts.length > 0 || issues.bestPracticeViolations.length > 0) {
    stats.filesWithIssues++;
    stats.bestPracticeViolations += issues.bestPracticeViolations.length;
  }
  
  if (issues.hardcodedTexts.length > 5) {
    stats.topOffenders.push({
      file: path.relative(process.cwd(), file),
      count: issues.hardcodedTexts.length
    });
  }
});

// Sort top offenders
stats.topOffenders.sort((a, b) => b.count - a.count);

// Print component analysis results
console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.yellow}COMPONENT TRANSLATION STATUS${colors.reset}`);
console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

console.log(`${colors.green}✅ Translation Setup:${colors.reset}`);
console.log(`   Files with useTranslation imported: ${stats.filesWithTranslation}/${stats.totalFiles} (${Math.round(stats.filesWithTranslation/stats.totalFiles*100)}%)`);
console.log(`   Files actually using translations: ${stats.filesUsingTranslation}/${stats.totalFiles} (${Math.round(stats.filesUsingTranslation/stats.totalFiles*100)}%)`);
console.log(`   Total t() function calls: ${stats.totalTFunctionCalls}`);

console.log(`\n${colors.red}❌ Issues Found:${colors.reset}`);
console.log(`   Files with issues: ${stats.filesWithIssues}`);
console.log(`   Total hardcoded texts: ${stats.totalHardcodedTexts}`);
console.log(`   Best practice violations: ${stats.bestPracticeViolations}`);

if (stats.topOffenders.length > 0) {
  console.log(`\n${colors.magenta}🔥 Top Files with Hardcoded Text:${colors.reset}`);
  stats.topOffenders.slice(0, 10).forEach((offender, i) => {
    console.log(`   ${i + 1}. ${offender.file} (${offender.count} hardcoded texts)`);
  });
}

// Check translation completeness
console.log(`\n${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.yellow}TRANSLATION FILE COMPLETENESS${colors.reset}`);
console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

const completeness = checkTranslationCompleteness();
Object.entries(completeness).forEach(([lang, data]) => {
  const color = data.percentage > 90 ? colors.green : data.percentage > 70 ? colors.yellow : colors.red;
  console.log(`   ${lang.toUpperCase()}: ${color}${data.percentage}%${colors.reset} (${data.translated}/${data.total} keys)`);
  if (data.missing.length > 0) {
    console.log(`      Missing files: ${data.missing.join(', ')}`);
  }
});

// Print best practice violations details
console.log(`\n${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.yellow}BEST PRACTICE VIOLATIONS${colors.reset}`);
console.log(`${colors.yellow}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

const violationTypes = {};
allIssues.forEach(issue => {
  issue.bestPracticeViolations.forEach(violation => {
    violationTypes[violation] = (violationTypes[violation] || 0) + 1;
  });
});

Object.entries(violationTypes).forEach(([violation, count]) => {
  console.log(`   ${colors.red}⚠${colors.reset}  ${violation}: ${count} occurrences`);
});

// Generate actionable recommendations
console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
console.log(`${colors.cyan}RECOMMENDATIONS${colors.reset}`);
console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

const recommendations = [];

if (stats.totalHardcodedTexts > 100) {
  recommendations.push('1. Priority: Fix hardcoded texts in components - ' + stats.totalHardcodedTexts + ' instances found');
}

if (stats.filesWithTranslation < stats.totalFiles * 0.8) {
  recommendations.push('2. Add translation support to remaining ' + (stats.totalFiles - stats.filesWithTranslation) + ' components');
}

if (stats.bestPracticeViolations > 10) {
  recommendations.push('3. Address ' + stats.bestPracticeViolations + ' best practice violations');
}

if (Object.keys(completeness).some(lang => completeness[lang].percentage < 80)) {
  recommendations.push('4. Complete translations for languages below 80%');
}

recommendations.push('5. Implement automated translation testing in CI/CD pipeline');
recommendations.push('6. Add ESLint rules to catch hardcoded text');
recommendations.push('7. Create translation keys naming convention guide');

recommendations.forEach(rec => {
  console.log(`   ${colors.green}→${colors.reset} ${rec}`);
});

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

const overallScore = Math.round(
  (stats.filesUsingTranslation / stats.totalFiles * 40) +
  (stats.totalTFunctionCalls > 500 ? 30 : stats.totalTFunctionCalls / 500 * 30) +
  (1 - stats.totalHardcodedTexts / 1000) * 30
);

const scoreColor = overallScore > 70 ? colors.green : overallScore > 50 ? colors.yellow : colors.red;
console.log(`   Overall Translation Implementation Score: ${scoreColor}${overallScore}%${colors.reset}`);
console.log(`   Translation Coverage: ${Math.round(stats.filesUsingTranslation/stats.totalFiles*100)}%`);
console.log(`   Code Quality: ${stats.bestPracticeViolations < 10 ? '✅ Good' : stats.bestPracticeViolations < 30 ? '⚠️  Needs Improvement' : '❌ Poor'}`);
console.log(`   Ready for Production: ${overallScore > 70 && stats.totalHardcodedTexts < 100 ? '✅ Yes' : '❌ No'}`);

// Export detailed report
const report = {
  timestamp: new Date().toISOString(),
  stats,
  completeness,
  issues: allIssues.filter(i => i.hardcodedTexts.length > 0 || i.bestPracticeViolations.length > 0),
  recommendations
};

fs.writeFileSync(
  path.join(__dirname, '..', 'translation-audit-detailed.json'),
  JSON.stringify(report, null, 2)
);

console.log(`\n${colors.blue}📄 Detailed report saved to: translation-audit-detailed.json${colors.reset}\n`);