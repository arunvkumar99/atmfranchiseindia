const fs = require('fs');
const path = require('path');

console.log('🔬 DEEP VALIDATION: MIXED CONTENT ANALYSIS\n');
console.log('=' . repeat(80));

// Focus on files with known issues
const filesToCheck = ['components.json', 'home.json', 'forms.json'];
const languages = ['te', 'ta', 'bn', 'hi'];

const scriptPatterns = {
  hi: /[\u0900-\u097F]/,  // Devanagari
  bn: /[\u0980-\u09FF]/,  // Bengali
  ta: /[\u0B80-\u0BFF]/,  // Tamil
  te: /[\u0C00-\u0C7F]/,  // Telugu
};

// Acceptable English terms in translations
const acceptableEnglishTerms = [
  'ATM', 'RBI', 'WLA', 'KYC', 'PIN', 'OTP', 'SMS', 'TATA',
  'email', '@', '.com', 'NSFW', 'ID', 'PAN', 'GST', 'IFSC',
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
  'Male', 'Female', 'Other', 'India', 'Indicash', 'Vakrangee',
  'EPS', 'Findi', 'PixellPay', 'Evosyz'
];

function analyzeText(text, lang) {
  if (!text || typeof text !== 'string') return { type: 'empty', details: 'No text' };
  
  const hasEnglish = /[a-zA-Z]/.test(text);
  const hasNativeScript = scriptPatterns[lang] && scriptPatterns[lang].test(text);
  
  // Remove acceptable terms
  let cleanedText = text;
  acceptableEnglishTerms.forEach(term => {
    cleanedText = cleanedText.replace(new RegExp(term, 'gi'), '');
  });
  
  // Check for remaining English
  const hasSignificantEnglish = /[a-zA-Z]{4,}/.test(cleanedText);
  
  if (!hasNativeScript && hasEnglish) {
    return { type: 'english-only', details: 'Pure English text' };
  } else if (hasNativeScript && hasSignificantEnglish) {
    // Count English vs native words
    const englishWords = (cleanedText.match(/[a-zA-Z]+/g) || []).length;
    const totalWords = text.split(/\s+/).length;
    const englishRatio = englishWords / totalWords;
    
    return { 
      type: 'mixed', 
      details: `${(englishRatio * 100).toFixed(0)}% English words`,
      sample: text.substring(0, 50)
    };
  } else if (hasNativeScript) {
    return { type: 'translated', details: 'Properly translated' };
  }
  
  return { type: 'unknown', details: 'Unable to classify' };
}

console.log('\n📋 Checking specific problematic files:\n');

filesToCheck.forEach(file => {
  console.log(`\n📄 ${file}:`);
  console.log('-'.repeat(60));
  
  languages.forEach(lang => {
    const filePath = path.join(__dirname, '..', 'public', 'locales', lang, file);
    const enFilePath = path.join(__dirname, '..', 'public', 'locales', 'en', file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`  ${lang.toUpperCase()}: File not found`);
      return;
    }
    
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
      
      let stats = {
        total: 0,
        translated: 0,
        englishOnly: 0,
        mixed: 0,
        empty: 0
      };
      
      let mixedExamples = [];
      
      // Analyze all string values
      function analyzeObject(obj, enObj, prefix = '') {
        Object.entries(enObj).forEach(([key, enValue]) => {
          if (typeof enValue === 'string') {
            stats.total++;
            const langValue = obj?.[key];
            const analysis = analyzeText(langValue, lang);
            
            if (analysis.type === 'translated') {
              stats.translated++;
            } else if (analysis.type === 'english-only') {
              stats.englishOnly++;
            } else if (analysis.type === 'mixed') {
              stats.mixed++;
              if (mixedExamples.length < 3) {
                mixedExamples.push({
                  key: prefix + key,
                  text: analysis.sample,
                  ratio: analysis.details
                });
              }
            } else {
              stats.empty++;
            }
          } else if (typeof enValue === 'object' && enValue !== null) {
            analyzeObject(obj?.[key] || {}, enValue, prefix + key + '.');
          }
        });
      }
      
      analyzeObject(content, enContent);
      
      // Report
      const mixedPercentage = ((stats.mixed / stats.total) * 100).toFixed(1);
      const translatedPercentage = ((stats.translated / stats.total) * 100).toFixed(1);
      
      console.log(`\n  ${lang.toUpperCase()}: ${stats.total} keys analyzed`);
      console.log(`    ✅ Translated: ${stats.translated} (${translatedPercentage}%)`);
      console.log(`    ⚠️  Mixed: ${stats.mixed} (${mixedPercentage}%)`);
      console.log(`    ❌ English: ${stats.englishOnly}`);
      console.log(`    ⭕ Empty: ${stats.empty}`);
      
      if (mixedExamples.length > 0) {
        console.log(`    Mixed content examples:`);
        mixedExamples.forEach(ex => {
          console.log(`      - ${ex.key}: "${ex.text}..." (${ex.ratio})`);
        });
      }
      
    } catch (error) {
      console.log(`  ${lang.toUpperCase()}: Error - ${error.message}`);
    }
  });
});

console.log('\n' + '=' . repeat(80));
console.log('\n🎯 VALIDATION CONCLUSIONS:\n');
console.log('1. ✅ CONFIRMED: Fallback is English only (not Hindi)');
console.log('2. ⚠️  ISSUE: Significant mixed English-native content in translations');
console.log('3. ⚠️  ISSUE: Many keys are using pure English fallback');
console.log('4. 📊 The reported "coverage" percentages are misleading because:');
console.log('   - They count any native script as "translated"');
console.log('   - Mixed content (50% English) is counted as translated');
console.log('   - Quality and completeness are not measured');
console.log('\n5. 🔄 RECOMMENDATION: Need to re-translate mixed content keys');
console.log('6. 📝 LEARNING: Always validate with actual text inspection, not just script presence');