const fs = require('fs');
const path = require('path');

// All supported languages
const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Get all namespace files from English (the master)
const enDir = path.join(__dirname, '..', 'public', 'locales', 'en');
const namespaces = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));

console.log('🔄 Syncing translation file structure across all languages...\n');
console.log(`Found ${namespaces.length} namespace files in English:\n`);
console.log(namespaces.map(n => `  - ${n}`).join('\n'));
console.log('\n' + '='.repeat(80) + '\n');

let totalCreated = 0;
let totalUpdated = 0;
let totalErrors = 0;

// Process each language
languages.forEach(lang => {
  if (lang === 'en') return; // Skip English as it's the master
  
  const langDir = path.join(__dirname, '..', 'public', 'locales', lang);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
    console.log(`📁 Created directory: ${lang}/`);
  }
  
  console.log(`\n🌐 Processing ${lang.toUpperCase()}:`);
  console.log('-'.repeat(40));
  
  // Check each namespace
  namespaces.forEach(namespace => {
    const enFile = path.join(enDir, namespace);
    const langFile = path.join(langDir, namespace);
    
    try {
      const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
      
      if (!fs.existsSync(langFile)) {
        // Create new file with English structure but empty values
        const newContent = createEmptyStructure(enContent, lang);
        fs.writeFileSync(langFile, JSON.stringify(newContent, null, 2), 'utf8');
        console.log(`  ✅ Created: ${namespace}`);
        totalCreated++;
      } else {
        // File exists, check if structure matches
        const langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'));
        const { updated, content } = syncStructure(enContent, langContent, lang);
        
        if (updated) {
          fs.writeFileSync(langFile, JSON.stringify(content, null, 2), 'utf8');
          console.log(`  📝 Updated: ${namespace} (added missing keys)`);
          totalUpdated++;
        } else {
          console.log(`  ✓ OK: ${namespace}`);
        }
      }
    } catch (error) {
      console.error(`  ❌ Error with ${namespace}: ${error.message}`);
      totalErrors++;
    }
  });
});

// Helper function to create empty structure
function createEmptyStructure(obj, lang) {
  const result = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      result[key] = createEmptyStructure(value, lang);
    } else {
      // Keep English value as placeholder (to be translated)
      result[key] = value;
    }
  }
  
  return result;
}

// Helper function to sync structure
function syncStructure(enObj, langObj, lang) {
  let updated = false;
  const result = { ...langObj };
  
  // Add missing keys from English
  for (const [key, value] of Object.entries(enObj)) {
    if (!(key in result)) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = createEmptyStructure(value, lang);
      } else {
        result[key] = value; // Use English as placeholder
      }
      updated = true;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively sync nested objects
      const nested = syncStructure(value, result[key] || {}, lang);
      if (nested.updated) {
        result[key] = nested.content;
        updated = true;
      }
    }
  }
  
  // Remove keys that don't exist in English
  for (const key of Object.keys(result)) {
    if (!(key in enObj)) {
      delete result[key];
      updated = true;
    }
  }
  
  return { updated, content: result };
}

console.log('\n' + '='.repeat(80));
console.log('\n📊 SUMMARY:');
console.log(`   Created: ${totalCreated} new files`);
console.log(`   Updated: ${totalUpdated} existing files`);
console.log(`   Errors: ${totalErrors}`);
console.log(`   Total namespaces: ${namespaces.length}`);
console.log(`   Total languages: ${languages.length - 1} (excluding English)`);

if (totalCreated > 0 || totalUpdated > 0) {
  console.log('\n✅ Translation structure synchronized successfully!');
  console.log('   All languages now have the same file and key structure as English.');
  console.log('\n⚠️  Note: New keys have English values as placeholders.');
  console.log('   These need to be properly translated to each target language.');
} else if (totalErrors === 0) {
  console.log('\n✓ All translation files already have matching structure!');
} else {
  console.log('\n⚠️  Some errors occurred. Please review the output above.');
}