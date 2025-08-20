/**
 * Arjun's Day 4 Task - Fix Console Errors and Hardcoded Text
 * RAVI WILL VERIFY EVERYTHING
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('ARJUN - DAY 4 CONSOLE ERROR AND HARDCODED TEXT FIX');
console.log('='.repeat(80));

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');

const results = {
    timestamp: new Date().toISOString(),
    consoleErrorsFixed: [],
    hardcodedTextFixed: [],
    filesModified: [],
    verificationReport: {}
};

// Step 1: Fix console.error statements
console.log('\n🔧 FIXING CONSOLE.ERROR STATEMENTS');
console.log('-'.repeat(50));

function fixConsoleErrors(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
            fixConsoleErrors(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            let modified = false;
            
            // Pattern 1: Wrap with DEV check
            content = content.replace(
                /console\.error\((.*?)\);/g,
                (match, args) => {
                    if (!match.includes('import.meta.env.DEV')) {
                        modified = true;
                        results.consoleErrorsFixed.push({
                            file: filePath.replace(projectRoot, ''),
                            original: match,
                            fixed: `if (import.meta.env.DEV) { console.error(${args}); }`
                        });
                        return `if (import.meta.env.DEV) { console.error(${args}); }`;
                    }
                    return match;
                }
            );
            
            // Pattern 2: Multi-line console.error
            content = content.replace(
                /console\.error\(([\s\S]*?)\);/g,
                (match, args) => {
                    if (!match.includes('import.meta.env.DEV') && match.includes('\n')) {
                        modified = true;
                        results.consoleErrorsFixed.push({
                            file: filePath.replace(projectRoot, ''),
                            type: 'multi-line'
                        });
                        return `if (import.meta.env.DEV) {\n  console.error(${args});\n}`;
                    }
                    return match;
                }
            );
            
            if (modified) {
                fs.writeFileSync(filePath, content);
                results.filesModified.push(filePath.replace(projectRoot, ''));
            }
        }
    });
}

// Step 2: Extract hardcoded text
console.log('\n🔧 EXTRACTING HARDCODED TEXT');
console.log('-'.repeat(50));

const extractedTranslations = {
    common: {},
    forms: {},
    components: {}
};

function extractHardcodedText(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
            extractHardcodedText(filePath);
        } else if (file.endsWith('.tsx')) {
            let content = fs.readFileSync(filePath, 'utf8');
            const originalContent = content;
            let modified = false;
            
            // Check if useTranslation is imported
            if (!content.includes('useTranslation')) {
                // Add import
                content = `import { useTranslation } from 'react-i18next';\n${content}`;
                modified = true;
            }
            
            // Add useTranslation hook if not present
            if (content.includes('export default function') || content.includes('export function')) {
                const functionMatch = content.match(/(export (?:default )?function \w+\([^)]*\) {)/);
                if (functionMatch && !content.includes('const { t }')) {
                    const insertPos = content.indexOf(functionMatch[0]) + functionMatch[0].length;
                    content = content.slice(0, insertPos) + '\n  const { t } = useTranslation();' + content.slice(insertPos);
                    modified = true;
                }
            }
            
            // Extract hardcoded text from JSX
            const jsxTextPattern = />([A-Z][a-z]+[\s\w]+)</g;
            let match;
            let textIndex = 0;
            
            while ((match = jsxTextPattern.exec(content)) !== null) {
                const text = match[1];
                if (text.length > 3 && 
                    !text.includes('className') && 
                    !text.includes('Component') &&
                    !text.includes('Fragment') &&
                    !text.includes('Provider')) {
                    
                    // Generate translation key
                    const componentName = path.basename(file, '.tsx').toLowerCase();
                    const key = `${componentName}.text${++textIndex}`;
                    
                    // Add to translations
                    extractedTranslations.components[key] = text;
                    
                    // Replace in content
                    const replacement = `>{t('components.${key}')}<`;
                    content = content.replace(`>${text}<`, replacement);
                    
                    results.hardcodedTextFixed.push({
                        file: filePath.replace(projectRoot, ''),
                        text: text,
                        key: `components.${key}`
                    });
                    
                    modified = true;
                }
            }
            
            if (modified) {
                fs.writeFileSync(filePath, content);
                if (!results.filesModified.includes(filePath.replace(projectRoot, ''))) {
                    results.filesModified.push(filePath.replace(projectRoot, ''));
                }
            }
        }
    });
}

// Execute fixes
console.log('\n🚀 Starting fixes...\n');

// Fix console errors
fixConsoleErrors(srcDir);
console.log(`✅ Fixed ${results.consoleErrorsFixed.length} console.error statements`);

// Extract hardcoded text
extractHardcodedText(path.join(srcDir, 'components'));
extractHardcodedText(path.join(srcDir, 'pages'));
console.log(`✅ Extracted ${results.hardcodedTextFixed.length} hardcoded texts`);

// Step 3: Update translation files with extracted text
console.log('\n📝 Updating translation files...');

const localesDir = path.join(projectRoot, 'public', 'locales');
const languages = ['en', 'hi'];

languages.forEach(lang => {
    const componentsFile = path.join(localesDir, lang, 'components.json');
    
    // Create or update components.json
    let existingTranslations = {};
    if (fs.existsSync(componentsFile)) {
        existingTranslations = JSON.parse(fs.readFileSync(componentsFile, 'utf8'));
    }
    
    // Merge with extracted translations
    Object.assign(existingTranslations, extractedTranslations.components);
    
    // Save
    fs.writeFileSync(componentsFile, JSON.stringify(existingTranslations, null, 2));
    console.log(`✅ Updated ${lang}/components.json`);
});

// Step 4: Verification
console.log('\n🔍 Running verification...');

function verifyFixes(dir) {
    let consoleErrorCount = 0;
    let hardcodedTextCount = 0;
    
    function scan(dir) {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
                scan(filePath);
            } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Check for unwrapped console.error
                const unwrappedErrors = content.match(/(?<!if \(import\.meta\.env\.DEV\) { )console\.error/g);
                if (unwrappedErrors) {
                    consoleErrorCount += unwrappedErrors.length;
                }
                
                // Check for hardcoded text
                const jsxText = content.match(/>([A-Z][a-z]+[\s\w]+)</g);
                if (jsxText) {
                    jsxText.forEach(text => {
                        const cleaned = text.replace('>', '').replace('<', '');
                        if (cleaned.length > 3 && 
                            !cleaned.includes('className') && 
                            !cleaned.includes('Component') &&
                            !cleaned.includes('Fragment')) {
                            hardcodedTextCount++;
                        }
                    });
                }
            }
        });
    }
    
    scan(dir);
    
    return { consoleErrorCount, hardcodedTextCount };
}

const verification = verifyFixes(srcDir);
results.verificationReport = verification;

// Generate report
console.log('\n' + '='.repeat(80));
console.log('ARJUN\'S DAY 4 COMPLETION REPORT');
console.log('='.repeat(80));

console.log('\n📊 RESULTS:');
console.log(`Console Errors Fixed: ${results.consoleErrorsFixed.length}`);
console.log(`Hardcoded Text Extracted: ${results.hardcodedTextFixed.length}`);
console.log(`Files Modified: ${results.filesModified.length}`);

console.log('\n✅ VERIFICATION:');
console.log(`Remaining Console Errors: ${results.verificationReport.consoleErrorCount}`);
console.log(`Remaining Hardcoded Text: ${results.verificationReport.hardcodedTextCount}`);

if (results.verificationReport.consoleErrorCount === 0 && 
    results.verificationReport.hardcodedTextCount === 0) {
    console.log('\n🎉 ALL ISSUES FIXED! Ready for Ravi\'s verification.');
} else {
    console.log('\n⚠️  Some issues remain. May need manual intervention.');
}

// Save results
fs.writeFileSync(
    path.join(projectRoot, 'arjun-day4-results.json'),
    JSON.stringify(results, null, 2)
);

console.log('\n📁 Results saved to: arjun-day4-results.json');
console.log('\nArjun signing off. Ready for Ravi\'s critical review.');