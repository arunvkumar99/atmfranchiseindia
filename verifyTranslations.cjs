const fs = require('fs');
const path = require('path');

console.log('🔍 Comprehensive Translation Coverage Check\n');

const languages = ['en', 'ta', 'hi'];
const namespaces = ['common', 'home', 'forms', 'products', 'blog', 'about', 'contact'];

// Key components and their expected translation keys
const criticalKeys = {
  'common': [
    'footer.company.name',
    'footer.company.tagline',
    'footer.company.description',
    'footer.quickLinksTitle',
    'footer.links.submitLocation',
    'footer.links.becomeFranchise',
    'footer.servicesTitle',
    'footer.services.consultation',
    'footer.legalTitle',
    'footer.legal.privacy',
    'footer.copyright'
  ],
  'home': [
    'hero.title',
    'hero.subtitle',
    'hero.submitLocation',
    'hero.becomeFranchise',
    'testimonials.title',
    'testimonials.items.rajesh.name',
    'testimonials.items.rajesh.testimonial',
    'testimonials.items.priya.name',
    'testimonials.items.amit.name',
    'testimonials.items.sanjay.name',
    'whyAtm.title',
    'whyAtm.subtitle',
    'services.title',
    'services.titleHighlight',
    'services.subtitle'
  ],
  'about': [
    'hero.badge',
    'hero.title.prefix',
    'hero.subtitle'
  ],
  'contact': [
    'title',
    'phone.title',
    'email.title'
  ],
  'products': [
    'hero.title',
    'hero.badge'
  ]
};

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function checkTranslations() {
  const results = {
    complete: [],
    missing: [],
    summary: {}
  };

  languages.forEach(lang => {
    console.log(`\n📋 Checking ${lang.toUpperCase()} translations:`);
    results.summary[lang] = { total: 0, found: 0, missing: 0 };
    
    Object.entries(criticalKeys).forEach(([namespace, keys]) => {
      const filePath = path.join(__dirname, 'public', 'locales', lang, `${namespace}.json`);
      
      if (!fs.existsSync(filePath)) {
        console.log(`  ❌ Missing file: ${namespace}.json`);
        results.missing.push(`${lang}/${namespace}.json - File not found`);
        results.summary[lang].missing += keys.length;
        results.summary[lang].total += keys.length;
        return;
      }
      
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let foundCount = 0;
        let missingKeys = [];
        
        keys.forEach(key => {
          const value = getNestedValue(content, key);
          results.summary[lang].total++;
          
          if (value) {
            foundCount++;
            results.summary[lang].found++;
            // Check if it's actually translated (not in English for non-English languages)
            if (lang !== 'en' && /^[A-Za-z\s]+$/.test(value) && value.length > 10) {
              console.log(`    ⚠️  ${namespace}.${key}: Still in English`);
            }
          } else {
            missingKeys.push(key);
            results.summary[lang].missing++;
            results.missing.push(`${lang}/${namespace}.json - Missing: ${key}`);
          }
        });
        
        if (missingKeys.length > 0) {
          console.log(`  ⚠️  ${namespace}.json: ${foundCount}/${keys.length} keys found`);
          missingKeys.forEach(k => console.log(`      ❌ Missing: ${k}`));
        } else {
          console.log(`  ✅ ${namespace}.json: All ${keys.length} keys found`);
          results.complete.push(`${lang}/${namespace}.json`);
        }
        
      } catch (e) {
        console.log(`  ❌ Error reading ${namespace}.json:`, e.message);
      }
    });
  });
  
  // Summary Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 TRANSLATION COVERAGE SUMMARY');
  console.log('='.repeat(60));
  
  Object.entries(results.summary).forEach(([lang, stats]) => {
    const percentage = stats.total > 0 ? Math.round((stats.found / stats.total) * 100) : 0;
    const emoji = percentage === 100 ? '✅' : percentage >= 80 ? '🟡' : '❌';
    
    console.log(`\n${emoji} ${lang.toUpperCase()}: ${percentage}% coverage`);
    console.log(`   Found: ${stats.found}/${stats.total} keys`);
    console.log(`   Missing: ${stats.missing} keys`);
  });
  
  // Critical Issues
  if (results.missing.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('⚠️  CRITICAL MISSING TRANSLATIONS (Top 10)');
    console.log('='.repeat(60));
    results.missing.slice(0, 10).forEach(issue => {
      console.log(`  • ${issue}`);
    });
    
    if (results.missing.length > 10) {
      console.log(`  ... and ${results.missing.length - 10} more issues`);
    }
  }
  
  // Recommendations
  console.log('\n' + '='.repeat(60));
  console.log('💡 RECOMMENDATIONS');
  console.log('='.repeat(60));
  
  if (results.missing.length > 0) {
    console.log('1. Run: npm run translate:all to generate missing translations');
    console.log('2. Check if all new translation files (about.json, contact.json) exist');
    console.log('3. Verify that components are using the correct translation keys');
  } else {
    console.log('✨ All critical translations are in place!');
    console.log('Next steps:');
    console.log('1. Test language switching in the browser');
    console.log('2. Verify translation quality for each language');
  }
}

checkTranslations();