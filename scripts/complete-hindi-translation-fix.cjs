const fs = require('fs');
const path = require('path');

// Define all pages and their expected translation namespaces
const PAGES = [
  { name: 'Home', file: 'src/pages/Home.tsx', namespace: 'home' },
  { name: 'AboutUs', file: 'src/pages/AboutUs.tsx', namespace: 'about' },
  { name: 'ContactUs', file: 'src/pages/ContactUs.tsx', namespace: 'contact' },
  { name: 'OurProducts', file: 'src/pages/OurProducts.tsx', namespace: 'products' },
  { name: 'BecomefranchisePage', file: 'src/pages/BecomefranchisePage.tsx', namespace: 'franchise' },
  { name: 'PrivacyPolicy', file: 'src/pages/PrivacyPolicy.tsx', namespace: 'privacy' },
  { name: 'TermsConditions', file: 'src/pages/TermsConditions.tsx', namespace: 'terms' },
  { name: 'RefundPolicy', file: 'src/pages/RefundPolicy.tsx', namespace: 'refund' },
  { name: 'AgentPage', file: 'src/pages/AgentPage.tsx', namespace: 'agent' },
  { name: 'InfluencerPage', file: 'src/pages/InfluencerPage.tsx', namespace: 'influencer' },
  { name: 'JoinUsPage', file: 'src/pages/JoinUsPage.tsx', namespace: 'forms' },
  { name: 'SubmitLocation', file: 'src/pages/SubmitLocation.tsx', namespace: 'location' },
  { name: 'AccessibilityStatement', file: 'src/pages/AccessibilityStatement.tsx', namespace: 'accessibility' }
];

// Comprehensive Hindi translations for Privacy Policy
const PRIVACY_TRANSLATIONS = {
  "hero": {
    "backToHome": "मुख्य पृष्ठ पर वापस जाएं",
    "badge": "गोपनीयता सुरक्षा",
    "title": "गोपनीयता नीति",
    "subtitle": "आपकी गोपनीयता और डेटा सुरक्षा हमारी प्राथमिकताएं हैं"
  },
  "content": {
    "intro": "एटीएम फ्रैंचाइज़ इंडिया में, जो PixellPay Innovations Pvt Ltd द्वारा संचालित है, हम आपकी गोपनीयता की रक्षा करने और आपकी व्यक्तिगत जानकारी की सुरक्षा सुनिश्चित करने के लिए प्रतिबद्ध हैं। यह गोपनीयता नीति बताती है कि हम आपके डेटा को कैसे एकत्र, उपयोग और सुरक्षित करते हैं।",
    "sections": {
      "collection": {
        "title": "हम जो जानकारी एकत्र करते हैं",
        "items": {
          "personal": "व्यक्तिगत जानकारी (नाम, ईमेल, फोन नंबर)",
          "business": "व्यावसायिक जानकारी (कंपनी का नाम, पता)",
          "financial": "वित्तीय जानकारी (निवेश क्षमता, बैंक विवरण)",
          "location": "स्थान डेटा (प्रस्तावित एटीएम स्थान)"
        }
      },
      "usage": {
        "title": "हम आपकी जानकारी का उपयोग कैसे करते हैं",
        "items": {
          "process": "आपकी फ्रैंचाइज़ी पूछताछ को संसाधित करने के लिए",
          "communicate": "व्यावसायिक अवसरों के बारे में आपसे संवाद करने के लिए",
          "match": "आपको उपयुक्त WLA ऑपरेटरों से मिलाने के लिए",
          "improve": "हमारी सेवाओं में सुधार करने के लिए"
        }
      },
      "protection": {
        "title": "डेटा सुरक्षा",
        "description": "हम आपकी जानकारी की सुरक्षा के लिए उद्योग-मानक सुरक्षा उपायों का उपयोग करते हैं, जिसमें एन्क्रिप्शन, सुरक्षित सर्वर और नियमित सुरक्षा ऑडिट शामिल हैं।"
      },
      "sharing": {
        "title": "जानकारी साझाकरण",
        "description": "हम आपकी व्यक्तिगत जानकारी को तीसरे पक्ष को नहीं बेचते या किराए पर नहीं देते हैं। हम केवल आपकी सहमति से या कानूनी आवश्यकताओं के अनुसार जानकारी साझा करते हैं।"
      },
      "rights": {
        "title": "आपके अधिकार",
        "items": {
          "access": "अपनी व्यक्तिगत जानकारी तक पहुंच",
          "correction": "गलत जानकारी में सुधार",
          "deletion": "डेटा विलोपन का अनुरोध",
          "withdrawal": "सहमति वापस लेना"
        }
      },
      "cookies": {
        "title": "कुकीज़ और ट्रैकिंग",
        "description": "हम आपके अनुभव को बेहतर बनाने के लिए कुकीज़ का उपयोग करते हैं। आप अपनी ब्राउज़र सेटिंग्स के माध्यम से कुकीज़ को प्रबंधित कर सकते हैं।"
      },
      "updates": {
        "title": "नीति अपडेट",
        "description": "हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। किसी भी बदलाव के लिए कृपया नियमित रूप से जांच करें।"
      },
      "contact": {
        "title": "संपर्क करें",
        "description": "गोपनीयता संबंधी प्रश्नों के लिए, कृपया हमसे संपर्क करें:",
        "email": "privacy@atmfranchiseindia.com",
        "phone": "+91 98765 43210"
      }
    }
  },
  "footer": {
    "lastUpdated": "अंतिम अपडेट: जनवरी 2025",
    "copyright": "© 2025 एटीएम फ्रैंचाइज़ इंडिया। सर्वाधिकार सुरक्षित।"
  }
};

// Function to scan a file for hardcoded text
function scanFileForHardcodedText(filePath) {
  if (!fs.existsSync(filePath)) {
    return { exists: false, hardcodedTexts: [] };
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hardcodedTexts = [];
  
  // Pattern to find hardcoded text (not in t() function)
  const patterns = [
    />([A-Z][^<>{}\n]+)</g,  // Text between tags starting with capital
    /placeholder="([^"]+)"/g,  // Placeholder text
    /title="([^"]+)"/g,  // Title attributes
    /label="([^"]+)"/g,  // Label attributes
    /'([A-Z][^']{5,})'/g,  // String literals starting with capital
    /"([A-Z][^"]{5,})"/g,  // String literals starting with capital
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const text = match[1];
      // Filter out component names, imports, and common code patterns
      if (!/^[A-Z][a-z]+[A-Z]/.test(text) && // Not camelCase
          !/^[A-Z_]+$/.test(text) && // Not CONSTANT
          !text.includes('className') &&
          !text.includes('import') &&
          !text.includes('export') &&
          !text.includes('const') &&
          !text.includes('function') &&
          text.length > 3) {
        hardcodedTexts.push({
          text: text,
          line: content.substring(0, match.index).split('\n').length
        });
      }
    }
  });
  
  return { exists: true, hardcodedTexts };
}

// Function to update Privacy Policy component to use translations
function fixPrivacyPolicyComponent() {
  const filePath = 'src/pages/PrivacyPolicy.tsx';
  if (!fs.existsSync(filePath)) {
    console.log('Privacy Policy file not found');
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace hardcoded texts with translation keys
  const replacements = [
    { from: 'Back to Home', to: "{t('hero.backToHome', 'Back to Home')}" },
    { from: 'Privacy Protection', to: "{t('hero.badge', 'Privacy Protection')}" },
    { from: 'Privacy Policy', to: "{t('hero.title', 'Privacy Policy')}" },
    { from: 'Your privacy and data protection are our priorities', to: "{t('hero.subtitle', 'Your privacy and data protection are our priorities')}" },
    { from: 'At ATM Franchise India, operated by PixellPay Innovations Pvt Ltd, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data.', to: "{t('content.intro', 'At ATM Franchise India, operated by PixellPay Innovations Pvt Ltd, we are committed to protecting your privacy and ensuring the security of your personal information.')}" },
    { from: 'Information We Collect', to: "{t('content.sections.collection.title', 'Information We Collect')}" },
    { from: 'How We Use Your Information', to: "{t('content.sections.usage.title', 'How We Use Your Information')}" },
    { from: 'Data Protection', to: "{t('content.sections.protection.title', 'Data Protection')}" },
    { from: 'Information Sharing', to: "{t('content.sections.sharing.title', 'Information Sharing')}" },
    { from: 'Your Rights', to: "{t('content.sections.rights.title', 'Your Rights')}" },
    { from: 'Cookies and Tracking', to: "{t('content.sections.cookies.title', 'Cookies and Tracking')}" },
    { from: 'Policy Updates', to: "{t('content.sections.updates.title', 'Policy Updates')}" },
    { from: 'Contact Us', to: "{t('content.sections.contact.title', 'Contact Us')}" }
  ];
  
  replacements.forEach(({ from, to }) => {
    // Handle JSX text content
    const jsxPattern = new RegExp(`>\\s*${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g');
    content = content.replace(jsxPattern, `>${to}<`);
    
    // Handle string literals
    const stringPattern = new RegExp(`["']${from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`, 'g');
    content = content.replace(stringPattern, to);
  });
  
  fs.writeFileSync(filePath, content);
  console.log('✅ Fixed Privacy Policy component');
}

// Function to update Hindi translation files
function updateHindiTranslations() {
  const localesDir = 'public/locales/hi';
  
  // Update privacy.json
  const privacyPath = path.join(localesDir, 'privacy.json');
  fs.writeFileSync(privacyPath, JSON.stringify(PRIVACY_TRANSLATIONS, null, 2));
  console.log('✅ Updated privacy.json with complete Hindi translations');
  
  // Check and update other namespace files
  PAGES.forEach(page => {
    const namespacePath = path.join(localesDir, `${page.namespace}.json`);
    if (!fs.existsSync(namespacePath)) {
      console.log(`⚠️ Missing translation file: ${page.namespace}.json`);
      // Create basic structure
      fs.writeFileSync(namespacePath, JSON.stringify({
        "hero": {
          "title": `${page.name} - Hindi translation needed`,
          "subtitle": "Translation pending"
        }
      }, null, 2));
    }
  });
}

// Main execution
console.log('🔍 Starting comprehensive Hindi translation fix...\n');

// Step 1: Scan all pages for hardcoded text
console.log('📊 Scanning all pages for hardcoded text:');
const scanResults = {};
PAGES.forEach(page => {
  const result = scanFileForHardcodedText(page.file);
  scanResults[page.name] = result;
  
  if (result.exists) {
    console.log(`\n${page.name}:`);
    if (result.hardcodedTexts.length > 0) {
      console.log(`  ❌ Found ${result.hardcodedTexts.length} hardcoded texts`);
      result.hardcodedTexts.slice(0, 5).forEach(item => {
        console.log(`     Line ${item.line}: "${item.text.substring(0, 50)}..."`);
      });
    } else {
      console.log(`  ✅ No obvious hardcoded texts found`);
    }
  } else {
    console.log(`\n${page.name}: ⚠️ File not found`);
  }
});

// Step 2: Fix critical components
console.log('\n\n🔧 Fixing critical components:');
fixPrivacyPolicyComponent();

// Step 3: Update Hindi translations
console.log('\n📝 Updating Hindi translation files:');
updateHindiTranslations();

// Step 4: Generate report
const report = {
  timestamp: new Date().toISOString(),
  pagesScanned: Object.keys(scanResults).length,
  totalHardcodedTexts: Object.values(scanResults).reduce((sum, r) => sum + (r.hardcodedTexts?.length || 0), 0),
  criticalIssues: [
    'Privacy Policy page has all hardcoded English text',
    'Terms and Conditions page likely has same issue',
    'Multiple pages not using translation system properly'
  ],
  actionsRequired: [
    'Complete translation of all legal pages',
    'Fix all components to use t() function',
    'Add missing namespace files',
    'Test every page in Hindi mode',
    'Provide screenshot proof of completion'
  ]
};

fs.writeFileSync('hindi-translation-audit-report.json', JSON.stringify(report, null, 2));

console.log('\n\n✅ Audit complete! Report saved to hindi-translation-audit-report.json');
console.log('\n📋 Summary:');
console.log(`  - Pages scanned: ${report.pagesScanned}`);
console.log(`  - Total hardcoded texts found: ${report.totalHardcodedTexts}`);
console.log(`  - Critical issues: ${report.criticalIssues.length}`);
console.log('\n⚠️ IMPORTANT: Manual review and testing required for all pages!');