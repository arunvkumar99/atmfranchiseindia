#!/usr/bin/env node

/**
 * Vikram's Day 2 Script - Comprehensive Translation Testing
 * Purpose: Validate all translation implementations critically
 * Author: Vikram - QA Engineer
 * Date: Day 2 of Translation Fix
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(80));
console.log('VIKRAM\'S CRITICAL TRANSLATION TESTING SUITE');
console.log('='.repeat(80));

const testResults = {
  passed: [],
  failed: [],
  warnings: [],
  critical: []
};

// Test 1: Check all components for useTranslation hook
function testTranslationHooks() {
  console.log('\n[TEST 1] Checking Translation Hooks...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    
    // Skip test files
    if (file.includes('.test.')) return;
    
    // Check for hardcoded strings
    const hardcodedPatterns = [
      />[\s]*[A-Z][a-zA-Z\s]{3,}[\s]*</g,
      /placeholder=["'][A-Z][^"']{3,}["']/g,
      /title=["'][A-Z][^"']{3,}["']/g
    ];
    
    let hasHardcoded = false;
    hardcodedPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        hasHardcoded = true;
      }
    });
    
    if (hasHardcoded && !content.includes('useTranslation')) {
      testResults.failed.push({
        test: 'Translation Hook',
        file,
        reason: 'Has hardcoded strings but no useTranslation'
      });
    } else if (hasHardcoded) {
      testResults.warnings.push({
        test: 'Translation Hook',
        file,
        reason: 'Has hardcoded strings, verify they are being translated'
      });
    } else {
      testResults.passed.push({
        test: 'Translation Hook',
        file
      });
    }
  });
  
  console.log(`  ✓ Tested ${files.length} components`);
}

// Test 2: Validate translation files structure
function testTranslationFiles() {
  console.log('\n[TEST 2] Validating Translation Files...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'as', 'or', 'pa'];
  const namespaces = ['common', 'home', 'forms', 'agent', 'franchise', 'about', 'contact'];
  
  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    
    if (!fs.existsSync(langDir)) {
      testResults.critical.push({
        test: 'Translation Files',
        issue: `Missing language directory: ${lang}`
      });
      return;
    }
    
    namespaces.forEach(ns => {
      const filePath = path.join(langDir, `${ns}.json`);
      
      if (!fs.existsSync(filePath)) {
        testResults.failed.push({
          test: 'Translation Files',
          file: `${lang}/${ns}.json`,
          reason: 'File missing'
        });
      } else {
        try {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          
          // Check if file has content
          if (Object.keys(content).length === 0) {
            testResults.warnings.push({
              test: 'Translation Files',
              file: `${lang}/${ns}.json`,
              reason: 'Empty translation file'
            });
          } else {
            // Check for actual translations (not just English text in non-English files)
            if (lang !== 'en') {
              let hasEnglish = 0;
              let total = 0;
              
              const checkValues = (obj) => {
                Object.values(obj).forEach(value => {
                  if (typeof value === 'string') {
                    total++;
                    // Simple check for English text
                    if (/^[A-Za-z0-9\s\.\,\!\?\-]+$/.test(value)) {
                      hasEnglish++;
                    }
                  } else if (typeof value === 'object') {
                    checkValues(value);
                  }
                });
              };
              
              checkValues(content);
              
              const englishPercentage = (hasEnglish / total) * 100;
              if (englishPercentage > 50) {
                testResults.critical.push({
                  test: 'Translation Quality',
                  file: `${lang}/${ns}.json`,
                  issue: `${englishPercentage.toFixed(0)}% strings appear to be in English`
                });
              }
            }
            
            testResults.passed.push({
              test: 'Translation Files',
              file: `${lang}/${ns}.json`
            });
          }
        } catch (error) {
          testResults.critical.push({
            test: 'Translation Files',
            file: `${lang}/${ns}.json`,
            issue: `Invalid JSON: ${error.message}`
          });
        }
      }
    });
  });
  
  console.log(`  ✓ Validated ${languages.length * namespaces.length} translation files`);
}

// Test 3: Check for React Hook violations
function testReactHooks() {
  console.log('\n[TEST 3] Checking React Hook Violations...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');
  
  const checkDirectory = (dir) => {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
    
    files.forEach(file => {
      const content = fs.readFileSync(path.join(dir, file), 'utf8');
      
      // Check for hooks in conditions
      const conditionalHookPattern = /if\s*\([^)]*\)\s*{[^}]*use[A-Z]/g;
      if (conditionalHookPattern.test(content)) {
        testResults.critical.push({
          test: 'React Hooks',
          file,
          issue: 'Hook called conditionally'
        });
      }
      
      // Check for hooks in loops
      const loopHookPattern = /(for|while|\.map)\s*\([^)]*\)\s*{[^}]*use[A-Z]/g;
      if (loopHookPattern.test(content)) {
        testResults.critical.push({
          test: 'React Hooks',
          file,
          issue: 'Hook called in loop'
        });
      }
    });
  };
  
  checkDirectory(componentsDir);
  checkDirectory(pagesDir);
  
  console.log(`  ✓ Checked React hook rules`);
}

// Test 4: Runtime translation test
function testRuntimeTranslation() {
  console.log('\n[TEST 4] Runtime Translation Test...');
  
  try {
    // Create a test file
    const testContent = `
import React from 'react';
import { render } from '@testing-library/react';
import i18n from '../lib/i18n';
import { I18nextProvider } from 'react-i18next';

// Test component
function TestComponent() {
  const { t } = useTranslation('home');
  return <div>{t('hero.title')}</div>;
}

// Test translation switching
test('Translation switching works', async () => {
  const { rerender, getByText } = render(
    <I18nextProvider i18n={i18n}>
      <TestComponent />
    </I18nextProvider>
  );
  
  // Check English
  expect(getByText(/ATM Franchise/i)).toBeInTheDocument();
  
  // Switch to Hindi
  await i18n.changeLanguage('hi');
  rerender(
    <I18nextProvider i18n={i18n}>
      <TestComponent />
    </I18nextProvider>
  );
  
  // Check Hindi translation exists
  expect(getByText(/एटीएम फ्रेंचाइज़/i)).toBeInTheDocument();
});
`;
    
    const testPath = path.join(__dirname, '..', 'src', 'test-translation-runtime.test.tsx');
    fs.writeFileSync(testPath, testContent);
    
    // Try to run the test
    try {
      execSync('npm test -- test-translation-runtime --no-coverage --silent', {
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
      });
      
      testResults.passed.push({
        test: 'Runtime Translation',
        status: 'Translation switching works correctly'
      });
    } catch (error) {
      testResults.failed.push({
        test: 'Runtime Translation',
        reason: 'Translation switching failed',
        error: error.message
      });
    }
    
    // Clean up test file
    fs.unlinkSync(testPath);
    
  } catch (error) {
    testResults.warnings.push({
      test: 'Runtime Translation',
      reason: 'Could not perform runtime test',
      error: error.message
    });
  }
  
  console.log(`  ✓ Runtime test completed`);
}

// Test 5: Check for duplicate translation keys
function testDuplicateKeys() {
  console.log('\n[TEST 5] Checking for Duplicate Keys...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales', 'en');
  const allKeys = new Map();
  
  const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const content = JSON.parse(fs.readFileSync(path.join(localesDir, file), 'utf8'));
    
    const extractKeys = (obj, prefix = '') => {
      Object.keys(obj).forEach(key => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof obj[key] === 'object') {
          extractKeys(obj[key], fullKey);
        } else {
          const keyId = `${file}:${fullKey}`;
          
          if (allKeys.has(obj[key])) {
            testResults.warnings.push({
              test: 'Duplicate Values',
              issue: `Same translation value in ${allKeys.get(obj[key])} and ${keyId}`
            });
          } else {
            allKeys.set(obj[key], keyId);
          }
        }
      });
    };
    
    extractKeys(content);
  });
  
  console.log(`  ✓ Checked ${allKeys.size} unique translation values`);
}

// Main execution
async function runAllTests() {
  console.log('\nStarting comprehensive translation tests...\n');
  console.log('NOTE: Being EXTREMELY CRITICAL - Testing everything, trusting nothing!');
  
  testTranslationHooks();
  testTranslationFiles();
  testReactHooks();
  testRuntimeTranslation();
  testDuplicateKeys();
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    author: 'Vikram - QA Engineer',
    summary: {
      totalTests: 5,
      passed: testResults.passed.length,
      failed: testResults.failed.length,
      warnings: testResults.warnings.length,
      critical: testResults.critical.length
    },
    results: testResults
  };
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'vikram-day2-test-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('CRITICAL TEST SUMMARY:');
  console.log('='.repeat(80));
  console.log(`✅ PASSED: ${testResults.passed.length} tests`);
  console.log(`❌ FAILED: ${testResults.failed.length} tests`);
  console.log(`⚠️  WARNINGS: ${testResults.warnings.length} issues`);
  console.log(`🚨 CRITICAL: ${testResults.critical.length} issues`);
  
  if (testResults.critical.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES FOUND:');
    testResults.critical.forEach(issue => {
      console.log(`  - ${issue.test}: ${issue.issue || issue.file}`);
    });
  }
  
  if (testResults.failed.length > 0) {
    console.log('\n❌ FAILED TESTS:');
    testResults.failed.slice(0, 5).forEach(fail => {
      console.log(`  - ${fail.test}: ${fail.file} - ${fail.reason}`);
    });
  }
  
  console.log('\nFull report saved to: vikram-day2-test-report.json');
  console.log('='.repeat(80));
  
  // Return status
  return testResults.critical.length === 0 && testResults.failed.length === 0;
}

// Run tests
runAllTests().then(success => {
  process.exit(success ? 0 : 1);
});