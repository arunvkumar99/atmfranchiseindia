#!/usr/bin/env node

/**
 * Cleanup script to remove duplicate translation systems
 * This will remove all old translation files and update imports
 */

const fs = require('fs').promises;
const path = require('path');

const DUPLICATE_TRANSLATION_FILES = [
  'src/lib/completeTMS.ts',
  'src/lib/comprehensiveTranslationSystem.ts',
  'src/lib/enterpriseTranslationSystem.ts',
  'src/lib/globalTranslationSystem.ts',
  'src/lib/instantTranslationSystem.ts',
  'src/lib/multiLanguageSystem.ts',
  'src/lib/preTranslatedSubsites.ts',
  'src/lib/robustTranslationSystem.ts',
  'src/lib/staticTranslationManager.ts',
  'src/lib/staticTranslations.ts',
  'src/lib/unifiedTranslationSystem.ts',
  'src/lib/initUnifiedTranslation.ts',
  'src/lib/initialTranslationPopulation.ts',
  'src/lib/initializeTranslations.ts',
  'src/lib/translationJobRunner.ts',
  'src/lib/triggerTranslationCompletion.ts'
];

const PROJECT_ROOT = path.join(__dirname, '..');

async function removeFiles() {
  console.log('🗑️  Removing duplicate translation files...\n');
  
  let removed = 0;
  let failed = 0;
  
  for (const file of DUPLICATE_TRANSLATION_FILES) {
    const filePath = path.join(PROJECT_ROOT, file);
    
    try {
      await fs.unlink(filePath);
      console.log(`  ✅ Removed: ${file}`);
      removed++;
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`  ⏭️  Already removed: ${file}`);
      } else {
        console.error(`  ❌ Failed to remove: ${file}`);
        console.error(`     ${error.message}`);
        failed++;
      }
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`  - Removed: ${removed} files`);
  console.log(`  - Failed: ${failed} files`);
  console.log(`  - Already cleaned: ${DUPLICATE_TRANSLATION_FILES.length - removed - failed} files`);
}

async function updateImports() {
  console.log('\n🔄 Updating component imports...\n');
  
  const componentsToUpdate = [
    'src/App.tsx',
    'src/components/Header.tsx',
    'src/components/Footer.tsx',
    'src/components/FixedLanguageRouter.tsx',
    'src/components/LanguageSwitcher.tsx',
    'src/components/TranslationStatus.tsx'
  ];
  
  for (const componentPath of componentsToUpdate) {
    const fullPath = path.join(PROJECT_ROOT, componentPath);
    
    try {
      let content = await fs.readFile(fullPath, 'utf-8');
      let originalContent = content;
      
      // Remove old translation system imports
      const oldImports = [
        /import.*from ['"]@\/lib\/unifiedTranslationSystem['"];?\n?/g,
        /import.*from ['"]@\/lib\/enterpriseTranslationSystem['"];?\n?/g,
        /import.*from ['"]@\/lib\/comprehensiveTranslationSystem['"];?\n?/g,
        /import.*from ['"]@\/lib\/globalTranslationSystem['"];?\n?/g,
        /import.*from ['"]@\/lib\/instantTranslationSystem['"];?\n?/g,
        /import.*from ['"]@\/lib\/staticTranslations['"];?\n?/g,
        /import.*from ['"]@\/lib\/multiLanguageSystem['"];?\n?/g,
        /import.*from ['"]@\/lib\/robustTranslationSystem['"];?\n?/g,
      ];
      
      for (const pattern of oldImports) {
        content = content.replace(pattern, '');
      }
      
      // Replace old system calls with i18next
      content = content.replace(
        /unifiedTranslationSystem\.(switchToLanguage|getCurrentLanguage|translate)/g,
        'i18n.changeLanguage'
      );
      
      content = content.replace(
        /enterpriseTranslationSystem\.(switchLanguage|getLanguage)/g,
        'i18n.changeLanguage'
      );
      
      // Add i18next import if needed and file was modified
      if (content !== originalContent) {
        if (!content.includes("from 'react-i18next'") && !content.includes('from "react-i18next"')) {
          // Add import at the top after React imports
          const reactImportMatch = content.match(/(import.*from ['"]react['"].*\n)/);
          if (reactImportMatch) {
            const insertPosition = reactImportMatch.index + reactImportMatch[0].length;
            content = content.slice(0, insertPosition) + 
                     "import { useTranslation } from 'react-i18next';\n" +
                     content.slice(insertPosition);
          }
        }
        
        await fs.writeFile(fullPath, content, 'utf-8');
        console.log(`  ✅ Updated: ${componentPath}`);
      } else {
        console.log(`  ⏭️  No changes needed: ${componentPath}`);
      }
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`  ⚠️  File not found: ${componentPath}`);
      } else {
        console.error(`  ❌ Failed to update: ${componentPath}`);
        console.error(`     ${error.message}`);
      }
    }
  }
}

async function cleanupSupabaseFunctions() {
  console.log('\n🧹 Cleaning up Supabase translation functions...\n');
  
  const functionsToRemove = [
    'supabase/functions/translate',
    'supabase/functions/auto-translate-content',
    'supabase/functions/auto-translate-trigger',
    'supabase/functions/batch-translate',
    'supabase/functions/batch-translate-missing',
    'supabase/functions/complete-missing-translations',
    'supabase/functions/fix-translation-completion'
  ];
  
  for (const funcPath of functionsToRemove) {
    const fullPath = path.join(PROJECT_ROOT, funcPath);
    
    try {
      // Remove directory and all contents
      await fs.rm(fullPath, { recursive: true, force: true });
      console.log(`  ✅ Removed: ${funcPath}`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log(`  ⏭️  Already removed: ${funcPath}`);
      } else {
        console.error(`  ❌ Failed to remove: ${funcPath}`);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting translation system cleanup...\n');
  console.log('=' .repeat(50));
  
  await removeFiles();
  await updateImports();
  await cleanupSupabaseFunctions();
  
  console.log('\n' + '='.repeat(50));
  console.log('✨ Cleanup completed!');
  console.log('\nNext steps:');
  console.log('1. Run "npm run dev" to test the application');
  console.log('2. Run "npm run translate:all" to generate translations');
  console.log('3. Update remaining components to use useTranslation hook');
  console.log('=' .repeat(50) + '\n');
}

// Run the cleanup
main().catch(console.error);