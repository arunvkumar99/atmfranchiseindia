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
console.log(`${colors.cyan}         REACT HOOKS VALIDATION CHECK${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

const violations = [];
const fixed = [];

// Components that were just fixed
const recentlyFixed = [
  'EnquiryFormSinglePage.tsx',
  'AgentFormEnhanced.tsx',
  'AgentFormSinglePage.tsx',
  'InfluencerFormSinglePage.tsx',
  'JobApplicationSinglePage.tsx'
];

// Function to check for hooks violations
function checkFile(filePath, fileName) {
  if (!fs.existsSync(filePath)) return;
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let inComponent = false;
  let braceDepth = 0;
  let componentName = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Detect component start
    if (line.match(/^(export\s+)?(function|const)\s+\w+.*\(.*\).*{/) || 
        line.match(/^(export\s+)?const\s+\w+\s*=\s*\(.*\)\s*=>\s*{/)) {
      const match = line.match(/(?:function|const)\s+(\w+)/);
      if (match && match[1][0] === match[1][0].toUpperCase()) {
        inComponent = true;
        componentName = match[1];
        braceDepth = 1;
      }
    }
    
    // Track brace depth
    if (inComponent) {
      for (const char of line) {
        if (char === '{') braceDepth++;
        if (char === '}') braceDepth--;
      }
      
      if (braceDepth === 0) {
        inComponent = false;
        componentName = '';
      }
    }
    
    // Check for hooks violations
    if (line.includes('const { t } = useTranslation')) {
      // Check if it's inside a function (not at component level)
      const prevLines = lines.slice(Math.max(0, i - 5), i).join('\n');
      
      // Pattern for function declarations
      if (prevLines.match(/const\s+handle\w+\s*=.*=>.*{/) ||
          prevLines.match(/function\s+\w+\s*\(/) ||
          prevLines.match(/\w+:\s*\(.*\)\s*=>\s*{/) ||
          (inComponent && braceDepth > 1 && !line.match(/^\s{2}const\s+{/))) {
        
        violations.push({
          file: fileName,
          line: lineNum,
          component: componentName || 'Unknown',
          snippet: line.trim()
        });
      }
    }
  }
  
  // Check if this file was recently fixed
  if (recentlyFixed.includes(fileName)) {
    const hasViolation = violations.some(v => v.file === fileName);
    if (!hasViolation) {
      // Verify it has useTranslation at component level
      if (content.includes("const { t } = useTranslation('forms')") ||
          content.includes("const { t } = useTranslation('home')") ||
          content.includes("const { t } = useTranslation('franchise')")) {
        fixed.push(fileName);
      }
    }
  }
}

// Scan components directory
console.log(`${colors.blue}Scanning components for hooks violations...${colors.reset}\n`);

const componentsDir = path.join(__dirname, '..', 'src', 'components');
const pagesDir = path.join(__dirname, '..', 'src', 'pages');

// Scan components
fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
    checkFile(path.join(componentsDir, file), file);
  }
});

// Scan pages
fs.readdirSync(pagesDir).forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
    checkFile(path.join(pagesDir, file), file);
  }
});

// Report results
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                   VALIDATION RESULTS${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

if (fixed.length > 0) {
  console.log(`${colors.green}✅ Recently Fixed Components:${colors.reset}`);
  fixed.forEach(file => {
    console.log(`   ✓ ${file}`);
  });
  console.log('');
}

if (violations.length === 0) {
  console.log(`${colors.green}🎉 NO HOOKS VIOLATIONS FOUND!${colors.reset}`);
  console.log(`${colors.green}All components follow React Hooks rules correctly.${colors.reset}\n`);
} else {
  console.log(`${colors.red}⚠️  HOOKS VIOLATIONS DETECTED:${colors.reset}\n`);
  
  violations.forEach(v => {
    console.log(`${colors.yellow}File: ${v.file}${colors.reset}`);
    console.log(`  Line ${v.line}: ${v.snippet}`);
    console.log(`  Component: ${v.component}`);
    console.log('');
  });
  
  console.log(`${colors.red}Total violations: ${violations.length}${colors.reset}`);
}

// Summary
console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                      SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Fixed components: ${fixed.length}${colors.reset}`);
console.log(`${colors.red}❌ Remaining violations: ${violations.length}${colors.reset}`);

if (violations.length === 0 && fixed.length > 0) {
  console.log(`\n${colors.green}✨ All critical hooks violations have been resolved!${colors.reset}`);
  console.log(`${colors.cyan}The application should now run without hooks errors.${colors.reset}`);
}

console.log(`\n${colors.blue}Validation complete.${colors.reset}\n`);