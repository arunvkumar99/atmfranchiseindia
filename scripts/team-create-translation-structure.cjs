#!/usr/bin/env node

/**
 * Team Collaborative Script - Create Translation Structure
 * Author: Priya (Senior Web Architect)
 * Purpose: Create proper translation key structure for all extracted strings
 */

const fs = require('fs');
const path = require('path');

// Load extracted strings
const extractedPath = path.join(__dirname, '..', 'team-extracted-all-strings.json');
const extracted = JSON.parse(fs.readFileSync(extractedPath, 'utf-8'));

// Initialize translation structure
const translationStructure = {
  common: {
    buttons: {},
    status: {},
    actions: {},
    navigation: {},
    confirmation: {}
  },
  forms: {
    labels: {},
    placeholders: {},
    validation: {},
    options: {
      investment: {},
      businessType: {},
      gender: {},
      occupation: {},
      state: {}
    }
  },
  agent: {
    title: "Agent Application",
    sections: {},
    fields: {},
    messages: {}
  },
  franchise: {
    title: "Franchise Application",
    sections: {},
    fields: {},
    messages: {}
  },
  influencer: {
    title: "Influencer Program",
    sections: {},
    fields: {},
    messages: {}
  },
  location: {
    title: "Submit Location",
    sections: {},
    fields: {},
    messages: {}
  }
};

// Common UI strings mapping
const commonButtonMappings = {
  'submit': 'Submit',
  'save': 'Save',
  'cancel': 'Cancel',
  'next': 'Next',
  'previous': 'Previous',
  'continue': 'Continue',
  'back': 'Back',
  'close': 'Close',
  'apply': 'Apply',
  'reset': 'Reset',
  'clear': 'Clear',
  'add': 'Add',
  'remove': 'Remove',
  'edit': 'Edit',
  'delete': 'Delete',
  'update': 'Update',
  'register': 'Register',
  'login': 'Login',
  'logout': 'Logout',
  'finish': 'Finish',
  'ok': 'OK'
};

const commonStatusMappings = {
  'loading': 'Loading',
  'success': 'Success',
  'error': 'Error',
  'warning': 'Warning',
  'info': 'Info',
  'required': 'Required',
  'optional': 'Optional',
  'pending': 'Pending',
  'completed': 'Completed',
  'failed': 'Failed'
};

const commonActionMappings = {
  'search': 'Search',
  'filter': 'Filter',
  'sort': 'Sort',
  'export': 'Export',
  'import': 'Import',
  'upload': 'Upload',
  'download': 'Download',
  'preview': 'Preview',
  'select': 'Select',
  'choose': 'Choose'
};

const commonConfirmationMappings = {
  'yes': 'Yes',
  'no': 'No',
  'confirm': 'Confirm',
  'agree': 'I Agree',
  'disagree': 'I Disagree'
};

// Process each component's extracted strings
Object.entries(extracted.extractedStrings).forEach(([componentName, componentStrings]) => {
  console.log(`Processing ${componentName}...`);
  
  // Determine component namespace
  let namespace = 'forms'; // default
  if (componentName.toLowerCase().includes('agent')) {
    namespace = 'agent';
  } else if (componentName.toLowerCase().includes('franchise') || componentName.toLowerCase().includes('enquiry')) {
    namespace = 'franchise';
  } else if (componentName.toLowerCase().includes('influencer')) {
    namespace = 'influencer';
  } else if (componentName.toLowerCase().includes('location')) {
    namespace = 'location';
  }
  
  // Process each category of strings
  Object.entries(componentStrings).forEach(([category, strings]) => {
    Object.entries(strings).forEach(([key, value]) => {
      // Check if it's a common string
      const lowerValue = value.toLowerCase();
      
      if (commonButtonMappings[lowerValue]) {
        translationStructure.common.buttons[lowerValue] = value;
      } else if (commonStatusMappings[lowerValue]) {
        translationStructure.common.status[lowerValue] = value;
      } else if (commonActionMappings[lowerValue]) {
        translationStructure.common.actions[lowerValue] = value;
      } else if (commonConfirmationMappings[lowerValue]) {
        translationStructure.common.confirmation[lowerValue] = value;
      } else {
        // Add to component-specific namespace
        if (namespace !== 'forms') {
          if (category === 'labels' || category === 'fields') {
            translationStructure[namespace].fields[key] = value;
          } else if (category === 'messages') {
            translationStructure[namespace].messages[key] = value;
          }
        } else {
          // Add to forms namespace
          if (translationStructure.forms[category]) {
            if (typeof translationStructure.forms[category] === 'object') {
              translationStructure.forms[category][key] = value;
            }
          }
        }
      }
    });
  });
});

// Save the structured translation data
const outputPath = path.join(__dirname, '..', 'team-translation-structure.json');
fs.writeFileSync(outputPath, JSON.stringify(translationStructure, null, 2));

console.log('\n===========================================');
console.log('TRANSLATION STRUCTURE CREATED - Priya');
console.log('===========================================');
console.log('Structure saved to: team-translation-structure.json');
console.log('\nKey Statistics:');
console.log(`- Common buttons: ${Object.keys(translationStructure.common.buttons).length}`);
console.log(`- Common status: ${Object.keys(translationStructure.common.status).length}`);
console.log(`- Common actions: ${Object.keys(translationStructure.common.actions).length}`);
console.log(`- Forms fields: ${Object.keys(translationStructure.forms.labels).length}`);
console.log('\nReady for Vikram to optimize namespaces!');