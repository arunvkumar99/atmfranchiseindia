#!/usr/bin/env node

/**
 * Arjun's Day 2 Script - Fix Hero and Main Components
 * Target: Hero.tsx, BecomefranchiseHero.tsx, SubmitLocationHero.tsx
 * Author: Arjun - Senior Frontend Developer
 * Date: Day 2 of Translation Fix
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('ARJUN\'S DAY 2 HERO COMPONENTS FIX');
console.log('='.repeat(80));

const componentsToFix = [
  'Hero.tsx',
  'BecomefranchiseHero.tsx', 
  'SubmitLocationHero.tsx',
  'WhyATM.tsx',
  'WhyATMFranchiseIndia.tsx',
  'GetStarted.tsx'
];

const fixedStrings = [];
const errors = [];

function extractHardcodedStrings(content, filename) {
  const strings = [];
  
  // Pattern 1: Direct strings in JSX
  const jsxTextRegex = />([^<>{}\n]+)</g;
  let match;
  while ((match = jsxTextRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && text.length > 2 && !/^[\d\s\-_]+$/.test(text) && !text.startsWith('{')) {
      strings.push({
        text,
        type: 'jsx-text',
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
  
  // Pattern 2: Strings in props (placeholder, title, alt, etc.)
  const propStringRegex = /(?:placeholder|title|alt|label|value|defaultValue|helperText|errorMessage|successMessage)=["']([^"']+)["']/g;
  while ((match = propStringRegex.exec(content)) !== null) {
    if (match[1] && !match[1].startsWith('{')) {
      strings.push({
        text: match[1],
        type: 'prop-string',
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
  
  // Pattern 3: Heading and paragraph text
  const headingRegex = /<h[1-6][^>]*>([^<]+)<\/h[1-6]>/g;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && !text.includes('{t(')) {
      strings.push({
        text,
        type: 'heading',
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
  
  // Pattern 4: Button text
  const buttonRegex = /<Button[^>]*>([^<]+)<\/Button>/g;
  while ((match = buttonRegex.exec(content)) !== null) {
    const text = match[1].trim();
    if (text && !text.includes('{t(')) {
      strings.push({
        text,
        type: 'button',
        line: content.substring(0, match.index).split('\n').length
      });
    }
  }
  
  return strings;
}

function generateTranslationKey(text, type) {
  // Create consistent keys based on text content
  const key = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 40);
    
  return `${type}_${key}`;
}

function replaceStringsInComponent(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const filename = path.basename(filePath);
    
    console.log(`\nProcessing: ${filename}`);
    
    const hardcodedStrings = extractHardcodedStrings(content, filename);
    
    if (hardcodedStrings.length === 0) {
      console.log(`  ✓ No hardcoded strings found`);
      return;
    }
    
    console.log(`  Found ${hardcodedStrings.length} hardcoded strings`);
    
    // Check if useTranslation is imported
    if (!content.includes('useTranslation')) {
      // Add import at the top
      const importStatement = "import { useTranslation } from 'react-i18next';";
      content = content.replace(
        /import React[^;]*;/,
        `$&\n${importStatement}`
      );
    }
    
    // Check if t is defined in component
    if (!content.includes('const { t }')) {
      // Add useTranslation hook after component declaration
      const componentRegex = /(export\s+(?:default\s+)?function\s+\w+[^{]*{)/;
      content = content.replace(componentRegex, '$1\n  const { t } = useTranslation(\'home\');');
    }
    
    // Replace each hardcoded string
    let replacementCount = 0;
    hardcodedStrings.forEach(({ text, type, line }) => {
      const key = generateTranslationKey(text, type);
      const translationCall = `{t('${key}')}`;
      
      // Different replacement strategies based on type
      if (type === 'jsx-text') {
        const regex = new RegExp(`>\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g');
        const newContent = content.replace(regex, `>${translationCall}<`);
        if (newContent !== content) {
          content = newContent;
          replacementCount++;
          fixedStrings.push({
            component: filename,
            original: text,
            key: key,
            namespace: 'home'
          });
        }
      } else if (type === 'prop-string') {
        const regex = new RegExp(`(placeholder|title|alt|label|value)=["']${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
        const newContent = content.replace(regex, `$1=${translationCall}`);
        if (newContent !== content) {
          content = newContent;
          replacementCount++;
          fixedStrings.push({
            component: filename,
            original: text,
            key: key,
            namespace: 'home'
          });
        }
      }
    });
    
    if (replacementCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`  ✅ Replaced ${replacementCount} strings`);
    } else {
      console.log(`  ⚠️ Could not replace strings automatically`);
    }
    
  } catch (error) {
    console.error(`  ❌ Error processing ${path.basename(filePath)}: ${error.message}`);
    errors.push({ file: path.basename(filePath), error: error.message });
  }
}

// Main execution
console.log('\nStarting Hero components fix...\n');

const srcDir = path.join(__dirname, '..', 'src', 'components');

componentsToFix.forEach(component => {
  const filePath = path.join(srcDir, component);
  if (fs.existsSync(filePath)) {
    replaceStringsInComponent(filePath);
  } else {
    console.log(`⚠️ Component not found: ${component}`);
  }
});

// Save results
const resultsPath = path.join(__dirname, '..', 'arjun-day2-results.json');
fs.writeFileSync(resultsPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  author: 'Arjun - Senior Frontend Developer',
  fixedStrings: fixedStrings,
  errors: errors,
  totalFixed: fixedStrings.length
}, null, 2));

console.log('\n' + '='.repeat(80));
console.log('SUMMARY:');
console.log(`Total strings fixed: ${fixedStrings.length}`);
console.log(`Components processed: ${componentsToFix.length}`);
console.log(`Errors encountered: ${errors.length}`);
console.log('Results saved to: arjun-day2-results.json');
console.log('='.repeat(80));