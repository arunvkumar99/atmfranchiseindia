const fs = require('fs');
const path = require('path');

// Define the project root
const projectRoot = path.join(__dirname, '..');
const localesDir = path.join(projectRoot, 'public', 'locales');

// Define complete namespace list from English (reference)
const referenceNamespaces = [
  'about.json',
  'accessibility.json',
  'agent.json',
  'blog.json',
  'common.json',
  'components.json',
  'contact.json',
  'forms.json',
  'franchise.json',
  'home.json',
  'influencer.json',
  'jobs.json',
  'location.json',
  'notFound.json',
  'pixellpay.json',
  'privacy.json',
  'products.json',
  'refund.json',
  'startAtm.json',
  'terms.json'
];

// Languages to analyze (excluding completed ones)
const languagesToAnalyze = [
  { code: 'bn', name: 'Bengali', priority: 1, users: '12%' },
  { code: 'te', name: 'Telugu', priority: 2, users: '10%' },
  { code: 'mr', name: 'Marathi', priority: 3, users: '8%' },
  { code: 'gu', name: 'Gujarati', priority: 4, users: '5%' },
  { code: 'ur', name: 'Urdu', priority: 5, users: '4%' },
  { code: 'kn', name: 'Kannada', priority: 6, users: '3%' },
  { code: 'or', name: 'Odia', priority: 7, users: '2%' },
  { code: 'pa', name: 'Punjabi', priority: 8, users: '1.5%' },
  { code: 'as', name: 'Assamese', priority: 9, users: '1%' },
  { code: 'ml', name: 'Malayalam', priority: 10, users: '0.5%' }
];

function analyzeLanguage(langCode) {
  const langDir = path.join(localesDir, langCode);
  const missingFiles = [];
  const emptyFiles = [];
  const incompleteFiles = [];
  let totalKeys = 0;
  let translatedKeys = 0;

  // Check each namespace
  referenceNamespaces.forEach(namespace => {
    const filePath = path.join(langDir, namespace);
    
    if (!fs.existsSync(filePath)) {
      missingFiles.push(namespace);
    } else {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content);
        
        // Check if file is empty
        if (Object.keys(data).length === 0) {
          emptyFiles.push(namespace);
        } else {
          // Compare with English version
          const enFilePath = path.join(localesDir, 'en', namespace);
          if (fs.existsSync(enFilePath)) {
            const enContent = fs.readFileSync(enFilePath, 'utf-8');
            const enData = JSON.parse(enContent);
            const enKeys = countKeys(enData);
            const langKeys = countKeys(data);
            
            totalKeys += enKeys;
            translatedKeys += langKeys;
            
            if (langKeys < enKeys) {
              incompleteFiles.push({
                file: namespace,
                coverage: `${langKeys}/${enKeys} (${Math.round(langKeys/enKeys * 100)}%)`
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing ${filePath}:`, error.message);
      }
    }
  });

  const coverage = totalKeys > 0 ? Math.round((translatedKeys / totalKeys) * 100) : 0;
  
  return {
    missingFiles,
    emptyFiles,
    incompleteFiles,
    totalKeys,
    translatedKeys,
    coverage
  };
}

function countKeys(obj, prefix = '') {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count += countKeys(obj[key], prefix + key + '.');
    } else {
      count++;
    }
  }
  return count;
}

// Generate comprehensive report
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('                    LANGUAGE LOCALIZATION COVERAGE REPORT                      ');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('Reference: English (en) - Complete namespace list');
console.log('Completed: Hindi (hi) - 100%, Tamil (ta) - 100%');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

const report = {};

languagesToAnalyze.forEach(lang => {
  const analysis = analyzeLanguage(lang.code);
  report[lang.code] = {
    ...lang,
    ...analysis
  };
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`PRIORITY ${lang.priority}: ${lang.name.toUpperCase()} (${lang.code}) - ${lang.users} of users`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`Overall Coverage: ${analysis.coverage}% (${analysis.translatedKeys}/${analysis.totalKeys} keys)`);
  
  if (analysis.missingFiles.length > 0) {
    console.log(`\n❌ Missing Files (${analysis.missingFiles.length}):`);
    analysis.missingFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  if (analysis.emptyFiles.length > 0) {
    console.log(`\n⚠️  Empty Files (${analysis.emptyFiles.length}):`);
    analysis.emptyFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  if (analysis.incompleteFiles.length > 0) {
    console.log(`\n📊 Incomplete Files (${analysis.incompleteFiles.length}):`);
    analysis.incompleteFiles.forEach(item => console.log(`   - ${item.file}: ${item.coverage}`));
  }
  
  if (analysis.coverage === 100) {
    console.log('\n✅ COMPLETE - All translations are done!');
  }
});

// Save report to JSON
const reportPath = path.join(projectRoot, 'docs', 'reports', 'language-coverage-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log('                           IMPLEMENTATION ROADMAP                              ');
console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('\n📋 Next Steps:');
console.log('1. Add missing namespace files (components.json, location.json) to all languages');
console.log('2. Complete translations for all incomplete files');
console.log('3. Validate each language in browser with ?lng=xx parameter');
console.log('4. Run automated tests for each language');
console.log('\n💾 Report saved to: docs/reports/language-coverage-report.json');