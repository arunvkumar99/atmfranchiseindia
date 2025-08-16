#!/usr/bin/env node

/**
 * One-time translation script for static content
 * This script translates all English JSON files to Indian languages
 * using Google Translate API
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuration - Now reads from .env file
const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';
const SOURCE_LANG = 'en';
const TARGET_LANGUAGES = [
  { code: 'hi', name: 'Hindi' },
  { code: 'bn', name: 'Bengali' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ur', name: 'Urdu' },
  { code: 'kn', name: 'Kannada' },
  { code: 'or', name: 'Odia' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'as', name: 'Assamese' },
  { code: 'ml', name: 'Malayalam' }
];

const NAMESPACES = ['common', 'home', 'forms', 'products', 'blog'];
const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Google Translate API function
async function translateText(text, targetLang) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
    console.error('❌ Google Translate API key not set!');
    console.log('\n📝 To fix this:');
    console.log('1. Copy .env.example to .env');
    console.log('2. Add your Google API key to the .env file');
    console.log('3. Run this script again\n');
    console.log('Or set it temporarily:');
    console.log('  Windows: set GOOGLE_TRANSLATE_API_KEY=your_key_here');
    console.log('  PowerShell: $env:GOOGLE_TRANSLATE_API_KEY="your_key_here"\n');
    process.exit(1);
  }

  return new Promise((resolve, reject) => {
    const url = `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`;
    
    const data = JSON.stringify({
      q: text,
      source: SOURCE_LANG,
      target: targetLang,
      format: 'text'
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (result.data && result.data.translations) {
            resolve(result.data.translations[0].translatedText);
          } else {
            reject(new Error('Invalid response from Google Translate'));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// Translate a JSON object recursively
async function translateObject(obj, targetLang, delay = 100) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Skip placeholders and variables
      if (value.includes('{{') || value.includes('}}')) {
        translated[key] = value; // Keep as is
      } else {
        try {
          // Add delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, delay));
          translated[key] = await translateText(value, targetLang);
          console.log(`  ✓ Translated: "${value.substring(0, 30)}..."`);
        } catch (error) {
          console.error(`  ✗ Failed to translate: "${value}"`);
          translated[key] = value; // Keep original on error
        }
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      translated[key] = await translateObject(value, targetLang, delay);
    } else if (Array.isArray(value)) {
      translated[key] = await Promise.all(
        value.map(async (item) => {
          if (typeof item === 'string') {
            await new Promise(resolve => setTimeout(resolve, delay));
            return await translateText(item, targetLang);
          }
          return item;
        })
      );
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

// Main translation function
async function translateAllContent() {
  console.log('🚀 Starting translation process...\n');
  
  // Check if API key is set
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
    console.error('❌ Google Translate API key not set!');
    console.log('\n📝 To set up your API key:\n');
    console.log('Option 1: Use .env file (Recommended)');
    console.log('  1. Copy .env.example to .env');
    console.log('  2. Edit .env and add your Google API key');
    console.log('  3. Run: npm run translate:all\n');
    console.log('Option 2: Set environment variable');
    console.log('  Windows CMD: set GOOGLE_TRANSLATE_API_KEY=your_api_key');
    console.log('  PowerShell: $env:GOOGLE_TRANSLATE_API_KEY="your_api_key"');
    console.log('  Then run: npm run translate:all\n');
    console.log('To get an API key:');
    console.log('  1. Go to https://console.cloud.google.com');
    console.log('  2. Enable Cloud Translation API');
    console.log('  3. Create credentials > API Key\n');
    return;
  }
  
  console.log('✅ API Key found! Starting translations...\n');
  
  let totalTranslations = 0;
  let failedTranslations = 0;
  
  for (const targetLang of TARGET_LANGUAGES) {
    console.log(`\n📝 Translating to ${targetLang.name} (${targetLang.code})...`);
    
    // Create language directory if it doesn't exist
    const langDir = path.join(LOCALES_DIR, targetLang.code);
    try {
      await fs.mkdir(langDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    for (const namespace of NAMESPACES) {
      console.log(`\n  Processing ${namespace}.json...`);
      
      try {
        // Read English source file
        const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG, `${namespace}.json`);
        const sourceContent = await fs.readFile(sourcePath, 'utf-8');
        const sourceJson = JSON.parse(sourceContent);
        
        // Check if translation already exists
        const targetPath = path.join(langDir, `${namespace}.json`);
        let skipTranslation = false;
        
        try {
          await fs.access(targetPath);
          console.log(`    ⚠️  ${namespace}.json already exists for ${targetLang.code}`);
          
          // Ask user if they want to overwrite (in production, skip by default)
          if (process.env.SKIP_EXISTING === 'true') {
            console.log(`    ↩️  Skipping existing translation`);
            skipTranslation = true;
          }
        } catch {
          // File doesn't exist, proceed with translation
        }
        
        if (!skipTranslation) {
          // Translate the content
          const translatedJson = await translateObject(sourceJson, targetLang.code);
          
          // Save translated file
          await fs.writeFile(
            targetPath,
            JSON.stringify(translatedJson, null, 2),
            'utf-8'
          );
          
          console.log(`    ✅ Saved ${namespace}.json for ${targetLang.code}`);
          totalTranslations++;
        }
        
      } catch (error) {
        console.error(`    ❌ Error processing ${namespace}.json:`, error.message);
        failedTranslations++;
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Translation process completed!');
  console.log(`📊 Total successful: ${totalTranslations}`);
  console.log(`❌ Failed: ${failedTranslations}`);
  console.log('='.repeat(50) + '\n');
  
  // Estimate cost
  const estimatedCharacters = totalTranslations * 5000; // Rough estimate
  const estimatedCost = (estimatedCharacters / 1000000) * 20; // $20 per million chars
  console.log(`💰 Estimated cost: $${estimatedCost.toFixed(2)}`);
}

// Utility function to check for changes
async function checkForChanges() {
  console.log('🔍 Checking for content changes...\n');
  
  const changes = [];
  
  for (const namespace of NAMESPACES) {
    const sourcePath = path.join(LOCALES_DIR, SOURCE_LANG, `${namespace}.json`);
    
    try {
      const sourceContent = await fs.readFile(sourcePath, 'utf-8');
      const sourceJson = JSON.parse(sourceContent);
      
      // Check each target language
      for (const targetLang of TARGET_LANGUAGES) {
        const targetPath = path.join(LOCALES_DIR, targetLang.code, `${namespace}.json`);
        
        try {
          const targetContent = await fs.readFile(targetPath, 'utf-8');
          const targetJson = JSON.parse(targetContent);
          
          // Compare keys
          const sourceKeys = Object.keys(sourceJson);
          const targetKeys = Object.keys(targetJson);
          
          const missingKeys = sourceKeys.filter(key => !targetKeys.includes(key));
          
          if (missingKeys.length > 0) {
            changes.push({
              language: targetLang.code,
              namespace,
              missingKeys
            });
          }
        } catch {
          // Target file doesn't exist
          changes.push({
            language: targetLang.code,
            namespace,
            missing: true
          });
        }
      }
    } catch (error) {
      console.error(`Error reading ${namespace}.json:`, error.message);
    }
  }
  
  if (changes.length === 0) {
    console.log('✅ All translations are up to date!');
  } else {
    console.log('📝 Changes detected:');
    changes.forEach(change => {
      if (change.missing) {
        console.log(`  - ${change.language}/${change.namespace}.json is missing`);
      } else {
        console.log(`  - ${change.language}/${change.namespace}.json missing keys:`, change.missingKeys);
      }
    });
  }
  
  return changes;
}

// Run based on command line argument
const command = process.argv[2];

if (command === 'check') {
  checkForChanges();
} else if (command === 'translate') {
  translateAllContent();
} else {
  console.log('Usage:');
  console.log('  node translate-content.js translate  - Translate all content');
  console.log('  node translate-content.js check     - Check for missing translations');
}