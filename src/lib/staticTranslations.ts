// Static Pre-translated Content System
// Reduces JS load by providing pre-translated content for major languages
// Implementation of Copilot recommendation for performance optimization

import { SUPPORTED_LANGUAGES } from './instantTranslationSystem';

export interface StaticTranslation {
  [key: string]: {
    [languageCode: string]: string;
  };
}

// Core site content translations - pre-translated to reduce runtime overhead
export const staticTranslations: StaticTranslation = {
  // Navigation
  'Home': {
    'hi': 'होम',
    'bn': 'হোম',
    'ta': 'முகப்பு',
    'te': 'హోమ్',
    'mr': 'मुख्यपृष्ठ',
    'gu': 'ઘર',
    'ur': 'گھر',
    'kn': 'ಮುಖ್ಯಪುಟ',
    'or': 'ଘର',
    'pa': 'ਘਰ',
    'as': 'ঘৰ',
    'ml': 'ഹോം',
  },
  
  'Contact Us': {
    'hi': 'संपर्क करें',
    'bn': 'যোগাযোগ করুন',
    'ta': 'தொடர்பு கொள்ளுங்கள்',
    'te': 'మమ్మల్ని సంప్రదించండి',
    'mr': 'संपर्क साधा',
    'gu': 'અમારો સંપર્ક કરો',
    'ur': 'رابطہ کریں',
    'kn': 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    'or': 'ଯୋଗାଯୋଗ କରନ୍ତୁ',
    'pa': 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    'as': 'আমাৰ লগত যোগাযোগ কৰক',
    'ml': 'ഞങ്ങളെ ബന്ധപ്പെടുക',
  },

  'About Us': {
    'hi': 'हमारे बारे में',
    'bn': 'আমাদের সম্পর্কে',
    'ta': 'எங்களைப் பற்றி',
    'te': 'మా గురించి',
    'mr': 'आमच्याबद्दल',
    'gu': 'અમારા વિશે',
    'ur': 'ہمارے بارے میں',
    'kn': 'ನಮ್ಮ ಬಗ್ಗೆ',
    'or': 'ଆମ ବିଷୟରେ',
    'pa': 'ਸਾਡੇ ਬਾਰੇ',
    'as': 'আমাৰ বিষয়ে',
    'ml': 'ഞങ്ങളുടെ കുറിച്ച്',
  },

  'Join Us': {
    'hi': 'हमसे जुड़ें',
    'bn': 'আমাদের সাথে যোগ দিন',
    'ta': 'எங்களுடன் சேருங்கள்',
    'te': 'మాతో చేరండి',
    'mr': 'आमच्याशी सामील व्हा',
    'gu': 'અમારી સાથે જોડાઓ',
    'ur': 'ہمارے ساتھ شامل ہوں',
    'kn': 'ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ',
    'or': 'ଆମ ସହିତ ଯୋଗ ଦିଅନ୍ତୁ',
    'pa': 'ਸਾਡੇ ਨਾਲ ਜੁੜੋ',
    'as': 'আমাৰ সৈতে যোগদান কৰক',
    'ml': 'ഞങ്ങളോടൊപ്പം ചേരുക',
  },

  // Common actions
  'Get Started': {
    'hi': 'शुरू करें',
    'bn': 'শুরু করুন',
    'ta': 'தொடங்குங்கள்',
    'te': 'ప్రారంభించండి',
    'mr': 'सुरुवात करा',
    'gu': 'શરૂ કરો',
    'ur': 'شروع کریں',
    'kn': 'ಪ್ರಾರಂಭಿಸಿ',
    'or': 'ଆରମ୍ଭ କରନ୍ତୁ',
    'pa': 'ਸ਼ੁਰੂ ਕਰੋ',
    'as': 'আৰম্ভ কৰক',
    'ml': 'ആരംഭിക്കുക',
  },

  'Submit': {
    'hi': 'जमा करें',
    'bn': 'জমা দিন',
    'ta': 'சமர்பிக்கவும்',
    'te': 'సమర్పించండి',
    'mr': 'सबमिट करा',
    'gu': 'સબમિટ કરો',
    'ur': 'جمع کریں',
    'kn': 'ಸಲ್ಲಿಸಿ',
    'or': 'ଦାଖଲ କରନ୍ତୁ',
    'pa': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'as': 'দাখিল কৰক',
    'ml': 'സമർപ്പിക്കുക',
  },

  // ATM Business Content
  'ATM Franchise': {
    'hi': 'एटीएम फ्रेंचाइजी',
    'bn': 'এটিএম ফ্র্যাঞ্চাইজি',
    'ta': 'ஏடிஎம் உரிமை',
    'te': 'ATM ఫ్రాంచైజీ',
    'mr': 'एटीएम फ्रँचायझी',
    'gu': 'ATM ફ્રેન્ચાઈઝી',
    'ur': 'اے ٹی ایم فرنچائز',
    'kn': 'ಎಟಿಎಂ ಫ್ರ್ಯಾಂಚೈಸೆ',
    'or': 'ଏଟିଏମ ଫ୍ରାଞ୍ଚାଇଜ',
    'pa': 'ਏਟੀਐਮ ਫਰੈਂਚਾਇਜ਼ੀ',
    'as': 'এটিএম ফ্ৰেঞ্চাইজ',
    'ml': 'എടിഎം ഫ്രാഞ്ചൈസി',
  },

  'Monthly Income': {
    'hi': 'मासिक आय',
    'bn': 'মাসিক আয়',
    'ta': 'மாதாந்திர வருமானம்',
    'te': 'నెలవారీ ఆదాయం',
    'mr': 'मासिक उत्पन्न',
    'gu': 'માસિક આવક',
    'ur': 'ماہانہ آمدنی',
    'kn': 'ಮಾಸಿಕ ಆದಾಯ',
    'or': 'ମାସିକ ଆୟ',
    'pa': 'ਮਾਸਿਕ ਆਮਦਨ',
    'as': 'মাহেকীয়া আয়',
    'ml': 'മാസിക വരുമാനം',
  },

  'Investment Required': {
    'hi': 'आवश्यक निवेश',
    'bn': 'প্রয়োজনীয় বিনিয়োগ',
    'ta': 'தேவையான முதலீடু',
    'te': 'అవసరమైన పెట্টుబడి',
    'mr': 'आवश्यक गुंतवणूक',
    'gu': 'જરૂરી રોકાણ',
    'ur': 'مطلوبہ سرمایہ کاری',
    'kn': 'ಅಗತ್ಯವಿರುವ ಹೂಡಿಕೆ',
    'or': 'ଆବଶ୍ୟକ ବିନିଯୋଗ',
    'pa': 'ਲੋੜੀਂਦਾ ਨਿਵੇਸ਼',
    'as': 'আৱশ্যক বিনিয়োগ',
    'ml': 'ആവശ്യമായ നിക്ഷേപം',
  },

  // Form fields
  'Full Name': {
    'hi': 'पूरा नाम',
    'bn': 'সম্পূর্ণ নাম',
    'ta': 'முழு பெயர்',
    'te': 'పూర్తి పేరు',
    'mr': 'पूर्ण नाव',
    'gu': 'સંપૂર્ણ નામ',
    'ur': 'مکمل نام',
    'kn': 'ಪೂರ್ಣ ಹೆಸರು',
    'or': 'ପୂର୍ଣ୍ଣ ନାମ',
    'pa': 'ਪੂਰਾ ਨਾਮ',
    'as': 'সম্পূৰ্ণ নাম',
    'ml': 'പൂർണ്ണ നാമം',
  },

  'Phone Number': {
    'hi': 'फोन नंबर',
    'bn': 'ফোন নম্বর',
    'ta': 'தொலைபேசி எண்',
    'te': 'ఫోన్ నంబర్',
    'mr': 'फोन नंबर',
    'gu': 'ફોન નંબર',
    'ur': 'فون نمبر',
    'kn': 'ಫೋನ್ ಸಂಖ್ಯೆ',
    'or': 'ଫୋନ ନମ୍ବର',
    'pa': 'ਫੋਨ ਨੰਬਰ',
    'as': 'ফোন নম্বৰ',
    'ml': 'ഫോൺ നമ്പർ',
  },

  'Email Address': {
    'hi': 'ईमेल पता',
    'bn': 'ইমেইল ঠিকানা',
    'ta': 'மின்னஞ்சல் முகவரி',
    'te': 'ఇమెయిల్ చిరునామా',
    'mr': 'ईमेल पत्ता',
    'gu': 'ઈમેઈલ સરનામું',
    'ur': 'ای میل ایڈریس',
    'kn': 'ಇಮೇಲ್ ವಿಳಾಸ',
    'or': 'ଇମେଲ ଠିକଣା',
    'pa': 'ਈਮੇਲ ਪਤਾ',
    'as': 'ইমেইল ঠিকনা',
    'ml': 'ഇമെയിൽ വിലാസം',
  },

  'State': {
    'hi': 'राज्य',
    'bn': 'রাজ্য',
    'ta': 'மாநிலம்',
    'te': 'రాష్ట్రం',
    'mr': 'राज्य',
    'gu': 'રાજ્ય',
    'ur': 'ریاست',
    'kn': 'ರಾಜ್ಯ',
    'or': 'ରାଜ୍ୟ',
    'pa': 'ਰਾਜ',
    'as': 'ৰাজ্য',
    'ml': 'സംസ്ഥാനം',
  },

  'City': {
    'hi': 'शहर',
    'bn': 'শহর',
    'ta': 'நகரம்',
    'te': 'నగరం',
    'mr': 'शहर',
    'gu': 'શહેર',
    'ur': 'شہر',
    'kn': 'ನಗರ',
    'or': 'ସହର',
    'pa': 'ਸ਼ਹਿਰ',
    'as': 'চহৰ',
    'ml': 'നഗരം',
  },
};

// Utility function to get static translation
export function getStaticTranslation(
  text: string, 
  languageCode: string
): string {
  if (languageCode === 'en') return text;
  return staticTranslations[text]?.[languageCode] || text;
}

// Utility function to get translation with fallback
export function getTranslationWithFallback(
  text: string,
  languageCode: string,
  fallback?: string
): string {
  if (languageCode === 'en') return text;
  
  const staticTranslation = staticTranslations[text]?.[languageCode];
  if (staticTranslation) return staticTranslation;
  
  return fallback || text;
}

// Pre-load critical translations for faster switching
export function preloadCriticalTranslations(languageCode: string): void {
  if (typeof window === 'undefined' || languageCode === 'en') return;
  
  const criticalKeys = [
    'Home', 'Contact Us', 'About Us', 'Get Started', 'Submit', 'Continue',
    'ATM Franchise', 'Monthly Income', 'Investment Required',
    'Full Name', 'Phone Number', 'Email Address', 'State', 'City'
  ];
  
  criticalKeys.forEach(key => {
    getStaticTranslation(key, languageCode);
  });
  
  console.log(`✅ Preloaded ${criticalKeys.length} critical translations for ${languageCode}`);
}

// Check if a translation exists statically
export function hasStaticTranslation(text: string, languageCode: string): boolean {
  return !!staticTranslations[text]?.[languageCode];
}

export default staticTranslations;