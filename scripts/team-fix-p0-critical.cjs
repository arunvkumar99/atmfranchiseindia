#!/usr/bin/env node

/**
 * Team Collaborative Script - Fix P0 Critical Components
 * Author: Arjun (Senior Full Stack Developer)
 * Purpose: Replace all hardcoded strings in P0 critical components
 */

const fs = require('fs');
const path = require('path');

console.log('===========================================');
console.log('P0 CRITICAL FIX - Arjun');
console.log('===========================================\n');

// P0 Critical components to fix
const criticalComponents = [
  'JoinUs.tsx',
  'AgentFormEnhanced.tsx',
  'AgentFormSinglePage.tsx',
  'EnquiryFormSinglePage.tsx',
  'SubmitLocationSinglePage.tsx'
];

// Hardcoded strings to replace (from report)
const replacements = {
  // Investment amounts
  '₹10-25 Lakhs': "t('forms.options.investment.10_to_25', '₹10-25 Lakhs')",
  '₹25+ Lakhs': "t('forms.options.investment.above_25', '₹25+ Lakhs')",
  '₹2-3 Lakhs': "t('forms.options.investment.2_to_3', '₹2-3 Lakhs')",
  '₹3-4 Lakhs': "t('forms.options.investment.3_to_4', '₹3-4 Lakhs')",
  '₹4-5 Lakhs': "t('forms.options.investment.4_to_5', '₹4-5 Lakhs')",
  '₹5+ Lakhs': "t('forms.options.investment.above_5', '₹5+ Lakhs')",
  '₹5 - 10 Lakhs': "t('forms.options.investment.5_to_10', '₹5-10 Lakhs')",
  '₹10 - 15 Lakhs': "t('forms.options.investment.10_to_15', '₹10-15 Lakhs')",
  '₹15 - 25 Lakhs': "t('forms.options.investment.15_to_25', '₹15-25 Lakhs')",
  'Above ₹25 Lakhs': "t('forms.options.investment.above_25', 'Above ₹25 Lakhs')",
  
  // Placeholders
  '"House/Building number, Street name"': "t('forms.placeholders.address_line1', 'House/Building number, Street name')",
  '"Area, Landmark"': "t('forms.placeholders.address_line2', 'Area, Landmark')",
  '"Enter city"': "t('forms.placeholders.city', 'Enter city')",
  '"Select business type"': "t('forms.placeholders.business_type', 'Select business type')",
  '"Primary contact number"': "t('forms.placeholders.phone_primary', 'Primary contact number')",
  '"WhatsApp number"': "t('forms.placeholders.whatsapp', 'WhatsApp number')",
  '"Enter your email address"': "t('forms.placeholders.email', 'Enter your email address')",
  '"ABCDE1234F"': "t('forms.placeholders.pan', 'ABCDE1234F')",
  '"Choose your state"': "t('forms.placeholders.state', 'Choose your state')",
  '"Enter your district"': "t('forms.placeholders.district', 'Enter your district')",
  '"6-digit pincode"': "t('forms.placeholders.pincode', '6-digit pincode')",
  '"Your city"': "t('forms.placeholders.your_city', 'Your city')",
  '"123456789012 (12 digits only)"': "t('forms.placeholders.aadhaar', '123456789012 (12 digits only)')",
  '"Enter your full name as per PAN card"': "t('forms.placeholders.full_name_pan', 'Enter your full name as per PAN card')",
  
  // Buttons
  '>Submit<': ">{t('common.buttons.submit', 'Submit')}<",
  '>Save<': ">{t('common.buttons.save', 'Save')}<",
  '>Next<': ">{t('common.buttons.next', 'Next')}<",
  '>Previous<': ">{t('common.buttons.previous', 'Previous')}<",
  '>Continue<': ">{t('common.buttons.continue', 'Continue')}<",
  '>Cancel<': ">{t('common.buttons.cancel', 'Cancel')}<",
  '>Add<': ">{t('common.buttons.add', 'Add')}<",
  '>Back<': ">{t('common.buttons.back', 'Back')}<",
  
  // Status messages
  '>Loading<': ">{t('common.status.loading', 'Loading')}<",
  '>Error<': ">{t('common.status.error', 'Error')}<",
  '>Success<': ">{t('common.status.success', 'Success')}<",
  '>Required<': ">{t('common.status.required', 'Required')}<",
  
  // Validation messages
  '"Please complete the security verification before submitting."': "t('core.validation.security_required', 'Please complete the security verification before submitting.')",
  '"Please try again or contact us directly."': "t('core.validation.try_again', 'Please try again or contact us directly.')",
  '"Please enter a valid email address"': "t('core.validation.email_invalid', 'Please enter a valid email address')",
  '"Please enter a valid 10-digit phone number"': "t('core.validation.phone_invalid', 'Please enter a valid 10-digit phone number')",
  
  // Common UI elements
  '>Yes<': ">{t('common.confirmation.yes', 'Yes')}<",
  '>No<': ">{t('common.confirmation.no', 'No')}<",
  '>Select<': ">{t('common.actions.select', 'Select')}<",
  '>Choose<': ">{t('common.actions.choose', 'Choose')}<",
  '>Search<': ">{t('common.actions.search', 'Search')}<",
  '>Upload<': ">{t('common.actions.upload', 'Upload')}<",
  '>Preview<': ">{t('common.actions.preview', 'Preview')}<"
};

// Process each critical component
criticalComponents.forEach(componentFile => {
  const filePath = path.join(__dirname, '..', 'src', 'components', componentFile);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠ File not found: ${componentFile}`);
    return;
  }
  
  console.log(`Processing ${componentFile}...`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let replacementCount = 0;
  
  // Apply all replacements
  Object.entries(replacements).forEach(([oldString, newString]) => {
    const regex = new RegExp(oldString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newString);
      replacementCount += matches.length;
    }
  });
  
  // Ensure useTranslation hook is imported
  if (!content.includes("import { useTranslation }")) {
    content = content.replace(
      /import\s+{[^}]*}\s+from\s+['"]react['"]/,
      match => `${match};\nimport { useTranslation } from 'react-i18next'`
    );
  }
  
  // Ensure t function is declared
  if (!content.includes("const { t }")) {
    content = content.replace(
      /const\s+(\w+)\s*=\s*\(\)\s*=>\s*{/,
      match => `${match}\n  const { t } = useTranslation();`
    );
  }
  
  // Save the updated file
  fs.writeFileSync(filePath, content);
  console.log(`  ✓ Fixed ${replacementCount} hardcoded strings`);
});

console.log('\n===========================================');
console.log('P0 CRITICAL FIX COMPLETE');
console.log('===========================================');
console.log('\nNext steps:');
console.log('1. Update translation JSON files');
console.log('2. Test all forms');
console.log('3. Proceed with P1 fixes');