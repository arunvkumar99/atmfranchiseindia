const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m'
};

console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}     FIXING MISSING TRANSLATION KEYS${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

// Missing keys identified by team analysis
const missingHomeKeys = {
  "features": {
    "roi": {
      "title": "upto 50%",
      "subtitle": "Return On Investment",
      "description": "All Payout Received by RBI Licensed WLA ATM Partners"
    },
    "penetration": {
      "title": "15 Per Lac",
      "subtitle": "Only 15 ATMs per 1 Lac People",
      "description": "ATM Penetration in India is very Low"
    },
    "cash": {
      "title": "75% Cash",
      "subtitle": "Cash Circulation",
      "description": "Indian Economy is still Largely Cash based"
    },
    "potential": {
      "title": "90% Potential",
      "subtitle": "90% of Banks Offsite ATMs are closing down",
      "description": "Banks Offsite ATM Closure creates a Large market for ATMs"
    }
  },
  "stats": {
    "atmsAcrossIndia": "ATMs across India",
    "andCounting": "and counting..."
  }
};

// Hindi translations for missing keys
const missingHomeKeysHindi = {
  "features": {
    "roi": {
      "title": "50% तक",
      "subtitle": "निवेश पर रिटर्न",
      "description": "RBI लाइसेंस प्राप्त WLA ATM पार्टनरों द्वारा प्राप्त सभी भुगतान"
    },
    "penetration": {
      "title": "15 प्रति लाख",
      "subtitle": "केवल 15 ATM प्रति 1 लाख लोग",
      "description": "भारत में ATM पैठ बहुत कम है"
    },
    "cash": {
      "title": "75% नकद",
      "subtitle": "नकद प्रसार",
      "description": "भारतीय अर्थव्यवस्था अभी भी काफी हद तक नकद आधारित है"
    },
    "potential": {
      "title": "90% संभावना",
      "subtitle": "बैंकों के 90% ऑफसाइट ATM बंद हो रहे हैं",
      "description": "बैंकों के ऑफसाइट ATM बंद होने से ATM के लिए बड़ा बाजार बनता है"
    }
  },
  "stats": {
    "atmsAcrossIndia": "पूरे भारत में ATM",
    "andCounting": "और बढ़ रहे हैं..."
  }
};

// Function to merge keys into existing JSON
function mergeKeys(existingContent, newKeys) {
  const existing = typeof existingContent === 'string' ? JSON.parse(existingContent) : existingContent;
  
  // Deep merge
  function deepMerge(target, source) {
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        target[key] = target[key] || {};
        deepMerge(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }
  
  return deepMerge(existing, newKeys);
}

// Fix English home.json
console.log(`${colors.blue}Fixing English home.json...${colors.reset}`);
const enHomePath = path.join(__dirname, '..', 'public', 'locales', 'en', 'home.json');
const enHomeContent = fs.readFileSync(enHomePath, 'utf8');
const enHomeJson = JSON.parse(enHomeContent);

const updatedEnHome = mergeKeys(enHomeJson, missingHomeKeys);
fs.writeFileSync(enHomePath, JSON.stringify(updatedEnHome, null, 2));
console.log(`${colors.green}✅ Updated English home.json with missing keys${colors.reset}`);

// Fix Hindi home.json
console.log(`\n${colors.blue}Fixing Hindi home.json...${colors.reset}`);
const hiHomePath = path.join(__dirname, '..', 'public', 'locales', 'hi', 'home.json');
const hiHomeContent = fs.readFileSync(hiHomePath, 'utf8');
const hiHomeJson = JSON.parse(hiHomeContent);

const updatedHiHome = mergeKeys(hiHomeJson, missingHomeKeysHindi);
fs.writeFileSync(hiHomePath, JSON.stringify(updatedHiHome, null, 2));
console.log(`${colors.green}✅ Updated Hindi home.json with missing keys${colors.reset}`);

// Fix other language files with English fallback for now
const languages = ['bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

console.log(`\n${colors.blue}Updating other language files...${colors.reset}`);
languages.forEach(lang => {
  const langHomePath = path.join(__dirname, '..', 'public', 'locales', lang, 'home.json');
  if (fs.existsSync(langHomePath)) {
    const langHomeContent = fs.readFileSync(langHomePath, 'utf8');
    const langHomeJson = JSON.parse(langHomeContent);
    
    // Use English as fallback for now
    const updatedLangHome = mergeKeys(langHomeJson, missingHomeKeys);
    fs.writeFileSync(langHomePath, JSON.stringify(updatedLangHome, null, 2));
    console.log(`${colors.green}✅ Updated ${lang}/home.json${colors.reset}`);
  }
});

console.log(`\n${colors.cyan}════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                 KEYS ADDED SUMMARY${colors.reset}`);
console.log(`${colors.cyan}════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Added 'features' keys (roi, penetration, cash, potential)${colors.reset}`);
console.log(`${colors.green}✅ Added 'stats' keys (atmsAcrossIndia, andCounting)${colors.reset}`);
console.log(`${colors.green}✅ Updated 13 language files${colors.reset}`);

console.log(`\n${colors.yellow}Note: Non-Hindi translations use English fallback.${colors.reset}`);
console.log(`${colors.yellow}Professional translation services needed for other languages.${colors.reset}`);

console.log(`\n${colors.blue}Translation keys fix complete!${colors.reset}\n`);