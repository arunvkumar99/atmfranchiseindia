
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface FormSubmissionRequest {
  action?: string;
  formType: string;
  data?: Record<string, any>;
  identifier?: string;
  userAgent?: string;
  ipAddress?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('=== FORM SUBMISSION STARTED ===');
    
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const requestBody = await req.json();
    const { action, formType, data, identifier, userAgent }: FormSubmissionRequest = requestBody;

    // Handle rate limit check
    if (action === 'check_rate_limit') {
      try {
        const rateLimitId = identifier || req.headers.get('x-forwarded-for') || 'unknown';
        
        const { data: isAllowed, error } = await supabase.rpc('check_rate_limit', {
          p_identifier: rateLimitId,
          p_form_type: formType,
          p_max_attempts: 5,
          p_window_minutes: 60
        });

        if (error) {
          console.warn('Rate limit check error:', error);
          // Allow submission if rate limit check fails
          return new Response(
            JSON.stringify({ allowed: true, warning: 'Rate limit check failed' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({ allowed: isAllowed }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.warn('Rate limit check exception:', error);
        return new Response(
          JSON.stringify({ allowed: true, warning: 'Rate limit check exception' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Handle form submission
    console.log('Request received:', {
      formType: requestBody.formType,
      hasData: !!requestBody.data,
      dataKeys: Object.keys(requestBody.data || {}),
      userAgent: requestBody.userAgent
    });
    
    // Validate form type
    const allowedFormTypes = [
      'contact_submissions',
      'agent_submissions', 
      'influencer_submissions',
      'franchise_applications',
      'atm_enquiry_submissions',
      'location_submissions',
      'job_applications',
      'enquiry_submissions'
    ];

    if (!allowedFormTypes.includes(formType)) {
      console.error('Invalid form type:', formType);
      return new Response(
        JSON.stringify({ error: 'Invalid form type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Basic data validation
    if (!data || typeof data !== 'object') {
      console.error('Invalid data received:', data);
      return new Response(
        JSON.stringify({ error: 'Invalid form data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Sanitize and prepare data
    const sanitizedData = sanitizeFormData(data, formType);
    console.log('Sanitized data:', sanitizedData);

    // Add timestamps
    const submissionData = {
      ...sanitizedData,
      created_at: new Date().toISOString()
    };

    console.log(`Attempting database insert for ${formType}:`, JSON.stringify(submissionData, null, 2));

    // Perform the insert
    const { data: insertedData, error: insertError } = await supabase
      .from(formType)
      .insert([submissionData])
      .select('*');

    console.log('Database insert result:', {
      success: !insertError,
      error: insertError,
      insertedData: insertedData,
      recordCount: insertedData?.length || 0
    });

    if (insertError) {
      console.error('Database insert failed:', {
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        code: insertError.code
      });
      
      return new Response(
        JSON.stringify({ 
          error: 'Database insertion failed',
          details: insertError.message,
          code: insertError.code
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!insertedData || insertedData.length === 0) {
      console.error('No data returned from insert - possible RLS issue');
      return new Response(
        JSON.stringify({ 
          error: 'Database insertion failed - no data returned'
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const recordId = insertedData[0]?.id;
    console.log(`✅ ${formType} submission successful with ID:`, recordId);

    // Send to Google Sheets (non-blocking)
    try {
      console.log('Sending to Google Sheets...');
      const sheetsResponse = await supabase.functions.invoke('google-sheets-integration', {
        body: {
          tableName: formType,
          data: submissionData
        }
      });

      console.log('Google Sheets response:', {
        success: !sheetsResponse.error,
        error: sheetsResponse.error,
        data: sheetsResponse.data
      });
    } catch (sheetsError) {
      console.error('Google Sheets integration error:', sheetsError);
      // Don't fail the main submission
    }

    console.log('=== FORM SUBMISSION COMPLETED SUCCESSFULLY ===');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Form submitted successfully',
        id: recordId,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('=== FORM SUBMISSION ERROR ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code
    });
    
    // Return detailed error information
    let errorMessage = 'Internal server error';
    let statusCode = 500;
    
    // Handle specific database errors
    if (error.code === '23514') {
      errorMessage = 'Validation error: Please check your input format';
      statusCode = 400;
      
      if (error.message.includes('email_format')) {
        errorMessage = 'Please enter a valid email address (e.g., example@email.com)';
      } else if (error.message.includes('phone')) {
        errorMessage = 'Please enter a valid phone number';
      }
    } else if (error.code === '23505') {
      errorMessage = 'This information has already been submitted';
      statusCode = 409;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.message,
        timestamp: new Date().toISOString()
      }),
      { status: statusCode, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function sanitizeFormData(data: Record<string, any>, formType: string): Record<string, any> {
  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue; // Skip null/undefined values
    }
    
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        continue; // Skip empty strings
      }
      sanitized[key] = trimmed.substring(0, 2000); // Limit length
    } else if (Array.isArray(value)) {
      const cleanArray = value
        .filter(item => item && typeof item === 'string')
        .map(item => item.trim().substring(0, 100))
        .filter(item => item.length > 0);
      
      if (cleanArray.length > 0) {
        sanitized[key] = cleanArray;
      }
    } else if (typeof value === 'boolean') {
      sanitized[key] = value;
    } else if (typeof value === 'number') {
      sanitized[key] = value;
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
