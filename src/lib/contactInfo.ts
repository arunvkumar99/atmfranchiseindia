// Centralized contact information - source of truth from Contact Us page
export const CONTACT_INFO = {
  phone: '+91 9072380076',
  email: 'atmfranchise@pixellpay.com',
  supportEmail: 'atmfranchise@pixellpay.com', // Unified support email
  
  // Office addresses
  corporateOffice: {
    name: 'PIXELLPAY INNOVATIONS PRIVATE LIMITED',
    cin: 'CIN# U62013KA2023PTC177697',
    address: '# 48/1744 - C72, 10TH FLOOR, JOMER SYMPHONY,\nNH BYPASS, PONNURUNNI, KOCHI – 682019, KERALA'
  },
  
  registeredOffice: {
    address: '#45 ALANKAR PLAZA KOTTHAR, DINNE MAIN ROAD,\nBANNERGHATTA ROAD, BANGALORE 560076'
  },
  
  // Formatted versions for display
  phoneFormatted: '+91 9072380076',
  phoneHref: 'tel:+919072380076',
  emailHref: 'mailto:atmfranchise@pixellpay.com'
};

// Validate contact info consistency
export function validateContactInfo() {
  console.log('📞 Contact Info Validation:', {
    phone: CONTACT_INFO.phone,
    email: CONTACT_INFO.email,
    lastUpdated: new Date().toISOString()
  });
}