const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING CRITICAL HINDI ISSUES - TEAM LEAD RAVI');
console.log('=' .repeat(60));

// CRITICAL FIX 1: Update products.json with missing keys
const productsTranslations = {
  "title": "हमारे एटीएम उत्पाद और सेवाएं",
  "subtitle": "आपकी आवश्यकताओं के अनुरूप व्यापक एटीएम फ्रैंचाइज़ी समाधान",
  "hero": {
    "badge": "समाधान",
    "title": "हमारे एटीएम उत्पाद",
    "subtitle": "व्यापक एटीएम फ्रैंचाइज़ी समाधान जो आपकी व्यावसायिक आवश्यकताओं को पूरा करते हैं"
  },
  "products": {
    "atm": {
      "title": "एटीएम फ्रैंचाइज़ी",
      "description": "RBI लाइसेंस प्राप्त WLA ऑपरेटरों के साथ पूर्ण एटीएम फ्रैंचाइज़ी समाधान",
      "features": {
        "deployment": "संपूर्ण परिनियोजन समर्थन",
        "training": "व्यापक प्रशिक्षण",
        "maintenance": "24/7 रखरखाव",
        "support": "निरंतर व्यावसायिक समर्थन"
      }
    },
    "kiosk": {
      "title": "बैंकिंग कियोस्क",
      "description": "मल्टी-सर्विस डिजिटल बैंकिंग कियोस्क समाधान",
      "features": {
        "services": "विविध सेवाएं",
        "interface": "उपयोगकर्ता-अनुकूल इंटरफेस",
        "integration": "बैंक एकीकरण",
        "analytics": "वास्तविक समय विश्लेषण"
      }
    },
    "pos": {
      "title": "POS टर्मिनल",
      "description": "व्यापारियों के लिए प्वाइंट ऑफ सेल समाधान",
      "features": {
        "acceptance": "सभी कार्ड स्वीकार करें",
        "settlement": "त्वरित निपटान",
        "reports": "विस्तृत रिपोर्ट",
        "integration": "सिस्टम एकीकरण"
      }
    }
  },
  "packages": {
    "title": "हमारे पैकेज",
    "subtitle": "अपनी आवश्यकताओं के अनुसार सही पैकेज चुनें",
    "basic": {
      "name": "बुनियादी",
      "price": "₹2-3 लाख",
      "features": [
        "सिंगल एटीएम स्थापना",
        "बुनियादी प्रशिक्षण",
        "3 महीने का समर्थन",
        "मानक स्थान"
      ]
    },
    "silver": {
      "name": "सिल्वर",
      "price": "₹3-4 लाख",
      "features": [
        "प्रीमियम स्थान",
        "उन्नत प्रशिक्षण",
        "6 महीने का समर्थन",
        "मार्केटिंग सहायता"
      ]
    },
    "gold": {
      "name": "गोल्ड",
      "price": "₹4-5 लाख",
      "features": [
        "प्राइम स्थान",
        "पूर्ण प्रशिक्षण",
        "1 वर्ष का समर्थन",
        "संपूर्ण व्यावसायिक सहायता"
      ]
    }
  }
};

// CRITICAL FIX 2: Fix forms namespace with all labels
const formsTranslations = {
  "title": "पूछताछ फॉर्म",
  "subtitle": "अपनी जानकारी भरें और हम आपसे संपर्क करेंगे",
  "labels": {
    "fullName": "पूरा नाम",
    "firstName": "पहला नाम",
    "lastName": "अंतिम नाम",
    "email": "ईमेल पता",
    "phone": "फोन नंबर",
    "alternatePhone": "वैकल्पिक फोन",
    "message": "संदेश",
    "address": "पता",
    "city": "शहर",
    "state": "राज्य",
    "pincode": "पिन कोड",
    "country": "देश",
    "investment": "निवेश राशि",
    "experience": "व्यावसायिक अनुभव",
    "location": "प्रस्तावित स्थान",
    "nearbyBusiness": "आस-पास के व्यवसाय",
    "footfall": "दैनिक फुटफॉल",
    "locationType": "स्थान का प्रकार",
    "landmark": "निकटतम लैंडमार्क",
    "businessType": "व्यवसाय का प्रकार",
    "currentOccupation": "वर्तमान व्यवसाय",
    "preferredLocation": "पसंदीदा स्थान",
    "howDidYouHear": "आपने हमारे बारे में कैसे सुना?"
  },
  "placeholders": {
    "fullName": "अपना पूरा नाम दर्ज करें",
    "firstName": "पहला नाम",
    "lastName": "अंतिम नाम",
    "email": "your.email@example.com",
    "phone": "98765 43210",
    "message": "अपना संदेश यहाँ लिखें...",
    "address": "अपना पूरा पता दर्ज करें",
    "city": "शहर का नाम",
    "pincode": "6 अंकों का पिन कोड",
    "investment": "निवेश राशि चुनें",
    "location": "प्रस्तावित एटीएम स्थान",
    "nearbyBusiness": "आस-पास के प्रमुख व्यवसाय",
    "footfall": "अनुमानित दैनिक फुटफॉल"
  },
  "validation": {
    "required": "यह फ़ील्ड आवश्यक है",
    "invalidEmail": "कृपया एक मान्य ईमेल पता दर्ज करें",
    "invalidPhone": "कृपया एक मान्य फोन नंबर दर्ज करें",
    "minLength": "न्यूनतम {{min}} अक्षर आवश्यक हैं",
    "maxLength": "अधिकतम {{max}} अक्षर अनुमत हैं",
    "invalidPincode": "कृपया 6 अंकों का वैध पिन कोड दर्ज करें"
  },
  "buttons": {
    "submit": "फॉर्म जमा करें",
    "submitEnquiry": "पूछताछ जमा करें",
    "submitApplication": "आवेदन जमा करें",
    "reset": "रीसेट करें",
    "cancel": "रद्द करें",
    "back": "वापस",
    "next": "अगला"
  },
  "success": {
    "title": "सफलतापूर्वक जमा किया गया!",
    "message": "धन्यवाद! हम 24 घंटे के भीतर आपसे संपर्क करेंगे।",
    "reference": "आपका संदर्भ संख्या: {{ref}}"
  },
  "options": {
    "investment": {
      "2to3": "₹2-3 लाख",
      "3to4": "₹3-4 लाख",
      "4to5": "₹4-5 लाख",
      "above5": "₹5 लाख से अधिक"
    },
    "locationType": {
      "market": "बाज़ार क्षेत्र",
      "residential": "आवासीय क्षेत्र",
      "commercial": "व्यावसायिक क्षेत्र",
      "highway": "राजमार्ग",
      "rural": "ग्रामीण क्षेत्र"
    }
  }
};

// CRITICAL FIX 3: Fix common namespace for breadcrumbs and footer
const commonUpdates = {
  "breadcrumb": {
    "home": "मुख्य पृष्ठ",
    "hi": "हिंदी",
    "aboutUs": "हमारे बारे में",
    "contactUs": "संपर्क करें",
    "products": "उत्पाद",
    "franchise": "फ्रैंचाइज़ी"
  },
  "copyright": "© 2025 एटीएम फ्रैंचाइज़ इंडिया। सर्वाधिकार सुरक्षित। | केवल RBI लाइसेंस प्राप्त भागीदार",
  "stats": {
    "secure": "100% सुरक्षित",
    "response": "24 घंटे प्रतिक्रिया",
    "partners": "200+ भागीदार",
    "uptime": "99.9% अपटाइम"
  }
};

// Function to update JSON files
function updateJsonFile(namespace, newData) {
  const filePath = `public/locales/hi/${namespace}.json`;
  
  try {
    let existing = {};
    if (fs.existsSync(filePath)) {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Deep merge
    const merged = deepMerge(existing, newData);
    
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Updated ${namespace}.json`);
    return true;
  } catch (error) {
    console.error(`❌ Error updating ${namespace}.json:`, error.message);
    return false;
  }
}

function deepMerge(target, source) {
  const output = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}

// Execute updates
console.log('\n📝 Updating Hindi Translation Files...\n');

updateJsonFile('products', productsTranslations);
updateJsonFile('forms', formsTranslations);
updateJsonFile('common', commonUpdates);

// Create location namespace if it doesn't exist
const locationTranslations = {
  "title": "एटीएम स्थान जमा करें",
  "subtitle": "अपने प्रस्तावित एटीएम स्थान का विवरण प्रदान करें",
  "form": {
    "title": "स्थान विवरण",
    "labels": {
      "name": "आपका नाम",
      "email": "ईमेल पता",
      "phone": "फोन नंबर",
      "address": "प्रस्तावित स्थान का पता",
      "landmark": "निकटतम लैंडमार्क",
      "pincode": "पिन कोड",
      "state": "राज्य",
      "city": "शहर",
      "locationType": "स्थान का प्रकार",
      "footfall": "दैनिक फुटफॉल",
      "nearbyBusiness": "आस-पास के व्यवसाय"
    },
    "buttons": {
      "submit": "विश्लेषण के लिए जमा करें",
      "reset": "फॉर्म रीसेट करें"
    }
  },
  "stats": {
    "analyzed": "स्थान विश्लेषित",
    "time": "विश्लेषण समय",
    "success": "सफलता दर",
    "partners": "सक्रिय भागीदार"
  }
};

updateJsonFile('location', locationTranslations);

console.log('\n✅ Critical Hindi translation files updated!');
console.log('\n📋 Next Steps:');
console.log('1. Fix component files to use t() function');
console.log('2. Test all pages in Hindi mode');
console.log('3. Take screenshots as proof');

// Generate status report
const report = {
  timestamp: new Date().toISOString(),
  filesUpdated: ['products.json', 'forms.json', 'common.json', 'location.json'],
  criticalFixesApplied: [
    'Products page translation keys',
    'Form labels and placeholders',
    'Breadcrumb Hindi display',
    'Footer copyright in Hindi',
    'Stats section translations'
  ],
  remainingWork: [
    'Fix AboutUs.tsx hardcoded text (60 instances)',
    'Fix JoinUsPage.tsx hardcoded text (50 instances)',
    'Update component files to use translations',
    'Test and verify all pages'
  ]
};

fs.writeFileSync('critical-fixes-report.json', JSON.stringify(report, null, 2));
console.log('\n📊 Report saved to critical-fixes-report.json');