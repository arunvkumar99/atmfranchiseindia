const fs = require('fs');
const path = require('path');

console.log('🔧 FIXING ALL COMPONENTS TO USE TRANSLATIONS\n');
console.log('=' . repeat(80));

// Common text mappings to translation keys
const textToTranslationMap = {
  // Form labels
  '"First Name"': "t('fields.firstName', 'First Name')",
  '"Last Name"': "t('fields.lastName', 'Last Name')",
  '"Full Name"': "t('fields.fullName', 'Full Name')",
  '"Email"': "t('fields.email', 'Email')",
  '"Email Address"': "t('fields.email', 'Email Address')",
  '"Phone"': "t('fields.phone', 'Phone')",
  '"Phone Number"': "t('fields.phone', 'Phone Number')",
  '"Mobile Number"': "t('fields.phone', 'Mobile Number')",
  '"Address"': "t('fields.address', 'Address')",
  '"City"': "t('fields.city', 'City')",
  '"State"': "t('fields.state', 'State')",
  '"PIN Code"': "t('fields.pincode', 'PIN Code')",
  '"Pincode"': "t('fields.pincode', 'Pincode')",
  '"Message"': "t('fields.message', 'Message')",
  '"Comments"': "t('fields.comments', 'Comments')",
  
  // Placeholders
  '"Enter your name"': "t('placeholders.fullName', 'Enter your name')",
  '"Enter your full name"': "t('placeholders.fullName', 'Enter your full name')",
  '"Enter first name"': "t('placeholders.firstName', 'Enter first name')",
  '"Enter last name"': "t('placeholders.lastName', 'Enter last name')",
  '"your.email@example.com"': "t('placeholders.email', 'your.email@example.com')",
  '"Enter your email"': "t('placeholders.email', 'Enter your email')",
  '"10-digit mobile number"': "t('placeholders.phone', '10-digit mobile number')",
  '"Enter your phone number"': "t('placeholders.phone', 'Enter your phone number')",
  '"+91 98765 43210"': "t('placeholders.phone', '+91 98765 43210')",
  '"Enter your city"': "t('placeholders.city', 'Enter your city')",
  '"Select state"': "t('placeholders.state', 'Select state')",
  '"Select your state"': "t('placeholders.state', 'Select your state')",
  '"6-digit PIN code"': "t('placeholders.pincode', '6-digit PIN code')",
  '"Enter 6-digit PIN code"': "t('placeholders.pincode', 'Enter 6-digit PIN code')",
  
  // Investment options
  '"₹2-3 Lakhs"': "t('options.investment.2to3', '₹2-3 Lakhs')",
  '"₹3-4 Lakhs"': "t('options.investment.3to4', '₹3-4 Lakhs')",
  '"₹4-5 Lakhs"': "t('options.investment.4to5', '₹4-5 Lakhs')",
  '"₹5-10 Lakhs"': "t('options.investment.5to10', '₹5-10 Lakhs')",
  '"₹10-15 Lakhs"': "t('options.investment.10to15', '₹10-15 Lakhs')",
  '"₹15-25 Lakhs"': "t('options.investment.15to25', '₹15-25 Lakhs')",
  '"₹10-25 Lakhs"': "t('options.investment.10to25', '₹10-25 Lakhs')",
  '"₹25+ Lakhs"': "t('options.investment.above25', '₹25+ Lakhs')",
  
  // Buttons
  '"Submit"': "t('buttons.submit', 'Submit')",
  '"Submit Form"': "t('buttons.submit', 'Submit Form')",
  '"Submit Application"': "t('buttons.submit', 'Submit Application')",
  '"Send Message"': "t('buttons.send', 'Send Message')",
  '"Apply Now"': "t('buttons.apply', 'Apply Now')",
  '"Get Started"': "t('buttons.getStarted', 'Get Started')",
  '"Learn More"': "t('buttons.learnMore', 'Learn More')",
  '"Contact Us"': "t('buttons.contact', 'Contact Us')",
  
  // Common text
  '"Required"': "t('validation.required', 'Required')",
  '"Optional"': "t('validation.optional', 'Optional')",
  '"Loading..."': "t('common.loading', 'Loading...')",
  '"Please wait..."': "t('common.pleaseWait', 'Please wait...')",
  
  // Time periods  
  '"Month"': "t('time.month', 'Month')",
  '"Year"': "t('time.year', 'Year')",
  '"Immediately"': "t('time.immediately', 'Immediately')",
  '"Within 1 month"': "t('time.within1Month', 'Within 1 month')",
  '"2-3 months"': "t('time.2to3Months', '2-3 months')",
  '"3-6 months"': "t('time.3to6Months', '3-6 months')",
};

// Function to fix component files
function fixComponent(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = 0;
  
  // Check if useTranslation is imported
  const hasTranslationImport = content.includes("import { useTranslation } from 'react-i18next'");
  
  if (!hasTranslationImport) {
    // Add import at the top
    const importIndex = content.indexOf('import');
    if (importIndex !== -1) {
      const firstImportEnd = content.indexOf('\n', importIndex);
      content = content.slice(0, firstImportEnd + 1) + 
                "import { useTranslation } from 'react-i18next';\n" + 
                content.slice(firstImportEnd + 1);
      changesMade++;
    }
  }
  
  // Check if t function is initialized
  const componentMatch = content.match(/const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/);
  if (componentMatch && !content.includes('const { t } = useTranslation')) {
    const componentStart = componentMatch.index + componentMatch[0].length;
    content = content.slice(0, componentStart) + 
              "\n  const { t } = useTranslation('forms');" + 
              content.slice(componentStart);
    changesMade++;
  }
  
  // Replace hardcoded text with translations
  for (const [hardcoded, translation] of Object.entries(textToTranslationMap)) {
    // For JSX text content
    const jsxPattern = new RegExp(`>\\s*${hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*<`, 'g');
    if (jsxPattern.test(content)) {
      content = content.replace(jsxPattern, `>{${translation}}<`);
      changesMade++;
    }
    
    // For placeholder attributes
    const placeholderPattern = new RegExp(`placeholder=\\s*${hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (placeholderPattern.test(content)) {
      content = content.replace(placeholderPattern, `placeholder={${translation}}`);
      changesMade++;
    }
    
    // For value attributes
    const valuePattern = new RegExp(`value=\\s*${hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (valuePattern.test(content)) {
      content = content.replace(valuePattern, `value={${translation}}`);
      changesMade++;
    }
    
    // For title props
    const titlePattern = new RegExp(`title:\\s*${hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (titlePattern.test(content)) {
      content = content.replace(titlePattern, `title: ${translation}`);
      changesMade++;
    }
    
    // For description props
    const descPattern = new RegExp(`description:\\s*${hardcoded.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g');
    if (descPattern.test(content)) {
      content = content.replace(descPattern, `description: ${translation}`);
      changesMade++;
    }
  }
  
  if (changesMade > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  return changesMade;
}

// Get all component files
const srcDir = path.join(process.cwd(), 'src');
const componentFiles = [];

function findComponents(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules')) {
      findComponents(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx')) {
      componentFiles.push(filePath);
    }
  }
}

findComponents(srcDir);

// Fix all components
let totalChanges = 0;
const fixedFiles = [];

for (const file of componentFiles) {
  const changes = fixComponent(file);
  if (changes > 0) {
    totalChanges += changes;
    fixedFiles.push(path.relative(process.cwd(), file));
    console.log(`✅ Fixed ${path.basename(file)}: ${changes} changes`);
  }
}

console.log('\n' + '=' . repeat(80));
console.log(`\n✅ RENDERING FIX COMPLETE!\n`);
console.log(`Total files fixed: ${fixedFiles.length}`);
console.log(`Total changes made: ${totalChanges}`);

if (fixedFiles.length > 0) {
  console.log('\nFixed files:');
  fixedFiles.forEach(file => console.log(`  - ${file}`));
}

console.log('\n📝 Next steps:');
console.log('1. Test the website by switching languages');
console.log('2. Verify all text changes with the selected language');
console.log('3. Check console for any missing translation warnings');