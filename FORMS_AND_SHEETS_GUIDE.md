# 📋 Forms & Google Sheets Integration Guide

## Overview
This guide explains how the form system works, including validation, data flow, and Google Sheets integration.

## 🔄 Data Flow Architecture

```
User fills form → Real-time validation → Submit to Supabase → Trigger Edge Function → Save to Google Sheets
                      ↓                        ↓                      ↓                       ↓
                 Instant feedback        Database backup       Async processing        Final destination
```

## 📝 Form Types & Their Google Sheets

| Form Type | Database Table | Google Sheet Tab | Fields Count |
|-----------|---------------|------------------|--------------|
| Franchise Application | `franchise_applications` | Franchise Applications | 22 fields |
| Agent Submission | `agent_submissions` | Agent Submissions | 27 fields |
| Influencer Application | `influencer_submissions` | Influencer Submissions | 26 fields |
| Location Submission | `location_submissions` | Location Submissions | 26 fields |
| Contact Form | `contact_submissions` | Contact Submissions | 10 fields |
| ATM Enquiry | `atm_enquiry_submissions` | ATM Enquiry | 23 fields |
| Job Application | `job_applications` | Job Applications | 26 fields |

## 🔐 Security Configuration

### Setting up Google Sheets Credentials

1. **Get Google Sheet ID**
   - Open your Google Sheet
   - Copy ID from URL: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   - Add to `.env` file:
   ```
   GOOGLE_SHEET_ID=your_sheet_id_here
   ```

2. **Create Service Account**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create new project or select existing
   - Enable Google Sheets API
   - Go to IAM & Admin → Service Accounts
   - Create new service account
   - Download JSON key file
   - Add entire JSON to Supabase Edge Function environment variable:
   ```
   GOOGLE_CREDENTIALS={"type":"service_account",...entire JSON content...}
   ```

3. **Share Sheet with Service Account**
   - Copy service account email from JSON (e.g., `project@projectid.iam.gserviceaccount.com`)
   - Share your Google Sheet with this email as Editor

## ✅ Real-time Validation Features

### Phone Number Validation
- **Format**: 10 digits starting with 6-9
- **Real-time feedback**: Shows remaining digits needed
- **Smart detection**: Removes country codes automatically
- **Examples**:
  - ✅ 9876543210
  - ✅ 8765432109
  - ❌ 1234567890 (doesn't start with 6-9)
  - ❌ 987654321 (only 9 digits)

### Email Validation
- **Typo detection**: Suggests corrections for common typos
  - `gmial.com` → `gmail.com`
  - `yahooo.com` → `yahoo.com`
- **Format checking**: Ensures proper email structure
- **Disposable email warning**: Alerts for temporary email services

### PIN Code Validation
- **Format**: 6 digits, cannot start with 0
- **Zone detection**: Shows which states the PIN code belongs to
- **Examples**:
  - 1xxxxx = Delhi, Haryana, Punjab region
  - 4xxxxx = Maharashtra, MP, Chhattisgarh
  - 6xxxxx = Tamil Nadu, Kerala

### PAN Card Validation
- **Format**: ABCDE1234F
- **Type detection**: Identifies if Individual, Company, etc.
- **Real-time guidance**: Shows exactly what's wrong

### Aadhaar Validation
- **Format**: 12 digits
- **Security**: Only validates format, no verification
- **Pattern checking**: Detects invalid sequences

## 📊 Google Sheets Column Mapping

### Franchise Applications Sheet
```
Timestamp | First Name | Last Name | Email | Phone | WhatsApp Phone | City | State | PIN Code | Business Type | Investment Budget | Space Availability | Current Occupation | Experience (Years) | Monthly Income | Net Worth | How Did You Hear | Additional Comments | Form Language | UTM Source | UTM Medium | UTM Campaign
```

### Agent Submissions Sheet
```
Timestamp | Full Name | Email | Phone | WhatsApp Phone | State | District | City | PIN Code | Joining As | Gender | DOB | Languages | Education | Occupation | Experience | Why Join | PAN | Aadhaar | Bank Account | IFSC | PAN Doc | Aadhaar Front | Aadhaar Back | Photo | Language | Referral Code
```

### Location Submissions Sheet
```
Timestamp | Full Name | Email | Phone | WhatsApp Phone | Location Name | Shop Name | Address | Landmark | City | State | PIN Code | Location Type | Footfall | Space (sq ft) | Power Backup | Internet | Security | Agent Code | Assisted by Agent | Room Photo | Building Photo | Street Photo | Google Map Link | Notes | Language
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### "Missing columns in Google Sheets"
**Solution**: The system now auto-creates headers. Just ensure the sheet exists.

#### "Data not appearing in sheets"
**Check**:
1. Service account has Editor access to sheet
2. GOOGLE_CREDENTIALS is set in Supabase
3. Sheet ID is correct in environment variables

#### "Validation too strict"
**Solution**: Enhanced validation now provides suggestions instead of just errors.

#### "Form submission fails"
**Debug steps**:
1. Check browser console for errors
2. Check Supabase Edge Function logs
3. Verify Google Sheets API is enabled
4. Ensure service account has proper permissions

## 🚀 Testing Forms

### Test Data for Each Field Type

**Phone Numbers** (Valid):
- 9876543210
- 8765432109
- 7654321098

**Email** (Valid):
- test@gmail.com
- user@company.co.in
- contact@business.org

**PIN Codes** (Valid):
- 110001 (Delhi)
- 400001 (Mumbai)
- 600001 (Chennai)

**PAN** (Valid Format):
- ABCDE1234F
- ZZZZZ9999Z

**Aadhaar** (Valid Format):
- 234567890123
- 987654321098

## 📈 Performance Optimizations

1. **Real-time validation** reduces server load
2. **Batch processing** for multiple submissions
3. **Async Google Sheets updates** don't block form submission
4. **Error recovery** with automatic retries
5. **Data backup** in Supabase before sheets sync

## 🔍 Monitoring & Logs

### Check Submission Status
1. **Supabase Dashboard** → Table Editor → View submissions
2. **Google Sheets** → Check respective tabs
3. **Edge Function Logs** → Supabase Dashboard → Functions → Logs

### Track Sync Status
New `sheet_sync_log` table tracks:
- Successful syncs
- Failed attempts
- Error messages
- Timestamps

## 📱 Mobile Optimizations

- **Auto-focus management** prevents camera issues
- **Touch-friendly error messages**
- **Progressive form options** for long forms
- **Auto-save** prevents data loss
- **Offline detection** with retry logic

## 🎯 Best Practices

1. **Always validate on both client and server**
2. **Provide helpful error messages with suggestions**
3. **Save to database first, then sync to sheets**
4. **Use environment variables for all credentials**
5. **Test with various Indian phone/PIN formats**
6. **Monitor Google Sheets API quotas**
7. **Regular backup of Google Sheets data**

## 📞 Support

For issues with forms or Google Sheets integration:
1. Check this guide first
2. Review Edge Function logs in Supabase
3. Verify Google Cloud Console quotas
4. Contact technical support with error logs

---

*Last Updated: November 2024*
*Version: 2.0 - Enhanced with real-time validation and auto-mapping*