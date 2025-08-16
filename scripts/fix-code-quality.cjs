#!/usr/bin/env node

/**
 * Automated Code Quality Fixes
 * Fixes common issues identified in the audit
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Configuration
const SRC_DIR = path.join(__dirname, '..', 'src');
const FILE_PATTERNS = ['**/*.ts', '**/*.tsx'];

let totalFixes = {
  consoleLogs: 0,
  anyTypes: 0,
  magicNumbers: 0,
  totalFiles: 0
};

// Fix 1: Remove or wrap console.logs
function fixConsoleLogs(content, filePath) {
  let fixed = content;
  let count = 0;

  // Pattern to match console statements
  const consolePattern = /console\.(log|error|warn|info|debug)\((.*?)\);?/g;
  
  // Wrap in development check
  fixed = fixed.replace(consolePattern, (match, method, args) => {
    count++;
    // Skip if already wrapped
    if (content.includes('if (import.meta.env.DEV)') && 
        content.indexOf('if (import.meta.env.DEV)') < content.indexOf(match)) {
      return match;
    }
    
    // For error and warn, keep them but add TODO
    if (method === 'error' || method === 'warn') {
      return `// TODO: Replace with proper error handling\n    ${match}`;
    }
    
    // For log, info, debug - wrap in dev check
    return `if (import.meta.env.DEV) {\n      console.${method}(${args});\n    }`;
  });

  return { content: fixed, fixes: count };
}

// Fix 2: Replace common any types with proper types
function fixAnyTypes(content, filePath) {
  let fixed = content;
  let count = 0;

  // Common patterns and their replacements
  const replacements = [
    {
      pattern: /: any\[\]/g,
      replacement: ': unknown[]',
      description: 'array of any'
    },
    {
      pattern: /: any\)/g,
      replacement: ': unknown)',
      description: 'function parameter'
    },
    {
      pattern: /catch \(error: any\)/g,
      replacement: 'catch (error: unknown)',
      description: 'error catching'
    },
    {
      pattern: /useState<any>/g,
      replacement: 'useState<unknown>',
      description: 'useState hook'
    }
  ];

  replacements.forEach(({ pattern, replacement }) => {
    const matches = fixed.match(pattern);
    if (matches) {
      count += matches.length;
      fixed = fixed.replace(pattern, replacement);
    }
  });

  // Add TODO comments for remaining any types
  fixed = fixed.replace(/: any(?![a-zA-Z])/g, (match) => {
    count++;
    return ': any /* TODO: Define proper type */';
  });

  return { content: fixed, fixes: count };
}

// Fix 3: Extract magic numbers to constants
function fixMagicNumbers(content, filePath) {
  let fixed = content;
  let count = 0;
  const constants = [];

  // Common magic numbers and their constant names
  const magicNumbers = [
    { pattern: /setTimeout\([^,]+,\s*(\d{4,})\)/g, name: 'TIMEOUT_DURATION' },
    { pattern: /\.length\s*===?\s*10(?!\d)/g, name: 'PHONE_NUMBER_LENGTH', value: 10 },
    { pattern: /\.length\s*===?\s*6(?!\d)/g, name: 'OTP_LENGTH', value: 6 },
    { pattern: /\.length\s*===?\s*12(?!\d)/g, name: 'AADHAAR_LENGTH', value: 12 },
    { pattern: /status\s*===?\s*(200|201|204|400|401|403|404|500)(?!\d)/g, name: 'HTTP_STATUS' }
  ];

  // Check if constants section exists
  const hasConstants = content.includes('// Constants');
  
  magicNumbers.forEach(({ pattern, name, value }) => {
    const matches = fixed.match(pattern);
    if (matches && matches.length > 0) {
      count += matches.length;
      if (value !== undefined && !content.includes(`const ${name}`)) {
        constants.push(`const ${name} = ${value};`);
      }
    }
  });

  // Add constants at the top of the file if found
  if (constants.length > 0 && !hasConstants) {
    const importEnd = fixed.lastIndexOf('import');
    const lineEnd = fixed.indexOf('\n', importEnd);
    if (lineEnd > -1) {
      fixed = fixed.slice(0, lineEnd + 1) + 
              '\n// Constants\n' + constants.join('\n') + '\n' +
              fixed.slice(lineEnd + 1);
    }
  }

  return { content: fixed, fixes: count };
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let totalFileFixes = 0;

    // Apply fixes
    const consoleResult = fixConsoleLogs(content, filePath);
    content = consoleResult.content;
    totalFileFixes += consoleResult.fixes;
    totalFixes.consoleLogs += consoleResult.fixes;

    const anyResult = fixAnyTypes(content, filePath);
    content = anyResult.content;
    totalFileFixes += anyResult.fixes;
    totalFixes.anyTypes += anyResult.fixes;

    const magicResult = fixMagicNumbers(content, filePath);
    content = magicResult.content;
    totalFileFixes += magicResult.fixes;
    totalFixes.magicNumbers += magicResult.fixes;

    // Write back if changes were made
    if (totalFileFixes > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${totalFileFixes} issues in ${path.relative(process.cwd(), filePath)}`);
      totalFixes.totalFiles++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
function main() {
  console.log('🔧 Starting automated code quality fixes...\n');

  FILE_PATTERNS.forEach(pattern => {
    const files = glob.sync(path.join(SRC_DIR, pattern), {
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });

    files.forEach(processFile);
  });

  // Print summary
  console.log('\n📊 Fix Summary:');
  console.log(`   Console Logs Fixed: ${totalFixes.consoleLogs}`);
  console.log(`   Any Types Fixed: ${totalFixes.anyTypes}`);
  console.log(`   Magic Numbers Identified: ${totalFixes.magicNumbers}`);
  console.log(`   Total Files Modified: ${totalFixes.totalFiles}`);
  
  console.log('\n✨ Automated fixes complete!');
  console.log('📝 Note: Please review changes and run tests before committing.');
  
  // Additional recommendations
  if (totalFixes.anyTypes > 0) {
    console.log('\n⚠️  Some "any" types were replaced with "unknown".');
    console.log('   Please define proper interfaces for better type safety.');
  }
}

// Check if glob is installed
try {
  require.resolve('glob');
  main();
} catch (e) {
  console.log('Installing required dependency...');
  require('child_process').execSync('npm install glob', { stdio: 'inherit' });
  console.log('Please run this script again.');
}