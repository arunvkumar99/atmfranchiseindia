#!/usr/bin/env node

/**
 * RAVI'S DAY 5 HINDI QUALITY FIX
 * Fix all the terrible mixed English-Hindi translations
 * These translations are embarrassing - we need PROFESSIONAL quality!
 */

const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');

// Critical Hindi translation fixes
const translationFixes = {
  'home.json': {
    // WhyATM section fixes
    'whyAtm.cards.roi.title': 'निवेश पर रिटर्न',
    'whyAtm.cards.roi.description': 'RBI लाइसेंस प्राप्त WLA ATM भागीदारों द्वारा प्राप्त सभी भुगतान',
    'whyAtm.cards.penetration.title': 'एटीएम प्रवेश',
    'whyAtm.cards.penetration.description': 'केवल 15 एटीएम प्रति 1 लाख लोग - भारत में एटीएम प्रवेश बहुत कम है',
    'whyAtm.cards.cash.title': 'नकद प्रसार',
    'whyAtm.cards.cash.description': 'भारतीय अर्थव्यवस्था अभी भी काफी हद तक नकदी आधारित है',
    'whyAtm.cards.opportunity.title': 'बाज़ार अवसर',
    'whyAtm.cards.opportunity.description': '90% बैंकों के ऑफसाइट एटीएम बंद हो रहे हैं - बैंक ऑफसाइट एटीएम बंद होने से एटीएम के लिए बड़ा बाज़ार बनता है',
    
    // Additional content fixes
    'whyAtm.perfectTime': 'ग्रामीण भारत में एटीएम व्यवसाय के लिए सही समय',
    'whyAtm.bullets.digital': '• डिजिटल अपनाना बढ़ रहा है',
    'whyAtm.bullets.government': '• वित्तीय समावेशन के लिए सरकारी प्रयास',
    'whyAtm.bullets.branch': '• बैंक शाखा बंद हो रही हैं',
    'whyAtm.investmentRange': 'निवेश सीमा: ₹2-5 लाख',
    
    // Services section fixes
    'services.badge': 'हमारा लाभ',
    'services.title': 'एटीएम फ्रैंचाइज़ी इंडिया क्यों चुनें?',
    'services.subtitle': 'हमारी व्यापक सहायता प्रणाली और उद्योग विशेषज्ञता के साथ अंतर का अनुभव करें',
    
    'services.card1.title': 'विश्वसनीय एटीएम फ्रैंचाइज़ी जानकारी',
    'services.card1.description': 'एटीएम उद्योग में सटीक और सत्यापित अंतर्दृष्टि प्राप्त करें। एक विनियमित क्षेत्र के रूप में, एटीएम व्यवसाय में अक्सर व्यापक गलत सूचना देखी जाती है। हमारे प्रतिनिधि सुनिश्चित करते हैं कि आपको सूचित फ्रैंचाइज़ी निर्णय लेने के लिए विश्वसनीय, तथ्य-आधारित मार्गदर्शन मिले।',
    
    'services.card2.title': 'WLA ऑपरेटरों पर विशेषज्ञ मार्गदर्शन',
    'services.card2.description': 'आइए हम आपको सही व्हाइट लेबल एटीएम पार्टनर चुनने में मदद करें। कई ऑपरेटर अपनी पेशकशों को बढ़ा-चढ़ाकर पेश करते हैं और निवेशकों को गुमराह करते हैं। हम सभी प्रमुख WLA ऑपरेटरों की निष्पक्ष तुलना प्रदान करते हैं - उनकी ताकत और कमजोरियों को उजागर करते हैं - यह सुनिश्चित करने के लिए कि आप अपने व्यवसाय के लिए सही फिट पाएं।',
    
    'services.card3.title': 'अपनी डिजिटल उपस्थिति बढ़ाएं',
    'services.card3.description': 'पहले से ही एटीएम फ्रैंचाइज़ी चला रहे हैं? अपनी डिजिटल पहुंच बढ़ाने और अपनी ऑनलाइन ब्रांडिंग को बढ़ाने के लिए हमारे साथ पंजीकरण करें। अधिक ग्राहकों से जुड़ें और बाज़ार में अपनी दृश्यता बढ़ाएं।',
    
    'services.card4.title': 'संपूर्ण फ्रैंचाइज़ी सहायता',
    'services.card4.description': 'सभी WLA ब्रांडों में 4+ वर्षों के अनुभव के साथ, हम सब कुछ संभालते हैं: फ्रैंचाइज़ी ऑनबोर्डिंग, प्रशिक्षण और परिचालन सेटअप, स्थानीय प्रचार और ब्रांड दृश्यता, तकनीकी सहायता और समस्या निवारण, बैंक खाता निपटान, WLA ऑपरेटरों के साथ विवाद समाधान। हम एटीएम व्यवसाय की सफलता के लिए आपका एक-स्टॉप समाधान हैं।',
    
    'services.cta': '500+ सफल फ्रैंचाइज़ी भागीदारों से जुड़ें',
    
    // Trust signals
    'trustSignals.title': 'राष्ट्रव्यापी व्यवसायों द्वारा विश्वसनीय',
    'trustSignals.subtitle': 'हजारों सफल भागीदारों से जुड़ें जो अपने एटीएम व्यवसाय संचालन के लिए हमारे साथ भरोसा करते हैं',
    'trustSignals.partners': 'सक्रिय भागीदार',
    'trustSignals.uptime': 'अपटाइम गारंटी',
    'trustSignals.experience': 'उद्योग अनुभव',
    'trustSignals.support': 'ग्राहक सहायता',
    
    // Counter section
    'counter.title': 'पूरे भारत में एटीएम',
    'counter.subtitle': 'और बढ़ रहे हैं...'
  },
  
  'common.json': {
    // Footer fixes
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.ourServices': 'हमारी सेवाएं',
    'footer.legal': 'कानूनी',
    'footer.submitLocation': 'एटीएम स्थान सबमिट करें',
    'footer.becomeFranchise': 'फ्रैंचाइज़ी बनें',
    'footer.agent': 'एजेंट',
    'footer.influencer': 'प्रभावकारी',
    'footer.services.consultation': 'एटीएम फ्रैंचाइज़ी परामर्श',
    'footer.services.comparison': 'WLA ऑपरेटर तुलना',
    'footer.services.evaluation': 'साइट मूल्यांकन',
    'footer.services.training': 'प्रशिक्षण और सहायता',
    'footer.services.marketing': 'डिजिटल मार्केटिंग',
    'footer.services.technical': 'तकनीकी सहायता',
    'footer.privacyPolicy': 'गोपनीयता नीति',
    'footer.termsConditions': 'नियम और शर्तें',
    'footer.refundPolicy': 'धनवापसी नीति',
    'footer.accessibility': 'पहुंच विवरण',
    'footer.copyright': '© 2025 एटीएम फ्रैंचाइज़ी इंडिया। सभी अधिकार सुरक्षित। | केवल RBI लाइसेंस प्राप्त भागीदार',
    'footer.aboutUs': 'हमारे बारे में',
    'footer.contactUs': 'संपर्क करें',
    'footer.tagline': 'विश्वसनीय व्यावसायिक भागीदार',
    'footer.description': 'पारदर्शी एटीएम फ्रैंचाइज़ी अवसरों के साथ ग्रामीण उद्यमियों को सशक्त बनाना। भारत भर में समुदायों की सेवा करते हुए निष्क्रिय आय धाराएं बनाना।'
  },
  
  'components.json': {
    // Debug and validation components
    'translationdebug.text1': 'अनुवाद डिबग',
    'translationvalidator.text1': 'अनुवाद सत्यापन',
    'lazyloadingwrapper.text1': 'पृष्ठ लोड करने में विफल',
    'dialog.text1': 'बंद करें',
    'breadcrumb.text1': 'अधिक पृष्ठ',
    'captcha-protection.text1': 'कृपया सत्यापित करें कि आप मानव हैं',
    'carousel.text1': 'पिछला स्लाइड',
    'carousel.text2': 'अगला स्लाइड',
    'file-upload.text1': 'फ़ाइल अपलोड',
    'file-upload.text2': 'फ़ाइल चुनें',
    'file-upload.text3': 'या खींचें और छोड़ें',
    'file-upload.text4': 'अपलोड करें',
    'enhanced-file-upload.text1': 'अपनी फ़ाइल अपलोड करें',
    'enhanced-file-upload.text2': 'केवल PDF, JPG, PNG फ़ाइलें',
    'pagination.text1': 'अधिक पृष्ठ',
    'pagination.text2': 'पिछला',
    'pagination.text3': 'अगला पृष्ठ',
    'sheet.text1': 'बंद करें',
    'sidebar.text1': 'साइडबार टॉगल करें',
    'searchcomponent.text1': 'लोकप्रिय खोजें'
  }
};

console.log('🔧 RAVI DAY 5: FIXING HINDI TRANSLATION QUALITY');
console.log('==============================================\n');

let totalFixed = 0;
let errors = [];

// Process each file
Object.entries(translationFixes).forEach(([fileName, fixes]) => {
  const filePath = path.join(projectRoot, 'public', 'locales', 'hi', fileName);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      errors.push(`File not found: ${fileName}`);
      return;
    }
    
    let content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let fixedCount = 0;
    
    // Apply fixes
    Object.entries(fixes).forEach(([keyPath, value]) => {
      const keys = keyPath.split('.');
      let current = content;
      
      // Navigate to the parent of the target key
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Set the value
      const lastKey = keys[keys.length - 1];
      if (current[lastKey] !== value) {
        current[lastKey] = value;
        fixedCount++;
        console.log(`  ✅ Fixed: ${keyPath}`);
      }
    });
    
    if (fixedCount > 0) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      console.log(`✅ ${fileName}: Fixed ${fixedCount} translations\n`);
      totalFixed += fixedCount;
    } else {
      console.log(`✓  ${fileName}: Already correct\n`);
    }
    
  } catch (error) {
    console.error(`❌ Error processing ${fileName}:`, error.message);
    errors.push(`${fileName}: ${error.message}`);
  }
});

console.log('==============================================');
console.log(`📊 SUMMARY:`);
console.log(`   Total Fixes: ${totalFixed}`);
console.log(`   Errors: ${errors.length}`);

if (errors.length > 0) {
  console.log('\n❌ ERRORS:');
  errors.forEach(e => console.log(`   - ${e}`));
}

console.log('\n✅ Hindi Translation Quality Fix Complete!');
console.log('Next: Browser test to verify improvements');