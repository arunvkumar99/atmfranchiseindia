import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const googleCredentials = Deno.env.get('GOOGLE_CREDENTIALS');
const googleSheetId = '1bgo7ciEivjYYzFVuAmG__MQ0fSTDgzf_3gHzjUnAoEQ';

// Function to get Google OAuth2 access token
async function getGoogleAccessToken() {
  if (!googleCredentials) {
    throw new Error('Google credentials not configured');
  }

  const credentials = JSON.parse(googleCredentials);
  const now = Math.floor(Date.now() / 1000);
  const expiry = now + 3600; // Token expires in 1 hour

  // Create JWT header
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  // Create JWT payload
  const payload = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: expiry,
    iat: now
  };

  // Encode header and payload
  const encodedHeader = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const privateKey = credentials.private_key;
  
  // Import the private key
  const keyData = privateKey.replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  
  const binaryKey = Uint8Array.from(atob(keyData), c => c.charCodeAt(0));
  
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign']
  );

  // Sign the JWT
  const signatureBuffer = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signatureInput)
  );

  const signature = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)))
    .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const jwt = `${signatureInput}.${signature}`;

  // Exchange JWT for access token
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Failed to get access token: ${error}`);
  }

  const tokenData = await tokenResponse.json();
  return tokenData.access_token;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tableName, data } = await req.json();
    
    console.log(`Processing data for table: ${tableName}`);
    console.log('Data:', data);

    if (!googleCredentials) {
      console.error('Missing Google Sheets credentials');
      return new Response(
        JSON.stringify({ error: 'Google Sheets integration not configured' }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get access token for Google Sheets API
    const accessToken = await getGoogleAccessToken();

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Map table names to sheet names and prepare data
    const sheetMapping: Record<string, string> = {
      'franchise_applications': 'Franchise Applications',
      'agent_submissions': 'Agent Submissions',
      'influencer_submissions': 'Influencer Submissions',
      'location_submissions': 'Location Submissions',
      'contact_submissions': 'Contact Submissions',
      
      'atm_enquiry_submissions': 'ATM Enquiry Submissions',
      'job_applications': 'Job Applications'
    };

    const sheetName = sheetMapping[tableName] || tableName;
    
    // Prepare row data based on table type
    let rowData: any[] = [];
    
    switch (tableName) {
      case 'franchise_applications':
        rowData = [
          data.first_name || '',
          data.last_name || '',
          data.email || '',
          data.phone || '',
          data.city || '',
          data.state || '',
          data.business_type || '',
          data.investment_budget || '',
          data.space_availability || '',
          data.current_occupation || '',
          data.experience_years || '',
          data.monthly_income || '',
          data.net_worth || '',
          new Date().toISOString()
        ];
        break;
        
      case 'agent_submissions':
        rowData = [
          data.full_name || '',
          data.email || '',
          data.phone || '',
          data.whatsapp_phone || '',
          data.state || '',
          data.district || '',
          data.joining_as || '',
          data.gender || '',
          data.languages?.join(', ') || '',
          data.why_join || '',
          data.pan_document_url || '',
          data.aadhaar_front_url || '',
          data.aadhaar_back_url || '',
          data.photo_url || '',
          new Date().toISOString()
        ];
        break;
        
      case 'influencer_submissions':
        rowData = [
          data.full_name || '',
          data.email || '',
          data.phone || '',
          data.whatsapp_phone || '',
          data.state || '',
          data.district || '',
          data.youtube_link || '',
          data.instagram_link || '',
          data.facebook_link || '',
          data.linkedin_link || '',
          data.languages?.join(', ') || '',
          data.pan_document_url || '',
          data.aadhaar_front_url || '',
          data.aadhaar_back_url || '',
          data.photo_url || '',
          new Date().toISOString()
        ];
        break;
        
      case 'location_submissions':
        rowData = [
          data.full_name || '',
          data.email || '',
          data.phone || '',
          data.whatsapp_phone || '',
          data.location_name || '',
          data.address || '',
          data.city || '',
          data.state || '',
          data.pincode || '',
          data.agent_code || '',
          data.assisted_by_agent ? 'Yes' : 'No',
          data.room_photo_url || '',
          data.building_photo_url || '',
          data.google_map_link || '',
          new Date().toISOString()
        ];
        break;
        
      case 'contact_submissions':
        rowData = [
          data.name || '',
          data.email || '',
          data.phone || '',
          data.subject || '',
          data.message || '',
          new Date().toISOString()
        ];
        break;
        
        
      case 'atm_enquiry_submissions':
        rowData = [
          data.full_name || '',
          data.email || '',
          data.phone || '',
          data.whatsapp_number || '',
          data.state || '',
          data.enquiry_purpose || '',
          data.occupation || '',
          data.has_own_space || '',
          new Date().toISOString()
        ];
        break;
        
      case 'job_applications':
        rowData = [
          data.job_title || '',
          data.candidate_name || '',
          data.phone || '',
          data.email || '',
          data.experience || '',
          data.current_location || '',
          data.expected_salary || '',
          data.notice_period || '',
          data.cv_file_url || '',
          new Date().toISOString()
        ];
        break;
        
      default:
        console.log('Unknown table type, using generic format');
        rowData = [JSON.stringify(data), new Date().toISOString()];
    }

    // Send data to Google Sheets using OAuth2 authentication
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${sheetName}!A:Z:append?valueInputOption=RAW`;
    
    const sheetsResponse = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        values: [rowData]
      }),
    });

    if (!sheetsResponse.ok) {
      const errorText = await sheetsResponse.text();
      console.error('Google Sheets API error:', errorText);
      throw new Error(`Google Sheets API error: ${sheetsResponse.status}`);
    }

    const sheetsResult = await sheetsResponse.json();
    console.log('Successfully added to Google Sheets:', sheetsResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data successfully sent to Google Sheets',
        sheetName,
        updatedRange: sheetsResult.updates?.updatedRange 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in google-sheets-integration function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});