const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING DUPLICATE t DEFINITIONS\n');
console.log('=' . repeat(80));

function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      findFiles(filePath, fileList);
    } else if ((file.endsWith('.tsx') || file.endsWith('.jsx')) && !file.includes('.test.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixDuplicateT(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixed = false;
  
  // Pattern 1: Two separate useTranslation calls with t
  const pattern1 = /const\s+\{\s*t\s*\}\s*=\s*useTranslation\((['"`]\w*['"`])?\);\s*\n\s*const\s+\{\s*t([^}]*)\}\s*=\s*useTranslation\((['"`]\w*['"`])?\);/g;
  
  if (pattern1.test(content)) {
    content = content.replace(pattern1, (match, ns1, rest, ns2) => {
      // If rest contains i18n, keep it
      if (rest && rest.includes('i18n')) {
        const namespace = ns1 || ns2 || '';
        return `const { t${rest}} = useTranslation(${namespace});`;
      } else {
        const namespace = ns1 || ns2 || '';
        return `const { t } = useTranslation(${namespace});`;
      }
    });
    fixed = true;
  }
  
  // Pattern 2: Import useTranslation twice
  const importPattern = /import\s+\{\s*useTranslation\s*\}\s*from\s+['"]react-i18next['"];\s*\n\s*import\s+\{\s*useTranslation\s*\}\s*from\s+['"]react-i18next['"];/g;
  if (importPattern.test(content)) {
    content = content.replace(importPattern, "import { useTranslation } from 'react-i18next';");
    fixed = true;
  }
  
  // Pattern 3: Check if there are still multiple t definitions (more complex cases)
  const lines = content.split('\n');
  const tDefinitions = [];
  
  lines.forEach((line, index) => {
    if (line.includes('const { t') && line.includes('useTranslation')) {
      tDefinitions.push({ line, index });
    }
  });
  
  if (tDefinitions.length > 1) {
    // Keep only the first one that has the most complete definition
    let bestIndex = 0;
    let bestHasI18n = false;
    
    tDefinitions.forEach((def, idx) => {
      if (def.line.includes('i18n')) {
        bestIndex = idx;
        bestHasI18n = true;
      }
    });
    
    // Remove all but the best one
    for (let i = tDefinitions.length - 1; i >= 0; i--) {
      if (i !== bestIndex) {
        lines.splice(tDefinitions[i].index, 1);
        fixed = true;
      }
    }
    
    if (fixed) {
      content = lines.join('\n');
    }
  }
  
  if (fixed) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Find all source files
const srcDir = path.join(process.cwd(), 'src');
const allFiles = findFiles(srcDir);

let fixedCount = 0;
const fixedFiles = [];

allFiles.forEach(file => {
  if (fixDuplicateT(file)) {
    fixedCount++;
    fixedFiles.push(path.relative(process.cwd(), file));
    console.log(`✅ Fixed: ${path.basename(file)}`);
  }
});

console.log('\n' + '=' . repeat(80));
console.log(`\n✅ COMPLETE!\n`);
console.log(`Fixed ${fixedCount} files with duplicate t definitions`);

if (fixedFiles.length > 0) {
  console.log('\nFixed files:');
  fixedFiles.forEach(file => console.log(`  - ${file}`));
}