/**
 * Direct Google Sheets Integration API
 * Eliminates need for Supabase database
 * 
 * Architecture: Form → API → Google Sheets
 * Benefits: Simpler, cheaper, single source of truth
 */

import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory rate limiting (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limit configuration
const RATE_LIMIT = {
  MAX_REQUESTS: 5,
  WINDOW_MS: 60000, // 1 minute
  BLOCK_DURATION_MS: 300000 // 5 minutes block after exceeding
};

// Google Sheets configuration
const SHEET_CONFIG = {
  SHEET_ID: process.env.GOOGLE_SHEET_ID || '1bgo7ciEivjYYzFVuAmG__MQ0fSTDgzf_3gHzjUnAoEQ',
  RANGES: {
    agent_submissions: 'Agent Applications!A:Z',
    influencer_submissions: 'Influencer Applications!A:Z',
    franchise_applications: 'Franchise Applications!A:Z',
    contact_submissions: 'Contact Form!A:Z',
    atm_enquiry_submissions: 'ATM Enquiries!A:Z',
    location_submissions: 'Location Submissions!A:Z',
    job_applications: 'Job Applications!A:Z',
    enquiry_submissions: 'General Enquiries!A:Z'
  }
};

// Initialize Google Sheets client
function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY?.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  return google.sheets({ version: 'v4', auth });
}

// Rate limiting function
function checkRateLimit(identifier: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up old entries
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < now) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || record.resetTime < now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT.WINDOW_MS
    });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT.MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true };
}

// Format form data for Google Sheets
function formatFormData(formType: string, data: any): string[] {
  const timestamp = new Date().toISOString();
  
  // Common fields across all forms
  const baseFields = [
    timestamp,
    data.name || data.fullName || '',
    data.email || '',
    data.phone || '',
    data.city || '',
    data.state || ''
  ];

  // Form-specific fields
  switch (formType) {
    case 'franchise_applications':
      return [
        ...baseFields,
        data.investmentCapacity || '',
        data.businessExperience || '',
        data.preferredLocation || '',
        data.currentOccupation || '',
        data.whatsappNumber || '',
        data.pincode || '',
        data.panNumber || '',
        data.aadhaarNumber || '',
        data.message || ''
      ];

    case 'agent_submissions':
      return [
        ...baseFields,
        data.experience || '',
        data.currentCompany || '',
        data.monthlyIncome || '',
        data.whyInterested || '',
        data.referralSource || '',
        data.linkedinProfile || '',
        data.expectedEarnings || '',
        data.hoursPerWeek || ''
      ];

    case 'influencer_submissions':
      return [
        ...baseFields,
        data.socialMediaPlatforms?.join(', ') || '',
        data.followersCount || '',
        data.engagementRate || '',
        data.contentNiche || '',
        data.previousCollaborations || '',
        data.expectedCompensation || '',
        data.contentIdeas || ''
      ];

    case 'job_applications':
      return [
        ...baseFields,
        data.position || '',
        data.experience || '',
        data.currentSalary || '',
        data.expectedSalary || '',
        data.noticePeriod || '',
        data.resumeUrl || '',
        data.linkedinProfile || '',
        data.portfolioUrl || '',
        data.skills?.join(', ') || '',
        data.coverLetter || ''
      ];

    case 'location_submissions':
      return [
        ...baseFields,
        data.locationType || '',
        data.address || '',
        data.landmark || '',
        data.footfall || '',
        data.nearbyBusinesses || '',
        data.rentExpectation || '',
        data.powerAvailability || '',
        data.securityAvailable || ''
      ];

    case 'contact_submissions':
      return [
        ...baseFields,
        data.subject || '',
        data.message || '',
        data.preferredContactMethod || '',
        data.bestTimeToContact || ''
      ];

    default:
      return [...baseFields, data.message || ''];
  }
}

// Main handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGINS || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formType, data } = req.body;

    // Validate form type
    if (!SHEET_CONFIG.RANGES[formType as keyof typeof SHEET_CONFIG.RANGES]) {
      return res.status(400).json({ error: 'Invalid form type' });
    }

    // Rate limiting
    const identifier = req.headers['x-forwarded-for']?.toString() || 
                      req.socket.remoteAddress || 
                      'unknown';
    
    const rateLimitResult = checkRateLimit(identifier);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: rateLimitResult.retryAfter
      });
    }

    // Basic validation
    if (!data.email || !data.phone) {
      return res.status(400).json({ 
        error: 'Email and phone are required' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Phone validation (Indian)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(data.phone.replace(/\D/g, ''))) {
      return res.status(400).json({ 
        error: 'Invalid phone number' 
      });
    }

    // Initialize Google Sheets
    const sheets = getGoogleSheetsClient();
    
    // Format data for sheets
    const formattedData = formatFormData(formType, data);
    
    // Append to Google Sheets
    const range = SHEET_CONFIG.RANGES[formType as keyof typeof SHEET_CONFIG.RANGES];
    
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_CONFIG.SHEET_ID,
      range,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [formattedData]
      }
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      id: `${formType}_${Date.now()}`,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Form submission error:', error);
    
    // Handle Google API errors
    if (error.code === 429) {
      return res.status(503).json({
        error: 'Service temporarily unavailable',
        message: 'Please try again in a few moments'
      });
    }

    if (error.code === 403) {
      return res.status(500).json({
        error: 'Configuration error',
        message: 'Please contact support'
      });
    }

    // Generic error
    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong. Please try again.'
    });
  }
}

// Backup queue for failed submissions (optional enhancement)
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb'
    }
  }
};