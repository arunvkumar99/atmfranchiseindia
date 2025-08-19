#!/usr/bin/env node

/**
 * Automatically add translation support to components that need it
 * This script:
 * 1. Adds useTranslation import where missing
 * 2. Adds t function to components
 * 3. Creates a mapping of text to replace
 */

const fs = require('fs').promises;
const path = require('path');

// Priority components to fix first
const PRIORITY_FILES = [
  'src/pages/AgentPage.tsx',
  'src/pages/BecomefranchisePage.tsx',
  'src/pages/StartATMPage.tsx',
  'src/pages/AboutUs.tsx',
  'src/pages/ContactUs.tsx',
  'src/pages/Home.tsx',
  'src/components/Hero.tsx',
  'src/components/Services.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx'
];

// Map component types to translation namespaces
const NAMESPACE_MAP = {
  'pages/AgentPage': 'agent',
  'pages/BecomefranchisePage': 'franchise',
  'pages/StartATMPage': 'startAtm',
  'pages/AboutUs': 'about',
  'pages/ContactUs': 'contact',
  'pages/Home': 'home',
  'pages/OurProducts': 'products',
  'pages/PrivacyPolicy': 'privacy',
  'pages/TermsConditions': 'terms',
  'pages/RefundPolicy': 'refund',
  'pages/BlogPage': 'blog',
  'components/Hero': 'home',
  'components/Services': 'home',
  'components/Footer': 'common',
  'components/Header': 'common',
  'components/': 'common', // Default for components
  'pages/': 'common' // Default fallback
};

function getNamespace(filePath) {
  const relativePath = filePath.replace(/\\/g, '/');
  
  for (const [pattern, namespace] of Object.entries(NAMESPACE_MAP)) {
    if (relativePath.includes(pattern)) {
      return namespace;
    }
  }
  
  return 'common'; // Default namespace
}

function generateTranslationKey(text) {
  // Convert text to a reasonable key
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('_');
}

async function addTranslationSupport(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    const namespace = getNamespace(filePath);
    let modified = false;
    const replacements = [];
    
    // Check if already uses translation
    const hasUseTranslation = content.includes('useTranslation');
    const hasTranslationImport = content.includes("from 'react-i18next'");
    
    // Add import if missing
    if (!hasTranslationImport) {
      // Find the last import statement
      const lastImportMatch = content.match(/import[^;]+;(?=\s*(?:\/\/|\/\*|\n\n|const|function|export|interface|type|class))/gs);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const insertPos = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPos) + 
                 "\nimport { useTranslation } from 'react-i18next';" + 
                 content.slice(insertPos);
        modified = true;
      }
    }
    
    // Add useTranslation hook if it's a component and doesn't have it
    if (!hasUseTranslation && content.includes('return (')) {
      // Find component function
      const componentMatch = content.match(/(const|function)\s+(\w+)\s*=?\s*\([^)]*\)\s*(?:=>)?\s*{/);
      if (componentMatch) {
        const componentStart = content.indexOf(componentMatch[0]);
        const afterBrace = componentStart + componentMatch[0].length;
        
        // Add useTranslation hook
        content = content.slice(0, afterBrace) + 
                 `\n  const { t } = useTranslation('${namespace}');` + 
                 content.slice(afterBrace);
        modified = true;
      }
    }
    
    // Find and replace common hardcoded texts
    const commonReplacements = [
      // Buttons
      { pattern: />Submit</g, replacement: `>{t('buttons.submit', 'Submit')}<` },
      { pattern: />Cancel</g, replacement: `>{t('buttons.cancel', 'Cancel')}<` },
      { pattern: />Save</g, replacement: `>{t('buttons.save', 'Save')}<` },
      { pattern: />Apply Now</g, replacement: `>{t('buttons.applyNow', 'Apply Now')}<` },
      { pattern: />Learn More</g, replacement: `>{t('buttons.learnMore', 'Learn More')}<` },
      { pattern: />Get Started</g, replacement: `>{t('buttons.getStarted', 'Get Started')}<` },
      { pattern: />Contact Us</g, replacement: `>{t('buttons.contactUs', 'Contact Us')}<` },
      { pattern: />Join Us</g, replacement: `>{t('buttons.joinUs', 'Join Us')}<` },
      
      // Form labels
      { pattern: />Your Name</g, replacement: `>{t('forms.name', 'Your Name')}<` },
      { pattern: />Email Address</g, replacement: `>{t('forms.email', 'Email Address')}<` },
      { pattern: />Phone Number</g, replacement: `>{t('forms.phone', 'Phone Number')}<` },
      { pattern: />Message</g, replacement: `>{t('forms.message', 'Message')}<` },
      
      // Placeholders
      { pattern: /placeholder="Enter your ([^"]+)"/g, replacement: `placeholder={t('forms.placeholders.enter_$1', 'Enter your $1')}` },
      { pattern: /placeholder="([^"]+)"/g, replacement: (match, p1) => {
        const key = generateTranslationKey(p1);
        return `placeholder={t('placeholders.${key}', '${p1}')}`;
      }},
      
      // Titles
      { pattern: /title="([^"]+)"/g, replacement: (match, p1) => {
        const key = generateTranslationKey(p1);
        return `title={t('titles.${key}', '${p1}')}`;
      }},
      
      // Alt text
      { pattern: /alt="([^"]+)"/g, replacement: (match, p1) => {
        const key = generateTranslationKey(p1);
        return `alt={t('alt.${key}', '${p1}')}`;
      }}
    ];
    
    // Apply replacements
    for (const { pattern, replacement } of commonReplacements) {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        modified = true;
        replacements.push({ pattern: pattern.toString(), replacement: typeof replacement === 'string' ? replacement : 'function' });
      }
    }
    
    return {
      filePath,
      modified,
      namespace,
      replacements: replacements.length
    };
    
  } catch (error) {
    return {
      filePath,
      error: error.message
    };
  }
}

async function applyFixes(filePath, content) {
  try {
    await fs.writeFile(filePath, content);
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🔧 AUTOMATED TRANSLATION IMPLEMENTATION\n');
  console.log('=' .repeat(80));
  
  // Load the scan report
  const reportPath = path.join(__dirname, '..', 'hardcoded-text-report.json');
  let report;
  try {
    const reportContent = await fs.readFile(reportPath, 'utf8');
    report = JSON.parse(reportContent);
  } catch (error) {
    console.error('Error loading scan report. Please run scan-hardcoded-text.cjs first.');
    return;
  }
  
  // Process priority files first
  console.log('\n📝 Processing priority files...\n');
  
  for (const relPath of PRIORITY_FILES) {
    const filePath = path.join(__dirname, '..', relPath);
    const result = await addTranslationSupport(filePath);
    
    if (result.error) {
      console.log(`❌ ${relPath}: ${result.error}`);
    } else if (result.modified) {
      console.log(`✅ ${relPath}: Added translation support (namespace: ${result.namespace}, replacements: ${result.replacements})`);
    } else {
      console.log(`⏭️  ${relPath}: Already has translation support`);
    }
  }
  
  // Get files that need fixes
  const filesToFix = report.filesToFix
    .filter(f => f.hardcoded > 5) // Focus on files with significant hardcoded text
    .map(f => path.join(__dirname, '..', f.file));
  
  console.log(`\n📋 Processing ${filesToFix.length} files with hardcoded text...\n`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const filePath of filesToFix) {
    const result = await addTranslationSupport(filePath);
    const relPath = path.relative(path.join(__dirname, '..'), filePath);
    
    if (result.error) {
      console.log(`❌ ${relPath}: ${result.error}`);
      errorCount++;
    } else if (result.modified) {
      console.log(`✅ ${relPath}: Modified (namespace: ${result.namespace})`);
      successCount++;
    } else {
      console.log(`⏭️  ${relPath}: No changes needed`);
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 SUMMARY:\n');
  console.log(`Files processed: ${filesToFix.length}`);
  console.log(`Files modified: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  console.log('\n⚠️ IMPORTANT NEXT STEPS:\n');
  console.log('1. Review the changes made to ensure they are correct');
  console.log('2. Run npm run dev to check for any compilation errors');
  console.log('3. Update translation JSON files with the new keys');
  console.log('4. Test language switching to verify translations work');
  
  console.log('\n✅ Automation complete!');
}

main().catch(console.error);