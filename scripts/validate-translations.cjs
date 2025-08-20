const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

// Define allowed languages
const ALLOWED_LANGUAGES = ['hi', 'en', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Common English words that should be translated
const ENGLISH_TERMS_TO_TRANSLATE = [
  'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December',
  'Individual', 'Business', 'Agent', 'Security', 'Document', 'Uploads',
  'Enquiry', 'Job', 'Personal', 'Professional', 'Failed', 'Popular',
  'Searches', 'English', 'Translation', 'Debug', 'Validator', 'System',
  'Status', 'Dashboard', 'Review', 'Quick', 'Based', 'Above', 'Below',
  'Score', 'Metrics', 'Colors', 'Typography', 'Responsive', 'Issues',
  'Found', 'Recommended', 'Improvements', 'Palette', 'Scale', 'Mobile',
  'Tablet', 'Desktop', 'Enhance', 'Polish', 'Interactions', 'Page',
  'Not', 'Found', 'Test', 'Tests', 'Value', 'Coverage', 'Glass',
  'Morphism', 'Cards', 'Sparkle', 'States', 'Hover', 'Lift', 'Card',
  'Glow', 'Press', 'Pulse', 'Animation', 'Background', 'Effects',
  'Animated', 'Gradient', 'Shifting', 'Morphing', 'Shapes', 'Organic',
  'Monthly', 'Annual', 'ROI', 'Daily', 'Effort', 'Financial', 'Planning',
  'Economic', 'Trends', 'Bottom', 'Line', 'Website', 'Social', 'Media',
  'Advertisement', 'Event', 'Immediately', 'Within', 'Month', 'Months',
  'Just', 'Exploring', 'Retail', 'Outlet', 'Distribution', 'Call', 'Us',
  'Email', 'Location', 'Photos', 'Additional', 'Toggle', 'Sidebar',
  'Getting', 'Started', 'Start', 'Your', 'Story', 'Today', 'Potential',
  'Savings', 'Account', 'Current', 'Need', 'Facebook', 'Instagram',
  'YouTube', 'LinkedIn', 'Channel', 'Profile', 'Link', 'Position',
  'Immediate', 'Upload', 'Choose', 'Take', 'Photo', 'Use', 'Camera',
  'File', 'Options', 'More', 'Pages', 'Overall', 'Key', 'Async',
  'WhatsApp', 'Support', 'Available', 'Tell', 'Let', 'Know', 'Google',
  'Advertisement', 'Complete', 'Form', 'Submit', 'Partner', 'Franchise',
  'Corporation', 'Limited', 'Management', 'Development', 'Technology',
  'Marketing', 'Transaction', 'Investment', 'Application', 'Registration',
  'Verification', 'Authorization', 'Authentication', 'Implementation',
  'Configuration', 'Documentation', 'Administration', 'Communication',
  'Information', 'Operation', 'Organization', 'Competition', 'Distribution'
];

// Hindi characters regex
const HINDI_REGEX = /[\u0900-\u097F]/;

// Check if a string contains English words that should be translated
function containsEnglishTerms(text) {
  if (!text || typeof text !== 'string') return [];
  
  const foundTerms = [];
  const words = text.split(/\s+/);
  
  for (const word of words) {
    const cleanWord = word.replace(/[^a-zA-Z]/g, '');
    if (cleanWord.length > 2 && /^[A-Z]/.test(cleanWord)) {
      // Check if it's an English term that should be translated
      for (const term of ENGLISH_TERMS_TO_TRANSLATE) {
        if (cleanWord.toLowerCase() === term.toLowerCase()) {
          foundTerms.push(term);
          break;
        }
      }
    }
  }
  
  return foundTerms;
}

// Check if a string is mixed language (contains both English and Hindi)
function isMixedLanguage(text) {
  if (!text || typeof text !== 'string') return false;
  
  const hasHindi = HINDI_REGEX.test(text);
  const hasEnglish = /[a-zA-Z]/.test(text);
  
  // Special cases that are acceptable
  const acceptablePatterns = [
    /^₹[\d,\-\+\s]+(?:लाख|करोड़)?$/,  // Currency amounts
    /^\d+[\d\s\-\+%]*$/,                // Numbers
    /^[A-Z]{2,}$/,                       // Acronyms like ROI, ATM, WLA
    /^(?:ATM|WLA|RBI|GST|PAN|KYC|API|UI|UX|SEO|PDF|JPG|PNG|MB|GB)$/i,  // Known acronyms
  ];
  
  if (acceptablePatterns.some(pattern => pattern.test(text.trim()))) {
    return false;
  }
  
  return hasHindi && hasEnglish;
}

// Validate a single translation file
function validateTranslationFile(filePath, lang) {
  const issues = {
    englishTerms: [],
    mixedLanguage: [],
    missingTranslations: [],
    emptyValues: [],
    duplicateKeys: []
  };
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    
    const keys = new Set();
    
    function checkValue(key, value, parentKey = '') {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      
      // Check for duplicate keys
      if (keys.has(fullKey)) {
        issues.duplicateKeys.push(fullKey);
      }
      keys.add(fullKey);
      
      if (typeof value === 'object' && value !== null) {
        // Recursively check nested objects
        for (const [nestedKey, nestedValue] of Object.entries(value)) {
          checkValue(nestedKey, nestedValue, fullKey);
        }
      } else if (typeof value === 'string') {
        // Check for empty values
        if (!value.trim()) {
          issues.emptyValues.push(fullKey);
        }
        
        // For Hindi translations, check for issues
        if (lang === 'hi') {
          // Check for English terms that should be translated
          const englishTerms = containsEnglishTerms(value);
          if (englishTerms.length > 0) {
            issues.englishTerms.push({
              key: fullKey,
              value: value,
              terms: englishTerms
            });
          }
          
          // Check for mixed language
          if (isMixedLanguage(value)) {
            issues.mixedLanguage.push({
              key: fullKey,
              value: value
            });
          }
        }
      }
    }
    
    // Check all values
    for (const [key, value] of Object.entries(json)) {
      checkValue(key, value);
    }
    
  } catch (error) {
    console.error(`${colors.red}Error reading file ${filePath}: ${error.message}${colors.reset}`);
  }
  
  return issues;
}

// Compare translation files to find missing keys
function compareTranslations(enFile, targetFile, targetLang) {
  const missingKeys = [];
  
  try {
    const enContent = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    const targetContent = JSON.parse(fs.readFileSync(targetFile, 'utf8'));
    
    function compareKeys(enObj, targetObj, parentKey = '') {
      for (const key in enObj) {
        const fullKey = parentKey ? `${parentKey}.${key}` : key;
        
        if (!(key in targetObj)) {
          missingKeys.push(fullKey);
        } else if (typeof enObj[key] === 'object' && enObj[key] !== null) {
          if (typeof targetObj[key] === 'object' && targetObj[key] !== null) {
            compareKeys(enObj[key], targetObj[key], fullKey);
          } else {
            missingKeys.push(fullKey);
          }
        }
      }
    }
    
    compareKeys(enContent, targetContent);
  } catch (error) {
    console.error(`${colors.red}Error comparing files: ${error.message}${colors.reset}`);
  }
  
  return missingKeys;
}

// Main validation function
function validateAllTranslations() {
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}           TRANSLATION VALIDATION REPORT - PHASE 2            ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // Get all language directories
  const languages = fs.readdirSync(localesDir).filter(dir => {
    return fs.statSync(path.join(localesDir, dir)).isDirectory();
  });
  
  // Get all JSON files from English directory as reference
  const enDir = path.join(localesDir, 'en');
  const enFiles = fs.readdirSync(enDir).filter(file => file.endsWith('.json'));
  
  let totalIssues = 0;
  const summaryByFile = {};
  
  // Focus on Hindi translations
  const targetLang = 'hi';
  const targetDir = path.join(localesDir, targetLang);
  
  if (!fs.existsSync(targetDir)) {
    console.log(`${colors.red}Hindi translations directory not found!${colors.reset}`);
    return;
  }
  
  console.log(`${colors.bold}${colors.blue}Analyzing Hindi Translations:${colors.reset}\n`);
  
  // Check each file
  for (const file of enFiles) {
    const enFilePath = path.join(enDir, file);
    const targetFilePath = path.join(targetDir, file);
    
    if (!fs.existsSync(targetFilePath)) {
      console.log(`${colors.red}✗ ${file}: File missing for Hindi${colors.reset}`);
      totalIssues++;
      continue;
    }
    
    // Validate the Hindi file
    const issues = validateTranslationFile(targetFilePath, targetLang);
    const missingKeys = compareTranslations(enFilePath, targetFilePath, targetLang);
    issues.missingTranslations = missingKeys;
    
    const fileIssueCount = 
      issues.englishTerms.length + 
      issues.mixedLanguage.length + 
      issues.missingTranslations.length + 
      issues.emptyValues.length +
      issues.duplicateKeys.length;
    
    summaryByFile[file] = {
      issues: issues,
      count: fileIssueCount
    };
    
    totalIssues += fileIssueCount;
    
    // Display file report
    if (fileIssueCount > 0) {
      console.log(`${colors.bold}${colors.yellow}📁 ${file}${colors.reset}`);
      console.log(`${colors.yellow}   Total Issues: ${fileIssueCount}${colors.reset}`);
      
      if (issues.englishTerms.length > 0) {
        console.log(`${colors.red}   ✗ English terms found: ${issues.englishTerms.length}${colors.reset}`);
        // Show first 3 examples
        issues.englishTerms.slice(0, 3).forEach(item => {
          console.log(`     - ${item.key}: "${item.value.substring(0, 50)}..." [${item.terms.join(', ')}]`);
        });
        if (issues.englishTerms.length > 3) {
          console.log(`     ... and ${issues.englishTerms.length - 3} more`);
        }
      }
      
      if (issues.mixedLanguage.length > 0) {
        console.log(`${colors.red}   ✗ Mixed language strings: ${issues.mixedLanguage.length}${colors.reset}`);
        // Show first 3 examples
        issues.mixedLanguage.slice(0, 3).forEach(item => {
          console.log(`     - ${item.key}: "${item.value.substring(0, 50)}..."`);
        });
        if (issues.mixedLanguage.length > 3) {
          console.log(`     ... and ${issues.mixedLanguage.length - 3} more`);
        }
      }
      
      if (issues.missingTranslations.length > 0) {
        console.log(`${colors.red}   ✗ Missing translations: ${issues.missingTranslations.length}${colors.reset}`);
        // Show first 5 missing keys
        issues.missingTranslations.slice(0, 5).forEach(key => {
          console.log(`     - ${key}`);
        });
        if (issues.missingTranslations.length > 5) {
          console.log(`     ... and ${issues.missingTranslations.length - 5} more`);
        }
      }
      
      if (issues.emptyValues.length > 0) {
        console.log(`${colors.red}   ✗ Empty values: ${issues.emptyValues.length}${colors.reset}`);
      }
      
      if (issues.duplicateKeys.length > 0) {
        console.log(`${colors.red}   ✗ Duplicate keys: ${issues.duplicateKeys.length}${colors.reset}`);
      }
      
      console.log('');
    } else {
      console.log(`${colors.green}✓ ${file}: No issues found${colors.reset}`);
    }
  }
  
  // Summary
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}                          SUMMARY                              ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  // Sort files by issue count
  const sortedFiles = Object.entries(summaryByFile)
    .sort((a, b) => b[1].count - a[1].count)
    .filter(([_, data]) => data.count > 0);
  
  if (sortedFiles.length > 0) {
    console.log(`${colors.bold}${colors.red}Files Requiring Attention (Priority Order):${colors.reset}`);
    sortedFiles.forEach(([file, data], index) => {
      console.log(`  ${index + 1}. ${file}: ${data.count} issues`);
    });
  }
  
  console.log(`\n${colors.bold}Total Issues Found: ${totalIssues === 0 ? colors.green : colors.red}${totalIssues}${colors.reset}`);
  
  if (totalIssues === 0) {
    console.log(`${colors.green}${colors.bold}✓ All Hindi translations are complete and valid!${colors.reset}`);
  } else {
    console.log(`${colors.yellow}${colors.bold}⚠ Translation fixes required for ${sortedFiles.length} files${colors.reset}`);
  }
  
  // Generate detailed report file
  const reportPath = path.join(__dirname, 'translation-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(summaryByFile, null, 2));
  console.log(`\n${colors.cyan}Detailed report saved to: ${reportPath}${colors.reset}`);
}

// Run validation
validateAllTranslations();