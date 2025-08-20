#!/usr/bin/env node

/**
 * Day 6 - Complete Translation Fix Script
 * This script will find and fix ALL English content in non-English languages
 */

const fs = require('fs');
const path = require('path');

// Comprehensive translation mappings for all missing content
const translationFixes = {
  // Navigation fixes
  'nav.joinUs': {
    en: 'Join Us',
    hi: 'हमसे जुड़ें',
    bn: 'আমাদের সাথে যোগ দিন',
    ta: 'எங்களுடன் சேரவும்',
    te: 'మాతో చేరండి',
    mr: 'आमच्याशी सामील व्हा',
    gu: 'અમારી સાથે જોડાઓ',
    kn: 'ನಮ್ಮೊಂದಿಗೆ ಸೇರಿ',
    ml: 'ഞങ്ങളോടൊപ്പം ചേരുക',
    or: 'ଆମ ସହିତ ଯୋଗ ଦିଅନ୍ତୁ',
    pa: 'ਸਾਡੇ ਨਾਲ ਜੁੜੋ',
    as: 'আমাৰ লগত যোগদান কৰক',
    ur: 'ہمارے ساتھ شامل ہوں'
  },
  
  // Breadcrumb
  'breadcrumb.home': {
    en: 'Home',
    hi: 'मुख्य पृष्ठ',
    bn: 'মূল পাতা',
    ta: 'முகப்பு',
    te: 'హోమ్',
    mr: 'मुख्यपृष्ठ',
    gu: 'મુખ્ય પૃષ્ઠ',
    kn: 'ಮುಖಪುಟ',
    ml: 'ഹോം',
    or: 'ମୂଳ ପୃଷ୍ଠା',
    pa: 'ਮੁੱਖ ਪੰਨਾ',
    as: 'মূল পৃষ্ঠা',
    ur: 'ہوم پیج'
  },

  // Why ATM Business section
  'whyAtm.heading': {
    en: 'Why ATM Business?',
    hi: 'एटीएम व्यवसाय क्यों?',
    bn: 'কেন এটিএম ব্যবসা?',
    ta: 'ஏன் ஏடிஎம் வணிகம்?',
    te: 'ఎందుకు ATM వ్యాపారం?',
    mr: 'एटीएम व्यवसाय का?',
    gu: 'શા માટે એટીએમ વ્યવસાય?',
    kn: 'ಏಕೆ ಎಟಿಎಂ ವ್ಯವಹಾರ?',
    ml: 'എന്തുകൊണ്ട് എടിഎം ബിസിനസ്?',
    or: 'କାହିଁକି ଏଟିଏମ୍ ବ୍ୟବସାୟ?',
    pa: 'ਕਿਉਂ ਏਟੀਐਮ ਕਾਰੋਬਾਰ?',
    as: 'কিয় এটিএম ব্যৱসায়?',
    ur: 'کیوں اے ٹی ایم کاروبار؟'
  },
  
  'whyAtm.subtitle': {
    en: 'Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies',
    hi: 'आरबीआई लाइसेंस प्राप्त कंपनियों से शून्य हानि और पूर्ण पारदर्शी व्यावसायिक अवसर',
    bn: 'আরবিআই লাইসেন্সপ্রাপ্ত কোম্পানি থেকে শূন্য ক্ষতি এবং সম্পূর্ণ স্বচ্ছ ব্যবসায়িক সুযোগ',
    ta: 'ஆர்பிஐ உரிமம் பெற்ற நிறுவனங்களிலிருந்து பூஜ்ய இழப்பு மற்றும் முழு வெளிப்படையான வணிக வாய்ப்பு',
    te: 'RBI లైసెన్స్ పొందిన కంపెనీల నుండి జీరో లాస్ మరియు పూర్తి పారదర్శక వ్యాపార అవకాశం',
    mr: 'आरबीआय परवाना प्राप्त कंपन्यांकडून शून्य तोटा आणि पूर्ण पारदर्शक व्यवसाय संधी',
    gu: 'આરબીઆઈ લાઇસન્સ પ્રાપ્ત કંપનીઓ તરફથી શૂન્ય નુકસાન અને સંપૂર્ણ પારદર્શક વ્યવસાય તક',
    kn: 'ಆರ್‌ಬಿಐ ಪರವಾನಗಿ ಪಡೆದ ಕಂಪನಿಗಳಿಂದ ಶೂನ್ಯ ನಷ್ಟ ಮತ್ತು ಸಂಪೂರ್ಣ ಪಾರದರ್ಶಕ ವ್ಯಾಪಾರ ಅವಕಾಶ',
    ml: 'ആർബിഐ ലൈസൻസുള്ള കമ്പനികളിൽ നിന്ന് പൂജ്യം നഷ്ടവും പൂർണ്ണ സുതാര്യവുമായ ബിസിനസ് അവസരം',
    or: 'ଆରବିଆଇ ଲାଇସେନ୍ସପ୍ରାପ୍ତ କମ୍ପାନୀଗୁଡ଼ିକରୁ ଶୂନ୍ୟ କ୍ଷତି ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ସ୍ୱଚ୍ଛ ବ୍ୟବସାୟ ସୁଯୋଗ',
    pa: 'ਆਰਬੀਆਈ ਲਾਇਸੈਂਸਸ਼ੁਦਾ ਕੰਪਨੀਆਂ ਤੋਂ ਜ਼ੀਰੋ ਨੁਕਸਾਨ ਅਤੇ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰਦਰਸ਼ੀ ਕਾਰੋਬਾਰੀ ਮੌਕਾ',
    as: 'আৰবিআই লাইচেন্সপ্ৰাপ্ত কোম্পানীৰ পৰা শূন্য ক্ষতি আৰু সম্পূৰ্ণ স্বচ্ছ ব্যৱসায়িক সুযোগ',
    ur: 'آر بی آئی لائسنس یافتہ کمپنیوں سے صفر نقصان اور مکمل شفاف کاروباری موقع'
  },

  // Return on Investment
  'whyAtm.roi.title': {
    en: 'Return On Investment',
    hi: 'निवेश पर रिटर्न',
    bn: 'বিনিয়োগের উপর রিটার্ন',
    ta: 'முதலீட்டில் வருமானம்',
    te: 'పెట్టుబడిపై రాబడి',
    mr: 'गुंतवणुकीवरील परतावा',
    gu: 'રોકાણ પર વળતર',
    kn: 'ಹೂಡಿಕೆಯ ಮೇಲಿನ ಲಾಭ',
    ml: 'നിക്ഷേപത്തിൽ നിന്നുള്ള വരുമാനം',
    or: 'ନିବେଶ ଉପରେ ରିଟର୍ନ',
    pa: 'ਨਿਵੇਸ਼ ਤੇ ਵਾਪਸੀ',
    as: 'বিনিয়োগৰ ওপৰত ৰিটাৰ্ণ',
    ur: 'سرمایہ کاری پر واپسی'
  },

  'whyAtm.roi.description': {
    en: 'All Payout Received by RBI Licensed WLA ATM Partners',
    hi: 'आरबीआई लाइसेंस प्राप्त WLA एटीएम भागीदारों द्वारा प्राप्त सभी भुगतान',
    bn: 'আরবিআই লাইসেন্সপ্রাপ্ত WLA এটিএম অংশীদারদের দ্বারা প্রাপ্ত সমস্ত পেআউট',
    ta: 'RBI உரிமம் பெற்ற WLA ATM பங்குதாரர்களால் பெறப்பட்ட அனைத்து பணம்',
    te: 'RBI లైసెన్స్ పొందిన WLA ATM భాగస్వాములు అందుకున్న అన్ని చెల్లింపులు',
    mr: 'RBI परवाना प्राप्त WLA ATM भागीदारांनी प्राप्त केलेली सर्व देयके',
    gu: 'RBI લાઇસન્સ પ્રાપ્ત WLA ATM ભાગીદારો દ્વારા પ્રાપ્ત તમામ પેઆઉટ',
    kn: 'RBI ಪರವಾನಗಿ ಪಡೆದ WLA ATM ಪಾಲುದಾರರು ಪಡೆದ ಎಲ್ಲಾ ಪಾವತಿ',
    ml: 'RBI ലൈസൻസുള്ള WLA ATM പങ്കാളികൾക്ക് ലഭിച്ച എല്ലാ പേഔട്ട്',
    or: 'RBI ଲାଇସେନ୍ସପ୍ରାପ୍ତ WLA ATM ଅଂଶୀଦାରମାନଙ୍କ ଦ୍ୱାରା ପ୍ରାପ୍ତ ସମସ୍ତ ପେଆଉଟ୍',
    pa: 'RBI ਲਾਇਸੈਂਸਸ਼ੁਦਾ WLA ATM ਭਾਈਵਾਲਾਂ ਦੁਆਰਾ ਪ੍ਰਾਪਤ ਸਾਰੇ ਭੁਗਤਾਨ',
    as: 'RBI লাইচেন্সপ্ৰাপ্ত WLA ATM অংশীদাৰসকলে লাভ কৰা সকলো পে-আউট',
    ur: 'RBI لائسنس یافتہ WLA ATM پارٹنرز کی طرف سے موصول تمام ادائیگیاں'
  },

  // ATM Penetration
  'whyAtm.penetration.title': {
    en: 'ATM Penetration',
    hi: 'एटीएम प्रवेश',
    bn: 'এটিএম অনুপ্রবেশ',
    ta: 'ஏடிஎம் ஊடுருவல்',
    te: 'ATM వ్యాప్తి',
    mr: 'एटीएम प्रवेश',
    gu: 'એટીએમ પ્રવેશ',
    kn: 'ಎಟಿಎಂ ಪ್ರವೇಶ',
    ml: 'എടിഎം വ്യാപനം',
    or: 'ଏଟିଏମ୍ ପ୍ରବେଶ',
    pa: 'ਏਟੀਐਮ ਪ੍ਰਵੇਸ਼',
    as: 'এটিএম প্ৰৱেশ',
    ur: 'اے ٹی ایم رسائی'
  },

  'whyAtm.penetration.description': {
    en: 'Only 15 ATMs per 1 Lac People - ATM Penetration in India is very Low',
    hi: 'प्रति 1 लाख लोगों पर केवल 15 एटीएम - भारत में एटीएम प्रवेश बहुत कम है',
    bn: 'প্রতি ১ লক্ষ মানুষে মাত্র ১৫টি এটিএম - ভারতে এটিএম অনুপ্রবেশ খুবই কম',
    ta: '1 லட்சம் மக்களுக்கு 15 ஏடிஎம்கள் மட்டுமே - இந்தியாவில் ஏடிஎம் ஊடுருவல் மிகவும் குறைவு',
    te: '1 లక్ష మందికి కేవలం 15 ATMలు - భారతదేశంలో ATM వ్యాప్తి చాలా తక్కువ',
    mr: 'प्रति 1 लाख लोकांसाठी केवळ 15 एटीएम - भारतात एटीएम प्रवेश खूप कमी आहे',
    gu: 'દર 1 લાખ લોકો દીઠ માત્ર 15 એટીએમ - ભારતમાં એટીએમ પ્રવેશ ખૂબ ઓછો છે',
    kn: 'ಪ್ರತಿ 1 ಲಕ್ಷ ಜನರಿಗೆ ಕೇವಲ 15 ಎಟಿಎಂಗಳು - ಭಾರತದಲ್ಲಿ ಎಟಿಎಂ ಪ್ರವೇಶ ತುಂಬಾ ಕಡಿಮೆ',
    ml: '1 ലക്ഷം ആളുകൾക്ക് 15 എടിഎമുകൾ മാത്രം - ഇന്ത്യയിൽ എടിഎം വ്യാപനം വളരെ കുറവാണ്',
    or: 'ପ୍ରତି ୧ ଲକ୍ଷ ଲୋକଙ୍କ ପାଇଁ କେବଳ ୧୫ ଏଟିଏମ୍ - ଭାରତରେ ଏଟିଏମ୍ ପ୍ରବେଶ ବହୁତ କମ୍',
    pa: 'ਪ੍ਰਤੀ 1 ਲੱਖ ਲੋਕਾਂ ਲਈ ਸਿਰਫ਼ 15 ਏਟੀਐਮ - ਭਾਰਤ ਵਿੱਚ ਏਟੀਐਮ ਪ੍ਰਵੇਸ਼ ਬਹੁਤ ਘੱਟ ਹੈ',
    as: 'প্ৰতি ১ লাখ লোকৰ বাবে মাত্ৰ ১৫টা এটিএম - ভাৰতত এটিএম প্ৰৱেশ বহুত কম',
    ur: 'فی 1 لاکھ افراد صرف 15 اے ٹی ایم - ہندوستان میں اے ٹی ایم کی رسائی بہت کم ہے'
  },

  // Cash Circulation
  'whyAtm.cash.title': {
    en: 'Cash Circulation',
    hi: 'नकद प्रसार',
    bn: 'নগদ সঞ্চালন',
    ta: 'பண புழக்கம்',
    te: 'నగదు చలామణి',
    mr: 'रोख परिसंचरण',
    gu: 'રોકડ પરિભ્રમણ',
    kn: 'ನಗದು ಚಲಾವಣೆ',
    ml: 'പണം വിതരണം',
    or: 'ନଗଦ ପ୍ରସାରଣ',
    pa: 'ਨਕਦ ਸੰਚਾਰ',
    as: 'নগদ প্ৰচলন',
    ur: 'نقد گردش'
  },

  'whyAtm.cash.description': {
    en: 'Indian Economy is still Largely Cash based',
    hi: 'भारतीय अर्थव्यवस्था अभी भी मुख्य रूप से नकदी आधारित है',
    bn: 'ভারতীয় অর্থনীতি এখনও মূলত নগদ ভিত্তিক',
    ta: 'இந்திய பொருளாதாரம் இன்னும் பெரும்பாலும் பண அடிப்படையிலானது',
    te: 'భారత ఆర్థిక వ్యవస్థ ఇప్పటికీ ఎక్కువగా నగదు ఆధారితమే',
    mr: 'भारतीय अर्थव्यवस्था अजूनही मुख्यत्वे रोखीवर आधारित आहे',
    gu: 'ભારતીય અર્થતંત્ર હજુ પણ મોટાભાગે રોકડ આધારિત છે',
    kn: 'ಭಾರತೀಯ ಆರ್ಥಿಕತೆ ಇನ್ನೂ ಹೆಚ್ಚಾಗಿ ನಗದು ಆಧಾರಿತವಾಗಿದೆ',
    ml: 'ഇന്ത്യൻ സമ്പദ്‌വ്യവസ്ഥ ഇപ്പോഴും പ്രധാനമായും പണം അടിസ്ഥാനമാക്കിയുള്ളതാണ്',
    or: 'ଭାରତୀୟ ଅର୍ଥନୀତି ଏବେ ବି ମୁଖ୍ୟତଃ ନଗଦ ଆଧାରିତ',
    pa: 'ਭਾਰਤੀ ਅਰਥਵਿਵਸਥਾ ਅਜੇ ਵੀ ਮੁੱਖ ਤੌਰ ਤੇ ਨਕਦ ਆਧਾਰਿਤ ਹੈ',
    as: 'ভাৰতীয় অৰ্থনীতি এতিয়াও মূলতঃ নগদ ভিত্তিক',
    ur: 'ہندوستانی معیشت اب بھی بڑی حد تک نقد پر مبنی ہے'
  },

  // Market Opportunity
  'whyAtm.market.title': {
    en: 'Market Opportunity',
    hi: 'बाजार अवसर',
    bn: 'বাজার সুযোগ',
    ta: 'சந்தை வாய்ப்பு',
    te: 'మార్కెట్ అవకాశం',
    mr: 'बाजार संधी',
    gu: 'બજાર તક',
    kn: 'ಮಾರುಕಟ್ಟೆ ಅವಕಾಶ',
    ml: 'വിപണി അവസരം',
    or: 'ବଜାର ସୁଯୋଗ',
    pa: 'ਬਾਜ਼ਾਰ ਮੌਕਾ',
    as: 'বজাৰ সুযোগ',
    ur: 'مارکیٹ موقع'
  },

  'whyAtm.market.description': {
    en: '90% of Banks Offsite ATMs are closing down - Banks Offsite ATM Closure creates a Large market for ATMs',
    hi: '90% बैंकों के ऑफसाइट एटीएम बंद हो रहे हैं - बैंकों के ऑफसाइट एटीएम बंद होने से एटीएम के लिए बड़ा बाजार बनता है',
    bn: '৯০% ব্যাংকের অফসাইট এটিএম বন্ধ হয়ে যাচ্ছে - ব্যাংকের অফসাইট এটিএম বন্ধ হওয়া এটিএমের জন্য একটি বড় বাজার তৈরি করে',
    ta: '90% வங்கிகளின் ஆஃப்சைட் ஏடிஎம்கள் மூடப்படுகின்றன - வங்கிகளின் ஆஃப்சைட் ஏடிஎம் மூடல் ஏடிஎம்களுக்கு பெரிய சந்தையை உருவாக்குகிறது',
    te: '90% బ్యాంకుల ఆఫ్‌సైట్ ATMలు మూసివేయబడుతున్నాయి - బ్యాంకుల ఆఫ్‌సైట్ ATM మూసివేత ATMలకు పెద్ద మార్కెట్‌ను సృష్టిస్తుంది',
    mr: '90% बँकांचे ऑफसाइट एटीएम बंद होत आहेत - बँकांचे ऑफसाइट एटीएम बंद झाल्याने एटीएमसाठी मोठी बाजारपेठ तयार होते',
    gu: '90% બેંકોના ઓફસાઇટ એટીએમ બંધ થઈ રહ્યા છે - બેંકોના ઓફસાઇટ એટીએમ બંધ થવાથી એટીએમ માટે મોટું બજાર સર્જાય છે',
    kn: '90% ಬ್ಯಾಂಕ್‌ಗಳ ಆಫ್‌ಸೈಟ್ ಎಟಿಎಂಗಳು ಮುಚ್ಚುತ್ತಿವೆ - ಬ್ಯಾಂಕ್‌ಗಳ ಆಫ್‌ಸೈಟ್ ಎಟಿಎಂ ಮುಚ್ಚುವಿಕೆ ಎಟಿಎಂಗಳಿಗೆ ದೊಡ್ಡ ಮಾರುಕಟ್ಟೆಯನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ',
    ml: '90% ബാങ്കുകളുടെ ഓഫ്‌സൈറ്റ് എടിഎമുകൾ അടച്ചുപൂട്ടുന്നു - ബാങ്കുകളുടെ ഓഫ്‌സൈറ്റ് എടിഎം അടച്ചുപൂട്ടൽ എടിഎമുകൾക്ക് വലിയ വിപണി സൃഷ്ടിക്കുന്നു',
    or: '୯୦% ବ୍ୟାଙ୍କର ଅଫସାଇଟ୍ ଏଟିଏମ୍ ବନ୍ଦ ହେଉଛି - ବ୍ୟାଙ୍କର ଅଫସାଇଟ୍ ଏଟିଏମ୍ ବନ୍ଦ ଏଟିଏମ୍ ପାଇଁ ଏକ ବଡ଼ ବଜାର ସୃଷ୍ଟି କରେ',
    pa: '90% ਬੈਂਕਾਂ ਦੇ ਆਫਸਾਈਟ ਏਟੀਐਮ ਬੰਦ ਹੋ ਰਹੇ ਹਨ - ਬੈਂਕਾਂ ਦੇ ਆਫਸਾਈਟ ਏਟੀਐਮ ਬੰਦ ਹੋਣ ਨਾਲ ਏਟੀਐਮ ਲਈ ਵੱਡਾ ਬਾਜ਼ਾਰ ਬਣਦਾ ਹੈ',
    as: '৯০% বেংকৰ অফচাইট এটিএম বন্ধ হৈ আছে - বেংকৰ অফচাইট এটিএম বন্ধ হোৱাই এটিএমৰ বাবে এক ডাঙৰ বজাৰ সৃষ্টি কৰে',
    ur: '90٪ بینکوں کے آف سائٹ اے ٹی ایم بند ہو رہے ہیں - بینکوں کے آف سائٹ اے ٹی ایم بند ہونے سے اے ٹی ایم کے لیے بڑی مارکیٹ بنتی ہے'
  },

  // Trust signals
  'trust.heading': {
    en: 'Trusted by Businesses Nationwide',
    hi: 'देशभर के व्यवसायों द्वारा विश्वसनीय',
    bn: 'দেশব্যাপী ব্যবসায় দ্বারা বিশ্বস্ত',
    ta: 'நாடு முழுவதும் வணிகங்களால் நம்பப்படுகிறது',
    te: 'దేశవ్యాప్తంగా వ్యాపారాలచే నమ్మకమైనది',
    mr: 'देशभरातील व्यवसायांनी विश्वसनीय',
    gu: 'દેશભરના વ્યવસાયો દ્વારા વિશ્વસનીય',
    kn: 'ರಾಷ್ಟ್ರವ್ಯಾಪಿ ವ್ಯವಹಾರಗಳಿಂದ ನಂಬಿಕೆ',
    ml: 'രാജ്യവ്യാപകമായി ബിസിനസുകൾ വിശ്വസിക്കുന്നു',
    or: 'ଦେଶବ୍ୟାପୀ ବ୍ୟବସାୟ ଦ୍ୱାରା ବିଶ୍ୱସନୀୟ',
    pa: 'ਦੇਸ਼ ਭਰ ਦੇ ਕਾਰੋਬਾਰਾਂ ਦੁਆਰਾ ਭਰੋਸੇਮੰਦ',
    as: 'দেশজুৰি ব্যৱসায়সমূহৰ দ্বাৰা বিশ্বাসযোগ্য',
    ur: 'ملک بھر میں کاروباروں کی طرف سے قابل اعتماد'
  },

  'trust.subtitle': {
    en: 'Join thousands of successful partners who trust us with their ATM business operations',
    hi: 'हजारों सफल भागीदारों में शामिल हों जो अपने एटीएम व्यवसाय संचालन के लिए हम पर भरोसा करते हैं',
    bn: 'হাজার হাজার সফল অংশীদারদের সাথে যোগ দিন যারা তাদের এটিএম ব্যবসায়িক কার্যক্রমের জন্য আমাদের বিশ্বাস করে',
    ta: 'தங்கள் ஏடிஎம் வணிக செயல்பாடுகளுக்கு எங்களை நம்பும் ஆயிரக்கணக்கான வெற்றிகரமான பங்குதாரர்களுடன் சேரவும்',
    te: 'వారి ATM వ్యాపార కార్యకలాపాల కోసం మమ్మల్ని నమ్మే వేలాది విజయవంతమైన భాగస్వాములతో చేరండి',
    mr: 'त्यांच्या एटीएम व्यवसाय कार्यांसाठी आमच्यावर विश्वास ठेवणाऱ्या हजारो यशस्वी भागीदारांमध्ये सामील व्हा',
    gu: 'હજારો સફળ ભાગીદારો સાથે જોડાઓ જેઓ તેમના એટીએમ વ્યવસાય કામગીરી માટે અમારા પર વિશ્વાસ કરે છે',
    kn: 'ತಮ್ಮ ಎಟಿಎಂ ವ್ಯವಹಾರ ಕಾರ್ಯಾಚರಣೆಗಳಿಗಾಗಿ ನಮ್ಮನ್ನು ನಂಬುವ ಸಾವಿರಾರು ಯಶಸ್ವಿ ಪಾಲುದಾರರೊಂದಿಗೆ ಸೇರಿ',
    ml: 'അവരുടെ എടിഎം ബിസിനസ് പ്രവർത്തനങ്ങൾക്കായി ഞങ്ങളെ വിശ്വസിക്കുന്ന ആയിരക്കണക്കിന് വിജയകരമായ പങ്കാളികളോട് ചേരുക',
    or: 'ସେମାନଙ୍କର ଏଟିଏମ୍ ବ୍ୟବସାୟ କାର୍ଯ୍ୟ ପାଇଁ ଆମକୁ ବିଶ୍ୱାସ କରୁଥିବା ହଜାର ହଜାର ସଫଳ ଅଂଶୀଦାରମାନଙ୍କ ସହିତ ଯୋଗ ଦିଅନ୍ତୁ',
    pa: 'ਹਜ਼ਾਰਾਂ ਸਫਲ ਭਾਈਵਾਲਾਂ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ ਜੋ ਆਪਣੇ ਏਟੀਐਮ ਕਾਰੋਬਾਰੀ ਕਾਰਜਾਂ ਲਈ ਸਾਡੇ ਤੇ ਭਰੋਸਾ ਕਰਦੇ ਹਨ',
    as: 'হাজাৰ হাজাৰ সফল অংশীদাৰৰ সৈতে যোগদান কৰক যিসকলে তেওঁলোকৰ এটিএম ব্যৱসায় কাৰ্যৰ বাবে আমাক বিশ্বাস কৰে',
    ur: 'ہزاروں کامیاب شراکت داروں میں شامل ہوں جو اپنے اے ٹی ایم کاروباری کاموں کے لیے ہم پر بھروسہ کرتے ہیں'
  },

  'trust.activePartners': {
    en: 'Active Partners',
    hi: 'सक्रिय भागीदार',
    bn: 'সক্রিয় অংশীদার',
    ta: 'செயல்படும் பங்குதாரர்கள்',
    te: 'క్రియాశీల భాగస్వాములు',
    mr: 'सक्रिय भागीदार',
    gu: 'સક્રિય ભાગીદારો',
    kn: 'ಸಕ್ರಿಯ ಪಾಲುದಾರರು',
    ml: 'സജീവ പങ്കാളികൾ',
    or: 'ସକ୍ରିୟ ଅଂଶୀଦାର',
    pa: 'ਸਰਗਰਮ ਭਾਈਵਾਲ',
    as: 'সক্ৰিয় অংশীদাৰ',
    ur: 'فعال شراکت دار'
  },

  'trust.uptimeGuarantee': {
    en: 'Uptime Guarantee',
    hi: 'अपटाइम गारंटी',
    bn: 'আপটাইম গ্যারান্টি',
    ta: 'இயக்க நேர உத்தரவாதம்',
    te: 'అప్‌టైమ్ గ్యారెంటీ',
    mr: 'अपटाइम हमी',
    gu: 'અપટાઇમ ગેરંટી',
    kn: 'ಅಪ್‌ಟೈಮ್ ಗ್ಯಾರಂಟಿ',
    ml: 'അപ്‌ടൈം ഗ്യാരണ്ടി',
    or: 'ଅପଟାଇମ୍ ଗ୍ୟାରେଣ୍ଟି',
    pa: 'ਅੱਪਟਾਈਮ ਗਾਰੰਟੀ',
    as: 'আপটাইম গেৰাণ্টি',
    ur: 'اپ ٹائم گارنٹی'
  },

  'trust.industryExperience': {
    en: 'Industry Experience',
    hi: 'उद्योग अनुभव',
    bn: 'শিল্প অভিজ্ঞতা',
    ta: 'தொழில் அனுபவம்',
    te: 'పరిశ్రమ అనుభవం',
    mr: 'उद्योग अनुभव',
    gu: 'ઉદ્યોગ અનુભવ',
    kn: 'ಉದ್ಯಮ ಅನುಭವ',
    ml: 'വ്യവസായ അനുഭവം',
    or: 'ଶିଳ୍ପ ଅଭିଜ୍ଞତା',
    pa: 'ਉਦਯੋਗ ਤਜਰਬਾ',
    as: 'উদ্যোগ অভিজ্ঞতা',
    ur: 'صنعت کا تجربہ'
  },

  'trust.customerSupport': {
    en: 'Customer Support',
    hi: 'ग्राहक सहायता',
    bn: 'গ্রাহক সহায়তা',
    ta: 'வாடிக்கையாளர் ஆதரவு',
    te: 'కస్టమర్ మద్దతు',
    mr: 'ग्राहक समर्थन',
    gu: 'ગ્રાહક આધાર',
    kn: 'ಗ್ರಾಹಕ ಬೆಂಬಲ',
    ml: 'ഉപഭോക്തൃ പിന്തുണ',
    or: 'ଗ୍ରାହକ ସହାୟତା',
    pa: 'ਗਾਹਕ ਸਹਾਇਤਾ',
    as: 'গ্ৰাহক সহায়তা',
    ur: 'کسٹمر سپورٹ'
  },

  // Footer sections
  'footer.quickLinks': {
    en: 'Quick Links',
    hi: 'त्वरित लिंक',
    bn: 'দ্রুত লিঙ্ক',
    ta: 'விரைவு இணைப்புகள்',
    te: 'త్వరిత లింక్‌లు',
    mr: 'त्वरित लिंक',
    gu: 'ઝડપી લિંક્સ',
    kn: 'ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು',
    ml: 'വേഗത്തിലുള്ള ലിങ്കുകൾ',
    or: 'ତ୍ୱରିତ ଲିଙ୍କ୍',
    pa: 'ਤੇਜ਼ ਲਿੰਕ',
    as: 'দ্ৰুত লিংক',
    ur: 'فوری لنکس'
  },

  'footer.ourServices': {
    en: 'Our Services',
    hi: 'हमारी सेवाएं',
    bn: 'আমাদের পরিষেবা',
    ta: 'எங்கள் சேவைகள்',
    te: 'మా సేవలు',
    mr: 'आमच्या सेवा',
    gu: 'અમારી સેવાઓ',
    kn: 'ನಮ್ಮ ಸೇವೆಗಳು',
    ml: 'ഞങ്ങളുടെ സേവനങ്ങൾ',
    or: 'ଆମର ସେବା',
    pa: 'ਸਾਡੀਆਂ ਸੇਵਾਵਾਂ',
    as: 'আমাৰ সেৱাসমূহ',
    ur: 'ہماری خدمات'
  },

  'footer.legal': {
    en: 'Legal',
    hi: 'कानूनी',
    bn: 'আইনি',
    ta: 'சட்டபூர்வ',
    te: 'చట్టపరమైన',
    mr: 'कायदेशीर',
    gu: 'કાનૂની',
    kn: 'ಕಾನೂನು',
    ml: 'നിയമപരമായ',
    or: 'ଆଇନଗତ',
    pa: 'ਕਾਨੂੰਨੀ',
    as: 'আইনী',
    ur: 'قانونی'
  },

  'footer.submitLocation': {
    en: 'Submit ATM Location',
    hi: 'एटीएम स्थान सबमिट करें',
    bn: 'এটিএম অবস্থান জমা দিন',
    ta: 'ஏடிஎம் இடத்தை சமர்ப்பிக்கவும்',
    te: 'ATM స్థానాన్ని సమర్పించండి',
    mr: 'एटीएम स्थान सबमिट करा',
    gu: 'એટીએમ સ્થાન સબમિટ કરો',
    kn: 'ಎಟಿಎಂ ಸ್ಥಳವನ್ನು ಸಲ್ಲಿಸಿ',
    ml: 'എടിഎം സ്ഥലം സമർപ്പിക്കുക',
    or: 'ଏଟିଏମ୍ ସ୍ଥାନ ଦାଖଲ କରନ୍ତୁ',
    pa: 'ਏਟੀਐਮ ਸਥਾਨ ਸਬਮਿਟ ਕਰੋ',
    as: 'এটিএম স্থান জমা দিয়ক',
    ur: 'اے ٹی ایم مقام جمع کریں'
  },

  'footer.becomeFranchise': {
    en: 'Become Franchise',
    hi: 'फ्रैंचाइज़ी बनें',
    bn: 'ফ্র্যাঞ্চাইজি হন',
    ta: 'ஃபிரான்சைஸ் ஆகுங்கள்',
    te: 'ఫ్రాంచైజీ అవ్వండి',
    mr: 'फ्रँचायझी बना',
    gu: 'ફ્રેન્ચાઇઝી બનો',
    kn: 'ಫ್ರಾಂಚೈಸಿ ಆಗಿ',
    ml: 'ഫ്രാഞ്ചൈസി ആകുക',
    or: 'ଫ୍ରାଞ୍ଚାଇଜି ହୁଅନ୍ତୁ',
    pa: 'ਫਰੈਂਚਾਈਜ਼ੀ ਬਣੋ',
    as: 'ফ্ৰেঞ্চাইজী হওক',
    ur: 'فرنچائز بنیں'
  },

  'footer.agent': {
    en: 'Agent',
    hi: 'एजेंट',
    bn: 'এজেন্ট',
    ta: 'முகவர்',
    te: 'ఏజెంట్',
    mr: 'एजंट',
    gu: 'એજન્ટ',
    kn: 'ಏಜೆಂಟ್',
    ml: 'ഏജന്റ്',
    or: 'ଏଜେଣ୍ଟ',
    pa: 'ਏਜੰਟ',
    as: 'এজেণ্ট',
    ur: 'ایجنٹ'
  },

  'footer.influencer': {
    en: 'Influencer',
    hi: 'प्रभावशाली',
    bn: 'প্রভাবশালী',
    ta: 'செல்வாக்கு மிக்கவர்',
    te: 'ప్రభావశాలి',
    mr: 'प्रभावशाली',
    gu: 'પ્રભાવશાળી',
    kn: 'ಪ್ರಭಾವಶಾಲಿ',
    ml: 'സ്വാധീനക്കാരൻ',
    or: 'ପ୍ରଭାବଶାଳୀ',
    pa: 'ਪ੍ਰਭਾਵਸ਼ਾਲੀ',
    as: 'প্ৰভাৱশালী',
    ur: 'اثر و رسوخ والا'
  },

  'footer.privacyPolicy': {
    en: 'Privacy Policy',
    hi: 'गोपनीयता नीति',
    bn: 'গোপনীয়তা নীতি',
    ta: 'தனியுரிமை கொள்கை',
    te: 'గోప్యతా విధానం',
    mr: 'गोपनीयता धोरण',
    gu: 'ગોપનીયતા નીતિ',
    kn: 'ಗೌಪ್ಯತಾ ನೀತಿ',
    ml: 'സ്വകാര്യതാ നയം',
    or: 'ଗୋପନୀୟତା ନୀତି',
    pa: 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ',
    as: 'গোপনীয়তা নীতি',
    ur: 'رازداری کی پالیسی'
  },

  'footer.termsConditions': {
    en: 'Terms & Conditions',
    hi: 'नियम और शर्तें',
    bn: 'শর্তাবলী',
    ta: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
    te: 'నిబంధనలు & షరతులు',
    mr: 'अटी आणि शर्ती',
    gu: 'નિયમો અને શરતો',
    kn: 'ನಿಯಮಗಳು ಮತ್ತು ಷರತ್ತುಗಳು',
    ml: 'നിബന്ധനകളും വ്യവസ്ഥകളും',
    or: 'ନିୟମ ଏବଂ ସର୍ତ୍ତ',
    pa: 'ਨਿਯਮ ਅਤੇ ਸ਼ਰਤਾਂ',
    as: 'নিয়ম আৰু চৰ্তসমূহ',
    ur: 'شرائط و ضوابط'
  },

  'footer.refundPolicy': {
    en: 'Refund Policy',
    hi: 'धनवापसी नीति',
    bn: 'ফেরত নীতি',
    ta: 'பணத்திருப்பி கொள்கை',
    te: 'రీఫండ్ విధానం',
    mr: 'परतावा धोरण',
    gu: 'રિફંડ નીતિ',
    kn: 'ಮರುಪಾವತಿ ನೀತಿ',
    ml: 'റീഫണ്ട് നയം',
    or: 'ଫେରସ୍ତ ନୀତି',
    pa: 'ਰਿਫੰਡ ਨੀਤੀ',
    as: 'ধন ঘূৰাই দিয়া নীতি',
    ur: 'رقم کی واپسی کی پالیسی'
  },

  'footer.accessibilityStatement': {
    en: 'Accessibility Statement',
    hi: 'पहुंच विवरण',
    bn: 'অ্যাক্সেসিবিলিটি বিবৃতি',
    ta: 'அணுகல் அறிக்கை',
    te: 'యాక్సెసిబిలిటీ ప్రకటన',
    mr: 'प्रवेशयोग्यता विधान',
    gu: 'સુલભતા નિવેદન',
    kn: 'ಪ್ರವೇಶಿಸುವಿಕೆ ಹೇಳಿಕೆ',
    ml: 'പ്രവേശനക്ഷമത പ്രസ്താവന',
    or: 'ପ୍ରବେଶ ଯୋଗ୍ୟତା ବିବୃତି',
    pa: 'ਪਹੁੰਚਯੋਗਤਾ ਬਿਆਨ',
    as: 'প্ৰৱেশযোগ্যতা বিবৃতি',
    ur: 'رسائی کا بیان'
  },

  'footer.aboutUs': {
    en: 'About Us',
    hi: 'हमारे बारे में',
    bn: 'আমাদের সম্পর্কে',
    ta: 'எங்களை பற்றி',
    te: 'మా గురించి',
    mr: 'आमच्याबद्दल',
    gu: 'અમારા વિશે',
    kn: 'ನಮ್ಮ ಬಗ್ಗೆ',
    ml: 'ഞങ്ങളെക്കുറിച്ച്',
    or: 'ଆମ ବିଷୟରେ',
    pa: 'ਸਾਡੇ ਬਾਰੇ',
    as: 'আমাৰ বিষয়ে',
    ur: 'ہمارے بارے میں'
  },

  'footer.contactUs': {
    en: 'Contact Us',
    hi: 'संपर्क करें',
    bn: 'যোগাযোগ করুন',
    ta: 'எங்களை தொடர்பு கொள்ள',
    te: 'మమ్మల్ని సంప్రదించండి',
    mr: 'आमच्याशी संपर्क साधा',
    gu: 'અમારો સંપર્ક કરો',
    kn: 'ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ',
    ml: 'ഞങ്ങളെ ബന്ധപ്പെടുക',
    or: 'ଆମକୁ ଯୋଗାଯୋଗ କରନ୍ତୁ',
    pa: 'ਸਾਡੇ ਨਾਲ ਸੰਪਰਕ ਕਰੋ',
    as: 'আমাৰ সৈতে যোগাযোগ কৰক',
    ur: 'ہم سے رابطہ کریں'
  }
};

// Function to update translation files
function updateTranslationFiles() {
  const localesDir = path.join(__dirname, '..', 'public', 'locales');
  
  // Process each language
  const languages = ['en', 'hi', 'bn', 'ta', 'te', 'mr', 'gu', 'kn', 'ml', 'or', 'pa', 'as', 'ur'];
  
  languages.forEach(lang => {
    const langDir = path.join(localesDir, lang);
    
    // Ensure directory exists
    if (!fs.existsSync(langDir)) {
      fs.mkdirSync(langDir, { recursive: true });
    }
    
    // Update common.json
    const commonFile = path.join(langDir, 'common.json');
    let commonData = {};
    if (fs.existsSync(commonFile)) {
      commonData = JSON.parse(fs.readFileSync(commonFile, 'utf8'));
    }
    
    // Add missing translations
    commonData.nav = commonData.nav || {};
    commonData.nav.joinUs = translationFixes['nav.joinUs'][lang];
    commonData.nav.home = translationFixes['breadcrumb.home'][lang];
    
    commonData.breadcrumb = commonData.breadcrumb || {};
    commonData.breadcrumb.home = translationFixes['breadcrumb.home'][lang];
    
    commonData.footer = commonData.footer || {};
    commonData.footer.quickLinks = translationFixes['footer.quickLinks'][lang];
    commonData.footer.ourServices = translationFixes['footer.ourServices'][lang];
    commonData.footer.legal = translationFixes['footer.legal'][lang];
    commonData.footer.submitLocation = translationFixes['footer.submitLocation'][lang];
    commonData.footer.becomeFranchise = translationFixes['footer.becomeFranchise'][lang];
    commonData.footer.agent = translationFixes['footer.agent'][lang];
    commonData.footer.influencer = translationFixes['footer.influencer'][lang];
    commonData.footer.privacyPolicy = translationFixes['footer.privacyPolicy'][lang];
    commonData.footer.termsConditions = translationFixes['footer.termsConditions'][lang];
    commonData.footer.refundPolicy = translationFixes['footer.refundPolicy'][lang];
    commonData.footer.accessibilityStatement = translationFixes['footer.accessibilityStatement'][lang];
    commonData.footer.aboutUs = translationFixes['footer.aboutUs'][lang];
    commonData.footer.contactUs = translationFixes['footer.contactUs'][lang];
    
    fs.writeFileSync(commonFile, JSON.stringify(commonData, null, 2), 'utf8');
    
    // Update home.json
    const homeFile = path.join(langDir, 'home.json');
    let homeData = {};
    if (fs.existsSync(homeFile)) {
      homeData = JSON.parse(fs.readFileSync(homeFile, 'utf8'));
    }
    
    homeData.whyAtm = homeData.whyAtm || {};
    homeData.whyAtm.heading = translationFixes['whyAtm.heading'][lang];
    homeData.whyAtm.subtitle = translationFixes['whyAtm.subtitle'][lang];
    
    homeData.whyAtm.roi = homeData.whyAtm.roi || {};
    homeData.whyAtm.roi.title = translationFixes['whyAtm.roi.title'][lang];
    homeData.whyAtm.roi.description = translationFixes['whyAtm.roi.description'][lang];
    
    homeData.whyAtm.penetration = homeData.whyAtm.penetration || {};
    homeData.whyAtm.penetration.title = translationFixes['whyAtm.penetration.title'][lang];
    homeData.whyAtm.penetration.description = translationFixes['whyAtm.penetration.description'][lang];
    
    homeData.whyAtm.cash = homeData.whyAtm.cash || {};
    homeData.whyAtm.cash.title = translationFixes['whyAtm.cash.title'][lang];
    homeData.whyAtm.cash.description = translationFixes['whyAtm.cash.description'][lang];
    
    homeData.whyAtm.market = homeData.whyAtm.market || {};
    homeData.whyAtm.market.title = translationFixes['whyAtm.market.title'][lang];
    homeData.whyAtm.market.description = translationFixes['whyAtm.market.description'][lang];
    
    homeData.trust = homeData.trust || {};
    homeData.trust.heading = translationFixes['trust.heading'][lang];
    homeData.trust.subtitle = translationFixes['trust.subtitle'][lang];
    homeData.trust.activePartners = translationFixes['trust.activePartners'][lang];
    homeData.trust.uptimeGuarantee = translationFixes['trust.uptimeGuarantee'][lang];
    homeData.trust.industryExperience = translationFixes['trust.industryExperience'][lang];
    homeData.trust.customerSupport = translationFixes['trust.customerSupport'][lang];
    
    fs.writeFileSync(homeFile, JSON.stringify(homeData, null, 2), 'utf8');
  });
  
  console.log('✅ Translation files updated with all missing keys');
}

// Run the update
updateTranslationFiles();

console.log('Day 6 Translation Fix Complete! All English content should now have proper translations.');