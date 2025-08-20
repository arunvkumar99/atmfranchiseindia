#!/usr/bin/env node

/**
 * RAVI'S DAY 5 CRITICAL FIX
 * Fix ALL "t is not defined" errors in UI components
 * This is a MANDATORY fix - no excuses!
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const componentsPath = path.join(projectRoot, 'src', 'components', 'ui');

// Files that need fixing based on grep results
const filesToFix = [
  'animated-hero.tsx',
  'breadcrumb.tsx', 
  'captcha-protection.tsx',
  'carousel.tsx',
  'dialog.tsx',
  'file-upload.tsx',
  'enhanced-file-upload.tsx',
  'pagination.tsx',
  'sheet.tsx',
  'sidebar.tsx'
];

let fixedCount = 0;
let errors = [];

console.log('🔧 RAVI DAY 5: FIXING CRITICAL TRANSLATION ERRORS');
console.log('================================================\n');

filesToFix.forEach(fileName => {
  const filePath = path.join(componentsPath, fileName);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileName}`);
      return;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Check if file uses t() function
    if (content.includes('t(') && !content.includes('const { t } = useTranslation')) {
      // Check if useTranslation is imported
      if (!content.includes("from 'react-i18next'")) {
        // Add import at the top after React import
        if (content.includes("import React")) {
          content = content.replace(
            /import React[^;]*;/,
            "$&\nimport { useTranslation } from 'react-i18next';"
          );
          modified = true;
        } else {
          // Add at the very top
          content = "import { useTranslation } from 'react-i18next';\n" + content;
          modified = true;
        }
      }
      
      // Now we need to add the hook to components that use t()
      // This is complex because we need to identify component functions
      
      // Pattern 1: Arrow function components
      const arrowComponentPattern = /const\s+(\w+)\s*=\s*(?:\([^)]*\)|[^=])*=>\s*(?:\(|{)/g;
      let match;
      while ((match = arrowComponentPattern.exec(content)) !== null) {
        const componentName = match[1];
        const componentStart = match.index;
        
        // Find where to inject the hook
        const afterArrow = content.indexOf('=>', componentStart);
        const openBrace = content.indexOf('{', afterArrow);
        const openParen = content.indexOf('(', afterArrow);
        
        let insertPos = -1;
        if (openBrace > -1 && (openParen === -1 || openBrace < openParen)) {
          // Component with braces: const Comp = () => { ... }
          insertPos = openBrace + 1;
        } else if (openParen > -1) {
          // Component with immediate return: const Comp = () => ( ... )
          // Need to convert to braces
          const closeParenPos = findMatchingParen(content, openParen);
          if (closeParenPos > -1) {
            // Convert () to {} and add return
            const body = content.substring(openParen + 1, closeParenPos);
            const newBody = `{\n  const { t } = useTranslation();\n  return (${body});\n}`;
            content = content.substring(0, openParen) + newBody + content.substring(closeParenPos + 1);
            modified = true;
            continue;
          }
        }
        
        if (insertPos > -1 && !hasHookNearby(content, insertPos)) {
          content = content.substring(0, insertPos) + 
                   '\n  const { t } = useTranslation();\n' + 
                   content.substring(insertPos);
          modified = true;
        }
      }
      
      // Pattern 2: Function components
      const funcComponentPattern = /function\s+(\w+)\s*\([^)]*\)\s*{/g;
      while ((match = funcComponentPattern.exec(content)) !== null) {
        const openBrace = match.index + match[0].length - 1;
        if (!hasHookNearby(content, openBrace)) {
          content = content.substring(0, openBrace + 1) + 
                   '\n  const { t } = useTranslation();\n' + 
                   content.substring(openBrace + 1);
          modified = true;
        }
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${fileName}`);
      fixedCount++;
    } else {
      console.log(`✓  Already OK: ${fileName}`);
    }
    
  } catch (error) {
    console.error(`❌ Error fixing ${fileName}:`, error.message);
    errors.push({ file: fileName, error: error.message });
  }
});

function findMatchingParen(str, startPos) {
  let depth = 1;
  for (let i = startPos + 1; i < str.length; i++) {
    if (str[i] === '(') depth++;
    if (str[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function hasHookNearby(content, position) {
  // Check if useTranslation hook is already nearby (within 200 chars)
  const nearbyContent = content.substring(Math.max(0, position - 100), position + 200);
  return nearbyContent.includes('useTranslation()');
}

console.log('\n================================================');
console.log(`📊 SUMMARY:`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errors.length} files`);

if (errors.length > 0) {
  console.log('\n❌ FILES WITH ERRORS:');
  errors.forEach(e => {
    console.log(`   - ${e.file}: ${e.error}`);
  });
}

console.log('\n✅ Day 5 Critical Fix Complete!');
console.log('Next: Run browser tests to verify no console errors');