const fs = require('fs');
const path = require('path');

console.log('🚀 HINDI TRANSLATION COMPLETION INITIATIVE\n');
console.log('=' . repeat(80));
console.log('Team Lead: Starting comprehensive Hindi translation completion');
console.log('Target: 100% coverage with quality translations\n');

// Hindi translations for common form fields
const hindiTranslations = {
  // Placeholders
  placeholders: {
    firstName: "पहला नाम दर्ज करें",
    lastName: "अंतिम नाम दर्ज करें",
    email: "आपका.ईमेल@उदाहरण.com",
    phone: "+91 98765 43210",
    addressLine1: "मकान/भवन संख्या, गली का नाम",
    addressLine2: "क्षेत्र, लैंडमार्क",
    city: "शहर दर्ज करें",
    state: "राज्य चुनें",
    pincode: "6-अंकीय पिन कोड दर्ज करें",
    businessType: "व्यवसाय प्रकार चुनें",
    experienceYears: "अनुभव के वर्ष",
    currentOccupation: "जैसे, दुकान मालिक, किसान, कर्मचारी",
    annualIncome: "आय सीमा चुनें",
    investmentCapacity: "निवेश सीमा चुनें",
    preferredLocation: "वह क्षेत्र/गांव जहां आप एटीएम चाहते हैं",
    competitorATMs: "2 किमी त्रिज्या में एटीएम की संख्या",
    bankName: "बैंक का नाम",
    accountType: "खाता प्रकार चुनें",
    panCard: "ABCDE1234F",
    gstNumber: "जीएसटी पंजीकरण संख्या",
    referenceSource: "स्रोत चुनें",
    previousFranchise: "कोई पिछली फ्रेंचाइजी?",
    timelineToStart: "आप कब शुरू कर सकते हैं?",
    additionalComments: "कोई विशिष्ट प्रश्न या अतिरिक्त जानकारी जो आप साझा करना चाहेंगे..."
  },
  
  // Labels
  labels: {
    fullName: "पूरा नाम",
    email: "ईमेल पता",
    phone: "फोन नंबर",
    state: "राज्य",
    city: "शहर",
    message: "संदेश",
    noticePeriod: "नोटिस अवधि",
    permanentAddress: "स्थायी पता",
    currentAddress: "वर्तमान पता",
    panDocumentUpload: "पैन दस्तावेज़ अपलोड",
    aadhaarFront: "आधार कार्ड सामने की तरफ",
    aadhaarBack: "आधार कार्ड पीछे की तरफ",
    passportPhoto: "पासपोर्ट साइज फोटो",
    dateOfBirthPan: "पैन कार्ड के अनुसार जन्म तिथि",
    districtOfResidence: "निवास का जिला",
    aadhaarNumber: "आधार कार्ड नंबर (12 अंक)",
    languagesYouSpeak: "आप कौन सी भाषाएं बोल सकते हैं",
    whyJoinAgent: "आप सहस्र नेटवर्क के एजेंट के रूप में क्यों शामिल होना चाहते हैं",
    joiningAs: "आप किस रूप में शामिल हो रहे हैं (कृपया नीचे से चुनें):",
    professionalDetails: "पेशेवर विवरण और दस्तावेज़",
    onetime_cost: "एकमुश्त लागत",
    refundable_deposit: "वापसी योग्य जमा",
    clf_working_capital: "सीएलएफ और कार्यशील पूंजी",
    cash_transaction: "नकद लेनदेन",
    noncash_transaction: "गैर-नकद लेनदेन",
    ad_revenue_share: "विज्ञापन राजस्व हिस्सा"
  },
  
  // Buttons
  buttons: {
    submit: "जमा करें",
    cancel: "रद्द करें",
    next: "अगला",
    previous: "पिछला",
    save: "सहेजें",
    delete: "हटाएं",
    edit: "संपादित करें",
    upload: "अपलोड करें",
    download: "डाउनलोड करें",
    search: "खोजें",
    filter: "फ़िल्टर करें",
    reset: "रीसेट करें",
    confirm: "पुष्टि करें",
    close: "बंद करें",
    back: "वापस",
    continue: "जारी रखें",
    start: "शुरू करें",
    finish: "समाप्त करें",
    apply: "लागू करें",
    reject: "अस्वीकार करें"
  },
  
  // Validation messages
  validation: {
    required: "यह फ़ील्ड आवश्यक है",
    email: "कृपया एक मान्य ईमेल पता दर्ज करें",
    phone: "कृपया एक मान्य फोन नंबर दर्ज करें",
    min: "कम से कम {{min}} वर्ण आवश्यक हैं",
    max: "अधिकतम {{max}} वर्ण की अनुमति है",
    pattern: "कृपया सही प्रारूप में दर्ज करें",
    number: "कृपया एक मान्य संख्या दर्ज करें",
    url: "कृपया एक मान्य URL दर्ज करें",
    date: "कृपया एक मान्य तारीख दर्ज करें",
    alphanumeric: "केवल अक्षर और संख्याएं अनुमत हैं",
    password: "पासवर्ड कम से कम 8 वर्ण का होना चाहिए",
    confirmPassword: "पासवर्ड मेल नहीं खाता",
    aadhaar: "कृपया 12 अंकों का आधार नंबर दर्ज करें",
    pan: "कृपया मान्य पैन नंबर दर्ज करें (जैसे ABCDE1234F)",
    gst: "कृपया मान्य जीएसटी नंबर दर्ज करें",
    pincode: "कृपया 6 अंकों का पिन कोड दर्ज करें",
    fileSize: "फ़ाइल का आकार {{size}}MB से कम होना चाहिए",
    fileType: "केवल {{types}} फ़ाइलें अनुमत हैं"
  },
  
  // Error messages
  errors: {
    generic: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
    network: "नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।",
    server: "सर्वर त्रुटि। कृपया बाद में पुनः प्रयास करें।",
    unauthorized: "आप इस कार्रवाई के लिए अधिकृत नहीं हैं।",
    notFound: "अनुरोधित संसाधन नहीं मिला।",
    timeout: "अनुरोध का समय समाप्त हो गया। कृपया पुनः प्रयास करें।",
    fileUpload: "फ़ाइल अपलोड विफल। कृपया पुनः प्रयास करें।",
    invalidData: "अमान्य डेटा प्रदान किया गया।",
    sessionExpired: "आपका सत्र समाप्त हो गया है। कृपया फिर से लॉगिन करें।"
  },
  
  // Success messages
  success: {
    saved: "सफलतापूर्वक सहेजा गया",
    submitted: "सफलतापूर्वक जमा किया गया",
    updated: "सफलतापूर्वक अपडेट किया गया",
    deleted: "सफलतापूर्वक हटाया गया",
    uploaded: "सफलतापूर्वक अपलोड किया गया",
    sent: "सफलतापूर्वक भेजा गया",
    copied: "क्लिपबोर्ड पर कॉपी किया गया",
    registered: "सफलतापूर्वक पंजीकृत",
    verified: "सफलतापूर्वक सत्यापित"
  }
};

// Update Hindi forms.json
const formsPath = path.join(__dirname, '..', 'public', 'locales', 'hi', 'forms.json');
const enFormsPath = path.join(__dirname, '..', 'public', 'locales', 'en', 'forms.json');

try {
  const currentHindi = JSON.parse(fs.readFileSync(formsPath, 'utf8'));
  const englishForms = JSON.parse(fs.readFileSync(enFormsPath, 'utf8'));
  
  let updateCount = 0;
  let addedKeys = [];
  
  // Update placeholders
  if (currentHindi.joinUs && currentHindi.joinUs.placeholders) {
    Object.keys(hindiTranslations.placeholders).forEach(key => {
      if (currentHindi.joinUs.placeholders[key] && 
          /[a-zA-Z]/.test(currentHindi.joinUs.placeholders[key]) &&
          !/[\u0900-\u097F]/.test(currentHindi.joinUs.placeholders[key])) {
        currentHindi.joinUs.placeholders[key] = hindiTranslations.placeholders[key];
        updateCount++;
        addedKeys.push(`joinUs.placeholders.${key}`);
      }
    });
  }
  
  // Add missing labels
  if (!currentHindi.labels) {
    currentHindi.labels = {};
  }
  Object.keys(hindiTranslations.labels).forEach(key => {
    if (!currentHindi.labels[key] || /^[a-zA-Z\s]+$/.test(currentHindi.labels[key])) {
      currentHindi.labels[key] = hindiTranslations.labels[key];
      updateCount++;
      addedKeys.push(`labels.${key}`);
    }
  });
  
  // Add missing buttons
  if (!currentHindi.buttons) {
    currentHindi.buttons = {};
  }
  Object.keys(hindiTranslations.buttons).forEach(key => {
    if (!currentHindi.buttons[key]) {
      currentHindi.buttons[key] = hindiTranslations.buttons[key];
      updateCount++;
      addedKeys.push(`buttons.${key}`);
    }
  });
  
  // Add validation messages
  if (!currentHindi.validation) {
    currentHindi.validation = {};
  }
  Object.keys(hindiTranslations.validation).forEach(key => {
    if (!currentHindi.validation[key] || /^[a-zA-Z\s{}]+$/.test(currentHindi.validation[key])) {
      currentHindi.validation[key] = hindiTranslations.validation[key];
      updateCount++;
      addedKeys.push(`validation.${key}`);
    }
  });
  
  // Add error messages
  if (!currentHindi.errors) {
    currentHindi.errors = {};
  }
  Object.keys(hindiTranslations.errors).forEach(key => {
    if (!currentHindi.errors[key]) {
      currentHindi.errors[key] = hindiTranslations.errors[key];
      updateCount++;
      addedKeys.push(`errors.${key}`);
    }
  });
  
  // Add success messages
  if (!currentHindi.success) {
    currentHindi.success = {};
  }
  Object.keys(hindiTranslations.success).forEach(key => {
    if (!currentHindi.success[key]) {
      currentHindi.success[key] = hindiTranslations.success[key];
      updateCount++;
      addedKeys.push(`success.${key}`);
    }
  });
  
  // Write updated file
  fs.writeFileSync(formsPath, JSON.stringify(currentHindi, null, 2), 'utf8');
  
  console.log('✅ HINDI TRANSLATION UPDATE COMPLETE\n');
  console.log(`📊 Statistics:`);
  console.log(`  - Keys updated/added: ${updateCount}`);
  console.log(`  - Files modified: forms.json`);
  
  if (addedKeys.length > 0) {
    console.log(`\n📝 Sample of added/updated keys:`);
    addedKeys.slice(0, 10).forEach(key => {
      console.log(`  ✓ ${key}`);
    });
    if (addedKeys.length > 10) {
      console.log(`  ... and ${addedKeys.length - 10} more`);
    }
  }
  
  // Validation check
  console.log('\n🔍 Quality Validation:');
  let hindiCount = 0;
  let englishCount = 0;
  
  function validateObject(obj) {
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        if (/[\u0900-\u097F]/.test(value)) {
          hindiCount++;
        } else if (/[a-zA-Z]/.test(value) && !/[\u0900-\u097F]/.test(value)) {
          englishCount++;
        }
      } else if (typeof value === 'object' && value !== null) {
        validateObject(value);
      }
    });
  }
  
  validateObject(currentHindi);
  
  const coverage = ((hindiCount / (hindiCount + englishCount)) * 100).toFixed(1);
  console.log(`  Hindi text: ${hindiCount} keys`);
  console.log(`  English text: ${englishCount} keys`);
  console.log(`  Coverage: ${coverage}%`);
  
  if (coverage === '100.0') {
    console.log('\n🎉 ACHIEVEMENT: 100% Hindi coverage in forms.json!');
  } else {
    console.log(`\n⚠️  Still ${englishCount} keys need translation for 100% coverage`);
  }
  
} catch (error) {
  console.error('❌ Error updating Hindi translations:', error.message);
}

console.log('\n' + '=' . repeat(80));
console.log('Team Lead: Hindi translation phase complete. Moving to next language.');