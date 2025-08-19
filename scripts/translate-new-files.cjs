#!/usr/bin/env node

/**
 * Optimized translation script for new files only
 * Translates only the newly created JSON files to all languages
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';
const SOURCE_LANG = 'en';
const TARGET_LANGUAGES = [
  'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'
];

// New files to translate
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

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

async function translateText(text, targetLang) {
  if (!text || text.trim().length === 0) return text;
  
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      q: text,
      source: SOURCE_LANG,
      target: targetLang,
      format: 'text'
    });

    const options = {
      hostname: 'translation.googleapis.com',
      path: `/language/translate/v2?key=${GOOGLE_API_KEY}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(responseData);
            if (result.data && result.data.translations) {
              resolve(result.data.translations[0].translatedText);
            } else {
              resolve(text);
            }
          } catch (error) {
            resolve(text);
          }
        } else {
          resolve(text);
        }
      });
    });

    req.on('error', () => resolve(text));
    req.write(data);
    req.end();
  });
}

async function translateObject(obj, targetLang) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      translated[key] = await translateText(value, targetLang);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

async function translateNewFiles() {
  console.log('🚀 Translating new files to all languages...\n');
  
  for (const fileName of NEW_FILES) {
    console.log(`📝 Processing ${fileName}...`);
    
    try {
      // Read English source file
      const sourcePath = path.join(LOCALES_DIR, 'en', fileName);
      const sourceContent = await fs.readFile(sourcePath, 'utf8');
      const sourceJson = JSON.parse(sourceContent);
      
      // Translate to each target language
      for (const lang of TARGET_LANGUAGES) {
        const targetDir = path.join(LOCALES_DIR, lang);
        await fs.mkdir(targetDir, { recursive: true });
        
        const targetPath = path.join(targetDir, fileName);
        
        // Check if file already exists
        try {
          await fs.access(targetPath);
          console.log(`  ⏭️  ${lang}/${fileName} already exists, skipping...`);
          continue;
        } catch {
          // File doesn't exist, proceed with translation
        }
        
        console.log(`  🔄 Translating to ${lang}...`);
        const translatedJson = await translateObject(sourceJson, lang);
        
        await fs.writeFile(targetPath, JSON.stringify(translatedJson, null, 2));
        console.log(`  ✅ Created ${lang}/${fileName}`);
      }
      
    } catch (error) {
      console.error(`  ❌ Error processing ${fileName}:`, error.message);
    }
  }
  
  console.log('\n✨ Translation complete!');
}

// Check API key
if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
  console.error('❌ Google Translate API key not configured');
  process.exit(1);
}

// Run translations
translateNewFiles().catch(console.error);