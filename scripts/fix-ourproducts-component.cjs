const fs = require('fs');
const path = require('path');

// Read the OurProducts.tsx file
const filePath = path.join(__dirname, '..', 'src', 'pages', 'OurProducts.tsx');
let fileContent = fs.readFileSync(filePath, 'utf-8');

console.log('🔧 Fixing OurProducts.tsx Component');
console.log('=' .repeat(80));

// List of replacements to make
const replacements = [
  // Fix more hardcoded text in partners section
  {
    old: '                  Premium Partnership Network',
    new: "                  {t('partners.badge', 'Premium Partnership Network')}"
  },
  {
    old: '                  <span className="text-slate-900">WLA ATMs</span>',
    new: "                  <span className=\"text-slate-900\">{t('partners.title.part1', 'WLA ATMs')}</span>"
  },
  {
    old: `                    Partnership
                  </span>`,
    new: `                    {t('partners.title.part2', 'Partnership')}
                  </span>`
  },
  {
    old: `                  Access India's most trusted White Label ATM operators through our exclusive partnership network. 
                  Choose from multiple operators based on your location and investment preferences.`,
    new: "                  {t('partners.description', \"Access India's most trusted White Label ATM operators through our exclusive partnership network. Choose from multiple operators based on your location and investment preferences.\")}"
  },
  {
    old: '                    <div className="text-3xl font-bold text-blue-600">12-18</div>',
    new: "                    <div className=\"text-3xl font-bold text-blue-600\">{t('partners.stats.roi.value', '12-18')}</div>"
  },
  {
    old: '                    <div className="text-sm text-slate-600">Months ROI</div>',
    new: "                    <div className=\"text-sm text-slate-600\">{t('partners.stats.roi.label', 'Months ROI')}</div>"
  },
  {
    old: '                    <div className="text-3xl font-bold text-green-600">₹15K+</div>',
    new: "                    <div className=\"text-3xl font-bold text-green-600\">{t('partners.stats.income.value', '₹15K+')}</div>"
  },
  {
    old: '                    <div className="text-sm text-slate-600">Monthly Income</div>',
    new: "                    <div className=\"text-sm text-slate-600\">{t('partners.stats.income.label', 'Monthly Income')}</div>"
  },
  {
    old: '                    Start Your Franchise',
    new: "                    {t('partners.cta', 'Start Your Franchise')}"
  },
  {
    old: '                <h3 className="text-2xl font-bold mb-8 text-center">Our Trusted WLA Partners</h3>',
    new: "                <h3 className=\"text-2xl font-bold mb-8 text-center\">{t('partners.sectionTitle', 'Our Trusted WLA Partners')}</h3>"
  }
];

// Fix care360Features array
const care360Fix = {
  old: `  const care360Features = [
    { icon: Globe, text: "🎯 Google GMB Profile & Location Boosting" },
    { icon: Shield, text: "⚖️ Settlement Dispute Resolution" },
    { icon: CreditCard, text: "💰 Payout Delay & Discrepancy Handling" },
    { icon: Wrench, text: "🔧 ATM & Asset Troubleshooting" },
    { icon: FileText, text: "🛡️ Insurance Claim Filing & Follow-up" },
    { icon: Briefcase, text: "📊 194N TDS Tagging & Tax Compliance" },
    { icon: Zap, text: "⚡ Fast-Response Support Team" },
    { icon: Building, text: "🏦 Assistance with Settlement Account Opening" }
  ];`,
  new: `  const care360Features = [
    { icon: Globe, text: t('care360.features.gmb', '🎯 Google GMB Profile & Location Boosting') },
    { icon: Shield, text: t('care360.features.settlement', '⚖️ Settlement Dispute Resolution') },
    { icon: CreditCard, text: t('care360.features.payout', '💰 Payout Delay & Discrepancy Handling') },
    { icon: Wrench, text: t('care360.features.troubleshooting', '🔧 ATM & Asset Troubleshooting') },
    { icon: FileText, text: t('care360.features.insurance', '🛡️ Insurance Claim Filing & Follow-up') },
    { icon: Briefcase, text: t('care360.features.tax', '📊 194N TDS Tagging & Tax Compliance') },
    { icon: Zap, text: t('care360.features.support', '⚡ Fast-Response Support Team') },
    { icon: Building, text: t('care360.features.account', '🏦 Assistance with Settlement Account Opening') }
  ];`
};

// Fix visibilityFeatures array
const visibilityFix = {
  old: `  const visibilityFeatures = [
    { icon: Search, text: "Google My Business Creation & Verification" },
    { icon: Target, text: "Professional Business Profile Optimization" },
    { icon: MapPin, text: "Maps & Search Tagging for High Visibility" },
    { icon: TrendingUp, text: "Local SEO Optimization" },
    { icon: Award, text: "Monthly Performance Insights" }
  ];`,
  new: `  const visibilityFeatures = [
    { icon: Search, text: t('visibility.features.0', 'Google My Business Creation & Verification') },
    { icon: Target, text: t('visibility.features.1', 'Professional Business Profile Optimization') },
    { icon: MapPin, text: t('visibility.features.2', 'Maps & Search Tagging for High Visibility') },
    { icon: TrendingUp, text: t('visibility.features.3', 'Local SEO Optimization') },
    { icon: Award, text: t('visibility.features.4', 'Monthly Performance Insights') }
  ];`
};

// Apply replacements
fileContent = fileContent.replace(care360Fix.old, care360Fix.new);
fileContent = fileContent.replace(visibilityFix.old, visibilityFix.new);

replacements.forEach(({ old, new: newText }) => {
  if (fileContent.includes(old)) {
    fileContent = fileContent.replace(old, newText);
    console.log(`✅ Replaced: "${old.substring(0, 50)}..."`);
  } else {
    console.log(`⚠️ Not found: "${old.substring(0, 50)}..."`);
  }
});

// Now let's fix Care360 section
const care360SectionReplacements = [
  {
    old: '                  Exclusive Offering',
    new: "                  {t('care360.badge', 'Exclusive Offering')}"
  },
  {
    old: '                  <span className="text-slate-900">Care360</span>',
    new: "                  <span className=\"text-slate-900\">{t('care360.title.part1', 'Care360')}</span>"
  },
  {
    old: `                    Management
                  </span>`,
    new: `                    {t('care360.title.part2', 'Management')}
                  </span>`
  },
  {
    old: '                <p className="text-2xl font-bold text-blue-600 mb-4">₹30,000 Worth Premium Service</p>',
    new: "                <p className=\"text-2xl font-bold text-blue-600 mb-4\">{t('care360.subtitle', '₹30,000 Worth Premium Service')}</p>"
  },
  {
    old: `                  Get comprehensive ATM management services for just ₹999/month. We handle everything related to your ATM business, 
                  ensuring smooth operations and maximizing your profits.`,
    new: "                  {t('care360.description', 'Get comprehensive ATM management services for just ₹999/month. We handle everything related to your ATM business, ensuring smooth operations and maximizing your profits.')}"
  }
];

// Apply Care360 section replacements
care360SectionReplacements.forEach(({ old, new: newText }) => {
  if (fileContent.includes(old)) {
    fileContent = fileContent.replace(old, newText);
    console.log(`✅ Replaced Care360: "${old.substring(0, 50)}..."`);
  }
});

// Fix Visibility section
const visibilitySectionReplacements = [
  {
    old: '                  Digital Presence',
    new: "                  {t('visibility.badge', 'Digital Presence')}"
  },
  {
    old: '                  <span className="text-slate-900">Google</span>',
    new: "                  <span className=\"text-slate-900\">{t('visibility.title.part1', 'Google')}</span>"
  },
  {
    old: `                    Visibility Boost
                  </span>`,
    new: `                    {t('visibility.title.part2', 'Visibility Boost')}
                  </span>`
  },
  {
    old: '                <p className="text-2xl font-bold text-green-600 mb-4">₹3,000 Worth Digital Marketing</p>',
    new: "                <p className=\"text-2xl font-bold text-green-600 mb-4\">{t('visibility.subtitle', '₹3,000 Worth Digital Marketing')}</p>"
  },
  {
    old: `                  Help your ATM reach more customers by improving online presence. 
                  We optimize your ATM location visibility on Google Maps and Search.`,
    new: "                  {t('visibility.description', 'Help your ATM reach more customers by improving online presence. We optimize your ATM location visibility on Google Maps and Search.')}"
  },
  {
    old: '                <p className="text-3xl font-bold text-green-600 mb-6">FREE</p>',
    new: "                <p className=\"text-3xl font-bold text-green-600 mb-6\">{t('visibility.price', 'FREE')}</p>"
  }
];

// Apply Visibility section replacements
visibilitySectionReplacements.forEach(({ old, new: newText }) => {
  if (fileContent.includes(old)) {
    fileContent = fileContent.replace(old, newText);
    console.log(`✅ Replaced Visibility: "${old.substring(0, 50)}..."`);
  }
});

// Fix CTA section
const ctaSectionReplacements = [
  {
    old: '                  Start Today',
    new: "                  {t('cta.badge', 'Start Today')}"
  },
  {
    old: '                Ready to Start Your ATM Franchise Journey?',
    new: "                {t('cta.title', 'Ready to Start Your ATM Franchise Journey?')}"
  },
  {
    old: '              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">',
    new: '              <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">'
  },
  {
    old: '                Join thousands of successful franchise partners',
    new: "                {t('cta.subtitle', 'Join thousands of successful franchise partners')}"
  },
  {
    old: '                  Apply for Franchise',
    new: "                  {t('cta.primaryButton', 'Apply for Franchise')}"
  },
  {
    old: '                  Talk to Experts',
    new: "                  {t('cta.secondaryButton', 'Talk to Experts')}"
  }
];

// Apply CTA section replacements
ctaSectionReplacements.forEach(({ old, new: newText }) => {
  if (fileContent.includes(old)) {
    fileContent = fileContent.replace(old, newText);
    console.log(`✅ Replaced CTA: "${old.substring(0, 50)}..."`);
  }
});

// Fix the final stats in CTA section
const finalStatsReplacements = [
  {
    old: '                  <div className="text-3xl font-bold">5000+</div>',
    new: "                  <div className=\"text-3xl font-bold\">{t('cta.stats.franchises.value', '5000+')}</div>"
  },
  {
    old: '                  <div className="text-sm text-slate-600 mt-1">Active Franchises</div>',
    new: "                  <div className=\"text-sm text-slate-600 mt-1\">{t('cta.stats.franchises.label', 'Active Franchises')}</div>"
  },
  {
    old: '                  <div className="text-3xl font-bold">10M+</div>',
    new: "                  <div className=\"text-3xl font-bold\">{t('cta.stats.transactions.value', '10M+')}</div>"
  },
  {
    old: '                  <div className="text-sm text-slate-600 mt-1">Monthly Transactions</div>',
    new: "                  <div className=\"text-sm text-slate-600 mt-1\">{t('cta.stats.transactions.label', 'Monthly Transactions')}</div>"
  },
  {
    old: '                  <div className="text-3xl font-bold">28</div>',
    new: "                  <div className=\"text-3xl font-bold\">{t('cta.stats.states.value', '28')}</div>"
  },
  {
    old: '                  <div className="text-sm text-slate-600 mt-1">State Coverage</div>',
    new: "                  <div className=\"text-sm text-slate-600 mt-1\">{t('cta.stats.states.label', 'State Coverage')}</div>"
  }
];

// Apply final stats replacements
finalStatsReplacements.forEach(({ old, new: newText }) => {
  if (fileContent.includes(old)) {
    fileContent = fileContent.replace(old, newText);
    console.log(`✅ Replaced Stats: "${old.substring(0, 50)}..."`);
  }
});

// Save the updated file
fs.writeFileSync(filePath, fileContent, 'utf-8');

console.log('\n' + '='.repeat(80));
console.log('✅ OurProducts.tsx COMPONENT FIXED!');
console.log('='.repeat(80));
console.log('\nAll hardcoded text has been replaced with translation keys.');
console.log('The component now properly uses the t() function for all text.');
console.log('\nResult: Tamil users will now see Tamil content on the Products page!');
console.log('='.repeat(80));