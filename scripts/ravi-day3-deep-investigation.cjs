const fs = require('fs');
const path = require('path');

// Day 3 - Deep Investigation Script by Ravi
console.log('\n=================================');
console.log('DAY 3 - CRITICAL ISSUE INVESTIGATION');
console.log('Team Lead: Ravi');
console.log('=================================\n');

// 1. Check i18n configuration
const i18nPath = path.join(__dirname, '../src/lib/i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

console.log('1. CHECKING I18N CONFIGURATION:');
console.log('--------------------------------');

// Check fallback language
const fallbackMatch = i18nContent.match(/fallbackLng:\s*['"]([^'"]+)['"]/);
console.log('Fallback Language:', fallbackMatch ? fallbackMatch[1] : 'NOT FOUND');

// Check detection order
const detectionMatch = i18nContent.match(/order:\s*\[([^\]]+)\]/);
console.log('Detection Order:', detectionMatch ? detectionMatch[1] : 'NOT FOUND');

// Check localStorage key
const localStorageMatch = i18nContent.match(/lookupLocalStorage:\s*['"]([^'"]+)['"]/);
console.log('LocalStorage Key:', localStorageMatch ? localStorageMatch[1] : 'NOT FOUND');

// 2. Check EnsureEnglishDefault component
console.log('\n2. CHECKING ENSUREENGISHDEFAULT COMPONENT:');
console.log('-------------------------------------------');
const ensurePath = path.join(__dirname, '../src/components/EnsureEnglishDefault.tsx');
if (fs.existsSync(ensurePath)) {
    const ensureContent = fs.readFileSync(ensurePath, 'utf8');
    console.log('Component exists: YES');
    console.log('Sets default to English: ', ensureContent.includes("localStorage.setItem('i18nextLng', 'en')"));
} else {
    console.log('Component exists: NO - THIS IS A PROBLEM!');
}

// 3. Check App.tsx integration
console.log('\n3. CHECKING APP.TSX INTEGRATION:');
console.log('----------------------------------');
const appPath = path.join(__dirname, '../src/App.tsx');
const appContent = fs.readFileSync(appPath, 'utf8');
console.log('EnsureEnglishDefault imported:', appContent.includes('import { EnsureEnglishDefault }'));
console.log('EnsureEnglishDefault used:', appContent.includes('<EnsureEnglishDefault />'));

// 4. Check for console errors in components
console.log('\n4. CHECKING FOR CONSOLE.ERROR STATEMENTS:');
console.log('------------------------------------------');
const srcDir = path.join(__dirname, '../src');
let errorCount = 0;
let consoleLogCount = 0;

function checkConsoleStatements(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !file.includes('node_modules')) {
            checkConsoleStatements(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const errorMatches = content.match(/console\.error/g);
            const logMatches = content.match(/console\.log/g);
            if (errorMatches) {
                errorCount += errorMatches.length;
                console.log(`Found ${errorMatches.length} console.error in ${file}`);
            }
            if (logMatches) {
                consoleLogCount += logMatches.length;
            }
        }
    });
}

checkConsoleStatements(srcDir);
console.log(`Total console.error statements: ${errorCount}`);
console.log(`Total console.log statements: ${consoleLogCount}`);

// 5. Check translation files for Tamil
console.log('\n5. CHECKING TAMIL TRANSLATION FILES:');
console.log('--------------------------------------');
const tamilDir = path.join(__dirname, '../public/locales/ta');
if (fs.existsSync(tamilDir)) {
    const tamilFiles = fs.readdirSync(tamilDir);
    console.log('Tamil translation files found:', tamilFiles.length);
    
    // Check if Tamil common.json exists and has content
    const tamilCommon = path.join(tamilDir, 'common.json');
    if (fs.existsSync(tamilCommon)) {
        const tamilContent = JSON.parse(fs.readFileSync(tamilCommon, 'utf8'));
        const keyCount = Object.keys(tamilContent).length;
        console.log(`Tamil common.json has ${keyCount} keys`);
        
        // Check if it's actually in Tamil or still English
        const sampleKey = Object.keys(tamilContent)[0];
        if (sampleKey) {
            console.log(`Sample Tamil translation: "${sampleKey}": "${tamilContent[sampleKey]}"`);
            // Simple check - if it contains Tamil script
            const hasTamilScript = /[\u0B80-\u0BFF]/.test(JSON.stringify(tamilContent));
            console.log('Contains Tamil script:', hasTamilScript);
        }
    }
}

// 6. Check for potential issues in translation hooks
console.log('\n6. CHECKING TRANSLATION HOOK USAGE:');
console.log('-------------------------------------');
const hooksDir = path.join(__dirname, '../src/hooks');
if (fs.existsSync(hooksDir)) {
    const hookFiles = fs.readdirSync(hooksDir);
    hookFiles.forEach(file => {
        if (file.includes('Translation') || file.includes('i18n')) {
            console.log(`Found translation hook: ${file}`);
            const hookPath = path.join(hooksDir, file);
            const hookContent = fs.readFileSync(hookPath, 'utf8');
            
            // Check for potential issues
            if (hookContent.includes('localStorage')) {
                console.log(`  - Uses localStorage`);
            }
            if (hookContent.includes('changeLanguage')) {
                console.log(`  - Can change language`);
            }
            if (hookContent.includes('ta')) {
                console.log(`  - References Tamil (ta) language`);
            }
        }
    });
}

// 7. Check package.json for i18n dependencies
console.log('\n7. CHECKING I18N DEPENDENCIES:');
console.log('--------------------------------');
const packagePath = path.join(__dirname, '../package.json');
const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const i18nDeps = Object.keys({...packageContent.dependencies, ...packageContent.devDependencies})
    .filter(dep => dep.includes('i18n'));
console.log('i18n related dependencies:', i18nDeps);

// 8. Summary and Recommendations
console.log('\n=================================');
console.log('CRITICAL ISSUES FOUND:');
console.log('=================================');

const issues = [];

if (fallbackMatch && fallbackMatch[1] !== 'en') {
    issues.push('1. Fallback language is NOT English');
}

if (errorCount > 0) {
    issues.push(`2. Found ${errorCount} console.error statements that may be causing errors`);
}

if (consoleLogCount > 20) {
    issues.push(`3. Found ${consoleLogCount} console.log statements (should be removed for production)`);
}

if (!fs.existsSync(ensurePath)) {
    issues.push('4. EnsureEnglishDefault component is missing!');
}

if (detectionMatch && detectionMatch[1].includes('localStorage') && detectionMatch[1].indexOf('localStorage') === 0) {
    issues.push('5. localStorage is checked first for language - may be set to Tamil');
}

if (issues.length === 0) {
    console.log('No critical configuration issues found.');
    console.log('The problem may be in browser localStorage or runtime behavior.');
} else {
    issues.forEach(issue => console.log(issue));
}

console.log('\n=================================');
console.log('RECOMMENDED FIXES:');
console.log('=================================');
console.log('1. Clear localStorage in browser to reset language preference');
console.log('2. Ensure fallbackLng is set to "en" in i18n.ts');
console.log('3. Remove or comment out console.error statements');
console.log('4. Test with incognito/private browser window');
console.log('5. Check browser console for actual runtime errors');

console.log('\n=== Investigation Complete ===\n');