#!/usr/bin/env node

/**
 * Rahul's Day 2 Script - Translation Validation System
 * Purpose: Implement comprehensive validation for all translations
 * Author: Rahul - Backend Integration Specialist
 * Date: Day 2 of Translation Fix
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('='.repeat(80));
console.log('RAHUL\'S TRANSLATION VALIDATION SYSTEM');
console.log('='.repeat(80));

const validationResults = {
  valid: [],
  invalid: [],
  missing: [],
  performance: {},
  integration: []
};

// Validate translation file structure and content
function validateTranslationStructure() {
  console.log('\n[VALIDATION 1] Translation Structure...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const baseLanguage = 'en';
  const languages = fs.readdirSync(localesDir);
  
  // Load base structure
  const baseDir = path.join(localesDir, baseLanguage);
  const baseFiles = fs.readdirSync(baseDir).filter(f => f.endsWith('.json'));
  const baseStructure = {};
  
  baseFiles.forEach(file => {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(baseDir, file), 'utf8'));
      baseStructure[file] = extractKeys(content);
    } catch (error) {
      validationResults.invalid.push({
        file: `${baseLanguage}/${file}`,
        error: error.message
      });
    }
  });
  
  // Compare other languages
  languages.forEach(lang => {
    if (lang === baseLanguage) return;
    
    const langDir = path.join(localesDir, lang);
    
    baseFiles.forEach(file => {
      const langFile = path.join(langDir, file);
      
      if (!fs.existsSync(langFile)) {
        validationResults.missing.push({
          language: lang,
          file: file
        });
      } else {
        try {
          const content = JSON.parse(fs.readFileSync(langFile, 'utf8'));
          const langKeys = extractKeys(content);
          
          // Compare keys
          const baseKeys = baseStructure[file] || [];
          const missingKeys = baseKeys.filter(key => !langKeys.includes(key));
          const extraKeys = langKeys.filter(key => !baseKeys.includes(key));
          
          if (missingKeys.length > 0 || extraKeys.length > 0) {
            validationResults.invalid.push({
              file: `${lang}/${file}`,
              missingKeys: missingKeys.length,
              extraKeys: extraKeys.length,
              details: {
                missing: missingKeys.slice(0, 5),
                extra: extraKeys.slice(0, 5)
              }
            });
          } else {
            validationResults.valid.push({
              file: `${lang}/${file}`,
              keysMatched: baseKeys.length
            });
          }
          
        } catch (error) {
          validationResults.invalid.push({
            file: `${lang}/${file}`,
            error: error.message
          });
        }
      }
    });
  });
  
  console.log(`  ✓ Validated ${languages.length} languages`);
}

// Extract all keys from nested object
function extractKeys(obj, prefix = '') {
  let keys = [];
  
  Object.entries(obj).forEach(([key, value]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null) {
      keys = keys.concat(extractKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  });
  
  return keys;
}

// Validate translation interpolations
function validateInterpolations() {
  console.log('\n[VALIDATION 2] Translation Interpolations...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir);
  const interpolationIssues = [];
  
  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
        
        const checkInterpolations = (obj, prefix = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string') {
              // Check for interpolation patterns
              const interpolations = value.match(/{{[^}]+}}/g) || [];
              
              // Compare with English version
              if (lang !== 'en') {
                try {
                  const enFile = path.join(localesDir, 'en', file);
                  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
                  const enValue = getNestedValue(enContent, `${prefix}${key}`);
                  
                  if (enValue) {
                    const enInterpolations = enValue.match(/{{[^}]+}}/g) || [];
                    
                    if (enInterpolations.length !== interpolations.length) {
                      interpolationIssues.push({
                        file: `${lang}/${file}`,
                        key: `${prefix}${key}`,
                        expected: enInterpolations.length,
                        found: interpolations.length
                      });
                    }
                  }
                } catch (error) {
                  // Ignore
                }
              }
            } else if (typeof value === 'object') {
              checkInterpolations(value, `${prefix}${key}.`);
            }
          });
        };
        
        checkInterpolations(content);
      } catch (error) {
        // Ignore
      }
    });
  });
  
  if (interpolationIssues.length > 0) {
    validationResults.invalid.push({
      type: 'interpolation',
      issues: interpolationIssues
    });
  }
  
  console.log(`  ✓ Checked interpolations in ${languages.length} languages`);
}

// Get nested value from object using dot notation
function getNestedValue(obj, path) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj);
}

// Validate component integration
function validateComponentIntegration() {
  console.log('\n[VALIDATION 3] Component Integration...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');
  
  const validateDirectory = (dir, type) => {
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      const issues = [];
      
      // Check for translation import
      const hasI18nImport = content.includes('react-i18next');
      const hasUseTranslation = content.includes('useTranslation');
      const hasTranslate = content.includes('{ t }');
      
      // Check for hardcoded strings
      const hardcodedPatterns = [
        />Submit</,
        />Cancel</,
        />Save</,
        />Delete</,
        />Edit</,
        />Next</,
        />Previous</,
        />Loading/,
        />Error/,
        />Success/
      ];
      
      const hasHardcodedStrings = hardcodedPatterns.some(pattern => 
        content.match(pattern)
      );
      
      if (hasHardcodedStrings && !hasUseTranslation) {
        issues.push('Has hardcoded UI strings but no translation');
      }
      
      if (hasUseTranslation && !hasTranslate) {
        issues.push('Imports useTranslation but doesn\'t use t()');
      }
      
      if (hasI18nImport && !hasUseTranslation) {
        issues.push('Imports i18next but doesn\'t use translations');
      }
      
      // Check namespace usage
      const namespaceMatch = content.match(/useTranslation\(['"]([^'"]+)['"]\)/);
      if (namespaceMatch) {
        const namespace = namespaceMatch[1];
        
        // Verify namespace exists
        const nsFile = path.join(__dirname, '..', 'public', 'locales', 'en', `${namespace}.json`);
        if (!fs.existsSync(nsFile)) {
          issues.push(`Uses non-existent namespace: ${namespace}`);
        }
      }
      
      if (issues.length > 0) {
        validationResults.integration.push({
          type: type,
          file: file,
          issues: issues
        });
      } else if (hasUseTranslation) {
        validationResults.valid.push({
          type: 'integration',
          file: `${type}/${file}`
        });
      }
    });
  };
  
  validateDirectory(componentsDir, 'component');
  validateDirectory(pagesDir, 'page');
  
  console.log(`  ✓ Validated component integration`);
}

// Performance validation
function validatePerformance() {
  console.log('\n[VALIDATION 4] Translation Performance...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir);
  
  let totalSize = 0;
  const fileSizes = {};
  
  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
    
    let langSize = 0;
    files.forEach(file => {
      const stats = fs.statSync(path.join(langDir, file));
      langSize += stats.size;
      
      if (!fileSizes[file]) {
        fileSizes[file] = {};
      }
      fileSizes[file][lang] = stats.size;
    });
    
    totalSize += langSize;
    validationResults.performance[lang] = {
      totalSize: langSize,
      files: files.length
    };
  });
  
  // Check for oversized files
  Object.entries(fileSizes).forEach(([file, sizes]) => {
    const maxSize = Math.max(...Object.values(sizes));
    if (maxSize > 100000) { // 100KB
      validationResults.invalid.push({
        type: 'performance',
        file: file,
        issue: `File too large: ${(maxSize / 1024).toFixed(2)}KB`,
        recommendation: 'Consider splitting into smaller namespaces'
      });
    }
  });
  
  validationResults.performance.total = {
    size: totalSize,
    sizeInMB: (totalSize / 1024 / 1024).toFixed(2)
  };
  
  console.log(`  ✓ Total translation size: ${validationResults.performance.total.sizeInMB}MB`);
}

// Build validation
function validateBuild() {
  console.log('\n[VALIDATION 5] Build Validation...');
  
  try {
    console.log('  Running build test...');
    execSync('npm run build', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe'
    });
    
    validationResults.valid.push({
      type: 'build',
      status: 'Build successful'
    });
    
    console.log('  ✓ Build completed successfully');
  } catch (error) {
    validationResults.invalid.push({
      type: 'build',
      error: 'Build failed',
      details: error.message
    });
    console.log('  ❌ Build failed');
  }
}

// Generate final report
function generateReport() {
  const report = {
    timestamp: new Date().toISOString(),
    author: 'Rahul - Backend Integration Specialist',
    summary: {
      valid: validationResults.valid.length,
      invalid: validationResults.invalid.length,
      missing: validationResults.missing.length,
      integrationIssues: validationResults.integration.length
    },
    results: validationResults,
    status: validationResults.invalid.length === 0 ? 'PASS' : 'FAIL'
  };
  
  const reportPath = path.join(__dirname, '..', 'rahul-day2-validation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log('\n' + '='.repeat(80));
  console.log('VALIDATION SUMMARY:');
  console.log('='.repeat(80));
  console.log(`✅ Valid: ${validationResults.valid.length}`);
  console.log(`❌ Invalid: ${validationResults.invalid.length}`);
  console.log(`⚠️  Missing: ${validationResults.missing.length}`);
  console.log(`🔧 Integration Issues: ${validationResults.integration.length}`);
  
  if (validationResults.invalid.length > 0) {
    console.log('\n❌ CRITICAL ISSUES:');
    validationResults.invalid.slice(0, 5).forEach(issue => {
      if (issue.file) {
        console.log(`  - ${issue.file}: ${issue.error || `Missing ${issue.missingKeys} keys`}`);
      } else {
        console.log(`  - ${issue.type}: ${issue.error || issue.issue}`);
      }
    });
  }
  
  if (validationResults.integration.length > 0) {
    console.log('\n🔧 INTEGRATION ISSUES:');
    validationResults.integration.slice(0, 5).forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.issues.join(', ')}`);
    });
  }
  
  console.log(`\nOverall Status: ${report.status}`);
  console.log('Full report saved to: rahul-day2-validation-report.json');
  console.log('='.repeat(80));
  
  return report.status === 'PASS';
}

// Main execution
async function runValidation() {
  console.log('\nStarting comprehensive translation validation...\n');
  
  validateTranslationStructure();
  validateInterpolations();
  validateComponentIntegration();
  validatePerformance();
  validateBuild();
  
  const success = generateReport();
  
  return success;
}

// Run validation
runValidation().then(success => {
  process.exit(success ? 0 : 1);
});