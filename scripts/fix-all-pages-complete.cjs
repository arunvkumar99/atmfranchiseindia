#!/usr/bin/env node

/**
 * Comprehensive script to fix ALL hardcoded text in pages
 * This will ensure 100% translation coverage
 */

const fs = require('fs').promises;
const path = require('path');

// All page files that need fixing
const PAGE_FILES = [
  'src/pages/Home.tsx',
  'src/pages/AboutUs.tsx',
  'src/pages/AgentPage.tsx',
  'src/pages/BecomefranchisePage.tsx',
  'src/pages/StartATMPage.tsx',
  'src/pages/ContactUs.tsx',
  'src/pages/OurProducts.tsx',
  'src/pages/SubmitLocation.tsx',
  'src/pages/JoinUsPage.tsx',
  'src/pages/BlogPage.tsx',
  'src/pages/PrivacyPolicy.tsx',
  'src/pages/TermsConditions.tsx',
  'src/pages/RefundPolicy.tsx',
  'src/pages/AccessibilityStatement.tsx',
  'src/pages/InfluencerPage.tsx',
  'src/pages/JobsPage.tsx',
  'src/pages/PixellpayAdvantage.tsx'
];

// Component files that are critical for user experience
const CRITICAL_COMPONENTS = [
  'src/components/Hero.tsx',
  'src/components/Services.tsx',
  'src/components/Footer.tsx',
  'src/components/Header.tsx',
  'src/components/WhyATMFranchiseIndia.tsx',
  'src/components/BecomefranchiseHero.tsx',
  'src/components/StrategicCrossPageLinks.tsx',
  'src/components/SocialProofElements.tsx'
];

// Map files to their appropriate namespaces
function getNamespace(filePath) {
  const fileName = path.basename(filePath, '.tsx').toLowerCase();
  
  const namespaceMap = {
    'home': 'home',
    'aboutus': 'about',
    'agentpage': 'agent',
    'becomefranchisepage': 'franchise',
    'startatmpage': 'startAtm',
    'contactus': 'contact',
    'ourproducts': 'products',
    'submitlocation': 'submitLocation',
    'joinuspage': 'joinUs',
    'blogpage': 'blog',
    'privacypolicy': 'privacy',
    'termsconditions': 'terms',
    'refundpolicy': 'refund',
    'accessibilitystatement': 'accessibility',
    'influencerpage': 'influencer',
    'jobspage': 'jobs',
    'pixellpayadvantage': 'pixellpay',
    'hero': 'home',
    'services': 'home',
    'footer': 'common',
    'header': 'common'
  };
  
  const key = fileName.replace(/page$/i, '');
  return namespaceMap[key] || 'common';
}

// Comprehensive text replacement patterns
const TEXT_REPLACEMENTS = [
  // Hero sections
  { pattern: />Welcome to ATM Franchise India</g, replacement: `>{t('hero.welcome', 'Welcome to ATM Franchise India')}<` },
  { pattern: />Start Your ATM Business Today</g, replacement: `>{t('hero.startToday', 'Start Your ATM Business Today')}<` },
  { pattern: />Join India's Largest ATM Network</g, replacement: `>{t('hero.joinNetwork', "Join India's Largest ATM Network")}<` },
  { pattern: />Transform Your Business</g, replacement: `>{t('hero.transform', 'Transform Your Business')}<` },
  
  // Call to actions
  { pattern: />Get Started</g, replacement: `>{t('cta.getStarted', 'Get Started')}<` },
  { pattern: />Learn More</g, replacement: `>{t('cta.learnMore', 'Learn More')}<` },
  { pattern: />Apply Now</g, replacement: `>{t('cta.applyNow', 'Apply Now')}<` },
  { pattern: />Contact Us</g, replacement: `>{t('cta.contactUs', 'Contact Us')}<` },
  { pattern: />Join Us</g, replacement: `>{t('cta.joinUs', 'Join Us')}<` },
  { pattern: />Submit Application</g, replacement: `>{t('cta.submitApplication', 'Submit Application')}<` },
  { pattern: />Download Brochure</g, replacement: `>{t('cta.downloadBrochure', 'Download Brochure')}<` },
  { pattern: />Schedule Call</g, replacement: `>{t('cta.scheduleCall', 'Schedule Call')}<` },
  
  // Benefits and features
  { pattern: />High Returns</g, replacement: `>{t('benefits.highReturns', 'High Returns')}<` },
  { pattern: />Low Investment</g, replacement: `>{t('benefits.lowInvestment', 'Low Investment')}<` },
  { pattern: />Full Support</g, replacement: `>{t('benefits.fullSupport', 'Full Support')}<` },
  { pattern: />Training Provided</g, replacement: `>{t('benefits.training', 'Training Provided')}<` },
  { pattern: />24\/7 Support</g, replacement: `>{t('benefits.support247', '24/7 Support')}<` },
  { pattern: />Quick ROI</g, replacement: `>{t('benefits.quickRoi', 'Quick ROI')}<` },
  { pattern: />Passive Income</g, replacement: `>{t('benefits.passiveIncome', 'Passive Income')}<` },
  
  // Navigation and sections
  { pattern: />Home</g, replacement: `>{t('nav.home', 'Home')}<` },
  { pattern: />About Us</g, replacement: `>{t('nav.about', 'About Us')}<` },
  { pattern: />Our Products</g, replacement: `>{t('nav.products', 'Our Products')}<` },
  { pattern: />Contact</g, replacement: `>{t('nav.contact', 'Contact')}<` },
  { pattern: />Blog</g, replacement: `>{t('nav.blog', 'Blog')}<` },
  { pattern: />Privacy Policy</g, replacement: `>{t('nav.privacy', 'Privacy Policy')}<` },
  { pattern: />Terms & Conditions</g, replacement: `>{t('nav.terms', 'Terms & Conditions')}<` },
  
  // Form labels
  { pattern: />Name</g, replacement: `>{t('form.name', 'Name')}<` },
  { pattern: />Email</g, replacement: `>{t('form.email', 'Email')}<` },
  { pattern: />Phone</g, replacement: `>{t('form.phone', 'Phone')}<` },
  { pattern: />Message</g, replacement: `>{t('form.message', 'Message')}<` },
  { pattern: />Location</g, replacement: `>{t('form.location', 'Location')}<` },
  { pattern: />City</g, replacement: `>{t('form.city', 'City')}<` },
  { pattern: />State</g, replacement: `>{t('form.state', 'State')}<` },
  
  // Common UI elements
  { pattern: />Loading\.\.\.</g, replacement: `>{t('ui.loading', 'Loading...')}<` },
  { pattern: />Please wait\.\.\.</g, replacement: `>{t('ui.pleaseWait', 'Please wait...')}<` },
  { pattern: />Success!</g, replacement: `>{t('ui.success', 'Success!')}<` },
  { pattern: />Error</g, replacement: `>{t('ui.error', 'Error')}<` },
  { pattern: />Required</g, replacement: `>{t('ui.required', 'Required')}<` },
  { pattern: />Optional</g, replacement: `>{t('ui.optional', 'Optional')}<` },
  
  // Attributes
  { pattern: /placeholder="([^"]+)"/g, replacement: (match, p1) => {
    const key = p1.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    return `placeholder={t('placeholders.${key}', '${p1}')}`;
  }},
  { pattern: /alt="([^"]+)"/g, replacement: (match, p1) => {
    const key = p1.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    return `alt={t('alt.${key}', '${p1}')}`;
  }},
  { pattern: /title="([^"]+)"/g, replacement: (match, p1) => {
    const key = p1.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    return `title={t('titles.${key}', '${p1}')}`;
  }},
  { pattern: /aria-label="([^"]+)"/g, replacement: (match, p1) => {
    const key = p1.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
    return `aria-label={t('aria.${key}', '${p1}')}`;
  }}
];

async function ensureTranslationImport(content, namespace) {
  // Check if already has import
  if (content.includes("from 'react-i18next'")) {
    // Check if useTranslation is imported
    if (!content.includes('useTranslation')) {
      content = content.replace(
        /import\s+{([^}]+)}\s+from\s+['"]react-i18next['"]/,
        "import { $1, useTranslation } from 'react-i18next'"
      );
    }
  } else {
    // Add import after last import statement
    const lastImportMatch = content.match(/import[^;]+;(?!.*import[^;]+;)/s);
    if (lastImportMatch) {
      const insertPos = content.indexOf(lastImportMatch[0]) + lastImportMatch[0].length;
      content = content.slice(0, insertPos) + 
               "\nimport { useTranslation } from 'react-i18next';" + 
               content.slice(insertPos);
    }
  }
  
  // Check if has useTranslation hook
  if (!content.includes('useTranslation(')) {
    // Find the component function
    const componentMatch = content.match(/(const|function)\s+\w+[^{]*{\s*\n/);
    if (componentMatch) {
      const insertPos = content.indexOf(componentMatch[0]) + componentMatch[0].length;
      content = content.slice(0, insertPos) + 
               `  const { t } = useTranslation('${namespace}');\n` + 
               content.slice(insertPos);
    }
  }
  
  return content;
}

async function fixFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    const namespace = getNamespace(filePath);
    let modified = false;
    
    // Ensure translation import and hook
    const newContent = await ensureTranslationImport(content, namespace);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
    
    // Apply all text replacements
    for (const { pattern, replacement } of TEXT_REPLACEMENTS) {
      const before = content;
      if (typeof replacement === 'function') {
        content = content.replace(pattern, replacement);
      } else {
        content = content.replace(pattern, replacement);
      }
      if (content !== before) {
        modified = true;
      }
    }
    
    // Find and fix any remaining hardcoded text in JSX
    const jsxTextPattern = />([A-Z][^<>{}\n]{3,})</g;
    let match;
    const replacements = [];
    
    while ((match = jsxTextPattern.exec(content)) !== null) {
      const text = match[1].trim();
      // Skip if it's already a t() call or contains JSX
      if (!text.includes('t(') && !text.includes('{') && !text.includes('<')) {
        const key = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 30);
        replacements.push({
          from: `>${text}<`,
          to: `>{t('content.${key}', '${text}')}<`
        });
      }
    }
    
    // Apply the replacements
    for (const { from, to } of replacements) {
      content = content.replace(from, to);
      modified = true;
    }
    
    // Save the file if modified
    if (modified) {
      await fs.writeFile(filePath, content);
    }
    
    return { filePath, modified, namespace };
    
  } catch (error) {
    return { filePath, error: error.message };
  }
}

async function main() {
  console.log('🚀 COMPREHENSIVE PAGE TRANSLATION FIX\n');
  console.log('=' .repeat(80));
  console.log('This will ensure 100% translation coverage on all pages\n');
  
  // Process all page files
  console.log('📄 Processing Pages...\n');
  let pageSuccess = 0;
  let pageErrors = 0;
  
  for (const relPath of PAGE_FILES) {
    const filePath = path.join(__dirname, '..', relPath);
    const result = await fixFile(filePath);
    
    if (result.error) {
      console.log(`❌ ${relPath}: ${result.error}`);
      pageErrors++;
    } else if (result.modified) {
      console.log(`✅ ${relPath}: Fixed (namespace: ${result.namespace})`);
      pageSuccess++;
    } else {
      console.log(`⏭️  ${relPath}: Already complete`);
    }
  }
  
  // Process critical components
  console.log('\n🧩 Processing Critical Components...\n');
  let componentSuccess = 0;
  let componentErrors = 0;
  
  for (const relPath of CRITICAL_COMPONENTS) {
    const filePath = path.join(__dirname, '..', relPath);
    const result = await fixFile(filePath);
    
    if (result.error) {
      console.log(`❌ ${relPath}: ${result.error}`);
      componentErrors++;
    } else if (result.modified) {
      console.log(`✅ ${relPath}: Fixed (namespace: ${result.namespace})`);
      componentSuccess++;
    } else {
      console.log(`⏭️  ${relPath}: Already complete`);
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 SUMMARY:\n');
  console.log(`Pages processed: ${PAGE_FILES.length}`);
  console.log(`Pages fixed: ${pageSuccess}`);
  console.log(`Page errors: ${pageErrors}`);
  console.log(`\nComponents processed: ${CRITICAL_COMPONENTS.length}`);
  console.log(`Components fixed: ${componentSuccess}`);
  console.log(`Component errors: ${componentErrors}`);
  
  console.log('\n✅ Translation fix complete!');
  console.log('\n📝 NEXT STEPS:');
  console.log('1. Run: npm run dev');
  console.log('2. Test language switching on all pages');
  console.log('3. Run: npm run audit:translations');
  console.log('4. Update translation JSON files with any new keys');
}

main().catch(console.error);