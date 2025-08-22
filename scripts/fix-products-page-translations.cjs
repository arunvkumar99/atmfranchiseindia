const fs = require('fs');
const path = require('path');

// Fix OurProducts.tsx hardcoded text issue
console.log('🔧 Fixing OurProducts.tsx Translation Implementation');
console.log('=' .repeat(80));

// First, let's add missing keys to Tamil products.json
const tamilProductsPath = path.join(__dirname, '..', 'public', 'locales', 'ta', 'products.json');
const tamilProducts = JSON.parse(fs.readFileSync(tamilProductsPath, 'utf-8'));

// Add missing hero section translations
if (!tamilProducts.hero) {
  tamilProducts.hero = {};
}

tamilProducts.hero = {
  ...tamilProducts.hero,
  badge: "பிரீமியம் வணிக தீர்வுகள்",
  title: {
    main: "ஏடிஎம் வணிகம்",
    rotating: ["தீர்வுகள்", "நன்மை", "தயாரிப்புகள்", "வெற்றி", "சிறப்பு"]
  },
  titles: {
    solutions: "தீர்வுகள்",
    advantage: "நன்மை",
    products: "தயாரிப்புகள்",
    success: "வெற்றி",
    excellence: "சிறப்பு"
  },
  subtitle: "எங்கள் விரிவான ஏடிஎம் உரிமை தீர்வுகளுடன் உங்கள் தொழில்முனைவோர் கனவுகளை நிஜமாக்குங்கள். தொழில்நுட்பம், ஆதரவு மற்றும் லாபத்தின் சரியான கலவையை அனுபவிக்கவும்.",
  buttons: {
    explore: "தீர்வுகளை ஆராயவும்",
    contact: "எங்களை தொடர்பு கொள்ளவும்",
    franchise: "உரிமையாளராக ஆகவும்"
  },
  stats: {
    partners: {
      value: "4+",
      label: "WLA பங்குதாரர்கள்"
    },
    care360: {
      value: "₹30K",
      label: "Care360 மதிப்பு"
    },
    visibility: {
      value: "₹3K",
      label: "தெரிவுநிலை அதிகரிப்பு"
    }
  }
};

// Add partner translations
if (!tamilProducts.partners) {
  tamilProducts.partners = {};
}

tamilProducts.partners = {
  ...tamilProducts.partners,
  sectionTitle: "எங்கள் நம்பகமான WLA பங்குதாரர்கள்",
  badge: "பிரீமியம் பங்குதாரர் நெட்வொர்க்",
  title: {
    part1: "WLA ஏடிஎம்கள்",
    part2: "பங்குதாரித்தம்"
  },
  description: "எங்கள் பிரத்யேக பங்குதாரர் நெட்வொர்க் மூலம் இந்தியாவின் மிகவும் நம்பகமான வைட் லேபிள் ஏடிஎம் ஆபரேட்டர்களை அணுகவும். உங்கள் இருப்பிடம் மற்றும் முதலீட்டு விருப்பங்களின் அடிப்படையில் பல ஆபரேட்டர்களிலிருந்து தேர்வு செய்யவும்.",
  vakrangee: {
    name: "வக்ரங்கீ",
    tagline: "சந்தை தலைவர்"
  },
  findi: {
    name: "ஃபிண்டி",
    tagline: "வேகமாக வளரும்"
  },
  indiaone: {
    name: "இந்தியா ஒன்",
    tagline: "நம்பகமான நெட்வொர்க்"
  },
  eps: {
    name: "EPS பாங்க்ஸ்",
    tagline: "நிரூபிக்கப்பட்ட சாதனை"
  },
  stats: {
    roi: {
      value: "12-18",
      label: "மாதங்கள் ROI"
    },
    income: {
      value: "₹15K+",
      label: "மாதாந்திர வருமானம்"
    }
  },
  cta: "உங்கள் உரிமையைத் தொடங்கவும்"
};

// Add Care360 section
if (!tamilProducts.care360) {
  tamilProducts.care360 = {};
}

tamilProducts.care360 = {
  ...tamilProducts.care360,
  badge: "பிரத்யேக சேவை",
  title: {
    part1: "Care360",
    part2: "மேலாண்மை"
  },
  subtitle: "₹30,000 மதிப்புள்ள பிரீமியம் சேவை",
  description: "மாதம் வெறும் ₹999க்கு விரிவான ஏடிஎம் மேலாண்மை சேவைகளைப் பெறுங்கள். உங்கள் ஏடிஎம் வணிகத்தின் எல்லா அம்சங்களையும் நாங்கள் கவனித்துக்கொள்கிறோம்.",
  features: {
    gmb: "🎯 Google GMB சுயவிவரம் & இடம் அதிகரிப்பு",
    settlement: "⚖️ தீர்வு தகராறு தீர்வு",
    payout: "💰 பணம் செலுத்தும் தாமதம் & முரண்பாடு கையாளுதல்",
    troubleshooting: "🔧 ஏடிஎம் & சொத்து சிக்கல் தீர்வு",
    insurance: "🛡️ காப்பீட்டு உரிமை தாக்கல் & பின்தொடர்தல்",
    tax: "📊 194N TDS குறியிடுதல் & வரி இணக்கம்",
    support: "⚡ வேகமான பதில் ஆதரவு குழு",
    account: "🏦 தீர்வு கணக்கு திறப்பதில் உதவி"
  },
  originalPrice: "₹30,000",
  offerPrice: "₹999/மாதம்",
  savings: "மாதம் ₹29,000 சேமிக்கவும்!",
  benefits: {
    title: "நன்மைகள்",
    list: [
      "அனைத்து WLA ஆபரேட்டர்களுக்கும் ஒற்றை புள்ளி ஆதரவு",
      "பிரத்யேக உறவு மேலாளர்",
      "முன்னுரிமை சிக்கல் தீர்வு",
      "மாதாந்திர செயல்திறன் அறிக்கைகள்"
    ]
  },
  cta: "Care360 ஐ செயல்படுத்தவும்"
};

// Add Visibility section
if (!tamilProducts.visibility) {
  tamilProducts.visibility = {};
}

tamilProducts.visibility = {
  ...tamilProducts.visibility,
  badge: "டிஜிட்டல் இருப்பு",
  title: {
    part1: "Google",
    part2: "தெரிவுநிலை அதிகரிப்பு"
  },
  subtitle: "₹3,000 மதிப்புள்ள டிஜிட்டல் மார்க்கெட்டிங்",
  description: "உங்கள் ஏடிஎம் அதிக வாடிக்கையாளர்களை அடைய உதவுங்கள். Google இல் உங்கள் ஆன்லைன் இருப்பை மேம்படுத்தவும்.",
  price: "இலவசம்",
  features: [
    "Google My Business உருவாக்கம் & சரிபார்ப்பு",
    "தொழில்முறை வணிக சுயவிவர மேம்படுத்தல்",
    "வரைபடங்கள் & தேடல் குறியிடுதல் அதிக தெரிவுநிலைக்கு",
    "உள்ளூர் SEO மேம்படுத்தல்",
    "மாதாந்திர செயல்திறன் நுண்ணறிவுகள்"
  ],
  cta: "தெரிவுநிலையை அதிகரிக்கவும்"
};

// Add CTA section
if (!tamilProducts.cta) {
  tamilProducts.cta = {};
}

tamilProducts.cta = {
  badge: "இன்றே தொடங்கவும்",
  title: "உங்கள் ஏடிஎம் உரிமை பயணத்தைத் தொடங்க தயாரா?",
  subtitle: "ஆயிரக்கணக்கான வெற்றிகரமான உரிமையாளர்களுடன் சேரவும்",
  primaryButton: "உரிமைக்கு விண்ணப்பிக்கவும்",
  secondaryButton: "நிபுணர்களுடன் பேசவும்",
  stats: {
    franchises: {
      value: "5000+",
      label: "செயலில் உள்ள உரிமைகள்"
    },
    transactions: {
      value: "10M+",
      label: "மாதாந்திர பரிவர்த்தனைகள்"
    },
    states: {
      value: "28",
      label: "மாநில கவரேஜ்"
    }
  }
};

// Save the updated Tamil translations
fs.writeFileSync(tamilProductsPath, JSON.stringify(tamilProducts, null, 2), 'utf-8');
console.log('✅ Updated Tamil products.json with all missing translations');

// Now let's also update English to ensure consistency
const englishProductsPath = path.join(__dirname, '..', 'public', 'locales', 'en', 'products.json');
const englishProducts = JSON.parse(fs.readFileSync(englishProductsPath, 'utf-8'));

// Add the same structure to English
englishProducts.hero = {
  badge: "Premium Business Solutions",
  title: {
    main: "ATM Business",
    rotating: ["Solutions", "Advantage", "Products", "Success", "Excellence"]
  },
  titles: {
    solutions: "Solutions",
    advantage: "Advantage",
    products: "Products",
    success: "Success",
    excellence: "Excellence"
  },
  subtitle: "Transform your entrepreneurial dreams into reality with our comprehensive ATM franchise solutions. Experience the perfect blend of technology, support, and profitability.",
  buttons: {
    explore: "Explore Solutions",
    contact: "Contact Us",
    franchise: "Become Franchise"
  },
  stats: {
    partners: {
      value: "4+",
      label: "WLA Partners"
    },
    care360: {
      value: "₹30K",
      label: "Care360 Value"
    },
    visibility: {
      value: "₹3K",
      label: "Visibility Boost"
    }
  }
};

englishProducts.partners = {
  sectionTitle: "Our Trusted WLA Partners",
  badge: "Premium Partnership Network",
  title: {
    part1: "WLA ATMs",
    part2: "Partnership"
  },
  description: "Access India's most trusted White Label ATM operators through our exclusive partnership network. Choose from multiple operators based on your location and investment preferences.",
  vakrangee: {
    name: "Vakrangee",
    tagline: "Market Leader"
  },
  findi: {
    name: "Findi",
    tagline: "Fast Growing"
  },
  indiaone: {
    name: "India One",
    tagline: "Reliable Network"
  },
  eps: {
    name: "EPS Bancs",
    tagline: "Proven Track Record"
  },
  stats: {
    roi: {
      value: "12-18",
      label: "Months ROI"
    },
    income: {
      value: "₹15K+",
      label: "Monthly Income"
    }
  },
  cta: "Start Your Franchise"
};

// Save updated English translations
fs.writeFileSync(englishProductsPath, JSON.stringify(englishProducts, null, 2), 'utf-8');
console.log('✅ Updated English products.json for consistency');

console.log('\n' + '='.repeat(80));
console.log('📝 PRODUCTS PAGE TRANSLATION FIX COMPLETE');
console.log('='.repeat(80));
console.log('\nTranslations have been added to both Tamil and English JSON files.');
console.log('The OurProducts.tsx component already has useTranslation hook.');
console.log('Now it needs to use the t() function for all hardcoded text.');
console.log('\nNext step: Update OurProducts.tsx to use these translation keys');
console.log('='.repeat(80));