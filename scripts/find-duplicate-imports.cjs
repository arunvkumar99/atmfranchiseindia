const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🔍 Scanning for Duplicate Imports...${colors.reset}\n`);

function findDuplicateImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const imports = {};
  const duplicates = [];
  
  lines.forEach((line, index) => {
    // Match various import patterns
    const importMatch = line.match(/import\s+(?:{[^}]+}|\*\s+as\s+\w+|\w+)\s+from\s+['"]([^'"]+)['"]/);
    if (importMatch) {
      const module = importMatch[1];
      
      // Check for named imports
      const namedMatch = line.match(/import\s+{([^}]+)}/);
      if (namedMatch) {
        const names = namedMatch[1].split(',').map(n => n.trim());
        names.forEach(name => {
          const key = `${name} from ${module}`;
          if (imports[key]) {
            duplicates.push({
              name,
              module,
              line1: imports[key],
              line2: index + 1,
              file: filePath
            });
          } else {
            imports[key] = index + 1;
          }
        });
      }
    }
  });
  
  return duplicates;
}

function scanDirectory(dir) {
  const results = [];
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      results.push(...scanDirectory(fullPath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const duplicates = findDuplicateImports(fullPath);
      if (duplicates.length > 0) {
        results.push(...duplicates);
      }
    }
  });
  
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const duplicates = scanDirectory(srcDir);

if (duplicates.length > 0) {
  console.log(`${colors.red}Found ${duplicates.length} duplicate imports:${colors.reset}\n`);
  
  const byFile = {};
  duplicates.forEach(dup => {
    const relPath = path.relative(path.join(__dirname, '..'), dup.file);
    if (!byFile[relPath]) byFile[relPath] = [];
    byFile[relPath].push(dup);
  });
  
  Object.entries(byFile).forEach(([file, dups]) => {
    console.log(`${colors.yellow}📁 ${file}${colors.reset}`);
    dups.forEach(dup => {
      console.log(`  ${colors.red}Duplicate: ${dup.name} from '${dup.module}'${colors.reset}`);
      console.log(`    Lines: ${dup.line1} and ${dup.line2}`);
    });
  });
} else {
  console.log(`${colors.green}✅ No duplicate imports found!${colors.reset}`);
}

console.log(`\n${colors.cyan}Scan complete.${colors.reset}\n`);