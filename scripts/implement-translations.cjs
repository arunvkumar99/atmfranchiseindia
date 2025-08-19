#!/usr/bin/env node

/**
 * Script to implement translations across all pages
 * This will create translation JSON files for all missing pages
 */

const fs = require('fs').promises;
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Translation configurations for each page
const pageTranslations = {
  agent: {
    title: "Become an Agent",
    subtitle: "Partner with us as an ATM agent and earn commission",
    hero: {
      badge: "Agent Partnership Program",
      heading: "Become an ATM Agent",
      description: "Join our network of successful agents earning steady commission",
      cta: "Apply Now"
    },
    benefits: {
      title: "Agent Benefits",
      commission: "High Commission",
      support: "Full Support",
      training: "Free Training", 
      flexible: "Flexible Hours"
    },
    form: {
      title: "Agent Application Form",
      submit: "Submit Application"
    }
  },
  
  influencer: {
    title: "Influencer Program",
    subtitle: "Earn by promoting ATM franchise opportunities",
    hero: {
      badge: "Influencer Partnership",
      heading: "Become an Influencer Partner",
      description: "Use your influence to earn substantial commissions",
      cta: "Join Program"
    },
    benefits: {
      title: "Why Join as Influencer",
      earnings: "High Earnings Potential",
      support: "Marketing Support",
      materials: "Ready Materials",
      tracking: "Real-time Tracking"
    },
    form: {
      title: "Influencer Registration",
      submit: "Register Now"
    }
  },

  jobs: {
    title: "Career Opportunities",
    subtitle: "Join our growing team",
    hero: {
      heading: "Build Your Career With Us",
      description: "Explore exciting opportunities in the ATM industry",
      cta: "View Openings"
    },
    positions: {
      title: "Open Positions",
      location: "Location",
      type: "Job Type",
      experience: "Experience",
      apply: "Apply Now"
    },
    benefits: {
      title: "Why Work With Us",
      growth: "Career Growth",
      culture: "Great Culture",
      benefits: "Competitive Benefits",
      learning: "Continuous Learning"
    }
  },

  startAtm: {
    title: "Start Your ATM Business",
    subtitle: "Complete guide to starting an ATM business in India",
    hero: {
      heading: "Start Your ATM Business Today",
      description: "Everything you need to know about starting an ATM business",
      cta: "Get Started"
    },
    steps: {
      title: "How to Start",
      research: {
        title: "Research & Planning",
        description: "Understand the market and create a business plan"
      },
      legal: {
        title: "Legal Requirements",
        description: "Complete all regulatory and compliance requirements"
      },
      funding: {
        title: "Arrange Funding",
        description: "Secure investment for your ATM business"
      },
      location: {
        title: "Find Locations",
        description: "Identify high-traffic locations for ATMs"
      },
      launch: {
        title: "Launch Operations",
        description: "Start your ATM business operations"
      }
    },
    guide: {
      title: "Complete Business Guide",
      download: "Download Guide"
    }
  },

  privacy: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated",
    sections: {
      introduction: "Introduction",
      dataCollection: "Data Collection",
      dataUsage: "How We Use Your Data",
      dataProtection: "Data Protection",
      cookies: "Cookies Policy",
      thirdParty: "Third Party Services",
      userRights: "Your Rights",
      contact: "Contact Information",
      changes: "Changes to Policy"
    }
  },

  terms: {
    title: "Terms and Conditions",
    lastUpdated: "Last Updated",
    sections: {
      acceptance: "Acceptance of Terms",
      services: "Services Description",
      userResponsibilities: "User Responsibilities", 
      intellectualProperty: "Intellectual Property",
      limitations: "Limitations of Liability",
      indemnification: "Indemnification",
      termination: "Termination",
      governingLaw: "Governing Law",
      contact: "Contact Information"
    }
  },

  refund: {
    title: "Refund Policy",
    lastUpdated: "Last Updated",
    sections: {
      overview: "Policy Overview",
      eligibility: "Refund Eligibility",
      process: "Refund Process",
      timeline: "Processing Timeline",
      exceptions: "Exceptions",
      contact: "Contact for Refunds"
    }
  },

  accessibility: {
    title: "Accessibility Statement",
    commitment: {
      title: "Our Commitment",
      description: "We are committed to ensuring digital accessibility for all users"
    },
    standards: {
      title: "Accessibility Standards",
      wcag: "WCAG 2.1 Level AA Compliance",
      testing: "Regular Accessibility Testing",
      feedback: "User Feedback Integration"
    },
    features: {
      title: "Accessibility Features",
      keyboard: "Keyboard Navigation",
      screenReader: "Screen Reader Support",
      contrast: "High Contrast Options",
      textSize: "Adjustable Text Size"
    },
    contact: {
      title: "Accessibility Feedback",
      description: "We welcome your feedback on accessibility",
      email: "Email Us",
      phone: "Call Us"
    }
  },

  pixellpay: {
    title: "Pixellpay Advantage",
    subtitle: "Advanced payment solutions for modern banking",
    hero: {
      heading: "The Pixellpay Advantage",
      description: "Cutting-edge technology for seamless transactions",
      cta: "Learn More"
    },
    features: {
      title: "Key Features",
      security: {
        title: "Enhanced Security",
        description: "Bank-grade security for all transactions"
      },
      speed: {
        title: "Lightning Fast",
        description: "Process transactions in seconds"
      },
      reliability: {
        title: "99.9% Uptime",
        description: "Reliable service you can count on"
      },
      support: {
        title: "24/7 Support",
        description: "Round-the-clock technical assistance"
      }
    },
    technology: {
      title: "Our Technology",
      description: "Built with latest fintech innovations"
    }
  },

  notFound: {
    title: "Page Not Found",
    heading: "404 - Page Not Found",
    message: "Sorry, the page you are looking for doesn't exist.",
    suggestion: "You may have mistyped the address or the page may have moved.",
    cta: {
      home: "Go to Homepage",
      contact: "Contact Support"
    }
  },

  blog: {
    title: "Blog & Insights",
    subtitle: "Latest news and insights from the ATM industry",
    hero: {
      heading: "Industry Insights & Updates",
      description: "Stay informed with latest trends in ATM business"
    },
    categories: {
      all: "All Posts",
      business: "Business",
      technology: "Technology",
      industry: "Industry News",
      guides: "Guides"
    },
    post: {
      readMore: "Read More",
      minRead: "min read",
      by: "By",
      published: "Published on",
      share: "Share Article"
    },
    newsletter: {
      title: "Subscribe to Newsletter",
      description: "Get latest updates delivered to your inbox",
      placeholder: "Enter your email",
      subscribe: "Subscribe"
    }
  }
};

async function createTranslationFiles() {
  try {
    // Ensure locales directory exists
    await fs.mkdir(LOCALES_DIR, { recursive: true });
    
    // Create English locale directory
    const enDir = path.join(LOCALES_DIR, 'en');
    await fs.mkdir(enDir, { recursive: true });
    
    // Write translation files
    for (const [key, translations] of Object.entries(pageTranslations)) {
      const filePath = path.join(enDir, `${key}.json`);
      await fs.writeFile(filePath, JSON.stringify(translations, null, 2));
      console.log(`✅ Created ${key}.json`);
    }
    
    console.log('\n✨ Translation files created successfully!');
    console.log('Next steps:');
    console.log('1. Update page components to use useTranslation hook');
    console.log('2. Run translation script to generate other language versions');
    
  } catch (error) {
    console.error('❌ Error creating translation files:', error);
  }
}

// Run the script
createTranslationFiles();