const fs = require('fs');
const path = require('path');

// Define the project root
const projectRoot = path.join(__dirname, '..');
const localesDir = path.join(projectRoot, 'public', 'locales');

// Comprehensive Bengali translations dictionary
const bengaliDictionary = {
  // Navigation & UI
  'Home': 'হোম',
  'About': 'সম্পর্কে',
  'About Us': 'আমাদের সম্পর্কে',
  'Services': 'সেবা',
  'Products': 'পণ্য',
  'Contact': 'যোগাযোগ',
  'Contact Us': 'যোগাযোগ করুন',
  'Blog': 'ব্লগ',
  'FAQ': 'প্রায়শই জিজ্ঞাসিত প্রশ্ন',
  'Login': 'লগইন',
  'Register': 'নিবন্ধন',
  'Submit': 'জমা দিন',
  'Cancel': 'বাতিল',
  'Next': 'পরবর্তী',
  'Previous': 'পূর্ববর্তী',
  'Back': 'পিছনে',
  'Close': 'বন্ধ',
  'Open': 'খুলুন',
  'Save': 'সংরক্ষণ',
  'Loading': 'লোড হচ্ছে',
  'Please wait': 'অনুগ্রহ করে অপেক্ষা করুন',
  'Search': 'অনুসন্ধান',
  'Select': 'নির্বাচন করুন',
  'Choose': 'পছন্দ করুন',
  'Apply': 'প্রয়োগ করুন',
  'Apply Now': 'এখনই আবেদন করুন',
  'Get Started': 'শুরু করুন',
  'Learn More': 'আরও জানুন',
  'Read More': 'আরও পড়ুন',
  'View All': 'সব দেখুন',
  'Download': 'ডাউনলোড',
  'Upload': 'আপলোড',
  'Share': 'শেয়ার',
  
  // ATM Franchise Core Terms
  'ATM': 'এটিএম',
  'Franchise': 'ফ্র্যাঞ্চাইজি',
  'India': 'ভারত',
  'ATM Franchise': 'এটিএম ফ্র্যাঞ্চাইজি',
  'ATM Franchise India': 'এটিএম ফ্র্যাঞ্চাইজি ইন্ডিয়া',
  'White Label ATM': 'হোয়াইট লেবেল এটিএম',
  'WLA': 'ডব্লিউএলএ',
  'RBI': 'আরবিআই',
  'Reserve Bank of India': 'ভারতীয় রিজার্ভ ব্যাংক',
  
  // Business Terms
  'Business': 'ব্যবসা',
  'Business Opportunity': 'ব্যবসায়িক সুযোগ',
  'Franchise Business': 'ফ্র্যাঞ্চাইজি ব্যবসা',
  'Start Your Business': 'আপনার ব্যবসা শুরু করুন',
  'Start Your ATM Business': 'আপনার এটিএম ব্যবসা শুরু করুন',
  'Investment': 'বিনিয়োগ',
  'Investment Required': 'প্রয়োজনীয় বিনিয়োগ',
  'Minimum Investment': 'ন্যূনতম বিনিয়োগ',
  'Returns': 'রিটার্ন',
  'ROI': 'আরওআই',
  'Return on Investment': 'বিনিয়োগের উপর রিটার্ন',
  'Profit': 'লাভ',
  'Income': 'আয়',
  'Monthly Income': 'মাসিক আয়',
  'Passive Income': 'প্যাসিভ আয়',
  'Revenue': 'রাজস্ব',
  'Commission': 'কমিশন',
  'Transaction': 'লেনদেন',
  'Transaction Fee': 'লেনদেন ফি',
  'Partnership': 'অংশীদারিত্ব',
  'Partner': 'অংশীদার',
  'Franchise Partner': 'ফ্র্যাঞ্চাইজি অংশীদার',
  
  // Success & Growth
  'Success': 'সাফল্য',
  'Success Story': 'সাফল্যের গল্প',
  'Success Rate': 'সাফল্যের হার',
  'Growth': 'বৃদ্ধি',
  'Business Growth': 'ব্যবসা বৃদ্ধি',
  'Financial Freedom': 'আর্থিক স্বাধীনতা',
  'Financial Independence': 'আর্থিক স্বাধীনতা',
  'Entrepreneur': 'উদ্যোক্তা',
  'Entrepreneurship': 'উদ্যোক্তা',
  'Young Entrepreneur': 'তরুণ উদ্যোক্তা',
  
  // Support & Services
  'Support': 'সহায়তা',
  'Customer Support': 'গ্রাহক সহায়তা',
  '24/7 Support': '২৪/৭ সহায়তা',
  'Technical Support': 'প্রযুক্তিগত সহায়তা',
  'Training': 'প্রশিক্ষণ',
  'Training Program': 'প্রশিক্ষণ কর্মসূচি',
  'Guidance': 'নির্দেশনা',
  'Expert Guidance': 'বিশেষজ্ঞ নির্দেশনা',
  'Consultation': 'পরামর্শ',
  'Free Consultation': 'বিনামূল্যে পরামর্শ',
  'Assistance': 'সহায়তা',
  'Technical Assistance': 'প্রযুক্তিগত সহায়তা',
  'Marketing': 'মার্কেটিং',
  'Digital Marketing': 'ডিজিটাল মার্কেটিং',
  
  // Location Terms
  'Location': 'অবস্থান',
  'Select Location': 'অবস্থান নির্বাচন করুন',
  'Preferred Location': 'পছন্দের অবস্থান',
  'Location Details': 'অবস্থানের বিবরণ',
  'Rural': 'গ্রামীণ',
  'Urban': 'শহুরে',
  'Semi-Urban': 'আধা-শহুরে',
  'City': 'শহর',
  'Town': 'শহর',
  'Village': 'গ্রাম',
  'District': 'জেলা',
  'State': 'রাজ্য',
  'Area': 'এলাকা',
  'Pin Code': 'পিন কোড',
  'Address': 'ঠিকানা',
  'Landmark': 'ল্যান্ডমার্ক',
  
  // Form Fields
  'Name': 'নাম',
  'Full Name': 'পূর্ণ নাম',
  'First Name': 'প্রথম নাম',
  'Last Name': 'শেষ নাম',
  'Email': 'ইমেইল',
  'Email Address': 'ইমেইল ঠিকানা',
  'Phone': 'ফোন',
  'Phone Number': 'ফোন নম্বর',
  'Mobile': 'মোবাইল',
  'Mobile Number': 'মোবাইল নম্বর',
  'Message': 'বার্তা',
  'Your Message': 'আপনার বার্তা',
  'Comments': 'মন্তব্য',
  'Required': 'প্রয়োজনীয়',
  'Optional': 'ঐচ্ছিক',
  'Required Field': 'প্রয়োজনীয় ক্ষেত্র',
  
  // Company Info
  'Who We Are': 'আমরা কে',
  'Our Mission': 'আমাদের লক্ষ্য',
  'Our Vision': 'আমাদের দৃষ্টি',
  'Our Values': 'আমাদের মূল্যবোধ',
  'Our Services': 'আমাদের সেবা',
  'Our Products': 'আমাদের পণ্য',
  'Our Team': 'আমাদের দল',
  'About Company': 'কোম্পানি সম্পর্কে',
  'Company Profile': 'কোম্পানি প্রোফাইল',
  'Years Experience': 'বছরের অভিজ্ঞতা',
  'Years of Experience': 'বছরের অভিজ্ঞতা',
  'Industry Expertise': 'শিল্প দক্ষতা',
  'Trusted Partner': 'বিশ্বস্ত অংশীদার',
  
  // Benefits & Features
  'Benefits': 'সুবিধা',
  'Features': 'বৈশিষ্ট্য',
  'Key Features': 'মূল বৈশিষ্ট্য',
  'Why Choose Us': 'কেন আমাদের পছন্দ করবেন',
  'Advantages': 'সুবিধা',
  'No Hidden Costs': 'কোন লুকানো খরচ নেই',
  'Transparent': 'স্বচ্ছ',
  'Transparent Process': 'স্বচ্ছ প্রক্রিয়া',
  'Easy Process': 'সহজ প্রক্রিয়া',
  'Simple Process': 'সরল প্রক্রিয়া',
  'Quick Approval': 'দ্রুত অনুমোদন',
  'Fast Processing': 'দ্রুত প্রক্রিয়াকরণ',
  
  // Call to Action
  'Get Started Today': 'আজই শুরু করুন',
  'Start Now': 'এখনই শুরু করুন',
  'Join Now': 'এখনই যোগ দিন',
  'Join Us': 'আমাদের সাথে যোগ দিন',
  'Register Now': 'এখনই নিবন্ধন করুন',
  'Sign Up': 'সাইন আপ',
  'Subscribe': 'সাবস্ক্রাইব',
  'Request Callback': 'কলব্যাক অনুরোধ',
  'Book Appointment': 'অ্যাপয়েন্টমেন্ট বুক করুন',
  'Schedule Meeting': 'মিটিং নির্ধারণ করুন',
  
  // Status & Messages
  'Success': 'সফল',
  'Error': 'ত্রুটি',
  'Warning': 'সতর্কতা',
  'Information': 'তথ্য',
  'Confirmation': 'নিশ্চিতকরণ',
  'Thank You': 'ধন্যবাদ',
  'Welcome': 'স্বাগতম',
  'Congratulations': 'অভিনন্দন',
  'Processing': 'প্রক্রিয়াকরণ',
  'Completed': 'সম্পন্ন',
  'Pending': 'মুলতুবি',
  'Active': 'সক্রিয়',
  'Inactive': 'নিষ্ক্রিয়',
  'Available': 'উপলব্ধ',
  'Not Available': 'উপলব্ধ নয়',
  
  // Legal & Policies
  'Terms and Conditions': 'শর্তাবলী',
  'Terms': 'শর্ত',
  'Privacy Policy': 'গোপনীয়তা নীতি',
  'Privacy': 'গোপনীয়তা',
  'Refund Policy': 'রিফান্ড নীতি',
  'Disclaimer': 'দাবিত্যাগ',
  'Copyright': 'কপিরাইট',
  'All Rights Reserved': 'সর্বস্বত্ব সংরক্ষিত',
  'I Agree': 'আমি সম্মত',
  'Accept': 'গ্রহণ',
  'Decline': 'প্রত্যাখ্যান'
};

// Function to get all translation files for a language
function getAllTranslationFiles(langCode) {
  const langDir = path.join(localesDir, langCode);
  const enDir = path.join(localesDir, 'en');
  
  const files = fs.readdirSync(enDir).filter(file => file.endsWith('.json'));
  return files.map(file => ({
    name: file,
    enPath: path.join(enDir, file),
    langPath: path.join(langDir, file)
  }));
}

// Smart translation function
function smartTranslate(text) {
  if (typeof text !== 'string') return text;
  
  // Direct match
  if (bengaliDictionary[text]) {
    return bengaliDictionary[text];
  }
  
  // Case-insensitive match
  const lower = text.toLowerCase();
  for (const [key, value] of Object.entries(bengaliDictionary)) {
    if (key.toLowerCase() === lower) {
      return value;
    }
  }
  
  // Partial match and replacement
  let translated = text;
  
  // Sort keys by length (longest first) to avoid partial replacements
  const sortedKeys = Object.keys(bengaliDictionary).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    if (text.includes(key)) {
      const regex = new RegExp(key, 'g');
      translated = translated.replace(regex, bengaliDictionary[key]);
    }
  }
  
  // If no translation found, return original
  return translated === text ? text : translated;
}

// Deep merge function
function deepMerge(enObj, existingObj) {
  const result = {};
  
  for (const key in enObj) {
    if (typeof enObj[key] === 'object' && enObj[key] !== null && !Array.isArray(enObj[key])) {
      result[key] = deepMerge(enObj[key], existingObj[key] || {});
    } else {
      // Use existing translation if available and not empty
      if (existingObj && existingObj[key] && existingObj[key] !== '' && existingObj[key] !== enObj[key]) {
        result[key] = existingObj[key];
      } else {
        // Translate from English
        result[key] = smartTranslate(enObj[key]);
      }
    }
  }
  
  return result;
}

// Main function
function completeBengali() {
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('                  ENHANCED BENGALI TRANSLATION COMPLETION                      ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('Language: Bengali (bn)');
  console.log('User Coverage: 12%');
  console.log('Target: 100% translation coverage');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
  
  const files = getAllTranslationFiles('bn');
  let totalKeys = 0;
  let translatedKeys = 0;
  
  files.forEach(file => {
    console.log(`Processing: ${file.name}`);
    
    // Read English reference
    const enData = JSON.parse(fs.readFileSync(file.enPath, 'utf-8'));
    
    // Read existing Bengali data
    let bnData = {};
    if (fs.existsSync(file.langPath)) {
      try {
        bnData = JSON.parse(fs.readFileSync(file.langPath, 'utf-8'));
      } catch (error) {
        console.error(`  ⚠️ Error reading existing file: ${error.message}`);
      }
    }
    
    // Merge and translate
    const merged = deepMerge(enData, bnData);
    
    // Count keys
    const keyCount = JSON.stringify(merged).match(/"[^"]+"\s*:/g)?.length || 0;
    totalKeys += keyCount;
    
    // Count translated keys (not matching English)
    const translatedCount = JSON.stringify(merged).match(/"[^"]+"\s*:\s*"[^\u0000-\u007F]+"/g)?.length || 0;
    translatedKeys += translatedCount;
    
    // Write file
    fs.writeFileSync(file.langPath, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`  ✅ Updated with ${keyCount} keys`);
  });
  
  const coverage = Math.round((translatedKeys / totalKeys) * 100);
  
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('                             COMPLETION SUMMARY                                ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`📊 Total Keys: ${totalKeys}`);
  console.log(`✅ Translated Keys: ${translatedKeys}`);
  console.log(`📈 Coverage: ${coverage}%`);
  console.log(`📁 Files Processed: ${files.length}`);
  
  console.log('\n📋 Next Steps:');
  console.log('1. Test in browser: http://localhost:5173?lng=bn');
  console.log('2. Review translations with native speaker');
  console.log('3. Run validation script');
  console.log('4. Proceed to Telugu (te) translations');
  
  // Save report
  const report = {
    language: 'Bengali',
    code: 'bn',
    userPercentage: '12%',
    totalKeys,
    translatedKeys,
    coverage: `${coverage}%`,
    files: files.length,
    timestamp: new Date().toISOString()
  };
  
  const reportPath = path.join(projectRoot, 'docs', 'reports', 'bengali-completion-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Report saved: ${reportPath}`);
}

// Run
completeBengali();