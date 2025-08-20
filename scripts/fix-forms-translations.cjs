const fs = require('fs');
const path = require('path');

// Read the Hindi forms.json file
const filePath = path.join(__dirname, '..', 'public', 'locales', 'hi', 'forms.json');
const formsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Critical translations to fix
const translations = {
  // Common form fields
  "Name": "नाम",
  "Email": "ईमेल",
  "Phone": "फ़ोन",
  "Phone Number": "फ़ोन नंबर",
  "Mobile Number": "मोबाइल नंबर",
  "Address": "पता",
  "City": "शहर",
  "State": "राज्य",
  "Pin Code": "पिन कोड",
  "Submit": "जमा करें",
  "Send": "भेजें",
  "Cancel": "रद्द करें",
  "Back": "वापस",
  "Next": "अगला",
  "Previous": "पिछला",
  "Select": "चुनें",
  "Choose": "चुनें",
  "Upload": "अपलोड करें",
  "Download": "डाउनलोड करें",
  "Yes": "हां",
  "No": "नहीं",
  
  // Form titles
  "Enquiry Form": "पूछताछ फॉर्म",
  "Contact Form": "संपर्क फॉर्म",
  "Application Form": "आवेदन फॉर्म",
  "Registration Form": "पंजीकरण फॉर्म",
  
  // Messages
  "Please enter your name": "कृपया अपना नाम दर्ज करें",
  "Please enter your email": "कृपया अपना ईमेल दर्ज करें",
  "Please enter your phone number": "कृपया अपना फ़ोन नंबर दर्ज करें",
  "Please select a state": "कृपया एक राज्य चुनें",
  "Please enter a valid email": "कृपया एक मान्य ईमेल दर्ज करें",
  "Please enter a valid phone number": "कृपया एक मान्य फ़ोन नंबर दर्ज करें",
  "Form submitted successfully": "फॉर्म सफलतापूर्वक जमा किया गया",
  "Error submitting form": "फॉर्म जमा करने में त्रुटि",
  
  // Placeholders
  "Enter your name": "अपना नाम दर्ज करें",
  "Enter your email": "अपना ईमेल दर्ज करें",
  "Enter your phone number": "अपना फ़ोन नंबर दर्ज करें",
  "Enter your message": "अपना संदेश दर्ज करें",
  "Select your state": "अपना राज्य चुनें",
  "Select an option": "एक विकल्प चुनें",
  
  // Investment related
  "Investment Capacity": "निवेश क्षमता",
  "Investment Amount": "निवेश राशि",
  "Investment Range": "निवेश सीमा",
  "Monthly Income": "मासिक आय",
  "Expected ROI": "अपेक्षित आरओआई",
  
  // ATM specific
  "ATM Location": "एटीएम स्थान",
  "Preferred Location": "पसंदीदा स्थान",
  "Location Type": "स्थान प्रकार",
  "Site Details": "साइट विवरण",
  "Franchise Type": "फ्रैंचाइज़ी प्रकार",
  
  // Status messages
  "Loading": "लोड हो रहा है",
  "Processing": "प्रसंस्करण",
  "Please wait": "कृपया प्रतीक्षा करें",
  "Success": "सफलता",
  "Error": "त्रुटि",
  "Warning": "चेतावनी",
  "Required": "आवश्यक",
  "Optional": "वैकल्पिक"
};

// Function to recursively replace English strings with Hindi
function translateObject(obj) {
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      // Check if the value is in English and we have a translation
      if (translations[obj[key]]) {
        console.log(`Translating: "${obj[key]}" -> "${translations[obj[key]]}"`);
        obj[key] = translations[obj[key]];
      }
      // Also check for partial matches
      else {
        for (let [eng, hindi] of Object.entries(translations)) {
          if (obj[key].includes(eng) && obj[key] !== hindi) {
            const newValue = obj[key].replace(eng, hindi);
            if (newValue !== obj[key]) {
              console.log(`Partial translation: "${obj[key]}" -> "${newValue}"`);
              obj[key] = newValue;
            }
          }
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      translateObject(obj[key]);
    }
  }
}

// Apply translations
translateObject(formsData);

// Write the updated file
fs.writeFileSync(filePath, JSON.stringify(formsData, null, 2), 'utf8');
console.log('\n✅ Forms translations updated successfully!');
console.log(`📁 File updated: ${filePath}`);