import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SUPPORTED_LANGUAGES = ['hi', 'bn', 'ta', 'te', 'mr', 'gu', 'ur', 'kn', 'or', 'pa', 'as', 'ml'];

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        from: 'en',
        to: targetLang,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.translatedText || text;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    return text; // Return original text if translation fails
  }
}

async function getWebsiteContent(): Promise<{ path: string; content: string[] }[]> {
  // Define all website pages and their content
  return [
    {
      path: '/',
      content: [
        'ATM Franchise India',
        'Your Gateway to Financial Independence',
        'Start Your ATM Business with Confidence',
        'Get Started Today',
        'Why Choose ATM Business',
        'Investment Range: ₹2-5 Lakhs',
        'Monthly ROI: 15-25%',
        'Passive Income Opportunity',
        'Full Support Provided',
        'Expert Guidance',
        'Quick Setup',
        'Prime Locations',
        'Trusted by Nationwide Businesses',
        'Active Partners',
        '1000+',
        'Industry Experience',
        '5+ Years',
        'Uptime Guarantee',
        '99.9%',
        '24/7',
        'Market Opportunity',
        'Perfect Time for ATM Business in Rural India',
        'Indian Economy is still Largely Cash based',
        '75% Cash',
        '• Digital Adoption Growing',
        '• Bank Branch Closures',
        'Why Choose ALRC',
        'Expert Guidance on WLA Operators',
        'Gain accurate and verified insights into the ATM industry. As a regulated sector, the ATM business often sees widespread misinformation. Our representatives ensure you receive reliable, fact-based guidance to make informed franchise decisions.',
        'Comprehensive End-to-End Support',
        'With 4+ years of experience across all WLA brands, we handle everything: Franchise onboarding, Training & operational setup, Local promotions & brand visibility, Technical support & troubleshooting, Bank account settlements, Dispute resolution with WLA operators. We\'re your one-stop solution for ATM business success.',
        'Start Your Journey Today',
        'Ready to transform your financial future?',
        'Contact Us Now'
      ]
    },
    {
      path: '/become-franchise',
      content: [
        'Become a Franchise Partner',
        'Join Our Growing Network',
        'Franchise Application',
        'Personal Information',
        'First Name',
        'Last Name',
        'Date of Birth',
        'Email Address',
        'Phone Number',
        'Alternate Phone',
        'Address Information',
        'Address Line 1',
        'Address Line 2',
        'City',
        'State',
        'Pincode',
        'Preferred Location',
        'Business Information',
        'Current Occupation',
        'Years of Experience',
        'Business Type',
        'Investment Budget',
        'Monthly Income',
        'Net Worth',
        'Credit Score',
        'Funding Source',
        'Space Information',
        'Space Availability',
        'Space Size',
        'Additional Information',
        'Why do you want to join ATM business?',
        'Any additional information you\'d like to share',
        'I agree to the terms and conditions',
        'Submit Application',
        'Application submitted successfully!'
      ]
    },
    {
      path: '/contact-us',
      content: [
        'Contact Us',
        'Get in Touch',
        'Contact Information',
        'Name',
        'Email',
        'Phone',
        'Subject',
        'Message',
        'Send Message',
        'Our Office',
        'Corporate Office:',
        '# 48/1744 - C72, 10TH FLOOR, JOMER SYMPHONY, NH BYPASS, PONNURUNNI, KOCHI – 682019, KERALA',
        'Registered Office:',
        '#45 ALANKAR PLAZA KOTTHAR, DINNE MAIN ROAD, BANNERGHATTA ROAD, BANGALORE 560076',
        'Our Location',
        'PIXELLPAY Corporate Office',
        'Kochi, Kerala',
        'Click to view on Google Maps',
        'View on Google Maps'
      ]
    },
    {
      path: '/submit-location',
      content: [
        'Submit Location',
        'Share Your Location Details',
        'Location Information',
        'Full Name',
        'Phone Number',
        'WhatsApp Number',
        'Email Address',
        'Location Name',
        'Address',
        'City',
        'District',
        'State',
        'Pincode',
        'Google Map Link',
        'Room Photo',
        'Building Photo',
        'Agent Details',
        'Assisted by Agent',
        'Agent Code',
        'Additional Information',
        'Submit Location',
        'Location submitted successfully!'
      ]
    },
    {
      path: '/agent',
      content: [
        'Agent Registration',
        'Join as Our Agent',
        'Agent Application',
        'Personal Details',
        'Full Name',
        'Gender',
        'Date of Birth',
        'Phone Number',
        'WhatsApp Number',
        'Email Address',
        'Documents',
        'PAN Number',
        'PAN Document',
        'Aadhaar Number',
        'Aadhaar Front',
        'Aadhaar Back',
        'Photo',
        'Address Details',
        'Permanent Address',
        'Current Address',
        'State',
        'District',
        'Professional Details',
        'Joining As',
        'Why do you want to join?',
        'Languages Known',
        'Submit Application',
        'Agent registration submitted successfully!'
      ]
    },
    {
      path: '/jobs',
      content: [
        'Career Opportunities',
        'Join Our Team',
        'Job Application',
        'Job Title',
        'Candidate Name',
        'Phone Number',
        'Email Address',
        'Current Location',
        'Experience',
        'Expected Salary',
        'Notice Period',
        'Upload CV',
        'Apply Now',
        'Application submitted successfully!'
      ]
    },
    {
      path: '/influencer',
      content: [
        'Influencer Program',
        'Partner with Us',
        'Influencer Application',
        'Personal Information',
        'Social Media Links',
        'Facebook Link',
        'Instagram Link',
        'YouTube Link',
        'LinkedIn Link',
        'Other Channel 1',
        'Other Channel 2',
        'Submit Application',
        'Influencer application submitted successfully!'
      ]
    }
  ];
}

async function storeTranslation(originalText: string, translatedText: string, languageCode: string, pagePath: string): Promise<void> {
  try {
    await supabase
      .from('website_translations')
      .upsert({
        original_text: originalText,
        translated_text: translatedText,
        language_code: languageCode,
        page_path: pagePath,
        content_key: `${pagePath}_${originalText.substring(0, 50)}`,
        content_type: 'text'
      });
  } catch (error) {
    console.error(`Error storing translation:`, error);
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Starting comprehensive batch translation...');
    
    const websiteContent = await getWebsiteContent();
    console.log(`📚 Processing ${websiteContent.length} pages`);

    let totalTranslations = 0;
    const results: Record<string, any> = {};

    // Process each page
    for (const page of websiteContent) {
      console.log(`📄 Processing page: ${page.path}`);
      
      // Process each language
      for (const lang of SUPPORTED_LANGUAGES) {
        console.log(`🌍 Translating ${page.path} to ${lang}`);
        const langResults: Record<string, string> = {};

        // Translate each content item
        for (const text of page.content) {
          if (text.trim().length > 0) {
            try {
              const translatedText = await translateText(text, lang);
              langResults[text] = translatedText;

              // Store in database
              await storeTranslation(text, translatedText, lang, page.path);
              totalTranslations++;
              
              // Small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (error) {
              console.error(`❌ Failed to translate "${text}" to ${lang}:`, error);
              langResults[text] = text; // Use original text as fallback
            }
          }
        }

        if (!results[page.path]) results[page.path] = {};
        results[page.path][lang] = langResults;
        
        console.log(`✅ Completed ${page.path} -> ${lang}: ${Object.keys(langResults).length} items`);
      }
    }

    console.log(`🎉 Batch translation complete! Total: ${totalTranslations} translations`);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully translated ${totalTranslations} items across ${websiteContent.length} pages and ${SUPPORTED_LANGUAGES.length} languages`,
        results,
        stats: {
          pages: websiteContent.length,
          languages: SUPPORTED_LANGUAGES.length,
          totalTranslations
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('❌ Batch translation error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Batch translation failed'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});