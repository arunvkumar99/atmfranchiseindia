#!/usr/bin/env node

/**
 * Find English content in non-English translation files
 * This identifies which specific sections are still in English
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Common English phrases that indicate untranslated content
const ENGLISH_PHRASES = [
  // Form labels
  'Your Name', 'Your Email', 'Phone Number', 'Enter your', 'Select', 'Choose',
  
  // CTAs
  'Get Started', 'Learn More', 'Apply Now', 'Submit Application', 'Download',
  'Contact Us', 'Join Us', 'Start Now', 'Sign Up', 'Register',
  
  // Business terms that should be translated
  'High Returns', 'Low Investment', 'Full Support', 'Quick ROI',
  'Dedicated Support', 'Training Program', 'Partnership Benefits',
  
  // Page sections
  'About Us', 'Our Products', 'Privacy Policy', 'Terms', 'Refund Policy',
  'Frequently Asked Questions', 'How It Works', 'Why Choose Us',
  
  // Error messages
  'Required field', 'Invalid email', 'Please enter', 'Must be',
  
  // Specific untranslated sections
  'Become ATM Agent', 'Submit ATM Location', 'Start Your ATM Business',
  'ATM Franchise Partner', 'Join our network'
];

async function findEnglishContent(lang, fileName) {
  const filePath = path.join(LOCALES_DIR, lang, fileName);
  
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(content);
    
    const englishFindings = [];
    
    function checkForEnglish(obj, path = '') {
      for (const [key, value] of Object.entries(obj)) {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'string') {
          // Check for English phrases
          for (const phrase of ENGLISH_PHRASES) {
            if (value.includes(phrase)) {
              englishFindings.push({
                path: currentPath,
                value: value.substring(0, 100),
                englishPhrase: phrase
              });
              break;
            }
          }
          
          // Check if it's mostly ASCII (likely English)
          const asciiRatio = (value.match(/[a-zA-Z]/g) || []).length / value.length;
          if (asciiRatio > 0.8 && value.length > 10) {
            englishFindings.push({
              path: currentPath,
              value: value.substring(0, 100),
              englishPhrase: 'Mostly ASCII text'
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          checkForEnglish(value, currentPath);
        }
      }
    }
    
    checkForEnglish(json);
    
    return {
      fileName,
      englishCount: englishFindings.length,
      findings: englishFindings.slice(0, 5) // Top 5 findings
    };
    
  } catch (error) {
    return {
      fileName,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 FINDING ENGLISH CONTENT IN TRANSLATIONS\n');
  console.log('=' .repeat(70));
  
  const englishFiles = await fs.readdir(path.join(LOCALES_DIR, 'en'));
  const jsonFiles = englishFiles.filter(f => f.endsWith('.json'));
  
  const problemFiles = {};
  
  for (const lang of LANGUAGES) {
    console.log(`\n📋 Checking ${lang.toUpperCase()}...`);
    const langProblems = [];
    
    for (const file of jsonFiles) {
      const result = await findEnglishContent(lang, file);
      
      if (result.englishCount > 0) {
        langProblems.push(result);
      }
    }
    
    if (langProblems.length > 0) {
      problemFiles[lang] = langProblems;
      
      console.log(`  ⚠️ Found English content in ${langProblems.length} files:`);
      for (const problem of langProblems) {
        console.log(`    • ${problem.fileName}: ${problem.englishCount} English phrases found`);
        
        if (problem.findings.length > 0) {
          console.log(`      Examples:`);
          problem.findings.slice(0, 2).forEach(f => {
            console.log(`        - "${f.value.substring(0, 50)}..."`);
            console.log(`          Path: ${f.path}`);
            console.log(`          Issue: ${f.englishPhrase}`);
          });
        }
      }
    } else {
      console.log(`  ✅ No obvious English content found`);
    }
  }
  
  // Summary
  console.log('\n' + '=' .repeat(70));
  console.log('📊 SUMMARY:\n');
  
  const totalProblems = Object.values(problemFiles).reduce((sum, probs) => sum + probs.length, 0);
  
  if (totalProblems === 0) {
    console.log('✅ No obvious English content detected in translations!');
  } else {
    console.log(`⚠️ Found potential English content in ${totalProblems} file/language combinations`);
    
    // Most problematic files
    const fileIssueCount = {};
    for (const [lang, problems] of Object.entries(problemFiles)) {
      for (const problem of problems) {
        if (!fileIssueCount[problem.fileName]) {
          fileIssueCount[problem.fileName] = 0;
        }
        fileIssueCount[problem.fileName] += problem.englishCount;
      }
    }
    
    const sortedFiles = Object.entries(fileIssueCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    if (sortedFiles.length > 0) {
      console.log('\nMost problematic files:');
      sortedFiles.forEach(([file, count]) => {
        console.log(`  • ${file}: ${count} total English phrases across languages`);
      });
    }
  }
}

main().catch(console.error);