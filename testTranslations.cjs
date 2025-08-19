// Test script to verify translations are working
const fs = require('fs');
const path = require('path');

const languages = ['en', 'hi', 'ta', 'te', 'bn', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];
const namespaces = ['common', 'home', 'forms', 'products', 'blog', 'about'];

console.log('🔍 Checking translation files...\n');

let issues = [];
let successes = [];

// Check if translation files exist
languages.forEach(lang => {
  namespaces.forEach(ns => {
    const filePath = path.join(__dirname, 'public', 'locales', lang, `${ns}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = Object.keys(content).length;
        if (keys > 0) {
          successes.push(`✅ ${lang}/${ns}.json - ${keys} keys`);
        } else {
          issues.push(`⚠️ ${lang}/${ns}.json exists but is empty`);
        }
      } catch (e) {
        issues.push(`❌ ${lang}/${ns}.json - Invalid JSON`);
      }
    } else {
      issues.push(`❌ Missing: ${lang}/${ns}.json`);
    }
  });
});

// Check specific important keys
console.log('\n📋 Checking key translations...\n');

const checkKeys = [
  { file: 'home', key: 'hero.title' },
  { file: 'home', key: 'testimonials.title' },
  { file: 'home', key: 'whyAtm.title' },
  { file: 'common', key: 'footer.quickLinks' },
  { file: 'home', key: 'services.title' }
];

checkKeys.forEach(({ file, key }) => {
  console.log(`\nChecking "${key}" in ${file}:`);
  ['en', 'hi', 'ta'].forEach(lang => {
    const filePath = path.join(__dirname, 'public', 'locales', lang, `${file}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const keys = key.split('.');
        let value = content;
        for (const k of keys) {
          value = value?.[k];
        }
        if (value) {
          console.log(`  ${lang}: "${value.substring(0, 50)}..."`);
        } else {
          console.log(`  ${lang}: ❌ Key not found`);
        }
      } catch (e) {
        console.log(`  ${lang}: ❌ Error reading file`);
      }
    }
  });
});

// Summary
console.log('\n📊 Summary:');
console.log(`  Successes: ${successes.length}`);
console.log(`  Issues: ${issues.length}`);

if (issues.length > 0) {
  console.log('\n⚠️ Issues found:');
  issues.slice(0, 10).forEach(issue => console.log(`  ${issue}`));
  if (issues.length > 10) {
    console.log(`  ... and ${issues.length - 10} more`);
  }
}

console.log('\n✨ Translation check complete!');