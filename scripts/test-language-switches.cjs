const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

console.log(`${colors.cyan}🌐 Testing Language Switch Functionality...${colors.reset}\n`);

// Available languages
const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
];

// Test 1: Check if all language files exist
console.log(`${colors.blue}Test 1: Checking language file existence...${colors.reset}`);
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const missingDirs = [];
const missingFiles = [];

languages.forEach(lang => {
  const langDir = path.join(localesDir, lang.code);
  
  if (!fs.existsSync(langDir)) {
    missingDirs.push(lang.code);
    console.log(`  ${colors.red}❌ Missing directory: ${lang.code} (${lang.name})${colors.reset}`);
  } else {
    console.log(`  ${colors.green}✅ Found: ${lang.code} (${lang.name})${colors.reset}`);
    
    // Check for required namespace files
    const requiredFiles = ['common.json', 'home.json', 'forms.json', 'navigation.json', 'footer.json'];
    requiredFiles.forEach(file => {
      const filePath = path.join(langDir, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push(`${lang.code}/${file}`);
        console.log(`    ${colors.yellow}⚠ Missing file: ${file}${colors.reset}`);
      }
    });
  }
});

// Test 2: Check translation completeness
console.log(`\n${colors.blue}Test 2: Checking translation completeness...${colors.reset}`);
const enDir = path.join(localesDir, 'en');
const translationStats = {};

if (fs.existsSync(enDir)) {
  const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
  
  languages.forEach(lang => {
    if (lang.code === 'en') return;
    
    translationStats[lang.code] = {
      name: lang.name,
      total: 0,
      translated: 0,
      percentage: 0
    };
    
    enFiles.forEach(file => {
      const enPath = path.join(enDir, file);
      const langPath = path.join(localesDir, lang.code, file);
      
      if (fs.existsSync(langPath)) {
        const enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
        const langContent = JSON.parse(fs.readFileSync(langPath, 'utf8'));
        
        const enKeys = countKeys(enContent);
        const langKeys = countKeys(langContent);
        
        translationStats[lang.code].total += enKeys;
        translationStats[lang.code].translated += langKeys;
      }
    });
    
    if (translationStats[lang.code].total > 0) {
      translationStats[lang.code].percentage = Math.round(
        (translationStats[lang.code].translated / translationStats[lang.code].total) * 100
      );
    }
    
    const percentage = translationStats[lang.code].percentage;
    const color = percentage >= 90 ? colors.green : percentage >= 70 ? colors.yellow : colors.red;
    const icon = percentage >= 90 ? '✅' : percentage >= 70 ? '⚠️' : '❌';
    
    console.log(`  ${icon} ${lang.code} (${lang.name}): ${color}${percentage}%${colors.reset} (${translationStats[lang.code].translated}/${translationStats[lang.code].total} keys)`);
  });
}

// Test 3: Check key consistency
console.log(`\n${colors.blue}Test 3: Checking key consistency across languages...${colors.reset}`);
const inconsistencies = [];

const enFiles = fs.readdirSync(enDir).filter(f => f.endsWith('.json'));
enFiles.forEach(file => {
  const enPath = path.join(enDir, file);
  const enKeys = getAllKeys(JSON.parse(fs.readFileSync(enPath, 'utf8')));
  
  languages.forEach(lang => {
    if (lang.code === 'en') return;
    
    const langPath = path.join(localesDir, lang.code, file);
    if (fs.existsSync(langPath)) {
      const langKeys = getAllKeys(JSON.parse(fs.readFileSync(langPath, 'utf8')));
      
      const missingKeys = enKeys.filter(key => !langKeys.includes(key));
      const extraKeys = langKeys.filter(key => !enKeys.includes(key));
      
      if (missingKeys.length > 0) {
        inconsistencies.push({
          lang: lang.code,
          file,
          type: 'missing',
          keys: missingKeys
        });
      }
      
      if (extraKeys.length > 0) {
        inconsistencies.push({
          lang: lang.code,
          file,
          type: 'extra',
          keys: extraKeys
        });
      }
    }
  });
});

if (inconsistencies.length === 0) {
  console.log(`  ${colors.green}✅ All languages have consistent keys${colors.reset}`);
} else {
  inconsistencies.forEach(issue => {
    const icon = issue.type === 'missing' ? '❌' : '⚠️';
    console.log(`  ${icon} ${issue.lang}/${issue.file}: ${issue.type} ${issue.keys.length} keys`);
    if (issue.keys.length <= 5) {
      console.log(`    Keys: ${issue.keys.join(', ')}`);
    }
  });
}

// Test 4: Check for common translation issues
console.log(`\n${colors.blue}Test 4: Checking for common translation issues...${colors.reset}`);
const issues = [];

languages.forEach(lang => {
  const langDir = path.join(localesDir, lang.code);
  if (!fs.existsSync(langDir)) return;
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.json'));
  
  files.forEach(file => {
    const filePath = path.join(langDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    // Check for untranslated English text in non-English files
    if (lang.code !== 'en') {
      const englishTexts = findEnglishTexts(json);
      if (englishTexts.length > 0) {
        issues.push({
          lang: lang.code,
          file,
          issue: 'Contains untranslated English text',
          count: englishTexts.length
        });
      }
    }
    
    // Check for empty strings
    const emptyStrings = findEmptyStrings(json);
    if (emptyStrings.length > 0) {
      issues.push({
        lang: lang.code,
        file,
        issue: 'Contains empty strings',
        count: emptyStrings.length
      });
    }
    
    // Check for placeholder issues
    const placeholderIssues = findPlaceholderIssues(json);
    if (placeholderIssues.length > 0) {
      issues.push({
        lang: lang.code,
        file,
        issue: 'Placeholder format issues',
        count: placeholderIssues.length
      });
    }
  });
});

if (issues.length === 0) {
  console.log(`  ${colors.green}✅ No common translation issues found${colors.reset}`);
} else {
  issues.forEach(issue => {
    console.log(`  ${colors.yellow}⚠ ${issue.lang}/${issue.file}: ${issue.issue} (${issue.count} instances)${colors.reset}`);
  });
}

// Test 5: Generate language switch test component
console.log(`\n${colors.blue}Test 5: Creating language switch test component...${colors.reset}`);

const testComponentContent = `import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LanguageSwitchTest = () => {
  const { t, i18n } = useTranslation(['common', 'home', 'forms']);
  const [testResults, setTestResults] = useState<any[]>([]);

  const languages = ${JSON.stringify(languages, null, 2)};

  const testLanguageSwitch = async (langCode: string) => {
    try {
      await i18n.changeLanguage(langCode);
      
      // Test if language changed
      const currentLang = i18n.language;
      const success = currentLang === langCode;
      
      // Test if translations are loaded
      const testKeys = [
        'common:buttons.submit',
        'home:hero.title',
        'forms:fields.email'
      ];
      
      const translations = testKeys.map(key => ({
        key,
        value: t(key),
        isTranslated: t(key) !== key
      }));
      
      const result = {
        language: langCode,
        success,
        currentLang,
        translations,
        timestamp: new Date().toISOString()
      };
      
      setTestResults(prev => [...prev, result]);
      
      return success;
    } catch (error) {
      console.error(\`Failed to switch to \${langCode}:\`, error);
      return false;
    }
  };

  const runAllTests = async () => {
    setTestResults([]);
    
    for (const lang of languages) {
      await testLanguageSwitch(lang.code);
      // Wait a bit between switches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Language Switch Test Suite</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {languages.map(lang => (
            <Button
              key={lang.code}
              onClick={() => testLanguageSwitch(lang.code)}
              variant={i18n.language === lang.code ? 'default' : 'outline'}
              size="sm"
            >
              {lang.nativeName} ({lang.code})
            </Button>
          ))}
        </div>
        
        <Button onClick={runAllTests} className="w-full">
          Run All Language Tests
        </Button>
        
        {testResults.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={\`p-3 rounded border \${
                  result.success ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
                }\`}
              >
                <div className="font-medium">
                  {result.language}: {result.success ? '✅ Success' : '❌ Failed'}
                </div>
                <div className="text-sm text-gray-600">
                  Current: {result.currentLang}
                </div>
                <div className="text-xs mt-1">
                  {result.translations.map((t: any) => (
                    <div key={t.key}>
                      {t.key}: {t.isTranslated ? '✅' : '❌'} {t.value.substring(0, 30)}...
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 p-4 bg-blue-50 rounded">
          <h4 className="font-semibold mb-2">Current Language Info:</h4>
          <div className="text-sm space-y-1">
            <div>Language: {i18n.language}</div>
            <div>Available: {i18n.languages.join(', ')}</div>
            <div>Direction: {i18n.dir()}</div>
            <div>
              Sample Translation: {t('common:buttons.submit', 'Submit')}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageSwitchTest;
`;

const testComponentPath = path.join(__dirname, '..', 'src', 'components', 'LanguageSwitchTest.tsx');
fs.writeFileSync(testComponentPath, testComponentContent);
console.log(`  ${colors.green}✅ Created LanguageSwitchTest.tsx component${colors.reset}`);

// Helper functions
function countKeys(obj, count = 0) {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count = countKeys(obj[key], count);
    } else {
      count++;
    }
  }
  return count;
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

function findEnglishTexts(obj, texts = []) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Check if text looks like English (simple heuristic)
      if (/^[A-Za-z\s.,!?'"-]+$/.test(obj[key]) && obj[key].length > 10) {
        texts.push(obj[key]);
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      findEnglishTexts(obj[key], texts);
    }
  }
  return texts;
}

function findEmptyStrings(obj, empties = [], path = '') {
  for (const key in obj) {
    const fullPath = path ? `${path}.${key}` : key;
    if (typeof obj[key] === 'string' && obj[key].trim() === '') {
      empties.push(fullPath);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      findEmptyStrings(obj[key], empties, fullPath);
    }
  }
  return empties;
}

function findPlaceholderIssues(obj, issues = []) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Check for mismatched placeholders
      const placeholders = obj[key].match(/{{[^}]+}}/g) || [];
      placeholders.forEach(ph => {
        if (!ph.match(/^{{[a-zA-Z_][a-zA-Z0-9_]*}}$/)) {
          issues.push(`Invalid placeholder format: ${ph}`);
        }
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      findPlaceholderIssues(obj[key], issues);
    }
  }
  return issues;
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                  LANGUAGE TESTING SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

const totalLanguages = languages.length;
const availableLanguages = languages.filter(l => !missingDirs.includes(l.code)).length;
const avgCompleteness = Object.values(translationStats).reduce((sum, stat) => sum + stat.percentage, 0) / (languages.length - 1);

console.log(`${colors.green}📊 Statistics:${colors.reset}`);
console.log(`   Total Languages: ${totalLanguages}`);
console.log(`   Available: ${availableLanguages}/${totalLanguages}`);
console.log(`   Average Completeness: ${Math.round(avgCompleteness)}%`);
console.log(`   Missing Directories: ${missingDirs.length}`);
console.log(`   Missing Files: ${missingFiles.length}`);
console.log(`   Inconsistencies: ${inconsistencies.length}`);
console.log(`   Common Issues: ${issues.length}`);

console.log(`\n${colors.yellow}📝 Recommendations:${colors.reset}`);
if (avgCompleteness < 80) {
  console.log(`   • Complete translations to reach at least 80% coverage`);
}
if (inconsistencies.length > 0) {
  console.log(`   • Fix key inconsistencies across languages`);
}
if (issues.length > 0) {
  console.log(`   • Address common translation issues`);
}
console.log(`   • Test language switching in browser using LanguageSwitchTest component`);
console.log(`   • Verify RTL languages (Urdu) display correctly`);

console.log(`\n${colors.green}✅ Language testing complete!${colors.reset}\n`);