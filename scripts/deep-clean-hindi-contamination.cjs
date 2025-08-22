const fs = require('fs');
const path = require('path');

// Hindi character ranges and patterns
const hindiChars = /[\u0900-\u097F]/g; // Devanagari script

// Languages to clean (exclude Hindi and Marathi)
const languagesToClean = ['bn', 'ta', 'te', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

console.log('🔥 DEEP CLEANING HINDI CONTAMINATION - AGGRESSIVE MODE\n');
console.log('=' . repeat(80));
console.log('\nThis will remove ALL Hindi characters from mixed text strings');
console.log('and replace entire contaminated values with English equivalents.\n');
console.log('=' . repeat(80) + '\n');

let totalFixed = 0;
let totalStringsProcessed = 0;
const detailedReport = {};

// Function to detect if string has ANY Hindi characters
function hasHindi(str) {
  if (typeof str !== 'string') return false;
  return hindiChars.test(str);
}

// Function to clean mixed text by removing Hindi parts
function deepCleanHindi(value, enValue, key) {
  if (typeof value !== 'string') return value;
  
  // If no Hindi, return as is
  if (!hasHindi(value)) return value;
  
  // Special handling for certain keys that should preserve native script
  const preserveKeys = ['languages.', 'copyright'];
  for (const preserve of preserveKeys) {
    if (key.includes(preserve)) {
      // For copyright, use English version
      if (key.includes('copyright') && enValue) {
        return enValue;
      }
      // For language names, keep as is
      if (key.includes('languages.')) {
        return value;
      }
    }
  }
  
  // If we have English equivalent, use it
  if (enValue && typeof enValue === 'string') {
    return enValue;
  }
  
  // Otherwise, try to extract non-Hindi parts
  // Remove all Hindi characters and clean up
  let cleaned = value.replace(hindiChars, '');
  
  // Clean up multiple spaces, leading/trailing spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  // If nothing left after cleaning, use English or a placeholder
  if (!cleaned || cleaned.length < 3) {
    return enValue || `[NEEDS TRANSLATION: ${key}]`;
  }
  
  return cleaned;
}

// Process each language
languagesToClean.forEach(lang => {
  console.log(`\n🌐 DEEP CLEANING ${lang.toUpperCase()}:`);
  console.log('=' . repeat(60));
  
  const langDir = path.join(__dirname, '..', 'public', 'locales', lang);
  const enDir = path.join(__dirname, '..', 'public', 'locales', 'en');
  
  if (!fs.existsSync(langDir)) {
    console.log(`  ⚠️  Directory not found: ${langDir}`);
    return;
  }
  
  detailedReport[lang] = {
    filesProcessed: 0,
    totalKeys: 0,
    contaminatedKeys: 0,
    fixedKeys: 0,
    examples: [],
    fileBreakdown: {}
  };
  
  // Process each JSON file
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const langFilePath = path.join(langDir, file);
    const enFilePath = path.join(enDir, file);
    
    try {
      const langContent = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
      let enContent = {};
      
      if (fs.existsSync(enFilePath)) {
        enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
      }
      
      let fileFixed = 0;
      let fileContaminated = 0;
      let fileTotal = 0;
      
      // Recursive function to deep clean
      function cleanObject(obj, enObj, path = '') {
        const cleaned = {};
        
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = path ? `${path}.${key}` : key;
          const enValue = enObj?.[key];
          
          fileTotal++;
          detailedReport[lang].totalKeys++;
          
          if (typeof value === 'string') {
            totalStringsProcessed++;
            
            if (hasHindi(value)) {
              fileContaminated++;
              detailedReport[lang].contaminatedKeys++;
              
              const cleanedValue = deepCleanHindi(value, enValue, currentPath);
              
              if (value !== cleanedValue) {
                fileFixed++;
                detailedReport[lang].fixedKeys++;
                totalFixed++;
                
                // Collect examples
                if (detailedReport[lang].examples.length < 10) {
                  detailedReport[lang].examples.push({
                    file,
                    key: currentPath,
                    before: value.substring(0, 80) + (value.length > 80 ? '...' : ''),
                    after: cleanedValue.substring(0, 80) + (cleanedValue.length > 80 ? '...' : ''),
                    hadHindi: value.match(hindiChars) ? value.match(hindiChars).join('') : ''
                  });
                }
              }
              
              cleaned[key] = cleanedValue;
            } else {
              cleaned[key] = value;
            }
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            cleaned[key] = cleanObject(value, enObj?.[key] || {}, currentPath);
          } else {
            cleaned[key] = value;
          }
        }
        
        return cleaned;
      }
      
      // Deep clean the content
      const cleanedContent = cleanObject(langContent, enContent);
      
      // Always write back to ensure consistency
      fs.writeFileSync(langFilePath, JSON.stringify(cleanedContent, null, 2), 'utf8');
      
      detailedReport[lang].filesProcessed++;
      detailedReport[lang].fileBreakdown[file] = {
        total: fileTotal,
        contaminated: fileContaminated,
        fixed: fileFixed
      };
      
      if (fileFixed > 0) {
        console.log(`  ✅ ${file}: ${fileFixed}/${fileContaminated} contaminations fixed`);
      } else if (fileContaminated > 0) {
        console.log(`  ⚠️  ${file}: ${fileContaminated} contaminations found but not fixed`);
      } else {
        console.log(`  ✓ ${file}: Clean`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error: ${file} - ${error.message}`);
    }
  });
  
  // Language summary
  const report = detailedReport[lang];
  console.log(`\n  📊 ${lang.toUpperCase()} SUMMARY:`);
  console.log(`     Files processed: ${report.filesProcessed}`);
  console.log(`     Total keys: ${report.totalKeys}`);
  console.log(`     Contaminated keys found: ${report.contaminatedKeys}`);
  console.log(`     Successfully cleaned: ${report.fixedKeys}`);
  
  if (report.contaminatedKeys > report.fixedKeys) {
    console.log(`     ⚠️  Still contaminated: ${report.contaminatedKeys - report.fixedKeys}`);
  }
});

// Print detailed examples
console.log('\n' + '=' . repeat(80));
console.log('\n📋 DETAILED CLEANING EXAMPLES:\n');

Object.entries(detailedReport).forEach(([lang, report]) => {
  if (report.examples.length > 0) {
    console.log(`\n${lang.toUpperCase()} - Cleaned Examples:`);
    console.log('-' . repeat(60));
    
    report.examples.slice(0, 5).forEach((ex, i) => {
      console.log(`\n  Example ${i + 1}:`);
      console.log(`  File: ${ex.file}`);
      console.log(`  Key: ${ex.key}`);
      console.log(`  Hindi chars found: "${ex.hadHindi}"`);
      console.log(`  Before: "${ex.before}"`);
      console.log(`  After: "${ex.after}"`);
    });
  }
});

// Final summary
console.log('\n' + '=' . repeat(80));
console.log('\n🎯 DEEP CLEAN FINAL REPORT:\n');
console.log(`  Total strings processed: ${totalStringsProcessed}`);
console.log(`  Total fixes applied: ${totalFixed}`);
console.log(`  Languages cleaned: ${languagesToClean.length}`);

console.log('\n  Language Breakdown:');
Object.entries(detailedReport).forEach(([lang, report]) => {
  const cleanPercentage = report.totalKeys > 0 
    ? ((report.totalKeys - (report.contaminatedKeys - report.fixedKeys)) / report.totalKeys * 100).toFixed(1)
    : 100;
  console.log(`    ${lang.toUpperCase()}: ${report.fixedKeys}/${report.contaminatedKeys} fixed (${cleanPercentage}% clean)`);
});

// Check if we need another pass
let remainingContamination = 0;
Object.values(detailedReport).forEach(report => {
  remainingContamination += (report.contaminatedKeys - report.fixedKeys);
});

if (remainingContamination > 0) {
  console.log(`\n⚠️  WARNING: ${remainingContamination} contaminations could not be automatically fixed.`);
  console.log('   These may require manual translation or are in special fields that should preserve mixed scripts.');
} else {
  console.log('\n✅ SUCCESS: All detected Hindi contaminations have been cleaned!');
}

console.log('\n💡 Next Step: Run coverage analysis to get accurate translation percentages.');
console.log('   Command: node scripts/analyze-translation-coverage.cjs');