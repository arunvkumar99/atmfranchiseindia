#!/usr/bin/env node

/**
 * Fast translation for missing files only
 * Focuses on untranslated files to complete quickly
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';
const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Files that need translation
const UNTRANSLATED_FILES = [
  'accessibility.json',
  'agent.json',
  'influencer.json',
  'jobs.json',
  'notFound.json',
  'pixellpay.json',
  'privacy.json',
  'refund.json',
  'startAtm.json',
  'terms.json'
];

// Languages needing translation
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Batch translate multiple texts at once
async function batchTranslate(texts, targetLang) {
  if (!texts.length) return [];
  
  // Google Translate API supports up to 128 texts per request
  const data = JSON.stringify({
    q: texts,
    source: 'en',
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

  return new Promise((resolve, reject) => {
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
              resolve(result.data.translations.map(t => t.translatedText));
            } else {
              resolve(texts);
            }
          } catch (error) {
            resolve(texts);
          }
        } else {
          console.log(`  ⚠️  API error for ${targetLang}: ${res.statusCode}`);
          resolve(texts);
        }
      });
    });

    req.on('error', () => resolve(texts));
    req.write(data);
    req.end();
  });
}

// Extract all text values from JSON object
function extractTexts(obj, path = '') {
  const texts = [];
  const paths = [];
  
  function traverse(obj, currentPath) {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      if (typeof value === 'string') {
        texts.push(value);
        paths.push(newPath);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, newPath);
      }
    }
  }
  
  traverse(obj, path);
  return { texts, paths };
}

// Rebuild object with translated texts
function rebuildObject(original, texts, paths) {
  const result = JSON.parse(JSON.stringify(original));
  
  texts.forEach((text, index) => {
    const path = paths[index].split('.');
    let current = result;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    current[path[path.length - 1]] = text;
  });
  
  return result;
}

async function translateMissingFiles() {
  console.log('🚀 Fast Translation for Missing Files\n');
  console.log(`📁 Files to translate: ${UNTRANSLATED_FILES.length}`);
  console.log(`🌍 Languages: ${LANGUAGES.length}\n`);
  
  let totalTranslated = 0;
  let totalSkipped = 0;
  
  for (const fileName of UNTRANSLATED_FILES) {
    console.log(`\n📝 Processing ${fileName}...`);
    
    // Read English source
    const sourcePath = path.join(LOCALES_DIR, 'en', fileName);
    let sourceContent;
    try {
      sourceContent = await fs.readFile(sourcePath, 'utf8');
    } catch (error) {
      console.log(`  ❌ Source file not found: ${fileName}`);
      continue;
    }
    
    const sourceJson = JSON.parse(sourceContent);
    const { texts, paths } = extractTexts(sourceJson);
    console.log(`  📊 Found ${texts.length} strings to translate`);
    
    // Translate for each language
    for (const lang of LANGUAGES) {
      const targetPath = path.join(LOCALES_DIR, lang, fileName);
      
      // Check if already has non-English content
      try {
        const existing = await fs.readFile(targetPath, 'utf8');
        if (!/[a-zA-Z]/.test(existing.substring(0, 100))) {
          console.log(`  ✅ ${lang} already translated`);
          totalSkipped++;
          continue;
        }
      } catch {
        // File doesn't exist, will create
      }
      
      // Batch translate all texts
      console.log(`  🔄 Translating to ${lang}...`);
      const translatedTexts = await batchTranslate(texts, lang);
      
      // Rebuild object with translations
      const translatedJson = rebuildObject(sourceJson, translatedTexts, paths);
      
      // Save translated file
      await fs.writeFile(targetPath, JSON.stringify(translatedJson, null, 2));
      console.log(`  ✅ Saved ${lang}/${fileName}`);
      totalTranslated++;
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`✨ Translation Complete!`);
  console.log(`📊 Files translated: ${totalTranslated}`);
  console.log(`⏭️  Files skipped: ${totalSkipped}`);
  console.log(`✅ All missing translations have been completed!`);
}

// Run the translation
if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
  console.error('❌ Google Translate API key not configured');
  process.exit(1);
}

translateMissingFiles().catch(console.error);