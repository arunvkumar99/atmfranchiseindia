// Initial Translation Job Runner
// Populates database with missing website translations

import { supabase } from '@/integrations/supabase/client';

const websiteContent = [
  {
    path: '/',
    title: 'Home Page',
    content_items: [
      { id: 'hero_title', text: 'Your ATM - Your Income', type: 'title' },
      { id: 'hero_desc', text: 'Start your own ATM franchise business with minimal investment and maximum returns', type: 'content' },
      { id: 'partnership', text: 'Partner with RBI licensed operators across India', type: 'content' },
      { id: 'submit_location', text: 'Submit ATM Location', type: 'button' },
      { id: 'become_franchise', text: 'Become Franchise', type: 'button' },
    ]
  },
  {
    path: '/become-franchise',
    title: 'Become Franchise',
    content_items: [
      { id: 'hero_title', text: 'Become an ATM Partner', type: 'title' },
      { id: 'join_partners', text: 'Join 200+ successful partners', type: 'content' },
      { id: 'profitable_business', text: 'profitable ATM business', type: 'content' },
      { id: 'minimal_investment', text: 'minimal investment', type: 'content' },
      { id: 'apply_now', text: 'Apply Now', type: 'button' },
      { id: 'process_title', text: 'Simple 4-Step Process', type: 'title' },
      { id: 'step_apply', text: 'Apply', type: 'step' },
      { id: 'step_apply_desc', text: 'Submit your franchise application online', type: 'content' },
      { id: 'step_agreement', text: 'Agreement', type: 'step' },
      { id: 'step_agreement_desc', text: 'Complete documentation and sign agreement', type: 'content' },
      { id: 'step_installation', text: 'Installation', type: 'step' },
      { id: 'step_installation_desc', text: 'We handle ATM setup and installation', type: 'content' },
      { id: 'step_earning', text: 'Start Earning', type: 'step' },
      { id: 'step_earning_desc', text: 'Begin generating monthly passive income', type: 'content' },
    ]
  },
  {
    path: '/contact-us',
    title: 'Contact Us',
    content_items: [
      { id: 'contact_title', text: 'Get in Touch', type: 'title' },
      { id: 'contact_desc', text: 'Contact our expert team for ATM franchise guidance', type: 'content' },
      { id: 'business_hours', text: 'Business Hours', type: 'label' },
      { id: 'monday_saturday', text: 'Monday to Saturday', type: 'content' },
      { id: 'response_time', text: 'Response Time', type: 'label' },
      { id: 'within_24_hours', text: 'Within 24 hours', type: 'content' },
    ]
  }
];

export async function runInitialTranslationPopulation(): Promise<{
  success: boolean;
  totalTranslated: number;
  errors: string[];
}> {
  console.log('🚀 Starting initial translation population for database...');
  
  let totalTranslated = 0;
  const errors: string[] = [];

  try {
    // Call our batch translate function
    const { data, error } = await supabase.functions.invoke('batch-translate', {
      body: {
        action: 'batch_translate',
        pages: websiteContent
      }
    });

    if (error) {
      console.error('❌ Translation job failed:', error);
      errors.push(`Translation job failed: ${error.message}`);
      return { success: false, totalTranslated: 0, errors };
    }

    if (data?.success) {
      totalTranslated = data.stats?.totalTranslations || 0;
      console.log(`✅ Translation job completed! Translated ${totalTranslated} items`);
    }

    return {
      success: true,
      totalTranslated,
      errors
    };

  } catch (error) {
    console.error('❌ Translation population error:', error);
    errors.push(`Translation error: ${error}`);
    
    return {
      success: false,
      totalTranslated: 0,
      errors
    };
  }
}

// Run the job immediately if this is imported
if (typeof window !== 'undefined') {
  runInitialTranslationPopulation().then(result => {
    if (result.success) {
      console.log(`🎉 Database populated with ${result.totalTranslated} translations!`);
    } else {
      console.log('❌ Translation population failed:', result.errors);
    }
  });
}