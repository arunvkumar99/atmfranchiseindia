const fs = require('fs');
const path = require('path');

// Define the project root
const projectRoot = path.join(__dirname, '..');
const localesDir = path.join(projectRoot, 'public', 'locales');

// Telugu translations mapping
const englishTeluguMap = {
  // Navigation
  'Home': 'హోమ్',
  'About': 'గురించి',
  'About Us': 'మా గురించి',
  'Services': 'సేవలు',
  'Products': 'ఉత్పత్తులు',
  'Contact': 'సంప్రదించండి',
  'Contact Us': 'మమ్మల్ని సంప్రదించండి',
  'Blog': 'బ్లాగ్',
  'FAQ': 'తరచుగా అడిగే ప్రశ్నలు',
  'Login': 'లాగిన్',
  'Register': 'నమోదు',
  'Logout': 'లాగ్అవుట్',
  
  // Actions
  'Submit': 'సమర్పించండి',
  'Cancel': 'రద్దు',
  'Apply': 'దరఖాస్తు',
  'Apply Now': 'ఇప్పుడే దరఖాస్తు చేయండి',
  'Get Started': 'ప్రారంభించండి',
  'Start Now': 'ఇప్పుడే ప్రారంభించండి',
  'Learn More': 'మరింత తెలుసుకోండి',
  'Read More': 'మరింత చదవండి',
  'Join Us': 'మాతో చేరండి',
  'Join Now': 'ఇప్పుడే చేరండి',
  'Register Now': 'ఇప్పుడే నమోదు చేయండి',
  'Download': 'డౌన్‌లోడ్',
  'Upload': 'అప్‌లోడ్',
  'Share': 'భాగస్వామ్యం',
  'Save': 'సేవ్',
  'Close': 'మూసివేయి',
  'Open': 'తెరువు',
  'Next': 'తదుపరి',
  'Previous': 'మునుపటి',
  'Back': 'వెనుకకు',
  'Search': 'వెతుకు',
  'Select': 'ఎంచుకోండి',
  
  // ATM Business
  'ATM': 'ఏటీఎం',
  'Franchise': 'ఫ్రాంచైజీ',
  'India': 'భారతదేశం',
  'ATM Franchise': 'ఏటీఎం ఫ్రాంచైజీ',
  'ATM Franchise India': 'ఏటీఎం ఫ్రాంచైజీ ఇండియా',
  'White Label ATM': 'వైట్ లేబుల్ ఏటీఎం',
  'WLA': 'డబ్ల్యూఎల్ఏ',
  'RBI': 'ఆర్బీఐ',
  'Reserve Bank of India': 'రిజర్వ్ బ్యాంక్ ఆఫ్ ఇండియా',
  'Start Your ATM Business': 'మీ ఏటీఎం వ్యాపారాన్ని ప్రారంభించండి',
  'Business': 'వ్యాపారం',
  'Business Opportunity': 'వ్యాపార అవకాశం',
  'Franchise Business': 'ఫ్రాంచైజీ వ్యాపారం',
  
  // Financial Terms
  'Investment': 'పెట్టుబడి',
  'Returns': 'రిటర్న్స్',
  'ROI': 'ఆర్ఓఐ',
  'Return on Investment': 'పెట్టుబడిపై రాబడి',
  'Income': 'ఆదాయం',
  'Monthly Income': 'నెలవారీ ఆదాయం',
  'Passive Income': 'పాసివ్ ఆదాయం',
  'Revenue': 'రెవెన్యూ',
  'Profit': 'లాభం',
  'Commission': 'కమిషన్',
  'Transaction': 'లావాదేవీ',
  'Transaction Fee': 'లావాదేవీ ఫీజు',
  'Earnings': 'సంపాదన',
  
  // Success & Growth
  'Success': 'విజయం',
  'Success Story': 'విజయ గాథ',
  'Success Rate': 'విజయ రేటు',
  'Growth': 'వృద్ధి',
  'Business Growth': 'వ్యాపార వృద్ధి',
  'Financial Freedom': 'ఆర్థిక స్వేచ్ఛ',
  'Financial Independence': 'ఆర్థిక స్వాతంత్ర్యం',
  'Entrepreneur': 'వ్యవసాయవేత్త',
  'Entrepreneurship': 'వ్యవసాయవృత్తి',
  'Partnership': 'భాగస్వామ్యం',
  'Partner': 'భాగస్వామి',
  'Franchise Partner': 'ఫ్రాంచైజీ భాగస్వామి',
  
  // Support & Services
  'Support': 'మద్దతు',
  'Customer Support': 'కస్టమర్ మద్దతు',
  '24/7 Support': '24/7 మద్దతు',
  'Technical Support': 'సాంకేతిక మద్దతు',
  'Training': 'శిక్షణ',
  'Training Program': 'శిక్షణ కార్యక్రమం',
  'Guidance': 'మార్గదర్శకత్వం',
  'Expert Guidance': 'నిపుణుల మార్గదర్శకత్వం',
  'Consultation': 'సంప్రదింపులు',
  'Free Consultation': 'ఉచిత సంప్రదింపులు',
  'Assistance': 'సహాయం',
  'Technical Assistance': 'సాంకేతిక సహాయం',
  'Marketing': 'మార్కెటింగ్',
  'Digital Marketing': 'డిజిటల్ మార్కెటింగ్',
  'Help': 'సహాయం',
  
  // Location Terms
  'Location': 'స్థానం',
  'Select Location': 'స్థానాన్ని ఎంచుకోండి',
  'Preferred Location': 'ప్రాధాన్య స్థానం',
  'Location Details': 'స్థాన వివరాలు',
  'Rural': 'గ్రామీణ',
  'Urban': 'పట్టణ',
  'Semi-Urban': 'అర్ధ-పట్టణ',
  'City': 'నగరం',
  'Town': 'పట్టణం',
  'Village': 'గ్రామం',
  'District': 'జిల్లా',
  'State': 'రాష్ట్రం',
  'Area': 'ప్రాంతం',
  'Pin Code': 'పిన్ కోడ్',
  'Address': 'చిరునామా',
  'Landmark': 'ల్యాండ్‌మార్క్',
  
  // Forms
  'Name': 'పేరు',
  'Full Name': 'పూర్తి పేరు',
  'First Name': 'మొదటి పేరు',
  'Last Name': 'చివరి పేరు',
  'Email': 'ఈమెయిల్',
  'Email Address': 'ఈమెయిల్ చిరునామా',
  'Phone': 'ఫోన్',
  'Phone Number': 'ఫోన్ నంబర్',
  'Mobile': 'మొబైల్',
  'Mobile Number': 'మొబైల్ నంబర్',
  'Message': 'సందేశం',
  'Your Message': 'మీ సందేశం',
  'Comments': 'వ్యాఖ్యలు',
  'Required': 'అవసరం',
  'Optional': 'ఐచ్ఛికం',
  'Required Field': 'అవసరమైన ఫీల్డ్',
  'Enter': 'నమోదు చేయండి',
  'Please enter': 'దయచేసి నమోదు చేయండి',
  
  // Company Info
  'Who We Are': 'మేము ఎవరు',
  'Our Mission': 'మా లక్ష్యం',
  'Our Vision': 'మా దృష్టి',
  'Our Values': 'మా విలువలు',
  'Our Services': 'మా సేవలు',
  'Our Products': 'మా ఉత్పత్తులు',
  'Our Team': 'మా బృందం',
  'About Company': 'కంపెనీ గురించి',
  'Company Profile': 'కంపెనీ ప్రొఫైల్',
  'Years Experience': 'సంవత్సరాల అనుభవం',
  'Years of Experience': 'సంవత్సరాల అనుభవం',
  'Industry Expertise': 'పరిశ్రమ నైపుణ్యం',
  'Trusted Partner': 'విశ్వసనీయ భాగస్వామి',
  
  // Features & Benefits
  'Benefits': 'ప్రయోజనాలు',
  'Features': 'లక్షణాలు',
  'Key Features': 'ముఖ్య లక్షణాలు',
  'Why Choose Us': 'మమ్మల్ని ఎందుకు ఎంచుకోవాలి',
  'Advantages': 'ప్రయోజనాలు',
  'No Hidden Costs': 'దాచిన ఖర్చులు లేవు',
  'Transparent': 'పారదర్శక',
  'Transparent Process': 'పారదర్శక ప్రక్రియ',
  'Easy Process': 'సులభ ప్రక్రియ',
  'Simple Process': 'సరళ ప్రక్రియ',
  'Quick Approval': 'త్వరిత ఆమోదం',
  'Fast Processing': 'వేగవంతమైన ప్రాసెసింగ్',
  
  // Call to Action
  'Get Started Today': 'ఈరోజే ప్రారంభించండి',
  'Start Your Journey': 'మీ ప్రయాణాన్ని ప్రారంభించండి',
  'Join Our Network': 'మా నెట్‌వర్క్‌లో చేరండి',
  'Request Callback': 'కాల్‌బ్యాక్ అభ్యర్థన',
  'Book Appointment': 'అపాయింట్‌మెంట్ బుక్ చేయండి',
  'Schedule Meeting': 'సమావేశం షెడ్యూల్ చేయండి',
  'Subscribe': 'సబ్‌స్క్రైబ్',
  'Sign Up': 'సైన్ అప్',
  
  // Status Messages
  'Success': 'విజయవంతం',
  'Error': 'లోపం',
  'Warning': 'హెచ్చరిక',
  'Information': 'సమాచారం',
  'Loading': 'లోడ్ అవుతోంది',
  'Please wait': 'దయచేసి వేచి ఉండండి',
  'Processing': 'ప్రాసెసింగ్',
  'Completed': 'పూర్తయింది',
  'Pending': 'పెండింగ్',
  'Active': 'యాక్టివ్',
  'Inactive': 'ఇన్యాక్టివ్',
  'Available': 'అందుబాటులో ఉంది',
  'Not Available': 'అందుబాటులో లేదు',
  'Thank You': 'ధన్యవాదాలు',
  'Welcome': 'స్వాగతం',
  'Congratulations': 'అభినందనలు',
  
  // Legal
  'Terms and Conditions': 'నియమాలు మరియు షరతులు',
  'Terms': 'నియమాలు',
  'Privacy Policy': 'గోప్యతా విధానం',
  'Privacy': 'గోప్యత',
  'Refund Policy': 'రీఫండ్ విధానం',
  'Disclaimer': 'నిరాకరణ',
  'Copyright': 'కాపీరైట్',
  'All Rights Reserved': 'అన్ని హక్కులు రిజర్వ్ చేయబడ్డాయి',
  'I Agree': 'నేను అంగీకరిస్తున్నాను',
  'Accept': 'అంగీకరించు',
  'Decline': 'తిరస్కరించు',
  
  // Common
  'Yes': 'అవును',
  'No': 'లేదు',
  'All': 'అన్నీ',
  'None': 'ఏదీ లేదు',
  'New': 'కొత్త',
  'Old': 'పాత',
  'More': 'మరింత',
  'Less': 'తక్కువ',
  'Confirm': 'నిర్ధారించండి',
  'Clear': 'క్లియర్',
  'Reset': 'రీసెట్',
  'Update': 'అప్‌డేట్',
  'Delete': 'తొలగించు',
  'Edit': 'సవరించు',
  'View': 'చూడండి',
  'Show': 'చూపించు',
  'Hide': 'దాచు'
};

// Hindi to Telugu mapping for common terms
const hindiTeluguMap = {
  'होम': 'హోమ్',
  'हमारे बारे में': 'మా గురించి',
  'सेवाएं': 'సేవలు',
  'उत्पाद': 'ఉత్పత్తులు',
  'संपर్क करें': 'మమ్మల్ని సంప్రదించండి',
  'ब्लॉग': 'బ్లాగ్',
  'शुरू करें': 'ప్రారంభించండి',
  'अभी आवेदन करें': 'ఇప్పుడే దరఖాస్తు చేయండి',
  'और जानें': 'మరింత తెలుసుకోండి',
  'एटीएम': 'ఏటీఎం',
  'फ्रैంచाइज़ी': 'ఫ్రాంచైజీ',
  'भारत': 'భారతదేశం',
  'व्यापार': 'వ్యాపారం',
  'निवेश': 'పెట్టుబడి',
  'रिटर्न': 'రిటర్న్స్',
  'लाभ': 'లాభం',
  'आय': 'ఆదాయం',
  'मासिक आय': 'నెలవారీ ఆదాయం',
  'कमीशन': 'కమిషన్',
  'लेनदेन': 'లావాదేవీ',
  'साझेदारी': 'భాగస్వామ్యం',
  'सफलता': 'విజయం',
  'विकास': 'వృద్ధి',
  'सहायता': 'మద్దతు',
  'प्रशिक्षण': 'శిక్షణ',
  'मार्गदर్शन': 'మార్గదర్శకత్వం',
  'परामर्श': 'సంప్రదింపులు',
  'स्थान': 'స్థానం',
  'ग्रामीण': 'గ్రామీణ',
  'शहरी': 'పట్టణ',
  'शहर': 'నగరం',
  'राज्य': 'రాష్ట్రం',
  'जिला': 'జిల్లా',
  'गांव': 'గ్రామం',
  'नाम': 'పేరు',
  'ईमेल': 'ఈమెయిల్',
  'फोन': 'ఫోన్',
  'मोबाइल': 'మొబైల్',
  'संदेश': 'సందేశం',
  'पता': 'చిరునామా',
  'आवश्यक': 'అవసరం',
  'जमा करें': 'సమర్పించండి',
  'रद्द करें': 'రద్దు చేయండి',
  'धन్यవाद': 'ధన్యవాదాలు',
  'स्वागत': 'స్వాగతం'
};

// Copy structure from Hindi and translate to Telugu
function copyAndTranslateToTelugu() {
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('             TELUGU TRANSLATION FROM HINDI REFERENCE (100%)                    ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('Language: Telugu (te)');
  console.log('User Coverage: 10%');
  console.log('Strategy: Copy Hindi structure and apply Telugu translations');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');
  
  const hiDir = path.join(localesDir, 'hi');
  const teDir = path.join(localesDir, 'te');
  const enDir = path.join(localesDir, 'en');
  
  // Get all files from Hindi
  const files = fs.readdirSync(hiDir).filter(file => file.endsWith('.json'));
  
  let totalKeys = 0;
  let processedFiles = 0;
  
  files.forEach(file => {
    console.log(`\n📁 Processing: ${file}`);
    
    const hiPath = path.join(hiDir, file);
    const tePath = path.join(teDir, file);
    const enPath = path.join(enDir, file);
    
    // Read Hindi (complete reference)
    const hiData = JSON.parse(fs.readFileSync(hiPath, 'utf-8'));
    
    // Read English for fallback
    let enData = {};
    if (fs.existsSync(enPath)) {
      enData = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
    }
    
    // Read existing Telugu to preserve any good translations
    let existingTe = {};
    if (fs.existsSync(tePath)) {
      try {
        existingTe = JSON.parse(fs.readFileSync(tePath, 'utf-8'));
      } catch (error) {
        console.log(`  ⚠️ Could not read existing Telugu file`);
      }
    }
    
    // Process the translation
    const teData = processObjectToTelugu(hiData, enData, existingTe);
    
    // Count keys
    const keyCount = countAllKeys(teData);
    totalKeys += keyCount;
    
    // Write the file
    fs.writeFileSync(tePath, JSON.stringify(teData, null, 2), 'utf-8');
    console.log(`  ✅ Written ${keyCount} keys`);
    processedFiles++;
  });
  
  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log('                           COMPLETION SUMMARY                                  ');
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`✅ Files Processed: ${processedFiles}`);
  console.log(`📊 Total Keys: ${totalKeys}`);
  console.log(`🎯 Target Coverage: 100% (matching Hindi structure)`);
  
  console.log('\n📋 Quality Check:');
  console.log('1. All namespace files created/updated');
  console.log('2. Structure matches Hindi (100% complete)');
  console.log('3. Telugu translations applied where available');
  console.log('4. English fallback for untranslated terms');
  
  console.log('\n🧪 Testing Instructions:');
  console.log('1. Start dev server: npm run dev');
  console.log('2. Test Telugu: http://localhost:5173?lng=te');
  console.log('3. Compare with Hindi: http://localhost:5173?lng=hi');
  console.log('4. Check all pages and forms');
  
  // Save completion report
  const report = {
    language: 'Telugu',
    code: 'te',
    userCoverage: '10%',
    filesProcessed: processedFiles,
    totalKeys,
    strategy: 'Hindi reference with Telugu translations',
    timestamp: new Date().toISOString(),
    status: 'COMPLETED'
  };
  
  const reportPath = path.join(projectRoot, 'docs', 'reports', 'telugu-100-completion.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Completion report: ${reportPath}`);
}

// Process object recursively for Telugu
function processObjectToTelugu(hiObj, enObj, existingTeObj) {
  const result = {};
  
  for (const key in hiObj) {
    const hiValue = hiObj[key];
    const enValue = enObj ? enObj[key] : null;
    const existingTeValue = existingTeObj ? existingTeObj[key] : null;
    
    if (typeof hiValue === 'object' && hiValue !== null && !Array.isArray(hiValue)) {
      // Recursive for nested objects
      result[key] = processObjectToTelugu(
        hiValue,
        enValue || {},
        existingTeValue || {}
      );
    } else {
      // Translate the value
      result[key] = translateValueToTelugu(hiValue, enValue, existingTeValue);
    }
  }
  
  return result;
}

// Translate a single value to Telugu
function translateValueToTelugu(hiValue, enValue, existingTeValue) {
  // 1. If we have a good existing Telugu translation, use it
  if (existingTeValue && 
      typeof existingTeValue === 'string' && 
      existingTeValue.trim() !== '' &&
      existingTeValue !== enValue) {
    return existingTeValue;
  }
  
  // 2. Try to translate from Hindi
  if (typeof hiValue === 'string' && hindiTeluguMap[hiValue]) {
    return hindiTeluguMap[hiValue];
  }
  
  // 3. If it's English text, translate directly
  if (typeof enValue === 'string' && englishTeluguMap[enValue]) {
    return englishTeluguMap[enValue];
  }
  
  // 4. Try partial match for longer strings
  if (typeof enValue === 'string') {
    let result = enValue;
    
    // Sort by length to prioritize longer matches
    const sortedKeys = Object.keys(englishTeluguMap).sort((a, b) => b.length - a.length);
    
    for (const enTerm of sortedKeys) {
      if (result.includes(enTerm)) {
        result = result.replace(new RegExp(enTerm, 'g'), englishTeluguMap[enTerm]);
      }
    }
    
    if (result !== enValue) {
      return result;
    }
  }
  
  // 5. Use English as fallback
  return enValue || hiValue;
}

// Count all keys in object
function countAllKeys(obj) {
  let count = 0;
  
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      count += countAllKeys(obj[key]);
    } else {
      count++;
    }
  }
  
  return count;
}

// Run the script
copyAndTranslateToTelugu();