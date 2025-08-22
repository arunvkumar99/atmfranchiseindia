const fs = require('fs');
const path = require('path');

// Common hardcoded texts and their replacements
const COMMON_REPLACEMENTS = [
  { pattern: />Submit</g, replacement: ">{t('buttons.submit', 'Submit')}<" },
  { pattern: />Add</g, replacement: ">{t('buttons.add', 'Add')}<" },
  { pattern: />Error</g, replacement: ">{t('error', 'Error')}<" },
  { pattern: />Success</g, replacement: ">{t('success', 'Success')}<" },
  { pattern: />Loading\.\.\.</g, replacement: ">{t('loading', 'Loading...')}<" },
  { pattern: />Save</g, replacement: ">{t('buttons.save', 'Save')}<" },
  { pattern: />Cancel</g, replacement: ">{t('buttons.cancel', 'Cancel')}<" },
  { pattern: />Delete</g, replacement: ">{t('buttons.delete', 'Delete')}<" },
  { pattern: />Edit</g, replacement: ">{t('buttons.edit', 'Edit')}<" },
  { pattern: />Close</g, replacement: ">{t('buttons.close', 'Close')}<" },
  { pattern: />Next</g, replacement: ">{t('buttons.next', 'Next')}<" },
  { pattern: />Previous</g, replacement: ">{t('buttons.previous', 'Previous')}<" },
  { pattern: />Back</g, replacement: ">{t('buttons.back', 'Back')}<" },
  { pattern: />Continue</g, replacement: ">{t('buttons.continue', 'Continue')}<" },
  { pattern: />Please wait/g, replacement: "{t('pleaseWait', 'Please wait')}" },
  { pattern: />Required</g, replacement: ">{t('required', 'Required')}<" },
];

function fixHardcodedInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file already has useTranslation import
  const hasTranslation = content.includes('useTranslation');
  
  COMMON_REPLACEMENTS.forEach(({pattern, replacement}) => {
    if (content.match(pattern)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });
  
  if (modified) {
    // Add useTranslation import if not present
    if (!hasTranslation && content.includes('{t(')) {
      const importPattern = /^import .* from ['"]react['"];?$/m;
      const match = content.match(importPattern);
      if (match) {
        content = content.replace(match[0], match[0] + "\nimport { useTranslation } from 'react-i18next';");
      }
    }
    
    // Add t hook if not present
    if (!content.includes('const { t }') && content.includes('{t(')) {
      const componentPattern = /const \w+ = \([^)]*\) => {/;
      const match = content.match(componentPattern);
      if (match) {
        content = content.replace(match[0], match[0] + "\n  const { t } = useTranslation('common');");
      }
    }
    
    fs.writeFileSync(filePath, content);
    return true;
  }
  
  return false;
}

// Process all component files
function processAllComponents() {
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const pagesDir = path.join(__dirname, '..', 'src', 'pages');
  
  let totalFixed = 0;
  
  function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
        if (fixHardcodedInFile(filePath)) {
          console.log(`✅ Fixed: ${filePath}`);
          totalFixed++;
        }
      }
    });
  }
  
  console.log('🔧 FIXING COMMON HARDCODED TEXTS\n');
  console.log('================================================================================\n');
  
  processDirectory(componentsDir);
  processDirectory(pagesDir);
  
  console.log('\n================================================================================');
  console.log(`📊 SUMMARY: Fixed ${totalFixed} files\n`);
}

processAllComponents();