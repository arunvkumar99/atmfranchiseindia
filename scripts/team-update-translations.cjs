#!/usr/bin/env node

/**
 * Team Collaborative Script - Update Translation JSON Files
 * Author: Priya (Senior Web Architect) 
 * Purpose: Update all language JSON files with new translation keys
 */

const fs = require('fs');
const path = require('path');

console.log('===========================================');
console.log('UPDATE TRANSLATION FILES - Priya');
console.log('===========================================\n');

// Languages to update
const languages = ['en', 'hi', 'ml', 'bn', 'gu', 'kn', 'mr', 'or', 'as'];

// Load optimized namespaces
const namespacesPath = path.join(__dirname, '..', 'team-optimized-namespaces.json');
const namespaces = JSON.parse(fs.readFileSync(namespacesPath, 'utf-8'));

// Translation updates to add to all files
const translationUpdates = {
  common: {
    buttons: {
      submit: "Submit",
      save: "Save",
      cancel: "Cancel",
      next: "Next",
      previous: "Previous",
      continue: "Continue",
      back: "Back",
      close: "Close",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      update: "Update",
      apply: "Apply",
      reset: "Reset",
      clear: "Clear",
      register: "Register",
      login: "Login",
      finish: "Finish"
    },
    status: {
      loading: "Loading",
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      required: "Required",
      optional: "Optional",
      pending: "Pending",
      completed: "Completed",
      failed: "Failed"
    },
    actions: {
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      export: "Export",
      import: "Import",
      upload: "Upload",
      download: "Download",
      preview: "Preview",
      select: "Select",
      choose: "Choose"
    },
    confirmation: {
      yes: "Yes",
      no: "No",
      confirm: "Confirm",
      agree: "I Agree",
      disagree: "I Disagree"
    },
    navigation: {
      home: "Home",
      back: "Back",
      next: "Next",
      previous: "Previous",
      menu: "Menu"
    }
  },
  forms: {
    validation: {
      required: "{{field}} is required",
      email_invalid: "Please enter a valid email address",
      phone_invalid: "Please enter a valid 10-digit phone number",
      pan_invalid: "Please enter a valid PAN number (ABCDE1234F)",
      aadhaar_invalid: "Please enter a valid 12-digit Aadhaar number",
      pincode_invalid: "Please enter a valid 6-digit PIN code",
      min_length: "Minimum {{min}} characters required",
      max_length: "Maximum {{max}} characters allowed",
      file_size: "File size must be less than {{size}}MB",
      file_type: "Only {{types}} files are allowed",
      security_required: "Please complete the security verification before submitting",
      try_again: "Please try again or contact us directly"
    },
    options: {
      investment: {
        below_1: "Below ₹1 Lakh",
        "1_to_5": "₹1-5 Lakhs",
        "2_to_3": "₹2-3 Lakhs",
        "3_to_4": "₹3-4 Lakhs",
        "4_to_5": "₹4-5 Lakhs",
        "5_to_10": "₹5-10 Lakhs",
        "10_to_15": "₹10-15 Lakhs",
        "10_to_25": "₹10-25 Lakhs",
        "15_to_25": "₹15-25 Lakhs",
        above_5: "₹5+ Lakhs",
        above_25: "Above ₹25 Lakhs"
      },
      gender: {
        male: "Male",
        female: "Female",
        other: "Other"
      },
      businessType: {
        retail: "Retail Shop",
        service: "Service Center",
        grocery: "Grocery Store",
        medical: "Medical Store",
        restaurant: "Restaurant/Cafe",
        other: "Other"
      }
    },
    placeholders: {
      full_name: "Enter your full name",
      full_name_pan: "Enter your full name as per PAN card",
      email: "Enter your email address",
      phone: "10-digit mobile number",
      phone_primary: "Primary contact number",
      whatsapp: "WhatsApp number",
      pan: "ABCDE1234F",
      aadhaar: "123456789012 (12 digits only)",
      address: "Enter complete address",
      address_line1: "House/Building number, Street name",
      address_line2: "Area, Landmark",
      city: "Enter city",
      your_city: "Your city",
      state: "Choose your state",
      district: "Enter your district",
      pincode: "6-digit pincode",
      business_type: "Select business type",
      message: "Type your message here..."
    }
  }
};

// Process each language
languages.forEach(lang => {
  console.log(`\nUpdating ${lang} translations...`);
  
  // Update common.json
  const commonPath = path.join(__dirname, '..', 'public', 'locales', lang, 'common.json');
  let commonData = {};
  
  if (fs.existsSync(commonPath)) {
    commonData = JSON.parse(fs.readFileSync(commonPath, 'utf-8'));
  }
  
  // Merge new translations
  commonData = {
    ...commonData,
    ...translationUpdates.common
  };
  
  fs.writeFileSync(commonPath, JSON.stringify(commonData, null, 2));
  console.log(`  ✓ Updated common.json`);
  
  // Update forms.json
  const formsPath = path.join(__dirname, '..', 'public', 'locales', lang, 'forms.json');
  let formsData = {};
  
  if (fs.existsSync(formsPath)) {
    formsData = JSON.parse(fs.readFileSync(formsPath, 'utf-8'));
  }
  
  // Merge new translations
  formsData = {
    ...formsData,
    validation: {
      ...formsData.validation,
      ...translationUpdates.forms.validation
    },
    options: {
      ...formsData.options,
      ...translationUpdates.forms.options
    },
    placeholders: {
      ...formsData.placeholders,
      ...translationUpdates.forms.placeholders
    }
  };
  
  fs.writeFileSync(formsPath, JSON.stringify(formsData, null, 2));
  console.log(`  ✓ Updated forms.json`);
});

console.log('\n===========================================');
console.log('TRANSLATION FILES UPDATED');
console.log('===========================================');
console.log(`\nUpdated ${languages.length} languages:`);
console.log(languages.join(', '));
console.log('\nKey additions:');
console.log(`- Common buttons: ${Object.keys(translationUpdates.common.buttons).length}`);
console.log(`- Status messages: ${Object.keys(translationUpdates.common.status).length}`);
console.log(`- Form validations: ${Object.keys(translationUpdates.forms.validation).length}`);
console.log(`- Investment options: ${Object.keys(translationUpdates.forms.options.investment).length}`);
console.log('\nReady for testing!');