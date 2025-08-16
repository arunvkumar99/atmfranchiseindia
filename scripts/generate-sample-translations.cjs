#!/usr/bin/env node

/**
 * Generate sample translations for testing
 * This creates placeholder translations without needing Google API
 */

const fs = require('fs').promises;
const path = require('path');

const LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' }
];

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Simple mock translation function for testing
function mockTranslate(text, langCode) {
  // For testing, just add language prefix
  const langPrefix = {
    'hi': '[हिं] ',
    'bn': '[বাং] ',
    'ta': '[தமி] ',
    'te': '[తెల] ',
    'mr': '[मरा] ',
    'gu': '[ગુજ] ',
    'ur': '[اردو] ',
    'kn': '[ಕನ್ನ] ',
    'or': '[ଓଡ଼ି] ',
    'pa': '[ਪੰਜਾ] ',
    'as': '[অস] ',
    'ml': '[മല] '
  };
  
  // Keep placeholders unchanged
  if (text.includes('{{') || text.includes('}}')) {
    return text;
  }
  
  return (langPrefix[langCode] || `[${langCode}] `) + text;
}

// Translate object recursively
function translateObject(obj, langCode) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = mockTranslate(value, langCode);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      translated[key] = translateObject(value, langCode);
    } else if (Array.isArray(value)) {
      translated[key] = value.map(item => {
        if (typeof item === 'string') {
          return mockTranslate(item, langCode);
        }
        return item;
      });
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

async function generateSampleTranslations() {
  console.log('🚀 Generating sample translations for testing...\n');
  
  const namespaces = ['common', 'home', 'forms', 'products', 'blog'];
  
  for (const lang of LANGUAGES) {
    console.log(`📝 Generating ${lang.name} (${lang.code}) translations...`);
    
    const langDir = path.join(LOCALES_DIR, lang.code);
    await fs.mkdir(langDir, { recursive: true });
    
    for (const namespace of namespaces) {
      try {
        // Read English source
        const sourcePath = path.join(LOCALES_DIR, 'en', `${namespace}.json`);
        const sourceContent = await fs.readFile(sourcePath, 'utf-8');
        const sourceJson = JSON.parse(sourceContent);
        
        // Generate mock translation
        const translatedJson = translateObject(sourceJson, lang.code);
        
        // Save translated file
        const targetPath = path.join(langDir, `${namespace}.json`);
        await fs.writeFile(
          targetPath,
          JSON.stringify(translatedJson, null, 2),
          'utf-8'
        );
        
        console.log(`  ✅ Created ${namespace}.json`);
      } catch (error) {
        console.error(`  ❌ Error with ${namespace}.json:`, error.message);
      }
    }
  }
  
  console.log('\n✨ Sample translations generated!');
  console.log('These are mock translations for testing only.');
  console.log('Run "npm run translate:all" with Google API key for real translations.\n');
}

// Run the script
generateSampleTranslations().catch(console.error);