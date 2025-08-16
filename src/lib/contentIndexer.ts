// Content indexing system for search functionality
export interface SearchContent {
  title: string;
  path: string;
  section?: string;
  anchor?: string;
  description: string;
  category: string;
  keywords: string[];
  content: string;
  priority: number; // Higher number = higher priority in search results
}

// Comprehensive content index based on actual website content
export const contentIndex: SearchContent[] = [
  // Home Page Content
  {
    title: "ATM Franchise India - Home",
    path: "/",
    description: "Start your ATM franchise business with minimal investment. Join 200+ successful partners across India.",
    category: "Home",
    keywords: ["atm franchise", "home", "main page", "start business", "200+ partners", "minimal investment"],
    content: "ATM Franchise India main page. Join 200+ successful partners and start your profitable ATM business today with minimal investment. Trusted ATM franchise partner.",
    priority: 10
  },
  {
    title: "200+ ATMs Across India",
    path: "/",
    section: "stats",
    description: "We have 200+ ATMs across India and counting",
    category: "Stats",
    keywords: ["200+ atms", "across india", "statistics", "network", "presence"],
    content: "200+ ATMs across India and counting. Large network of ATM installations across the country.",
    priority: 8
  },

  // Become Franchise Page Content
  {
    title: "Become ATM Franchise Partner",
    path: "/become-franchise",
    description: "Join 200+ successful partners and start your profitable ATM business today with minimal investment.",
    category: "Franchise",
    keywords: ["become franchise", "franchise partner", "atm franchise", "profitable business", "minimal investment", "200+ partners"],
    content: "Become an ATM Franchise Partner. Join 200+ successful partners and start your profitable ATM business today with minimal investment. Trusted ATM franchise partner with quick ROI, dedicated support, proven network, and training included.",
    priority: 10
  },
  {
    title: "Franchise Application Process",
    path: "/become-franchise",
    section: "process",
    anchor: "process-steps",
    description: "Simple 4-step process: Apply, Agreement, Installation, Start Earning",
    category: "Process",
    keywords: ["application process", "4 step process", "apply", "agreement", "installation", "start earning", "franchise process"],
    content: "Simple 4-Step Process: 1. Apply - Submit your franchise application online, 2. Agreement - Complete documentation and sign agreement, 3. Installation - We handle ATM setup and installation, 4. Start Earning - Begin receiving monthly passive income.",
    priority: 9
  },
  {
    title: "Franchise Benefits",
    path: "/become-franchise",
    section: "benefits",
    description: "Quick ROI, Dedicated Support, Proven Network, Training Included",
    category: "Benefits",
    keywords: ["franchise benefits", "quick roi", "dedicated support", "proven network", "training", "24/7 support", "500+ partners"],
    content: "Franchise Benefits: Quick ROI - Fast return on investment with proven business model, Dedicated Support - 24/7 technical and business support from our expert team, Proven Network - Join 500+ successful franchise partners across India, Training Included - Comprehensive training and ongoing support provided.",
    priority: 9
  },
  {
    title: "Enquiry Form",
    path: "/become-franchise",
    section: "enquiry",
    anchor: "enquiry-form",
    description: "Fill out detailed enquiry form to get personalized information about ATM franchise opportunities",
    category: "Contact",
    keywords: ["enquiry form", "application", "contact", "personalized information", "franchise opportunities"],
    content: "Start Your ATM Franchise Journey. Fill out our detailed enquiry form to get personalized information about ATM franchise opportunities in your area.",
    priority: 8
  },

  // Why ATM Business Content
  {
    title: "Why ATM Business",
    path: "/become-franchise",
    section: "why-atm",
    anchor: "why-atm",
    description: "Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies",
    category: "Business Benefits",
    keywords: ["why atm business", "zero loss", "transparent business", "rbi licensed", "investment opportunity"],
    content: "Why ATM Business? Zero Loss and Fully Transparent Business Opportunity from RBI Licensed Companies. 50% Return On Investment - All Payout Received by RBI Licensed WLA ATM Partners. Low ATM penetration - Only 15 ATMs per 1Lac People in India. 75% Cash Circulation - Indian Economy is still Largely Cash based. 90% Banks Offsite ATMs closing down creates Large market opportunity.",
    priority: 10
  },
  {
    title: "ATM Business ROI",
    path: "/become-franchise",
    section: "why-atm",
    description: "Up to 50% Return On Investment from RBI Licensed WLA ATM Partners",
    category: "ROI",
    keywords: ["50% roi", "return on investment", "rbi licensed", "wla atm", "investment returns", "profit"],
    content: "Up to 50% Return On Investment. All Payout Received by RBI Licensed WLA ATM Partners. Fast return on investment with proven business model.",
    priority: 10
  },
  {
    title: "ATM Market Opportunity",
    path: "/become-franchise",
    section: "why-atm",
    description: "Only 15 ATMs per 1Lac People - Low penetration creates huge opportunity",
    category: "Market",
    keywords: ["market opportunity", "15 atms per lac", "low penetration", "huge opportunity", "market gap"],
    content: "Only 15 ATMs per 1Lac People. ATM Penetration in India is very Low. 90% of Banks Offsite ATMs are closing down creating a Large market for ATMs. Perfect Time for ATM Business in Rural India.",
    priority: 9
  },
  {
    title: "Investment Range",
    path: "/become-franchise",
    section: "why-atm",
    description: "Investment Range: ₹2-5 Lakhs for ATM business",
    category: "Investment",
    keywords: ["investment range", "2-5 lakhs", "investment amount", "cost", "capital required"],
    content: "Investment Range: ₹2-5 Lakhs. Perfect Time for ATM Business in Rural India with Digital Adoption Growing, Government Push for Financial Inclusion, and Bank Branch Closures.",
    priority: 9
  },

  // WLA Operators Content
  {
    title: "RBI Licensed WLA Operators",
    path: "/become-franchise",
    section: "wla-operators",
    anchor: "wla-comparison",
    description: "Partner with trusted RBI licensed White Label ATM operators like EPS BANCS, FINDI, India1, Vakrangee",
    category: "WLA Operators",
    keywords: ["wla operators", "rbi licensed", "white label atm", "eps bancs", "findi", "india1", "vakrangee", "trusted operators"],
    content: "RBI Licensed WLA Operators. Partner with trusted and RBI licensed White Label ATM operators including EPS BANCS, FINDI, India1, and Vakrangee. All operators are RBI licensed and provide reliable ATM services.",
    priority: 9
  },

  // Agent Program Content
  {
    title: "Sales Agent Program",
    path: "/agent",
    description: "Join as sales agent and earn commissions by promoting ATM franchise opportunities",
    category: "Partnership",
    keywords: ["sales agent", "agent program", "commission", "partnership", "earn money", "promote franchise"],
    content: "Sales Agent Program. Join as sales agent and earn commissions by promoting ATM franchise opportunities. Become a partner and help others start their ATM business while earning attractive commissions.",
    priority: 8
  },

  // Influencer Program Content
  {
    title: "Influencer Program",
    path: "/influencer",
    description: "Join our influencer partnership program and promote ATM franchise opportunities",
    category: "Partnership",
    keywords: ["influencer program", "influencer partnership", "social media", "marketing", "promotion", "collaborate"],
    content: "Influencer Program. Join our influencer partnership program and promote ATM franchise opportunities through your social media channels. Collaborate with us to reach more potential franchise partners.",
    priority: 7
  },

  // Location Submission Content
  {
    title: "Submit Location for ATM Placement",
    path: "/submit-location",
    description: "Submit your location for ATM placement and earn passive income",
    category: "Location",
    keywords: ["submit location", "atm placement", "location submission", "site submission", "passive income", "placement opportunity"],
    content: "Submit Location for ATM Placement. Submit your location details for ATM installation and start earning passive income. We evaluate locations for ATM placement opportunities.",
    priority: 8
  },

  // Jobs and Career Content
  {
    title: "Job Opportunities",
    path: "/join-us/jobs",
    description: "Career opportunities at ATM Franchise India. Join our growing team",
    category: "Jobs",
    keywords: ["job opportunities", "career", "employment", "jobs", "join team", "work with us", "hiring"],
    content: "Job Opportunities. Career opportunities at ATM Franchise India. Join our growing team and be part of the expanding ATM business sector. Various positions available.",
    priority: 7
  },
  {
    title: "Join Us",
    path: "/join-us",
    description: "Join our team and grow with ATM Franchise India",
    category: "Career",
    keywords: ["join us", "join team", "career", "work with us", "employment", "team", "grow together"],
    content: "Join Us. Join our team and grow with ATM Franchise India. Be part of our mission to expand ATM accessibility across India.",
    priority: 7
  },

  // Contact and Support Content
  {
    title: "Contact Us",
    path: "/contact-us",
    description: "Get in touch with our team for ATM franchise support and enquiries",
    category: "Support",
    keywords: ["contact us", "contact", "support", "help", "enquiry", "get in touch", "customer service"],
    content: "Contact Us. Get in touch with our team for ATM franchise support and enquiries. We provide comprehensive support for all your ATM business needs.",
    priority: 8
  },

  // About Us Content
  {
    title: "About ATM Franchise India",
    path: "/about-us",
    description: "Learn about ATM Franchise India - leading ATM franchise provider",
    category: "Company",
    keywords: ["about us", "about company", "company information", "team", "story", "who we are"],
    content: "About ATM Franchise India. Learn about our company, team, and mission to provide the best ATM franchise opportunities across India. Leading ATM franchise provider.",
    priority: 7
  },

  // Products and Services Content
  {
    title: "Our Products",
    path: "/our-products",
    description: "ATM machines and solutions for your franchise business",
    category: "Products",
    keywords: ["our products", "atm machines", "atm solutions", "products", "hardware", "atm equipment"],
    content: "Our Products. ATM machines and solutions for your franchise business. Quality ATM equipment and hardware for reliable operations.",
    priority: 7
  },

  // Start ATM Business
  {
    title: "Start ATM Business",
    path: "/startatm",
    description: "Start your ATM business journey with our comprehensive support",
    category: "Getting Started",
    keywords: ["start atm", "start business", "atm business", "begin journey", "getting started"],
    content: "Start ATM Business. Begin your ATM business journey with our comprehensive support and guidance. Complete process from application to installation.",
    priority: 9
  },

  // Blog Content
  {
    title: "Blog - ATM Business Insights",
    path: "/blog",
    description: "Read our latest articles on ATM business, passive income, and franchise opportunities",
    category: "Blog",
    keywords: ["blog", "articles", "insights", "atm business", "passive income", "franchise", "business tips"],
    content: "Blog - ATM Business Insights. Read our latest articles on ATM business, passive income strategies, and franchise opportunities. Stay updated with industry trends and tips.",
    priority: 6
  },
  {
    title: "Passive Income Financial Freedom",
    path: "/blog/passive-income-financial-freedom",
    description: "Generate passive income through ATM business and achieve financial freedom",
    category: "Passive Income",
    keywords: ["passive income", "financial freedom", "atm passive income", "recurring income", "financial independence"],
    content: "Passive Income Financial Freedom. Generate passive income through ATM business and achieve financial freedom. Learn strategies for building recurring income streams through ATM franchise.",
    priority: 9
  },
  {
    title: "Perfect Time Side Hustle 2025",
    path: "/blog/perfect-time-side-hustle-2025",
    description: "Why 2025 is the perfect time to start ATM business as a side hustle",
    category: "Side Hustle",
    keywords: ["side hustle", "2025", "perfect time", "part time business", "extra income", "side business"],
    content: "Perfect Time Side Hustle 2025. Why 2025 is the perfect time to start ATM business as a side hustle. Market conditions favor ATM business growth with increasing digital adoption.",
    priority: 8
  },

  // Legal Pages
  {
    title: "Privacy Policy",
    path: "/privacy-policy",
    description: "Our privacy policy and data protection information",
    category: "Legal",
    keywords: ["privacy policy", "privacy", "data protection", "legal", "policy"],
    content: "Privacy Policy. Our privacy policy and data protection information. How we collect, use, and protect your personal information.",
    priority: 3
  },
  {
    title: "Terms and Conditions",
    path: "/terms-conditions",
    description: "Terms and conditions for using our services",
    category: "Legal",
    keywords: ["terms conditions", "terms", "legal", "agreement", "service terms"],
    content: "Terms and Conditions. Terms and conditions for using our ATM franchise services and website.",
    priority: 3
  },
  {
    title: "Refund Policy",
    path: "/refund-policy",
    description: "Our refund and cancellation policy",
    category: "Legal",
    keywords: ["refund policy", "refund", "cancellation", "return policy"],
    content: "Refund Policy. Our refund and cancellation policy for ATM franchise services.",
    priority: 3
  }
];

// Search function with improved relevance scoring
export function searchContent(query: string): SearchContent[] {
  if (!query.trim()) return [];
  
  const lowercaseQuery = query.toLowerCase();
  const queryWords = lowercaseQuery.split(' ').filter(word => word.length > 0);
  
  return contentIndex
    .map(item => {
      let score = 0;
      let titleMatch = false;
      let contentMatch = false;
      
      // Exact title match (highest priority)
      if (item.title.toLowerCase().includes(lowercaseQuery)) {
        score += 100;
        titleMatch = true;
      }
      
      // Partial title match
      queryWords.forEach(word => {
        if (item.title.toLowerCase().includes(word)) {
          score += 50;
          titleMatch = true;
        }
      });
      
      // Description match
      if (item.description.toLowerCase().includes(lowercaseQuery)) {
        score += 30;
      }
      
      queryWords.forEach(word => {
        if (item.description.toLowerCase().includes(word)) {
          score += 15;
        }
      });
      
      // Content match
      if (item.content.toLowerCase().includes(lowercaseQuery)) {
        score += 25;
        contentMatch = true;
      }
      
      queryWords.forEach(word => {
        if (item.content.toLowerCase().includes(word)) {
          score += 10;
          contentMatch = true;
        }
      });
      
      // Keyword match
      item.keywords.forEach(keyword => {
        if (keyword.includes(lowercaseQuery)) {
          score += 40;
        }
        queryWords.forEach(word => {
          if (keyword.includes(word)) {
            score += 20;
          }
        });
      });
      
      // Category match
      if (item.category.toLowerCase().includes(lowercaseQuery)) {
        score += 30;
      }
      
      // Priority boost
      score += item.priority;
      
      // Boost for exact matches
      if (titleMatch && contentMatch) {
        score += 50;
      }
      
      return { ...item, searchScore: score };
    })
    .filter(item => item.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 10); // Return top 10 results
}