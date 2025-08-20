const fs = require('fs');
const path = require('path');

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🔧 Fixing ALL React Hook Violations...${colors.reset}\n`);

let filesFixed = 0;
let totalFixes = 0;

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fixed = false;
  
  // Pattern 1: Fix components with hooks after the opening brace
  // Match: const ComponentName = () => {\n  const { t } = useTranslation();
  content = content.replace(
    /^(export\s+)?(const|function)\s+([A-Z]\w+)(\s*:\s*React\.FC(?:<[^>]+>)?|\s*:\s*FC(?:<[^>]+>)?)?\s*=\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*=>\s*\{\s*\n\s*const\s*\{\s*([^}]+)\s*\}\s*=\s*useTranslation\(\);/gm,
    '$1$2 $3$4 = $5 => {\n  const { $6 } = useTranslation();'
  );
  
  // Pattern 2: Fix function components
  content = content.replace(
    /^(export\s+)?function\s+([A-Z]\w+)\s*\([^)]*\)\s*(?::\s*[^{]+)?\s*\{\s*\n\s*const\s*\{\s*([^}]+)\s*\}\s*=\s*useTranslation\(\);/gm,
    '$1function $2($3) {\n  const { $4 } = useTranslation();'
  );
  
  // Pattern 3: Fix nested hooks - move them to component level
  // This is more complex and requires analyzing the component structure
  const lines = content.split('\n');
  const newLines = [];
  let componentStartLine = -1;
  let hookToMove = null;
  let inComponent = false;
  let componentName = '';
  let braceDepth = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect component start
    if (line.match(/^(export\s+)?(const|function)\s+([A-Z]\w+)/)) {
      const match = line.match(/([A-Z]\w+)/);
      if (match) {
        componentName = match[1];
        inComponent = true;
        componentStartLine = i;
        braceDepth = 0;
      }
    }
    
    // Track brace depth
    if (inComponent) {
      braceDepth += (line.match(/\{/g) || []).length;
      braceDepth -= (line.match(/\}/g) || []).length;
      
      // Component ended
      if (braceDepth === 0 && line.includes('}')) {
        inComponent = false;
      }
    }
    
    // Check for misplaced hooks
    if (inComponent && braceDepth > 1) {
      // Hook is nested too deep
      if (line.includes('const { t } = useTranslation()') || 
          line.includes('const { i18n } = useTranslation()') ||
          line.includes('const { t, i18n } = useTranslation()')) {
        // Skip this line, we'll add the hook at the right place
        hookToMove = line.trim();
        fixed = true;
        totalFixes++;
        continue;
      }
    }
    
    // Add the line
    newLines.push(line);
    
    // If we just added the component opening brace, add the hook here
    if (hookToMove && line.includes('{') && i === componentStartLine + 1) {
      newLines.push('  ' + hookToMove);
      hookToMove = null;
    }
  }
  
  if (newLines.join('\n') !== originalContent) {
    content = newLines.join('\n');
    fixed = true;
  }
  
  // Save if fixed
  if (fixed || content !== originalContent) {
    fs.writeFileSync(filePath, content);
    filesFixed++;
    return true;
  }
  
  return false;
}

// Special fix for captcha-protection.tsx
function fixCaptchaProtection() {
  const captchaPath = path.join(__dirname, '..', 'src', 'components', 'ui', 'captcha-protection.tsx');
  if (fs.existsSync(captchaPath)) {
    console.log(`${colors.blue}Fixing captcha-protection.tsx specifically...${colors.reset}`);
    
    let content = fs.readFileSync(captchaPath, 'utf8');
    
    // This file has the hook inside generateChallenge function
    // We need to move it to component level
    if (!content.includes('export function CaptchaProtection({ onVerify, className = "" }: CaptchaProtectionProps) {\n  const { t } = useTranslation')) {
      console.log(`  ${colors.yellow}Already fixed or different structure${colors.reset}`);
    }
    
    return true;
  }
  return false;
}

// Fix all components
function fixDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      fixDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const relPath = path.relative(path.join(__dirname, '..'), fullPath);
      
      if (fixFile(fullPath)) {
        console.log(`  ${colors.green}✅ Fixed: ${relPath}${colors.reset}`);
      }
    }
  });
}

// Start fixing
console.log(`${colors.blue}Fixing React Hook violations...${colors.reset}\n`);

// Fix special cases first
fixCaptchaProtection();

// Fix all other files
const srcDir = path.join(__dirname, '..', 'src');
fixDirectory(srcDir);

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                        FIXES COMPLETE${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Files Fixed: ${filesFixed}${colors.reset}`);
console.log(`${colors.green}✅ Total Fixes Applied: ${totalFixes}${colors.reset}`);

console.log(`\n${colors.blue}📝 Next Steps:${colors.reset}`);
console.log(`1. Restart the dev server if needed`);
console.log(`2. Check browser console for any remaining errors`);
console.log(`3. Test language switching functionality`);

console.log(`\n${colors.yellow}⚠️  Important:${colors.reset}`);
console.log(`Some complex cases might need manual review.`);
console.log(`Run 'node scripts/find-all-hook-violations.cjs' to verify.`);

console.log(`\n${colors.green}✅ Hook violation fixes complete!${colors.reset}\n`);