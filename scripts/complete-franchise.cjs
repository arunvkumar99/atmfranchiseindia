#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const GOOGLE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || '';
const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Languages that need franchise.json translation
const LANGUAGES = ['mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

async function batchTranslate(texts, targetLang) {
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
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', (chunk) => { responseData += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(responseData);
          if (result.data && result.data.translations) {
            resolve(result.data.translations.map(t => t.translatedText));
          } else {
            resolve(texts);
          }
        } catch {
          resolve(texts);
        }
      });
    });
    req.on('error', () => resolve(texts));
    req.write(data);
    req.end();
  });
}

function extractTexts(obj) {
  const texts = [];
  const paths = [];
  
  function traverse(obj, currentPath = '') {
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
  
  traverse(obj);
  return { texts, paths };
}

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

async function completeFranchiseTranslations() {
  console.log('🚀 Completing franchise.json translations\n');
  
  const sourcePath = path.join(LOCALES_DIR, 'en', 'franchise.json');
  const sourceContent = await fs.readFile(sourcePath, 'utf8');
  const sourceJson = JSON.parse(sourceContent);
  const { texts, paths } = extractTexts(sourceJson);
  
  console.log(`📊 Found ${texts.length} strings to translate\n`);
  
  for (const lang of LANGUAGES) {
    console.log(`🔄 Translating to ${lang}...`);
    const translatedTexts = await batchTranslate(texts, lang);
    const translatedJson = rebuildObject(sourceJson, translatedTexts, paths);
    
    const targetPath = path.join(LOCALES_DIR, lang, 'franchise.json');
    await fs.writeFile(targetPath, JSON.stringify(translatedJson, null, 2));
    console.log(`✅ Saved ${lang}/franchise.json`);
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log('\n✨ franchise.json translations complete!');
}

completeFranchiseTranslations().catch(console.error);