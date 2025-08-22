const fs = require('fs');
const path = require('path');

// Define the project root
const projectRoot = path.join(__dirname, '..');
const localesDir = path.join(projectRoot, 'public', 'locales');

// Professional Bengali translations for ATM Franchise India
const bengaliTranslations = {
  // Common UI elements
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
  'Back': 'পিছনে',
  'Close': 'বন্ধ',
  'Open': 'খুলুন',
  'Save': 'সংরক্ষণ',
  'Yes': 'হ্যাঁ',
  'No': 'না',
  'Confirm': 'নিশ্চিত করুন',
  
  // ATM Franchise specific
  'ATM Franchise': 'এটিএম ফ্র্যাঞ্চাইজি',
  'India': 'ভারত',
  'ATM Franchise India': 'এটিএম ফ্র্যাঞ্চাইজি ইন্ডিয়া',
  'Start Your ATM Business': 'আপনার এটিএম ব্যবসা শুরু করুন',
  'Franchise Opportunities': 'ফ্র্যাঞ্চাইজি সুযোগ',
  'Financial Independence': 'আর্থিক স্বাধীনতা',
  'Business Growth': 'ব্যবসা বৃদ্ধি',
  'Investment': 'বিনিয়োগ',
  'Returns': 'রিটার্ন',
  'Monthly Income': 'মাসিক আয়',
  'Passive Income': 'প্যাসিভ আয়',
  'ROI': 'আরওআই',
  'Commission': 'কমিশন',
  'Transaction': 'লেনদেন',
  'White Label ATM': 'হোয়াইট লেবেল এটিএম',
  'WLA': 'ডব্লিউএলএ',
  'RBI': 'আরবিআই',
  'License': 'লাইসেন্স',
  'Support': 'সহায়তা',
  'Training': 'প্রশিক্ষণ',
  'Location': 'অবস্থান',
  'Apply Now': 'এখনই আবেদন করুন',
  'Get Started': 'শুরু করুন',
  'Contact Us': 'যোগাযোগ করুন',
  'Learn More': 'আরও জানুন',
  
  // About page specific
  'Who We Are': 'আমরা কে',
  'Our Mission': 'আমাদের লক্ষ্য',
  'Our Services': 'আমাদের সেবা',
  'Industry Expertise': 'শিল্প দক্ষতা',
  'Years Experience': 'বছরের অভিজ্ঞতা',
  'Franchise Partners': 'ফ্র্যাঞ্চাইজি অংশীদার',
  'Monthly Transactions': 'মাসিক লেনদেন',
  'States Covered': 'রাজ্য কভার',
  'Success Rate': 'সাফল্যের হার',
  'Transparent': 'স্বচ্ছ',
  'No Hidden Costs': 'কোন লুকানো খরচ নেই',
  'Expert Guidance': 'বিশেষজ্ঞ নির্দেশনা',
  'Consultation': 'পরামর্শ',
  'Technical Assistance': 'প্রযুক্তিগত সহায়তা',
  'Digital Marketing': 'ডিজিটাল মার্কেটিং',
  
  // Forms
  'Full Name': 'পূর্ণ নাম',
  'Email': 'ইমেইল',
  'Phone': 'ফোন',
  'Mobile': 'মোবাইল',
  'Address': 'ঠিকানা',
  'City': 'শহর',
  'State': 'রাজ্য',
  'Pin Code': 'পিন কোড',
  'Message': 'বার্তা',
  'Comments': 'মন্তব্য',
  'Select State': 'রাজ্য নির্বাচন করুন',
  'Enter your name': 'আপনার নাম লিখুন',
  'Enter your email': 'আপনার ইমেইল লিখুন',
  'Enter your phone': 'আপনার ফোন নম্বর লিখুন',
  'Enter your message': 'আপনার বার্তা লিখুন',
  'I agree': 'আমি সম্মত',
  'Terms and Conditions': 'শর্তাবলী',
  'Privacy Policy': 'গোপনীয়তা নীতি',
  
  // Components
  'Navigation': 'নেভিগেশন',
  'Menu': 'মেনু',
  'Home': 'হোম',
  'About': 'সম্পর্কে',
  'Services': 'সেবা',
  'Products': 'পণ্য',
  'Contact': 'যোগাযোগ',
  'Blog': 'ব্লগ',
  'FAQ': 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
  'Footer': 'ফুটার',
  'Header': 'হেডার',
  'Hero Section': 'হিরো সেকশন',
  'Call to Action': 'কল টু অ্যাকশন',
  'Testimonials': 'প্রশংসাপত্র',
  'Gallery': 'গ্যালারি',
  'Features': 'বৈশিষ্ট্য',
  'Benefits': 'সুবিধা',
  
  // Location specific
  'Select Location': 'অবস্থান নির্বাচন করুন',
  'Preferred Location': 'পছন্দের অবস্থান',
  'Rural': 'গ্রামীণ',
  'Urban': 'শহুরে',
  'Semi-Urban': 'আধা-শহুরে',
  'District': 'জেলা',
  'Village': 'গ্রাম',
  'Town': 'শহর',
  'Area': 'এলাকা',
  'Landmark': 'ল্যান্ডমার্ক',
  'Near': 'কাছে',
  'Location Details': 'অবস্থানের বিবরণ',
  'Site Visit': 'সাইট পরিদর্শন',
  'Location Approval': 'অবস্থান অনুমোদন'
};

// Function to translate text
function translateToBengali(text) {
  // Handle non-string values
  if (typeof text !== 'string') {
    return text;
  }
  
  // Check direct translation
  if (bengaliTranslations[text]) {
    return bengaliTranslations[text];
  }
  
  // Check case-insensitive
  const lowerText = text.toLowerCase();
  for (const [key, value] of Object.entries(bengaliTranslations)) {
    if (key.toLowerCase() === lowerText) {
      return value;
    }
  }
  
  // Special cases for common patterns
  if (text.includes('ATM')) {
    return text.replace(/ATM/g, 'এটিএম');
  }
  if (text.includes('India')) {
    return text.replace(/India/g, 'ভারত');
  }
  if (text.includes('Franchise')) {
    return text.replace(/Franchise/g, 'ফ্র্যাঞ্চাইজি');
  }
  
  // Return original text as placeholder for manual translation
  return text;
}

// Function to process and update translation files
function processTranslations(obj, isTranslating = true) {
  const result = {};
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      result[key] = processTranslations(obj[key], isTranslating);
    } else if (typeof obj[key] === 'string') {
      if (isTranslating && (obj[key] === '' || !obj[key])) {
        // Skip empty values
        result[key] = '';
      } else if (isTranslating) {
        result[key] = translateToBengali(obj[key]);
      } else {
        result[key] = obj[key];
      }
    } else {
      result[key] = obj[key];
    }
  }
  
  return result;
}

// Main function to complete Bengali translations
function completeBengaliTranslations() {
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('                    BENGALI TRANSLATION COMPLETION                             ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('Target: 100% coverage for Bengali (bn) - 12% of users');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
  
  const bnDir = path.join(localesDir, 'bn');
  const enDir = path.join(localesDir, 'en');
  const hiDir = path.join(localesDir, 'hi'); // Use Hindi as reference for structure
  
  // Get all namespace files
  const namespaces = fs.readdirSync(enDir).filter(file => file.endsWith('.json'));
  
  let totalUpdated = 0;
  let totalKeys = 0;
  
  namespaces.forEach(namespace => {
    const enPath = path.join(enDir, namespace);
    const bnPath = path.join(bnDir, namespace);
    const hiPath = path.join(hiDir, namespace);
    
    // Read English data
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    
    // Read existing Bengali data or create empty
    let bnData = {};
    if (fs.existsSync(bnPath)) {
      try {
        bnData = JSON.parse(fs.readFileSync(bnPath, 'utf-8'));
      } catch (error) {
        console.error(`Error reading ${bnPath}:`, error.message);
        bnData = {};
      }
    }
    
    // Read Hindi data for reference (structure and completeness)
    let hiData = {};
    if (fs.existsSync(hiPath)) {
      try {
        hiData = JSON.parse(fs.readFileSync(hiPath, 'utf-8'));
      } catch (error) {
        hiData = enData; // Fallback to English structure
      }
    }
    
    // Merge and translate
    const merged = mergeTranslations(enData, bnData, hiData);
    
    // Count keys
    const keyCount = countKeys(merged);
    totalKeys += keyCount;
    
    // Write updated file
    fs.writeFileSync(bnPath, JSON.stringify(merged, null, 2));
    console.log(`✅ Updated ${namespace}: ${keyCount} keys`);
    totalUpdated++;
  });
  
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('                           COMPLETION SUMMARY                                  ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`✅ Files Updated: ${totalUpdated}`);
  console.log(`📊 Total Keys: ${totalKeys}`);
  console.log(`🎯 Coverage: Targeting 100%`);
  console.log('\n📋 Next Steps:');
  console.log('1. Run manual review for complex translations');
  console.log('2. Test in browser with ?lng=bn parameter');
  console.log('3. Run validation script: node scripts/validate-bengali.cjs');
  console.log('4. Get native speaker review if available');
}

// Helper function to merge translations
function mergeTranslations(enData, bnData, hiData) {
  const result = {};
  
  for (const key in enData) {
    if (typeof enData[key] === 'object' && enData[key] !== null && !Array.isArray(enData[key])) {
      result[key] = mergeTranslations(
        enData[key],
        bnData[key] || {},
        hiData[key] || {}
      );
    } else {
      // Priority: existing Bengali > translated from English > English fallback
      if (bnData[key] && bnData[key] !== '' && bnData[key] !== enData[key]) {
        result[key] = bnData[key];
      } else {
        const translated = translateToBengali(enData[key]);
        result[key] = translated || enData[key];
      }
    }
  }
  
  return result;
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
completeBengaliTranslations();