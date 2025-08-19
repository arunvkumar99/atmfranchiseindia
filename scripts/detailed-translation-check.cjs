#!/usr/bin/env node

/**
 * Detailed script to check actual translation status
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Check if content contains non-Latin scripts (indicates translation)
function hasNonLatinScript(text) {
  // Check for various scripts
  const scripts = {
    devanagari: /[\u0900-\u097F]/,  // Hindi, Marathi
    bengali: /[\u0980-\u09FF]/,     // Bengali, Assamese  
    tamil: /[\u0B80-\u0BFF]/,       // Tamil
    telugu: /[\u0C00-\u0C7F]/,      // Telugu
    gujarati: /[\u0A80-\u0AFF]/,    // Gujarati
    arabic: /[\u0600-\u06FF]/,      // Urdu
    kannada: /[\u0C80-\u0CFF]/,     // Kannada
    oriya: /[\u0B00-\u0B7F]/,       // Odia
    gurmukhi: /[\u0A00-\u0A7F]/,    // Punjabi
    malayalam: /[\u0D00-\u0D7F]/,   // Malayalam
  };
  
  for (const script of Object.values(scripts)) {
    if (script.test(text)) {
      return true;
    }
  }
  
  return false;
}

async function analyzeFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return hasNonLatinScript(content);
  } catch (error) {
    return false;
  }
}

async function analyzeTranslations() {
  console.log('\n📊 DETAILED TRANSLATION ANALYSIS\n');
  console.log('=' .repeat(70));
  
  const allFiles = new Set();
  const fileStatus = {};
  
  // First, get all unique files
  for (const lang of LANGUAGES) {
    const langDir = path.join(LOCALES_DIR, lang);
    try {
      const files = await fs.readdir(langDir);
      files.filter(f => f.endsWith('.json')).forEach(f => allFiles.add(f));
    } catch (error) {
      // Language directory might not exist
    }
  }
  
  // Check each file in each language
  for (const file of Array.from(allFiles).sort()) {
    fileStatus[file] = {};
    
    for (const lang of LANGUAGES) {
      const filePath = path.join(LOCALES_DIR, lang, file);
      const isTranslated = await analyzeFile(filePath);
      fileStatus[file][lang] = isTranslated;
    }
  }
  
  // Display results by file
  console.log('\n📁 TRANSLATION STATUS BY FILE:\n');
  console.log('File'.padEnd(20) + ' | ' + LANGUAGES.map(l => l.padEnd(3)).join(' '));
  console.log('-'.repeat(70));
  
  const languageTotals = {};
  LANGUAGES.forEach(lang => languageTotals[lang] = { translated: 0, total: 0 });
  
  for (const [file, langs] of Object.entries(fileStatus)) {
    let row = file.padEnd(20) + ' | ';
    
    for (const lang of LANGUAGES) {
      const isTranslated = langs[lang];
      if (isTranslated === true) {
        row += '✅  ';
        languageTotals[lang].translated++;
      } else if (isTranslated === false) {
        row += '❌  ';
      } else {
        row += '⬜  ';
      }
      if (langs[lang] !== undefined) {
        languageTotals[lang].total++;
      }
    }
    
    console.log(row);
  }
  
  // Display summary by language
  console.log('\n📈 TRANSLATION COMPLETION BY LANGUAGE:\n');
  console.log('Language    | Files | Translated | Percentage');
  console.log('-'.repeat(50));
  
  let totalFiles = 0;
  let totalTranslated = 0;
  
  for (const lang of LANGUAGES) {
    const stats = languageTotals[lang];
    const percentage = stats.total > 0 ? Math.round((stats.translated / stats.total) * 100) : 0;
    
    console.log(
      `${getLanguageName(lang).padEnd(12)}| ${String(stats.total).padEnd(6)}| ${String(stats.translated).padEnd(11)}| ${percentage}%`
    );
    
    totalFiles += stats.total;
    totalTranslated += stats.translated;
  }
  
  console.log('='.repeat(50));
  const overallPercentage = totalFiles > 0 ? Math.round((totalTranslated / totalFiles) * 100) : 0;
  console.log(`OVERALL     | ${String(totalFiles).padEnd(6)}| ${String(totalTranslated).padEnd(11)}| ${overallPercentage}%`);
  
  // List files that need translation
  console.log('\n🔄 FILES NEEDING TRANSLATION:\n');
  
  for (const [file, langs] of Object.entries(fileStatus)) {
    const untranslatedLangs = LANGUAGES.filter(lang => langs[lang] === false);
    if (untranslatedLangs.length > 0) {
      console.log(`${file}: Needs translation for ${untranslatedLangs.length} languages`);
    }
  }
  
  console.log('\n📊 SUMMARY:\n');
  console.log(`✅ Actually Translated: ${totalTranslated}/${totalFiles} files (${overallPercentage}%)`);
  console.log(`❌ English Copies: ${totalFiles - totalTranslated} files`);
  
  // Legend
  console.log('\nLegend: ✅ = Translated, ❌ = English copy, ⬜ = File missing');
}

function getLanguageName(code) {
  const names = {
    hi: 'Hindi',
    bn: 'Bengali',
    ta: 'Tamil',
    te: 'Telugu',
    mr: 'Marathi',
    gu: 'Gujarati',
    ur: 'Urdu',
    kn: 'Kannada',
    or: 'Odia',
    pa: 'Punjabi',
    as: 'Assamese',
    ml: 'Malayalam'
  };
  return names[code] || code;
}

analyzeTranslations().catch(console.error);