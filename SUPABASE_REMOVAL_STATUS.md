# 🚨 Supabase Removal Status

## Current Situation
We have **21 files** still importing from Supabase that need to be updated to use the Google Sheets-only architecture.

## Migration Plan

### Phase 1: Core Infrastructure ✅
- [x] Remove @supabase/supabase-js from package.json
- [x] Update vite.config.ts to remove Supabase chunks
- [x] Update .env.example to remove Supabase variables
- [x] Create simpleAuth.ts to replace Supabase auth

### Phase 2: Form Components (21 files to update)
These components need to be updated to use `googleSheetsService` instead of Supabase:

#### High Priority Forms
- [ ] ContactUsSupabase.tsx → Use DirectSheetsForm
- [ ] AgentFormSinglePage.tsx → Use googleSheetsService
- [ ] InfluencerFormSinglePage.tsx → Use googleSheetsService
- [ ] JobApplicationSinglePage.tsx → Use googleSheetsService
- [ ] EnquiryFormSinglePage.tsx → Use googleSheetsService
- [ ] SubmitLocationSinglePage.tsx → Use googleSheetsService

#### Admin Components
- [ ] AdminExport.tsx → Remove or simplify (no DB to export from)
- [ ] AdminUserManagement.tsx → Use simpleAuth instead

#### Hooks & Utilities
- [ ] useAuth.tsx → Use simpleAuth
- [ ] useFormAutoSave.ts → Use localStorage only
- [ ] useRateLimitedSubmission.ts → Use googleSheetsService
- [ ] fileUpload.ts → Use Google Drive API or remove

#### Other Components
- [ ] TranslationStatus.tsx → Remove Supabase references
- [ ] GetStarted.tsx → Update form submission
- [ ] Various monitoring hooks → Remove or simplify

### Phase 3: Delete Supabase Files
- [ ] Delete entire `/src/integrations/supabase/` folder
- [ ] Delete `/supabase/` folder
- [ ] Remove all Supabase Edge Functions

## Quick Fix Option

Since we already have:
1. ✅ `DirectSheetsForm.tsx` - Ready-to-use form component
2. ✅ `googleSheetsService.ts` - Complete service for submissions
3. ✅ `/api/submit-to-sheets.ts` - Serverless function

We can:
1. Replace ALL form components with `DirectSheetsForm`
2. Delete all Supabase-dependent files
3. Use `simpleAuth` for admin access

## Recommended Action

**Option A: Quick Migration (2 hours)**
- Replace all 6 form components with DirectSheetsForm
- Delete all Supabase files
- Update imports

**Option B: Careful Migration (4 hours)**
- Update each component individually
- Preserve custom logic
- Test each form

## Command to Remove Supabase Completely

```bash
# Remove Supabase package
npm uninstall @supabase/supabase-js

# Delete Supabase files
rm -rf src/integrations/supabase
rm -rf supabase

# Find and update all imports
grep -r "from '@/integrations/supabase" src/
```

## Impact Analysis

**What breaks if we remove Supabase now:**
1. All form submissions (temporary)
2. Admin authentication
3. File uploads
4. Rate limiting (database-based)

**What's already working without Supabase:**
1. Google Sheets direct integration
2. Simple auth system
3. Client-side rate limiting
4. Offline queue system

## Decision Required

Should we:
1. **Quick fix**: Replace all forms with DirectSheetsForm (2 hours)
2. **Gradual migration**: Update each component carefully (4 hours)
3. **Nuclear option**: Delete everything Supabase, use only new components (1 hour)

The architect's plan calls for **complete Supabase removal**. The Google Sheets-only architecture is ready and tested.