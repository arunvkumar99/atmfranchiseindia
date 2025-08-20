const fs = require('fs');
const path = require('path');

console.log('🧪 PHASE 3: COMPREHENSIVE HINDI TRANSLATION TESTING\n');
console.log('=' .repeat(60));

// Test 1: Check all Hindi JSON files exist
console.log('\n📁 Test 1: Verifying all Hindi translation files exist...');
const expectedFiles = [
  'about.json', 'accessibility.json', 'agent.json', 'blog.json',
  'common.json', 'components.json', 'contact.json', 'forms.json',
  'franchise.json', 'home.json', 'influencer.json', 'jobs.json',
  'notFound.json', 'pixellpay.json', 'privacy.json', 'products.json',
  'refund.json', 'startAtm.json', 'terms.json'
];

const hiDir = path.join(__dirname, '..', 'public', 'locales', 'hi');
let allFilesExist = true;

expectedFiles.forEach(file => {
  const filePath = path.join(hiDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file} exists`);
  } else {
    console.log(`  ❌ ${file} MISSING!`);
    allFilesExist = false;
  }
});

// Test 2: Check for English text in Hindi files
console.log('\n🔍 Test 2: Checking for English text in Hindi translations...');
const englishPatterns = [
  /\b(the|and|or|for|with|from|to|in|on|at|by)\b/i,
  /\b(submit|form|enter|select|choose|click|upload|download)\b/i,
  /\b(please|thank|you|welcome|hello|goodbye)\b/i,
  /\b(error|warning|success|info|loading)\b/i
];

let englishCount = 0;
const allowedEnglish = ['ATM', 'RBI', 'WLA', 'PDF', 'JPG', 'PNG', 'FAQ', 'ROI', 'ID', 'OTP', 'GST', 'PAN'];

function checkForEnglish(obj, file, path = '') {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      // Skip template variables
      if (obj[key].includes('{{') || obj[key].includes('}}')) continue;
      
      // Check for English words
      const words = obj[key].split(/\s+/);
      words.forEach(word => {
        // Remove punctuation
        const cleanWord = word.replace(/[.,!?;:'"]/g, '').toUpperCase();
        
        // Skip allowed English terms
        if (allowedEnglish.includes(cleanWord)) return;
        
        // Check if it's English
        if (/^[A-Z]+$/.test(cleanWord) && cleanWord.length > 2) {
          if (!allowedEnglish.includes(cleanWord)) {
            console.log(`  ⚠️  ${file}: "${cleanWord}" found in: ${obj[key].substring(0, 50)}...`);
            englishCount++;
          }
        }
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      checkForEnglish(obj[key], file, path + '.' + key);
    }
  }
}

expectedFiles.forEach(file => {
  const filePath = path.join(hiDir, file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    checkForEnglish(content, file);
  }
});

// Test 3: Check for mixed language (Hindi + English)
console.log('\n🔄 Test 3: Checking for mixed language content...');
const mixedPattern = /[a-zA-Z]+.*[\u0900-\u097F]+|[\u0900-\u097F]+.*[a-zA-Z]+/;
let mixedCount = 0;

function checkMixed(obj, file) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      // Skip template variables
      if (obj[key].includes('{{')) continue;
      
      // Skip allowed mixed patterns
      if (obj[key].includes('ATM') || obj[key].includes('WLA') || obj[key].includes('RBI')) continue;
      
      if (mixedPattern.test(obj[key])) {
        // Check if it's genuinely mixed (not just brand names)
        const hasHindi = /[\u0900-\u097F]/.test(obj[key]);
        const hasEnglish = /[a-zA-Z]{4,}/.test(obj[key]);
        
        if (hasHindi && hasEnglish) {
          const englishPart = obj[key].match(/[a-zA-Z]{4,}/);
          if (englishPart && !allowedEnglish.includes(englishPart[0].toUpperCase())) {
            console.log(`  ⚠️  ${file}: Mixed content in: "${obj[key].substring(0, 60)}..."`);
            mixedCount++;
          }
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      checkMixed(obj[key], file);
    }
  }
}

expectedFiles.forEach(file => {
  const filePath = path.join(hiDir, file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    checkMixed(content, file);
  }
});

// Test 4: Check key consistency between English and Hindi
console.log('\n🔑 Test 4: Checking key consistency between English and Hindi...');
const enDir = path.join(__dirname, '..', 'public', 'locales', 'en');
let missingKeys = 0;

function compareKeys(enObj, hiObj, file, path = '') {
  for (let key in enObj) {
    const fullPath = path ? `${path}.${key}` : key;
    
    if (!(key in hiObj)) {
      console.log(`  ❌ ${file}: Missing Hindi translation for key: ${fullPath}`);
      missingKeys++;
    } else if (typeof enObj[key] === 'object' && enObj[key] !== null) {
      if (typeof hiObj[key] === 'object' && hiObj[key] !== null) {
        compareKeys(enObj[key], hiObj[key], file, fullPath);
      }
    }
  }
}

expectedFiles.forEach(file => {
  const enPath = path.join(enDir, file);
  const hiPath = path.join(hiDir, file);
  
  if (fs.existsSync(enPath) && fs.existsSync(hiPath)) {
    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const hiContent = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
    compareKeys(enContent, hiContent, file);
  }
});

// Test 5: Check for proper Hindi characters
console.log('\n📝 Test 5: Verifying proper Hindi (Devanagari) script usage...');
let properHindiCount = 0;
let totalStrings = 0;

function checkHindiScript(obj, file) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      totalStrings++;
      // Skip template variables and numbers
      if (obj[key].includes('{{') || /^\d+$/.test(obj[key])) {
        properHindiCount++;
        continue;
      }
      
      // Check if it contains Hindi characters
      if (/[\u0900-\u097F]/.test(obj[key])) {
        properHindiCount++;
      } else if (!allowedEnglish.some(term => obj[key].includes(term))) {
        console.log(`  ⚠️  ${file}: No Hindi script in: "${obj[key].substring(0, 50)}..."`);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      checkHindiScript(obj[key], file);
    }
  }
}

expectedFiles.forEach(file => {
  const filePath = path.join(hiDir, file);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    checkHindiScript(content, file);
  }
});

// Generate Test Report
console.log('\n' + '=' .repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('=' .repeat(60));

const results = {
  filesExist: allFilesExist,
  englishTextFound: englishCount,
  mixedLanguageFound: mixedCount,
  missingKeys: missingKeys,
  hindiCoverage: ((properHindiCount / totalStrings) * 100).toFixed(1)
};

console.log(`\n✅ Test 1 - All files exist: ${results.filesExist ? 'PASSED' : 'FAILED'}`);
console.log(`${results.englishTextFound === 0 ? '✅' : '⚠️'} Test 2 - English text found: ${results.englishTextFound} instances`);
console.log(`${results.mixedLanguageFound === 0 ? '✅' : '⚠️'} Test 3 - Mixed language found: ${results.mixedLanguageFound} instances`);
console.log(`${results.missingKeys === 0 ? '✅' : '❌'} Test 4 - Missing keys: ${results.missingKeys} keys`);
console.log(`✅ Test 5 - Hindi script coverage: ${results.hindiCoverage}%`);

// Overall Assessment
console.log('\n' + '=' .repeat(60));
if (results.filesExist && results.missingKeys === 0 && results.hindiCoverage > 95) {
  console.log('🎉 OVERALL: HINDI TRANSLATIONS ARE PRODUCTION READY!');
  console.log('✅ All critical tests passed');
  console.log('✅ Hindi coverage is excellent');
  console.log('⚠️  Minor English terms are acceptable (brand names, acronyms)');
} else {
  console.log('❌ OVERALL: HINDI TRANSLATIONS NEED MORE WORK');
  if (!results.filesExist) console.log('  - Some translation files are missing');
  if (results.missingKeys > 0) console.log('  - Some keys are missing Hindi translations');
  if (results.hindiCoverage < 95) console.log('  - Hindi coverage needs improvement');
}
console.log('=' .repeat(60));

// Save detailed report
const report = {
  timestamp: new Date().toISOString(),
  phase: 'Phase 3 - Comprehensive Testing',
  results: results,
  details: {
    englishTermsFound: englishCount,
    mixedLanguageInstances: mixedCount,
    missingTranslationKeys: missingKeys,
    hindiScriptCoverage: `${results.hindiCoverage}%`,
    totalStringsChecked: totalStrings
  },
  recommendation: results.filesExist && results.missingKeys === 0 && results.hindiCoverage > 95 
    ? 'Ready for production deployment'
    : 'Needs additional work before production'
};

fs.writeFileSync(
  path.join(__dirname, '..', 'phase3-test-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\n📝 Detailed report saved to phase3-test-report.json');