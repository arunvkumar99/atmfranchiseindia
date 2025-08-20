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

console.log(`${colors.cyan}🔍 Analyzing BecomefranchisePage Component Dependencies...${colors.reset}\n`);

const components = [
  'BecomefranchiseHero',
  'WhyATM',
  'WLAOperators',
  'Services',
  'FranchiseModelsComparison',
  'FAQ',
  'GetStarted',
  'EnquiryFormProgressive'
];

const issues = [];

components.forEach(componentName => {
  console.log(`${colors.blue}Checking ${componentName}...${colors.reset}`);
  
  const possiblePaths = [
    path.join(__dirname, '..', 'src', 'components', `${componentName}.tsx`),
    path.join(__dirname, '..', 'src', 'components', `${componentName}.jsx`)
  ];
  
  let found = false;
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      found = true;
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for common issues
      const lines = content.split('\n');
      
      // Check for useTranslation usage
      const hasUseTranslation = content.includes('useTranslation');
      const useTranslationMatches = content.match(/const\s*{\s*t[^}]*}\s*=\s*useTranslation\([^)]*\)/g);
      
      if (hasUseTranslation) {
        console.log(`  ✓ Uses useTranslation`);
        
        // Check if it's using namespace or not
        if (useTranslationMatches) {
          useTranslationMatches.forEach(match => {
            const hasNamespace = match.includes("useTranslation('") || match.includes('useTranslation("');
            if (hasNamespace) {
              const namespace = match.match(/useTranslation\(['"]([^'"]+)['"]\)/);
              console.log(`    - With namespace: ${namespace ? namespace[1] : 'unknown'}`);
            } else {
              console.log(`    - Without namespace (using default)`);
            }
          });
        }
      }
      
      // Check for syntax errors
      let braceCount = 0;
      let parenCount = 0;
      lines.forEach((line, index) => {
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;
        parenCount += (line.match(/\(/g) || []).length;
        parenCount -= (line.match(/\)/g) || []).length;
        
        // Check for duplicate imports
        if (line.includes('import') && line.includes('useTranslation')) {
          const lineNum = index + 1;
          // Check if there's another import of useTranslation
          for (let i = index + 1; i < lines.length; i++) {
            if (lines[i].includes('import') && lines[i].includes('useTranslation')) {
              issues.push({
                component: componentName,
                issue: 'Duplicate useTranslation import',
                lines: [lineNum, i + 1]
              });
            }
          }
        }
        
        // Check for hooks in wrong places
        if (line.includes('useTranslation()') || line.includes('useTranslation(')) {
          // Check if it's inside a function that's not a component
          let funcDepth = 0;
          for (let i = index - 1; i >= Math.max(0, index - 10); i--) {
            if (lines[i].match(/function\s+[a-z]/i) || lines[i].match(/const\s+[a-z]\w*\s*=.*=>/)) {
              issues.push({
                component: componentName,
                issue: 'Possible hook in nested function',
                line: index + 1
              });
              break;
            }
          }
        }
      });
      
      if (braceCount !== 0) {
        issues.push({
          component: componentName,
          issue: `Unbalanced braces (${braceCount > 0 ? '+' : ''}${braceCount})`,
          severity: 'high'
        });
      }
      
      if (parenCount !== 0) {
        issues.push({
          component: componentName,
          issue: `Unbalanced parentheses (${parenCount > 0 ? '+' : ''}${parenCount})`,
          severity: 'high'
        });
      }
      
      break;
    }
  }
  
  if (!found) {
    issues.push({
      component: componentName,
      issue: 'Component file not found',
      severity: 'critical'
    });
    console.log(`  ${colors.red}✗ File not found${colors.reset}`);
  }
});

// Check the main page file
console.log(`\n${colors.blue}Checking BecomefranchisePage itself...${colors.reset}`);
const pageFile = path.join(__dirname, '..', 'src', 'pages', 'BecomefranchisePage.tsx');
if (fs.existsSync(pageFile)) {
  const content = fs.readFileSync(pageFile, 'utf8');
  
  // Check if it's using translation without namespace
  if (content.includes("useTranslation()")) {
    console.log(`  ⚠️ Using useTranslation without namespace`);
    console.log(`    Should use: useTranslation('franchise') or similar`);
  }
  
  // Check for translation keys used
  const tCalls = content.match(/t\(['"][^'"]+['"]\)/g);
  if (tCalls) {
    console.log(`  Translation keys used:`);
    tCalls.forEach(call => {
      const key = call.match(/t\(['"]([^'"]+)['"]\)/)[1];
      console.log(`    - ${key}`);
    });
  }
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                           ANALYSIS SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

if (issues.length === 0) {
  console.log(`${colors.green}✅ No critical issues found${colors.reset}`);
} else {
  console.log(`${colors.red}Found ${issues.length} issues:${colors.reset}\n`);
  
  const critical = issues.filter(i => i.severity === 'critical');
  const high = issues.filter(i => i.severity === 'high');
  const other = issues.filter(i => !i.severity || i.severity === 'medium');
  
  if (critical.length > 0) {
    console.log(`${colors.red}CRITICAL:${colors.reset}`);
    critical.forEach(issue => {
      console.log(`  - ${issue.component}: ${issue.issue}`);
    });
  }
  
  if (high.length > 0) {
    console.log(`\n${colors.yellow}HIGH:${colors.reset}`);
    high.forEach(issue => {
      console.log(`  - ${issue.component}: ${issue.issue}`);
    });
  }
  
  if (other.length > 0) {
    console.log(`\n${colors.blue}OTHER:${colors.reset}`);
    other.forEach(issue => {
      console.log(`  - ${issue.component}: ${issue.issue}`);
      if (issue.lines) console.log(`    Lines: ${issue.lines.join(', ')}`);
      if (issue.line) console.log(`    Line: ${issue.line}`);
    });
  }
}

console.log(`\n${colors.green}Analysis complete.${colors.reset}\n`);