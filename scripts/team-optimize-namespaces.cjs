#!/usr/bin/env node

/**
 * Team Collaborative Script - Optimize Namespace Organization
 * Author: Vikram (Systems Architect)
 * Purpose: Optimize translation namespaces for performance and maintainability
 */

const fs = require('fs');
const path = require('path');

console.log('===========================================');
console.log('NAMESPACE OPTIMIZATION - Vikram');
console.log('===========================================\n');

// Load current translation structure
const structurePath = path.join(__dirname, '..', 'team-translation-structure.json');
const structure = JSON.parse(fs.readFileSync(structurePath, 'utf-8'));

// Define optimized namespace architecture
const optimizedNamespaces = {
  // Core namespace - Most frequently used translations (cached in memory)
  core: {
    common: {
      buttons: structure.common.buttons || {},
      status: structure.common.status || {},
      actions: structure.common.actions || {},
      navigation: {
        next: 'Next',
        previous: 'Previous',
        back: 'Back',
        home: 'Home',
        menu: 'Menu'
      },
      confirmation: structure.common.confirmation || {}
    },
    validation: {
      required: '{{field}} is required',
      email_invalid: 'Please enter a valid email address',
      phone_invalid: 'Please enter a valid 10-digit phone number',
      pan_invalid: 'Please enter a valid PAN number (ABCDE1234F)',
      aadhaar_invalid: 'Please enter a valid 12-digit Aadhaar number',
      pincode_invalid: 'Please enter a valid 6-digit PIN code',
      min_length: 'Minimum {{min}} characters required',
      max_length: 'Maximum {{max}} characters allowed',
      file_size: 'File size must be less than {{size}}MB',
      file_type: 'Only {{types}} files are allowed'
    }
  },
  
  // Forms namespace - All form-related translations
  forms: {
    fields: {
      // Personal Information
      full_name: 'Full Name',
      first_name: 'First Name',
      last_name: 'Last Name',
      email: 'Email Address',
      phone: 'Phone Number',
      whatsapp: 'WhatsApp Number',
      gender: 'Gender',
      dob: 'Date of Birth',
      
      // Address Information
      address: 'Address',
      street: 'Street Address',
      city: 'City',
      district: 'District',
      state: 'State',
      pincode: 'PIN Code',
      country: 'Country',
      
      // Business Information
      business_name: 'Business Name',
      business_type: 'Business Type',
      investment: 'Investment Capacity',
      experience: 'Experience',
      occupation: 'Occupation',
      
      // Documents
      pan_number: 'PAN Number',
      aadhaar_number: 'Aadhaar Number',
      gst_number: 'GST Number'
    },
    placeholders: {
      full_name: 'Enter your full name',
      email: 'example@email.com',
      phone: '10-digit mobile number',
      whatsapp: 'WhatsApp number',
      pan: 'ABCDE1234F',
      aadhaar: '12-digit Aadhaar number',
      address: 'Enter complete address',
      city: 'Select your city',
      state: 'Choose your state',
      pincode: '6-digit PIN code',
      message: 'Type your message here...'
    },
    options: {
      gender: {
        male: 'Male',
        female: 'Female',
        other: 'Other'
      },
      investment: {
        below_1: 'Below ₹1 Lakh',
        '1_to_5': '₹1-5 Lakhs',
        '5_to_10': '₹5-10 Lakhs',
        '10_to_25': '₹10-25 Lakhs',
        above_25: 'Above ₹25 Lakhs'
      },
      business_type: {
        retail: 'Retail Shop',
        service: 'Service Center',
        grocery: 'Grocery Store',
        medical: 'Medical Store',
        restaurant: 'Restaurant/Cafe',
        other: 'Other'
      },
      occupation: {
        employed: 'Employed',
        self_employed: 'Self Employed',
        business: 'Business Owner',
        student: 'Student',
        retired: 'Retired',
        other: 'Other'
      }
    }
  },
  
  // Component-specific namespaces (lazy loaded)
  agent: {
    title: 'Agent Application',
    subtitle: 'Join our growing network of agents',
    sections: {
      personal: 'Personal Information',
      professional: 'Professional Details',
      documents: 'Document Upload',
      verification: 'Security Verification'
    },
    specific_fields: {
      agent_code: 'Agent Code',
      motivation: 'Why do you want to join as an agent?',
      languages: 'Languages you can speak',
      joining_as: 'Joining as'
    }
  },
  
  franchise: {
    title: 'Franchise Application',
    subtitle: 'Start your ATM franchise business',
    sections: {
      business: 'Business Information',
      financial: 'Financial Details',
      location: 'Location Details',
      documents: 'Required Documents'
    },
    specific_fields: {
      franchise_type: 'Franchise Type',
      preferred_location: 'Preferred Location',
      investment_ready: 'Investment Ready',
      business_plan: 'Business Plan'
    }
  },
  
  influencer: {
    title: 'Influencer Program',
    subtitle: 'Partner with us as an influencer',
    sections: {
      profile: 'Social Media Profile',
      reach: 'Audience Reach',
      content: 'Content Details'
    },
    specific_fields: {
      social_handles: 'Social Media Handles',
      followers: 'Total Followers',
      engagement_rate: 'Engagement Rate',
      content_type: 'Content Type'
    }
  },
  
  location: {
    title: 'Submit ATM Location',
    subtitle: 'Help us find the best locations',
    sections: {
      location: 'Location Details',
      footfall: 'Footfall Information',
      nearby: 'Nearby Establishments'
    },
    specific_fields: {
      location_type: 'Location Type',
      footfall_daily: 'Daily Footfall',
      nearest_atm: 'Distance to Nearest ATM',
      google_maps_link: 'Google Maps Link'
    }
  }
};

// Performance optimization metrics
const metrics = {
  namespace_count: Object.keys(optimizedNamespaces).length,
  total_keys: 0,
  core_keys: 0,
  lazy_loaded_keys: 0
};

// Count keys for metrics
Object.entries(optimizedNamespaces).forEach(([namespace, content]) => {
  const countKeys = (obj) => {
    let count = 0;
    Object.values(obj).forEach(value => {
      if (typeof value === 'string') {
        count++;
      } else if (typeof value === 'object') {
        count += countKeys(value);
      }
    });
    return count;
  };
  
  const keyCount = countKeys(content);
  metrics.total_keys += keyCount;
  
  if (namespace === 'core') {
    metrics.core_keys = keyCount;
  } else {
    metrics.lazy_loaded_keys += keyCount;
  }
});

// Save optimized structure
const outputPath = path.join(__dirname, '..', 'team-optimized-namespaces.json');
fs.writeFileSync(outputPath, JSON.stringify(optimizedNamespaces, null, 2));

// Create namespace loading configuration
const loadingConfig = {
  preload: ['core', 'forms'], // Always preload these
  lazy: ['agent', 'franchise', 'influencer', 'location'], // Load on demand
  cache_strategy: 'lru', // Least Recently Used cache
  max_cache_size: '2MB',
  ttl: 3600 // 1 hour cache
};

const configPath = path.join(__dirname, '..', 'namespace-loading-config.json');
fs.writeFileSync(configPath, JSON.stringify(loadingConfig, null, 2));

console.log('Optimization Complete!\n');
console.log('Performance Metrics:');
console.log(`- Total namespaces: ${metrics.namespace_count}`);
console.log(`- Total translation keys: ${metrics.total_keys}`);
console.log(`- Core keys (always loaded): ${metrics.core_keys}`);
console.log(`- Lazy loaded keys: ${metrics.lazy_loaded_keys}`);
console.log(`- Memory optimization: ~${Math.round(metrics.lazy_loaded_keys / metrics.total_keys * 100)}% reduction`);
console.log('\nNamespace Strategy:');
console.log('- Core namespace: Preloaded for instant access');
console.log('- Forms namespace: Preloaded for form-heavy app');
console.log('- Component namespaces: Lazy loaded on route access');
console.log('\nFiles created:');
console.log('- team-optimized-namespaces.json');
console.log('- namespace-loading-config.json');
console.log('\nReady for Sneha to prioritize user-facing text!');