#!/usr/bin/env node

/**
 * Script to update page components to use translation hooks
 */

const fs = require('fs').promises;
const path = require('path');

const pagesDir = path.join(__dirname, '..', 'src', 'pages');

// Pages to update with their translation namespace
const pagesToUpdate = {
  'AgentPage.tsx': 'agent',
  'InfluencerPage.tsx': 'influencer',
  'JobsPage.tsx': 'jobs',
  'StartATMPage.tsx': 'startAtm',
  'PrivacyPolicy.tsx': 'privacy',
  'TermsConditions.tsx': 'terms',
  'RefundPolicy.tsx': 'refund',
  'AccessibilityStatement.tsx': 'accessibility',
  'PixellpayAdvantage.tsx': 'pixellpay',
  'NotFound.tsx': 'notFound',
  'BlogPage.tsx': 'blog'
};

async function updatePageWithTranslation(fileName, namespace) {
  const filePath = path.join(pagesDir, fileName);
  
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Check if already has translations
    if (content.includes('useTranslation')) {
      console.log(`⏭️  ${fileName} already uses translations`);
      return;
    }
    
    // Add import for useTranslation
    const importIndex = content.indexOf('import React');
    if (importIndex !== -1) {
      const nextLineIndex = content.indexOf('\n', importIndex);
      const importStatement = `\nimport { useTranslation } from 'react-i18next';`;
      content = content.slice(0, nextLineIndex) + importStatement + content.slice(nextLineIndex);
    }
    
    // Add useTranslation hook in component
    const componentMatch = content.match(/const\s+\w+\s*=\s*\(\)\s*=>\s*{/);
    if (componentMatch) {
      const insertPoint = componentMatch.index + componentMatch[0].length;
      const hookStatement = `\n  const { t } = useTranslation('${namespace}');`;
      content = content.slice(0, insertPoint) + hookStatement + content.slice(insertPoint);
    }
    
    // Save updated file
    await fs.writeFile(filePath, content);
    console.log(`✅ Updated ${fileName} with translations`);
    
  } catch (error) {
    console.error(`❌ Error updating ${fileName}:`, error.message);
  }
}

async function updateAllPages() {
  console.log('🔄 Updating pages with translation hooks...\n');
  
  for (const [fileName, namespace] of Object.entries(pagesToUpdate)) {
    await updatePageWithTranslation(fileName, namespace);
  }
  
  console.log('\n✨ Pages updated! Remember to:');
  console.log('1. Replace hardcoded text with t() calls');
  console.log('2. Test translations by changing language');
}

updateAllPages().catch(console.error);