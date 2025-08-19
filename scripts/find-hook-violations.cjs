const fs = require('fs');
const path = require('path');

// Function to check if a file has potential hook violations
function checkFileForHookViolations(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const violations = [];
  
  // Track if we're inside a function that's not a component
  let currentFunction = null;
  let functionDepth = 0;
  let componentDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Check for hooks being called inside regular functions
    const hookPattern = /\b(use[A-Z]\w*)\s*\(/;
    const functionPattern = /(?:const|let|var|function)\s+(\w+)\s*=\s*(?:\([^)]*\)|function)/;
    const componentPattern = /(?:const|let|var|function|export\s+(?:default\s+)?function)\s+([A-Z]\w*)/;
    const arrowFunctionPattern = /(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>/;
    
    // Check if we're defining a component (starts with capital letter)
    if (componentPattern.test(line)) {
      componentDepth++;
    }
    
    // Check if we're defining a regular function (inside useEffect, event handlers, etc.)
    if (functionPattern.test(line) && !componentPattern.test(line)) {
      const match = line.match(functionPattern);
      if (match) {
        const funcName = match[1];
        // Common function names that shouldn't contain hooks
        const suspiciousFunctions = ['handleScroll', 'handleClick', 'handleSubmit', 'handleChange', 
                                     'onClick', 'onChange', 'onSubmit', 'measurePageLoad', 
                                     'observeWebVitals', 'cleanup', 'fetchData'];
        if (suspiciousFunctions.some(name => funcName.includes(name))) {
          currentFunction = funcName;
          functionDepth++;
        }
      }
    }
    
    // Check for hook calls
    if (hookPattern.test(line)) {
      const hookMatch = line.match(hookPattern);
      if (hookMatch) {
        const hookName = hookMatch[1];
        
        // Check if this hook is inside a non-component function
        if (currentFunction && functionDepth > componentDepth) {
          violations.push({
            file: filePath,
            line: lineNum,
            hook: hookName,
            function: currentFunction,
            code: line.trim()
          });
        }
        
        // Also check for obvious violations (hooks after conditionals or loops)
        const prevLines = lines.slice(Math.max(0, i - 5), i).join('\n');
        if (prevLines.includes('if (') || prevLines.includes('for (') || 
            prevLines.includes('while (') || prevLines.includes('.map(') ||
            prevLines.includes('.forEach(')) {
          // Check if we're not in a component
          if (!componentPattern.test(prevLines)) {
            violations.push({
              file: filePath,
              line: lineNum,
              hook: hookName,
              function: 'possibly inside conditional/loop',
              code: line.trim()
            });
          }
        }
      }
    }
    
    // Track closing braces to know when we exit functions
    if (line.includes('}')) {
      if (functionDepth > 0) functionDepth--;
      if (componentDepth > 0) componentDepth--;
      if (functionDepth === 0) currentFunction = null;
    }
  }
  
  return violations;
}

// Recursively find all TypeScript/JavaScript files
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.includes('.git')) {
      findFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Main execution
console.log('🔍 Searching for React Hook violations...\n');

const srcDir = path.join(__dirname, '..', 'src');
const files = findFiles(srcDir);
let totalViolations = 0;
const allViolations = [];

files.forEach(file => {
  const violations = checkFileForHookViolations(file);
  if (violations.length > 0) {
    allViolations.push(...violations);
    totalViolations += violations.length;
  }
});

// Group violations by file
const violationsByFile = {};
allViolations.forEach(v => {
  const relPath = path.relative(process.cwd(), v.file);
  if (!violationsByFile[relPath]) {
    violationsByFile[relPath] = [];
  }
  violationsByFile[relPath].push(v);
});

// Print results
if (totalViolations > 0) {
  console.log(`❌ Found ${totalViolations} potential hook violations:\n`);
  
  Object.entries(violationsByFile).forEach(([file, violations]) => {
    console.log(`\n📄 ${file}:`);
    violations.forEach(v => {
      console.log(`   Line ${v.line}: ${v.hook} inside "${v.function}"`);
      console.log(`   Code: ${v.code}`);
    });
  });
  
  console.log('\n⚠️  These hooks are being called in invalid contexts!');
  console.log('Hooks can only be called at the top level of React components or custom hooks.\n');
} else {
  console.log('✅ No hook violations found!\n');
}

console.log('📊 Summary:');
console.log(`   Files scanned: ${files.length}`);
console.log(`   Violations found: ${totalViolations}`);
console.log(`   Files with violations: ${Object.keys(violationsByFile).length}`);