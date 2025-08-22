const fs = require('fs');
const path = require('path');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

// Telugu translations for common terms
const teluguTranslations = {
  // Buttons
  "continue": "కొనసాగించండి",
  "add": "జోడించండి",
  "finish": "పూర్తి చేయండి",
  "submitForm": "ఫారం సమర్పించండి",
  "submitEnquiry": "విచారణ సమర్పించండి",
  "getStarted": "ప్రారంభించండి",
  "learnMore": "మరింత తెలుసుకోండి",
  "viewAll": "అన్నీ చూడండి",
  "readMore": "మరింత చదవండి",
  "download": "డౌన్‌లోడ్ చేయండి",
  "upload": "అప్‌లోడ్ చేయండి",
  "search": "వెతుకు",
  "filter": "ఫిల్టర్",
  "sort": "క్రమబద్ధీకరించు",
  "refresh": "రిఫ్రెష్",
  
  // Common phrases
  "welcomeMessage": "ATM ఫ్రాంచైజ్ ఇండియాకు స్వాగతం",
  "loading": "లోడ్ అవుతోంది...",
  "error": "లోపం",
  "success": "విజయవంతం",
  "warning": "హెచ్చరిక",
  "info": "సమాచారం",
  "confirm": "నిర్ధారించండి",
  "yes": "అవును",
  "no": "కాదు",
  "ok": "సరే",
  "cancel": "రద్దు చేయి",
  "save": "సేవ్ చేయండి",
  "delete": "తొలగించు",
  "edit": "సవరించు",
  "update": "నవీకరించు",
  "create": "సృష్టించు",
  "select": "ఎంచుకోండి",
  "choose": "ఎంచుకోండి",
  "browse": "బ్రౌజ్ చేయండి",
  
  // Form fields
  "name": "పేరు",
  "email": "ఇమెయిల్",
  "phone": "ఫోన్",
  "mobile": "మొబైల్",
  "address": "చిరునామా",
  "city": "నగరం",
  "state": "రాష్ట్రం",
  "pincode": "పిన్‌కోడ్",
  "country": "దేశం",
  "message": "సందేశం",
  "subject": "విషయం",
  "description": "వివరణ",
  "comments": "వ్యాఖ్యలు",
  "feedback": "అభిప్రాయం",
  
  // Business terms
  "franchise": "ఫ్రాంచైజ్",
  "agent": "ఏజెంట్",
  "partner": "భాగస్వామి",
  "investment": "పెట్టుబడి",
  "income": "ఆదాయం",
  "profit": "లాభం",
  "business": "వ్యాపారం",
  "opportunity": "అవకాశం",
  "growth": "వృద్ధి",
  "success": "విజయం",
  "support": "మద్దతు",
  "training": "శిక్షణ",
  "documentation": "డాక్యుమెంటేషన్",
  "application": "దరఖాస్తు",
  "approval": "ఆమోదం",
  "verification": "ధృవీకరణ",
  "payment": "చెల్లింపు",
  "transaction": "లావాదేవీ",
  "commission": "కమిషన్",
  "revenue": "రాబడి"
};

// Hindi text patterns that need to be replaced
const hindiPatterns = [
  /[\u0900-\u097F]+/g  // Hindi Unicode range
];

// English phrases that need translation
const englishPhrases = {
  "Continue": "కొనసాగించండి",
  "Add": "జోడించండి",
  "Finish": "పూర్తి చేయండి",
  "Submit Form": "ఫారం సమర్పించండి",
  "Submit Enquiry": "విచారణ సమర్పించండి",
  "Get Started": "ప్రారంభించండి",
  "Learn More": "మరింత తెలుసుకోండి",
  "View All": "అన్నీ చూడండి",
  "Read More": "మరింత చదవండి",
  "Click Here": "ఇక్కడ క్లిక్ చేయండి",
  "Sign Up": "సైన్ అప్ చేయండి",
  "Register Now": "ఇప్పుడు నమోదు చేసుకోండి",
  "Contact Us": "మమ్మల్ని సంప్రదించండి",
  "About Us": "మా గురించి",
  "Our Services": "మా సేవలు",
  "Our Products": "మా ఉత్పత్తులు",
  "Terms and Conditions": "నిబంధనలు మరియు షరతులు",
  "Privacy Policy": "గోప్యతా విధానం",
  "All Rights Reserved": "అన్ని హక్కులు రిజర్వు చేయబడ్డాయి"
};

class TeluguTranslationCompleter {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.teluguDir = path.join(this.baseDir, 'public', 'locales', 'te');
    this.englishDir = path.join(this.baseDir, 'public', 'locales', 'en');
    this.hindiDir = path.join(this.baseDir, 'public', 'locales', 'hi');
    this.issues = [];
    this.fixes = [];
  }

  log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  analyzeFile(filePath, fileName) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      const issues = {
        file: fileName,
        englishText: [],
        hindiText: [],
        missingTranslations: [],
        emptyValues: []
      };

      const checkValue = (value, key, path = '') => {
        if (typeof value === 'string') {
          // Check for English text (excluding brand names and technical terms)
          if (/^[A-Za-z\s]+$/.test(value) && 
              !['ATM', 'PixellPay', 'FAQ', 'ID', 'URL', 'API'].includes(value) &&
              value.length > 2) {
            issues.englishText.push({ path: path || key, value });
          }
          
          // Check for Hindi text
          if (hindiPatterns.some(pattern => pattern.test(value))) {
            issues.hindiText.push({ path: path || key, value });
          }
          
          // Check for empty values
          if (value.trim() === '') {
            issues.emptyValues.push({ path: path || key });
          }
        } else if (typeof value === 'object' && value !== null) {
          Object.keys(value).forEach(subKey => {
            checkValue(value[subKey], subKey, path ? `${path}.${subKey}` : `${key}.${subKey}`);
          });
        }
      };

      Object.keys(data).forEach(key => {
        checkValue(data[key], key);
      });

      return issues;
    } catch (error) {
      this.log(`Error analyzing ${fileName}: ${error.message}`, 'red');
      return null;
    }
  }

  fixTranslations(filePath, fileName) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let data = JSON.parse(content);
      let changesMade = false;

      const fixValue = (obj, key, path = '') => {
        const value = obj[key];
        
        if (typeof value === 'string') {
          let newValue = value;
          
          // Replace English phrases
          Object.keys(englishPhrases).forEach(englishPhrase => {
            if (newValue.toLowerCase() === englishPhrase.toLowerCase()) {
              newValue = englishPhrases[englishPhrase];
              changesMade = true;
            }
          });
          
          // Replace common English words
          Object.keys(teluguTranslations).forEach(englishWord => {
            const regex = new RegExp(`\\b${englishWord}\\b`, 'gi');
            if (regex.test(newValue)) {
              newValue = newValue.replace(regex, teluguTranslations[englishWord]);
              changesMade = true;
            }
          });
          
          // Remove Hindi text and replace with Telugu
          if (hindiPatterns.some(pattern => pattern.test(newValue))) {
            // Try to find corresponding Telugu translation
            if (newValue === "फॉर्म जमा करें") {
              newValue = "ఫారం సమర్పించండి";
              changesMade = true;
            } else if (newValue === "पूछताछ जमा करें") {
              newValue = "విచారణ సమర్పించండి";
              changesMade = true;
            }
            // Add more Hindi to Telugu mappings as needed
          }
          
          obj[key] = newValue;
        } else if (typeof value === 'object' && value !== null) {
          Object.keys(value).forEach(subKey => {
            fixValue(value, subKey, path ? `${path}.${subKey}` : `${key}.${subKey}`);
          });
        }
      };

      Object.keys(data).forEach(key => {
        fixValue(data, key);
      });

      if (changesMade) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        this.fixes.push({ file: fileName, status: 'fixed' });
        return true;
      }
      
      return false;
    } catch (error) {
      this.log(`Error fixing ${fileName}: ${error.message}`, 'red');
      return false;
    }
  }

  ensureCompleteness() {
    // Get list of English files
    const englishFiles = fs.readdirSync(this.englishDir).filter(f => f.endsWith('.json'));
    const teluguFiles = fs.readdirSync(this.teluguDir).filter(f => f.endsWith('.json'));
    
    // Check for missing files
    const missingFiles = englishFiles.filter(f => !teluguFiles.includes(f));
    
    if (missingFiles.length > 0) {
      this.log(`Missing Telugu files: ${missingFiles.join(', ')}`, 'yellow');
      
      // Copy missing files from Hindi (as it's 100% complete)
      missingFiles.forEach(file => {
        const hindiPath = path.join(this.hindiDir, file);
        const teluguPath = path.join(this.teluguDir, file);
        
        if (fs.existsSync(hindiPath)) {
          let content = fs.readFileSync(hindiPath, 'utf8');
          // This would need actual translation - for now, copying structure
          fs.writeFileSync(teluguPath, content, 'utf8');
          this.log(`Created ${file} (needs translation)`, 'cyan');
        }
      });
    }
    
    // Check for extra files in Telugu
    const extraFiles = teluguFiles.filter(f => !englishFiles.includes(f) && 
                                           f !== 'testimonials.json' && 
                                           f !== 'refund-complete.json');
    
    if (extraFiles.length > 0) {
      this.log(`Extra Telugu files (not in English): ${extraFiles.join(', ')}`, 'yellow');
    }
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      language: 'Telugu (te)',
      totalFiles: 0,
      filesWithIssues: 0,
      filesFixed: 0,
      detailedIssues: [],
      summary: {
        englishTextInstances: 0,
        hindiTextInstances: 0,
        emptyValues: 0,
        totalIssues: 0
      }
    };

    this.issues.forEach(issue => {
      if (issue) {
        report.totalFiles++;
        const hasIssues = issue.englishText.length > 0 || 
                         issue.hindiText.length > 0 || 
                         issue.emptyValues.length > 0;
        
        if (hasIssues) {
          report.filesWithIssues++;
          report.detailedIssues.push(issue);
          report.summary.englishTextInstances += issue.englishText.length;
          report.summary.hindiTextInstances += issue.hindiText.length;
          report.summary.emptyValues += issue.emptyValues.length;
        }
      }
    });

    report.summary.totalIssues = report.summary.englishTextInstances + 
                                 report.summary.hindiTextInstances + 
                                 report.summary.emptyValues;
    
    report.filesFixed = this.fixes.length;

    return report;
  }

  async run() {
    this.log('\\n=== Telugu Translation 100% Coverage Script ===\\n', 'cyan');
    
    // Step 1: Ensure all files exist
    this.log('Step 1: Checking file completeness...', 'blue');
    this.ensureCompleteness();
    
    // Step 2: Analyze all Telugu files
    this.log('\\nStep 2: Analyzing Telugu translation files...', 'blue');
    const files = fs.readdirSync(this.teluguDir).filter(f => f.endsWith('.json'));
    
    files.forEach(file => {
      const filePath = path.join(this.teluguDir, file);
      const issues = this.analyzeFile(filePath, file);
      if (issues) {
        this.issues.push(issues);
      }
    });
    
    // Step 3: Fix identified issues
    this.log('\\nStep 3: Fixing identified issues...', 'blue');
    files.forEach(file => {
      const filePath = path.join(this.teluguDir, file);
      const fixed = this.fixTranslations(filePath, file);
      if (fixed) {
        this.log(`  ✓ Fixed: ${file}`, 'green');
      }
    });
    
    // Step 4: Generate report
    this.log('\\nStep 4: Generating report...', 'blue');
    const report = this.generateReport();
    
    // Save report
    const reportPath = path.join(this.baseDir, 'telugu-100-coverage-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    // Display summary
    this.log('\\n=== Summary ===', 'cyan');
    this.log(`Total files analyzed: ${report.totalFiles}`, 'white');
    this.log(`Files with issues: ${report.filesWithIssues}`, report.filesWithIssues > 0 ? 'yellow' : 'green');
    this.log(`Files fixed: ${report.filesFixed}`, 'green');
    this.log(`\\nIssue breakdown:`, 'white');
    this.log(`  - English text instances: ${report.summary.englishTextInstances}`, 'yellow');
    this.log(`  - Hindi text instances: ${report.summary.hindiTextInstances}`, 'yellow');
    this.log(`  - Empty values: ${report.summary.emptyValues}`, 'yellow');
    this.log(`\\nReport saved to: ${reportPath}`, 'green');
    
    if (report.summary.totalIssues > 0) {
      this.log('\\n⚠️  Manual review required for complete translation', 'yellow');
      this.log('Please review the report and complete remaining translations manually.', 'yellow');
    } else {
      this.log('\\n✅ Telugu translation appears to be complete!', 'green');
    }
  }
}

// Run the script
const completer = new TeluguTranslationCompleter();
completer.run().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});