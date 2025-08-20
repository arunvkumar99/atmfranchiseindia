const fs = require('fs');
const path = require('path');

// Validate that all languages have the same keys
function validateTranslations() {
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir).filter(f => 
    fs.statSync(path.join(localesDir, f)).isDirectory()
  );
  
  const enDir = path.join(localesDir, 'en');
  const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  
  const issues = [];
  
  enFiles.forEach(file => {
    const enPath = path.join(enDir, file);
    const enKeys = getAllKeys(JSON.parse(fs.readFileSync(enPath, 'utf8')));
    
    languages.forEach(lang => {
      if (lang === 'en') return;
      
      const langPath = path.join(localesDir, lang, file);
      if (!fs.existsSync(langPath)) {
        issues.push(`Missing file: ${lang}/${file}`);
        return;
      }
      
      const langKeys = getAllKeys(JSON.parse(fs.readFileSync(langPath, 'utf8')));
      const missingKeys = enKeys.filter(key => !langKeys.includes(key));
      const extraKeys = langKeys.filter(key => !enKeys.includes(key));
      
      if (missingKeys.length > 0) {
        issues.push(`${lang}/${file} missing keys: ${missingKeys.join(', ')}`);
      }
      if (extraKeys.length > 0) {
        issues.push(`${lang}/${file} extra keys: ${extraKeys.join(', ')}`);
      }
    });
  });
  
  return issues;
}

function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Run validation
const issues = validateTranslations();

if (issues.length > 0) {
  console.log('\n❌ Translation validation issues found:');
  issues.forEach(issue => console.log(`  - ${issue}`));
  process.exit(1);
} else {
  console.log('\n✅ All translations are valid and consistent!');
}
