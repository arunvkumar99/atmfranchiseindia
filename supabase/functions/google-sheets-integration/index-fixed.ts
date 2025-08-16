import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { SHEET_MAPPINGS, formatRowData } from './config.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Get configuration from environment variables
const googleCredentials = Deno.env.get('GOOGLE_CREDENTIALS');
const googleSheetId = Deno.env.get('GOOGLE_SHEET_ID') || '1bgo7ciEivjYYzFVuAmG__MQ0fSTDgzf_3gHzjUnAoEQ';

// Function to get Google OAuth2 access token
async function getGoogleAccessToken() {
  if (!googleCredentials) {
    throw new Error('Google credentials not configured. Please set GOOGLE_CREDENTIALS environment variable.');
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

// Function to ensure sheet has headers
async function ensureSheetHeaders(accessToken: string, sheetName: string, columns: string[]) {
  try {
    // Check if sheet exists and has headers
    const checkUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}!A1:AZ1`;
    
    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (checkResponse.status === 404) {
      // Sheet doesn't exist, need to create it
      console.log(`Creating new sheet: ${sheetName}`);
      
      const createSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}:batchUpdate`;
      const createSheetResponse = await fetch(createSheetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          requests: [{
            addSheet: {
              properties: {
                title: sheetName
              }
            }
          }]
        }),
      });

      if (!createSheetResponse.ok) {
        const error = await createSheetResponse.text();
        console.error(`Failed to create sheet: ${error}`);
      }
    }

    const data = checkResponse.ok ? await checkResponse.json() : { values: [] };
    const existingHeaders = data.values?.[0] || [];

    // If no headers or headers don't match, update them
    if (existingHeaders.length === 0 || JSON.stringify(existingHeaders) !== JSON.stringify(columns)) {
      console.log(`Setting headers for sheet: ${sheetName}`);
      
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}!A1:${String.fromCharCode(65 + columns.length - 1)}1?valueInputOption=RAW`;
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          values: [columns]
        }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.text();
        console.error(`Failed to update headers: ${error}`);
      } else {
        console.log(`Headers updated successfully for ${sheetName}`);
        
        // Format the header row
        const formatUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}:batchUpdate`;
        await fetch(formatUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            requests: [{
              repeatCell: {
                range: {
                  sheetId: 0, // This would need to be determined dynamically
                  startRowIndex: 0,
                  endRowIndex: 1
                },
                cell: {
                  userEnteredFormat: {
                    backgroundColor: { red: 0.2, green: 0.4, blue: 0.8 },
                    textFormat: { 
                      bold: true,
                      foregroundColor: { red: 1, green: 1, blue: 1 }
                    }
                  }
                },
                fields: 'userEnteredFormat(backgroundColor,textFormat)'
              }
            }]
          }),
        });
      }
    }
  } catch (error) {
    console.error(`Error ensuring headers: ${error}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tableName, data } = await req.json();
    
    console.log(`Processing data for table: ${tableName}`);
    console.log('Data received:', data);
    console.log('Using Sheet ID:', googleSheetId);

    if (!googleCredentials) {
      console.error('Missing Google Sheets credentials');
      return new Response(
        JSON.stringify({ 
          error: 'Google Sheets integration not configured',
          details: 'Please set GOOGLE_CREDENTIALS environment variable in Supabase dashboard'
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get mapping for this table type
    const mapping = SHEET_MAPPINGS[tableName];
    if (!mapping) {
      console.warn(`No mapping found for table: ${tableName}, using default`);
      // Fall back to a generic format
      const sheetName = tableName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      const rowData = [new Date().toISOString(), JSON.stringify(data)];
      
      // Still try to send to sheets
      const accessToken = await getGoogleAccessToken();
      const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(sheetName)}!A:B:append?valueInputOption=RAW`;
      
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
        throw new Error(`Google Sheets API error: ${errorText}`);
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Data sent to Google Sheets (unmapped table)',
          sheetName
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get access token for Google Sheets API
    const accessToken = await getGoogleAccessToken();

    // Ensure sheet exists and has proper headers
    await ensureSheetHeaders(accessToken, mapping.sheetName, mapping.columns);

    // Format data according to column mapping
    const rowData = formatRowData(tableName, data);
    
    console.log(`Sending to sheet: ${mapping.sheetName}`);
    console.log(`Row data (${rowData.length} columns):`, rowData);

    // Send data to Google Sheets
    const range = `${mapping.sheetName}!A:${String.fromCharCode(65 + mapping.columns.length - 1)}`;
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${googleSheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
    
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
      
      // Try to parse error for more details
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(`Google Sheets API error: ${errorJson.error?.message || sheetsResponse.status}`);
      } catch {
        throw new Error(`Google Sheets API error: ${sheetsResponse.status}`);
      }
    }

    const sheetsResult = await sheetsResponse.json();
    console.log('Successfully added to Google Sheets:', sheetsResult);

    // Also save to Supabase for backup
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Log the sheet submission
    const { error: logError } = await supabase
      .from('sheet_sync_log')
      .insert({
        table_name: tableName,
        sheet_name: mapping.sheetName,
        row_count: 1,
        status: 'success',
        sync_timestamp: new Date().toISOString(),
        data_hash: btoa(JSON.stringify(data)).substring(0, 50) // Store partial hash for debugging
      });

    if (logError) {
      console.warn('Failed to log sheet sync:', logError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data successfully sent to Google Sheets',
        sheetName: mapping.sheetName,
        columnsWritten: rowData.length,
        updatedRange: sheetsResult.updates?.updatedRange 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in google-sheets-integration function:', error);
    
    // Log error to Supabase
    try {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      await supabase
        .from('sheet_sync_log')
        .insert({
          table_name: req.json?.tableName || 'unknown',
          sheet_name: 'error',
          row_count: 0,
          status: 'error',
          error_message: error.message,
          sync_timestamp: new Date().toISOString()
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        details: 'Check Supabase logs for more information'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});