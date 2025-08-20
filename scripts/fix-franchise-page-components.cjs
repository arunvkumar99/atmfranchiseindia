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

console.log(`${colors.cyan}🔧 Fixing BecomefranchisePage Component Namespaces...${colors.reset}\n`);

// Components that should use 'franchise' namespace
const franchiseComponents = [
  'BecomefranchiseHero',
  'WhyATM', 
  'WLAOperators',
  'FranchiseModelsComparison',
  'GetStarted'
];

// Components that should use 'common' namespace
const commonComponents = [
  'FAQ'
];

// Fix components to use correct namespace
function fixComponent(componentName, namespace) {
  const filePath = path.join(__dirname, '..', 'src', 'components', `${componentName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  ${colors.yellow}⚠ ${componentName}.tsx not found${colors.reset}`);
    return false;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Replace useTranslation() with useTranslation('namespace')
  if (content.includes('useTranslation()')) {
    content = content.replace(
      /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
      `const { t } = useTranslation('${namespace}')`
    );
    modified = true;
  }
  
  // Also check for other patterns
  if (content.includes('useTranslation();')) {
    content = content.replace(
      /const\s*{\s*t[^}]*}\s*=\s*useTranslation\(\);/g,
      `const { t } = useTranslation('${namespace}');`
    );
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`  ${colors.green}✅ Fixed ${componentName} to use '${namespace}' namespace${colors.reset}`);
    return true;
  } else {
    console.log(`  ${colors.blue}ℹ ${componentName} already configured or different pattern${colors.reset}`);
    return false;
  }
}

console.log(`${colors.blue}Step 1: Fixing franchise-related components...${colors.reset}`);
franchiseComponents.forEach(comp => {
  fixComponent(comp, 'franchise');
});

console.log(`\n${colors.blue}Step 2: Fixing common components...${colors.reset}`);
commonComponents.forEach(comp => {
  fixComponent(comp, 'common');
});

// Services should keep using 'home' as it's already configured
console.log(`\n${colors.blue}Step 3: Verifying Services component...${colors.reset}`);
const servicesPath = path.join(__dirname, '..', 'src', 'components', 'Services.tsx');
if (fs.existsSync(servicesPath)) {
  const content = fs.readFileSync(servicesPath, 'utf8');
  if (content.includes("useTranslation('home')")) {
    console.log(`  ${colors.green}✅ Services correctly uses 'home' namespace${colors.reset}`);
  }
}

// Fix BecomefranchisePage itself
console.log(`\n${colors.blue}Step 4: Fixing BecomefranchisePage...${colors.reset}`);
const pagePath = path.join(__dirname, '..', 'src', 'pages', 'BecomefranchisePage.tsx');
if (fs.existsSync(pagePath)) {
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Change to use 'franchise' namespace
  content = content.replace(
    /const\s*{\s*t\s*}\s*=\s*useTranslation\(\)/g,
    "const { t } = useTranslation('franchise')"
  );
  
  fs.writeFileSync(pagePath, content);
  console.log(`  ${colors.green}✅ Fixed BecomefranchisePage to use 'franchise' namespace${colors.reset}`);
}

// Create/verify franchise.json files exist
console.log(`\n${colors.blue}Step 5: Ensuring franchise.json translation files exist...${colors.reset}`);
const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = fs.readdirSync(localesDir).filter(f => 
  fs.statSync(path.join(localesDir, f)).isDirectory()
);

languages.forEach(lang => {
  const franchiseFile = path.join(localesDir, lang, 'franchise.json');
  
  if (!fs.existsSync(franchiseFile)) {
    // Create basic franchise.json if it doesn't exist
    const basicContent = {
      "enquiryForm": {
        "title": lang === 'en' ? "Start Your ATM Franchise Journey" : "Start Your ATM Franchise Journey",
        "subtitle": lang === 'en' ? "Fill out the form below and our experts will contact you within 24 hours" : "Fill out the form below and our experts will contact you within 24 hours"
      },
      "hero": {
        "title": lang === 'en' ? "Become an ATM Franchise Partner" : "Become an ATM Franchise Partner",
        "subtitle": lang === 'en' ? "Join India's fastest growing ATM network" : "Join India's fastest growing ATM network"
      }
    };
    
    fs.writeFileSync(franchiseFile, JSON.stringify(basicContent, null, 2));
    console.log(`  ${colors.green}✅ Created ${lang}/franchise.json${colors.reset}`);
  } else {
    console.log(`  ${colors.blue}✓ ${lang}/franchise.json exists${colors.reset}`);
  }
});

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                         FIX COMPLETE${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.green}✅ Components updated to use consistent namespaces${colors.reset}`);
console.log(`${colors.green}✅ Translation files verified/created${colors.reset}`);

console.log(`\n${colors.yellow}📝 Next Steps:${colors.reset}`);
console.log(`1. Clear browser cache and reload`);
console.log(`2. Test the BecomefranchisePage`);
console.log(`3. Verify no console errors`);

console.log(`\n${colors.green}Fix complete!${colors.reset}\n`);