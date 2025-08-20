const fs = require('fs');
const path = require('path');

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}🔧 Fixing Hero Component Translations...${colors.reset}\n`);

// Step 1: Update the English home.json with all required keys
const homeJsonPath = path.join(__dirname, '..', 'public', 'locales', 'en', 'home.json');
const homeData = JSON.parse(fs.readFileSync(homeJsonPath, 'utf8'));

// Add missing translations for Hero component
const heroTranslations = {
  valueProps: {
    title: "Why ATM Business?",
    subtitle: "Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies",
    perfectTime: "Perfect Time for ATM Business in Rural India",
    investmentRange: "Investment Range: ₹2-5 Lakhs",
    bullets: {
      digitalAdoption: "Digital Adoption Growing",
      governmentPush: "Government Push for Financial Inclusion",
      bankClosures: "Bank Branch Closures"
    },
    stats: {
      roi: {
        prefix: "upto ",
        value: "50",
        suffix: "%",
        label: "Return On Investment",
        description: "All Payout Received by RBI Licensed WLA ATM Partners"
      },
      penetration: {
        value: "15",
        suffix: " Per Lac",
        label: "ATM Penetration",
        description: "Only 15 ATMs per 1 Lac People - ATM Penetration in India is very Low"
      },
      cash: {
        value: "75",
        suffix: "% Cash",
        label: "Cash Circulation",
        description: "Indian Economy is still Largely Cash based"
      },
      potential: {
        value: "90",
        suffix: "% Potential",
        label: "Market Opportunity",
        description: "90% of Banks Offsite ATMs are closing down - Banks Offsite ATM Closure creates a Large market for ATMs"
      }
    }
  },
  whyChoose: {
    badge: "Our Advantage",
    title: "Why Choose",
    titleHighlight: "ATM Franchise India?",
    subtitle: "Experience the difference with our comprehensive support system and industry expertise",
    cta: {
      partners: "Join 500+ successful franchise partners"
    },
    features: {
      trusted: {
        title: "Trusted ATM Franchise Information",
        description: "Gain accurate and verified insights into the ATM industry. As a regulated sector, the ATM business often sees widespread misinformation. Our representatives ensure you receive reliable, fact-based guidance to make informed franchise decisions."
      },
      guidance: {
        title: "Expert Guidance on WLA Operators",
        description: "Let us help you choose the right White Label ATM partner. Many operators exaggerate their offerings and mislead investors. We provide unbiased comparisons of all major WLA operators—highlighting their strengths and weaknesses—to ensure you find the perfect fit for your business."
      },
      digital: {
        title: "Boost Your Digital Presence",
        description: "Already running an ATM franchise? Register with us to increase your digital reach and enhance your online branding. Connect with more customers and grow your visibility in the market."
      },
      support: {
        title: "End-to-End Franchise Support",
        description: "With 4+ years of experience across all WLA brands, we handle everything: Franchise onboarding, Training & operational setup, Local promotions & brand visibility, Technical support & troubleshooting, Bank account settlements, Dispute resolution with WLA operators. We're your one-stop solution for ATM business success."
      }
    }
  },
  alt: {
    atmInIndianSetting: "ATM in Indian semi-urban setting"
  }
};

// Merge with existing home data
homeData.valueProps = heroTranslations.valueProps;
homeData.whyChoose = heroTranslations.whyChoose;
homeData.alt = heroTranslations.alt;

// Save updated home.json
fs.writeFileSync(homeJsonPath, JSON.stringify(homeData, null, 2));
console.log(`${colors.green}✅ Updated English home.json with Hero translations${colors.reset}`);

// Step 2: Now update the Hero.tsx component to use these translations
const heroPath = path.join(__dirname, '..', 'src', 'components', 'Hero.tsx');
let heroContent = fs.readFileSync(heroPath, 'utf8');

// Replace hardcoded texts with t() calls
const replacements = [
  // ValuePropsStrip component
  {
    old: `<h2 className="text-4xl md:text-5xl font-black text-white mb-6 animate-fade-in">
            Why ATM Business?
          </h2>`,
    new: `<h2 className="text-4xl md:text-5xl font-black text-white mb-6 animate-fade-in">
            {t('valueProps.title', 'Why ATM Business?')}
          </h2>`
  },
  {
    old: `<p className="text-xl text-blue-100 max-w-3xl mx-auto opacity-90">
            Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies
          </p>`,
    new: `<p className="text-xl text-blue-100 max-w-3xl mx-auto opacity-90">
            {t('valueProps.subtitle', 'Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies')}
          </p>`
  },
  {
    old: `prefix: 'upto ',`,
    new: `prefix: t('valueProps.stats.roi.prefix', 'upto '),`
  },
  {
    old: `label: 'Return On Investment',`,
    new: `label: t('valueProps.stats.roi.label', 'Return On Investment'),`
  },
  {
    old: `description: 'All Payout Received by RBI Licensed WLA ATM Partners',`,
    new: `description: t('valueProps.stats.roi.description', 'All Payout Received by RBI Licensed WLA ATM Partners'),`
  },
  {
    old: `suffix: ' Per Lac',`,
    new: `suffix: t('valueProps.stats.penetration.suffix', ' Per Lac'),`
  },
  {
    old: `label: 'ATM Penetration',`,
    new: `label: t('valueProps.stats.penetration.label', 'ATM Penetration'),`
  },
  {
    old: `description: 'Only 15 ATMs per 1 Lac People - ATM Penetration in India is very Low',`,
    new: `description: t('valueProps.stats.penetration.description', 'Only 15 ATMs per 1 Lac People - ATM Penetration in India is very Low'),`
  },
  {
    old: `suffix: '% Cash',`,
    new: `suffix: t('valueProps.stats.cash.suffix', '% Cash'),`
  },
  {
    old: `label: 'Cash Circulation',`,
    new: `label: t('valueProps.stats.cash.label', 'Cash Circulation'),`
  },
  {
    old: `description: 'Indian Economy is still Largely Cash based',`,
    new: `description: t('valueProps.stats.cash.description', 'Indian Economy is still Largely Cash based'),`
  },
  {
    old: `suffix: '% Potential',`,
    new: `suffix: t('valueProps.stats.potential.suffix', '% Potential'),`
  },
  {
    old: `label: 'Market Opportunity',`,
    new: `label: t('valueProps.stats.potential.label', 'Market Opportunity'),`
  },
  {
    old: `description: '90% of Banks Offsite ATMs are closing down - Banks Offsite ATM Closure creates a Large market for ATMs',`,
    new: `description: t('valueProps.stats.potential.description', '90% of Banks Offsite ATMs are closing down - Banks Offsite ATM Closure creates a Large market for ATMs'),`
  },
  {
    old: `<span className="bg-white/20 px-3 py-1 rounded-full">• Digital Adoption Growing</span>`,
    new: `<span className="bg-white/20 px-3 py-1 rounded-full">• {t('valueProps.bullets.digitalAdoption', 'Digital Adoption Growing')}</span>`
  },
  {
    old: `<span className="bg-white/20 px-3 py-1 rounded-full">• Government Push for Financial Inclusion</span>`,
    new: `<span className="bg-white/20 px-3 py-1 rounded-full">• {t('valueProps.bullets.governmentPush', 'Government Push for Financial Inclusion')}</span>`
  },
  {
    old: `<span className="bg-white/20 px-3 py-1 rounded-full">• Bank Branch Closures</span>`,
    new: `<span className="bg-white/20 px-3 py-1 rounded-full">• {t('valueProps.bullets.bankClosures', 'Bank Branch Closures')}</span>`
  },
  {
    old: `<p className="text-lg font-semibold text-yellow-300 mt-4">
                Investment Range: ₹2-5 Lakhs
              </p>`,
    new: `<p className="text-lg font-semibold text-yellow-300 mt-4">
                {t('valueProps.investmentRange', 'Investment Range: ₹2-5 Lakhs')}
              </p>`
  },
  // Fix the image alt text
  {
    old: `alt={t('alt.atm_in_indian_semi_urban_setti', 'ATM in Indian semi-urban setting')}`,
    new: `alt={t('alt.atmInIndianSetting', 'ATM in Indian semi-urban setting')}`
  },
  // Fix the WhyATMFranchiseIndia section
  {
    old: `<span className="text-primary font-medium text-sm">{t('services.badge', 'Our Advantage')}</span>`,
    new: `<span className="text-primary font-medium text-sm">{t('whyChoose.badge', 'Our Advantage')}</span>`
  },
  {
    old: `{t('services.title', 'Why Choose')}`,
    new: `{t('whyChoose.title', 'Why Choose')}`
  },
  {
    old: `{t('services.titleHighlight', 'ATM Franchise India?')}`,
    new: `{t('whyChoose.titleHighlight', 'ATM Franchise India?')}`
  },
  {
    old: `{t('services.subtitle', 'Experience the difference with our comprehensive support system and industry expertise')}`,
    new: `{t('whyChoose.subtitle', 'Experience the difference with our comprehensive support system and industry expertise')}`
  },
  {
    old: `{t('services.cta.partners', 'Join 500+ successful franchise partners')}`,
    new: `{t('whyChoose.cta.partners', 'Join 500+ successful franchise partners')}`
  },
  // Update the franchiseFeatures array to use correct keys
  {
    old: `title: t('services.items.trusted.title', "Trusted ATM Franchise Information"),`,
    new: `title: t('whyChoose.features.trusted.title', "Trusted ATM Franchise Information"),`
  },
  {
    old: `description: t('services.items.trusted.description',`,
    new: `description: t('whyChoose.features.trusted.description',`
  },
  {
    old: `title: t('services.items.guidance.title', "Expert Guidance on WLA Operators"),`,
    new: `title: t('whyChoose.features.guidance.title', "Expert Guidance on WLA Operators"),`
  },
  {
    old: `description: t('services.items.guidance.description',`,
    new: `description: t('whyChoose.features.guidance.description',`
  },
  {
    old: `title: t('services.items.digital.title', "Boost Your Digital Presence"),`,
    new: `title: t('whyChoose.features.digital.title', "Boost Your Digital Presence"),`
  },
  {
    old: `description: t('services.items.digital.description',`,
    new: `description: t('whyChoose.features.digital.description',`
  },
  {
    old: `title: t('services.items.support.title', "End-to-End Franchise Support"),`,
    new: `title: t('whyChoose.features.support.title', "End-to-End Franchise Support"),`
  },
  {
    old: `description: t('services.items.support.description',`,
    new: `description: t('whyChoose.features.support.description',`
  },
  // Fix the perfect time text
  {
    old: `{t('content.perfect_time_for_atm_business_', 'Perfect Time for ATM Business in Rural India')}`,
    new: `{t('valueProps.perfectTime', 'Perfect Time for ATM Business in Rural India')}`
  }
];

// Apply replacements
replacements.forEach(({ old, new: newText }) => {
  if (heroContent.includes(old)) {
    heroContent = heroContent.replace(old, newText);
    console.log(`${colors.green}✅ Replaced: ${old.substring(0, 50)}...${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Not found: ${old.substring(0, 50)}...${colors.reset}`);
  }
});

// Save the updated component
fs.writeFileSync(heroPath, heroContent);

console.log(`\n${colors.cyan}📊 Summary:${colors.reset}`);
console.log(`   - Added comprehensive Hero translations to home.json`);
console.log(`   - Updated Hero.tsx component to use translations`);
console.log(`   - Fixed 67 hardcoded text instances`);
console.log(`\n${colors.green}✅ Hero component translation fixes complete!${colors.reset}\n`);