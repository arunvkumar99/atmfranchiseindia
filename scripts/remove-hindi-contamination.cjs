const fs = require('fs');
const path = require('path');

// Hindi text patterns to detect and remove
const hindiPatterns = [
  /[\u0900-\u097F]+/g, // Devanagari script range (Hindi/Marathi)
];

// Languages to clean (exclude Hindi and Marathi as they use Devanagari)
const languagesToClean = ['bn', 'ta', 'te', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

console.log('🧹 REMOVING HINDI CONTAMINATION FROM REGIONAL LANGUAGES\n');
console.log('=' . repeat(80));
console.log('\nProject: ATM Franchise India');
console.log(`Path: ${path.join(__dirname, '..')}`);
console.log('\nLanguages to clean:', languagesToClean.join(', '));
console.log('\n' + '=' . repeat(80) + '\n');

let totalFixed = 0;
let totalErrors = 0;
const fixedByLanguage = {};

// Function to clean Hindi from a string
function cleanHindi(value, enValue) {
  if (typeof value !== 'string') return value;
  
  // Check if the string contains Hindi characters
  let hasHindi = false;
  for (const pattern of hindiPatterns) {
    if (pattern.test(value)) {
      hasHindi = true;
      break;
    }
  }
  
  // If Hindi found, return English value instead
  return hasHindi ? enValue : value;
}

// Process each language
languagesToClean.forEach(lang => {
  console.log(`\n📝 Processing ${lang.toUpperCase()}:`);
  console.log('-'.repeat(60));
  
  const langDir = path.join(__dirname, '..', 'public', 'locales', lang);
  const enDir = path.join(__dirname, '..', 'public', 'locales', 'en');
  
  if (!fs.existsSync(langDir)) {
    console.log(`  ⚠️  Directory not found: ${langDir}`);
    totalErrors++;
    return;
  }
  
  fixedByLanguage[lang] = {
    files: [],
    totalKeys: 0,
    fixedKeys: 0,
    examples: []
  };
  
  // Process each JSON file
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const langFilePath = path.join(langDir, file);
    const enFilePath = path.join(enDir, file);
    
    try {
      // Read both language and English files
      const langContent = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
      let enContent = {};
      
      if (fs.existsSync(enFilePath)) {
        enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
      }
      
      let fileFixed = false;
      let fixCount = 0;
      
      // Recursive function to clean object
      function cleanObject(obj, enObj, path = '') {
        const cleaned = {};
        
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          const enValue = enObj?.[key];
          
          if (typeof value === 'string') {
            const originalValue = value;
            const cleanedValue = cleanHindi(value, enValue || value);
            
            if (originalValue !== cleanedValue) {
              // Collect example for reporting
              if (fixedByLanguage[lang].examples.length < 5) {
                fixedByLanguage[lang].examples.push({
                  file,
                  key: currentPath,
                  before: originalValue.substring(0, 100),
                  after: cleanedValue.substring(0, 100)
                });
              }
              
              fixCount++;
              fileFixed = true;
            }
            
            cleaned[key] = cleanedValue;
            fixedByLanguage[lang].totalKeys++;
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            cleaned[key] = cleanObject(value, enObj?.[key] || {}, currentPath);
          } else {
            cleaned[key] = value;
          }
        }
        
        return cleaned;
      }
      
      // Clean the content
      const cleanedContent = cleanObject(langContent, enContent);
      
      if (fileFixed) {
        // Write back the cleaned content
        fs.writeFileSync(langFilePath, JSON.stringify(cleanedContent, null, 2), 'utf8');
        
        console.log(`  ✅ Fixed ${file}: ${fixCount} contaminations removed`);
        fixedByLanguage[lang].files.push(file);
        fixedByLanguage[lang].fixedKeys += fixCount;
        totalFixed += fixCount;
      } else {
        console.log(`  ✓ ${file}: No Hindi contamination found`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error processing ${file}: ${error.message}`);
      totalErrors++;
    }
  });
  
  // Print summary for this language
  if (fixedByLanguage[lang].fixedKeys > 0) {
    console.log(`\n  📊 ${lang.toUpperCase()} Summary:`);
    console.log(`     Files fixed: ${fixedByLanguage[lang].files.length}`);
    console.log(`     Contaminations removed: ${fixedByLanguage[lang].fixedKeys}`);
    console.log(`     Total keys processed: ${fixedByLanguage[lang].totalKeys}`);
  }
});

// Print detailed examples and final summary
console.log('\n' + '=' . repeat(80));
console.log('\n📋 DETAILED EXAMPLES OF FIXES:\n');

Object.entries(fixedByLanguage).forEach(([lang, data]) => {
  if (data.examples.length > 0) {
    console.log(`\n${lang.toUpperCase()} - Sample fixes:`);
    console.log('-'.repeat(40));
    
    data.examples.forEach((ex, i) => {
      console.log(`\n  Example ${i + 1}:`);
      console.log(`  File: ${ex.file}`);
      console.log(`  Key: ${ex.key}`);
      console.log(`  Before: "${ex.before}"`);
      console.log(`  After: "${ex.after}"`);
    });
  }
});

console.log('\n' + '=' . repeat(80));
console.log('\n✅ FINAL SUMMARY:\n');
console.log(`  Total contaminations removed: ${totalFixed}`);
console.log(`  Languages cleaned: ${languagesToClean.length}`);
console.log(`  Errors encountered: ${totalErrors}`);

// Summary by language
console.log('\n  Breakdown by language:');
Object.entries(fixedByLanguage).forEach(([lang, data]) => {
  if (data.fixedKeys > 0) {
    const percentage = ((data.fixedKeys / data.totalKeys) * 100).toFixed(1);
    console.log(`    ${lang.toUpperCase()}: ${data.fixedKeys} fixes (${percentage}% of keys were contaminated)`);
  }
});

if (totalFixed > 0) {
  console.log('\n🎉 Hindi contamination successfully removed!');
  console.log('   All affected files now use English fallback instead of Hindi.');
  console.log('   Next step: Run translation coverage analysis to get accurate percentages.');
} else {
  console.log('\n✓ No Hindi contamination found in the translation files.');
}

console.log('\n💡 Recommendation: Run the coverage analysis script next to evaluate true translation status.');
console.log('   Command: node scripts/analyze-translation-coverage.cjs');