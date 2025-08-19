#!/usr/bin/env node

/**
 * Script to verify actual translation status
 * Checks if content is actually translated or just English
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Common English words to detect untranslated content
const ENGLISH_INDICATORS = [
  'Become', 'Agent', 'Submit', 'Apply', 'Benefits', 
  'Privacy', 'Terms', 'Refund', 'Contact',
  'High Commission', 'Full Support', 'Free Training'
];

async function checkIfTranslated(content) {
  const text = JSON.stringify(content);
  
  // Count English indicators
  let englishCount = 0;
  for (const word of ENGLISH_INDICATORS) {
    if (text.includes(word)) {
      englishCount++;
    }
  }
  
  // If more than 3 English indicators, likely not translated
  return englishCount <= 3;
}

async function analyzeTranslations() {
  console.log('📊 Analyzing Actual Translation Status...\n');
  console.log('=' .repeat(60));
  
  const results = {};
  
  for (const lang of LANGUAGES) {
    const langDir = path.join(LOCALES_DIR, lang);
    results[lang] = {
      total: 0,
      translated: 0,
      untranslated: [],
      percentage: 0
    };
    
    try {
      const files = await fs.readdir(langDir);
      const jsonFiles = files.filter(f => f.endsWith('.json'));
      
      for (const file of jsonFiles) {
        const filePath = path.join(langDir, file);
        const content = await fs.readFile(filePath, 'utf8');
        const json = JSON.parse(content);
        
        results[lang].total++;
        
        if (await checkIfTranslated(json)) {
          results[lang].translated++;
        } else {
          results[lang].untranslated.push(file);
        }
      }
      
      results[lang].percentage = Math.round((results[lang].translated / results[lang].total) * 100);
      
    } catch (error) {
      console.error(`Error processing ${lang}:`, error.message);
    }
  }
  
  // Display results
  console.log('\n📈 ACTUAL TRANSLATION STATUS BY LANGUAGE:\n');
  console.log('Language | Files | Translated | Untranslated | % Complete');
  console.log('-'.repeat(60));
  
  let totalFiles = 0;
  let totalTranslated = 0;
  
  for (const [lang, data] of Object.entries(results)) {
    const langName = getLanguageName(lang);
    console.log(
      `${langName.padEnd(9)}| ${String(data.total).padEnd(6)}| ${String(data.translated).padEnd(11)}| ${String(data.total - data.translated).padEnd(13)}| ${data.percentage}%`
    );
    
    totalFiles += data.total;
    totalTranslated += data.translated;
  }
  
  console.log('='.repeat(60));
  const overallPercentage = Math.round((totalTranslated / totalFiles) * 100);
  console.log(`OVERALL  | ${String(totalFiles).padEnd(6)}| ${String(totalTranslated).padEnd(11)}| ${String(totalFiles - totalTranslated).padEnd(13)}| ${overallPercentage}%`);
  
  // List untranslated files
  console.log('\n❌ UNTRANSLATED FILES (Just English copies):\n');
  for (const [lang, data] of Object.entries(results)) {
    if (data.untranslated.length > 0) {
      console.log(`${getLanguageName(lang)}: ${data.untranslated.join(', ')}`);
    }
  }
  
  // Summary
  console.log('\n📊 SUMMARY:\n');
  console.log(`✅ Actually Translated: ${totalTranslated} files (${overallPercentage}%)`);
  console.log(`❌ English Copies: ${totalFiles - totalTranslated} files (${100 - overallPercentage}%)`);
  console.log(`📁 Total Files: ${totalFiles} files`);
  
  // Files that need translation
  const needsTranslation = new Set();
  for (const data of Object.values(results)) {
    data.untranslated.forEach(file => needsTranslation.add(file));
  }
  
  console.log('\n🔄 Files needing translation:');
  Array.from(needsTranslation).sort().forEach(file => {
    console.log(`  - ${file}`);
  });
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