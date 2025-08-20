#!/usr/bin/env node

/**
 * Team Collaborative Script - Prioritize Critical User-Facing Text
 * Author: Sneha (Senior Product Manager)
 * Purpose: Prioritize translations based on user impact and conversion funnel
 */

const fs = require('fs');
const path = require('path');

console.log('===========================================');
console.log('TRANSLATION PRIORITIZATION - Sneha');
console.log('===========================================\n');

// Priority levels based on user journey and conversion impact
const PRIORITY_LEVELS = {
  P0_CRITICAL: 'P0 - Critical (Blocks user progress)',
  P1_HIGH: 'P1 - High (Conversion impact)',
  P2_MEDIUM: 'P2 - Medium (User experience)',
  P3_LOW: 'P3 - Low (Nice to have)'
};

// Load optimized namespaces
const namespacesPath = path.join(__dirname, '..', 'team-optimized-namespaces.json');
const namespaces = JSON.parse(fs.readFileSync(namespacesPath, 'utf-8'));

// Prioritized translation map
const prioritizedTranslations = {
  P0_CRITICAL: {
    description: 'Must be translated - Blocks user journey',
    components: [
      'AgentFormEnhanced',
      'AgentFormSinglePage',
      'EnquiryFormSinglePage',
      'SubmitLocationSinglePage',
      'JoinUs'
    ],
    translations: {
      // Form submission buttons
      'common.buttons.submit': 'Submit',
      'common.buttons.continue': 'Continue',
      'common.buttons.next': 'Next',
      
      // Critical validation messages
      'core.validation.required': '{{field}} is required',
      'core.validation.email_invalid': 'Please enter a valid email address',
      'core.validation.phone_invalid': 'Please enter a valid 10-digit phone number',
      
      // Critical form fields
      'forms.fields.full_name': 'Full Name',
      'forms.fields.email': 'Email Address',
      'forms.fields.phone': 'Phone Number',
      'forms.fields.whatsapp': 'WhatsApp Number',
      
      // Error states
      'common.status.error': 'Error',
      'common.status.required': 'Required'
    }
  },
  
  P1_HIGH: {
    description: 'High priority - Affects conversion rates',
    components: [
      'Hero',
      'GetStarted',
      'InfluencerFormSinglePage',
      'JobApplicationSinglePage'
    ],
    translations: {
      // CTA buttons
      'common.buttons.register': 'Register',
      'common.buttons.apply': 'Apply Now',
      'common.buttons.save': 'Save',
      
      // Form placeholders
      'forms.placeholders.full_name': 'Enter your full name',
      'forms.placeholders.email': 'example@email.com',
      'forms.placeholders.phone': '10-digit mobile number',
      
      // Investment options (critical for franchise)
      'forms.options.investment.1_to_5': '₹1-5 Lakhs',
      'forms.options.investment.5_to_10': '₹5-10 Lakhs',
      'forms.options.investment.10_to_25': '₹10-25 Lakhs',
      
      // Success messages
      'common.status.success': 'Success',
      'common.status.loading': 'Loading'
    }
  },
  
  P2_MEDIUM: {
    description: 'Medium priority - Improves user experience',
    components: [
      'Header',
      'Footer',
      'FAQ',
      'Testimonials',
      'Services'
    ],
    translations: {
      // Navigation
      'common.buttons.back': 'Back',
      'common.buttons.close': 'Close',
      'common.navigation.home': 'Home',
      'common.navigation.menu': 'Menu',
      
      // Common actions
      'common.actions.search': 'Search',
      'common.actions.filter': 'Filter',
      'common.actions.select': 'Select',
      
      // Additional form fields
      'forms.fields.city': 'City',
      'forms.fields.state': 'State',
      'forms.fields.pincode': 'PIN Code'
    }
  },
  
  P3_LOW: {
    description: 'Low priority - Nice to have',
    components: [
      'AboutUs',
      'PrivacyPolicy',
      'TermsConditions',
      'AccessibilityStatement'
    ],
    translations: {
      // Less critical buttons
      'common.buttons.cancel': 'Cancel',
      'common.buttons.reset': 'Reset',
      'common.buttons.clear': 'Clear',
      
      // Confirmation
      'common.confirmation.yes': 'Yes',
      'common.confirmation.no': 'No',
      
      // Additional actions
      'common.actions.export': 'Export',
      'common.actions.import': 'Import'
    }
  }
};

// Create implementation plan
const implementationPlan = {
  day1: {
    morning: {
      task: 'Implement P0 Critical translations',
      components: prioritizedTranslations.P0_CRITICAL.components,
      estimated_time: '4 hours',
      assigned_to: 'Arjun'
    },
    afternoon: {
      task: 'Implement P1 High priority translations',
      components: prioritizedTranslations.P1_HIGH.components,
      estimated_time: '3 hours',
      assigned_to: 'Arjun'
    },
    evening: {
      task: 'Test P0 and P1 implementations',
      components: [...prioritizedTranslations.P0_CRITICAL.components, ...prioritizedTranslations.P1_HIGH.components],
      estimated_time: '2 hours',
      assigned_to: 'Rahul'
    }
  },
  day2: {
    morning: {
      task: 'Implement P2 Medium priority translations',
      components: prioritizedTranslations.P2_MEDIUM.components,
      estimated_time: '3 hours',
      assigned_to: 'Arjun'
    },
    afternoon: {
      task: 'Implement P3 Low priority translations',
      components: prioritizedTranslations.P3_LOW.components,
      estimated_time: '2 hours',
      assigned_to: 'Arjun'
    },
    evening: {
      task: 'Final testing and validation',
      components: 'All components',
      estimated_time: '3 hours',
      assigned_to: 'Rahul'
    }
  }
};

// Calculate metrics
const metrics = {
  total_components: new Set([
    ...prioritizedTranslations.P0_CRITICAL.components,
    ...prioritizedTranslations.P1_HIGH.components,
    ...prioritizedTranslations.P2_MEDIUM.components,
    ...prioritizedTranslations.P3_LOW.components
  ]).size,
  p0_translations: Object.keys(prioritizedTranslations.P0_CRITICAL.translations).length,
  p1_translations: Object.keys(prioritizedTranslations.P1_HIGH.translations).length,
  p2_translations: Object.keys(prioritizedTranslations.P2_MEDIUM.translations).length,
  p3_translations: Object.keys(prioritizedTranslations.P3_LOW.translations).length
};

metrics.total_translations = metrics.p0_translations + metrics.p1_translations + 
                             metrics.p2_translations + metrics.p3_translations;

// Save prioritization data
const outputPath = path.join(__dirname, '..', 'team-prioritized-translations.json');
fs.writeFileSync(outputPath, JSON.stringify(prioritizedTranslations, null, 2));

const planPath = path.join(__dirname, '..', 'team-implementation-plan.json');
fs.writeFileSync(planPath, JSON.stringify(implementationPlan, null, 2));

console.log('Prioritization Complete!\n');
console.log('Priority Distribution:');
console.log(`- P0 Critical: ${metrics.p0_translations} translations (${Math.round(metrics.p0_translations/metrics.total_translations*100)}%)`);
console.log(`- P1 High: ${metrics.p1_translations} translations (${Math.round(metrics.p1_translations/metrics.total_translations*100)}%)`);
console.log(`- P2 Medium: ${metrics.p2_translations} translations (${Math.round(metrics.p2_translations/metrics.total_translations*100)}%)`);
console.log(`- P3 Low: ${metrics.p3_translations} translations (${Math.round(metrics.p3_translations/metrics.total_translations*100)}%)`);
console.log(`\nTotal: ${metrics.total_translations} prioritized translations`);
console.log(`Components to update: ${metrics.total_components}`);
console.log('\nImplementation Timeline:');
console.log('Day 1:');
console.log('  Morning (4hrs): P0 Critical - Form submissions & validation');
console.log('  Afternoon (3hrs): P1 High - CTAs & conversion elements');
console.log('  Evening (2hrs): Testing by Rahul');
console.log('\nDay 2:');
console.log('  Morning (3hrs): P2 Medium - Navigation & UX');
console.log('  Afternoon (2hrs): P3 Low - Static content');
console.log('  Evening (3hrs): Final validation');
console.log('\nFiles created:');
console.log('- team-prioritized-translations.json');
console.log('- team-implementation-plan.json');
console.log('\nReady for Rahul to create test cases!');