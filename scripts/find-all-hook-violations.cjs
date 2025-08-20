const fs = require('fs');
const path = require('path');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

console.log(`${colors.cyan}🔍 Scanning for React Hook Violations...${colors.reset}\n`);

const violations = [];
const srcDir = path.join(__dirname, '..', 'src');

// Patterns that indicate hook violations
const hookPatterns = [
  // Hook inside nested function
  /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?const\s*\{[^}]*\}\s*=\s*use(Translation|State|Effect|Context|Memo|Callback|Ref)/g,
  // Hook inside regular function
  /function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?const\s*\{[^}]*\}\s*=\s*use(Translation|State|Effect|Context|Memo|Callback|Ref)/g,
  // Hook inside if statement
  /if\s*\([^)]+\)\s*\{[\s\S]*?use(Translation|State|Effect|Context|Memo|Callback|Ref)/g,
  // Hook inside loop
  /for\s*\([^)]+\)\s*\{[\s\S]*?use(Translation|State|Effect|Context|Memo|Callback|Ref)/g,
  // Hook inside useEffect callback
  /useEffect\s*\(\s*\(\)\s*=>\s*\{[\s\S]*?use(Translation|State|Effect|Context|Memo|Callback|Ref)/g,
  // useTranslation specifically inside nested scope
  /=>\s*\{[^}]*const\s*\{\s*t\s*\}\s*=\s*useTranslation/g
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  const relPath = path.relative(srcDir, filePath);
  
  // Check for useTranslation hook violations specifically
  const lines = content.split('\n');
  let inComponentFunction = false;
  let functionDepth = 0;
  let componentName = '';
  
  lines.forEach((line, index) => {
    // Detect component function start
    if (line.match(/^(export\s+)?(function|const)\s+([A-Z]\w+)/)) {
      const match = line.match(/([A-Z]\w+)/);
      if (match) {
        componentName = match[1];
        inComponentFunction = true;
        functionDepth = 0;
      }
    }
    
    // Track nested function depth
    if (inComponentFunction) {
      // Check for nested function declaration
      if (line.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*\{/) ||
          line.match(/function\s+\w+\s*\([^)]*\)\s*\{/)) {
        functionDepth++;
      }
      
      // Check for useTranslation in wrong place
      if (functionDepth > 0 && line.includes('useTranslation')) {
        violations.push({
          file: relPath,
          line: index + 1,
          type: 'Hook in nested function',
          code: line.trim(),
          component: componentName
        });
      }
      
      // Check for hook in useEffect
      if (line.match(/useEffect\s*\(/)) {
        // Look ahead for hooks in the effect
        let effectContent = '';
        let braceCount = 0;
        let startCapture = false;
        
        for (let i = index; i < Math.min(index + 20, lines.length); i++) {
          const checkLine = lines[i];
          if (checkLine.includes('useEffect')) startCapture = true;
          if (startCapture) {
            effectContent += checkLine + '\n';
            braceCount += (checkLine.match(/\{/g) || []).length;
            braceCount -= (checkLine.match(/\}/g) || []).length;
            
            if (braceCount === 0 && startCapture) break;
          }
        }
        
        if (effectContent.match(/use(Translation|State|Context|Memo|Callback|Ref)\(/)) {
          violations.push({
            file: relPath,
            line: index + 1,
            type: 'Hook inside useEffect',
            code: line.trim(),
            component: componentName
          });
        }
      }
      
      // Track function end
      if (line.includes('}')) {
        if (functionDepth > 0) {
          functionDepth--;
        } else if (inComponentFunction) {
          inComponentFunction = false;
        }
      }
    }
  });
}

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      scanFile(fullPath);
    }
  });
}

// Start scanning
scanDirectory(srcDir);

// Group violations by file
const violationsByFile = {};
violations.forEach(v => {
  if (!violationsByFile[v.file]) {
    violationsByFile[v.file] = [];
  }
  violationsByFile[v.file].push(v);
});

// Display results
console.log(`${colors.blue}Found ${violations.length} potential hook violations:${colors.reset}\n`);

Object.entries(violationsByFile).forEach(([file, fileViolations]) => {
  console.log(`${colors.yellow}📁 ${file}${colors.reset}`);
  fileViolations.forEach(v => {
    console.log(`  ${colors.red}Line ${v.line}: ${v.type}${colors.reset}`);
    console.log(`    Component: ${v.component}`);
    console.log(`    Code: ${colors.cyan}${v.code.substring(0, 80)}...${colors.reset}`);
  });
  console.log('');
});

// Summary
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                        SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.red}⚠️  Total Violations Found: ${violations.length}${colors.reset}`);
console.log(`${colors.yellow}📁 Files Affected: ${Object.keys(violationsByFile).length}${colors.reset}`);

if (violations.length > 0) {
  console.log(`\n${colors.blue}🔧 How to Fix:${colors.reset}`);
  console.log(`1. Move all hooks to the top level of the component function`);
  console.log(`2. Never call hooks inside callbacks, loops, or conditions`);
  console.log(`3. Hooks must be called in the same order every render`);
  console.log(`4. For useTranslation, call it once at component level and pass 't' as needed`);
}

console.log(`\n${colors.green}✅ Scan complete!${colors.reset}\n`);