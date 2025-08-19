#!/usr/bin/env node

/**
 * Fix rendering issues - ensure all components use t() for existing translations
 * This script maps hardcoded text to existing translation keys
 */

const fs = require('fs').promises;
const path = require('path');

// Load all translation keys from JSON files
async function loadTranslationKeys() {
  const keys = {};
  const localesDir = path.join(__dirname, '..', 'public', 'locales', 'en');
  const files = await fs.readdir(localesDir);
  
  for (const file of files) {
    if (file.endsWith('.json')) {
      const namespace = file.replace('.json', '');
      const content = await fs.readFile(path.join(localesDir, file), 'utf8');
      keys[namespace] = JSON.parse(content);
    }
  }
  
  return keys;
}

// Extract all keys recursively
function flattenKeys(obj, prefix = '') {
  let result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenKeys(value, fullKey));
    } else {
      result[fullKey] = value;
    }
  }
  
  return result;
}

// Map hardcoded text to translation keys
function findTranslationKey(text, namespace, translations) {
  const nsKeys = translations[namespace] || {};
  const flatKeys = flattenKeys(nsKeys);
  
  // Try exact match first
  for (const [key, value] of Object.entries(flatKeys)) {
    if (value === text) {
      return key;
    }
  }
  
  // Try case-insensitive match
  const lowerText = text.toLowerCase();
  for (const [key, value] of Object.entries(flatKeys)) {
    if (typeof value === 'string' && value.toLowerCase() === lowerText) {
      return key;
    }
  }
  
  // Try partial match
  for (const [key, value] of Object.entries(flatKeys)) {
    if (typeof value === 'string' && (value.includes(text) || text.includes(value))) {
      return key;
    }
  }
  
  // Check common namespace if not found
  if (namespace !== 'common') {
    const commonKeys = flattenKeys(translations.common || {});
    for (const [key, value] of Object.entries(commonKeys)) {
      if (value === text) {
        return `common:${key}`;
      }
    }
  }
  
  return null;
}

// Fix Hero component specifically
async function fixHeroComponent() {
  const filePath = path.join(__dirname, '..', 'src', 'components', 'Hero.tsx');
  let content = await fs.readFile(filePath, 'utf8');
  
  // Fix the ValuePropsStrip features to use translations
  const featureReplacements = [
    {
      from: 'title: "upto 50%"',
      to: 'title: t("features.roi.title", "upto 50%")'
    },
    {
      from: 'subtitle: "Return On Investment"',
      to: 'subtitle: t("features.roi.subtitle", "Return On Investment")'
    },
    {
      from: 'description: "All Payout Received by RBI Licensed WLA ATM Partners"',
      to: 'description: t("features.roi.description", "All Payout Received by RBI Licensed WLA ATM Partners")'
    },
    {
      from: 'title: "15 Per Lac"',
      to: 'title: t("features.penetration.title", "15 Per Lac")'
    },
    {
      from: 'subtitle: "Only 15 ATMs per 1 Lac People"',
      to: 'subtitle: t("features.penetration.subtitle", "Only 15 ATMs per 1 Lac People")'
    },
    {
      from: 'description: "ATM Penetration in India is very Low"',
      to: 'description: t("features.penetration.description", "ATM Penetration in India is very Low")'
    },
    {
      from: 'title: "75% Cash"',
      to: 'title: t("features.cash.title", "75% Cash")'
    },
    {
      from: 'subtitle: "Cash Circulation"',
      to: 'subtitle: t("features.cash.subtitle", "Cash Circulation")'
    },
    {
      from: 'description: "Indian Economy is still Largely Cash based"',
      to: 'description: t("features.cash.description", "Indian Economy is still Largely Cash based")'
    },
    {
      from: 'title: "90% Potential"',
      to: 'title: t("features.potential.title", "90% Potential")'
    },
    {
      from: 'subtitle: "90% of Banks Offsite ATMs are closing down"',
      to: 'subtitle: t("features.potential.subtitle", "90% of Banks Offsite ATMs are closing down")'
    },
    {
      from: 'description: "Banks Offsite ATM Closure creates a Large market for ATMs"',
      to: 'description: t("features.potential.description", "Banks Offsite ATM Closure creates a Large market for ATMs")'
    }
  ];
  
  for (const { from, to } of featureReplacements) {
    content = content.replace(from, to);
  }
  
  await fs.writeFile(filePath, content);
  console.log('✅ Fixed Hero.tsx');
}

// Fix Services component
async function fixServicesComponent() {
  const filePath = path.join(__dirname, '..', 'src', 'components', 'Services.tsx');
  let content = await fs.readFile(filePath, 'utf8');
  
  // Ensure it has useTranslation
  if (!content.includes('useTranslation')) {
    const importPos = content.lastIndexOf('import');
    const endOfImport = content.indexOf('\n', importPos);
    content = content.slice(0, endOfImport) + 
             "\nimport { useTranslation } from 'react-i18next';" +
             content.slice(endOfImport);
  }
  
  // Add t function if missing
  if (!content.includes('useTranslation(')) {
    const componentStart = content.match(/const Services[^{]*{/);
    if (componentStart) {
      const insertPos = content.indexOf(componentStart[0]) + componentStart[0].length;
      content = content.slice(0, insertPos) + 
               "\n  const { t } = useTranslation('home');" +
               content.slice(insertPos);
    }
  }
  
  // Replace hardcoded text with t() calls
  const replacements = [
    { from: />Our Services</g, to: `>{t('services.title', 'Our Services')}<` },
    { from: />ATM Franchise</g, to: `>{t('services.franchise.title', 'ATM Franchise')}<` },
    { from: />Partner with leading White Label ATM operators</g, to: `>{t('services.franchise.description', 'Partner with leading White Label ATM operators')}<` },
    { from: />Submit Location</g, to: `>{t('services.location.title', 'Submit Location')}<` },
    { from: />Identify and submit potential ATM locations</g, to: `>{t('services.location.description', 'Identify and submit potential ATM locations')}<` },
    { from: />Agent Program</g, to: `>{t('services.agent.title', 'Agent Program')}<` },
    { from: />Become an agent and earn commissions</g, to: `>{t('services.agent.description', 'Become an agent and earn commissions')}<` },
    { from: />Training & Support</g, to: `>{t('services.training.title', 'Training & Support')}<` },
    { from: />Comprehensive training and ongoing support</g, to: `>{t('services.training.description', 'Comprehensive training and ongoing support')}<` }
  ];
  
  for (const { from, to } of replacements) {
    content = content.replace(from, to);
  }
  
  await fs.writeFile(filePath, content);
  console.log('✅ Fixed Services.tsx');
}

// Fix all pages to use existing translations
async function fixPageRendering(filePath, namespace) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    const translations = await loadTranslationKeys();
    
    // Ensure useTranslation is imported
    if (!content.includes("from 'react-i18next'")) {
      const lastImport = content.lastIndexOf('import');
      const endOfImport = content.indexOf('\n', lastImport);
      content = content.slice(0, endOfImport) + 
               "\nimport { useTranslation } from 'react-i18next';" +
               content.slice(endOfImport);
    }
    
    // Ensure t function is initialized
    if (!content.includes('useTranslation(')) {
      const componentMatch = content.match(/(const|function)\s+\w+[^{]*{/);
      if (componentMatch) {
        const insertPos = content.indexOf(componentMatch[0]) + componentMatch[0].length;
        content = content.slice(0, insertPos) + 
                 `\n  const { t } = useTranslation('${namespace}');` +
                 content.slice(insertPos);
      }
    }
    
    // Find all JSX text content that should use translations
    const jsxTextPattern = />([A-Z][^<>{}\n]+)</g;
    let match;
    const replacements = [];
    
    while ((match = jsxTextPattern.exec(content)) !== null) {
      const text = match[1].trim();
      
      // Skip if already using t()
      if (text.includes('t(') || text.includes('{')) continue;
      
      // Find translation key for this text
      const key = findTranslationKey(text, namespace, translations);
      
      if (key) {
        replacements.push({
          from: `>${text}<`,
          to: `>{t('${key}', '${text}')}<`
        });
      }
    }
    
    // Apply replacements
    for (const { from, to } of replacements) {
      content = content.replace(from, to);
    }
    
    await fs.writeFile(filePath, content);
    return { success: true, replacements: replacements.length };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🔧 FIXING RENDERING ISSUES - Using Existing Translations\n');
  console.log('=' .repeat(80));
  console.log('This ensures components use t() for already translated content\n');
  
  // Fix specific components first
  await fixHeroComponent();
  await fixServicesComponent();
  
  // Fix key pages
  const pages = [
    { file: 'src/pages/Home.tsx', namespace: 'home' },
    { file: 'src/pages/AboutUs.tsx', namespace: 'about' },
    { file: 'src/pages/ContactUs.tsx', namespace: 'contact' },
    { file: 'src/pages/OurProducts.tsx', namespace: 'products' },
    { file: 'src/pages/AgentPage.tsx', namespace: 'agent' },
    { file: 'src/pages/BecomefranchisePage.tsx', namespace: 'franchise' },
    { file: 'src/pages/StartATMPage.tsx', namespace: 'startAtm' },
    { file: 'src/pages/SubmitLocation.tsx', namespace: 'submitLocation' },
    { file: 'src/pages/PrivacyPolicy.tsx', namespace: 'privacy' },
    { file: 'src/pages/TermsConditions.tsx', namespace: 'terms' },
    { file: 'src/pages/RefundPolicy.tsx', namespace: 'refund' }
  ];
  
  console.log('\n📄 Fixing page rendering...\n');
  
  for (const { file, namespace } of pages) {
    const filePath = path.join(__dirname, '..', file);
    const result = await fixPageRendering(filePath, namespace);
    
    if (result.success) {
      console.log(`✅ ${file}: Fixed ${result.replacements} text instances`);
    } else {
      console.log(`❌ ${file}: ${result.error}`);
    }
  }
  
  // Fix key components
  const components = [
    { file: 'src/components/Footer.tsx', namespace: 'common' },
    { file: 'src/components/Header.tsx', namespace: 'common' },
    { file: 'src/components/WhyATMFranchiseIndia.tsx', namespace: 'home' },
    { file: 'src/components/BecomefranchiseHero.tsx', namespace: 'franchise' },
    { file: 'src/components/GetStarted.tsx', namespace: 'home' },
    { file: 'src/components/SocialProofElements.tsx', namespace: 'common' }
  ];
  
  console.log('\n🧩 Fixing component rendering...\n');
  
  for (const { file, namespace } of components) {
    const filePath = path.join(__dirname, '..', file);
    const result = await fixPageRendering(filePath, namespace);
    
    if (result.success) {
      console.log(`✅ ${file}: Fixed ${result.replacements} text instances`);
    } else {
      console.log(`❌ ${file}: ${result.error}`);
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('✅ RENDERING FIX COMPLETE!\n');
  console.log('The website now uses existing translations from JSON files.');
  console.log('Test by switching languages - all content should change.');
  console.log('\nNo need to run translate:all - we\'re using existing translations!');
}

main().catch(console.error);