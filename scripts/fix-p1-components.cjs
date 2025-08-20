const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}     PHASE P1: HIGH-TRAFFIC PAGES FIX${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.yellow}⚠️  WARNING: Only run after P0 is confirmed working!${colors.reset}\n`);

// Track changes for rollback
const changedFiles = [];

// P1 Component fixes
const p1Fixes = [
  {
    file: 'src/components/Hero.tsx',
    description: 'Main Hero component',
    oldPattern: /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    newPattern: "const { t } = useTranslation('home')",
    namespace: 'home'
  },
  {
    file: 'src/components/SubmitLocationHero.tsx',
    description: 'Submit Location Hero',
    oldPattern: /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    newPattern: "const { t } = useTranslation('forms')",
    namespace: 'forms'
  },
  {
    file: 'src/components/SubmitLocationSinglePage.tsx',
    description: 'Submit Location Form',
    oldPattern: /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    newPattern: "const { t } = useTranslation('forms')",
    namespace: 'forms'
  },
  {
    file: 'src/components/SubmitLocationProgressive.tsx',
    description: 'Submit Location Progressive',
    oldPattern: /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    newPattern: "const { t } = useTranslation('forms')",
    namespace: 'forms'
  },
  {
    file: 'src/pages/Home.tsx',
    description: 'Home Page',
    oldPattern: /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    newPattern: "const { t } = useTranslation('home')",
    namespace: 'home'
  },
  {
    file: 'src/pages/SubmitLocation.tsx',
    description: 'Submit Location Page',
    oldPattern: /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    newPattern: "const { t } = useTranslation('forms')",
    namespace: 'forms'
  }
];

console.log(`${colors.blue}Components to fix: ${p1Fixes.length}${colors.reset}\n`);

// Function to fix a component
function fixComponent(fix) {
  const filePath = path.join(__dirname, '..', fix.file);
  
  console.log(`${colors.blue}Processing: ${fix.description}${colors.reset}`);
  console.log(`  File: ${fix.file}`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ${colors.yellow}⚠️  File not found, skipping${colors.reset}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has namespace
  if (content.includes(`useTranslation('${fix.namespace}')`)) {
    console.log(`  ${colors.green}✓ Already using '${fix.namespace}' namespace${colors.reset}`);
    return false;
  }
  
  // Check if uses default namespace
  if (!content.includes('useTranslation()')) {
    console.log(`  ${colors.yellow}⚠️  Not using default namespace, checking...${colors.reset}`);
    
    // Check what it's using
    const match = content.match(/useTranslation\(['"]([^'"]+)['"]\)/);
    if (match) {
      console.log(`  ${colors.blue}ℹ️  Currently using '${match[1]}' namespace${colors.reset}`);
    }
    return false;
  }
  
  // Apply fix
  const newContent = content.replace(fix.oldPattern, fix.newPattern);
  
  if (newContent !== content) {
    // Backup original
    const backupPath = filePath + '.p1backup';
    fs.writeFileSync(backupPath, content);
    
    // Write fixed content
    fs.writeFileSync(filePath, newContent);
    changedFiles.push({
      path: filePath,
      backup: backupPath
    });
    
    console.log(`  ${colors.green}✅ Fixed: Now using '${fix.namespace}' namespace${colors.reset}`);
    return true;
  }
  
  return false;
}

// Execute fixes
console.log(`${colors.cyan}Starting P1 fixes...${colors.reset}\n`);

let fixedCount = 0;
let skippedCount = 0;

p1Fixes.forEach(fix => {
  if (fixComponent(fix)) {
    fixedCount++;
  } else {
    skippedCount++;
  }
  console.log(''); // Empty line between components
});

// Create rollback script
if (changedFiles.length > 0) {
  const rollbackScript = `#!/bin/bash
# P1 Rollback Script
# Run this if P1 causes issues

echo "Rolling back P1 changes..."
${changedFiles.map(f => `cp "${f.backup}" "${f.path}"`).join('\n')}
echo "Rollback complete. Restart dev server."
`;
  
  const rollbackPath = path.join(__dirname, 'rollback-p1.sh');
  fs.writeFileSync(rollbackPath, rollbackScript);
  
  // Windows version
  const rollbackBat = changedFiles.map(f => `copy "${f.backup}" "${f.path}"`).join('\r\n');
  fs.writeFileSync(path.join(__dirname, 'rollback-p1.bat'), rollbackBat);
}

// Summary
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                    P1 SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Fixed: ${fixedCount} components${colors.reset}`);
console.log(`${colors.blue}⏭️  Skipped: ${skippedCount} components${colors.reset}`);

if (changedFiles.length > 0) {
  console.log(`\n${colors.yellow}📁 Backup files created${colors.reset}`);
  console.log(`${colors.yellow}📜 Rollback scripts: rollback-p1.sh / rollback-p1.bat${colors.reset}`);
}

console.log(`\n${colors.cyan}TESTING REQUIRED:${colors.reset}`);
console.log(`1. ${colors.blue}Home page (/)${colors.reset}`);
console.log(`   - Hero section`);
console.log(`   - Value props`);
console.log(`   - Why ATM Franchise section`);

console.log(`\n2. ${colors.blue}Submit Location page (/submit-location)${colors.reset}`);
console.log(`   - Hero section`);
console.log(`   - Form labels`);
console.log(`   - Validation messages`);

console.log(`\n${colors.yellow}Test Protocol:${colors.reset}`);
console.log(`1. Clear browser: localStorage.clear()`);
console.log(`2. Reload page`);
console.log(`3. Check console for errors`);
console.log(`4. Test language switching`);

console.log(`\n${colors.green}P1 implementation complete. Please test!${colors.reset}\n`);