const fs = require('fs');
const path = require('path');

// Tamil Unicode range: \u0B80-\u0BFF
const TAMIL_REGEX = /[\u0B80-\u0BFF]/;
const ENGLISH_REGEX = /^[A-Za-z0-9\s\-.,!?'"()&%$#@]+$/;

function analyzeTamilTranslations() {
  console.log('🔍 Tamil Translation Audit Report');
  console.log('=' .repeat(80));
  
  const tamilDir = path.join(__dirname, '..', 'public', 'locales', 'ta');
  const englishDir = path.join(__dirname, '..', 'public', 'locales', 'en');
  
  if (!fs.existsSync(tamilDir)) {
    console.error('❌ Tamil directory not found!');
    return;
  }
  
  const files = fs.readdirSync(tamilDir).filter(f => f.endsWith('.json'));
  let totalReport = {
    totalKeys: 0,
    tamilKeys: 0,
    englishKeys: 0,
    mixedKeys: 0,
    fileReports: []
  };
  
  files.forEach(file => {
    const tamilPath = path.join(tamilDir, file);
    const englishPath = path.join(englishDir, file);
    
    const tamilContent = JSON.parse(fs.readFileSync(tamilPath, 'utf-8'));
    const englishContent = fs.existsSync(englishPath) 
      ? JSON.parse(fs.readFileSync(englishPath, 'utf-8'))
      : null;
    
    const fileReport = analyzeFile(file, tamilContent, englishContent);
    totalReport.fileReports.push(fileReport);
    totalReport.totalKeys += fileReport.totalKeys;
    totalReport.tamilKeys += fileReport.tamilKeys;
    totalReport.englishKeys += fileReport.englishKeys;
    totalReport.mixedKeys += fileReport.mixedKeys;
  });
  
  // Print detailed report
  console.log('\n📊 FILE-BY-FILE ANALYSIS:');
  console.log('-'.repeat(80));
  
  totalReport.fileReports.forEach(report => {
    const percentage = report.totalKeys > 0 
      ? Math.round((report.tamilKeys / report.totalKeys) * 100)
      : 0;
    
    const status = percentage === 100 ? '✅' :
                   percentage >= 80 ? '🔶' :
                   percentage >= 50 ? '⚠️' : '❌';
    
    console.log(`\n${status} ${report.file}`);
    console.log(`   Total Keys: ${report.totalKeys}`);
    console.log(`   Tamil: ${report.tamilKeys} (${percentage}%)`);
    console.log(`   English: ${report.englishKeys}`);
    console.log(`   Mixed: ${report.mixedKeys}`);
    
    if (report.englishKeys > 0 && report.sampleEnglishKeys.length > 0) {
      console.log(`   Sample English Keys:`);
      report.sampleEnglishKeys.slice(0, 3).forEach(key => {
        console.log(`     - ${key.path}: "${key.value}"`);
      });
    }
  });
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('📈 OVERALL SUMMARY:');
  console.log('='.repeat(80));
  
  const overallPercentage = totalReport.totalKeys > 0
    ? Math.round((totalReport.tamilKeys / totalReport.totalKeys) * 100)
    : 0;
  
  console.log(`Total Translation Keys: ${totalReport.totalKeys}`);
  console.log(`Tamil Translated: ${totalReport.tamilKeys} (${overallPercentage}%)`);
  console.log(`Still in English: ${totalReport.englishKeys} (${100 - overallPercentage}%)`);
  console.log(`Mixed Content: ${totalReport.mixedKeys}`);
  
  // Missing files check
  const englishFiles = fs.readdirSync(englishDir).filter(f => f.endsWith('.json'));
  const missingFiles = englishFiles.filter(f => !files.includes(f));
  
  if (missingFiles.length > 0) {
    console.log(`\n⚠️ Missing Files in Tamil:`);
    missingFiles.forEach(f => console.log(`   - ${f}`));
  }
  
  // Recommendations
  console.log('\n' + '='.repeat(80));
  console.log('💡 RECOMMENDATIONS:');
  console.log('='.repeat(80));
  
  if (overallPercentage < 100) {
    console.log(`1. Need to translate ${totalReport.englishKeys} remaining English keys`);
    console.log(`2. Priority files with most English content:`);
    
    const priorityFiles = totalReport.fileReports
      .filter(r => r.englishKeys > 0)
      .sort((a, b) => b.englishKeys - a.englishKeys)
      .slice(0, 5);
    
    priorityFiles.forEach((f, i) => {
      console.log(`   ${i + 1}. ${f.file}: ${f.englishKeys} keys need translation`);
    });
  }
  
  if (missingFiles.length > 0) {
    console.log(`3. Create missing files: ${missingFiles.join(', ')}`);
  }
  
  // Generate fix file
  generateFixFile(totalReport);
  
  return totalReport;
}

function analyzeFile(filename, content, englishContent) {
  const report = {
    file: filename,
    totalKeys: 0,
    tamilKeys: 0,
    englishKeys: 0,
    mixedKeys: 0,
    sampleEnglishKeys: []
  };
  
  function analyzeObject(obj, path = '') {
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (typeof value === 'string') {
        report.totalKeys++;
        
        const hasTamil = TAMIL_REGEX.test(value);
        const isEnglish = ENGLISH_REGEX.test(value);
        
        if (hasTamil && !isEnglish) {
          report.tamilKeys++;
        } else if (!hasTamil && isEnglish) {
          report.englishKeys++;
          if (report.sampleEnglishKeys.length < 10) {
            report.sampleEnglishKeys.push({
              path: currentPath,
              value: value.substring(0, 50) + (value.length > 50 ? '...' : '')
            });
          }
        } else if (hasTamil && isEnglish) {
          report.mixedKeys++;
        }
      } else if (typeof value === 'object' && value !== null) {
        analyzeObject(value, currentPath);
      }
    });
  }
  
  analyzeObject(content);
  return report;
}

function generateFixFile(totalReport) {
  const fixList = [];
  
  totalReport.fileReports.forEach(report => {
    if (report.englishKeys > 0) {
      fixList.push({
        file: report.file,
        englishKeys: report.englishKeys,
        samples: report.sampleEnglishKeys
      });
    }
  });
  
  const outputPath = path.join(__dirname, 'tamil-translation-fix-list.json');
  fs.writeFileSync(outputPath, JSON.stringify(fixList, null, 2));
  console.log(`\n✅ Fix list generated: ${outputPath}`);
}

// Run the analysis
analyzeTamilTranslations();