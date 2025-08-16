import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Website content to index for search
    const websiteContent = [
      {
        page_path: '/',
        page_title: 'ATM Franchise India - Home',
        content_section: 'Hero Section',
        content_text: 'ATM Franchise India offers comprehensive ATM franchise opportunities across India. Build your passive income with our proven business model. Join thousands of successful entrepreneurs.',
        keywords: ['ATM', 'franchise', 'business', 'passive income', 'entrepreneur']
      },
      {
        page_path: '/',
        page_title: 'ATM Franchise India - Home',
        content_section: 'Services Overview',
        content_text: 'We provide White Label ATM solutions, complete setup support, ongoing maintenance, technical assistance, and business development guidance.',
        keywords: ['White Label ATM', 'WLA', 'setup', 'maintenance', 'support']
      },
      {
        page_path: '/become-franchise',
        page_title: 'Become Franchise',
        content_section: 'Franchise Information',
        content_text: 'Start your ATM franchise business with low investment and high returns. We offer comprehensive training, location assistance, and ongoing support for franchise partners.',
        keywords: ['franchise', 'low investment', 'high returns', 'training', 'location assistance']
      },
      {
        page_path: '/become-franchise',
        page_title: 'Become Franchise',
        content_section: 'WLA ATM Details',
        content_text: 'White Label ATMs (WLA) are owned and operated by non-bank entities. These ATMs provide the same services as bank ATMs but are managed by private organizations, offering great business opportunities.',
        keywords: ['WLA ATM', 'White Label ATM', 'non-bank', 'private', 'business opportunity']
      },
      {
        page_path: '/agent',
        page_title: 'Sales Agent Program',
        content_section: 'Agent Benefits',
        content_text: 'Join as Sales Agent with unlimited commission earning potential. Flexible work schedule, full-time or part-time opportunities. Be part of financial inclusion mission with training and marketing support.',
        keywords: ['sales agent', 'commission', 'flexible work', 'financial inclusion', 'training']
      },
      {
        page_path: '/influencer',
        page_title: 'Influencer Program',
        content_section: 'Influencer Partnership',
        content_text: 'Partner with Sahasra Network Influencer Program. Earn attractive commissions promoting ATM franchise opportunities. No minimum follower requirement, transparent commission structure.',
        keywords: ['influencer', 'partnership', 'commissions', 'social media', 'Sahasra Network']
      },
      {
        page_path: '/our-products',
        page_title: 'Our Products',
        content_section: 'ATM Products',
        content_text: 'We offer various ATM models including cash dispensers, cash recyclers, and multi-function kiosks. All machines are certified and support multiple banking networks.',
        keywords: ['ATM models', 'cash dispensers', 'cash recyclers', 'kiosks', 'banking networks']
      },
      {
        page_path: '/about-us',
        page_title: 'About Us',
        content_section: 'Company Information',
        content_text: 'ATM Franchise India is a trusted business partner since 2020. We are part of PixellPay group companies with 4+ years of proven track record in ATM business.',
        keywords: ['trusted partner', '2020', 'PixellPay', '4 years', 'track record']
      },
      {
        page_path: '/our-services',
        page_title: 'Our Services',
        content_section: 'Service Portfolio',
        content_text: 'Complete ATM business services including site selection, installation, maintenance, cash management, monitoring, and technical support. End-to-end solutions for ATM operators.',
        keywords: ['site selection', 'installation', 'maintenance', 'cash management', 'monitoring', 'technical support']
      },
      {
        page_path: '/submit-location',
        page_title: 'Submit Location',
        content_section: 'Location Requirements',
        content_text: 'Submit your location for ATM installation. We evaluate locations based on footfall, accessibility, security, and commercial viability. Help us expand our ATM network.',
        keywords: ['location submission', 'footfall', 'accessibility', 'security', 'commercial viability']
      },
      {
        page_path: '/join-us/jobs',
        page_title: 'Career Opportunities',
        content_section: 'Job Openings',
        content_text: 'Career opportunities at ATM Franchise India. Sales Manager positions for agent network development. Competitive salary with performance incentives and professional growth.',
        keywords: ['career', 'jobs', 'sales manager', 'agent network', 'competitive salary', 'growth']
      },
      {
        page_path: '/contact-us',
        page_title: 'Contact Us',
        content_section: 'Contact Information',
        content_text: 'Contact ATM Franchise India for business inquiries. Phone: +91 9072380076, Email: atmfranchise@pixellpay.com. Office located in Bangalore, Karnataka.',
        keywords: ['contact', 'phone', 'email', 'Bangalore', 'Karnataka', 'business inquiries']
      }
    ]

    // Clear existing content and insert new content
    const { error: deleteError } = await supabase
      .from('search_content')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records

    if (deleteError) {
      console.error('Error clearing search content:', deleteError)
    }

    // Insert all content
    const { data, error } = await supabase
      .from('search_content')
      .insert(websiteContent)

    if (error) {
      console.error('Error inserting search content:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to index website content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ 
        message: 'Website content indexed successfully', 
        indexed_items: websiteContent.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Indexing error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error during indexing' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})