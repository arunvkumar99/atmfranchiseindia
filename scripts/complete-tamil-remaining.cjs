const fs = require('fs');
const path = require('path');

// Complete Tamil translations for remaining 254 English keys

const remainingTranslations = {
  about: {
    mission: {
      items: {
        accurate: {
          title: "துல்லியமான தகவல்",
          description: "ஏடிஎம் உரிமை வாய்ப்புகள் பற்றிய சரிபார்க்கப்பட்ட மற்றும் வெளிப்படையான தகவல்களை வழங்குதல்"
        },
        simplify: {
          title: "செயல்முறையை எளிமைப்படுத்துதல்",
          description: "ஏடிஎம் உரிமை பயணத்தை அனைவருக்கும் எளிமையாகவும் அணுகக்கூடியதாகவும் ஆக்குதல்"
        },
        support: {
          title: "தொடர்ச்சியான ஆதரவு",
          description: "அமைப்பிலிருந்து வெற்றிகரமான செயல்பாடு வரை தொடர்ச்சியான வழிகாட்டுதலை வழங்குதல்"
        },
        growth: {
          title: "வளர்ச்சியை இயக்குதல்",
          description: "பங்குதாரர்கள் நிலையான வருமானம் மற்றும் வணிக வளர்ச்சியை அடைய உதவுதல்"
        }
      }
    },
    services: {
      title: "எங்கள் சேவைகள்",
      consultation: {
        title: "உரிமை ஆலோசனை",
        description: "சரியான WLA பங்குதாரர் மற்றும் இடத்தைத் தேர்ந்தெடுப்பதில் நிபுணர் வழிகாட்டுதல்"
      },
      training: {
        title: "பயிற்சி மற்றும் ஆதரவு",
        description: "விரிவான பயிற்சி திட்டங்கள் மற்றும் தொடர்ச்சியான செயல்பாட்டு ஆதரவு"
      },
      digital: {
        title: "டிஜிட்டல் மார்க்கெட்டிங்",
        description: "எங்கள் டிஜிட்டல் மார்க்கெட்டிங் சேவைகளுடன் உங்கள் ஏடிஎம்மின் தெரிவுநிலையை அதிகரிக்கவும்"
      },
      technical: {
        title: "தொழில்நுட்ப உதவி",
        description: "24/7 தொழில்நுட்ப ஆதரவு மற்றும் சிக்கல் தீர்க்கும் உதவி"
      }
    },
    values: {
      title: "எங்கள் மதிப்புகள்",
      transparency: {
        title: "வெளிப்படைத்தன்மை",
        description: "அனைத்து வணிக நடவடிக்கைகளிலும் முழுமையான வெளிப்படைத்தன்மை"
      },
      integrity: {
        title: "நேர்மை",
        description: "நேர்மையான மற்றும் நெறிமுறை வணிக நடைமுறைகள்"
      },
      excellence: {
        title: "சிறப்பு",
        description: "சேவை சிறப்புக்கான அர்ப்பணிப்பு"
      },
      innovation: {
        title: "புதுமை",
        description: "தொடர்ச்சியான மேம்பாடு மற்றும் புதுமை"
      }
    },
    cta: {
      title: "உங்கள் ஏடிஎம் உரிமை பயணத்தைத் தொடங்க தயாரா?",
      subtitle: "இந்தியா முழுவதும் உள்ள ஆயிரக்கணக்கான வெற்றிகரமான உரிமை பங்குதாரர்களுடன் சேரவும்",
      button: "இன்றே தொடங்கவும்"
    }
  },
  
  contact: {
    office: {
      title: "அலுவலக முகவரி",
      address: "பெங்களூரு, கர்நாடகா, இந்தியா"
    },
    form: {
      title: "எங்களுக்கு ஒரு செய்தி அனுப்பவும்",
      description: "கீழே உள்ள படிவத்தை நிரப்பவும், எங்கள் குழு 24 மணிநேரத்திற்குள் உங்களைத் தொடர்பு கொள்ளும்"
    }
  },
  
  forms: {
    placeholders: {
      full_name: "உங்கள் முழு பெயரை உள்ளிடவும்",
      full_name_pan: "பான் அட்டையின்படி உங்கள் முழு பெயரை உள்ளிடவும்",
      phone_primary: "முதன்மை தொடர்பு எண்",
      address_line2: "பகுதி, மைல்கல்",
      your_city: "உங்கள் நகரம்",
      district: "உங்கள் மாவட்டத்தை உள்ளிடவும்",
      business_type: "வணிக வகையைத் தேர்ந்தெடுக்கவும்",
      company_name: "உங்கள் நிறுவனத்தின் பெயர்",
      organization: "நிறுவனம்/வணிகத்தின் பெயர்",
      job_title: "உங்கள் பதவி",
      monthly_income: "மாத வருமானத்தைத் தேர்ந்தெடுக்கவும்",
      website: "https://example.com",
      bank_name: "உங்கள் வங்கியின் பெயர்",
      account_number: "வங்கி கணக்கு எண்",
      ifsc_code: "ABCD0123456",
      nearest_landmark: "அருகிலுள்ள மைல்கல்",
      proposed_location: "முன்மொழியப்பட்ட ஏடிஎம் இடம்",
      space_available: "கிடைக்கும் இட விவரங்கள்",
      footfall: "தினசரி கால் போக்குவரத்து மதிப்பீடு",
      security_available: "பாதுகாப்பு ஏற்பாடுகள் விவரங்கள்",
      power_backup: "மின்சார ஆதரவு விவரங்கள்",
      reference_name: "குறிப்பு நபரின் பெயர்",
      reference_phone: "குறிப்பு தொடர்பு எண்",
      investment_amount: "முதலீட்டுத் தொகையைத் தேர்ந்தெடுக்கவும்",
      existing_business: "உங்கள் தற்போதைய வணிகத்தை விவரிக்கவும்",
      experience_years: "வணிக அனுபவ ஆண்டுகள்",
      additional_info: "கூடுதல் தகவல் அல்லது கேள்விகள்",
      preferred_date: "விருப்பமான தேதியைத் தேர்ந்தெடுக்கவும்",
      preferred_time: "விருப்பமான நேரத்தைத் தேர்ந்தெடுக்கவும்"
    },
    validation: {
      email_invalid: "சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்",
      phone_invalid: "சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்",
      pan_invalid: "சரியான PAN எண்ணை உள்ளிடவும் (ABCDE1234F)",
      aadhaar_invalid: "சரியான 12 இலக்க ஆதார் எண்ணை உள்ளிடவும்",
      pin_invalid: "சரியான 6 இலக்க பின் குறியீட்டை உள்ளிடவும்",
      gst_invalid: "சரியான GST எண்ணை உள்ளிடவும்",
      min_length: "குறைந்தபட்சம் {{min}} எழுத்துக்கள் தேவை",
      max_length: "அதிகபட்சம் {{max}} எழுத்துக்கள் அனுமதிக்கப்படுகின்றன",
      required_field: "இந்த புலம் தேவைப்படுகிறது",
      agree_terms: "விதிமுறைகள் மற்றும் நிபந்தனைகளை ஏற்க வேண்டும்",
      select_option: "ஒரு விருப்பத்தைத் தேர்ந்தெடுக்கவும்",
      number_only: "எண்கள் மட்டுமே அனுமதிக்கப்படுகின்றன",
      letters_only: "எழுத்துக்கள் மட்டுமே அனுமதிக்கப்படுகின்றன",
      alphanumeric_only: "எழுத்துக்கள் மற்றும் எண்கள் மட்டுமே அனுமதிக்கப்படுகின்றன",
      url_invalid: "சரியான URL ஐ உள்ளிடவும்",
      date_invalid: "சரியான தேதியைத் தேர்ந்தெடுக்கவும்"
    },
    labels: {
      investment_ready: "முதலீட்டுத் தயார்நிலை",
      investment_amount: "முதலீட்டுத் தொகை",
      existing_business: "தற்போதைய வணிகம்",
      business_type: "வணிக வகை",
      experience_years: "அனுபவ ஆண்டுகள்",
      company_name: "நிறுவனத்தின் பெயர்",
      job_title: "பதவி",
      monthly_income: "மாத வருமானம்",
      website: "வலைத்தளம்",
      bank_details: "வங்கி விவரங்கள்",
      bank_name: "வங்கியின் பெயர்",
      account_number: "கணக்கு எண்",
      ifsc_code: "IFSC குறியீடு",
      location_details: "இடம் விவரங்கள்",
      nearest_landmark: "அருகிலுள்ள மைல்கல்",
      proposed_location: "முன்மொழியப்பட்ட இடம்",
      space_available: "கிடைக்கும் இடம்",
      footfall: "நாள் கால் போக்குவரத்து",
      security_available: "பாதுகாப்பு கிடைக்கும்",
      power_backup: "மின்சார ஆதரவு",
      reference_details: "குறிப்பு விவரங்கள்",
      reference_name: "குறிப்பு பெயர்",
      reference_phone: "குறிப்பு தொலைபேசி",
      additional_info: "கூடுதல் தகவல்",
      preferred_date: "விருப்பமான தேதி",
      preferred_time: "விருப்பமான நேரம்"
    },
    options: {
      investment_amounts: {
        below_5: "₹5 லட்சத்திற்கு கீழ்",
        "5_to_10": "₹5-10 லட்சம்",
        "10_to_25": "₹10-25 லட்சம்",
        "25_to_50": "₹25-50 லட்சம்",
        above_50: "₹50 லட்சத்திற்கு மேல்"
      },
      business_types: {
        retail: "சில்லறை வணிகம்",
        service: "சேவை வழங்குநர்",
        manufacturing: "உற்பத்தி",
        trading: "வர்த்தகம்",
        professional: "தொழில்முறை சேவைகள்",
        agriculture: "விவசாயம்",
        real_estate: "ரியல் எஸ்டேட்",
        others: "மற்றவை"
      },
      experience_ranges: {
        "0_to_2": "0-2 ஆண்டுகள்",
        "2_to_5": "2-5 ஆண்டுகள்",
        "5_to_10": "5-10 ஆண்டுகள்",
        above_10: "10+ ஆண்டுகள்"
      },
      monthly_incomes: {
        below_25k: "₹25,000க்கு கீழ்",
        "25k_to_50k": "₹25,000 - ₹50,000",
        "50k_to_1l": "₹50,000 - ₹1,00,000",
        "1l_to_2l": "₹1,00,000 - ₹2,00,000",
        above_2l: "₹2,00,000க்கு மேல்"
      },
      time_slots: {
        morning: "காலை (9 AM - 12 PM)",
        afternoon: "மதியம் (12 PM - 3 PM)",
        evening: "மாலை (3 PM - 6 PM)",
        late_evening: "இரவு (6 PM - 9 PM)"
      },
      security_types: {
        "24x7_guard": "24x7 பாதுகாப்பு காவலர்",
        cctv: "CCTV கண்காணிப்பு",
        both: "காவலர் மற்றும் CCTV",
        none: "இல்லை"
      },
      power_options: {
        generator: "ஜெனரேட்டர்",
        ups: "UPS",
        inverter: "இன்வெர்ட்டர்",
        solar: "சோலார்",
        none: "இல்லை"
      }
    }
  },
  
  franchise: {
    content: {
      simple_4step_process: "எளிய 4-படி செயல்முறை"
    },
    comparison: {
      models: {
        basic: {
          features: [
            "ஒற்றை இடம் அமைப்பு",
            "அடிப்படை பயிற்சி திட்டம்",
            "மாதாந்திர பராமரிப்பு",
            "பிராந்திய ஆதரவு குழு"
          ]
        },
        professional: {
          features: [
            "பல இடங்கள் அமைப்பு",
            "மேம்பட்ட பயிற்சி திட்டம்",
            "இரு வார பராமரிப்பு",
            "பிரத்யேக கணக்கு மேலாளர்",
            "மார்க்கெட்டிங் ஆதரவு"
          ]
        },
        enterprise: {
          features: [
            "வரம்பற்ற இடங்கள்",
            "நிர்வாக பயிற்சி திட்டம்",
            "வாராந்திர பராமரிப்பு",
            "குழு தலைமை ஆதரவு",
            "முழு மார்க்கெட்டிங் தொகுப்பு",
            "தனிப்பயனாக்கப்பட்ட தீர்வுகள்"
          ]
        }
      }
    }
  },
  
  home: {
    features: {
      penetration: {
        title: "லட்சத்திற்கு 15",
        subtitle: "1 லட்சம் மக்களுக்கு 15 ஏடிஎம்கள் மட்டுமே",
        description: "இந்தியாவில் ஏடிஎம் ஊடுருவல் மிகவும் குறைவு"
      },
      cash: {
        title: "75% பணம்",
        subtitle: "பண சுழற்சி",
        description: "இந்திய பொருளாதாரம் இன்னும் பெரும்பாலும் பண அடிப்படையிலானது"
      },
      potential: {
        title: "90% சாத்தியம்",
        subtitle: "வங்கிகளின் 90% ஆஃப்சைட் ஏடிஎம்கள் மூடப்படுகின்றன",
        description: "வங்கிகளின் ஆஃப்சைட் ஏடிஎம் மூடல் WLA ஏடிஎம்களுக்கு பெரிய சந்தையை உருவாக்குகிறது"
      }
    },
    stats: {
      atmsAcrossIndia: "இந்தியா முழுவதும் ஏடிஎம்கள்",
      franchisePartners: "உரிமை பங்குதாரர்கள்",
      monthlyTransactions: "மாதாந்திர பரிவர்த்தனைகள்",
      statesCovered: "மாநில கவரேஜ்"
    },
    trustSignals: {
      rbiApproved: "RBI அங்கீகரிக்கப்பட்டது",
      secureInvestment: "பாதுகாப்பான முதலீடு",
      monthlyIncome: "மாதாந்திர வருமானம்",
      fullSupport: "முழு ஆதரவு"
    },
    process: {
      steps: {
        application: {
          title: "விண்ணப்பம்",
          description: "ஆன்லைன் விண்ணப்பத்தை நிரப்பவும்"
        },
        verification: {
          title: "சரிபார்ப்பு",
          description: "ஆவணங்கள் மற்றும் இட சரிபார்ப்பு"
        },
        training: {
          title: "பயிற்சி",
          description: "விரிவான பயிற்சி திட்டம்"
        },
        launch: {
          title: "தொடங்கு",
          description: "உங்கள் ஏடிஎம் வணிகத்தைத் தொடங்கவும்"
        }
      }
    },
    testimonials: {
      viewMore: "மேலும் பார்க்க",
      readFullStory: "முழு கதையைப் படிக்க"
    },
    faq: {
      title: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
      viewAllFaqs: "அனைத்து கேள்விகளையும் பார்க்க"
    },
    cta: {
      getStarted: "இன்றே தொடங்கவும்",
      learnMore: "மேலும் அறிக",
      applyNow: "இப்போது விண்ணப்பிக்கவும்",
      contactUs: "எங்களை தொடர்பு கொள்ளவும்",
      downloadBrochure: "பிரசுரத்தைப் பதிவிறக்கவும்"
    }
  }
};

// Components translations (new file)
const componentsTranslations = {
  navigation: {
    home: "முகப்பு",
    about: "எங்களைப் பற்றி",
    products: "தயாரிப்புகள்",
    franchise: "உரிமை",
    contact: "தொடர்பு",
    blog: "வலைப்பதிவு",
    careers: "வேலைவாய்ப்புகள்",
    language: "மொழி"
  },
  footer: {
    company: "நிறுவனம்",
    quickLinks: "விரைவு இணைப்புகள்",
    legal: "சட்ட",
    followUs: "எங்களை பின்பற்றவும்",
    copyright: "© 2024 ATM Franchise India. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    privacyPolicy: "தனியுரிமைக் கொள்கை",
    termsOfService: "சேவை விதிமுறைகள்",
    refundPolicy: "திருப்பிச் செலுத்தும் கொள்கை"
  },
  buttons: {
    submit: "சமர்ப்பிக்க",
    cancel: "ரத்து செய்",
    next: "அடுத்து",
    previous: "முந்தைய",
    save: "சேமிக்க",
    delete: "நீக்கு",
    edit: "திருத்து",
    view: "பார்க்க",
    download: "பதிவிறக்கம்",
    upload: "பதிவேற்றம்",
    search: "தேடு",
    filter: "வடிகட்டி",
    reset: "மீட்டமை",
    close: "மூடு",
    confirm: "உறுதிப்படுத்து",
    back: "பின்",
    proceed: "தொடர",
    apply: "விண்ணப்பிக்க"
  },
  messages: {
    success: "வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது!",
    error: "ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.",
    loading: "ஏற்றுகிறது...",
    noData: "தரவு இல்லை",
    confirmDelete: "நீக்க விரும்புகிறீர்களா?",
    saved: "சேமிக்கப்பட்டது",
    updated: "புதுப்பிக்கப்பட்டது",
    deleted: "நீக்கப்பட்டது",
    required: "தேவையான புலங்களை நிரப்பவும்",
    invalidInput: "தவறான உள்ளீடு",
    sessionExpired: "அமர்வு காலாவதியானது",
    networkError: "நெட்வொர்க் பிழை",
    tryAgain: "மீண்டும் முயற்சிக்கவும்",
    comingSoon: "விரைவில் வருகிறது",
    underConstruction: "கட்டுமானத்தில்"
  },
  status: {
    active: "செயலில்",
    inactive: "செயலற்ற",
    pending: "நிலுவையில்",
    approved: "அங்கீகரிக்கப்பட்டது",
    rejected: "நிராகரிக்கப்பட்டது",
    completed: "நிறைவு",
    inProgress: "செயல்பாட்டில்",
    draft: "வரைவு",
    published: "வெளியிடப்பட்டது",
    archived: "காப்பகம்"
  }
};

// Location translations (new file)
const locationTranslations = {
  states: {
    andhraPradesh: "ஆந்திரப் பிரதேசம்",
    arunachalPradesh: "அருணாச்சலப் பிரதேசம்",
    assam: "அசாம்",
    bihar: "பீகார்",
    chhattisgarh: "சத்தீஸ்கர்",
    goa: "கோவா",
    gujarat: "குஜராத்",
    haryana: "ஹரியானா",
    himachalPradesh: "இமாச்சலப் பிரதேசம்",
    jharkhand: "ஜார்கண்ட்",
    karnataka: "கர்நாடகா",
    kerala: "கேரளா",
    madhyaPradesh: "மத்தியப் பிரதேசம்",
    maharashtra: "மகாராஷ்டிரா",
    manipur: "மணிப்பூர்",
    meghalaya: "மேகாலயா",
    mizoram: "மிசோரம்",
    nagaland: "நாகாலாந்து",
    odisha: "ஒடிசா",
    punjab: "பஞ்சாப்",
    rajasthan: "ராஜஸ்தான்",
    sikkim: "சிக்கிம்",
    tamilNadu: "தமிழ்நாடு",
    telangana: "தெலங்கானா",
    tripura: "திரிபுரா",
    uttarPradesh: "உத்தரப் பிரதேசம்",
    uttarakhand: "உத்தராகண்ட்",
    westBengal: "மேற்கு வங்காளம்",
    delhi: "தில்லி",
    jammuKashmir: "ஜம்மு காஷ்மீர்",
    ladakh: "லடாக்"
  },
  cities: {
    chennai: "சென்னை",
    coimbatore: "கோயம்புத்தூர்",
    madurai: "மதுரை",
    trichy: "திருச்சி",
    salem: "சேலம்",
    tirunelveli: "திருநெல்வேலி",
    erode: "ஈரோடு",
    vellore: "வேலூர்",
    tuticorin: "தூத்துக்குடி",
    bangalore: "பெங்களூரு",
    mumbai: "மும்பை",
    delhi: "டெல்லி",
    kolkata: "கொல்கத்தா",
    hyderabad: "ஹைதராபாத்",
    pune: "புனே",
    ahmedabad: "அகமதாபாத்",
    surat: "சூரத்",
    jaipur: "ஜெய்ப்பூர்",
    lucknow: "லக்னோ"
  }
};

function updateTranslations() {
  console.log('🔄 Updating remaining Tamil translations...\n');
  
  const localesDir = path.join(__dirname, '..', 'public', 'locales', 'ta');
  
  // Update about.json
  const aboutPath = path.join(localesDir, 'about.json');
  const aboutContent = JSON.parse(fs.readFileSync(aboutPath, 'utf-8'));
  
  // Deep merge translations
  Object.keys(remainingTranslations.about).forEach(key => {
    if (typeof remainingTranslations.about[key] === 'object') {
      aboutContent[key] = { ...aboutContent[key], ...remainingTranslations.about[key] };
    } else {
      aboutContent[key] = remainingTranslations.about[key];
    }
  });
  
  fs.writeFileSync(aboutPath, JSON.stringify(aboutContent, null, 2), 'utf-8');
  console.log('✅ Updated about.json with remaining translations');
  
  // Update contact.json
  const contactPath = path.join(localesDir, 'contact.json');
  const contactContent = JSON.parse(fs.readFileSync(contactPath, 'utf-8'));
  
  Object.keys(remainingTranslations.contact).forEach(key => {
    if (typeof remainingTranslations.contact[key] === 'object') {
      contactContent[key] = { ...contactContent[key], ...remainingTranslations.contact[key] };
    } else {
      contactContent[key] = remainingTranslations.contact[key];
    }
  });
  
  // Keep email address as-is (should not be translated)
  if (contactContent.email && contactContent.email.address) {
    contactContent.email.address = "support@atmfranchiseindia.in";
  }
  
  fs.writeFileSync(contactPath, JSON.stringify(contactContent, null, 2), 'utf-8');
  console.log('✅ Updated contact.json with remaining translations');
  
  // Update forms.json
  const formsPath = path.join(localesDir, 'forms.json');
  const formsContent = JSON.parse(fs.readFileSync(formsPath, 'utf-8'));
  
  Object.keys(remainingTranslations.forms).forEach(key => {
    if (!formsContent[key]) {
      formsContent[key] = {};
    }
    Object.keys(remainingTranslations.forms[key]).forEach(subKey => {
      formsContent[key][subKey] = remainingTranslations.forms[key][subKey];
    });
  });
  
  fs.writeFileSync(formsPath, JSON.stringify(formsContent, null, 2), 'utf-8');
  console.log('✅ Updated forms.json with comprehensive translations');
  
  // Update franchise.json
  const franchisePath = path.join(localesDir, 'franchise.json');
  const franchiseContent = JSON.parse(fs.readFileSync(franchisePath, 'utf-8'));
  
  // Update content section
  if (!franchiseContent.content) franchiseContent.content = {};
  franchiseContent.content.simple_4step_process = remainingTranslations.franchise.content.simple_4step_process;
  
  // Update comparison models features
  if (franchiseContent.comparison && franchiseContent.comparison.models) {
    if (franchiseContent.comparison.models.basic) {
      franchiseContent.comparison.models.basic.features = remainingTranslations.franchise.comparison.models.basic.features;
    }
    if (franchiseContent.comparison.models.professional) {
      franchiseContent.comparison.models.professional.features = remainingTranslations.franchise.comparison.models.professional.features;
    }
    if (franchiseContent.comparison.models.enterprise) {
      franchiseContent.comparison.models.enterprise.features = remainingTranslations.franchise.comparison.models.enterprise.features;
    }
  }
  
  fs.writeFileSync(franchisePath, JSON.stringify(franchiseContent, null, 2), 'utf-8');
  console.log('✅ Updated franchise.json with feature translations');
  
  // Update home.json
  const homePath = path.join(localesDir, 'home.json');
  const homeContent = JSON.parse(fs.readFileSync(homePath, 'utf-8'));
  
  Object.keys(remainingTranslations.home).forEach(key => {
    if (!homeContent[key]) {
      homeContent[key] = {};
    }
    Object.keys(remainingTranslations.home[key]).forEach(subKey => {
      if (typeof remainingTranslations.home[key][subKey] === 'object') {
        homeContent[key][subKey] = { ...homeContent[key][subKey], ...remainingTranslations.home[key][subKey] };
      } else {
        homeContent[key][subKey] = remainingTranslations.home[key][subKey];
      }
    });
  });
  
  fs.writeFileSync(homePath, JSON.stringify(homeContent, null, 2), 'utf-8');
  console.log('✅ Updated home.json with remaining translations');
  
  // Create/Update components.json
  const componentsPath = path.join(localesDir, 'components.json');
  fs.writeFileSync(componentsPath, JSON.stringify(componentsTranslations, null, 2), 'utf-8');
  console.log('✅ Created components.json with Tamil translations');
  
  // Create/Update location.json
  const locationPath = path.join(localesDir, 'location.json');
  fs.writeFileSync(locationPath, JSON.stringify(locationTranslations, null, 2), 'utf-8');
  console.log('✅ Created location.json with Tamil translations');
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Tamil translation update complete!');
  console.log('Files updated: about, contact, forms, franchise, home');
  console.log('Files created: components, location');
  console.log('Next step: Run tamil-translation-audit.cjs to verify 100% coverage');
  console.log('='.repeat(80));
}

// Run the update
updateTranslations();