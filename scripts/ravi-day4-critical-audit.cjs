/**
 * Ravi's Day 4 Critical Audit Script
 * NO TRUST - VERIFY EVERYTHING
 */

const fs = require('fs');
const path = require('path');

console.log('='.repeat(80));
console.log('RAVI\'S DAY 4 CRITICAL AUDIT - NO TRUST POLICY');
console.log('='.repeat(80));

const projectRoot = path.resolve(__dirname, '..');
const localesDir = path.join(projectRoot, 'public', 'locales');

// Critical metrics
const results = {
    timestamp: new Date().toISOString(),
    hindiStatus: {
        totalKeys: 0,
        translatedKeys: 0,
        englishPlaceholders: 0,
        emptyValues: 0,
        percentageComplete: 0,
        suspiciousTranslations: []
    },
    componentIssues: {
        consoleErrors: [],
        untranslatedComponents: [],
        hardcodedText: []
    },
    inconsistentLabels: [],
    criticalProblems: []
};

// Step 1: Audit Hindi translations CRITICALLY
console.log('\n📊 HINDI TRANSLATION AUDIT (WITH SKEPTICISM)');
console.log('-'.repeat(50));

function auditTranslations(obj, prefix = '', lang = 'hi') {
    Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
            auditTranslations(value, fullKey, lang);
        } else if (typeof value === 'string') {
            results.hindiStatus.totalKeys++;
            
            // Check if it's actually translated
            if (value.trim() === '') {
                results.hindiStatus.emptyValues++;
                results.criticalProblems.push(`EMPTY: ${fullKey}`);
            } else if (/^[a-zA-Z0-9\s\.\,\!\?\-\_\@\#\$\%\&\*\(\)]+$/.test(value)) {
                // Only English characters - suspicious!
                results.hindiStatus.englishPlaceholders++;
                results.hindiStatus.suspiciousTranslations.push({
                    key: fullKey,
                    value: value.substring(0, 50) + (value.length > 50 ? '...' : ''),
                    issue: 'ENGLISH_ONLY'
                });
            } else {
                // Check if it contains Hindi characters
                if (/[\u0900-\u097F]/.test(value)) {
                    results.hindiStatus.translatedKeys++;
                } else {
                    results.hindiStatus.suspiciousTranslations.push({
                        key: fullKey,
                        value: value.substring(0, 50),
                        issue: 'NO_HINDI_CHARS'
                    });
                }
            }
        }
    });
}

// Load and audit all Hindi files
const hindiDir = path.join(localesDir, 'hi');
if (fs.existsSync(hindiDir)) {
    const files = fs.readdirSync(hindiDir);
    files.forEach(file => {
        if (file.endsWith('.json')) {
            try {
                const content = JSON.parse(fs.readFileSync(path.join(hindiDir, file), 'utf8'));
                console.log(`\nAuditing: ${file}`);
                auditTranslations(content, file.replace('.json', ''));
            } catch (e) {
                results.criticalProblems.push(`FAILED TO PARSE: ${file} - ${e.message}`);
            }
        }
    });
}

// Calculate real percentage
results.hindiStatus.percentageComplete = results.hindiStatus.totalKeys > 0 
    ? Math.round((results.hindiStatus.translatedKeys / results.hindiStatus.totalKeys) * 100)
    : 0;

// Step 2: Check for console errors in source files
console.log('\n🔍 SCANNING FOR CONSOLE.ERROR STATEMENTS');
console.log('-'.repeat(50));

function scanForConsoleErrors(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
            scanForConsoleErrors(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                if (line.includes('console.error') && !line.trim().startsWith('//')) {
                    results.componentIssues.consoleErrors.push({
                        file: filePath.replace(projectRoot, ''),
                        line: index + 1,
                        code: line.trim().substring(0, 100)
                    });
                }
            });
        }
    });
}

const srcDir = path.join(projectRoot, 'src');
if (fs.existsSync(srcDir)) {
    scanForConsoleErrors(srcDir);
}

// Step 3: Check for hardcoded text in components
console.log('\n🔍 SCANNING FOR HARDCODED TEXT');
console.log('-'.repeat(50));

function scanForHardcodedText(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
            scanForHardcodedText(filePath);
        } else if (file.endsWith('.tsx')) {
            const content = fs.readFileSync(filePath, 'utf8');
            
            // Look for hardcoded strings in JSX
            const jsxTextPattern = />([A-Z][a-z]+[\s\w]*)</g;
            const matches = content.match(jsxTextPattern);
            
            if (matches && matches.length > 0) {
                matches.forEach(match => {
                    // Filter out common false positives
                    const text = match.replace('>', '').replace('<', '');
                    if (text.length > 3 && 
                        !text.includes('className') && 
                        !text.includes('Component') &&
                        !text.includes('Fragment')) {
                        results.componentIssues.hardcodedText.push({
                            file: filePath.replace(projectRoot, ''),
                            text: text.substring(0, 50)
                        });
                    }
                });
            }
        }
    });
}

if (fs.existsSync(srcDir)) {
    scanForHardcodedText(path.join(srcDir, 'components'));
    scanForHardcodedText(path.join(srcDir, 'pages'));
}

// Step 4: Check for inconsistent labels
console.log('\n🔍 CHECKING LABEL CONSISTENCY');
console.log('-'.repeat(50));

const enDir = path.join(localesDir, 'en');
const hiDir = path.join(localesDir, 'hi');

if (fs.existsSync(enDir) && fs.existsSync(hiDir)) {
    const enFiles = fs.readdirSync(enDir);
    
    enFiles.forEach(file => {
        if (file.endsWith('.json')) {
            const enPath = path.join(enDir, file);
            const hiPath = path.join(hiDir, file);
            
            if (fs.existsSync(hiPath)) {
                try {
                    const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
                    const hiContent = JSON.parse(fs.readFileSync(hiPath, 'utf8'));
                    
                    // Compare keys
                    function compareKeys(enObj, hiObj, prefix = '') {
                        Object.keys(enObj).forEach(key => {
                            const fullKey = prefix ? `${prefix}.${key}` : key;
                            
                            if (!(key in hiObj)) {
                                results.inconsistentLabels.push({
                                    file: file,
                                    key: fullKey,
                                    issue: 'MISSING_IN_HINDI'
                                });
                            } else if (typeof enObj[key] === 'object' && typeof hiObj[key] === 'object') {
                                compareKeys(enObj[key], hiObj[key], fullKey);
                            }
                        });
                    }
                    
                    compareKeys(enContent, hiContent);
                } catch (e) {
                    results.criticalProblems.push(`COMPARISON FAILED: ${file} - ${e.message}`);
                }
            }
        }
    });
}

// Generate brutal truth report
console.log('\n' + '='.repeat(80));
console.log('BRUTAL TRUTH REPORT - DAY 4 CRITICAL AUDIT');
console.log('='.repeat(80));

console.log('\n📊 HINDI TRANSLATION STATUS:');
console.log(`Total Keys: ${results.hindiStatus.totalKeys}`);
console.log(`Actually Translated: ${results.hindiStatus.translatedKeys} (${results.hindiStatus.percentageComplete}%)`);
console.log(`English Placeholders: ${results.hindiStatus.englishPlaceholders}`);
console.log(`Empty Values: ${results.hindiStatus.emptyValues}`);

if (results.hindiStatus.suspiciousTranslations.length > 0) {
    console.log('\n⚠️  SUSPICIOUS "TRANSLATIONS" (First 10):');
    results.hindiStatus.suspiciousTranslations.slice(0, 10).forEach(item => {
        console.log(`  - ${item.key}: "${item.value}" [${item.issue}]`);
    });
}

console.log('\n🔴 CONSOLE ERRORS STILL ACTIVE:');
console.log(`Total: ${results.componentIssues.consoleErrors.length}`);
if (results.componentIssues.consoleErrors.length > 0) {
    console.log('First 5:');
    results.componentIssues.consoleErrors.slice(0, 5).forEach(err => {
        console.log(`  - ${err.file}:${err.line}`);
        console.log(`    ${err.code}`);
    });
}

console.log('\n📝 HARDCODED TEXT FOUND:');
console.log(`Total: ${results.componentIssues.hardcodedText.length}`);
if (results.componentIssues.hardcodedText.length > 0) {
    console.log('First 5:');
    results.componentIssues.hardcodedText.slice(0, 5).forEach(item => {
        console.log(`  - ${item.file}: "${item.text}"`);
    });
}

console.log('\n❌ INCONSISTENT LABELS:');
console.log(`Total: ${results.inconsistentLabels.length}`);
if (results.inconsistentLabels.length > 0) {
    console.log('First 5:');
    results.inconsistentLabels.slice(0, 5).forEach(item => {
        console.log(`  - ${item.file} -> ${item.key}: ${item.issue}`);
    });
}

if (results.criticalProblems.length > 0) {
    console.log('\n🚨 CRITICAL PROBLEMS:');
    results.criticalProblems.forEach(problem => {
        console.log(`  - ${problem}`);
    });
}

// RAVI'S VERDICT
console.log('\n' + '='.repeat(80));
console.log('RAVI\'S VERDICT:');
console.log('='.repeat(80));

const verdicts = [];

if (results.hindiStatus.percentageComplete < 100) {
    verdicts.push(`❌ Hindi is NOT 100% complete - only ${results.hindiStatus.percentageComplete}%`);
}

if (results.hindiStatus.englishPlaceholders > 0) {
    verdicts.push(`❌ ${results.hindiStatus.englishPlaceholders} fake "translations" are just English text`);
}

if (results.componentIssues.consoleErrors.length > 0) {
    verdicts.push(`❌ ${results.componentIssues.consoleErrors.length} console.error statements still active`);
}

if (results.componentIssues.hardcodedText.length > 0) {
    verdicts.push(`❌ ${results.componentIssues.hardcodedText.length} hardcoded text instances found`);
}

if (results.inconsistentLabels.length > 0) {
    verdicts.push(`❌ ${results.inconsistentLabels.length} inconsistent labels between EN and HI`);
}

if (verdicts.length === 0) {
    verdicts.push('✅ Everything checks out (but I\'m still skeptical)');
}

verdicts.forEach(verdict => console.log(verdict));

// Save results
fs.writeFileSync(
    path.join(projectRoot, 'ravi-day4-audit.json'),
    JSON.stringify(results, null, 2)
);

console.log('\n📁 Full audit saved to: ravi-day4-audit.json');
console.log('\n' + '='.repeat(80));
console.log('END OF CRITICAL AUDIT - TRUST NO ONE');
console.log('='.repeat(80));