const fs = require('fs');
const path = require('path');

const hiDir = path.join('public', 'locales', 'hi');
const files = ['common.json', 'forms.json', 'home.json', 'franchise.json'];

let mixedIssues = [];
const englishWords = [
  'Please', 'Enter', 'Select', 'Choose', 'Submit', 'Your', 'Join', 'Become', 'Start', 'Get', 'Apply', 'Learn', 'Contact', 'Call', 'Email', 'Visit',
  'Years', 'Months', 'Days', 'Hours', 'Minutes', 'Year', 'Month', 'Day', 'Hour', 'Minute',
  'Below', 'Above', 'Within', 'Between', 'From', 'To', 'Or', 'And', 'With', 'For',
  'Account', 'Bank', 'Number', 'Card', 'Type', 'Name', 'Address', 'City', 'State',
  'Business', 'Company', 'Experience', 'Support', 'Service', 'Success', 'Return'
];

files.forEach(file => {
  const filePath = path.join(hiDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(content);
    
    function checkObject(obj, path = '') {
      for (const key in obj) {
        const newPath = path ? `${path}.${key}` : key;
        if (typeof obj[key] === 'string') {
          const value = obj[key];
          // Check if value contains Hindi characters
          if (/[\u0900-\u097F]/.test(value)) {
            // Check for English words
            const foundWords = englishWords.filter(word => {
              const regex = new RegExp(`\\b${word}\\b`, 'i');
              return regex.test(value) && !value.includes('{{');
            });
            
            if (foundWords.length > 0) {
              mixedIssues.push({
                file: file,
                path: newPath,
                value: value.substring(0, 100),
                englishWords: foundWords
              });
            }
          }
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkObject(obj[key], newPath);
        }
      }
    }
    
    checkObject(jsonData);
  }
});

console.log('Mixed Language Issues Found:');
console.log('=============================');
mixedIssues.forEach(issue => {
  console.log(`\n${issue.file} - ${issue.path}`);
  console.log(`  English words: ${issue.englishWords.join(', ')}`);
  console.log(`  Value: "${issue.value}..."`);
});
console.log(`\nTotal issues: ${mixedIssues.length}`);