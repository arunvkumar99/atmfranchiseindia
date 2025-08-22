const fs = require('fs');
const path = require('path');

// Hindi text patterns to search for (common Hindi words/phrases)
const hindiPatterns = [
  /[\u0900-\u097F]+/, // Devanagari script range (Hindi/Marathi)
  /और/, /का/, /के/, /की/, /है/, /में/, /से/, /को/, /पर/, /यह/, /वह/, // Common Hindi words
  /नियम/, /शर्तें/, /प्रारंभिक/, /व्यक्तिगत/, /अनुमोदन/, /समझौता/, // Business terms
  /सहायता/, /चाहिए/, /मालिक/, /जांच/, /सत्यापन/, /साक्षात्कार/, // More business terms
  /प्रशिक्षण/, /सेटअप/, /भागीदार/, /अपटाइम/ // Technical terms
];

const languages = ['bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

console.log('🔍 Searching for Hindi contamination in non-Hindi language files...\n');
console.log('=' . repeat(80));

let totalIssues = 0;
const issuesByLanguage = {};

languages.forEach(lang => {
  // Skip Hindi and Marathi (Marathi uses Devanagari script)
  if (lang === 'hi' || lang === 'mr') return;
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales', lang);
  
  if (!fs.existsSync(localesDir)) {
    console.log(`⚠️  Directory not found: ${localesDir}`);
    return;
  }
  
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
  issuesByLanguage[lang] = [];
  
  files.forEach(file => {
    const filePath = path.join(localesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const json = JSON.parse(content);
      
      // Check each value in the JSON
      function checkObject(obj, path = '') {
        Object.entries(obj).forEach(([key, value]) => {
          const currentPath = path ? `${path}.${key}` : key;
          
          if (typeof value === 'string') {
            // Check for Hindi patterns
            let hasHindi = false;
            let matchedPattern = '';
            
            for (const pattern of hindiPatterns) {
              if (pattern.test(value)) {
                hasHindi = true;
                matchedPattern = value.match(pattern)[0];
                break;
              }
            }
            
            if (hasHindi) {
              // Special case: Skip Marathi language as it uses Devanagari
              if (lang === 'mr') return;
              
              // Skip if it's a language name (these are expected to be in native scripts)
              if (currentPath.includes('languages.')) return;
              
              issuesByLanguage[lang].push({
                file,
                key: currentPath,
                value: value.substring(0, 100) + (value.length > 100 ? '...' : ''),
                hindiText: matchedPattern
              });
              totalIssues++;
            }
          } else if (typeof value === 'object' && value !== null) {
            checkObject(value, currentPath);
          }
        });
      }
      
      checkObject(json);
      
    } catch (error) {
      console.error(`❌ Error parsing ${filePath}:`, error.message);
    }
  });
});

// Print results
console.log('\n📊 RESULTS BY LANGUAGE:\n');

Object.entries(issuesByLanguage).forEach(([lang, issues]) => {
  if (issues.length > 0) {
    console.log(`\n🚨 ${lang.toUpperCase()} - ${issues.length} issues found:`);
    console.log('-'.repeat(60));
    
    // Group by file
    const byFile = {};
    issues.forEach(issue => {
      if (!byFile[issue.file]) byFile[issue.file] = [];
      byFile[issue.file].push(issue);
    });
    
    Object.entries(byFile).forEach(([file, fileIssues]) => {
      console.log(`\n  📄 ${file}:`);
      fileIssues.slice(0, 5).forEach(issue => {
        console.log(`     Key: ${issue.key}`);
        console.log(`     Hindi found: "${issue.hindiText}"`);
        console.log(`     Value: "${issue.value}"`);
        console.log();
      });
      if (fileIssues.length > 5) {
        console.log(`     ... and ${fileIssues.length - 5} more issues in this file`);
      }
    });
  } else {
    console.log(`\n✅ ${lang.toUpperCase()} - No Hindi contamination found`);
  }
});

console.log('\n' + '='.repeat(80));
console.log(`\n📈 SUMMARY:`);
console.log(`   Total issues found: ${totalIssues}`);
console.log(`   Languages affected: ${Object.values(issuesByLanguage).filter(i => i.length > 0).length} / ${languages.length}`);

if (totalIssues > 0) {
  console.log('\n⚠️  Hindi contamination detected in multiple languages!');
  console.log('   These need to be properly translated to the target language.');
  
  // List most contaminated languages
  const sorted = Object.entries(issuesByLanguage)
    .filter(([_, issues]) => issues.length > 0)
    .sort((a, b) => b[1].length - a[1].length);
  
  console.log('\n   Most affected languages:');
  sorted.slice(0, 5).forEach(([lang, issues]) => {
    console.log(`     ${lang}: ${issues.length} contaminations`);
  });
} else {
  console.log('\n✅ No Hindi contamination found in any language files!');
}