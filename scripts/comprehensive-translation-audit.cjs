#!/usr/bin/env node

/**
 * Comprehensive Translation Audit
 * This script performs a detailed analysis of translation completeness
 * by comparing actual content between English and target languages
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Script-specific character patterns for each language
const SCRIPT_PATTERNS = {
  hi: /[\u0900-\u097F]/,  // Devanagari
  mr: /[\u0900-\u097F]/,  // Devanagari
  bn: /[\u0980-\u09FF]/,  // Bengali
  as: /[\u0980-\u09FF]/,  // Assamese (Bengali script)
  ta: /[\u0B80-\u0BFF]/,  // Tamil
  te: /[\u0C00-\u0C7F]/,  // Telugu
  gu: /[\u0A80-\u0AFF]/,  // Gujarati
  ur: /[\u0600-\u06FF]/,  // Arabic
  kn: /[\u0C80-\u0CFF]/,  // Kannada
  or: /[\u0B00-\u0B7F]/,  // Odia
  pa: /[\u0A00-\u0A7F]/,  // Gurmukhi
  ml: /[\u0D00-\u0D7F]/,  // Malayalam
};

// Known English phrases that should NOT appear in translations
const ENGLISH_INDICATORS = [
  'Become', 'Partner', 'Agent', 'Apply', 'Submit', 'Form',
  'Start your', 'Join our', 'Get started', 'Learn more',
  'High Returns', 'Low Investment', 'Full Support',
  'Download', 'Contact', 'About', 'Privacy', 'Terms',
  'Your Name', 'Your Email', 'Phone Number', 'Message',
  'Required field', 'Please enter', 'Invalid',
  'Benefits', 'Features', 'Services', 'Products'
];

/**
 * Deep compare objects and extract all string values
 */
function extractAllStrings(obj, path = '') {
  const strings = [];
  
  function traverse(current, currentPath) {
    if (typeof current === 'string') {
      strings.push({
        path: currentPath,
        value: current,
        length: current.length
      });
    } else if (Array.isArray(current)) {
      current.forEach((item, index) => {
        traverse(item, `${currentPath}[${index}]`);
      });
    } else if (typeof current === 'object' && current !== null) {
      Object.entries(current).forEach(([key, value]) => {
        traverse(value, currentPath ? `${currentPath}.${key}` : key);
      });
    }
  }
  
  traverse(obj, path);
  return strings;
}

/**
 * Analyze a single translation file
 */
async function analyzeTranslation(lang, fileName, englishContent) {
  const filePath = path.join(LOCALES_DIR, lang, fileName);
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(content);
    const englishJson = JSON.parse(englishContent);
    
    // Extract all strings
    const englishStrings = extractAllStrings(englishJson);
    const translatedStrings = extractAllStrings(json);
    
    // Analysis metrics
    let totalStrings = 0;
    let translatedCount = 0;
    let englishCount = 0;
    let emptyCount = 0;
    let hasNativeScript = 0;
    const untranslatedPaths = [];
    const suspiciousTranslations = [];
    
    // Compare each string
    englishStrings.forEach((engStr, index) => {
      const transStr = translatedStrings[index];
      
      if (!transStr) {
        untranslatedPaths.push(engStr.path);
        return;
      }
      
      totalStrings++;
      
      // Check if empty
      if (!transStr.value || transStr.value.trim() === '') {
        emptyCount++;
        untranslatedPaths.push(engStr.path);
        return;
      }
      
      // Check if same as English (case-insensitive)
      if (transStr.value.toLowerCase() === engStr.value.toLowerCase()) {
        englishCount++;
        untranslatedPaths.push(engStr.path);
        return;
      }
      
      // Check for native script
      const hasScript = SCRIPT_PATTERNS[lang] && SCRIPT_PATTERNS[lang].test(transStr.value);
      
      // Check for English indicators
      let hasEnglishWords = false;
      for (const indicator of ENGLISH_INDICATORS) {
        if (transStr.value.includes(indicator)) {
          hasEnglishWords = true;
          break;
        }
      }
      
      if (hasScript && !hasEnglishWords) {
        translatedCount++;
        hasNativeScript++;
      } else {
        suspiciousTranslations.push({
          path: engStr.path,
          english: engStr.value.substring(0, 50),
          translated: transStr.value.substring(0, 50),
          issue: !hasScript ? 'No native script' : 'Contains English words'
        });
      }
    });
    
    const percentage = totalStrings > 0 ? Math.round((translatedCount / totalStrings) * 100) : 0;
    
    return {
      fileName,
      totalStrings,
      translatedCount,
      englishCount,
      emptyCount,
      percentage,
      hasNativeScript,
      untranslatedPaths: untranslatedPaths.slice(0, 5), // First 5 examples
      suspiciousTranslations: suspiciousTranslations.slice(0, 3) // First 3 examples
    };
    
  } catch (error) {
    return {
      fileName,
      error: error.message
    };
  }
}

/**
 * Main audit function
 */
async function runComprehensiveAudit() {
  console.log('📊 COMPREHENSIVE TRANSLATION AUDIT');
  console.log('=' .repeat(80));
  console.log('Analyzing actual translation content (not just file presence)...\n');
  
  // Get all JSON files from English directory
  const englishFiles = await fs.readdir(path.join(LOCALES_DIR, 'en'));
  const jsonFiles = englishFiles.filter(f => f.endsWith('.json'));
  
  const auditResults = {};
  const overallStats = {
    languages: {},
    files: {}
  };
  
  // Analyze each language
  for (const lang of LANGUAGES) {
    console.log(`\n🔍 Analyzing ${lang.toUpperCase()}...`);
    auditResults[lang] = {};
    let langTotal = 0;
    let langTranslated = 0;
    
    for (const file of jsonFiles) {
      const englishPath = path.join(LOCALES_DIR, 'en', file);
      const englishContent = await fs.readFile(englishPath, 'utf8');
      
      const result = await analyzeTranslation(lang, file, englishContent);
      auditResults[lang][file] = result;
      
      if (!result.error) {
        langTotal += result.totalStrings;
        langTranslated += result.translatedCount;
        
        // Track file-level stats
        if (!overallStats.files[file]) {
          overallStats.files[file] = {};
        }
        overallStats.files[file][lang] = result.percentage;
      }
    }
    
    const langPercentage = langTotal > 0 ? Math.round((langTranslated / langTotal) * 100) : 0;
    overallStats.languages[lang] = {
      percentage: langPercentage,
      totalStrings: langTotal,
      translatedStrings: langTranslated
    };
  }
  
  // Print detailed results
  console.log('\n' + '='.repeat(80));
  console.log('📈 LANGUAGE-LEVEL SUMMARY:\n');
  
  for (const [lang, stats] of Object.entries(overallStats.languages)) {
    const bar = '█'.repeat(Math.floor(stats.percentage / 5)) + '░'.repeat(20 - Math.floor(stats.percentage / 5));
    console.log(`${lang.toUpperCase().padEnd(3)} [${bar}] ${stats.percentage}% (${stats.translatedStrings}/${stats.totalStrings} strings)`);
  }
  
  // File-level summary for key pages
  console.log('\n' + '='.repeat(80));
  console.log('📄 KEY PAGE TRANSLATION STATUS:\n');
  
  const keyPages = ['home.json', 'agent.json', 'franchise.json', 'startAtm.json', 'privacy.json', 'products.json'];
  
  for (const page of keyPages) {
    if (!overallStats.files[page]) continue;
    
    console.log(`\n${page}:`);
    for (const lang of LANGUAGES) {
      const percentage = overallStats.files[page][lang] || 0;
      const status = percentage >= 90 ? '✅' : percentage >= 50 ? '⚠️' : '❌';
      console.log(`  ${lang.padEnd(3)}: ${status} ${percentage}%`);
    }
  }
  
  // Detailed issues for problematic files
  console.log('\n' + '='.repeat(80));
  console.log('⚠️ FILES WITH TRANSLATION ISSUES:\n');
  
  for (const [lang, files] of Object.entries(auditResults)) {
    const issues = [];
    
    for (const [fileName, result] of Object.entries(files)) {
      if (result.percentage < 50 && !result.error) {
        issues.push({
          file: fileName,
          percentage: result.percentage,
          englishCount: result.englishCount,
          examples: result.untranslatedPaths
        });
      }
    }
    
    if (issues.length > 0) {
      console.log(`\n${lang.toUpperCase()}:`);
      for (const issue of issues.slice(0, 3)) {
        console.log(`  - ${issue.file}: Only ${issue.percentage}% translated`);
        console.log(`    English strings found: ${issue.englishCount}`);
        if (issue.examples.length > 0) {
          console.log(`    Example untranslated paths:`);
          issue.examples.slice(0, 2).forEach(path => {
            console.log(`      • ${path}`);
          });
        }
      }
    }
  }
  
  // Overall verdict
  const avgPercentage = Math.round(
    Object.values(overallStats.languages).reduce((sum, s) => sum + s.percentage, 0) / LANGUAGES.length
  );
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 OVERALL TRANSLATION COMPLETION:\n');
  console.log(`Average across all languages: ${avgPercentage}%`);
  
  if (avgPercentage >= 90) {
    console.log('✅ Translations are mostly complete!');
  } else if (avgPercentage >= 70) {
    console.log('⚠️ Translations are partially complete. More work needed.');
  } else {
    console.log('❌ Significant translation work required.');
  }
  
  // Specific recommendations
  console.log('\n📝 RECOMMENDATIONS:\n');
  
  const criticalPages = [];
  for (const [file, langs] of Object.entries(overallStats.files)) {
    const avgFilePercentage = Math.round(
      Object.values(langs).reduce((sum, p) => sum + p, 0) / Object.keys(langs).length
    );
    if (avgFilePercentage < 50) {
      criticalPages.push({ file, percentage: avgFilePercentage });
    }
  }
  
  if (criticalPages.length > 0) {
    console.log('Critical pages needing immediate translation:');
    criticalPages.forEach(({ file, percentage }) => {
      console.log(`  • ${file}: ${percentage}% average completion`);
    });
  }
  
  // Export detailed report
  const reportPath = path.join(__dirname, '..', 'translation-audit-report.json');
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      averageCompletion: avgPercentage,
      languages: overallStats.languages,
      files: overallStats.files
    },
    detailed: auditResults
  }, null, 2));
  
  console.log(`\n📁 Detailed report saved to: translation-audit-report.json`);
}

// Run the audit
runComprehensiveAudit().catch(console.error);