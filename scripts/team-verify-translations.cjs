#!/usr/bin/env node

/**
 * Team Collaborative Script - Verify Translation Implementation
 * Author: Rahul (Senior Tester)
 * Purpose: Test and verify translation coverage
 */

const fs = require('fs');
const path = require('path');

console.log('===========================================');
console.log('TRANSLATION VERIFICATION TEST - Rahul');
console.log('===========================================\n');

// Test results
const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Check if translation files exist and are valid
console.log('Test 1: Checking translation file integrity...');
const languages = ['en', 'hi', 'ml', 'bn', 'gu', 'kn', 'mr', 'or', 'as'];
const namespaces = ['common', 'forms', 'agent', 'franchise', 'home'];

languages.forEach(lang => {
  namespaces.forEach(ns => {
    const filePath = path.join(__dirname, '..', 'public', 'locales', lang, `${ns}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        if (Object.keys(content).length > 0) {
          testResults.passed.push(`✓ ${lang}/${ns}.json is valid`);
        } else {
          testResults.warnings.push(`⚠ ${lang}/${ns}.json is empty`);
        }
      } catch (e) {
        testResults.failed.push(`✗ ${lang}/${ns}.json is invalid JSON`);
      }
    } else {
      if (ns === 'common' || ns === 'forms') {
        testResults.failed.push(`✗ Critical file missing: ${lang}/${ns}.json`);
      } else {
        testResults.warnings.push(`⚠ Optional file missing: ${lang}/${ns}.json`);
      }
    }
  });
});

// Check for common required keys
console.log('\nTest 2: Checking required translation keys...');
const requiredKeys = {
  common: ['buttons.submit', 'buttons.cancel', 'status.loading', 'status.error'],
  forms: ['validation.required', 'validation.email_invalid', 'placeholders.email']
};

Object.entries(requiredKeys).forEach(([namespace, keys]) => {
  const enPath = path.join(__dirname, '..', 'public', 'locales', 'en', `${namespace}.json`);
  if (fs.existsSync(enPath)) {
    const content = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    
    keys.forEach(key => {
      const keyParts = key.split('.');
      let value = content;
      let found = true;
      
      for (const part of keyParts) {
        if (value && value[part]) {
          value = value[part];
        } else {
          found = false;
          break;
        }
      }
      
      if (found) {
        testResults.passed.push(`✓ Required key found: ${namespace}.${key}`);
      } else {
        testResults.failed.push(`✗ Required key missing: ${namespace}.${key}`);
      }
    });
  }
});

// Check component files for hardcoded strings
console.log('\nTest 3: Scanning for remaining hardcoded strings...');
const componentsToCheck = [
  'JoinUs.tsx',
  'AgentFormEnhanced.tsx',
  'AgentFormSinglePage.tsx'
];

componentsToCheck.forEach(component => {
  const filePath = path.join(__dirname, '..', 'src', 'components', component);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check for useTranslation hook
    if (content.includes('useTranslation')) {
      testResults.passed.push(`✓ ${component} uses translation hook`);
    } else {
      testResults.failed.push(`✗ ${component} missing translation hook`);
    }
    
    // Check for common hardcoded patterns
    const hardcodedPatterns = [
      />Submit</,
      />Loading</,
      />Error</,
      /placeholder="[^{]/,
      /label="[^{]/
    ];
    
    let hardcodedFound = 0;
    hardcodedPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        hardcodedFound += matches.length;
      }
    });
    
    if (hardcodedFound === 0) {
      testResults.passed.push(`✓ ${component} appears fully translated`);
    } else {
      testResults.warnings.push(`⚠ ${component} may have ${hardcodedFound} hardcoded strings`);
    }
  }
});

// Generate test report
console.log('\n===========================================');
console.log('TEST RESULTS SUMMARY');
console.log('===========================================\n');

console.log(`PASSED: ${testResults.passed.length} tests`);
testResults.passed.slice(0, 5).forEach(test => console.log(`  ${test}`));
if (testResults.passed.length > 5) {
  console.log(`  ... and ${testResults.passed.length - 5} more`);
}

console.log(`\nWARNINGS: ${testResults.warnings.length} issues`);
testResults.warnings.slice(0, 5).forEach(warning => console.log(`  ${warning}`));
if (testResults.warnings.length > 5) {
  console.log(`  ... and ${testResults.warnings.length - 5} more`);
}

console.log(`\nFAILED: ${testResults.failed.length} tests`);
testResults.failed.forEach(test => console.log(`  ${test}`));

// Calculate coverage
const totalTests = testResults.passed.length + testResults.failed.length;
const passRate = Math.round((testResults.passed.length / totalTests) * 100);

console.log('\n===========================================');
console.log('COVERAGE METRICS');
console.log('===========================================');
console.log(`Translation Coverage: ${passRate}%`);
console.log(`Languages Supported: ${languages.length}`);
console.log(`Namespaces Created: ${namespaces.length}`);
console.log(`Components Checked: ${componentsToCheck.length}`);

// Save test report
const reportPath = path.join(__dirname, '..', 'team-test-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  tester: 'Rahul - Senior Tester',
  results: testResults,
  metrics: {
    passRate,
    languages: languages.length,
    namespaces: namespaces.length,
    componentsChecked: componentsToCheck.length
  }
}, null, 2));

console.log('\nTest report saved to: team-test-report.json');

if (testResults.failed.length > 0) {
  console.log('\n⚠ ACTION REQUIRED: Fix failed tests before proceeding!');
} else {
  console.log('\n✓ All critical tests passed! Ready to continue implementation.');
}