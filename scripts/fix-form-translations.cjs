#!/usr/bin/env node

/**
 * Fix translation issues in form components
 * These components have the most hardcoded text
 */

const fs = require('fs').promises;
const path = require('path');

const FORM_COMPONENTS = [
  'src/components/JoinUs.tsx',
  'src/components/EnquiryFormSinglePage.tsx',
  'src/components/InfluencerFormSinglePage.tsx',
  'src/components/AgentFormEnhanced.tsx',
  'src/components/AgentFormSinglePage.tsx',
  'src/components/AgentFormProgressive.tsx',
  'src/components/SubmitLocationSinglePage.tsx',
  'src/components/JobApplicationSinglePage.tsx',
  'src/components/DirectSheetsForm.tsx',
  'src/components/GetStarted.tsx'
];

async function fixFormComponent(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    let modified = false;
    
    // Add translation import if missing
    if (!content.includes("from 'react-i18next'")) {
      // Find the last import
      const importRegex = /import[^;]+from[^;]+;/g;
      const imports = content.match(importRegex);
      if (imports) {
        const lastImport = imports[imports.length - 1];
        const insertPos = content.indexOf(lastImport) + lastImport.length;
        content = content.slice(0, insertPos) + 
                 "\nimport { useTranslation } from 'react-i18next';" + 
                 content.slice(insertPos);
        modified = true;
      }
    }
    
    // Add useTranslation hook
    if (!content.includes('useTranslation')) {
      // Find the component function
      const componentRegex = /(?:const|function)\s+\w+[^{]*{/;
      const match = content.match(componentRegex);
      if (match) {
        const insertPos = content.indexOf(match[0]) + match[0].length;
        content = content.slice(0, insertPos) + 
                 "\n  const { t } = useTranslation('forms');" + 
                 content.slice(insertPos);
        modified = true;
      }
    }
    
    // Common form text replacements
    const replacements = [
      // Labels
      { from: />Full Name</g, to: `>{t('labels.fullName', 'Full Name')}<` },
      { from: />Your Name</g, to: `>{t('labels.yourName', 'Your Name')}<` },
      { from: />Email Address</g, to: `>{t('labels.email', 'Email Address')}<` },
      { from: />Phone Number</g, to: `>{t('labels.phone', 'Phone Number')}<` },
      { from: />Mobile Number</g, to: `>{t('labels.mobile', 'Mobile Number')}<` },
      { from: />Message</g, to: `>{t('labels.message', 'Message')}<` },
      { from: />Location</g, to: `>{t('labels.location', 'Location')}<` },
      { from: />City</g, to: `>{t('labels.city', 'City')}<` },
      { from: />State</g, to: `>{t('labels.state', 'State')}<` },
      { from: />PIN Code</g, to: `>{t('labels.pinCode', 'PIN Code')}<` },
      { from: />PAN Card</g, to: `>{t('labels.panCard', 'PAN Card')}<` },
      { from: />Aadhaar Number</g, to: `>{t('labels.aadhaar', 'Aadhaar Number')}<` },
      
      // Placeholders
      { from: /placeholder="Enter your full name"/g, to: `placeholder={t('placeholders.fullName', 'Enter your full name')}` },
      { from: /placeholder="Enter your email"/g, to: `placeholder={t('placeholders.email', 'Enter your email')}` },
      { from: /placeholder="Enter your phone number"/g, to: `placeholder={t('placeholders.phone', 'Enter your phone number')}` },
      { from: /placeholder="Enter your message"/g, to: `placeholder={t('placeholders.message', 'Enter your message')}` },
      { from: /placeholder="Select your state"/g, to: `placeholder={t('placeholders.state', 'Select your state')}` },
      { from: /placeholder="Select your city"/g, to: `placeholder={t('placeholders.city', 'Select your city')}` },
      
      // Investment ranges
      { from: />Below ₹2 Lakhs</g, to: `>{t('investment.below2L', 'Below ₹2 Lakhs')}<` },
      { from: />₹2-5 Lakhs</g, to: `>{t('investment.2to5L', '₹2-5 Lakhs')}<` },
      { from: />₹5-10 Lakhs</g, to: `>{t('investment.5to10L', '₹5-10 Lakhs')}<` },
      { from: />Above ₹10 Lakhs</g, to: `>{t('investment.above10L', 'Above ₹10 Lakhs')}<` },
      { from: />₹1 - 3 Lakhs</g, to: `>{t('investment.1to3L', '₹1 - 3 Lakhs')}<` },
      { from: />₹3 - 5 Lakhs</g, to: `>{t('investment.3to5L', '₹3 - 5 Lakhs')}<` },
      
      // Buttons
      { from: />Submit Application</g, to: `>{t('buttons.submitApplication', 'Submit Application')}<` },
      { from: />Submit Form</g, to: `>{t('buttons.submitForm', 'Submit Form')}<` },
      { from: />Submit</g, to: `>{t('buttons.submit', 'Submit')}<` },
      { from: />Send Message</g, to: `>{t('buttons.sendMessage', 'Send Message')}<` },
      { from: />Apply Now</g, to: `>{t('buttons.applyNow', 'Apply Now')}<` },
      { from: />Next</g, to: `>{t('buttons.next', 'Next')}<` },
      { from: />Previous</g, to: `>{t('buttons.previous', 'Previous')}<` },
      { from: />Back</g, to: `>{t('buttons.back', 'Back')}<` },
      
      // Validation messages
      { from: /"Required field"/g, to: `t('validation.required', 'Required field')` },
      { from: /"Invalid email"/g, to: `t('validation.invalidEmail', 'Invalid email')` },
      { from: /"Invalid phone number"/g, to: `t('validation.invalidPhone', 'Invalid phone number')` },
      { from: /"Minimum (\d+) characters"/g, to: `t('validation.minLength', 'Minimum $1 characters')` },
      { from: /"Maximum (\d+) characters"/g, to: `t('validation.maxLength', 'Maximum $1 characters')` },
      
      // Success/Error messages
      { from: />Form submitted successfully!/g, to: `>{t('messages.submitSuccess', 'Form submitted successfully!')}<` },
      { from: />Error submitting form/g, to: `>{t('messages.submitError', 'Error submitting form')}<` },
      { from: />Please try again/g, to: `>{t('messages.tryAgain', 'Please try again')}<` },
      { from: />Loading.../g, to: `>{t('messages.loading', 'Loading...')}<` },
      { from: />Please wait.../g, to: `>{t('messages.pleaseWait', 'Please wait...')}<` }
    ];
    
    // Apply replacements
    for (const { from, to } of replacements) {
      const newContent = content.replace(from, to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    }
    
    // Save if modified
    if (modified) {
      await fs.writeFile(filePath, content);
    }
    
    return { filePath, modified };
    
  } catch (error) {
    return { filePath, error: error.message };
  }
}

async function main() {
  console.log('🔧 FIXING FORM COMPONENT TRANSLATIONS\n');
  console.log('=' .repeat(80));
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const relPath of FORM_COMPONENTS) {
    const filePath = path.join(__dirname, '..', relPath);
    const result = await fixFormComponent(filePath);
    
    if (result.error) {
      console.log(`❌ ${relPath}: ${result.error}`);
      errorCount++;
    } else if (result.modified) {
      console.log(`✅ ${relPath}: Fixed and added translations`);
      successCount++;
    } else {
      console.log(`⏭️  ${relPath}: Already has translations`);
    }
  }
  
  console.log('\n' + '=' .repeat(80));
  console.log('📊 SUMMARY:\n');
  console.log(`Forms processed: ${FORM_COMPONENTS.length}`);
  console.log(`Forms fixed: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  
  console.log('\n✅ Form components fixed!');
}

main().catch(console.error);