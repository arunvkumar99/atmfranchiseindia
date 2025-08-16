#!/usr/bin/env node

/**
 * Fixed translation script with chunking for large files
 * Handles rate limiting and large content gracefully
 */

const fs = require('fs').promises;
const path = require('path');
const https = require('https');

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuration
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

// Increased delay between API calls to avoid rate limiting
const API_DELAY = parseInt(process.env.TRANSLATION_DELAY) || 200;
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

// Google Translate API function with retry logic
async function translateText(text, targetLang, retries = 0) {
  if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'your_api_key_here') {
    throw new Error('API key not configured');
  }

  // Skip if text is too short or just whitespace
  if (!text || text.trim().length === 0) {
    return text;
  }

  // Google Translate has a limit of ~5000 characters per request
  // If text is too long, return it as-is (will handle chunking at higher level)
  if (text.length > 4500) {
    console.warn(`    ⚠️  Text too long (${text.length} chars), splitting required`);
    return text; // Will be handled by translateLongText
  }

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
      
      res.on('end', async () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(responseData);
            if (result.data && result.data.translations) {
              resolve(result.data.translations[0].translatedText);
            } else {
              reject(new Error('Invalid response structure'));
            }
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error.message}`));
          }
        } else if (res.statusCode === 429 || res.statusCode === 403) {
          // Rate limiting or quota issues
          if (retries < MAX_RETRIES) {
            console.log(`    ⏳ Rate limited, retrying in ${RETRY_DELAY}ms...`);
            await new Promise(r => setTimeout(r, RETRY_DELAY));
            try {
              const result = await translateText(text, targetLang, retries + 1);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          } else {
            reject(new Error(`API Error ${res.statusCode}: Rate limit exceeded`));
          }
        } else {
          // Log the actual error response
          console.error(`    ❌ API Error ${res.statusCode}:`, responseData.substring(0, 200));
          reject(new Error(`API Error ${res.statusCode}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

// Handle long text by splitting into sentences
async function translateLongText(text, targetLang) {
  // If text is short enough, translate directly
  if (text.length < 4500) {
    return await translateText(text, targetLang);
  }

  // Split by sentences (rough split by periods followed by space or newline)
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const chunks = [];
  let currentChunk = '';

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length < 4000) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = sentence;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  console.log(`    📦 Splitting into ${chunks.length} chunks for translation`);

  // Translate each chunk
  const translatedChunks = [];
  for (let i = 0; i < chunks.length; i++) {
    await new Promise(r => setTimeout(r, API_DELAY * 2)); // Extra delay for chunks
    try {
      const translated = await translateText(chunks[i], targetLang);
      translatedChunks.push(translated);
      console.log(`      ✓ Chunk ${i + 1}/${chunks.length} translated`);
    } catch (error) {
      console.error(`      ✗ Chunk ${i + 1} failed:`, error.message);
      translatedChunks.push(chunks[i]); // Keep original on error
    }
  }

  return translatedChunks.join('');
}

// Translate object recursively with better error handling
async function translateObject(obj, targetLang, path = '', delay = API_DELAY) {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (typeof value === 'string') {
      // Skip placeholders and variables
      if (value.includes('{{') || value.includes('}}')) {
        translated[key] = value;
      } else {
        try {
          await new Promise(resolve => setTimeout(resolve, delay));
          
          // Use appropriate function based on text length
          if (value.length > 4500) {
            translated[key] = await translateLongText(value, targetLang);
          } else {
            translated[key] = await translateText(value, targetLang);
          }
          
          // Show progress for long texts
          if (value.length > 100) {
            console.log(`    ✓ ${currentPath}: "${value.substring(0, 40)}..."`);
          }
        } catch (error) {
          console.error(`    ✗ Failed ${currentPath}: ${error.message}`);
          translated[key] = value; // Keep original on error
        }
      }
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      translated[key] = await translateObject(value, targetLang, currentPath, delay);
    } else if (Array.isArray(value)) {
      translated[key] = [];
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === 'string') {
          try {
            await new Promise(resolve => setTimeout(resolve, delay));
            translated[key][i] = await translateText(value[i], targetLang);
          } catch (error) {
            console.error(`    ✗ Failed ${currentPath}[${i}]: ${error.message}`);
            translated[key][i] = value[i];
          }
        } else {
          translated[key][i] = value[i];
        }
      }
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
    console.log('1. Edit the .env file in the project root');
    console.log('2. Add your Google API key');
    console.log('3. Run this script again\n');
    return;
  }
  
  console.log('✅ API Key found! Starting translations...');
  console.log(`⏱️  Using ${API_DELAY}ms delay between API calls\n`);
  
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
          
          if (process.env.SKIP_EXISTING === 'true') {
            console.log(`    ↩️  Skipping existing translation`);
            skipTranslation = true;
          }
        } catch {
          // File doesn't exist, proceed with translation
        }
        
        if (!skipTranslation) {
          // Add extra delay for products.json as it's larger
          const extraDelay = namespace === 'products' ? API_DELAY * 2 : API_DELAY;
          
          // Translate the content
          console.log(`    🔄 Translating ${namespace}...`);
          const translatedJson = await translateObject(sourceJson, targetLang.code, '', extraDelay);
          
          // Save translated file
          await fs.writeFile(
            targetPath,
            JSON.stringify(translatedJson, null, 2),
            'utf-8'
          );
          
          console.log(`    ✅ Saved ${namespace}.json for ${targetLang.code}`);
          totalTranslations++;
          
          // Add extra delay after large files
          if (namespace === 'products') {
            console.log(`    ⏳ Cooling down after large file...`);
            await new Promise(r => setTimeout(r, 3000));
          }
        }
        
      } catch (error) {
        console.error(`    ❌ Error processing ${namespace}.json:`, error.message);
        failedTranslations++;
        
        // If it's a rate limit error, wait longer
        if (error.message.includes('Rate limit')) {
          console.log('    ⏳ Waiting 10 seconds before continuing...');
          await new Promise(r => setTimeout(r, 10000));
        }
      }
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Translation process completed!');
  console.log(`📊 Total successful: ${totalTranslations}`);
  console.log(`❌ Failed: ${failedTranslations}`);
  console.log('='.repeat(50) + '\n');
  
  if (failedTranslations > 0) {
    console.log('💡 Tip: If you had failures, try running the script again.');
    console.log('   It will skip already translated files by default.\n');
  }
  
  // Estimate cost
  const estimatedCharacters = totalTranslations * 5000;
  const estimatedCost = (estimatedCharacters / 1000000) * 20;
  console.log(`💰 Estimated cost: $${estimatedCost.toFixed(2)}`);
}

// Run based on command line argument
const command = process.argv[2];

if (command === 'translate') {
  translateAllContent().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
} else {
  console.log('Usage:');
  console.log('  node translate-content-fixed.cjs translate');
}