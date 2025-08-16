// Utility to extract Google Form field IDs from the form URL
// Run this in browser console when viewing the Google Form to get field IDs

export const extractGoogleFormFields = () => {
  console.log('🔍 Extracting Google Form field IDs...');
  
  // This function should be run in the browser console on the Google Form page
  const fields: { [key: string]: string } = {};
  
  // Find all input elements in the form
  const inputs = document.querySelectorAll('input[name^="entry."], textarea[name^="entry."]');
  
  inputs.forEach((input, index) => {
    const name = input.getAttribute('name');
    const label = input.closest('[data-params]')?.querySelector('[aria-label]')?.getAttribute('aria-label') || 
                  input.closest('.freebirdFormviewerViewItemsItemItem')?.querySelector('.freebirdFormviewerViewItemsItemItemTitle')?.textContent ||
                  `Field ${index + 1}`;
    
    if (name) {
      fields[label] = name;
      console.log(`📝 Found field: "${label}" -> ${name}`);
    }
  });
  
  console.log('✅ All fields extracted:', fields);
  return fields;
};

// For your Google Form, these are the expected field mappings
// You'll need to update these with actual field IDs from your form
export const GOOGLE_FORM_FIELDS = {
  // These will be updated once we get the actual field IDs
  name: 'entry.123456789',     // Replace with actual field ID
  email: 'entry.987654321',    // Replace with actual field ID  
  phone: 'entry.456789123',    // Replace with actual field ID
  subject: 'entry.789123456',  // Replace with actual field ID
  message: 'entry.321654987'   // Replace with actual field ID
};

// Instructions for getting the actual field IDs:
export const getFieldIDInstructions = () => {
  return `
  To get the actual Google Form field IDs:
  
  1. Open your Google Form: https://docs.google.com/forms/d/e/1FAIpQLScFgkgbj_EYnxtjhXZNRuBG7VFh20zDKn3MmR1xTlG1BaKOFQ/viewform
  
  2. Right-click on the page and select "Inspect" or press F12
  
  3. In the console, paste this code and press Enter:
  
  const fields = {};
  document.querySelectorAll('input[name^="entry."], textarea[name^="entry."]').forEach((input, index) => {
    const name = input.getAttribute('name');
    const label = input.closest('[data-params]')?.querySelector('[aria-label]')?.getAttribute('aria-label') || 
                  input.closest('.freebirdFormviewerViewItemsItemItem')?.querySelector('.freebirdFormviewerViewItemsItemItemTitle')?.textContent ||
                  'Field ' + (index + 1);
    if (name) {
      fields[label.trim()] = name;
      console.log('Found field: "' + label.trim() + '" -> ' + name);
    }
  });
  console.log('All fields:', fields);
  
  4. Copy the field IDs from the console output and share them with me
  `;
};

console.log(getFieldIDInstructions());