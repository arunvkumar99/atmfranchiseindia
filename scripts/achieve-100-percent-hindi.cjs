const fs = require('fs');
const path = require('path');

console.log('🎯 TEAM LEAD RAVI: 100% Hindi Coverage Implementation Plan');
console.log('=' .repeat(60));
console.log('Working Directory: C:/Users/arunv/AppData/Local/Programs/Microsoft VS Code/atmfranchiseindia\n');

// Define all pages that need 100% Hindi
const PAGES_TO_FIX = [
  { file: 'src/pages/Home.tsx', namespace: 'home' },
  { file: 'src/pages/AboutUs.tsx', namespace: 'about' },
  { file: 'src/pages/ContactUs.tsx', namespace: 'contact' },
  { file: 'src/pages/OurProducts.tsx', namespace: 'products' },
  { file: 'src/pages/BecomefranchisePage.tsx', namespace: 'franchise' },
  { file: 'src/pages/SubmitLocation.tsx', namespace: 'location' },
  { file: 'src/pages/PrivacyPolicy.tsx', namespace: 'privacy' },
  { file: 'src/pages/TermsConditions.tsx', namespace: 'terms' },
  { file: 'src/pages/RefundPolicy.tsx', namespace: 'refund' },
  { file: 'src/pages/AgentPage.tsx', namespace: 'agent' },
  { file: 'src/pages/InfluencerPage.tsx', namespace: 'influencer' },
  { file: 'src/pages/JoinUsPage.tsx', namespace: 'forms' },
  { file: 'src/pages/AccessibilityStatement.tsx', namespace: 'accessibility' }
];

// Complete Hindi translations for critical missing content
const COMPLETE_HINDI_TRANSLATIONS = {
  common: {
    "buttons": {
      "submit": "जमा करें",
      "submitForm": "फॉर्म जमा करें",
      "submitEnquiry": "पूछताछ जमा करें",
      "cancel": "रद्द करें",
      "back": "वापस",
      "next": "अगला",
      "previous": "पिछला",
      "close": "बंद करें",
      "apply": "लागू करें",
      "clear": "साफ़ करें",
      "search": "खोजें",
      "learnMore": "और जानें",
      "getStarted": "शुरू करें",
      "contactUs": "संपर्क करें",
      "joinNow": "अभी जुड़ें"
    },
    "forms": {
      "labels": {
        "fullName": "पूरा नाम",
        "firstName": "पहला नाम",
        "lastName": "अंतिम नाम",
        "email": "ईमेल",
        "phone": "फोन नंबर",
        "message": "संदेश",
        "address": "पता",
        "city": "शहर",
        "state": "राज्य",
        "pincode": "पिन कोड",
        "country": "देश",
        "investment": "निवेश राशि",
        "experience": "अनुभव"
      },
      "placeholders": {
        "enterName": "अपना नाम दर्ज करें",
        "enterEmail": "अपना ईमेल दर्ज करें",
        "enterPhone": "अपना फोन नंबर दर्ज करें",
        "enterMessage": "अपना संदेश दर्ज करें",
        "selectState": "राज्य चुनें",
        "selectCity": "शहर चुनें"
      },
      "validation": {
        "required": "यह फ़ील्ड आवश्यक है",
        "invalidEmail": "अमान्य ईमेल पता",
        "invalidPhone": "अमान्य फोन नंबर",
        "minLength": "न्यूनतम {{min}} अक्षर आवश्यक",
        "maxLength": "अधिकतम {{max}} अक्षर अनुमत"
      },
      "success": {
        "submitted": "सफलतापूर्वक जमा किया गया",
        "thankyou": "धन्यवाद! हम जल्द ही संपर्क करेंगे"
      }
    },
    "navigation": {
      "breadcrumb": {
        "home": "मुख्य पृष्ठ",
        "hindi": "हिंदी"
      }
    },
    "footer": {
      "copyright": "© 2025 एटीएम फ्रैंचाइज़ इंडिया। सर्वाधिकार सुरक्षित। | केवल RBI लाइसेंस प्राप्त भागीदार"
    },
    "stats": {
      "secure": "सुरक्षित",
      "response": "प्रतिक्रिया",
      "uptime": "अपटाइम",
      "support": "सहायता"
    }
  },
  about: {
    "testimonials": {
      "title": "हमारे भागीदारों से वास्तविक परिणाम",
      "subtitle": "केवल हमारी बात पर विश्वास न करें। यहां भारत भर में हमारे फ्रैंचाइज़ी भागीदारों की वास्तविक सफलता की कहानियां हैं।",
      "rajesh": {
        "name": "राजेश कुमार",
        "location": "मुंबई, महाराष्ट्र",
        "franchise": "EPS एटीएम फ्रैंचाइज़ी",
        "testimonial": "एटीएम फ्रैंचाइज़ इंडिया ने हर कदम पर मेरा मार्गदर्शन किया। 8 महीनों के भीतर, मैं न्यूनतम प्रयास के साथ मासिक ₹45,000 कमा रहा हूं। अब तक का सबसे अच्छा निवेश निर्णय!",
        "income": "₹45,000/माह",
        "time": "8 महीनों में"
      },
      "priya": {
        "name": "प्रिया शर्मा",
        "location": "बैंगलोर, कर्नाटक",
        "franchise": "वक्रांगी साझेदारी",
        "testimonial": "WLA साझेदारी में टीम की विशेषज्ञता बेजोड़ है। मेरा एटीएम केवल 6 महीनों में लगातार ₹38,000 मासिक आय उत्पन्न कर रहा है।",
        "income": "₹38,000/माह",
        "time": "6 महीनों में"
      }
    },
    "faq": {
      "title": "अक्सर पूछे जाने वाले प्रश्न",
      "subtitle": "अपने एटीएम फ्रैंचाइज़ी व्यवसाय शुरू करने के बारे में सबसे आम प्रश्नों के उत्तर प्राप्त करें।",
      "questions": {
        "q1": {
          "question": "एटीएम फ्रैंचाइज़ी के लिए न्यूनतम निवेश क्या है?",
          "answer": "न्यूनतम निवेश ₹2-5 लाख से शुरू होता है, जो स्थान और WLA ऑपरेटर पर निर्भर करता है।"
        },
        "q2": {
          "question": "मैं कितनी मासिक आय की उम्मीद कर सकता हूं?",
          "answer": "औसत मासिक आय ₹30,000 से ₹60,000 तक होती है, जो स्थान और लेनदेन की मात्रा पर निर्भर करती है।"
        },
        "q3": {
          "question": "ROI प्राप्त करने में कितना समय लगता है?",
          "answer": "अधिकांश भागीदार 12-18 महीनों के भीतर अपना पूर्ण निवेश वापस प्राप्त करते हैं।"
        }
      }
    },
    "partners": {
      "eps": {
        "name": "EPS",
        "tag": "स्थापित WLA ऑपरेटर",
        "description": "भारत के अग्रणी WLA ऑपरेटरों में से एक जिसके पास व्यापक नेटवर्क कवरेज और एटीएम परिनियोजन और प्रबंधन सेवाओं में सिद्ध ट्रैक रिकॉर्ड है।"
      },
      "india1": {
        "name": "India1 ATM",
        "tag": "राष्ट्रीय कवरेज",
        "description": "ग्रामीण और अर्ध-शहरी बाजारों पर ध्यान केंद्रित करने वाला व्यापक एटीएम समाधान प्रदाता, पूरे भारत में वंचित समुदायों को बैंकिंग सेवाएं प्रदान करता है।"
      }
    }
  },
  products: {
    "title": "हमारे एटीएम उत्पाद और सेवाएं",
    "subtitle": "आपकी आवश्यकताओं के अनुरूप व्यापक एटीएम फ्रैंचाइज़ी समाधान"
  },
  franchise: {
    "hero": {
      "partners": "सफल भागीदार",
      "joinToday": "आज ही जुड़ें"
    },
    "process": {
      "apply": "आवेदन करें",
      "agreement": "अनुबंध",
      "installation": "स्थापना",
      "startEarning": "कमाई शुरू करें"
    }
  }
};

// Function to scan a file for hardcoded English text
function scanFileForHardcodedText(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, hardcodedTexts: [] };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hardcodedTexts = [];
  
  // Patterns to find hardcoded text
  const patterns = [
    />([A-Z][^<>{}\n]+)</g,
    /placeholder="([^"]+)"/g,
    /title="([^"]+)"/g,
    /label="([^"]+)"/g,
    /'([A-Z][^']{5,})'/g,
    /"([A-Z][^"]{5,})"/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1];
      if (!/^[A-Z][a-z]+[A-Z]/.test(text) && 
          !/^[A-Z_]+$/.test(text) && 
          !text.includes('className') &&
          !text.includes('import') &&
          text.length > 3) {
        hardcodedTexts.push(text);
      }
    }
  });
  
  return { exists: true, hardcodedTexts: [...new Set(hardcodedTexts)] };
}

// Function to update Hindi JSON files
function updateHindiTranslations() {
  const localesDir = 'public/locales/hi';
  
  Object.entries(COMPLETE_HINDI_TRANSLATIONS).forEach(([namespace, translations]) => {
    const filePath = path.join(localesDir, `${namespace}.json`);
    
    let existing = {};
    if (fs.existsSync(filePath)) {
      try {
        existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      } catch (e) {
        console.log(`⚠️ Could not parse ${namespace}.json`);
      }
    }
    
    // Deep merge translations
    const merged = deepMerge(existing, translations);
    
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
    console.log(`✅ Updated ${namespace}.json`);
  });
}

// Deep merge helper
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

// Main execution
console.log('📊 PHASE 1: Current Status Assessment\n');

let totalHardcoded = 0;
const issuesByPage = {};

PAGES_TO_FIX.forEach(page => {
  const result = scanFileForHardcodedText(page.file);
  if (result.exists) {
    const count = result.hardcodedTexts.length;
    totalHardcoded += count;
    issuesByPage[page.file] = count;
    
    if (count > 0) {
      console.log(`❌ ${path.basename(page.file)}: ${count} hardcoded texts`);
      if (count <= 5) {
        result.hardcodedTexts.forEach(text => {
          console.log(`   - "${text}"`);
        });
      }
    } else {
      console.log(`✅ ${path.basename(page.file)}: No obvious hardcoded texts`);
    }
  }
});

console.log(`\n📊 Total Hardcoded Texts: ${totalHardcoded}\n`);

console.log('📝 PHASE 2: Updating Hindi Translations\n');
updateHindiTranslations();

console.log('\n🎯 IMPLEMENTATION PLAN FOR 100% COVERAGE\n');
console.log('TEAM ASSIGNMENTS:');
console.log('\n1. Arjun (Frontend) - 2 hours:');
console.log('   - Fix exposed translation keys');
console.log('   - Replace ALL hardcoded text with t() calls');
console.log('   - Fix breadcrumbs to show "हिंदी"');

console.log('\n2. Dr. Sharma (Linguistic Expert) - 2 hours:');
console.log('   - Review and complete all Hindi translations');
console.log('   - Ensure cultural appropriateness');
console.log('   - Verify business terminology');

console.log('\n3. Priya (Localization) - 1 hour:');
console.log('   - Update all JSON files');
console.log('   - Verify namespace organization');
console.log('   - Check for missing keys');

console.log('\n4. Vikram (QA) - 1 hour:');
console.log('   - Test all 13 pages');
console.log('   - Take screenshots as proof');
console.log('   - Document any issues');

console.log('\n⏰ TIMELINE:');
console.log('Total Time Required: 6 hours');
console.log('- Hour 1-2: Fix all component issues');
console.log('- Hour 3-4: Complete all translations');
console.log('- Hour 5: Update and verify JSON files');
console.log('- Hour 6: Testing and documentation');

console.log('\n✅ DELIVERABLES:');
console.log('1. 100% Hindi coverage on all 13 pages');
console.log('2. No exposed translation keys');
console.log('3. All forms fully functional in Hindi');
console.log('4. Screenshots proving completion');
console.log('5. No regression in other languages');

console.log('\n🛡️ SAFETY MEASURES:');
console.log('- Git commits after each major change');
console.log('- Testing after each component update');
console.log('- Backup of current state maintained');
console.log('- No changes to core functionality');

// Generate implementation checklist
const checklist = {
  timestamp: new Date().toISOString(),
  totalPages: 13,
  hardcodedTextsFound: totalHardcoded,
  criticalFixes: [
    'Fix exposed translation keys (products.title, etc.)',
    'Fix breadcrumbs showing "Hi" instead of "हिंदी"',
    'Translate ALL form labels and buttons',
    'Translate testimonials and FAQ',
    'Complete legal document translations'
  ],
  estimatedTime: '6 hours',
  riskLevel: 'Low (with proper testing)',
  rollbackPlan: 'Git revert to previous commit if issues'
};

fs.writeFileSync('hindi-100-percent-plan.json', JSON.stringify(checklist, null, 2));

console.log('\n✅ Plan saved to hindi-100-percent-plan.json');
console.log('\n🚀 Ready to achieve 100% Hindi coverage!');
console.log('NO COMPROMISES. User wants 100% - we deliver 100%.');