#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Missing translation keys that need to be added
const missingKeys = {
  forms: {
    // General form labels
    gender: {
      label: "अपना लिंग चुनें",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य"
    },
    dateOfBirth: {
      day: "दिन",
      month: "महीना",
      year: "वर्ष"
    },
    months: {
      may: "मई"
    },
    whatsapp: {
      placeholder: "व्हाट्सएप सक्रिय नंबर"
    },
    pan: {
      labelWithFormat: "पैन कार्ड नंबर (प्रारूप: ABCDE1234F)",
      placeholder: "ABCDE1234F"
    },
    state: {
      label: "अपना राज्य चुनें",
      placeholder: "अपना राज्य चुनें"
    },
    validation: {
      correctFields: "कृपया निम्नलिखित फ़ील्ड सही करें",
      email: "कृपया एक वैध ईमेल पता दर्ज करें (उदा., example@email.com)",
      phone: "कृपया एक वैध 10-अंकीय भारतीय फोन नंबर दर्ज करें",
      pan: "कृपया प्रारूप ABCDE1234F में एक वैध पैन नंबर दर्ज करें",
      aadhaar: "कृपया एक वैध 12-अंकीय आधार नंबर दर्ज करें",
      required: "आवश्यक"
    },
    error: {
      tryAgainOrContact: "कृपया पुनः प्रयास करें या हमसे सीधे संपर्क करें",
      fileUpload: "फ़ाइल अपलोड विफल। कृपया अपनी फ़ाइलों की जाँच करें और पुनः प्रयास करें",
      network: "नेटवर्क त्रुटि। कृपया अपने कनेक्शन की जाँच करें और पुनः प्रयास करें",
      cameraError: "कैमरा त्रुटि"
    },
    
    // Specific form fields
    termsRequired: "नियम और शर्तें आवश्यक",
    occupationPlaceholder: "उदा., दुकान मालिक, किसान, कर्मचारी",
    selectIncomeRange: "आय सीमा चुनें",
    selectInvestmentRange: "निवेश सीमा चुनें",
    selectAccountType: "खाता प्रकार चुनें",
    selectSource: "स्रोत चुनें",
    previousFranchise: "कोई पिछली फ्रेंचाइज़ी?",
    whenStart: "आप कब शुरू कर सकते हैं?",
    
    // Account types
    accountTypes: {
      ccod: "सीसी/ओडी खाता"
    },
    
    // Sources
    sources: {
      friendReferral: "मित्र/परिवार रेफरल",
      newspaper: "समाचार पत्र/पत्रिका"
    },
    
    // Franchise
    franchise: {
      yesSuccessful: "हाँ, सफल अनुभव",
      yesChallenges: "हाँ, चुनौतियों का सामना किया"
    },
    
    // Timeline
    timeline: {
      "2to3months": "2-3 महीने",
      "3to6months": "3-6 महीने",
      "6monthsPlus": "6+ महीने"
    },
    
    // Job-related
    selectJobPosition: "नौकरी का पद चुनें",
    contactNumberPlaceholder: "आपका संपर्क नंबर",
    cityStatePlaceholder: "शहर, राज्य",
    jobApplicationSubmitted: "नौकरी आवेदन सबमिट किया गया!",
    submittingApplication: "आवेदन सबमिट कर रहे हैं...",
    submitJobApplication: "नौकरी आवेदन सबमिट करें",
    
    // Notice periods
    noticePeriod: {
      "15days": "15 दिन",
      "1month": "1 महीना",
      "2months": "2 महीने",
      "3months": "3 महीने"
    },
    
    // Labels
    labels: {
      permanentAddress: "स्थायी पता",
      currentAddress: "वर्तमान पता",
      panDocumentUpload: "पैन दस्तावेज़ अपलोड",
      noticePeriod: "नोटिस अवधि",
      state: "राज्य",
      preview: "पूर्वावलोकन"
    },
    
    // Buttons
    buttons: {
      chooseFile: "फ़ाइल चुनें",
      cancel: "रद्द करें",
      uploadFile: "फ़ाइल अपलोड करें",
      selectFile: "फ़ाइल चुनें",
      submitting: "सबमिट हो रहा है...",
      submitInfluencerApplication: "इन्फ्लुएंसर आवेदन सबमिट करें",
      submit: "सबमिट करें",
      save: "सहेजें",
      add: "जोड़ें",
      remove: "हटाएं",
      delete: "डिलीट करें",
      edit: "संपादित करें",
      update: "अपडेट करें",
      next: "अगला",
      previous: "पिछला",
      back: "वापस",
      continue: "जारी रखें"
    },
    
    // Messages
    messages: {
      influencerApplicationSubmitted: "इन्फ्लुएंसर आवेदन सबमिट किया गया!"
    },
    
    // Status
    status: {
      loading: "लोड हो रहा है...",
      processing: "प्रोसेसिंग...",
      pleaseWait: "कृपया प्रतीक्षा करें...",
      success: "सफल!",
      error: "त्रुटि!"
    },
    
    // UnifiedForm
    successTitle: "सफलता!",
    errorTitle: "त्रुटि",
    emailAddress: "ईमेल पता",
    additionalInfo: "अतिरिक्त जानकारी",
    submitLocation: "स्थान सबमिट करें",
    locationAddress: "स्थान का पता",
    uploadRequiredDocument: "आवश्यक दस्तावेज़ अपलोड करें",
    preview: "पूर्वावलोकन",
    removeFile: "फ़ाइल हटाएं",
    fileSelected: "फ़ाइल चयनित",
    noFileSelected: "कोई फ़ाइल नहीं चुनी गई",
    clickToUpload: "अपलोड करने के लिए क्लिक करें",
    orDragAndDrop: "या ड्रैग और ड्रॉप करें",
    takePhoto: "फोटो लें",
    chooseFromGallery: "गैलरी से चुनें",
    processing: "प्रोसेसिंग...",
    
    // Placeholders
    placeholders: {
      enterYourDistrict: "अपना जिला दर्ज करें",
      enterYourPermanentAddress: "अपना स्थायी पता दर्ज करें",
      enterYourCurrentAddress: "अपना वर्तमान पता दर्ज करें",
      selectNoticePeriod: "नोटिस अवधि चुनें",
      preferredLocation: "क्षेत्र/गांव जहां आप एटीएम चाहते हैं",
      competitorATMs: "2 किमी के दायरे में एटीएम की संख्या"
    },
    
    // Investment ranges
    investment: {
      "5to10L": "₹5 - 10 लाख",
      "10to15L": "₹10 - 15 लाख", 
      "15to25L": "₹15 - 25 लाख",
      "above25L": "₹25 लाख से ऊपर"
    }
  }
};

// Load existing Hindi translations
const hindiFilePath = path.join(process.cwd(), 'public', 'locales', 'hi', 'forms.json');
let hindiData = {};

if (fs.existsSync(hindiFilePath)) {
  hindiData = JSON.parse(fs.readFileSync(hindiFilePath, 'utf8'));
}

// Deep merge function
function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      if (!target[key]) {
        target[key] = source[key];
      }
    }
  }
  return target;
}

// Merge missing keys
deepMerge(hindiData, missingKeys);

// Write updated translations
fs.writeFileSync(hindiFilePath, JSON.stringify(hindiData, null, 2), 'utf8');

console.log('✅ Added missing Hindi translation keys to forms.json');
console.log(`📁 File updated: ${hindiFilePath}`);

// Also update English forms.json for consistency
const englishFilePath = path.join(process.cwd(), 'public', 'locales', 'en', 'forms.json');
if (fs.existsSync(englishFilePath)) {
  let englishData = JSON.parse(fs.readFileSync(englishFilePath, 'utf8'));
  
  // Create English versions of the same keys
  const englishKeys = JSON.parse(JSON.stringify(missingKeys).replace(/[अ-ौ०-९]/g, match => {
    // This is a simple placeholder - in reality you'd want proper translations
    return match;
  }));
  
  // For English, use the key structure but with English values
  englishKeys.forms = {
    gender: {
      label: "Select Your Gender",
      male: "Male",
      female: "Female",
      other: "Other"
    },
    dateOfBirth: {
      day: "Day",
      month: "Month",
      year: "Year"
    },
    months: {
      may: "May"
    },
    // ... etc (keeping English values)
  };
  
  deepMerge(englishData, englishKeys);
  fs.writeFileSync(englishFilePath, JSON.stringify(englishData, null, 2), 'utf8');
  console.log(`📁 Also updated English: ${englishFilePath}`);
}

console.log('\n🎯 Next step: Run the hardcoded text scan again to verify coverage');