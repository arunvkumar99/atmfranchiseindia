#!/usr/bin/env node

/**
 * Sneha's Day 2 Script - UI Consistency Checker
 * Purpose: Ensure UI remains consistent across all languages
 * Author: Sneha - UI/UX Developer
 * Date: Day 2 of Translation Fix
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('SNEHA\'S UI CONSISTENCY VALIDATION');
console.log('='.repeat(80));

const uiIssues = {
  textOverflow: [],
  missingTranslations: [],
  inconsistentLabels: [],
  layoutBreaks: []
};

// Check text length variations across languages
function checkTextLengths() {
  console.log('\n[CHECK 1] Text Length Variations...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir);
  const lengthComparisons = {};
  
  // Get English as baseline
  const enDir = path.join(localesDir, 'en');
  const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  
  enFiles.forEach(file => {
    const enContent = JSON.parse(fs.readFileSync(path.join(enDir, file), 'utf8'));
    
    const compareTranslations = (enObj, prefix = '') => {
      Object.entries(enObj).forEach(([key, value]) => {
        if (typeof value === 'string') {
          const fullKey = `${file}:${prefix}${key}`;
          lengthComparisons[fullKey] = {
            en: value.length,
            variations: {}
          };
          
          // Compare with other languages
          languages.forEach(lang => {
            if (lang === 'en') return;
            
            try {
              const langFile = path.join(localesDir, lang, file);
              if (fs.existsSync(langFile)) {
                const langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'));
                const langValue = prefix.split('.').reduce((obj, k) => obj?.[k], langContent)?.[key];
                
                if (langValue && typeof langValue === 'string') {
                  const lengthRatio = langValue.length / value.length;
                  lengthComparisons[fullKey].variations[lang] = lengthRatio;
                  
                  // Flag if text is significantly longer
                  if (lengthRatio > 1.5) {
                    uiIssues.textOverflow.push({
                      key: fullKey,
                      language: lang,
                      ratio: lengthRatio.toFixed(2),
                      english: value.substring(0, 50),
                      translated: langValue.substring(0, 50)
                    });
                  }
                }
              }
            } catch (error) {
              // Ignore parsing errors
            }
          });
        } else if (typeof value === 'object') {
          compareTranslations(value, `${prefix}${key}.`);
        }
      });
    };
    
    compareTranslations(enContent);
  });
  
  console.log(`  ✓ Analyzed ${Object.keys(lengthComparisons).length} translation keys`);
}

// Check for consistent button and label translations
function checkConsistentLabels() {
  console.log('\n[CHECK 2] Label Consistency...');
  
  const commonTerms = {
    'submit': [],
    'cancel': [],
    'next': [],
    'previous': [],
    'save': [],
    'delete': [],
    'edit': [],
    'confirm': [],
    'close': [],
    'apply': []
  };
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir);
  
  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(langDir, file), 'utf8'));
        
        const findTerms = (obj, prefix = '') => {
          Object.entries(obj).forEach(([key, value]) => {
            if (typeof value === 'string') {
              Object.keys(commonTerms).forEach(term => {
                if (key.toLowerCase().includes(term) || value.toLowerCase().includes(term)) {
                  commonTerms[term].push({
                    language: lang,
                    file: file,
                    key: `${prefix}${key}`,
                    value: value
                  });
                }
              });
            } else if (typeof value === 'object') {
              findTerms(value, `${prefix}${key}.`);
            }
          });
        };
        
        findTerms(content);
      } catch (error) {
        // Ignore errors
      }
    });
  });
  
  // Check for inconsistencies
  Object.entries(commonTerms).forEach(([term, occurrences]) => {
    const byLanguage = {};
    occurrences.forEach(occ => {
      if (!byLanguage[occ.language]) {
        byLanguage[occ.language] = new Set();
      }
      byLanguage[occ.language].add(occ.value);
    });
    
    Object.entries(byLanguage).forEach(([lang, values]) => {
      if (values.size > 1) {
        uiIssues.inconsistentLabels.push({
          term: term,
          language: lang,
          variations: Array.from(values)
        });
      }
    });
  });
  
  console.log(`  ✓ Checked consistency for ${Object.keys(commonTerms).length} common terms`);
}

// Check for RTL language support
function checkRTLSupport() {
  console.log('\n[CHECK 3] RTL Language Support...');
  
  const rtlLanguages = ['ar', 'he', 'ur'];
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
  
  let rtlSupported = 0;
  let rtlMissing = 0;
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    
    // Check for RTL-aware styles
    if (content.includes('dir=') || content.includes('text-align') || content.includes('float')) {
      if (content.includes('rtl') || content.includes('ltr')) {
        rtlSupported++;
      } else {
        rtlMissing++;
        uiIssues.layoutBreaks.push({
          file: file,
          issue: 'No RTL support detected for directional styles'
        });
      }
    }
  });
  
  console.log(`  ✓ RTL Support: ${rtlSupported} components ready, ${rtlMissing} need attention`);
}

// Check form field validations
function checkFormValidations() {
  console.log('\n[CHECK 4] Form Field Validations...');
  
  const formsDir = path.join(__dirname, '..', 'src', 'components');
  const formFiles = fs.readdirSync(formsDir).filter(f => f.includes('Form') && f.endsWith('.tsx'));
  
  formFiles.forEach(file => {
    const content = fs.readFileSync(path.join(formsDir, file), 'utf8');
    
    // Check for validation messages
    const validationPatterns = [
      /required:[\s]*["']([^"']+)["']/g,
      /minLength:[\s]*{[^}]*message:[\s]*["']([^"']+)["']/g,
      /maxLength:[\s]*{[^}]*message:[\s]*["']([^"']+)["']/g,
      /pattern:[\s]*{[^}]*message:[\s]*["']([^"']+)["']/g
    ];
    
    validationPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const message = match[1];
        if (!message.includes('t(')) {
          uiIssues.missingTranslations.push({
            file: file,
            type: 'validation message',
            text: message
          });
        }
      }
    });
  });
  
  console.log(`  ✓ Checked ${formFiles.length} form components`);
}

// Check responsive design with translations
function checkResponsiveDesign() {
  console.log('\n[CHECK 5] Responsive Design Compatibility...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));
  
  files.forEach(file => {
    const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
    
    // Check for fixed widths that might break with longer translations
    const fixedWidthPattern = /width:[\s]*["']?\d+px/g;
    const matches = content.match(fixedWidthPattern) || [];
    
    if (matches.length > 0) {
      uiIssues.layoutBreaks.push({
        file: file,
        issue: `${matches.length} fixed width declarations that may break with longer translations`
      });
    }
    
    // Check for text truncation
    if (content.includes('text-overflow') || content.includes('truncate')) {
      // This is good - component handles overflow
    } else if (content.includes('overflow-hidden') && !content.includes('ellipsis')) {
      uiIssues.layoutBreaks.push({
        file: file,
        issue: 'Hidden overflow without ellipsis - text may be cut off'
      });
    }
  });
  
  console.log(`  ✓ Analyzed responsive design in ${files.length} components`);
}

// Main execution
function runUIConsistencyChecks() {
  console.log('\nStarting UI consistency validation...\n');
  
  checkTextLengths();
  checkConsistentLabels();
  checkRTLSupport();
  checkFormValidations();
  checkResponsiveDesign();
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    author: 'Sneha - UI/UX Developer',
    summary: {
      textOverflowRisks: uiIssues.textOverflow.length,
      missingTranslations: uiIssues.missingTranslations.length,
      inconsistentLabels: uiIssues.inconsistentLabels.length,
      layoutBreaks: uiIssues.layoutBreaks.length
    },
    issues: uiIssues,
    recommendations: []
  };
  
  // Add recommendations
  if (uiIssues.textOverflow.length > 0) {
    report.recommendations.push({
      priority: 'HIGH',
      issue: 'Text Overflow',
      solution: 'Add text-truncate classes or adjust container widths for affected components'
    });
  }
  
  if (uiIssues.inconsistentLabels.length > 0) {
    report.recommendations.push({
      priority: 'MEDIUM',
      issue: 'Inconsistent Labels',
      solution: 'Standardize common action labels across all translation files'
    });
  }
  
  if (uiIssues.layoutBreaks.length > 0) {
    report.recommendations.push({
      priority: 'HIGH',
      issue: 'Layout Breaks',
      solution: 'Replace fixed widths with flexible layouts (flexbox/grid)'
    });
  }
  
  // Save report
  const reportPath = path.join(__dirname, '..', 'sneha-day2-ui-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('UI CONSISTENCY REPORT:');
  console.log('='.repeat(80));
  
  if (uiIssues.textOverflow.length > 0) {
    console.log(`\n⚠️ TEXT OVERFLOW RISKS: ${uiIssues.textOverflow.length}`);
    uiIssues.textOverflow.slice(0, 3).forEach(issue => {
      console.log(`  - ${issue.language}: ${issue.key} (${issue.ratio}x longer)`);
    });
  }
  
  if (uiIssues.inconsistentLabels.length > 0) {
    console.log(`\n⚠️ INCONSISTENT LABELS: ${uiIssues.inconsistentLabels.length}`);
    uiIssues.inconsistentLabels.slice(0, 3).forEach(issue => {
      console.log(`  - ${issue.language}: "${issue.term}" has ${issue.variations.length} variations`);
    });
  }
  
  if (uiIssues.layoutBreaks.length > 0) {
    console.log(`\n⚠️ POTENTIAL LAYOUT BREAKS: ${uiIssues.layoutBreaks.length}`);
    uiIssues.layoutBreaks.slice(0, 3).forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.issue}`);
    });
  }
  
  if (uiIssues.missingTranslations.length > 0) {
    console.log(`\n❌ MISSING TRANSLATIONS: ${uiIssues.missingTranslations.length}`);
    uiIssues.missingTranslations.slice(0, 3).forEach(issue => {
      console.log(`  - ${issue.file}: ${issue.type} - "${issue.text}"`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('RECOMMENDATIONS:');
  report.recommendations.forEach(rec => {
    console.log(`[${rec.priority}] ${rec.issue}: ${rec.solution}`);
  });
  
  console.log('\nFull report saved to: sneha-day2-ui-report.json');
  console.log('='.repeat(80));
}

// Run checks
runUIConsistencyChecks();