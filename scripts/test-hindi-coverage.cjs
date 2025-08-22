const fs = require('fs');
const path = require('path');

console.log('🧪 TESTING HINDI COVERAGE - TEAM LEAD RAVI');
console.log('=' .repeat(60));
console.log('Working Directory: C:/Users/arunv/AppData/Local/Programs/Microsoft VS Code/atmfranchiseindia\n');

// Test all Hindi JSON files
const localesDir = 'public/locales/hi';
const jsonFiles = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

const report = {
  timestamp: new Date().toISOString(),
  totalFiles: jsonFiles.length,
  filesChecked: [],
  totalKeys: 0,
  missingTranslations: [],
  emptyTranslations: [],
  coveragePercent: 0
};

console.log('📁 Checking Hindi JSON files...\n');

jsonFiles.forEach(file => {
  const filePath = path.join(localesDir, file);
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = countKeys(content);
    const empty = findEmptyValues(content, file);
    
    report.filesChecked.push({
      file: file,
      keys: keys,
      hasContent: keys > 0
    });
    
    report.totalKeys += keys;
    
    if (empty.length > 0) {
      report.emptyTranslations.push(...empty);
    }
    
    console.log(`✅ ${file}: ${keys} translation keys`);
  } catch (error) {
    console.log(`❌ ${file}: Error reading file`);
    report.missingTranslations.push(file);
  }
});

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

function findEmptyValues(obj, filename, prefix = '') {
  const empty = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      empty.push(...findEmptyValues(obj[key], filename, fullKey));
    } else if (obj[key] === '' || obj[key] === null) {
      empty.push(`${filename}:${fullKey}`);
    }
  }
  return empty;
}

// Check page components for t() usage
console.log('\n📄 Checking page components for translation usage...\n');

const pagesDir = 'src/pages';
const pageFiles = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const componentReport = [];

pageFiles.forEach(file => {
  const filePath = path.join(pagesDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const hasUseTranslation = content.includes('useTranslation');
  const tFunctionCalls = (content.match(/\bt\(/g) || []).length;
  const hardcodedTexts = findHardcodedTexts(content);
  
  componentReport.push({
    file: file,
    hasTranslation: hasUseTranslation,
    tCalls: tFunctionCalls,
    hardcodedCount: hardcodedTexts.length,
    status: hardcodedTexts.length === 0 ? '✅' : '⚠️'
  });
  
  console.log(`${hardcodedTexts.length === 0 ? '✅' : '⚠️'} ${file}: ${tFunctionCalls} t() calls, ${hardcodedTexts.length} potential hardcoded texts`);
});

function findHardcodedTexts(content) {
  const hardcoded = [];
  const patterns = [
    />([A-Z][^<>{}]+)</g,
    /title="([^"]+)"/g,
    /placeholder="([^"]+)"/g,
    /label="([^"]+)"/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1];
      if (!text.includes('className') && !text.includes('import') && text.length > 5) {
        hardcoded.push(text);
      }
    }
  });
  
  return hardcoded;
}

// Calculate coverage
const totalComponents = componentReport.length;
const properlyTranslated = componentReport.filter(c => c.status === '✅').length;
report.coveragePercent = Math.round((properlyTranslated / totalComponents) * 100);

// Generate summary
console.log('\n' + '=' .repeat(60));
console.log('📊 HINDI COVERAGE SUMMARY\n');
console.log(`Total JSON files: ${report.totalFiles}`);
console.log(`Total translation keys: ${report.totalKeys}`);
console.log(`Empty translations: ${report.emptyTranslations.length}`);
console.log(`Page components: ${totalComponents}`);
console.log(`Properly translated: ${properlyTranslated}/${totalComponents}`);
console.log(`Coverage: ${report.coveragePercent}%`);

if (report.coveragePercent < 100) {
  console.log('\n⚠️ COMPONENTS NEEDING ATTENTION:');
  componentReport
    .filter(c => c.status === '⚠️')
    .forEach(c => {
      console.log(`  - ${c.file}: ${c.hardcodedCount} hardcoded texts`);
    });
}

// Save detailed report
fs.writeFileSync('hindi-coverage-test-report.json', JSON.stringify({
  ...report,
  componentReport,
  recommendation: report.coveragePercent === 100 
    ? 'Ready for production' 
    : 'Further localization required'
}, null, 2));

console.log('\n📄 Detailed report saved to hindi-coverage-test-report.json');

if (report.coveragePercent === 100) {
  console.log('\n✅ CONGRATULATIONS! 100% Hindi coverage achieved!');
} else {
  console.log(`\n⏳ Current coverage: ${report.coveragePercent}% - Work in progress...`);
}