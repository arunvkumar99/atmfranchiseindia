#!/usr/bin/env node

/**
 * Comprehensive audit of translation quality
 * Checks for English content in non-English files
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Common English words that shouldn't appear in translations
const ENGLISH_WORDS = [
  'Become', 'Submit', 'Apply', 'Agent', 'Influencer', 'Privacy', 
  'Terms', 'Refund', 'Contact', 'About', 'Products', 'Start',
  'Your', 'Business', 'Benefits', 'Support', 'Training', 'Form',
  'Partnership', 'Program', 'Network', 'Application'
];

// Script detection patterns
const SCRIPT_PATTERNS = {
  hi: /[\u0900-\u097F]/,  // Devanagari (Hindi)
  mr: /[\u0900-\u097F]/,  // Devanagari (Marathi)
  bn: /[\u0980-\u09FF]/,  // Bengali
  as: /[\u0980-\u09FF]/,  // Assamese (uses Bengali script)
  ta: /[\u0B80-\u0BFF]/,  // Tamil
  te: /[\u0C00-\u0C7F]/,  // Telugu
  gu: /[\u0A80-\u0AFF]/,  // Gujarati
  ur: /[\u0600-\u06FF]/,  // Arabic (Urdu)
  kn: /[\u0C80-\u0CFF]/,  // Kannada
  or: /[\u0B00-\u0B7F]/,  // Odia
  pa: /[\u0A00-\u0A7F]/,  // Gurmukhi (Punjabi)
  ml: /[\u0D00-\u0D7F]/,  // Malayalam
};

async function auditFile(filePath, lang) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const jsonStr = JSON.stringify(content);
    
    // Check for native script
    const hasNativeScript = SCRIPT_PATTERNS[lang] && SCRIPT_PATTERNS[lang].test(content);
    
    // Count English words
    let englishWordCount = 0;
    for (const word of ENGLISH_WORDS) {
      if (content.includes(word)) {
        englishWordCount++;
      }
    }
    
    // Sample some values to check
    const json = JSON.parse(content);
    const sampleValues = [];
    
    function extractSamples(obj, depth = 0) {
      if (depth > 3 || sampleValues.length >= 5) return;
      for (const value of Object.values(obj)) {
        if (typeof value === 'string' && sampleValues.length < 5) {
          sampleValues.push(value.substring(0, 50));
        } else if (typeof value === 'object' && value !== null) {
          extractSamples(value, depth + 1);
        }
      }
    }
    
    extractSamples(json);
    
    return {
      hasNativeScript,
      englishWordCount,
      sampleValues,
      fileSize: content.length
    };
  } catch (error) {
    return {
      error: error.message
    };
  }
}

async function runAudit() {
  console.log('🔍 COMPREHENSIVE TRANSLATION AUDIT\n');
  console.log('=' .repeat(70));
  
  const results = {};
  const suspiciousFiles = [];
  
  // Get all JSON files
  const enFiles = await fs.readdir(path.join(LOCALES_DIR, 'en'));
  const jsonFiles = enFiles.filter(f => f.endsWith('.json'));
  
  console.log(`\n📁 Auditing ${jsonFiles.length} files across ${LANGUAGES.length} languages...\n`);
  
  for (const file of jsonFiles) {
    results[file] = {};
    
    for (const lang of LANGUAGES) {
      const filePath = path.join(LOCALES_DIR, lang, file);
      const audit = await auditFile(filePath, lang);
      results[file][lang] = audit;
      
      // Flag suspicious files
      if (audit.hasNativeScript === false || audit.englishWordCount > 3) {
        suspiciousFiles.push({ file, lang, reason: audit.englishWordCount > 3 ? 'Too much English' : 'No native script' });
      }
    }
  }
  
  // Display results
  console.log('📊 AUDIT RESULTS BY FILE:\n');
  console.log('File'.padEnd(20) + ' | Native Script | English Words | Status');
  console.log('-'.repeat(70));
  
  for (const [file, langs] of Object.entries(results)) {
    console.log(`\n${file}:`);
    
    for (const [lang, audit] of Object.entries(langs)) {
      if (audit.error) {
        console.log(`  ${lang.padEnd(3)} - ERROR: ${audit.error}`);
        continue;
      }
      
      const scriptStatus = audit.hasNativeScript ? '✅' : '❌';
      const englishStatus = audit.englishWordCount === 0 ? '✅' : 
                           audit.englishWordCount <= 2 ? '⚠️' : '❌';
      const overall = (audit.hasNativeScript && audit.englishWordCount <= 2) ? '✅ OK' : '❌ FAIL';
      
      console.log(`  ${lang.padEnd(3)} - Script: ${scriptStatus} | English words: ${audit.englishWordCount} ${englishStatus} | ${overall}`);
      
      // Show sample if suspicious
      if (!audit.hasNativeScript || audit.englishWordCount > 3) {
        console.log(`       Sample: "${audit.sampleValues[0] || 'N/A'}"`);
      }
    }
  }
  
  // Summary of suspicious files
  if (suspiciousFiles.length > 0) {
    console.log('\n⚠️ SUSPICIOUS FILES (May not be properly translated):\n');
    for (const { file, lang, reason } of suspiciousFiles) {
      console.log(`  - ${lang}/${file}: ${reason}`);
    }
  }
  
  // Overall statistics
  const totalFiles = jsonFiles.length * LANGUAGES.length;
  const failedFiles = suspiciousFiles.length;
  const successRate = ((totalFiles - failedFiles) / totalFiles * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(70));
  console.log('📈 OVERALL STATISTICS:\n');
  console.log(`Total files audited: ${totalFiles}`);
  console.log(`Files with proper translations: ${totalFiles - failedFiles}`);
  console.log(`Files with issues: ${failedFiles}`);
  console.log(`Success rate: ${successRate}%`);
  
  // Detailed check for specific pages
  console.log('\n🔎 DETAILED CHECK FOR NON-HOME PAGES:\n');
  const checkPages = ['agent.json', 'privacy.json', 'startAtm.json', 'franchise.json'];
  
  for (const page of checkPages) {
    if (results[page]) {
      console.log(`\n${page}:`);
      for (const [lang, audit] of Object.entries(results[page])) {
        if (audit.sampleValues && audit.sampleValues.length > 0) {
          const sample = audit.sampleValues[0];
          const isEnglish = /^[A-Za-z\s]+$/.test(sample);
          console.log(`  ${lang}: "${sample.substring(0, 40)}..." ${isEnglish ? '❌ ENGLISH' : '✅ TRANSLATED'}`);
        }
      }
    }
  }
}

runAudit().catch(console.error);