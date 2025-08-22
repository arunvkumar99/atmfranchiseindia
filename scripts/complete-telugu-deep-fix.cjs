const fs = require('fs');
const path = require('path');

// Comprehensive Telugu translations
const teluguTranslations = {
  // Navigation and UI
  "Our Expertise": "మా నైపుణ్యం",
  "Group Companies": "గ్రూప్ కంపెనీలు",
  "Payment Solutions": "చెల్లింపు పరిష్కారాలు",
  "Visit PixellPay": "PixellPay సందర్శించండి",
  "Visit Evosyz": "Evosyz సందర్శించండి",
  "National Coverage": "జాతీయ కవరేజ్",
  "TATA Group Product": "టాటా గ్రూప్ ఉత్పత్తి",
  "Digital Ecosystem Leader": "డిజిటల్ ఎకోసిస్టమ్ నాయకుడు",
  
  // Business terms
  "Simplify Process": "ప్రక్రియను సులభతరం చేయండి",
  "Transparency": "పారదర్శకత",
  "Integrity": "సమగ్రత",
  "Excellence": "శ్రేష్ఠత",
  "Innovation": "నవీనత",
  "Complete transparency in all business dealings": "అన్ని వ్యాపార లావాదేవీలలో పూర్తి పారదర్శకత",
  "Honest and ethical business practices": "నిజాయితీ మరియు నైతిక వ్యాపార పద్ధతులు",
  "Commitment to service excellence": "సేవా శ్రేష్ఠతకు నిబద్ధత",
  "Comprehensive training programs and ongoing operational support": "సమగ్ర శిక్షణా కార్యక్రమాలు మరియు కొనసాగుతున్న కార్యాచరణ మద్దతు",
  "Part of a trusted business ecosystem": "విశ్వసనీయ వ్యాపార వ్యవస్థలో భాగం",
  "Financial technology solutions and payment services": "ఆర్థిక సాంకేతిక పరిష్కారాలు మరియు చెల్లింపు సేవలు",
  "Offer ongoing guidance from setup to successful operation": "సెటప్ నుండి విజయవంతమైన ఆపరేషన్ వరకు కొనసాగుతున్న మార్గదర్శకత్వం అందించండి",
  
  // Common actions
  "Submit": "సమర్పించండి",
  "Cancel": "రద్దు చేయండి",
  "Save": "సేవ్ చేయండి",
  "Delete": "తొలగించు",
  "Edit": "సవరించు",
  "Next": "తదుపరి",
  "Previous": "మునుపటి",
  "Close": "మూసివేయి",
  "Confirm": "నిర్ధారించండి",
  "Continue": "కొనసాగించండి",
  "Add": "జోడించండి",
  "Finish": "పూర్తి చేయండి",
  "Failed": "విఫలమైంది",
  "Export": "ఎగుమతి",
  "Import": "దిగుమతి",
  "Preview": "పూర్వావలోకనం",
  "Menu": "మెను",
  "I Disagree": "నేను అంగీకరించను",
  
  // Forms and validation
  "Minimum {{count}} characters required": "కనీసం {{count}} అక్షరాలు అవసరం",
  "Maximum {{count}} characters allowed": "గరిష్టంగా {{count}} అక్షరాలు అనుమతించబడ్డాయి",
  "{{count}} results found": "{{count}} ఫలితాలు కనుగొనబడ్డాయి",
  "Showing {{from}} to {{to}} of {{total}} results": "{{total}} ఫలితాలలో {{from}} నుండి {{to}} వరకు చూపిస్తోంది",
  
  // Status messages
  "An error occurred": "ఒక లోపం సంభవించింది",
  "Success": "విజయం",
  "Loading": "లోడ్ అవుతోంది",
  "Processing": "ప్రాసెస్ చేస్తోంది",
  
  // Technology terms (keep in English but add Telugu context)
  "Expert Team": "నిపుణుల బృందం",
  "Experienced professionals with deep industry knowledge": "లోతైన పరిశ్రమ జ్ఞానంతో అనుభవజ్ఞులైన నిపుణులు",
  "Proven Results": "నిరూపితమైన ఫలితాలు",
  "Trusted Guidance": "విశ్వసనీయ మార్గదర్శకత్వం",
  "Transparent Business Model": "పారదర్శక వ్యాపార మోడల్",
  "Passive Income Generation": "నిష్క్రియ ఆదాయ ఉత్పత్తి",
  "Community Service Opportunity": "కమ్యూనిటీ సేవా అవకాశం",
  "Trusted": "విశ్వసనీయ",
  "Verified Partners": "ధృవీకరించబడిన భాగస్వాములు",
  "All our WLA partners are RBI-approved and have proven track records": "మా WLA భాగస్వాములందరూ RBI-ఆమోదించబడ్డారు మరియు నిరూపితమైన ట్రాక్ రికార్డులను కలిగి ఉన్నారు",
  "Growth Opportunities": "వృద్ధి అవకాశాలు",
  "Access to diverse markets and expansion opportunities across India": "భారతదేశం అంతటా విభిన్న మార్కెట్లు మరియు విస్తరణ అవకాశాలకు ప్రాప్యత",
  "Technology Excellence": "సాంకేతిక శ్రేష్ఠత",
  "Latest ATM technology and digital banking solutions for competitive advantage": "పోటీ ప్రయోజనం కోసం తాజా ATM సాంకేతికత మరియు డిజిటల్ బ్యాంకింగ్ పరిష్కారాలు",
  "Empowering Young Entrepreneurs": "యువ వ్యవసాయవేత్తలకు సాధికారత"
};

// Hindi to Telugu translations
const hindiToTelugu = {
  // Common Hindi phrases found in files
  "फॉर्म जमा करें": "ఫారం సమర్పించండి",
  "पूछताछ जमा करें": "విచారణ సమర్పించండి",
  "खोजें": "వెతకండి",
  "संपर्क करें": "సంప్రదించండి",
  "अभी जुड़ें": "ఇప్పుడు చేరండి",
  "पूरा नाम": "పూర్తి పేరు",
  "पहला नाम": "మొదటి పేరు",
  "अंतिम नाम": "చివరి పేరు",
  "फोन नंबर": "ఫోన్ నంబర్",
  "पिन कोड": "పిన్ కోడ్",
  "देश": "దేశం",
  "निवेश राशि": "పెట్టుబడి మొత్తం",
  "अनुभव": "అనుభవం",
  "अपना नाम दर्ज करें": "మీ పేరు నమోదు చేయండి",
  "अपना ईमेल दर्ज करें": "మీ ఇమెయిల్ నమోదు చేయండి",
  "अपना फोन नंबर दर्ज करें": "మీ ఫోన్ నంబర్ నమోదు చేయండి",
  "अपना संदेश दर्ज करें": "మీ సందేశాన్ని నమోదు చేయండి",
  "राज्य चुनें": "రాష్ట్రం ఎంచుకోండి",
  "शहर चुनें": "నగరం ఎంచుకోండి",
  "यह फ़ील्ड आवश्यक है": "ఈ ఫీల్డ్ తప్పనిసరి",
  "अमान्य ईमेल पता": "చెల్లని ఇమెయిల్ చిరునామా",
  "अमान्य फोन नंबर": "చెల్లని ఫోన్ నంబర్",
  "न्यूनतम {{min}} अक्षर आवश्यक": "కనీసం {{min}} అక్షరాలు అవసరం",
  "अधिकतम {{max}} अक्षर अनुमत": "గరిష్టంగా {{max}} అక్షరాలు అనుమతించబడ్డాయి",
  "सफलतापूर्वक जमा किया गया": "విజయవంతంగా సమర్పించబడింది",
  "धन्यवाद! हम जल्द ही संपर्क करेंगे": "ధన్యవాదాలు! మేము త్వరలో సంప్రదిస్తాము",
  "पहुंच विवरण": "యాక్సెస్ వివరాలు",
  "विश्वसनीय व्यावसायिक भागीदार": "విశ్వసనీయ వ్యాపార భాగస్వామి",
  "पारदर्शी एटीएम फ्रैंचाइज़ी अवसरों के साथ ग्रामीण उद्यमियों को सशक्त बनाना": "పారదర్శక ATM ఫ్రాంచైజీ అవకాశాలతో గ్రామీణ వ్యవసాయవేత్తలకు సాధికారత",
  "मुख्य पृष्ठ": "ముఖ్య పేజీ",
  "हिंदी": "హిందీ",
  "फ्रैंचाइज़ी": "ఫ్రాంచైజీ",
  "सुरक्षित": "సురక్షితం",
  "प्रतिक्रिया": "ప్రతిస్పందన",
  "खुश ग्राहक": "సంతోషకరమైన కస్టమర్లు"
};

class TeluguDeepFixer {
  constructor() {
    this.baseDir = path.join(__dirname, '..');
    this.teluguDir = path.join(this.baseDir, 'public', 'locales', 'te');
    this.englishDir = path.join(this.baseDir, 'public', 'locales', 'en');
    this.fixedFiles = [];
    this.remainingIssues = [];
  }

  log(message, color = 'reset') {
    const colors = {
      reset: '\x1b[0m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      cyan: '\x1b[36m'
    };
    console.log(`${colors[color]}${message}${colors.reset}`);
  }

  deepTranslate(value) {
    if (typeof value !== 'string') return value;
    
    let translated = value;
    
    // First, check if the entire string matches a translation
    if (teluguTranslations[value]) {
      return teluguTranslations[value];
    }
    
    // Check Hindi to Telugu translations
    Object.keys(hindiToTelugu).forEach(hindi => {
      if (translated.includes(hindi)) {
        translated = translated.replace(new RegExp(hindi, 'g'), hindiToTelugu[hindi]);
      }
    });
    
    // Check for English phrases that need translation
    Object.keys(teluguTranslations).forEach(english => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      if (regex.test(translated)) {
        translated = translated.replace(regex, teluguTranslations[english]);
      }
    });
    
    // Remove any [TE] prefixes (these might be markers from previous attempts)
    translated = translated.replace(/^\[TE\]\s*/g, '');
    
    return translated;
  }

  processObject(obj, path = '') {
    const processed = {};
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        const currentPath = path ? `${path}.${key}` : key;
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          processed[key] = this.processObject(value, currentPath);
        } else if (typeof value === 'string') {
          const translated = this.deepTranslate(value);
          
          // Check if translation actually happened
          if (translated !== value) {
            this.log(`  Translated: ${currentPath}`, 'green');
            this.log(`    From: ${value}`, 'yellow');
            this.log(`    To: ${translated}`, 'cyan');
          }
          
          processed[key] = translated;
        } else {
          processed[key] = value;
        }
      }
    }
    
    return processed;
  }

  fixFile(fileName) {
    const filePath = path.join(this.teluguDir, fileName);
    
    try {
      this.log(`\\nProcessing: ${fileName}`, 'blue');
      
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      // Process the entire object
      const processed = this.processObject(data);
      
      // Write back the processed data
      fs.writeFileSync(filePath, JSON.stringify(processed, null, 2), 'utf8');
      
      this.fixedFiles.push(fileName);
      this.log(`✓ Completed: ${fileName}`, 'green');
      
      return true;
    } catch (error) {
      this.log(`✗ Error processing ${fileName}: ${error.message}`, 'red');
      this.remainingIssues.push({ file: fileName, error: error.message });
      return false;
    }
  }

  validateFile(fileName) {
    const filePath = path.join(this.teluguDir, fileName);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);
      
      let hasIssues = false;
      const issues = [];
      
      const checkForIssues = (obj, path = '') => {
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            const currentPath = path ? `${path}.${key}` : key;
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              checkForIssues(value, currentPath);
            } else if (typeof value === 'string') {
              // Check for Hindi text
              if (/[\u0900-\u097F]/.test(value)) {
                issues.push({ type: 'hindi', path: currentPath, value });
                hasIssues = true;
              }
              
              // Check for untranslated English (excluding technical terms)
              const technicalTerms = ['ATM', 'RBI', 'WLA', 'PixellPay', 'Evosyz', 'API', 'URL', 'ID', 'FAQ', 'ROI'];
              const cleanValue = value.replace(new RegExp(technicalTerms.join('|'), 'g'), '');
              
              if (/^[A-Za-z\s]+$/.test(cleanValue) && cleanValue.trim().length > 3) {
                issues.push({ type: 'english', path: currentPath, value });
                hasIssues = true;
              }
            }
          }
        }
      };
      
      checkForIssues(data);
      
      if (hasIssues) {
        this.remainingIssues.push({ file: fileName, issues });
      }
      
      return !hasIssues;
    } catch (error) {
      this.log(`Validation error for ${fileName}: ${error.message}`, 'red');
      return false;
    }
  }

  async run() {
    this.log('\\n=== Telugu Deep Translation Fix ===\\n', 'cyan');
    
    // Get all Telugu JSON files
    const files = fs.readdirSync(this.teluguDir).filter(f => f.endsWith('.json'));
    
    this.log(`Found ${files.length} Telugu translation files\\n`, 'blue');
    
    // Process each file
    for (const file of files) {
      this.fixFile(file);
    }
    
    // Validate all files
    this.log('\\n=== Validation Phase ===\\n', 'cyan');
    
    let validFiles = 0;
    for (const file of files) {
      if (this.validateFile(file)) {
        validFiles++;
        this.log(`✓ ${file} - Clean`, 'green');
      } else {
        this.log(`✗ ${file} - Still has issues`, 'yellow');
      }
    }
    
    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      language: 'Telugu (te)',
      totalFiles: files.length,
      filesFixed: this.fixedFiles.length,
      filesValidated: validFiles,
      remainingIssues: this.remainingIssues,
      completionPercentage: Math.round((validFiles / files.length) * 100)
    };
    
    // Save report
    const reportPath = path.join(this.baseDir, 'telugu-deep-fix-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    
    // Display summary
    this.log('\\n=== Summary ===\\n', 'cyan');
    this.log(`Total files: ${report.totalFiles}`, 'blue');
    this.log(`Files fixed: ${report.filesFixed}`, 'green');
    this.log(`Files validated clean: ${report.filesValidated}`, 'green');
    this.log(`Completion: ${report.completionPercentage}%`, report.completionPercentage === 100 ? 'green' : 'yellow');
    this.log(`\\nReport saved to: ${reportPath}`, 'blue');
    
    if (report.remainingIssues.length > 0) {
      this.log('\\n⚠️  Some issues remain. Review the report for details.', 'yellow');
    } else {
      this.log('\\n✅ Telugu translation is now complete!', 'green');
    }
  }
}

// Run the deep fix
const fixer = new TeluguDeepFixer();
fixer.run().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});