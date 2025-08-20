const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🚀 Mass Translation Fix for Top Form Components${colors.reset}\n`);

// Components to fix with their hardcoded text counts
const componentsToFix = [
  { name: 'AgentFormSinglePage.tsx', count: 155 },
  { name: 'InfluencerFormSinglePage.tsx', count: 146 },
  { name: 'BecomeInfluencer.tsx', count: 104 },
  { name: 'CompanyRegistration.tsx', count: 64 },
  { name: 'TrainingModules.tsx', count: 68 },
  { name: 'ReferralProgram.tsx', count: 64 },
  { name: 'ComplianceCenter.tsx', count: 62 },
  { name: 'InfluencerEarnings.tsx', count: 60 },
  { name: 'RegionalExpansion.tsx', count: 56 },
  { name: 'ServicesOffered.tsx', count: 54 }
];

function fixComponent(componentPath, componentName) {
  if (!fs.existsSync(componentPath)) {
    console.log(`${colors.yellow}⚠ ${componentName} not found, skipping...${colors.reset}`);
    return 0;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  let fixCount = 0;

  // Common patterns to replace
  const replacements = [
    // Form field labels
    { pattern: /<label[^>]*>\s*First Name\s*\*?\s*<\/label>/gi, replacement: '<label className="block text-sm font-medium text-foreground mb-2">{t("fields.firstName")} *</label>' },
    { pattern: /<label[^>]*>\s*Last Name\s*\*?\s*<\/label>/gi, replacement: '<label className="block text-sm font-medium text-foreground mb-2">{t("fields.lastName")} *</label>' },
    { pattern: /<label[^>]*>\s*Email Address\s*\*?\s*<\/label>/gi, replacement: '<label className="block text-sm font-medium text-foreground mb-2">{t("fields.email")} *</label>' },
    { pattern: /<label[^>]*>\s*Phone Number\s*\*?\s*<\/label>/gi, replacement: '<label className="block text-sm font-medium text-foreground mb-2">{t("fields.phone")} *</label>' },
    { pattern: /<label[^>]*>\s*WhatsApp Number\s*\*?\s*<\/label>/gi, replacement: '<label className="block text-sm font-medium text-foreground mb-2">{t("fields.whatsapp")} *</label>' },
    
    // Placeholders
    { pattern: /placeholder="Enter your full name"/gi, replacement: 'placeholder={t("placeholders.fullName")}' },
    { pattern: /placeholder="Enter your email"/gi, replacement: 'placeholder={t("placeholders.email")}' },
    { pattern: /placeholder="Enter your phone number"/gi, replacement: 'placeholder={t("placeholders.phone")}' },
    { pattern: /placeholder="Select your state"/gi, replacement: 'placeholder={t("placeholders.state")}' },
    { pattern: /placeholder="Select your city"/gi, replacement: 'placeholder={t("placeholders.city")}' },
    
    // Button texts
    { pattern: />Submit Application</gi, replacement: '>{t("buttons.submit")}' },
    { pattern: />Next</gi, replacement: '>{t("buttons.next")}' },
    { pattern: />Previous</gi, replacement: '>{t("buttons.previous")}' },
    { pattern: />Cancel</gi, replacement: '>{t("buttons.cancel")}' },
    { pattern: />Save Draft</gi, replacement: '>{t("buttons.saveDraft")}' },
    
    // Section headers
    { pattern: />Personal Information</gi, replacement: '>{t("sections.personal")}' },
    { pattern: />Contact Details</gi, replacement: '>{t("sections.contact")}' },
    { pattern: />Address Information</gi, replacement: '>{t("sections.address")}' },
    { pattern: />Business Information</gi, replacement: '>{t("sections.business")}' },
    { pattern: />Financial Information</gi, replacement: '>{t("sections.financial")}' },
    
    // Common texts
    { pattern: />All fields marked with \* are mandatory</gi, replacement: '>{t("form.mandatoryFields")}' },
    { pattern: />Please provide accurate information</gi, replacement: '>{t("form.accurateInfo")}' },
    { pattern: />Application submitted successfully!/gi, replacement: '>{t("form.successMessage")}' },
    { pattern: />Error submitting application/gi, replacement: '>{t("form.errorMessage")}' }
  ];

  // Apply replacements
  replacements.forEach(({ pattern, replacement }) => {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      fixCount += matches.length;
    }
  });

  // Ensure useTranslation is imported
  if (!content.includes("import { useTranslation }")) {
    content = content.replace(
      /import\s+{([^}]+)}\s+from\s+['"]react['"]/,
      "import {$1} from 'react';\nimport { useTranslation } from 'react-i18next'"
    );
  }

  // Ensure t function is initialized
  if (!content.includes("const { t } = useTranslation")) {
    // Find the component function and add t initialization
    content = content.replace(
      /(const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{)/,
      "$1\n  const { t } = useTranslation('forms');"
    );
  }

  fs.writeFileSync(componentPath, content);
  return fixCount;
}

// Process all components
let totalFixes = 0;
const results = [];

componentsToFix.forEach(({ name, count }) => {
  const componentPath = path.join(__dirname, '..', 'src', 'components', name);
  console.log(`${colors.blue}Processing ${name}...${colors.reset}`);
  
  const fixes = fixComponent(componentPath, name);
  totalFixes += fixes;
  
  results.push({
    component: name,
    expectedIssues: count,
    fixesApplied: fixes,
    status: fixes > 0 ? '✅' : '⚠️'
  });
});

// Update forms.json with comprehensive translations
const formsJsonPath = path.join(__dirname, '..', 'public', 'locales', 'en', 'forms.json');
const formsData = JSON.parse(fs.readFileSync(formsJsonPath, 'utf8'));

// Add missing common translations
const additionalTranslations = {
  buttons: {
    submit: "Submit",
    next: "Next",
    previous: "Previous",
    cancel: "Cancel",
    saveDraft: "Save Draft",
    submitApplication: "Submit Application",
    apply: "Apply Now",
    register: "Register",
    continue: "Continue"
  },
  sections: {
    personal: "Personal Information",
    contact: "Contact Details",
    address: "Address Information",
    business: "Business Information",
    financial: "Financial Information",
    documents: "Document Upload",
    verification: "Verification",
    terms: "Terms & Conditions"
  },
  form: {
    mandatoryFields: "All fields marked with * are mandatory",
    accurateInfo: "Please provide accurate information",
    successMessage: "Application submitted successfully!",
    errorMessage: "Error submitting application. Please try again.",
    reviewInfo: "Please review your information before submitting"
  }
};

// Merge with existing data
Object.assign(formsData, additionalTranslations);

// Save updated forms.json
fs.writeFileSync(formsJsonPath, JSON.stringify(formsData, null, 2));

// Print summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}                    TRANSLATION FIX SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.yellow}Component Results:${colors.reset}`);
results.forEach(r => {
  console.log(`  ${r.status} ${r.component}: ${r.fixesApplied} fixes applied (expected ${r.expectedIssues} issues)`);
});

console.log(`\n${colors.green}✅ Total Fixes Applied: ${totalFixes}${colors.reset}`);
console.log(`${colors.green}✅ Updated forms.json with common translations${colors.reset}`);
console.log(`\n${colors.blue}📌 Next Steps:${colors.reset}`);
console.log(`   1. Run npm run dev to test the changes`);
console.log(`   2. Check language switching functionality`);
console.log(`   3. Run comprehensive audit to verify improvements`);
console.log(`\n${colors.cyan}🎉 Mass translation fix complete!${colors.reset}\n`);