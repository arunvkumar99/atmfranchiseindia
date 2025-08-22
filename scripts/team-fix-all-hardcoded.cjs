#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Team-based fixing approach
const fixes = {
  // Dev's fixes for form components
  'src/components/AgentFormEnhanced.tsx': [
    { old: '"Upload Front Side of your PAN Card *"', new: '{t(\'forms.uploadPanFront\')}' },
    { old: '"Upload Aadhaar Front Side *"', new: '{t(\'forms.uploadAadhaarFront\')}' },
    { old: '"Upload Aadhaar Back Side *"', new: '{t(\'forms.uploadAadhaarBack\')}' },
    { old: '"Upload Passport Size Photo *"', new: '{t(\'forms.uploadPassportPhoto\')}' },
    { old: '"Select Gender"', new: '{t(\'forms.selectGender\')}' },
    { old: '"Male"', new: '{t(\'forms.gender.male\')}' },
    { old: '"Female"', new: '{t(\'forms.gender.female\')}' },
    { old: '"Other"', new: '{t(\'forms.gender.other\')}' }
  ],
  
  'src/components/EnquiryFormProgressive.tsx': [
    { old: '"₹5 - 10 Lakhs"', new: '{t(\'forms.investment.5to10L\')}' },
    { old: '"₹10 - 15 Lakhs"', new: '{t(\'forms.investment.10to15L\')}' },
    { old: '"₹15 - 25 Lakhs"', new: '{t(\'forms.investment.15to25L\')}' },
    { old: '"₹25+ Lakhs"', new: '{t(\'forms.investment.25LPlus\')}' },
    { old: '"Select Investment Range"', new: '{t(\'forms.selectInvestmentRange\')}' },
    { old: '"Choose Location Type"', new: '{t(\'forms.chooseLocationType\')}' },
    { old: '"Rural"', new: '{t(\'forms.locationType.rural\')}' },
    { old: '"Urban"', new: '{t(\'forms.locationType.urban\')}' },
    { old: '"Semi-Urban"', new: '{t(\'forms.locationType.semiUrban\')}' }
  ],

  // Priya's remaining fixes
  'src/components/JoinUs.tsx': [
    { old: '"Any additional comments"', new: '{t(\'forms.additionalComments\')}' },
    { old: '"I agree to terms"', new: '{t(\'forms.agreeToTerms\')}' },
    { old: '"Submit Application"', new: '{t(\'forms.submitApplication\')}' },
    { old: '"Processing..."', new: '{t(\'forms.processing\')}' }
  ],

  'src/components/JobApplicationSinglePage.tsx': [
    { old: '"Upload Resume/CV"', new: '{t(\'forms.uploadResume\')}' },
    { old: '"Expected Salary"', new: '{t(\'forms.expectedSalary\')}' },
    { old: '"Notice Period"', new: '{t(\'forms.noticePeriod\')}' },
    { old: '"Years of Experience"', new: '{t(\'forms.yearsExperience\')}' },
    { old: '"Current Location"', new: '{t(\'forms.currentLocation\')}' },
    { old: '"Immediate"', new: '{t(\'forms.noticePeriod.immediate\')}' },
    { old: '"15 days"', new: '{t(\'forms.noticePeriod.15days\')}' },
    { old: '"30 days"', new: '{t(\'forms.noticePeriod.30days\')}' },
    { old: '"60 days"', new: '{t(\'forms.noticePeriod.60days\')}' }
  ],

  // Lakshmi's remaining fixes
  'src/components/InfluencerFormProgressive.tsx': [
    { old: '"Social Media Handles"', new: '{t(\'forms.socialMediaHandles\')}' },
    { old: '"Instagram"', new: '{t(\'forms.social.instagram\')}' },
    { old: '"Facebook"', new: '{t(\'forms.social.facebook\')}' },
    { old: '"Twitter"', new: '{t(\'forms.social.twitter\')}' },
    { old: '"YouTube"', new: '{t(\'forms.social.youtube\')}' }
  ],

  // Ashok's UI component fixes
  'src/components/ui/direct-file-upload.tsx': [
    { old: '"Remove File"', new: '{t(\'forms.removeFile\')}' },
    { old: '"File Selected"', new: '{t(\'forms.fileSelected\')}' },
    { old: '"No file selected"', new: '{t(\'forms.noFileSelected\')}' },
    { old: '"Click to upload"', new: '{t(\'forms.clickToUpload\')}' },
    { old: '"or drag and drop"', new: '{t(\'forms.orDragAndDrop\')}' }
  ],

  'src/components/ui/enhanced-file-upload.tsx': [
    { old: '"Take Photo"', new: '{t(\'forms.takePhoto\')}' },
    { old: '"Choose from Gallery"', new: '{t(\'forms.chooseFromGallery\')}' },
    { old: '"Processing..."', new: '{t(\'forms.processing\')}' }
  ]
};

// Function to apply fixes to a file
function fixFile(filePath, replacements) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️ File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  replacements.forEach(({ old, new: newText }) => {
    if (content.includes(old)) {
      content = content.replace(new RegExp(old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newText);
      modified = true;
      console.log(`  ✓ Replaced: ${old.substring(0, 30)}...`);
    }
  });

  if (modified) {
    // Ensure useTranslation is imported
    if (!content.includes("import { useTranslation }") && !content.includes("import {useTranslation}")) {
      const importLine = "import { useTranslation } from 'react-i18next';\n";
      
      // Add after last import
      const lastImportIndex = content.lastIndexOf('\nimport ');
      if (lastImportIndex > -1) {
        const lineEnd = content.indexOf('\n', lastImportIndex + 1);
        content = content.slice(0, lineEnd + 1) + importLine + content.slice(lineEnd + 1);
      }
    }

    // Ensure t function is extracted
    if (!content.includes('const { t }') && content.includes('{t(')) {
      // Find the component function
      const componentMatch = content.match(/(export\s+(?:default\s+)?(?:function|const)\s+\w+[^{]*{)/);
      if (componentMatch) {
        const insertPos = content.indexOf(componentMatch[0]) + componentMatch[0].length;
        content = content.slice(0, insertPos) + "\n  const { t } = useTranslation('forms');" + content.slice(insertPos);
      }
    }

    fs.writeFileSync(fullPath, content, 'utf8');
    return true;
  }

  return false;
}

// Main execution
console.log('🚀 Team-based Hindi Translation Fix Script');
console.log('==========================================\n');

let totalFixed = 0;
let totalFiles = 0;

// Process each team member's assignments
const teams = {
  'Dev': ['src/components/AgentFormEnhanced.tsx', 'src/components/EnquiryFormProgressive.tsx'],
  'Priya': ['src/components/JoinUs.tsx', 'src/components/JobApplicationSinglePage.tsx'],
  'Lakshmi': ['src/components/InfluencerFormProgressive.tsx'],
  'Ashok': ['src/components/ui/direct-file-upload.tsx', 'src/components/ui/enhanced-file-upload.tsx']
};

Object.entries(teams).forEach(([member, files]) => {
  console.log(`\n👨‍💻 ${member}'s Assignments:`);
  console.log('------------------------');
  
  files.forEach(file => {
    if (fixes[file]) {
      console.log(`\n📝 Fixing: ${file}`);
      const fixed = fixFile(file, fixes[file]);
      if (fixed) {
        totalFixed += fixes[file].length;
        totalFiles++;
      }
    }
  });
});

// Now fix ALL remaining hardcoded texts in all components
console.log('\n\n🔧 Comprehensive Fix for All Remaining Components');
console.log('=================================================\n');

const componentsDir = path.join(process.cwd(), 'src', 'components');

function scanAndFixComponent(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;

  // Common patterns to fix
  const patterns = [
    // Button texts
    { pattern: />Submit</g, replacement: '>{t(\'buttons.submit\')}<' },
    { pattern: />Cancel</g, replacement: '>{t(\'buttons.cancel\')}<' },
    { pattern: />Save</g, replacement: '>{t(\'buttons.save\')}<' },
    { pattern: />Add</g, replacement: '>{t(\'buttons.add\')}<' },
    { pattern: />Remove</g, replacement: '>{t(\'buttons.remove\')}<' },
    { pattern: />Delete</g, replacement: '>{t(\'buttons.delete\')}<' },
    { pattern: />Edit</g, replacement: '>{t(\'buttons.edit\')}<' },
    { pattern: />Update</g, replacement: '>{t(\'buttons.update\')}<' },
    { pattern: />Next</g, replacement: '>{t(\'buttons.next\')}<' },
    { pattern: />Previous</g, replacement: '>{t(\'buttons.previous\')}<' },
    { pattern: />Back</g, replacement: '>{t(\'buttons.back\')}<' },
    { pattern: />Continue</g, replacement: '>{t(\'buttons.continue\')}<' },
    
    // Status messages  
    { pattern: />Loading\.\.\.</g, replacement: '>{t(\'status.loading\')}<' },
    { pattern: />Processing\.\.\.</g, replacement: '>{t(\'status.processing\')}<' },
    { pattern: />Please wait\.\.\.</g, replacement: '>{t(\'status.pleaseWait\')}<' },
    { pattern: />Success!</g, replacement: '>{t(\'status.success\')}<' },
    { pattern: />Error!</g, replacement: '>{t(\'status.error\')}<' },
    { pattern: />Required</g, replacement: '>{t(\'validation.required\')}<' },
    
    // Placeholders
    { pattern: /placeholder="Enter/g, replacement: 'placeholder={t(\'placeholders.enter' },
    { pattern: /placeholder="Select/g, replacement: 'placeholder={t(\'placeholders.select' },
    { pattern: /placeholder="Choose/g, replacement: 'placeholder={t(\'placeholders.choose' },
    
    // Labels
    { pattern: /<Label>Name/g, replacement: '<Label>{t(\'labels.name\')' },
    { pattern: /<Label>Email/g, replacement: '<Label>{t(\'labels.email\')' },
    { pattern: /<Label>Phone/g, replacement: '<Label>{t(\'labels.phone\')' },
    { pattern: /<Label>Address/g, replacement: '<Label>{t(\'labels.address\')' },
    { pattern: /<Label>City/g, replacement: '<Label>{t(\'labels.city\')' },
    { pattern: /<Label>State/g, replacement: '<Label>{t(\'labels.state\')' },
    { pattern: /<Label>Pincode/g, replacement: '<Label>{t(\'labels.pincode\')' }
  ];

  patterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(newContent)) {
      newContent = newContent.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    // Ensure imports
    if (!newContent.includes("import { useTranslation }")) {
      const importLine = "import { useTranslation } from 'react-i18next';\n";
      const lastImportIndex = newContent.lastIndexOf('\nimport ');
      if (lastImportIndex > -1) {
        const lineEnd = newContent.indexOf('\n', lastImportIndex + 1);
        newContent = newContent.slice(0, lineEnd + 1) + importLine + newContent.slice(lineEnd + 1);
      }
    }

    // Ensure t function
    if (!newContent.includes('const { t }') && newContent.includes('{t(')) {
      const componentMatch = newContent.match(/(export\s+(?:default\s+)?(?:function|const)\s+\w+[^{]*{)/);
      if (componentMatch) {
        const insertPos = newContent.indexOf(componentMatch[0]) + componentMatch[0].length;
        newContent = newContent.slice(0, insertPos) + "\n  const { t } = useTranslation();" + newContent.slice(insertPos);
      }
    }

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✓ Fixed: ${path.basename(filePath)}`);
    return true;
  }

  return false;
}

// Scan and fix all component files
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && file !== 'ui') {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      scanAndFixComponent(fullPath);
    }
  });
}

processDirectory(componentsDir);

console.log('\n\n📊 Final Summary');
console.log('================');
console.log(`Total files fixed: ${totalFiles}`);
console.log(`Total replacements: ${totalFixed}`);
console.log('\n✅ Team fix complete! Now run the scan again to verify.');