#!/usr/bin/env node

/**
 * Scan all React components for hardcoded text that should be translated
 * This identifies text that needs to be replaced with t() calls
 */

const fs = require('fs').promises;
const path = require('path');

// Patterns that indicate hardcoded text
const TEXT_PATTERNS = [
  />([A-Z][^<>]{10,})</g,  // Text starting with capital letter in JSX
  /title="([^"]+)"/g,      // Title attributes
  /alt="([^"]+)"/g,        // Alt attributes
  /placeholder="([^"]+)"/g, // Placeholder attributes
  /label="([^"]+)"/g,      // Label attributes
  /\{["']([A-Z][^"']{10,})["']\}/g, // String literals in JSX expressions
];

// Files/folders to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.test.',
  '.spec.',
  'Fixed.tsx',
  '.bak',
  'TranslationTest',
  'TestTranslation',
  'LanguageSwitchTest',
  'DesignAudit',
  'VisualShowcase'
];

// Common UI text that definitely needs translation
const COMMON_UI_TEXT = [
  'Submit', 'Cancel', 'Save', 'Delete', 'Edit', 'Add', 'Remove',
  'Loading', 'Please wait', 'Error', 'Success', 'Warning',
  'Required', 'Optional', 'Select', 'Choose', 'Search',
  'Next', 'Previous', 'Back', 'Continue', 'Finish',
  'Yes', 'No', 'OK', 'Apply', 'Reset', 'Clear',
  'Download', 'Upload', 'Export', 'Import', 'Print',
  'Login', 'Logout', 'Register', 'Sign up', 'Sign in'
];

async function scanFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    
    // Check if file uses translations
    const usesTranslation = content.includes('useTranslation');
    const tCallCount = (content.match(/\bt\(['"]/g) || []).length;
    
    // Find hardcoded text
    const hardcodedTexts = new Set();
    
    // Check for JSX text content
    const jsxTextRegex = />([^<>{}\n]+)</g;
    let match;
    while ((match = jsxTextRegex.exec(content)) !== null) {
      const text = match[1].trim();
      // Filter out obvious non-translatable content
      if (text && 
          text.length > 3 && 
          !/^\s*$/.test(text) && 
          !/^[\d\s\-+.*/%]+$/.test(text) && // Not just numbers/symbols
          !/^(https?:\/\/|www\.)/.test(text) && // Not URLs
          !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(text) && // Not emails
          !text.startsWith('{') && // Not JSX expressions
          !text.includes('₹')) { // Skip currency amounts
        hardcodedTexts.add(text);
      }
    }
    
    // Check for string props
    const propRegex = /(?:title|alt|placeholder|label|aria-label)=["']([^"']+)["']/g;
    while ((match = propRegex.exec(content)) !== null) {
      const text = match[1].trim();
      if (text && text.length > 3 && !/^[\d\s\-+.*/%]+$/.test(text)) {
        hardcodedTexts.add(text);
      }
    }
    
    // Check for common UI text - only in actual JSX strings or props
    for (const uiText of COMMON_UI_TEXT) {
      // More precise patterns to find actual UI text usage
      const patterns = [
        new RegExp(`>\\s*${uiText}\\s*<`, 'g'), // In JSX content
        new RegExp(`["']${uiText}["']`, 'g'), // In string literals
        new RegExp(`(?:title|alt|placeholder|label|aria-label)=["'].*${uiText}.*["']`, 'g'), // In props
        new RegExp(`\\{\\s*["']${uiText}["']\\s*\\}`, 'g'), // In JSX expressions
      ];
      
      let foundInUI = false;
      for (const pattern of patterns) {
        if (pattern.test(content)) {
          foundInUI = true;
          break;
        }
      }
      
      // Only add if found in UI context and not already translated
      if (foundInUI && !content.includes(`t('${uiText.toLowerCase()}')`)) {
        hardcodedTexts.add(uiText);
      }
    }
    
    return {
      filePath,
      usesTranslation,
      tCallCount,
      hardcodedCount: hardcodedTexts.size,
      hardcodedSamples: Array.from(hardcodedTexts).slice(0, 10)
    };
    
  } catch (error) {
    return {
      filePath,
      error: error.message
    };
  }
}

async function scanDirectory(dir, results = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    // Skip if matches skip pattern
    if (SKIP_PATTERNS.some(pattern => fullPath.includes(pattern))) {
      continue;
    }
    
    if (entry.isDirectory()) {
      await scanDirectory(fullPath, results);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.jsx'))) {
      const result = await scanFile(fullPath);
      if (result.hardcodedCount > 0 || result.usesTranslation) {
        results.push(result);
      }
    }
  }
  
  return results;
}

async function generateReport() {
  console.log('🔍 SCANNING FOR HARDCODED TEXT IN COMPONENTS\n');
  console.log('=' .repeat(80));
  
  // Scan src directory
  const srcDir = path.join(__dirname, '..', 'src');
  const results = await scanDirectory(srcDir);
  
  // Sort by hardcoded count
  results.sort((a, b) => (b.hardcodedCount || 0) - (a.hardcodedCount || 0));
  
  // Statistics
  const totalFiles = results.length;
  const filesUsingTranslation = results.filter(r => r.usesTranslation).length;
  const filesWithHardcoded = results.filter(r => r.hardcodedCount > 0).length;
  const totalHardcoded = results.reduce((sum, r) => sum + (r.hardcodedCount || 0), 0);
  const totalTCalls = results.reduce((sum, r) => sum + (r.tCallCount || 0), 0);
  
  console.log('\n📊 OVERALL STATISTICS:\n');
  console.log(`Total component files scanned: ${totalFiles}`);
  console.log(`Files using translation system: ${filesUsingTranslation} (${Math.round(filesUsingTranslation/totalFiles*100)}%)`);
  console.log(`Files with hardcoded text: ${filesWithHardcoded}`);
  console.log(`Total hardcoded text instances: ${totalHardcoded}`);
  console.log(`Total t() function calls: ${totalTCalls}`);
  console.log(`Translation coverage: ${Math.round(totalTCalls/(totalTCalls+totalHardcoded)*100)}%`);
  
  // Most problematic files
  console.log('\n⚠️ FILES WITH MOST HARDCODED TEXT:\n');
  const topOffenders = results.filter(r => r.hardcodedCount > 0).slice(0, 10);
  
  for (const file of topOffenders) {
    const relPath = path.relative(path.join(__dirname, '..'), file.filePath);
    console.log(`\n${relPath}:`);
    console.log(`  Hardcoded texts: ${file.hardcodedCount}`);
    console.log(`  Using translations: ${file.usesTranslation ? 'Yes' : 'No'}`);
    console.log(`  t() calls: ${file.tCallCount}`);
    
    if (file.hardcodedSamples.length > 0) {
      console.log(`  Examples:`);
      file.hardcodedSamples.slice(0, 3).forEach(text => {
        console.log(`    - "${text.substring(0, 60)}${text.length > 60 ? '...' : ''}"`);
      });
    }
  }
  
  // Pages vs Components breakdown
  const pages = results.filter(r => r.filePath.includes('pages'));
  const components = results.filter(r => r.filePath.includes('components'));
  
  console.log('\n📁 BREAKDOWN BY TYPE:\n');
  console.log('Pages:');
  console.log(`  Total: ${pages.length}`);
  console.log(`  With hardcoded text: ${pages.filter(p => p.hardcodedCount > 0).length}`);
  console.log(`  Using translations: ${pages.filter(p => p.usesTranslation).length}`);
  
  console.log('\nComponents:');
  console.log(`  Total: ${components.length}`);
  console.log(`  With hardcoded text: ${components.filter(c => c.hardcodedCount > 0).length}`);
  console.log(`  Using translations: ${components.filter(c => c.usesTranslation).length}`);
  
  // Generate fix list
  const fixList = results
    .filter(r => r.hardcodedCount > 0)
    .map(r => ({
      file: path.relative(path.join(__dirname, '..'), r.filePath),
      hardcoded: r.hardcodedCount,
      samples: r.hardcodedSamples
    }));
  
  // Save to JSON for automated fixing
  const reportPath = path.join(__dirname, '..', 'hardcoded-text-report.json');
  await fs.writeFile(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    statistics: {
      totalFiles,
      filesUsingTranslation,
      filesWithHardcoded,
      totalHardcoded,
      totalTCalls,
      coveragePercent: Math.round(totalTCalls/(totalTCalls+totalHardcoded)*100)
    },
    filesToFix: fixList
  }, null, 2));
  
  console.log(`\n📄 Detailed report saved to: hardcoded-text-report.json`);
  console.log('\n✅ Scan complete!');
}

generateReport().catch(console.error);