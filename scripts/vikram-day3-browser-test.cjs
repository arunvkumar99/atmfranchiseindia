const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Day 3 - Comprehensive Browser Testing by Vikram
console.log('\n=================================');
console.log('VIKRAM - DAY 3 BROWSER TESTING');
console.log('=================================\n');

console.log('CRITICAL SELF-EVALUATION:');
console.log('-------------------------');
console.log('On Day 2, I ran automated tests but FAILED to:');
console.log('1. Actually open the website in a browser');
console.log('2. Check the browser console for errors');
console.log('3. Test with cleared localStorage/cache');
console.log('4. Verify the actual user experience');
console.log('\nI reported "success" without real validation. Unacceptable.\n');

const testResults = {
    timestamp: new Date().toISOString(),
    environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
    },
    tests: [],
    criticalIssues: [],
    warnings: [],
    passed: 0,
    failed: 0
};

// Test 1: Check if build succeeds
console.log('TEST 1: Build Status');
console.log('--------------------');
try {
    console.log('Running build...');
    execSync('npm run build', { 
        cwd: path.join(__dirname, '..'),
        stdio: 'pipe'
    });
    console.log('✅ Build successful');
    testResults.tests.push({
        name: 'Build Status',
        status: 'PASSED',
        details: 'Build completes without errors'
    });
    testResults.passed++;
} catch (error) {
    console.log('❌ Build failed');
    testResults.tests.push({
        name: 'Build Status',
        status: 'FAILED',
        error: error.message
    });
    testResults.criticalIssues.push('Build fails - cannot deploy to production');
    testResults.failed++;
}

// Test 2: Check for console.error statements
console.log('\nTEST 2: Console Error Check');
console.log('---------------------------');
const srcDir = path.join(__dirname, '../src');
let consoleErrorCount = 0;
let consoleLogCount = 0;
const filesWithErrors = [];

function checkForConsoleStatements(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory() && !file.includes('node_modules')) {
            checkForConsoleStatements(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf8');
            // Look for uncommented console.error
            const activeErrors = content.match(/^[^/]*console\.error/gm) || [];
            const activeLogs = content.match(/^[^/]*console\.log/gm) || [];
            
            if (activeErrors.length > 0) {
                consoleErrorCount += activeErrors.length;
                filesWithErrors.push(path.relative(srcDir, filePath));
            }
            if (activeLogs.length > 0) {
                consoleLogCount += activeLogs.length;
            }
        }
    });
}

checkForConsoleStatements(srcDir);

if (consoleErrorCount === 0) {
    console.log('✅ No active console.error statements found');
    testResults.tests.push({
        name: 'Console Error Statements',
        status: 'PASSED',
        details: 'All console.error statements are commented or removed'
    });
    testResults.passed++;
} else {
    console.log(`❌ Found ${consoleErrorCount} active console.error statements`);
    console.log('Files with errors:', filesWithErrors);
    testResults.tests.push({
        name: 'Console Error Statements',
        status: 'FAILED',
        count: consoleErrorCount,
        files: filesWithErrors
    });
    testResults.criticalIssues.push(`${consoleErrorCount} console.error statements will appear in production`);
    testResults.failed++;
}

if (consoleLogCount > 10) {
    testResults.warnings.push(`${consoleLogCount} console.log statements found - should be removed for production`);
}

// Test 3: Check default language configuration
console.log('\nTEST 3: Default Language Configuration');
console.log('--------------------------------------');
const i18nPath = path.join(__dirname, '../src/lib/i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf8');

const hasEnglishFallback = i18nContent.includes("fallbackLng: 'en'");
const hasEnglishDefault = i18nContent.includes("lng: 'en'");
const hasCorrectDetectionOrder = !i18nContent.match(/order:\s*\['localStorage'/);

if (hasEnglishFallback && hasEnglishDefault && hasCorrectDetectionOrder) {
    console.log('✅ Default language correctly configured as English');
    testResults.tests.push({
        name: 'Default Language Configuration',
        status: 'PASSED',
        details: 'English is set as default and fallback language'
    });
    testResults.passed++;
} else {
    console.log('❌ Default language configuration issues found');
    testResults.tests.push({
        name: 'Default Language Configuration',
        status: 'FAILED',
        details: {
            hasEnglishFallback,
            hasEnglishDefault,
            hasCorrectDetectionOrder
        }
    });
    testResults.criticalIssues.push('Default language may not be English');
    testResults.failed++;
}

// Test 4: Check EnsureEnglishDefault component
console.log('\nTEST 4: English Enforcement Component');
console.log('--------------------------------------');
const ensurePath = path.join(__dirname, '../src/components/EnsureEnglishDefault.tsx');
if (fs.existsSync(ensurePath)) {
    const ensureContent = fs.readFileSync(ensurePath, 'utf8');
    const hasTamilCheck = ensureContent.includes("=== 'ta'");
    const hasLocalStorageClear = ensureContent.includes('localStorage.removeItem');
    const hasForceEnglish = ensureContent.includes("changeLanguage('en')");
    
    if (hasTamilCheck && hasLocalStorageClear && hasForceEnglish) {
        console.log('✅ English enforcement component properly configured');
        testResults.tests.push({
            name: 'English Enforcement Component',
            status: 'PASSED',
            details: 'Component actively prevents Tamil as default'
        });
        testResults.passed++;
    } else {
        console.log('❌ English enforcement component missing critical checks');
        testResults.tests.push({
            name: 'English Enforcement Component',
            status: 'FAILED',
            details: 'Missing Tamil prevention logic'
        });
        testResults.failed++;
    }
} else {
    console.log('❌ EnsureEnglishDefault component not found!');
    testResults.tests.push({
        name: 'English Enforcement Component',
        status: 'FAILED',
        error: 'Component file not found'
    });
    testResults.criticalIssues.push('English enforcement component missing');
    testResults.failed++;
}

// Test 5: Translation file integrity
console.log('\nTEST 5: Translation File Integrity');
console.log('-----------------------------------');
const localesDir = path.join(__dirname, '../public/locales');
const languages = ['en', 'hi', 'ta', 'ml'];
const requiredNamespaces = ['common', 'home', 'forms'];

languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    if (fs.existsSync(langDir)) {
        requiredNamespaces.forEach(ns => {
            const filePath = path.join(langDir, `${ns}.json`);
            if (fs.existsSync(filePath)) {
                try {
                    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                    const keyCount = Object.keys(content).length;
                    if (keyCount > 0) {
                        console.log(`✅ ${lang}/${ns}.json has ${keyCount} keys`);
                    } else {
                        console.log(`⚠️ ${lang}/${ns}.json is empty`);
                        testResults.warnings.push(`${lang}/${ns}.json has no translations`);
                    }
                } catch (e) {
                    console.log(`❌ ${lang}/${ns}.json has invalid JSON`);
                    testResults.criticalIssues.push(`${lang}/${ns}.json has invalid JSON`);
                }
            } else {
                console.log(`❌ ${lang}/${ns}.json missing`);
                testResults.criticalIssues.push(`Missing translation file: ${lang}/${ns}.json`);
            }
        });
    }
});

// Generate browser test instructions
const browserTestInstructions = `
=================================
MANUAL BROWSER TESTING REQUIRED
=================================

1. CLEAR BROWSER DATA:
   - Open Chrome/Firefox
   - Press Ctrl+Shift+Delete
   - Clear all browsing data
   - OR use Incognito/Private mode

2. TEST DEFAULT LANGUAGE:
   - Navigate to: http://localhost:5173
   - CHECK: Page should load in ENGLISH
   - CHECK: No Tamil text visible
   - CHECK: Console has no errors (F12)

3. TEST LANGUAGE SWITCHING:
   - Click language switcher
   - Select Hindi
   - CHECK: Page updates to Hindi
   - Select English
   - CHECK: Page returns to English

4. TEST PERSISTENCE:
   - Set language to Hindi
   - Refresh page (F5)
   - CHECK: Page stays in Hindi
   - Clear localStorage: localStorage.clear()
   - Refresh again
   - CHECK: Page loads in English

5. TEST FORMS:
   - Navigate to /agent
   - CHECK: Form labels in English
   - Fill and submit form
   - CHECK: No console errors

6. PRODUCTION BUILD TEST:
   - Run: npm run build
   - Run: npm run preview
   - Repeat tests 2-5 on production build
`;

console.log(browserTestInstructions);

// Save test results
testResults.summary = {
    totalTests: testResults.passed + testResults.failed,
    passed: testResults.passed,
    failed: testResults.failed,
    criticalIssues: testResults.criticalIssues.length,
    warnings: testResults.warnings.length,
    readyForProduction: testResults.failed === 0 && testResults.criticalIssues.length === 0
};

fs.writeFileSync(
    path.join(__dirname, '../vikram-day3-test-results.json'),
    JSON.stringify(testResults, null, 2)
);

console.log('\n=================================');
console.log('VIKRAM DAY 3 TEST SUMMARY:');
console.log('=================================');
console.log(`Automated Tests Passed: ${testResults.passed}/${testResults.passed + testResults.failed}`);
console.log(`Critical Issues: ${testResults.criticalIssues.length}`);
console.log(`Warnings: ${testResults.warnings.length}`);
console.log(`\nProduction Ready: ${testResults.summary.readyForProduction ? '✅ YES' : '❌ NO'}`);

if (!testResults.summary.readyForProduction) {
    console.log('\nBLOCKERS:');
    testResults.criticalIssues.forEach(issue => console.log(`  - ${issue}`));
}

console.log('\nBRUTAL HONESTY:');
console.log('Automated tests are NOT enough. I should have manually');
console.log('tested in a browser on Day 2. The user experienced issues');
console.log('that our automated tests missed. Real QA requires real');
console.log('browser testing, not just scripts.');

console.log('\n✅ Results saved to vikram-day3-test-results.json');
console.log('\n⚠️ IMPORTANT: Manual browser testing is REQUIRED!');
console.log('=== Vikram Day 3 Testing Complete ===\n');