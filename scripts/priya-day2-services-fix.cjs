#!/usr/bin/env node

/**
 * Priya's Day 2 Script - Fix Services and Features Components
 * Target: Services.tsx, FAQ.tsx, Testimonials.tsx, TrustSignals.tsx
 * Author: Priya - i18n Specialist
 * Date: Day 2 of Translation Fix
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('PRIYA\'S DAY 2 SERVICES & FEATURES FIX');
console.log('='.repeat(80));

const componentsToFix = [
  'Services.tsx',
  'FAQ.tsx',
  'Testimonials.tsx',
  'TrustSignals.tsx',
  'FranchiseModelsComparison.tsx',
  'WLAOperators.tsx'
];

const translationMappings = [];
const updatedFiles = [];

function analyzeComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  const analysis = {
    filename,
    hardcodedStrings: [],
    hasTranslation: content.includes('useTranslation'),
    namespace: 'common' // Default namespace for services
  };
  
  // Find all hardcoded strings
  const patterns = [
    />([A-Z][^<>{}\n]+)</g, // Text starting with capital letter
    /title=["']([^"']+)["']/g,
    /description=["']([^"']+)["']/g,
    /label=["']([^"']+)["']/g,
    /<p[^>]*>([^<]+)<\/p>/g,
    /<span[^>]*>([^<]+)<\/span>/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    const contentCopy = content;
    while ((match = pattern.exec(contentCopy)) !== null) {
      const text = match[1].trim();
      if (text && text.length > 3 && !text.includes('{') && !text.includes('t(')) {
        analysis.hardcodedStrings.push({
          text,
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
  });
  
  return analysis;
}

function createTranslationStructure(strings, namespace) {
  const structure = {
    headings: {},
    descriptions: {},
    labels: {},
    messages: {},
    buttons: {}
  };
  
  strings.forEach(({ text }) => {
    const key = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 50);
    
    // Categorize by content type
    if (text.length < 30 && text.includes(' ')) {
      structure.labels[key] = text;
    } else if (text.length > 100) {
      structure.descriptions[key] = text;
    } else if (text.endsWith('?') || text.endsWith('!')) {
      structure.headings[key] = text;
    } else {
      structure.messages[key] = text;
    }
  });
  
  return structure;
}

function fixComponent(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    const analysis = analyzeComponent(filePath);
    
    console.log(`\nProcessing: ${filename}`);
    console.log(`  Found ${analysis.hardcodedStrings.length} hardcoded strings`);
    
    if (analysis.hardcodedStrings.length === 0) {
      console.log(`  ✓ Already translated or no strings found`);
      return;
    }
    
    // Add translation import if missing
    if (!analysis.hasTranslation) {
      const importLine = "import { useTranslation } from 'react-i18next';";
      const reactImportRegex = /(import React[^;]*;)/;
      content = content.replace(reactImportRegex, `$1\n${importLine}`);
    }
    
    // Add useTranslation hook if missing
    if (!content.includes('const { t }')) {
      const componentStart = /(export\s+(?:default\s+)?function\s+\w+[^{]*{)/;
      if (componentStart.test(content)) {
        content = content.replace(
          componentStart,
          `$1\n  const { t } = useTranslation('${analysis.namespace}');`
        );
      }
    }
    
    // Replace hardcoded strings
    let replacedCount = 0;
    const translations = createTranslationStructure(analysis.hardcodedStrings, analysis.namespace);
    
    Object.entries(translations).forEach(([category, items]) => {
      Object.entries(items).forEach(([key, value]) => {
        const fullKey = `${category}.${key}`;
        const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Try different replacement patterns
        const patterns = [
          { regex: new RegExp(`>\\s*${escapedValue}\\s*<`, 'g'), replacement: `>{t('${fullKey}')}<` },
          { regex: new RegExp(`(title|label|description)=["']${escapedValue}["']`, 'g'), replacement: `$1={t('${fullKey}')}` },
          { regex: new RegExp(`["']${escapedValue}["']`, 'g'), replacement: `t('${fullKey}')` }
        ];
        
        patterns.forEach(({ regex, replacement }) => {
          const newContent = content.replace(regex, replacement);
          if (newContent !== content) {
            content = newContent;
            replacedCount++;
            translationMappings.push({
              component: filename,
              key: fullKey,
              value: value,
              namespace: analysis.namespace
            });
          }
        });
      });
    });
    
    if (replacedCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Fixed ${replacedCount} strings`);
      updatedFiles.push(filename);
    } else {
      console.log(`  ⚠️ Manual intervention needed`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`);
  }
}

// Main execution
console.log('\nStarting Services & Features fix...\n');

const srcDir = path.join(__dirname, '..', 'src', 'components');

componentsToFix.forEach(component => {
  const filePath = path.join(srcDir, component);
  if (fs.existsSync(filePath)) {
    fixComponent(filePath);
  } else {
    console.log(`⚠️ Component not found: ${component}`);
  }
});

// Save results
const resultsPath = path.join(__dirname, '..', 'priya-day2-results.json');
fs.writeFileSync(resultsPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  author: 'Priya - i18n Specialist',
  translationMappings,
  updatedFiles,
  totalMappings: translationMappings.length
}, null, 2));

console.log('\n' + '='.repeat(80));
console.log('SUMMARY:');
console.log(`Total translations created: ${translationMappings.length}`);
console.log(`Files updated: ${updatedFiles.length}`);
console.log('Results saved to: priya-day2-results.json');
console.log('='.repeat(80));