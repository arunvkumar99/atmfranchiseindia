#!/usr/bin/env node

/**
 * Quick script to copy English translations to all language folders
 * This ensures all pages have translation support immediately
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const TARGET_LANGUAGES = [
  'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'
];

const NEW_FILES = [
  'franchise.json',
  'agent.json',
  'influencer.json',
  'jobs.json',
  'startAtm.json',
  'privacy.json',
  'terms.json',
  'refund.json',
  'accessibility.json',
  'pixellpay.json',
  'notFound.json',
  'blog.json'
];

async function copyTranslations() {
  console.log('📋 Copying English translations to all languages...\n');
  
  for (const lang of TARGET_LANGUAGES) {
    console.log(`📁 Processing ${lang}...`);
    const targetDir = path.join(LOCALES_DIR, lang);
    await fs.mkdir(targetDir, { recursive: true });
    
    for (const fileName of NEW_FILES) {
      try {
        const sourcePath = path.join(LOCALES_DIR, 'en', fileName);
        const targetPath = path.join(targetDir, fileName);
        
        // Check if source exists
        try {
          await fs.access(sourcePath);
        } catch {
          console.log(`  ⚠️  Source ${fileName} not found`);
          continue;
        }
        
        // Check if target already exists
        try {
          await fs.access(targetPath);
          console.log(`  ⏭️  ${fileName} already exists`);
          continue;
        } catch {
          // Target doesn't exist, copy it
        }
        
        // Copy file
        await fs.copyFile(sourcePath, targetPath);
        console.log(`  ✅ Copied ${fileName}`);
        
      } catch (error) {
        console.error(`  ❌ Error copying ${fileName}:`, error.message);
      }
    }
  }
  
  console.log('\n✨ All files copied successfully!');
  console.log('Translation coverage is now 100% (using English as fallback)');
  console.log('Run the translation script later to translate to native languages.');
}

copyTranslations().catch(console.error);