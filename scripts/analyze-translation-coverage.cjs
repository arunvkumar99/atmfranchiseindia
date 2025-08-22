const fs = require('fs');
const path = require('path');

// All supported languages
const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

console.log('📊 COMPREHENSIVE TRANSLATION COVERAGE ANALYSIS\n');
console.log('=' . repeat(80));
console.log('\nProject: ATM Franchise India');
console.log(`Date: ${new Date().toISOString()}`);
console.log('\n' + '=' . repeat(80) + '\n');

const coverageReport = {};
let globalStats = {
  totalKeys: 0,
  totalTranslated: 0,
  totalEnglishFallback: 0,
  totalPlaceholder: 0
};

// Function to check if a value is translated
function isTranslated(value, enValue, lang) {
  if (!value || typeof value !== 'string') return false;
  
  // Check for placeholder patterns
  if (value.includes('[NEEDS TRANSLATION') || value.includes('[TODO') || value.includes('[TRANSLATE')) {
    return 'placeholder';
  }
  
  // Check if it's the same as English (indicating not translated)
  if (lang !== 'en' && value === enValue) {
    return 'english';
  }
  
  // Check for English patterns in non-English languages
  if (lang !== 'en' && lang !== 'ur') {  // Urdu uses English script sometimes
    // Common English words that shouldn't appear in translations
    const englishPatterns = [
      /^(The |An? |This |That |These |Those )/i,
      /\b(and|or|but|with|for|from|to|in|on|at|by)\b/i,
      /\b(please|submit|click|enter|select|choose)\b/i
    ];
    
    for (const pattern of englishPatterns) {
      if (pattern.test(value)) {
        // Check if more than 50% of the text is English
        const englishWords = value.match(/[a-zA-Z]+/g) || [];
        const totalWords = value.split(/\s+/).length;
        if (englishWords.length / totalWords > 0.5) {
          return 'english';
        }
      }
    }
  }
  
  return 'translated';
}

// Analyze each language
languages.forEach(lang => {
  if (lang === 'en') return; // Skip English as it's the base
  
  const langDir = path.join(__dirname, '..', 'public', 'locales', lang);
  const enDir = path.join(__dirname, '..', 'public', 'locales', 'en');
  
  if (!fs.existsSync(langDir)) {
    console.log(`⚠️  Directory not found: ${lang}`);
    return;
  }
  
  coverageReport[lang] = {
    files: {},
    totalKeys: 0,
    translatedKeys: 0,
    englishFallback: 0,
    placeholderKeys: 0,
    missingFiles: [],
    coverage: 0
  };
  
  // Get all English files to compare
  const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  
  enFiles.forEach(file => {
    const enFilePath = path.join(enDir, file);
    const langFilePath = path.join(langDir, file);
    
    if (!fs.existsSync(langFilePath)) {
      coverageReport[lang].missingFiles.push(file);
      return;
    }
    
    try {
      const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
      const langContent = JSON.parse(fs.readFileSync(langFilePath, 'utf8'));
      
      let fileStats = {
        total: 0,
        translated: 0,
        english: 0,
        placeholder: 0
      };
      
      // Recursive function to analyze content
      function analyzeObject(obj, enObj) {
        for (const [key, value] of Object.entries(enObj)) {
          if (typeof value === 'string') {
            fileStats.total++;
            coverageReport[lang].totalKeys++;
            globalStats.totalKeys++;
            
            const langValue = obj?.[key];
            const status = isTranslated(langValue, value, lang);
            
            if (status === 'translated') {
              fileStats.translated++;
              coverageReport[lang].translatedKeys++;
              globalStats.totalTranslated++;
            } else if (status === 'english') {
              fileStats.english++;
              coverageReport[lang].englishFallback++;
              globalStats.totalEnglishFallback++;
            } else {
              fileStats.placeholder++;
              coverageReport[lang].placeholderKeys++;
              globalStats.totalPlaceholder++;
            }
          } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            analyzeObject(obj?.[key] || {}, value);
          }
        }
      }
      
      analyzeObject(langContent, enContent);
      
      coverageReport[lang].files[file] = {
        ...fileStats,
        coverage: fileStats.total > 0 ? (fileStats.translated / fileStats.total * 100).toFixed(1) : 0
      };
      
    } catch (error) {
      console.error(`❌ Error analyzing ${lang}/${file}: ${error.message}`);
    }
  });
  
  // Calculate overall coverage for language
  if (coverageReport[lang].totalKeys > 0) {
    coverageReport[lang].coverage = (
      coverageReport[lang].translatedKeys / coverageReport[lang].totalKeys * 100
    ).toFixed(1);
  }
});

// Print detailed report
console.log('📈 LANGUAGE COVERAGE SUMMARY:\n');
console.log('| Language | Coverage | Translated | English | Placeholder | Total Keys |');
console.log('|----------|----------|------------|---------|-------------|------------|');

Object.entries(coverageReport).forEach(([lang, stats]) => {
  const langName = languages.find(l => l === lang) || lang;
  const coverage = `${stats.coverage}%`.padEnd(8);
  const translated = String(stats.translatedKeys).padEnd(10);
  const english = String(stats.englishFallback).padEnd(7);
  const placeholder = String(stats.placeholderKeys).padEnd(11);
  const total = String(stats.totalKeys).padEnd(10);
  
  // Color code based on coverage
  let status = '✅';
  if (stats.coverage < 30) status = '❌';
  else if (stats.coverage < 60) status = '⚠️';
  else if (stats.coverage < 90) status = '🔄';
  
  console.log(`| ${langName.toUpperCase().padEnd(8)} | ${coverage} | ${translated} | ${english} | ${placeholder} | ${total} | ${status}`);
});

// Language rankings
console.log('\n📊 LANGUAGE RANKINGS (by coverage):\n');
const sorted = Object.entries(coverageReport)
  .sort((a, b) => parseFloat(b[1].coverage) - parseFloat(a[1].coverage));

sorted.forEach(([lang, stats], index) => {
  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
  console.log(`${medal} ${lang.toUpperCase()}: ${stats.coverage}% (${stats.translatedKeys}/${stats.totalKeys} keys)`);
});

// File-level analysis for worst performing languages
console.log('\n🔍 DETAILED ANALYSIS FOR LANGUAGES BELOW 50%:\n');

Object.entries(coverageReport).forEach(([lang, stats]) => {
  if (parseFloat(stats.coverage) < 50) {
    console.log(`\n${lang.toUpperCase()} - ${stats.coverage}% Coverage:`);
    console.log('-'.repeat(60));
    
    // Show worst files
    const worstFiles = Object.entries(stats.files)
      .sort((a, b) => parseFloat(a[1].coverage) - parseFloat(b[1].coverage))
      .slice(0, 5);
    
    console.log('  Worst translated files:');
    worstFiles.forEach(([file, fileStats]) => {
      console.log(`    ${file}: ${fileStats.coverage}% (${fileStats.translated}/${fileStats.total})`);
    });
    
    if (stats.missingFiles.length > 0) {
      console.log(`  Missing files: ${stats.missingFiles.join(', ')}`);
    }
  }
});

// Global statistics
console.log('\n' + '=' . repeat(80));
console.log('\n🌍 GLOBAL STATISTICS:\n');
console.log(`  Total keys across all languages: ${globalStats.totalKeys}`);
console.log(`  Total translated keys: ${globalStats.totalTranslated}`);
console.log(`  Total English fallbacks: ${globalStats.totalEnglishFallback}`);
console.log(`  Total placeholders: ${globalStats.totalPlaceholder}`);
console.log(`  Overall translation rate: ${(globalStats.totalTranslated / globalStats.totalKeys * 100).toFixed(1)}%`);

// Recommendations
console.log('\n💡 RECOMMENDATIONS:\n');

const criticalLanguages = sorted.filter(([_, stats]) => parseFloat(stats.coverage) < 30);
const needsWork = sorted.filter(([_, stats]) => parseFloat(stats.coverage) >= 30 && parseFloat(stats.coverage) < 60);
const almostThere = sorted.filter(([_, stats]) => parseFloat(stats.coverage) >= 60 && parseFloat(stats.coverage) < 90);

if (criticalLanguages.length > 0) {
  console.log('🚨 CRITICAL - Immediate action required:');
  criticalLanguages.forEach(([lang, stats]) => {
    console.log(`   ${lang.toUpperCase()}: Only ${stats.coverage}% translated (${stats.totalKeys - stats.translatedKeys} keys needed)`);
  });
}

if (needsWork.length > 0) {
  console.log('\n⚠️  NEEDS ATTENTION:');
  needsWork.forEach(([lang, stats]) => {
    console.log(`   ${lang.toUpperCase()}: ${stats.coverage}% translated (${stats.totalKeys - stats.translatedKeys} keys needed)`);
  });
}

if (almostThere.length > 0) {
  console.log('\n🔄 ALMOST COMPLETE:');
  almostThere.forEach(([lang, stats]) => {
    console.log(`   ${lang.toUpperCase()}: ${stats.coverage}% translated (${stats.totalKeys - stats.translatedKeys} keys needed)`);
  });
}

console.log('\n' + '=' . repeat(80));
console.log('\n✅ Translation Coverage Analysis Complete!');
console.log(`   Report generated at: ${new Date().toLocaleString()}`);