const fs = require('fs');
const path = require('path');

console.log('🔍 Testing Translation Coverage for Hindi...\n');

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const enDir = path.join(localesDir, 'en');
const hiDir = path.join(localesDir, 'hi');

let totalKeys = 0;
let translatedKeys = 0;
let mixedLanguageKeys = 0;
let englishKeys = 0;
const issues = [];

// Patterns to detect English text
const englishPatterns = [
  /^[A-Z][a-z]+(\s+[A-Z]?[a-z]+)*$/,  // English words
  /^[A-Z]{2,}$/,  // All caps English
  /\b(the|and|or|for|with|from|to|in|on|at|by)\b/i,  // Common English words
  /\b(submit|form|enter|select|choose|click|upload|download)\b/i,  // Form words
];

// Pattern to detect mixed language (Hindi + English)
const mixedPattern = /[a-zA-Z]+.*[\u0900-\u097F]+|[\u0900-\u097F]+.*[a-zA-Z]+/;

function checkTranslation(key, value, file) {
  totalKeys++;
  
  // Check if it's purely English
  const isEnglish = englishPatterns.some(pattern => pattern.test(value));
  
  // Check if it's mixed language
  const isMixed = mixedPattern.test(value);
  
  if (isEnglish) {
    englishKeys++;
    issues.push({
      file: file.replace(hiDir + path.sep, ''),
      key,
      value,
      issue: 'English text'
    });
  } else if (isMixed) {
    mixedLanguageKeys++;
    issues.push({
      file: file.replace(hiDir + path.sep, ''),
      key,
      value,
      issue: 'Mixed language'
    });
  } else {
    translatedKeys++;
  }
}

function analyzeObject(obj, file, prefix = '') {
  for (let key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'string') {
      checkTranslation(fullKey, obj[key], file);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      analyzeObject(obj[key], file, fullKey);
    }
  }
}

// Read all Hindi JSON files
const files = fs.readdirSync(hiDir).filter(f => f.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(hiDir, file);
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`\n📄 Analyzing ${file}...`);
    analyzeObject(data, filePath);
  } catch (error) {
    console.error(`❌ Error reading ${file}: ${error.message}`);
  }
});

// Calculate percentages
const translationPercentage = ((translatedKeys / totalKeys) * 100).toFixed(1);
const englishPercentage = ((englishKeys / totalKeys) * 100).toFixed(1);
const mixedPercentage = ((mixedLanguageKeys / totalKeys) * 100).toFixed(1);

// Report results
console.log('\n' + '='.repeat(60));
console.log('📊 TRANSLATION COVERAGE REPORT');
console.log('='.repeat(60));
console.log(`\n📈 Overall Statistics:`);
console.log(`   Total Keys: ${totalKeys}`);
console.log(`   ✅ Properly Translated: ${translatedKeys} (${translationPercentage}%)`);
console.log(`   ❌ Still in English: ${englishKeys} (${englishPercentage}%)`);
console.log(`   ⚠️  Mixed Language: ${mixedLanguageKeys} (${mixedPercentage}%)`);

// Show top issues
if (issues.length > 0) {
  console.log(`\n🔴 Top Issues to Fix:`);
  console.log('-'.repeat(60));
  
  // Group by file
  const byFile = {};
  issues.forEach(issue => {
    if (!byFile[issue.file]) byFile[issue.file] = [];
    byFile[issue.file].push(issue);
  });
  
  Object.keys(byFile).slice(0, 5).forEach(file => {
    console.log(`\n📁 ${file}:`);
    byFile[file].slice(0, 3).forEach(issue => {
      console.log(`   ${issue.issue}: "${issue.key}" = "${issue.value.substring(0, 50)}${issue.value.length > 50 ? '...' : ''}"`);
    });
    if (byFile[file].length > 3) {
      console.log(`   ... and ${byFile[file].length - 3} more issues`);
    }
  });
}

// Summary
console.log('\n' + '='.repeat(60));
if (translationPercentage >= 95) {
  console.log('✅ EXCELLENT! Translation coverage is above 95%');
} else if (translationPercentage >= 85) {
  console.log('🟡 GOOD! Translation coverage is above 85% but needs improvement');
} else {
  console.log('🔴 NEEDS WORK! Translation coverage is below 85%');
}
console.log('='.repeat(60));

// Export detailed report
const report = {
  summary: {
    totalKeys,
    translatedKeys,
    englishKeys,
    mixedLanguageKeys,
    translationPercentage: parseFloat(translationPercentage),
    englishPercentage: parseFloat(englishPercentage),
    mixedPercentage: parseFloat(mixedPercentage)
  },
  issues: issues.slice(0, 100)  // Top 100 issues
};

fs.writeFileSync(
  path.join(__dirname, '..', 'translation-coverage-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📝 Detailed report saved to translation-coverage-report.json');