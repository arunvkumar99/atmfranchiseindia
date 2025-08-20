/**
 * Arjun - Senior Full Stack Developer
 * Task: Extract hardcoded text from form components
 * Target: AgentFormEnhanced.tsx, AgentFormSinglePage.tsx
 */

const fs = require('fs');
const path = require('path');

console.log('Arjun: Starting extraction of hardcoded text from form components...\n');

const extractedTexts = {
  AgentFormEnhanced: {
    labels: {},
    placeholders: {},
    buttons: {},
    messages: {},
    validations: {}
  },
  AgentFormSinglePage: {
    labels: {},
    placeholders: {},
    buttons: {},
    messages: {},
    validations: {}
  }
};

// Files to process
const files = [
  {
    name: 'AgentFormEnhanced',
    path: 'src/components/AgentFormEnhanced.tsx'
  },
  {
    name: 'AgentFormSinglePage', 
    path: 'src/components/AgentFormSinglePage.tsx'
  }
];

files.forEach(file => {
  const filePath = path.join(__dirname, '..', file.path);
  console.log(`Processing ${file.name}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`  File not found: ${file.path}`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract labels
  const labelMatches = content.match(/<Label[^>]*>([^<]+)<\/Label>/g) || [];
  labelMatches.forEach((match, i) => {
    const text = match.replace(/<\/?Label[^>]*>/g, '').trim();
    if (text && !/^{.*}$/.test(text) && !text.includes('t(')) {
      const key = text.toLowerCase().replace(/[^a-z0-9]/g, '_');
      extractedTexts[file.name].labels[key] = text;
    }
  });
  
  // Extract placeholders
  const placeholderMatches = content.match(/placeholder="([^"]+)"/g) || [];
  placeholderMatches.forEach(match => {
    const text = match.match(/placeholder="([^"]+)"/)[1];
    if (!text.includes('t(') && !text.includes('{')) {
      const key = text.toLowerCase().replace(/[^a-z0-9]/g, '_');
      extractedTexts[file.name].placeholders[key] = text;
    }
  });
  
  // Extract button text
  const buttonMatches = content.match(/<Button[^>]*>([^<]+)<\/Button>/g) || [];
  buttonMatches.forEach(match => {
    const text = match.replace(/<\/?Button[^>]*>/g, '').trim();
    if (text && !/^{.*}$/.test(text) && !text.includes('t(')) {
      const key = text.toLowerCase().replace(/[^a-z0-9]/g, '_');
      extractedTexts[file.name].buttons[key] = text;
    }
  });
  
  // Extract error messages and validations
  const errorMatches = content.match(/"([A-Z][^"]+)"/g) || [];
  errorMatches.forEach(match => {
    const text = match.replace(/"/g, '');
    // Filter for likely error messages
    if (text.includes('required') || text.includes('must') || text.includes('Please') || 
        text.includes('Invalid') || text.includes('should')) {
      const key = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
      extractedTexts[file.name].validations[key] = text;
    }
  });
  
  // Extract hardcoded text in JSX
  const jsxTextMatches = content.match(/>([A-Z][a-zA-Z\s]+)</g) || [];
  jsxTextMatches.forEach(match => {
    const text = match.replace(/[><]/g, '').trim();
    if (text.length > 2 && !text.includes('{') && !text.includes('t(')) {
      const key = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 30);
      extractedTexts[file.name].messages[key] = text;
    }
  });
  
  // Count and report
  const counts = {
    labels: Object.keys(extractedTexts[file.name].labels).length,
    placeholders: Object.keys(extractedTexts[file.name].placeholders).length,
    buttons: Object.keys(extractedTexts[file.name].buttons).length,
    messages: Object.keys(extractedTexts[file.name].messages).length,
    validations: Object.keys(extractedTexts[file.name].validations).length
  };
  
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  
  console.log(`  Found ${total} hardcoded strings:`);
  console.log(`    - Labels: ${counts.labels}`);
  console.log(`    - Placeholders: ${counts.placeholders}`);
  console.log(`    - Buttons: ${counts.buttons}`);
  console.log(`    - Messages: ${counts.messages}`);
  console.log(`    - Validations: ${counts.validations}`);
});

// Save extracted texts
const outputPath = path.join(__dirname, '..', 'extracted-texts-arjun.json');
fs.writeFileSync(outputPath, JSON.stringify(extractedTexts, null, 2));

console.log('\nArjun: Extraction complete. Results saved to extracted-texts-arjun.json');
console.log('Total components processed: 2');

// Create replacement script
const replacementScript = `
// Arjun: Replacement script for hardcoded texts
// This will be used in the next phase

const replacements = ${JSON.stringify(extractedTexts, null, 2)};

module.exports = { replacements };
`;

fs.writeFileSync(
  path.join(__dirname, '..', 'arjun-replacements.js'),
  replacementScript
);

console.log('\nArjun: Ready for Priya to design the key structure.');