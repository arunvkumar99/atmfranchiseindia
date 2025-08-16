// Google Sheets Configuration with Column Mapping
// This file defines the exact column structure for each form type

export interface SheetColumnMapping {
  sheetName: string;
  columns: string[];
}

export const SHEET_MAPPINGS: Record<string, SheetColumnMapping> = {
  'franchise_applications': {
    sheetName: 'Franchise Applications',
    columns: [
      'Timestamp',
      'First Name',
      'Last Name', 
      'Email',
      'Phone',
      'WhatsApp Phone',
      'City',
      'State',
      'PIN Code',
      'Business Type',
      'Investment Budget',
      'Space Availability',
      'Current Occupation',
      'Experience (Years)',
      'Monthly Income',
      'Net Worth',
      'How Did You Hear About Us',
      'Additional Comments',
      'Form Language',
      'UTM Source',
      'UTM Medium',
      'UTM Campaign'
    ]
  },
  
  'agent_submissions': {
    sheetName: 'Agent Submissions',
    columns: [
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'WhatsApp Phone',
      'State',
      'District',
      'City',
      'PIN Code',
      'Joining As',
      'Gender',
      'Date of Birth',
      'Languages Known',
      'Education',
      'Current Occupation',
      'Experience',
      'Why Join Us',
      'PAN Number',
      'Aadhaar Number',
      'Bank Account Number',
      'IFSC Code',
      'PAN Document URL',
      'Aadhaar Front URL',
      'Aadhaar Back URL',
      'Photo URL',
      'Form Language',
      'Referral Code'
    ]
  },
  
  'influencer_submissions': {
    sheetName: 'Influencer Submissions',
    columns: [
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'WhatsApp Phone',
      'State',
      'District',
      'City',
      'PIN Code',
      'YouTube Channel',
      'YouTube Subscribers',
      'Instagram Handle',
      'Instagram Followers',
      'Facebook Page',
      'Facebook Followers',
      'LinkedIn Profile',
      'LinkedIn Connections',
      'Other Platform',
      'Total Reach',
      'Content Type',
      'Languages',
      'PAN Document URL',
      'Aadhaar Front URL',
      'Aadhaar Back URL',
      'Photo URL',
      'Form Language'
    ]
  },
  
  'location_submissions': {
    sheetName: 'Location Submissions',
    columns: [
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'WhatsApp Phone',
      'Location Name',
      'Shop/Business Name',
      'Full Address',
      'Landmark',
      'City',
      'State',
      'PIN Code',
      'Location Type',
      'Footfall per Day',
      'Space Available (sq ft)',
      'Power Backup Available',
      'Internet Available',
      'Security Available',
      'Agent Code',
      'Assisted by Agent',
      'Room Photo URL',
      'Building Photo URL',
      'Street Photo URL',
      'Google Map Link',
      'Additional Notes',
      'Form Language'
    ]
  },
  
  'contact_submissions': {
    sheetName: 'Contact Submissions',
    columns: [
      'Timestamp',
      'Name',
      'Email',
      'Phone',
      'Subject',
      'Message',
      'Form Language',
      'Page Source',
      'IP Address',
      'User Agent'
    ]
  },
  
  'atm_enquiry_submissions': {
    sheetName: 'ATM Enquiry',
    columns: [
      'Timestamp',
      'Full Name',
      'Email',
      'Phone',
      'WhatsApp Number',
      'State',
      'District',
      'City',
      'PIN Code',
      'Enquiry Purpose',
      'Business Type',
      'Occupation',
      'Monthly Income',
      'Investment Capacity',
      'Has Own Space',
      'Space Size (sq ft)',
      'Expected Monthly Revenue',
      'Timeline to Start',
      'How Did You Hear About Us',
      'Additional Questions',
      'Form Language',
      'Lead Score',
      'Lead Quality'
    ]
  },
  
  'job_applications': {
    sheetName: 'Job Applications',
    columns: [
      'Timestamp',
      'Job Title',
      'Job ID',
      'Candidate Name',
      'Email',
      'Phone',
      'Alternate Phone',
      'Current Location',
      'Preferred Location',
      'Total Experience',
      'Relevant Experience',
      'Current Company',
      'Current Designation',
      'Current CTC',
      'Expected CTC',
      'Notice Period',
      'Reason for Change',
      'Skills',
      'Education',
      'LinkedIn Profile',
      'Portfolio URL',
      'CV File URL',
      'Cover Letter',
      'References',
      'Available for Interview',
      'Form Language'
    ]
  }
};

// Helper function to get formatted row data
export function formatRowData(tableName: string, data: any): any[] {
  const mapping = SHEET_MAPPINGS[tableName];
  if (!mapping) {
    console.warn(`No mapping found for table: ${tableName}`);
    return [new Date().toISOString(), JSON.stringify(data)];
  }
  
  const row: any[] = [];
  
  // Always start with timestamp
  row.push(new Date().toISOString());
  
  // Map data to columns (skip timestamp as we already added it)
  for (let i = 1; i < mapping.columns.length; i++) {
    const column = mapping.columns[i];
    const fieldName = column.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[()]/g, '')
      .replace(/_url$/, '_url');
    
    // Special field mappings
    let value = '';
    
    switch(fieldName) {
      case 'timestamp':
        value = new Date().toISOString();
        break;
      case 'languages_known':
      case 'languages':
        value = Array.isArray(data.languages) ? data.languages.join(', ') : (data.languages || '');
        break;
      case 'assisted_by_agent':
        value = data.assisted_by_agent ? 'Yes' : 'No';
        break;
      case 'has_own_space':
        value = data.has_own_space || data.hasOwnSpace || '';
        break;
      case 'form_language':
        value = data.form_language || data.language || 'en';
        break;
      case 'whatsapp_phone':
      case 'whatsapp_number':
        value = data.whatsapp_phone || data.whatsapp_number || data.whatsappPhone || data.whatsappNumber || '';
        break;
      case 'pin_code':
        value = data.pincode || data.pin_code || '';
        break;
      default:
        // Try different variations of the field name
        value = data[fieldName] || 
                data[fieldName.replace(/_/g, '')] || 
                data[toCamelCase(fieldName)] || 
                '';
    }
    
    row.push(value);
  }
  
  return row;
}

// Convert snake_case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}