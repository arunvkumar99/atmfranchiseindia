const fs = require('fs');
const path = require('path');

// Read English files
const aboutEN = JSON.parse(fs.readFileSync('public/locales/en/about.json', 'utf8'));
const contactEN = JSON.parse(fs.readFileSync('public/locales/en/contact.json', 'utf8'));

// Languages to translate
const languages = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

// Basic translations for about page
const aboutTranslations = {
  hi: {
    badge: 'हमारी कहानी',
    titlePrefix: 'हमारे बारे में',
    titleHighlight: 'एटीएम फ्रैंचाइज़ इंडिया',
    subtitle: 'भारत में एटीएम फ्रैंचाइज़ व्यवसाय के लिए आपका विश्वसनीय साथी',
    mission: 'हमारा मिशन',
    vision: 'हमारी दृष्टि',
    values: 'हमारे मूल्य'
  },
  bn: {
    badge: 'আমাদের গল্প',
    titlePrefix: 'আমাদের সম্পর্কে',
    titleHighlight: 'এটিএম ফ্র্যাঞ্চাইজ ইন্ডিয়া',
    subtitle: 'ভারতে এটিএম ফ্র্যাঞ্চাইজ ব্যবসার জন্য আপনার বিশ্বস্ত অংশীদার',
    mission: 'আমাদের মিশন',
    vision: 'আমাদের দৃষ্টি',
    values: 'আমাদের মূল্যবোধ'
  },
  ta: {
    badge: 'எங்கள் கதை',
    titlePrefix: 'எங்களைப் பற்றி',
    titleHighlight: 'ஏடிஎம் பிரான்சைஸ் இந்தியா',
    subtitle: 'இந்தியாவில் ஏடிஎம் உரிமை வணிகத்திற்கான உங்கள் நம்பகமான பங்குதாரர்',
    mission: 'எங்கள் நோக்கம்',
    vision: 'எங்கள் பார்வை',
    values: 'எங்கள் மதிப்புகள்'
  },
  te: {
    badge: 'మా కథ',
    titlePrefix: 'మా గురించి',
    titleHighlight: 'ఏటిఎం ఫ్రాంచైజ్ ఇండియా',
    subtitle: 'భారతదేశంలో ఏటిఎం ఫ్రాంచైజ్ వ్యాపారం కోసం మీ నమ్మకమైన భాగస్వామి',
    mission: 'మా లక్ష్యం',
    vision: 'మా దృష్టి',
    values: 'మా విలువలు'
  },
  mr: {
    badge: 'आमची कथा',
    titlePrefix: 'आमच्याबद्दल',
    titleHighlight: 'एटीएम फ्रँचायझी इंडिया',
    subtitle: 'भारतातील एटीएम फ्रँचायझी व्यवसायासाठी तुमचा विश्वसनीय भागीदार',
    mission: 'आमचे ध्येय',
    vision: 'आमची दृष्टी',
    values: 'आमची मूल्ये'
  },
  gu: {
    badge: 'અમારી વાર્તા',
    titlePrefix: 'અમારા વિશે',
    titleHighlight: 'એટીએમ ફ્રેન્ચાઇઝ ઇન્ડિયા',
    subtitle: 'ભારતમાં એટીએમ ફ્રેન્ચાઇઝ વ્યવસાય માટે તમારો વિશ્વસનીય ભાગીદાર',
    mission: 'અમારું મિશન',
    vision: 'અમારી દ્રષ્ટિ',
    values: 'અમારા મૂલ્યો'
  },
  ur: {
    badge: 'ہماری کہانی',
    titlePrefix: 'ہمارے بارے میں',
    titleHighlight: 'اے ٹی ایم فرنچائز انڈیا',
    subtitle: 'ہندوستان میں اے ٹی ایم فرنچائز کاروبار کے لیے آپ کا قابل اعتماد ساتھی',
    mission: 'ہمارا مشن',
    vision: 'ہماری نظر',
    values: 'ہماری قدریں'
  },
  kn: {
    badge: 'ನಮ್ಮ ಕಥೆ',
    titlePrefix: 'ನಮ್ಮ ಬಗ್ಗೆ',
    titleHighlight: 'ಎಟಿಎಂ ಫ್ರಾಂಚೈಸ್ ಇಂಡಿಯಾ',
    subtitle: 'ಭಾರತದಲ್ಲಿ ಎಟಿಎಂ ಫ್ರ್ಯಾಂಚೈಸ್ ವ್ಯವಹಾರಕ್ಕಾಗಿ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಪಾಲುದಾರ',
    mission: 'ನಮ್ಮ ಧ್ಯೇಯ',
    vision: 'ನಮ್ಮ ದೃಷ್ಟಿ',
    values: 'ನಮ್ಮ ಮೌಲ್ಯಗಳು'
  },
  or: {
    badge: 'ଆମର କାହାଣୀ',
    titlePrefix: 'ଆମ ବିଷୟରେ',
    titleHighlight: 'ଏଟିଏମ୍ ଫ୍ରାଞ୍ଚାଇଜ୍ ଇଣ୍ଡିଆ',
    subtitle: 'ଭାରତରେ ଏଟିଏମ୍ ଫ୍ରାଞ୍ଚାଇଜ୍ ବ୍ୟବସାୟ ପାଇଁ ଆପଣଙ୍କର ବିଶ୍ୱସନୀୟ ସାଥୀ',
    mission: 'ଆମର ମିଶନ୍',
    vision: 'ଆମର ଦୃଷ୍ଟି',
    values: 'ଆମର ମୂଲ୍ୟବୋଧ'
  },
  pa: {
    badge: 'ਸਾਡੀ ਕਹਾਣੀ',
    titlePrefix: 'ਸਾਡੇ ਬਾਰੇ',
    titleHighlight: 'ਏਟੀਐਮ ਫ੍ਰੈਂਚਾਈਜ਼ ਇੰਡੀਆ',
    subtitle: 'ਭਾਰਤ ਵਿੱਚ ਏਟੀਐਮ ਫ੍ਰੈਂਚਾਈਜ਼ ਕਾਰੋਬਾਰ ਲਈ ਤੁਹਾਡਾ ਭਰੋਸੇਯੋਗ ਸਾਥੀ',
    mission: 'ਸਾਡਾ ਮਿਸ਼ਨ',
    vision: 'ਸਾਡੀ ਦ੍ਰਿਸ਼ਟੀ',
    values: 'ਸਾਡੀਆਂ ਕੀਮਤਾਂ'
  },
  as: {
    badge: 'আমাৰ কাহিনী',
    titlePrefix: 'আমাৰ বিষয়ে',
    titleHighlight: 'এটিএম ফ্ৰেঞ্চাইজ ইণ্ডিয়া',
    subtitle: 'ভাৰতত এটিএম ফ্ৰেঞ্চাইজ ব্যৱসায়ৰ বাবে আপোনাৰ বিশ্বাসযোগ্য অংশীদাৰ',
    mission: 'আমাৰ মিছন',
    vision: 'আমাৰ দৃষ্টি',
    values: 'আমাৰ মূল্যবোধ'
  },
  ml: {
    badge: 'ഞങ്ങളുടെ കഥ',
    titlePrefix: 'ഞങ്ങളെക്കുറിച്ച്',
    titleHighlight: 'എടിഎം ഫ്രാഞ്ചൈസ് ഇന്ത്യ',
    subtitle: 'ഇന്ത്യയിലെ എടിഎം ഫ്രാഞ്ചൈസ് ബിസിനസിനുള്ള നിങ്ങളുടെ വിശ്വസനീയ പങ്കാളി',
    mission: 'ഞങ്ങളുടെ ദൗത്യം',
    vision: 'ഞങ്ങളുടെ കാഴ്ചപ്പാട്',
    values: 'ഞങ്ങളുടെ മൂല്യങ്ങൾ'
  }
};

// Basic translations for contact page
const contactTranslations = {
  hi: {
    title: 'संपर्क करें',
    subtitle: 'हम आपकी सहायता के लिए यहाँ हैं',
    email: 'ईमेल',
    phone: 'फोन',
    address: 'पता',
    businessHours: 'व्यावसायिक घंटे'
  },
  bn: {
    title: 'যোগাযোগ করুন',
    subtitle: 'আমরা আপনাকে সাহায্য করতে এখানে আছি',
    email: 'ইমেইল',
    phone: 'ফোন',
    address: 'ঠিকানা',
    businessHours: 'ব্যবসায়িক সময়'
  },
  ta: {
    title: 'தொடர்பு கொள்ளுங்கள்',
    subtitle: 'நாங்கள் உங்களுக்கு உதவ இங்கு இருக்கிறோம்',
    email: 'மின்னஞ்சல்',
    phone: 'தொலைபேசி',
    address: 'முகவரி',
    businessHours: 'வணிக நேரம்'
  },
  te: {
    title: 'మమ్మల్ని సంప్రదించండి',
    subtitle: 'మేము మీకు సహాయం చేయడానికి ఇక్కడ ఉన్నాము',
    email: 'ఇమెయిల్',
    phone: 'ఫోన్',
    address: 'చిరునామా',
    businessHours: 'వ్యాపార గంటలు'
  },
  mr: {
    title: 'संपर्क साधा',
    subtitle: 'आम्ही तुम्हाला मदत करण्यासाठी येथे आहोत',
    email: 'ईमेल',
    phone: 'फोन',
    address: 'पत्ता',
    businessHours: 'व्यावसायिक तास'
  },
  gu: {
    title: 'સંપર્ક કરો',
    subtitle: 'અમે તમારી મદદ માટે અહીં છીએ',
    email: 'ઇમેઇલ',
    phone: 'ફોન',
    address: 'સરનામું',
    businessHours: 'વ્યવસાયિક કલાકો'
  },
  ur: {
    title: 'رابطہ کریں',
    subtitle: 'ہم آپ کی مدد کے لیے یہاں موجود ہیں',
    email: 'ای میل',
    phone: 'فون',
    address: 'پتہ',
    businessHours: 'کاروباری اوقات'
  },
  kn: {
    title: 'ಸಂಪರ್ಕಿಸಿ',
    subtitle: 'ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ನಾವು ಇಲ್ಲಿದ್ದೇವೆ',
    email: 'ಇಮೇಲ್',
    phone: 'ಫೋನ್',
    address: 'ವಿಳಾಸ',
    businessHours: 'ವ್ಯಾಪಾರ ಸಮಯ'
  },
  or: {
    title: 'ଯୋଗାଯୋଗ କରନ୍ତୁ',
    subtitle: 'ଆମେ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବା ପାଇଁ ଏଠାରେ ଅଛୁ',
    email: 'ଇମେଲ୍',
    phone: 'ଫୋନ୍',
    address: 'ଠିକଣା',
    businessHours: 'ବ୍ୟବସାୟିକ ଘଣ୍ଟା'
  },
  pa: {
    title: 'ਸੰਪਰਕ ਕਰੋ',
    subtitle: 'ਅਸੀਂ ਤੁਹਾਡੀ ਮਦਦ ਲਈ ਇੱਥੇ ਹਾਂ',
    email: 'ਈਮੇਲ',
    phone: 'ਫੋਨ',
    address: 'ਪਤਾ',
    businessHours: 'ਕਾਰੋਬਾਰੀ ਘੰਟੇ'
  },
  as: {
    title: 'যোগাযোগ কৰক',
    subtitle: 'আমি আপোনাক সহায় কৰিবলৈ ইয়াত আছোঁ',
    email: 'ইমেইল',
    phone: 'ফোন',
    address: 'ঠিকনা',
    businessHours: 'ব্যৱসায়িক সময়'
  },
  ml: {
    title: 'ബന്ധപ്പെടുക',
    subtitle: 'നിങ്ങളെ സഹായിക്കാൻ ഞങ്ങൾ ഇവിടെയുണ്ട്',
    email: 'ഇമെയിൽ',
    phone: 'ഫോൺ',
    address: 'വിലാസം',
    businessHours: 'ബിസിനസ് സമയം'
  }
};

// Update about.json for each language
languages.forEach(lang => {
  const aboutPath = path.join('public/locales', lang, 'about.json');
  
  if (fs.existsSync(aboutPath)) {
    const currentContent = JSON.parse(fs.readFileSync(aboutPath, 'utf8'));
    const trans = aboutTranslations[lang];
    
    // Update with translations
    currentContent.hero = currentContent.hero || {};
    currentContent.hero.badge = trans.badge;
    currentContent.hero.title = {
      prefix: trans.titlePrefix,
      highlight: trans.titleHighlight
    };
    currentContent.hero.subtitle = trans.subtitle;
    
    // Update mission, vision, values if they exist
    if (currentContent.content) {
      if (currentContent.content.mission) {
        currentContent.content.mission.title = trans.mission;
      }
      if (currentContent.content.vision) {
        currentContent.content.vision.title = trans.vision;
      }
      if (currentContent.content.values) {
        currentContent.content.values.title = trans.values;
      }
    }
    
    fs.writeFileSync(aboutPath, JSON.stringify(currentContent, null, 2), 'utf8');
    console.log('✅ Updated', lang, 'about.json');
  }
});

// Update contact.json for each language
languages.forEach(lang => {
  const contactPath = path.join('public/locales', lang, 'contact.json');
  
  if (fs.existsSync(contactPath)) {
    const currentContent = JSON.parse(fs.readFileSync(contactPath, 'utf8'));
    const trans = contactTranslations[lang];
    
    // Update with translations
    currentContent.title = trans.title;
    currentContent.subtitle = trans.subtitle;
    
    if (currentContent.info) {
      if (currentContent.info.email) {
        currentContent.info.email.label = trans.email;
      }
      if (currentContent.info.phone) {
        currentContent.info.phone.label = trans.phone;
      }
      if (currentContent.info.address) {
        currentContent.info.address.label = trans.address;
      }
      if (currentContent.info.hours) {
        currentContent.info.hours.label = trans.businessHours;
      }
    }
    
    fs.writeFileSync(contactPath, JSON.stringify(currentContent, null, 2), 'utf8');
    console.log('✅ Updated', lang, 'contact.json');
  }
});

console.log('\n✅ Translation update complete for about.json and contact.json!');