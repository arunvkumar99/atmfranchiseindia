# File Storage Migration Plan - Google Drive Integration

**Team Lead**: Ravi  
**Date**: Current Session  
**Priority**: 🔴 CRITICAL  
**Project**: ATM Franchise India

---

## 🚨 Current Issue Summary

### Problem Discovered
The `fileUpload.ts` module is NOT uploading files to any server. It only:
1. Converts files to data URLs (base64 strings)
2. Stores them in localStorage (client-side only)
3. Sends data URLs to Google Sheets (not actual file URLs)

### Impact
- **Data URLs in Sheets**: Instead of `https://...` links, getting `data:image/jpeg;base64,...` (thousands of characters)
- **No Backend Access**: Files can't be accessed by admin or other users
- **Data Loss Risk**: Files lost if browser cache cleared
- **Sheet Bloat**: Base64 strings can be 10,000+ characters per image

---

## 📊 Comparison: Before vs After Supabase Removal

| Aspect | Before (Supabase) | Current (Broken) | Proposed (Google Drive) |
|--------|------------------|------------------|------------------------|
| Storage Location | Supabase Storage | localStorage only | Google Drive |
| URL Format | `https://bucket.supabase.co/...` | `data:image/jpeg;base64,...` | `https://drive.google.com/...` |
| Accessibility | Public URLs | Client-only | Shareable links |
| Persistence | Permanent | Until cache cleared | Permanent |
| Sheet Cell Size | ~100 chars | 10,000+ chars | ~100 chars |
| Cost | $25/month | $0 (broken) | $0 (free tier) |

---

## 🎯 Recommended Solution: Google Drive API Integration

### Why Google Drive?
1. **Free Tier**: 15GB storage included with service account
2. **Seamless Integration**: Works with existing Google Sheets setup
3. **Public Links**: Can generate shareable links like Supabase
4. **No Additional Services**: Uses same Google Cloud project
5. **Simple Implementation**: ~200 lines of code

---

## 🛠️ Implementation Plan

### Phase 1: Setup Google Drive API (Day 1)

#### 1.1 Enable Drive API
```javascript
// Enable in Google Cloud Console
// - Go to APIs & Services
// - Enable Google Drive API
// - Use existing service account credentials
```

#### 1.2 Install Dependencies
```bash
npm install googleapis
```

#### 1.3 Create Google Drive Service
```typescript
// src/lib/googleDriveService.ts
import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

class GoogleDriveService {
  private drive: any;
  private auth: JWT;
  private folderId: string;

  constructor() {
    // Use existing service account credentials
    this.auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY,
      scopes: [
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive'
      ]
    });

    this.drive = google.drive({ version: 'v3', auth: this.auth });
    this.folderId = process.env.GOOGLE_DRIVE_FOLDER_ID || '';
  }

  async uploadFile(file: File, folder: string): Promise<{ url: string; fileId: string }> {
    // Convert File to Buffer
    const buffer = await file.arrayBuffer();
    
    // Create file metadata
    const fileMetadata = {
      name: `${Date.now()}_${file.name}`,
      parents: [this.folderId]
    };

    // Upload to Drive
    const response = await this.drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: file.type,
        body: Buffer.from(buffer)
      },
      fields: 'id, webViewLink'
    });

    // Make file publicly accessible
    await this.drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Get public URL
    const publicUrl = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

    return {
      url: publicUrl,
      fileId: response.data.id
    };
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.drive.files.delete({ fileId });
  }
}

export const googleDriveService = new GoogleDriveService();
```

### Phase 2: Update File Upload Module (Day 1)

#### 2.1 Replace fileUpload.ts
```typescript
// src/lib/fileUpload.ts
import { googleDriveService } from './googleDriveService';

export interface FileUploadResult {
  url: string;  // Public Google Drive URL
  path: string; // File ID for reference
}

export const uploadFile = async (
  file: File,
  bucket: string = 'atmfranchiseforms',
  folder: string = 'documents'
): Promise<FileUploadResult> => {
  try {
    // Validate file
    if (!file) throw new Error('No file provided');
    if (file.size === 0) throw new Error('File is empty');
    if (file.size > 10 * 1024 * 1024) throw new Error('File exceeds 10MB');

    console.log(`Uploading ${file.name} to Google Drive...`);

    // Upload to Google Drive
    const { url, fileId } = await googleDriveService.uploadFile(file, folder);

    console.log(`File uploaded successfully: ${url}`);

    // Store upload record in localStorage for reference
    const uploads = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
    uploads.push({
      fileId,
      name: file.name,
      url,
      uploadedAt: new Date().toISOString()
    });
    localStorage.setItem('uploaded_files', JSON.stringify(uploads));

    return {
      url,    // Public Drive URL
      path: fileId  // Drive file ID
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw error;
  }
};

export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    await googleDriveService.deleteFile(fileId);
    
    // Remove from localStorage
    const uploads = JSON.parse(localStorage.getItem('uploaded_files') || '[]');
    const filtered = uploads.filter((u: any) => u.fileId !== fileId);
    localStorage.setItem('uploaded_files', JSON.stringify(filtered));
  } catch (error) {
    console.error('File delete error:', error);
    throw error;
  }
};
```

### Phase 3: Server-Side Proxy (Day 2)

#### 3.1 Create API Endpoint
```typescript
// api/upload-to-drive.ts (or Express/Node endpoint)
import { googleDriveService } from '../lib/googleDriveService';
import multer from 'multer';

const upload = multer({ 
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowed = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Upload to Google Drive
    const result = await googleDriveService.uploadFile(file, 'documents');

    res.json({
      success: true,
      url: result.url,
      fileId: result.fileId
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
```

### Phase 4: Testing & Validation (Day 2)

#### 4.1 Test Scenarios
1. **File Upload Tests**
   - [ ] PAN card upload (JPEG)
   - [ ] Aadhaar upload (PNG)
   - [ ] Document upload (PDF)
   - [ ] Large file rejection (>10MB)
   - [ ] Invalid file type rejection

2. **Integration Tests**
   - [ ] Form submission with attachments
   - [ ] Google Sheets receives Drive URLs
   - [ ] URLs are accessible publicly
   - [ ] File deletion works

3. **Error Scenarios**
   - [ ] Network failure handling
   - [ ] API quota exceeded
   - [ ] Invalid credentials
   - [ ] Retry mechanism

#### 4.2 Verification Checklist
- [ ] URLs in Sheets are ~100 characters (not 10,000+)
- [ ] URLs start with `https://drive.google.com/`
- [ ] Files accessible without authentication
- [ ] Admin can view files from Sheet links
- [ ] Upload progress shown to user
- [ ] Error messages are user-friendly

---

## 📁 Files to Modify

### Core Changes
1. ✏️ `src/lib/fileUpload.ts` - Complete rewrite
2. ➕ `src/lib/googleDriveService.ts` - New file
3. ✏️ `.env` - Add Drive configuration
4. ➕ `api/upload-to-drive.ts` - Server endpoint

### Component Updates (if needed)
1. `src/components/AgentFormSinglePage.tsx` - No changes needed
2. `src/components/InfluencerFormSinglePage.tsx` - No changes needed
3. Other forms - No changes needed (interface remains same)

---

## 🔧 Environment Variables

Add to `.env`:
```bash
# Existing Google Sheets config
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your-sheet-id

# New: Google Drive config
GOOGLE_DRIVE_FOLDER_ID=1ABC...xyz  # Create folder in Drive and share with service account
```

---

## 📊 Expected Outcomes

### Immediate Benefits
1. **Proper File URLs**: `https://drive.google.com/uc?export=view&id=...`
2. **Sheet Readability**: URLs are ~100 chars instead of 10,000+
3. **Admin Access**: Can view files directly from Sheet links
4. **Persistence**: Files permanently stored in Drive

### Performance Metrics
- Upload time: 2-3 seconds per file
- URL generation: Instant after upload
- Storage limit: 15GB free (sufficient for ~15,000 documents)
- Monthly cost: $0

---

## 🚀 Alternative Options (If Drive Not Preferred)

### Option 2: Cloudinary (Free Tier)
- 25GB bandwidth/month
- 25GB storage
- Automatic image optimization
- CDN included
- Implementation: 1 day

### Option 3: Custom Server with S3
- AWS S3 or compatible
- ~$1-5/month for storage
- Full control
- Implementation: 2 days

### Option 4: Vercel Blob Storage
- If hosting on Vercel
- Integrated with deployment
- $20/month minimum
- Implementation: 1 day

---

## ⏰ Timeline

### Day 1 (4 hours)
- [ ] Enable Google Drive API
- [ ] Create googleDriveService.ts
- [ ] Update fileUpload.ts
- [ ] Basic testing

### Day 2 (4 hours)
- [ ] Create server endpoint
- [ ] Add error handling
- [ ] Comprehensive testing
- [ ] Documentation update

### Day 3 (2 hours)
- [ ] Production deployment
- [ ] Monitor for issues
- [ ] Team training

---

## ✅ Success Criteria

1. **Functional Requirements**
   - [ ] Files upload successfully
   - [ ] URLs appear correctly in Sheets
   - [ ] Files accessible via URLs
   - [ ] Delete functionality works

2. **Non-Functional Requirements**
   - [ ] Upload time <5 seconds
   - [ ] 99% success rate
   - [ ] Graceful error handling
   - [ ] No data loss

3. **User Experience**
   - [ ] Clear upload progress
   - [ ] Helpful error messages
   - [ ] Retry on failure
   - [ ] Confirmation on success

---

## 🎯 Recommendation

**Proceed with Google Drive API integration** because:
1. Zero additional cost
2. Seamless integration with existing Google services
3. Minimal code changes required
4. Can be implemented in 1-2 days
5. Solves all current issues

This replaces the broken localStorage approach with a proper cloud storage solution that provides the same experience you had with Supabase Storage.

---

**Team Lead Approval**: Pending Implementation  
**Risk Assessment**: LOW (uses existing infrastructure)  
**Estimated Effort**: 8-12 hours  
**Priority**: 🔴 CRITICAL - Forms currently broken

---

*This plan addresses the critical file storage issue discovered after Supabase removal.*