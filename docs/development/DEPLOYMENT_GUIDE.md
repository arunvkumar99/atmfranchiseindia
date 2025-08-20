# 🚀 Deployment Guide - ATM Franchise India

## 📋 Pre-Deployment Checklist

### ✅ Code Status
- [x] All Supabase dependencies removed
- [x] Google Sheets integration complete
- [x] 13 language translations working
- [x] Forms with offline support
- [x] Mobile responsive design
- [x] Security features implemented
- [x] Build passes without errors

### 🔑 Required Accounts
- [ ] Google Cloud Account
- [ ] Vercel or Netlify Account
- [ ] Domain (optional)

---

## Step 1: Create Google Service Account (10 mins)

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Create New Project** (or use existing)
   - Project Name: `atm-franchise-india`
   - Click "Create"

3. **Enable Google Sheets API**
   ```
   https://console.cloud.google.com/apis/library/sheets.googleapis.com
   ```
   - Click "Enable"

4. **Create Service Account**
   - Go to: `APIs & Services` → `Credentials`
   - Click `+ CREATE CREDENTIALS` → `Service account`
   - Name: `sheets-writer`
   - Click "Create and Continue"
   - Role: `Editor`
   - Click "Done"

5. **Generate Key**
   - Click on the service account email
   - Go to `Keys` tab
   - Click `Add Key` → `Create new key`
   - Choose `JSON`
   - Download the file

6. **Share Your Google Sheet**
   - Open: https://docs.google.com/spreadsheets/d/1bgo7ciEivjYYzFVuAmG__MQ0fSTDgzf_3gHzjUnAoEQ
   - Click "Share"
   - Add the service account email (ending in @...iam.gserviceaccount.com)
   - Give "Editor" permission
   - Click "Send"

---

## Step 2: Deploy to Vercel (5 mins)

### Option A: Deploy via GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Google Sheets direct integration"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to: https://vercel.com/new
   - Import your GitHub repository: `arunvkumar99/atmfranchiseindia`
   - Click "Import"

3. **Configure Environment Variables**
   Add these in Vercel dashboard:
   ```
   GOOGLE_SERVICE_ACCOUNT_EMAIL = [from your JSON key file]
   GOOGLE_SERVICE_ACCOUNT_KEY = [private_key from JSON file]
   GOOGLE_SHEET_ID = 1bgo7ciEivjYYzFVuAmG__MQ0fSTDgzf_3gHzjUnAoEQ
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

### Option B: Deploy via CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add GOOGLE_SERVICE_ACCOUNT_EMAIL
   vercel env add GOOGLE_SERVICE_ACCOUNT_KEY
   vercel env add GOOGLE_SHEET_ID
   ```

---

## Step 3: Configure Test Domain

1. **In Vercel Dashboard**
   - Go to your project
   - Settings → Domains
   - Add your test domain
   - Follow DNS instructions

2. **DNS Settings** (if using external domain)
   Add these records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

## Step 4: Test the Deployment

1. **Test Form Submission**
   ```javascript
   // Open browser console on your test domain
   fetch('/api/submit-to-sheets', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       formType: 'contact_submissions',
       data: {
         name: 'Test User',
         email: 'test@example.com',
         phone: '9876543210',
         city: 'Mumbai',
         state: 'Maharashtra',
         message: 'This is a test submission'
       }
     })
   }).then(r => r.json()).then(console.log)
   ```

2. **Check Google Sheet**
   - Open your Google Sheet
   - Look for the test submission
   - Should appear within 2-3 seconds

---

## Environment Variables Template

Create a `.env.local` file for local development:

```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=1bgo7ciEivjYYzFVuAmG__MQ0fSTDgzf_3gHzjUnAoEQ

# Google Service Account (from JSON key file)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# API Configuration
VITE_API_URL=/api/submit-to-sheets

# CORS (for test domain)
ALLOWED_ORIGINS=https://your-test-domain.com,http://localhost:8080
```

---

## Monitoring & Debugging

### Check Vercel Function Logs
```bash
vercel logs --follow
```

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Permission denied" | Share sheet with service account email |
| "Rate limit exceeded" | Wait 1 minute and retry |
| "Invalid form type" | Check formType matches exactly |
| "CORS error" | Add domain to ALLOWED_ORIGINS |

---

## Production Checklist

Before going live:

- [ ] Test all 7 form types
- [ ] Verify data in Google Sheets
- [ ] Test offline mode
- [ ] Test rate limiting
- [ ] Check mobile responsiveness
- [ ] Monitor for 24 hours
- [ ] Backup Google Sheet
- [ ] Document for team

---

## Quick Commands

```bash
# View logs
vercel logs

# Redeploy
vercel --prod

# Add domain
vercel domains add your-domain.com

# Environment variables
vercel env ls
```

---

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Google Sheets API**: https://developers.google.com/sheets/api
- **GitHub Repo**: https://github.com/arunvkumar99/atmfranchiseindia

---

## 🎉 Expected Result

After deployment, you'll have:
- ✅ Forms submitting directly to Google Sheets
- ✅ No database costs
- ✅ Automatic retry for failed submissions
- ✅ Rate limiting protection
- ✅ Offline support
- ✅ Test domain running the new architecture

Total deployment time: **15-20 minutes**