const fs = require('fs');
const path = require('path');

// Correct copyright translations for each language
const copyrightTranslations = {
  en: "© 2025 ATM Franchise India. All rights reserved. | RBI Licensed Partners Only",
  hi: "© 2025 एटीएम फ्रैंचाइज़ इंडिया। सर्वाधिकार सुरक्षित। | केवल RBI लाइसेंस प्राप्त भागीदार",
  bn: "© 2025 এটিএম ফ্র্যাঞ্চাইজ ইন্ডিয়া। সর্বস্বত্ব সংরক্ষিত। | শুধুমাত্র RBI লাইসেন্সপ্রাপ্ত অংশীদার",
  ta: "© 2025 ஏடிஎம் ஃபிராஞ்சைஸ் இந்தியா. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை. | RBI உரிமம் பெற்ற பங்குதாரர்கள் மட்டும்",
  te: "© 2025 ఏటీఎం ఫ్రాంచైజీ ఇండియా. అన్ని హక్కులు సురక్షితం. | RBI లైసెన్స్ పొందిన భాగస్వాములు మాత్రమే",
  mr: "© 2025 एटीएम फ्रँचायझी इंडिया. सर्व हक्क राखीव. | केवळ RBI परवानाधारक भागीदार",
  gu: "© 2025 એટીએમ ફ્રેન્ચાઇઝ ઇન્ડિયા. બધા હકો અનામત. | માત્ર RBI લાઇસન્સધારક ભાગીદારો",
  ur: "© 2025 اے ٹی ایم فرنچائز انڈیا۔ تمام حقوق محفوظ ہیں۔ | صرف RBI لائسنس یافتہ پارٹنرز",
  kn: "© 2025 ಎಟಿಎಂ ಫ್ರಾಂಚೈಸಿ ಇಂಡಿಯಾ. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ. | RBI ಪರವಾನಗಿ ಪಡೆದ ಪಾಲುದಾರರು ಮಾತ್ರ",
  or: "© 2025 ଏଟିଏମ ଫ୍ରାଞ୍ଚାଇଜ ଇଣ୍ଡିଆ। ସମସ୍ତ ଅଧିକାର ସଂରକ୍ଷିତ। | କେବଳ RBI ଲାଇସେନ୍ସପ୍ରାପ୍ତ ଅଂଶୀଦାର",
  pa: "© 2025 ਏਟੀਐਮ ਫਰੈਂਚਾਈਜ਼ ਇੰਡੀਆ। ਸਾਰੇ ਹੱਕ ਰਾਖਵੇਂ ਹਨ। | ਸਿਰਫ਼ RBI ਲਾਈਸੈਂਸਸ਼ੁਦਾ ਭਾਈਵਾਲ",
  as: "© 2025 এটিএম ফ্ৰেঞ্চাইজ ইণ্ডিয়া। সকলো অধিকাৰ সংৰক্ষিত। | কেৱল RBI অনুজ্ঞাপত্ৰপ্ৰাপ্ত অংশীদাৰ",
  ml: "© 2025 എടിഎം ഫ്രാഞ്ചൈസി ഇന്ത്യ. എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം. | RBI ലൈസൻസുള്ള പങ്കാളികൾ മാത്രം"
};

console.log('🔧 Fixing copyright contamination in all language files...\n');

let totalFixed = 0;
let totalErrors = 0;

// Process each language
Object.keys(copyrightTranslations).forEach(lang => {
  const filePath = path.join(__dirname, '..', 'public', 'locales', lang, 'common.json');
  
  try {
    if (fs.existsSync(filePath)) {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Fix copyright - ensure only one correct entry
      const oldCopyright = content.copyright;
      content.copyright = copyrightTranslations[lang];
      
      // Remove any duplicate copyright entries if they exist
      const keys = Object.keys(content);
      const copyrightKeys = keys.filter(k => k.toLowerCase().includes('copyright'));
      
      if (copyrightKeys.length > 1) {
        console.log(`⚠️  Found ${copyrightKeys.length} copyright entries in ${lang}/common.json`);
        copyrightKeys.forEach(key => {
          if (key !== 'copyright') {
            delete content[key];
            console.log(`   Removed duplicate: ${key}`);
          }
        });
      }
      
      // Write back the fixed content
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
      
      if (oldCopyright !== copyrightTranslations[lang]) {
        console.log(`✅ Fixed ${lang}/common.json copyright`);
        console.log(`   Old: ${oldCopyright}`);
        console.log(`   New: ${copyrightTranslations[lang]}\n`);
        totalFixed++;
      } else {
        console.log(`✓ ${lang}/common.json copyright already correct\n`);
      }
    } else {
      console.log(`⚠️  File not found: ${lang}/common.json`);
      totalErrors++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${lang}/common.json:`, error.message);
    totalErrors++;
  }
});

console.log('\n' + '='.repeat(80));
console.log(`📊 SUMMARY:`);
console.log(`   Fixed: ${totalFixed} files`);
console.log(`   Errors: ${totalErrors} files`);
console.log(`   Total languages: ${Object.keys(copyrightTranslations).length}`);
console.log('='.repeat(80));

if (totalFixed > 0) {
  console.log('\n✅ Copyright contamination fixed successfully!');
  console.log('   All languages now have properly translated copyright text.');
} else if (totalErrors === 0) {
  console.log('\n✓ All copyright translations were already correct!');
} else {
  console.log('\n⚠️  Some issues were encountered. Please review the errors above.');
}