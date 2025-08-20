#!/usr/bin/env node

/**
 * Ravi's Critical Fix Script - Day 2
 * Purpose: Fix the most critical issues preventing build
 * Author: Ravi - Team Lead
 * Date: Day 2 Emergency Fix
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('RAVI\'S CRITICAL FIX - DAY 2 EMERGENCY');
console.log('='.repeat(80));

// Fix 1: Remove unused useTranslation imports
function fixUnusedTranslationImports() {
  console.log('\n[FIX 1] Removing unused translation imports...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const problematicComponents = [
    'AccessibilityWrapper.tsx',
    'AdminTableWithIST.tsx',
    'AgentFormProgressive.tsx',
    'BreadcrumbNavigation.tsx',
    'DirectSheetsForm.tsx'
  ];
  
  problematicComponents.forEach(file => {
    const filePath = path.join(componentsDir, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Check if t is actually used
      if (!content.includes('{t(') && !content.includes('t(\'') && !content.includes('t("')) {
        // Remove useTranslation import
        content = content.replace(/import\s+{\s*useTranslation\s*}\s+from\s+['"]react-i18next['"];?\n?/g, '');
        // Remove const { t } = useTranslation line
        content = content.replace(/const\s+{\s*t\s*}\s*=\s*useTranslation\([^)]*\);?\n?/g, '');
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`  ✓ Fixed ${file}`);
      }
    }
  });
}

// Fix 2: Add missing translation keys for critical namespaces
function addMissingTranslationKeys() {
  console.log('\n[FIX 2] Adding missing translation keys...');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const baseDir = path.join(localesDir, 'en');
  
  // Get English structure as base
  const namespaces = ['forms', 'home', 'franchise', 'about'];
  
  namespaces.forEach(ns => {
    const enFile = path.join(baseDir, `${ns}.json`);
    if (!fs.existsSync(enFile)) return;
    
    const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    
    // Update all other languages
    const languages = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'as', 'or', 'pa'];
    
    languages.forEach(lang => {
      const langFile = path.join(localesDir, lang, `${ns}.json`);
      
      if (fs.existsSync(langFile)) {
        let langContent = {};
        try {
          langContent = JSON.parse(fs.readFileSync(langFile, 'utf8'));
        } catch (e) {
          console.log(`  ⚠️ Invalid JSON in ${lang}/${ns}.json`);
        }
        
        // Merge with English keys (use English as fallback)
        const merged = mergeDeep(enContent, langContent);
        
        fs.writeFileSync(langFile, JSON.stringify(merged, null, 2), 'utf8');
      }
    });
  });
  
  console.log('  ✓ Updated translation keys');
}

// Deep merge helper
function mergeDeep(target, source) {
  const output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target))
          Object.assign(output, { [key]: source[key] });
        else
          output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Fix 3: Fix LazyLoadingWrapper component
function fixLazyLoadingWrapper() {
  console.log('\n[FIX 3] Fixing LazyLoadingWrapper...');
  
  const filePath = path.join(__dirname, '..', 'src', 'components', 'LazyLoadingWrapper.tsx');
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add translation import if missing
    if (!content.includes('useTranslation')) {
      const importStatement = "import { useTranslation } from 'react-i18next';";
      content = content.replace(
        /import React[^;]*;/,
        `$&\n${importStatement}`
      );
    }
    
    // Add useTranslation hook
    if (!content.includes('const { t }')) {
      content = content.replace(
        /(const LazyLoadingWrapper[^{]*{)/,
        `$1\n  const { t } = useTranslation('common');`
      );
    }
    
    // Replace hardcoded "Loading..." text
    content = content.replace(
      />Loading\.\.\.</g,
      `>{t('loading')}<`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('  ✓ Fixed LazyLoadingWrapper');
  }
}

// Fix 4: Ensure common.json has all required keys
function ensureCommonKeys() {
  console.log('\n[FIX 4] Ensuring common translation keys...');
  
  const commonKeys = {
    loading: 'Loading...',
    error: 'An error occurred',
    success: 'Success',
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    next: 'Next',
    previous: 'Previous',
    close: 'Close',
    confirm: 'Confirm'
  };
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  const languages = fs.readdirSync(localesDir);
  
  languages.forEach(lang => {
    const commonFile = path.join(localesDir, lang, 'common.json');
    
    let content = {};
    if (fs.existsSync(commonFile)) {
      try {
        content = JSON.parse(fs.readFileSync(commonFile, 'utf8'));
      } catch (e) {
        console.log(`  ⚠️ Invalid JSON in ${lang}/common.json`);
      }
    }
    
    // Add missing keys
    Object.entries(commonKeys).forEach(([key, value]) => {
      if (!content[key]) {
        // For non-English, add a marker that it needs translation
        content[key] = lang === 'en' ? value : `[${lang.toUpperCase()}] ${value}`;
      }
    });
    
    fs.writeFileSync(commonFile, JSON.stringify(content, null, 2), 'utf8');
  });
  
  console.log('  ✓ Updated common.json for all languages');
}

// Main execution
console.log('\nApplying critical fixes...\n');

fixUnusedTranslationImports();
addMissingTranslationKeys();
fixLazyLoadingWrapper();
ensureCommonKeys();

console.log('\n' + '='.repeat(80));
console.log('CRITICAL FIXES APPLIED');
console.log('='.repeat(80));
console.log('\nNext steps:');
console.log('1. Run build to verify fixes');
console.log('2. Complete actual translations for marked strings');
console.log('3. Test language switching functionality');
console.log('4. Perform final validation');
console.log('='.repeat(80));