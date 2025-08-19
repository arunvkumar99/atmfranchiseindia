#!/usr/bin/env node

/**
 * Sync translation keys across all language files
 * Ensures all languages have the same keys as English
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Extract all keys from an object recursively
function extractKeys(obj, prefix = '') {
  let keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys = keys.concat(extractKeys(value, fullKey));
    } else {
      keys.push({ key: fullKey, value });
    }
  }
  
  return keys;
}

// Set a nested key in an object
function setNestedKey(obj, keyPath, value) {
  const keys = keyPath.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  
  current[keys[keys.length - 1]] = value;
}

// Get a nested value from an object
function getNestedValue(obj, keyPath) {
  const keys = keyPath.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return current;
}

async function syncFile(fileName) {
  try {
    // Read English file (source)
    const enPath = path.join(LOCALES_DIR, 'en', fileName);
    const enContent = await fs.readFile(enPath, 'utf8');
    const enJson = JSON.parse(enContent);
    
    // Extract all keys from English
    const enKeys = extractKeys(enJson);
    
    let totalAdded = 0;
    let totalUpdated = 0;
    
    // Process each language
    for (const lang of LANGUAGES) {
      const langPath = path.join(LOCALES_DIR, lang, fileName);
      
      try {
        // Read existing translation file
        const langContent = await fs.readFile(langPath, 'utf8');
        const langJson = JSON.parse(langContent);
        
        let modified = false;
        let addedKeys = 0;
        
        // Check each English key
        for (const { key, value } of enKeys) {
          const existingValue = getNestedValue(langJson, key);
          
          if (existingValue === undefined) {
            // Key doesn't exist, add it with English value as placeholder
            setNestedKey(langJson, key, value);
            modified = true;
            addedKeys++;
          }
        }
        
        // Save if modified
        if (modified) {
          await fs.writeFile(langPath, JSON.stringify(langJson, null, 2));
          totalAdded += addedKeys;
          console.log(`  ✅ ${lang}/${fileName}: Added ${addedKeys} missing keys`);
        } else {
          console.log(`  ⏭️  ${lang}/${fileName}: All keys present`);
        }
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          // File doesn't exist, create it with English content
          await fs.writeFile(langPath, JSON.stringify(enJson, null, 2));
          console.log(`  📝 ${lang}/${fileName}: Created new file with ${enKeys.length} keys`);
          totalAdded += enKeys.length;
        } else {
          console.log(`  ❌ ${lang}/${fileName}: ${error.message}`);
        }
      }
    }
    
    return { fileName, totalAdded, totalUpdated };
    
  } catch (error) {
    return { fileName, error: error.message };
  }
}

async function main() {
  console.log('🔄 SYNCING TRANSLATION KEYS ACROSS LANGUAGES\n');
  console.log('=' .repeat(80));
  console.log('This ensures all languages have the same keys as English\n');
  
  // Get all JSON files from English directory
  const enFiles = await fs.readdir(path.join(LOCALES_DIR, 'en'));
  const jsonFiles = enFiles.filter(f => f.endsWith('.json'));
  
  let totalFilesProcessed = 0;
  let totalKeysAdded = 0;
  
  for (const file of jsonFiles) {
    console.log(`\n📄 Processing ${file}:`);
    const result = await syncFile(file);
    
    if (result.error) {
      console.log(`  ❌ Error: ${result.error}`);
    } else {
      totalFilesProcessed++;
      totalKeysAdded += result.totalAdded || 0;
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 SUMMARY:\n');
  console.log(`Files processed: ${totalFilesProcessed}`);
  console.log(`Total keys added: ${totalKeysAdded}`);
  
  if (totalKeysAdded > 0) {
    console.log('\n⚠️ IMPORTANT: The added keys contain English text as placeholders.');
    console.log('Run translation scripts to translate them to respective languages:');
    console.log('  npm run translate:all');
  }
  
  console.log('\n✅ Key synchronization complete!');
}

main().catch(console.error);