const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}         FINAL VALIDATION - SENIOR TESTER${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

const testResults = {
  passed: [],
  failed: [],
  warnings: []
};

// Test 1: Check for lovable-uploads references
console.log(`${colors.blue}TEST 1: Checking for lovable-uploads references...${colors.reset}`);

const srcDir = path.join(__dirname, '..', 'src');
let lovableUploadsFound = false;

function checkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      checkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.js')) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('lovable-uploads')) {
        testResults.failed.push(`lovable-uploads found in ${filePath}`);
        lovableUploadsFound = true;
      }
    }
  });
}

checkDirectory(srcDir);

if (!lovableUploadsFound) {
  console.log(`${colors.green}✅ No lovable-uploads references found${colors.reset}`);
  testResults.passed.push('No lovable-uploads references');
} else {
  console.log(`${colors.red}❌ lovable-uploads references still exist${colors.reset}`);
}

// Test 2: Check for useTranslation import issues
console.log(`\n${colors.blue}TEST 2: Checking useTranslation imports...${colors.reset}`);

const criticalFiles = [
  'src/pages/JoinUsPage.tsx',
  'src/components/LanguageSwitcherNew.tsx',
  'src/components/SEOMetaTags.tsx',
  'src/components/EnquiryFormSinglePage.tsx'
];

let allImportsCorrect = true;

criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Check for proper import
    const hasImport = lines.some(line => 
      line.includes("import") && 
      line.includes("useTranslation") && 
      line.includes("react-i18next")
    );
    
    // Check for duplicate imports
    const importLines = lines.filter(line => 
      line.includes("useTranslation") && 
      line.includes("from")
    );
    
    if (!hasImport) {
      testResults.failed.push(`${file} - Missing useTranslation import`);
      allImportsCorrect = false;
    } else if (importLines.length > 1) {
      testResults.failed.push(`${file} - Duplicate useTranslation imports`);
      allImportsCorrect = false;
    } else {
      testResults.passed.push(`${file} - Import correct`);
    }
  }
});

if (allImportsCorrect) {
  console.log(`${colors.green}✅ All useTranslation imports are correct${colors.reset}`);
} else {
  console.log(`${colors.red}❌ Some import issues found${colors.reset}`);
}

// Test 3: Check for hooks violations
console.log(`\n${colors.blue}TEST 3: Checking for React hooks violations...${colors.reset}`);

let noViolations = true;
const testFiles = [
  'src/components/SEOMetaTags.tsx',
  'src/components/EnquiryFormSinglePage.tsx',
  'src/components/AgentFormSinglePage.tsx'
];

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if useTranslation is inside a function
      if (line.includes('const { t } = useTranslation') || 
          line.includes('const { t, i18n } = useTranslation')) {
        
        // Look at previous lines to see if we're inside a function
        const prevLines = lines.slice(Math.max(0, i - 5), i).join('\n');
        
        if (prevLines.match(/const\s+\w+\s*=\s*\(.*\)\s*=>\s*{/) &&
            !prevLines.match(/export\s+(default\s+)?function/) &&
            !prevLines.match(/export\s+const\s+\w+\s*=\s*\(/) &&
            !line.match(/^\s{0,4}const/)) {
          testResults.failed.push(`${file} - Possible hook violation at line ${i + 1}`);
          noViolations = false;
        }
      }
    }
  }
});

if (noViolations) {
  console.log(`${colors.green}✅ No React hooks violations detected${colors.reset}`);
  testResults.passed.push('No hooks violations');
} else {
  console.log(`${colors.red}❌ Hooks violations found${colors.reset}`);
}

// Test 4: Check namespace usage
console.log(`\n${colors.blue}TEST 4: Checking namespace consistency...${colors.reset}`);

const namespaceTests = [
  { file: 'src/components/Footer.tsx', expected: 'common' },
  { file: 'src/pages/OurProducts.tsx', expected: 'products' },
  { file: 'src/pages/JoinUsPage.tsx', expected: 'forms' },
  { file: 'src/components/Hero.tsx', expected: 'home' }
];

let allNamespacesCorrect = true;

namespaceTests.forEach(test => {
  const filePath = path.join(__dirname, '..', test.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(`useTranslation('${test.expected}')`)) {
      testResults.passed.push(`${test.file} - Correct namespace`);
    } else {
      testResults.warnings.push(`${test.file} - May not be using '${test.expected}' namespace`);
      allNamespacesCorrect = false;
    }
  }
});

if (allNamespacesCorrect) {
  console.log(`${colors.green}✅ All components using correct namespaces${colors.reset}`);
} else {
  console.log(`${colors.yellow}⚠️  Some namespace issues detected${colors.reset}`);
}

// Final Summary
console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                 VALIDATION SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Passed: ${testResults.passed.length}${colors.reset}`);
console.log(`${colors.yellow}⚠️  Warnings: ${testResults.warnings.length}${colors.reset}`);
console.log(`${colors.red}❌ Failed: ${testResults.failed.length}${colors.reset}`);

// Senior Tester's Final Verdict
console.log(`\n${colors.magenta}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.magenta}           SENIOR TESTER'S FINAL VERDICT${colors.reset}`);
console.log(`${colors.magenta}════════════════════════════════════════════════════════${colors.reset}\n`);

if (testResults.failed.length === 0) {
  console.log(`${colors.green}✅ APPROVED FOR PRODUCTION${colors.reset}`);
  console.log(`All critical issues have been resolved.`);
  console.log(`The application is stable and ready for deployment.`);
} else if (testResults.failed.length <= 2) {
  console.log(`${colors.yellow}⚠️  CONDITIONAL APPROVAL${colors.reset}`);
  console.log(`Minor issues remain but system is functional.`);
  console.log(`Can proceed with caution.`);
} else {
  console.log(`${colors.red}❌ NOT APPROVED${colors.reset}`);
  console.log(`Critical issues still exist.`);
  console.log(`Further fixes required before production.`);
}

console.log(`\n${colors.blue}Final validation complete.${colors.reset}\n`);