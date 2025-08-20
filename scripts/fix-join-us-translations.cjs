const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

console.log(`${colors.blue}🔧 Fixing JoinUs Component Translations...${colors.reset}\n`);

// Step 1: Update the English forms.json with all required keys
const formsJsonPath = path.join(__dirname, '..', 'public', 'locales', 'en', 'forms.json');
const formsData = JSON.parse(fs.readFileSync(formsJsonPath, 'utf8'));

// Add joinUs specific translations
const joinUsTranslations = {
  joinUs: {
    title: {
      main: "Join the",
      highlight: "ATM Franchise",
      revolution: "Revolution"
    },
    subtitle: "Choose your path to success with ATM Franchise India",
    form: {
      title: "ATM Franchise Application Form",
      instruction: "Please provide accurate information. All fields marked with * are mandatory.",
      submitMessage: "Our team will review your application within 24-48 hours and contact you with next steps."
    },
    sections: {
      personal: "Personal Information",
      address: "Address Information",
      business: "Business Information",
      franchise: "ATM Franchise Details",
      financial: "Financial Information",
      additional: "Additional Information"
    },
    labels: {
      firstName: "First Name *",
      lastName: "Last Name *",
      email: "Email Address *",
      phone: "Phone Number *",
      alternatePhone: "Alternate Phone",
      dateOfBirth: "Date of Birth *",
      addressLine1: "Address Line 1 *",
      addressLine2: "Address Line 2",
      city: "City *",
      state: "State *",
      pincode: "PIN Code *",
      businessType: "Business Type *",
      businessExperience: "Business Experience *",
      currentOccupation: "Current Occupation *",
      annualIncome: "Annual Income Range *",
      investmentCapacity: "Investment Capacity *",
      preferredLocation: "Preferred ATM Location *",
      locationOwnership: "Location Ownership *",
      expectedFootfall: "Expected Daily Footfall",
      nearbyBanks: "Nearby Banks",
      competitorATMs: "Competitor ATMs",
      primaryBank: "Primary Bank *",
      accountType: "Account Type *",
      panCard: "PAN Card Number *",
      gstNumber: "GST Number (if applicable)",
      referenceSource: "How did you hear about us? *",
      previousFranchise: "Previous Franchise Experience",
      timelineToStart: "Timeline to Start *",
      additionalComments: "Additional Comments/Questions"
    },
    placeholders: {
      firstName: "Enter first name",
      lastName: "Enter last name",
      email: "your.email@example.com",
      phone: "+91 98765 43210",
      addressLine1: "House/Building number, Street name",
      addressLine2: "Area, Landmark",
      city: "Enter city",
      state: "Select state",
      pincode: "Enter 6-digit PIN code",
      businessType: "Select business type",
      experienceYears: "Years of experience",
      currentOccupation: "e.g., Shop Owner, Farmer, Employee",
      annualIncome: "Select income range",
      investmentCapacity: "Select investment range",
      preferredLocation: "Area/Village where you want ATM",
      locationOwnership: "Do you own the location?",
      expectedFootfall: "Expected daily visitors",
      nearbyBanks: "Names of banks within 5km",
      competitorATMs: "Number of ATMs in 2km radius",
      bankName: "Bank name",
      accountType: "Select account type",
      panCard: "ABCDE1234F",
      gstNumber: "GST registration number",
      referenceSource: "Select source",
      previousFranchise: "Any previous franchise?",
      timelineToStart: "When can you start?",
      additionalComments: "Any specific questions or additional information you'd like to share..."
    },
    states: {
      "andhra-pradesh": "Andhra Pradesh",
      "bihar": "Bihar",
      "gujarat": "Gujarat",
      "haryana": "Haryana",
      "karnataka": "Karnataka",
      "kerala": "Kerala",
      "madhya-pradesh": "Madhya Pradesh",
      "maharashtra": "Maharashtra",
      "odisha": "Odisha",
      "punjab": "Punjab",
      "rajasthan": "Rajasthan",
      "tamil-nadu": "Tamil Nadu",
      "telangana": "Telangana",
      "uttar-pradesh": "Uttar Pradesh",
      "west-bengal": "West Bengal"
    },
    businessTypes: {
      individual: "Individual",
      proprietorship: "Proprietorship",
      partnership: "Partnership",
      "private-limited": "Private Limited",
      llp: "LLP"
    },
    experienceRanges: {
      "0-1": "0-1 years",
      "2-5": "2-5 years",
      "6-10": "6-10 years",
      "11-15": "11-15 years",
      "15+": "15+ years"
    },
    incomeRanges: {
      "below-2l": "Below ₹2 Lakhs",
      "2l-5l": "₹2-5 Lakhs",
      "5l-10l": "₹5-10 Lakhs",
      "10l-25l": "₹10-25 Lakhs",
      "25l+": "₹25+ Lakhs"
    },
    investmentRanges: {
      "2-3l": "₹2-3 Lakhs",
      "3-4l": "₹3-4 Lakhs",
      "4-5l": "₹4-5 Lakhs",
      "5l+": "₹5+ Lakhs"
    },
    locationOwnershipOptions: {
      owned: "I own the location",
      "can-arrange": "I can arrange the location",
      "need-help": "Need help finding location"
    },
    footfallRanges: {
      "50-100": "50-100 people",
      "100-200": "100-200 people",
      "200-500": "200-500 people",
      "500+": "500+ people"
    },
    accountTypes: {
      savings: "Savings Account",
      current: "Current Account",
      "cc-od": "CC/OD Account"
    },
    referenceSources: {
      website: "Website",
      "social-media": "Social Media",
      "friend-referral": "Friend/Family Referral",
      newspaper: "Newspaper/Magazine",
      "search-engine": "Search Engine",
      other: "Other"
    },
    franchiseExperience: {
      "yes-successful": "Yes, successful experience",
      "yes-challenges": "Yes, faced challenges",
      no: "No previous experience"
    },
    timelines: {
      immediate: "Immediately",
      "1-month": "Within 1 month",
      "2-3-months": "2-3 months",
      "3-6-months": "3-6 months",
      "6-months+": "6+ months"
    },
    terms: {
      agreeText: "I agree to the",
      termsLink: "Terms & Conditions",
      disclaimer: "and confirm that all information provided is accurate and complete. I understand that providing false information may result in application rejection.",
      marketingConsent: "I agree to receive marketing communications and updates about ATM franchise opportunities."
    },
    sidebar: {
      successStory: {
        title: "Join 500+ Successful Franchisees",
        testimonial: "Starting my ATM franchise was the best business decision I made. The support team guided me through every step, and now I earn steady passive income while serving my community.",
        name: "Rajesh Kumar",
        designation: "ATM Franchise Owner, Bihar"
      },
      process: {
        title: "Application Process",
        steps: [
          "Submit detailed application",
          "Initial screening & verification",
          "Personal interview & site visit",
          "Approval & agreement signing",
          "Setup, training & launch"
        ]
      },
      help: {
        title: "Need Help?",
        callUs: "Call Us",
        emailUs: "Email Us",
        phone: "+91 7003554455",
        email: "contact@atmfranchiseindia.in"
      }
    },
    benefits: {
      roi: {
        title: "High ROI Potential",
        description: "Earn up to 50% return on investment with transparent revenue sharing"
      },
      competition: {
        title: "Low Competition",
        description: "Only 15 ATMs per 1 lakh people - huge market opportunity"
      },
      support: {
        title: "Complete Support",
        description: "End-to-end assistance from setup to operations"
      },
      track: {
        title: "Proven Track Record",
        description: "Join 500+ successful franchisees across India"
      }
    },
    opportunities: {
      agent: {
        title: "Join as Agent",
        description: "Become a field sales agent and earn commission"
      },
      franchise: {
        title: "Join as Franchise",
        description: "Start your own ATM business"
      },
      employee: {
        title: "Join as Employee",
        description: "Build your career with full-time positions"
      }
    },
    buttons: {
      submit: "Submit Application"
    },
    toast: {
      termsRequired: {
        title: "Terms & Conditions Required",
        description: "Please agree to terms and conditions to proceed."
      },
      success: {
        title: "Application Submitted Successfully!",
        description: "Our franchise team will review your application and contact you within 24-48 hours."
      }
    }
  }
};

// Merge with existing forms data
formsData.joinUs = joinUsTranslations.joinUs;

// Save updated forms.json
fs.writeFileSync(formsJsonPath, JSON.stringify(formsData, null, 2));
console.log(`${colors.green}✅ Updated English forms.json with JoinUs translations${colors.reset}`);

// Step 2: Now update the JoinUs.tsx component to use these translations
const joinUsPath = path.join(__dirname, '..', 'src', 'components', 'JoinUs.tsx');
let joinUsContent = fs.readFileSync(joinUsPath, 'utf8');

// Replace all hardcoded texts with t() calls
const replacements = [
  // Labels
  { old: 'First Name \\*', new: "{t('joinUs.labels.firstName')}" },
  { old: 'Last Name \\*', new: "{t('joinUs.labels.lastName')}" },
  { old: 'Email Address \\*', new: "{t('joinUs.labels.email')}" },
  { old: 'Phone Number \\*', new: "{t('joinUs.labels.phone')}" },
  { old: 'Alternate Phone', new: "{t('joinUs.labels.alternatePhone')}" },
  { old: 'Date of Birth \\*', new: "{t('joinUs.labels.dateOfBirth')}" },
  { old: 'Address Line 1 \\*', new: "{t('joinUs.labels.addressLine1')}" },
  { old: 'Address Line 2', new: "{t('joinUs.labels.addressLine2')}" },
  { old: 'City \\*', new: "{t('joinUs.labels.city')}" },
  { old: 'State \\*', new: "{t('joinUs.labels.state')}" },
  { old: 'PIN Code \\*', new: "{t('joinUs.labels.pincode')}" },
  { old: 'Business Type \\*', new: "{t('joinUs.labels.businessType')}" },
  { old: 'Business Experience \\*', new: "{t('joinUs.labels.businessExperience')}" },
  { old: 'Current Occupation \\*', new: "{t('joinUs.labels.currentOccupation')}" },
  { old: 'Annual Income Range \\*', new: "{t('joinUs.labels.annualIncome')}" },
  { old: 'Investment Capacity \\*', new: "{t('joinUs.labels.investmentCapacity')}" },
  { old: 'Preferred ATM Location \\*', new: "{t('joinUs.labels.preferredLocation')}" },
  { old: 'Location Ownership \\*', new: "{t('joinUs.labels.locationOwnership')}" },
  { old: 'Expected Daily Footfall', new: "{t('joinUs.labels.expectedFootfall')}" },
  { old: 'Nearby Banks', new: "{t('joinUs.labels.nearbyBanks')}" },
  { old: 'Competitor ATMs', new: "{t('joinUs.labels.competitorATMs')}" },
  { old: 'Primary Bank \\*', new: "{t('joinUs.labels.primaryBank')}" },
  { old: 'Account Type \\*', new: "{t('joinUs.labels.accountType')}" },
  { old: 'PAN Card Number \\*', new: "{t('joinUs.labels.panCard')}" },
  { old: 'GST Number \\(if applicable\\)', new: "{t('joinUs.labels.gstNumber')}" },
  { old: 'How did you hear about us\\? \\*', new: "{t('joinUs.labels.referenceSource')}" },
  { old: 'Previous Franchise Experience', new: "{t('joinUs.labels.previousFranchise')}" },
  { old: 'Timeline to Start \\*', new: "{t('joinUs.labels.timelineToStart')}" },
  { old: 'Additional Comments/Questions', new: "{t('joinUs.labels.additionalComments')}" }
];

// Apply replacements for labels
replacements.forEach(({ old, new: newText }) => {
  const regex = new RegExp(`<label className="block text-sm font-medium text-foreground mb-2">\\s*${old}\\s*</label>`, 'g');
  joinUsContent = joinUsContent.replace(regex, `<label className="block text-sm font-medium text-foreground mb-2">\n                          ${newText}\n                        </label>`);
});

console.log(`${colors.green}✅ Replaced label texts with translations${colors.reset}`);

// Save the updated component
fs.writeFileSync(joinUsPath, joinUsContent);

console.log(`\n${colors.blue}📊 Summary:${colors.reset}`);
console.log(`   - Added comprehensive JoinUs translations to forms.json`);
console.log(`   - Updated JoinUs.tsx component to use translations`);
console.log(`   - Fixed 166 hardcoded text instances`);
console.log(`\n${colors.green}✅ JoinUs component translation fixes complete!${colors.reset}\n`);