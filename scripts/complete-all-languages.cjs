const fs = require('fs');
const path = require('path');

// Define the project root
const projectRoot = path.join(__dirname, '..');
const localesDir = path.join(projectRoot, 'public', 'locales');

// Languages to complete (excluding Hindi and Tamil)
const targetLanguages = ['bn', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Step 1: Create missing namespace files (components.json and location.json)
function createMissingFiles() {
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('                    CREATING MISSING NAMESPACE FILES                           ');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  // Get reference files from Hindi (complete implementation)
  const componentsRef = JSON.parse(fs.readFileSync(path.join(localesDir, 'hi', 'components.json'), 'utf-8'));
  const locationRef = JSON.parse(fs.readFileSync(path.join(localesDir, 'hi', 'location.json'), 'utf-8'));

  targetLanguages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    
    // Create components.json if missing
    const componentsPath = path.join(langDir, 'components.json');
    if (!fs.existsSync(componentsPath)) {
      // Create with empty structure matching Hindi
      const emptyComponents = createEmptyStructure(componentsRef);
      fs.writeFileSync(componentsPath, JSON.stringify(emptyComponents, null, 2));
      console.log(`✅ Created components.json for ${lang}`);
    }

    // Create location.json if missing
    const locationPath = path.join(langDir, 'location.json');
    if (!fs.existsSync(locationPath)) {
      // Create with empty structure matching Hindi
      const emptyLocation = createEmptyStructure(locationRef);
      fs.writeFileSync(locationPath, JSON.stringify(emptyLocation, null, 2));
      console.log(`✅ Created location.json for ${lang}`);
    }
  });
}

// Helper function to create empty structure
function createEmptyStructure(ref) {
  const empty = {};
  for (const key in ref) {
    if (typeof ref[key] === 'object' && ref[key] !== null && !Array.isArray(ref[key])) {
      empty[key] = createEmptyStructure(ref[key]);
    } else {
      empty[key] = ''; // Empty string for translation placeholder
    }
  }
  return empty;
}

// Step 2: Identify and collect all missing translations
function collectMissingTranslations(langCode) {
  const langDir = path.join(localesDir, langCode);
  const enDir = path.join(localesDir, 'en');
  const missingTranslations = {};

  // Get all namespace files from English
  const namespaces = fs.readdirSync(enDir).filter(file => file.endsWith('.json'));

  namespaces.forEach(namespace => {
    const enPath = path.join(enDir, namespace);
    const langPath = path.join(langDir, namespace);

    const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    
    let langData = {};
    if (fs.existsSync(langPath)) {
      try {
        langData = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
      } catch (error) {
        console.error(`Error parsing ${langPath}:`, error.message);
        langData = {};
      }
    }

    const missing = findMissingKeys(enData, langData);
    if (Object.keys(missing).length > 0) {
      missingTranslations[namespace] = missing;
    }
  });

  return missingTranslations;
}

// Helper function to find missing keys
function findMissingKeys(enObj, langObj, prefix = '') {
  const missing = {};
  
  for (const key in enObj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
      const nestedMissing = findMissingKeys(
        enObj[key], 
        langObj[key] || {}, 
        fullKey
      );
      if (Object.keys(nestedMissing).length > 0) {
        missing[key] = nestedMissing;
      }
    } else {
      if (!langObj[key] || langObj[key] === '' || langObj[key] === enObj[key]) {
        missing[key] = enObj[key];
      }
    }
  }
  
  return missing;
}

// Step 3: Generate translation mapping for each language
function getLanguageTranslations(langCode, englishText) {
  // Professional translations for common UI elements
  const translations = {
    'bn': { // Bengali
      'Submit': 'জমা দিন',
      'Cancel': 'বাতিল',
      'Next': 'পরবর্তী',
      'Previous': 'পূর্ববর্তী',
      'Loading': 'লোড হচ্ছে',
      'Error': 'ত্রুটি',
      'Success': 'সফল',
      'Required': 'প্রয়োজনীয়',
      'Optional': 'ঐচ্ছিক',
      'Select': 'নির্বাচন করুন',
      'Search': 'অনুসন্ধান',
      'Filter': 'ফিল্টার',
      'Sort': 'সাজান',
      'View': 'দেখুন',
      'Edit': 'সম্পাদনা',
      'Delete': 'মুছুন',
      'Save': 'সংরক্ষণ',
      'Close': 'বন্ধ',
      'Open': 'খুলুন',
      'Download': 'ডাউনলোড',
      'Upload': 'আপলোড',
      'Share': 'শেয়ার',
      'Copy': 'কপি',
      'Paste': 'পেস্ট',
      'Cut': 'কাট',
      'Home': 'হোম',
      'About': 'সম্পর্কে',
      'Contact': 'যোগাযোগ',
      'Services': 'সেবা',
      'Products': 'পণ্য',
      'Support': 'সহায়তা',
      'Help': 'সাহায্য',
      'Settings': 'সেটিংস',
      'Profile': 'প্রোফাইল',
      'Logout': 'লগআউট',
      'Login': 'লগইন',
      'Register': 'নিবন্ধন',
      'Welcome': 'স্বাগতম',
      'Thank you': 'ধন্যবাদ',
      'Yes': 'হ্যাঁ',
      'No': 'না',
      'Confirm': 'নিশ্চিত করুন',
      'Warning': 'সতর্কতা',
      'Information': 'তথ্য',
      'Question': 'প্রশ্ন',
      'Please wait': 'অনুগ্রহ করে অপেক্ষা করুন',
      'Processing': 'প্রক্রিয়াকরণ',
      'Completed': 'সম্পন্ন',
      'Failed': 'ব্যর্থ',
      'Pending': 'মুলতুবি',
      'Active': 'সক্রিয়',
      'Inactive': 'নিষ্ক্রিয়',
      'All': 'সব',
      'None': 'কোনটিই নয়',
      'Back': 'পিছনে',
      'Forward': 'সামনে',
      'Refresh': 'রিফ্রেশ',
      'Reset': 'রিসেট',
      'Clear': 'পরিষ্কার',
      'Apply': 'প্রয়োগ',
      'Update': 'আপডেট',
      'Install': 'ইনস্টল',
      'Uninstall': 'আনইনস্টল',
      'Start': 'শুরু',
      'Stop': 'থামুন',
      'Pause': 'বিরতি',
      'Resume': 'পুনরায় শুরু',
      'Restart': 'পুনরায় চালু',
      'Exit': 'প্রস্থান'
    },
    'te': { // Telugu
      'Submit': 'సమర్పించు',
      'Cancel': 'రద్దు',
      'Next': 'తదుపరి',
      'Previous': 'మునుపటి',
      'Loading': 'లోడ్ అవుతోంది',
      'Error': 'లోపం',
      'Success': 'విజయవంతం',
      'Required': 'అవసరం',
      'Optional': 'ఐచ్ఛికం',
      'Select': 'ఎంచుకోండి',
      'Search': 'వెతుకు',
      'Filter': 'ఫిల్టర్',
      'Sort': 'క్రమబద్ధీకరించు',
      'View': 'చూడండి',
      'Edit': 'సవరించు',
      'Delete': 'తొలగించు',
      'Save': 'సేవ్',
      'Close': 'మూసివేయి',
      'Open': 'తెరువు',
      'Download': 'డౌన్‌లోడ్',
      'Upload': 'అప్‌లోడ్',
      'Share': 'భాగస్వామ్యం',
      'Copy': 'కాపీ',
      'Paste': 'పేస్ట్',
      'Cut': 'కత్తిరించు',
      'Home': 'హోమ్',
      'About': 'గురించి',
      'Contact': 'సంప్రదించండి',
      'Services': 'సేవలు',
      'Products': 'ఉత్పత్తులు',
      'Support': 'మద్దతు',
      'Help': 'సహాయం',
      'Settings': 'సెట్టింగ్‌లు',
      'Profile': 'ప్రొఫైల్',
      'Logout': 'లాగ్అవుట్',
      'Login': 'లాగిన్',
      'Register': 'నమోదు',
      'Welcome': 'స్వాగతం',
      'Thank you': 'ధన్యవాదాలు',
      'Yes': 'అవును',
      'No': 'లేదు',
      'Confirm': 'నిర్ధారించండి',
      'Warning': 'హెచ్చరిక',
      'Information': 'సమాచారం',
      'Question': 'ప్రశ్న',
      'Please wait': 'దయచేసి వేచి ఉండండి',
      'Processing': 'ప్రాసెసింగ్',
      'Completed': 'పూర్తయింది',
      'Failed': 'విఫలమైంది',
      'Pending': 'పెండింగ్',
      'Active': 'యాక్టివ్',
      'Inactive': 'ఇన్యాక్టివ్',
      'All': 'అన్నీ',
      'None': 'ఏదీ లేదు',
      'Back': 'వెనుకకు',
      'Forward': 'ముందుకు',
      'Refresh': 'రిఫ్రెష్',
      'Reset': 'రీసెట్',
      'Clear': 'క్లియర్',
      'Apply': 'వర్తించు',
      'Update': 'అప్‌డేట్',
      'Install': 'ఇన్‌స్టాల్',
      'Uninstall': 'అన్‌ఇన్‌స్టాల్',
      'Start': 'ప్రారంభించు',
      'Stop': 'ఆపు',
      'Pause': 'పాజ్',
      'Resume': 'కొనసాగించు',
      'Restart': 'రీస్టార్ట్',
      'Exit': 'నిష్క్రమించు'
    },
    // Add more language mappings as needed
  };

  // Return translation if available, otherwise return placeholder
  if (translations[langCode] && translations[langCode][englishText]) {
    return translations[langCode][englishText];
  }
  
  // For now, return empty string for untranslated text
  // In production, this would use a translation service
  return '';
}

// Main execution
function main() {
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('                 11-LANGUAGE COMPLETION AUTOMATION SCRIPT                      ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('Target Languages: Bengali, Telugu, Marathi, Gujarati, Urdu,');
  console.log('                  Kannada, Odia, Punjabi, Assamese, Malayalam');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  // Step 1: Create missing files
  createMissingFiles();

  // Step 2: Collect missing translations for each language
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('                    COLLECTING MISSING TRANSLATIONS                            ');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  const missingByLanguage = {};
  targetLanguages.forEach(lang => {
    const missing = collectMissingTranslations(lang);
    missingByLanguage[lang] = missing;
    
    let totalMissing = 0;
    Object.values(missing).forEach(namespace => {
      totalMissing += countKeys(namespace);
    });
    
    console.log(`📊 ${lang}: ${totalMissing} missing translations across ${Object.keys(missing).length} files`);
  });

  // Save missing translations report
  const reportPath = path.join(projectRoot, 'docs', 'reports', 'missing-translations-11-languages.json');
  fs.writeFileSync(reportPath, JSON.stringify(missingByLanguage, null, 2));
  console.log(`\n💾 Missing translations report saved to: ${reportPath}`);
  
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('                           NEXT STEPS                                          ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('1. Run complete-bengali-translations.cjs to complete Bengali (Priority 1)');
  console.log('2. Run complete-telugu-translations.cjs to complete Telugu (Priority 2)');
  console.log('3. Test each language with ?lng=xx parameter in browser');
  console.log('4. Run validation scripts for each completed language');
}

// Helper function to count keys
function countKeys(obj) {
  let count = 0;
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count += countKeys(obj[key]);
    } else {
      count++;
    }
  }
  return count;
}

// Run the script
main();