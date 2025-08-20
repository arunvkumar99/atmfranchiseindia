# 🔐 Security Guide - ATM Franchise India

## 🚨 Critical Security Recommendations

### 1. Secret Storage Best Practices

#### Current Issues
- ❌ Private keys stored as plain text in environment variables
- ❌ No secret rotation mechanism
- ❌ Potential exposure through VITE_ prefixed variables
- ❌ Sheet ID visible in public examples

#### Recommended Solutions

### Option 1: Vercel/Netlify Secret Management (Recommended)
```bash
# Use platform's encrypted secret storage
vercel secrets add google-private-key @path/to/key.json
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY production
```

### Option 2: Key Management Service (Production)
```javascript
// Use AWS Secrets Manager or Azure Key Vault
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

const getSecret = async (secretName: string) => {
  const client = new SecretsManagerClient({ region: "us-east-1" });
  const response = await client.getSecretValue({ SecretId: secretName });
  return JSON.parse(response.SecretString);
};
```

### Option 3: Encrypted Environment Variables
```javascript
// Encrypt sensitive values
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const encrypt = (text: string, password: string) => {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  return salt.toString('hex') + ':' + iv.toString('hex') + ':' + 
         authTag.toString('hex') + ':' + encrypted;
};
```

## 2. Secure Configuration Pattern

### Create `src/config/secrets.ts`:
```typescript
interface SecureConfig {
  googleSheets: {
    sheetId: string;
    serviceAccount: {
      email: string;
      privateKey: string;
    };
  };
  security: {
    allowedOrigins: string[];
    jwtSecret: string;
  };
}

class SecretManager {
  private static instance: SecretManager;
  private secrets: SecureConfig | null = null;

  private constructor() {}

  static getInstance(): SecretManager {
    if (!SecretManager.instance) {
      SecretManager.instance = new SecretManager();
    }
    return SecretManager.instance;
  }

  async loadSecrets(): Promise<SecureConfig> {
    if (this.secrets) return this.secrets;

    // In production, fetch from secure storage
    if (process.env.NODE_ENV === 'production') {
      // Fetch from KMS, Vault, or platform secrets
      this.secrets = await this.fetchFromSecureStorage();
    } else {
      // Development: use local env
      this.secrets = {
        googleSheets: {
          sheetId: process.env.GOOGLE_SHEET_ID!,
          serviceAccount: {
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
            privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!
          }
        },
        security: {
          allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
          jwtSecret: process.env.JWT_SECRET!
        }
      };
    }

    return this.secrets;
  }

  private async fetchFromSecureStorage(): Promise<SecureConfig> {
    // Implementation depends on your platform
    // Vercel example:
    return {
      googleSheets: {
        sheetId: process.env.GOOGLE_SHEET_ID!,
        serviceAccount: {
          email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
          privateKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY!
        }
      },
      security: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || [],
        jwtSecret: process.env.JWT_SECRET!
      }
    };
  }
}

export const secretManager = SecretManager.getInstance();
```

## 3. Environment Variable Security

### Never Expose to Client
```javascript
// ❌ BAD - Exposed to client bundle
VITE_API_KEY=secret123

// ✅ GOOD - Server-side only
API_KEY=secret123
```

### Use Validation
```javascript
// Validate all environment variables on startup
const validateEnv = () => {
  const required = [
    'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    'GOOGLE_SERVICE_ACCOUNT_KEY',
    'GOOGLE_SHEET_ID'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
```

## 4. API Security Hardening

### Rate Limiting Enhancement
```javascript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

const limiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:',
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      retryAfter: req.rateLimit.resetTime
    });
  }
});
```

### Input Validation
```javascript
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const sanitizeInput = (input: any) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }
  return input;
};

const formSchema = z.object({
  name: z.string().min(2).max(100).transform(sanitizeInput),
  email: z.string().email().transform(sanitizeInput),
  phone: z.string().regex(/^[6-9]\d{9}$/).transform(sanitizeInput),
  message: z.string().min(10).max(1000).transform(sanitizeInput)
});
```

## 5. Security Headers

### Add to API responses:
```javascript
export default function handler(req: Request, res: Response) {
  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Handle request...
}
```

## 6. Secret Rotation Strategy

### Implement Key Rotation
```javascript
class KeyRotation {
  // Rotate every 90 days
  static readonly ROTATION_PERIOD = 90 * 24 * 60 * 60 * 1000;
  
  async shouldRotate(keyCreatedAt: Date): boolean {
    const age = Date.now() - keyCreatedAt.getTime();
    return age > KeyRotation.ROTATION_PERIOD;
  }
  
  async rotateServiceAccount() {
    // 1. Create new service account key
    // 2. Update secret storage
    // 3. Test new key
    // 4. Delete old key
  }
}
```

## 7. Audit Logging

### Log Security Events
```javascript
interface SecurityEvent {
  timestamp: Date;
  event: string;
  userId?: string;
  ip: string;
  userAgent: string;
  success: boolean;
}

class SecurityLogger {
  log(event: SecurityEvent) {
    // Send to monitoring service
    console.log(JSON.stringify({
      ...event,
      service: 'atm-franchise-india',
      environment: process.env.NODE_ENV
    }));
  }
}
```

## 8. Development vs Production

### Separate Configurations
```javascript
// config/development.ts
export const devConfig = {
  useLocalSecrets: true,
  debugMode: true,
  skipRateLimit: true
};

// config/production.ts
export const prodConfig = {
  useLocalSecrets: false,
  debugMode: false,
  skipRateLimit: false
};
```

## 9. Security Checklist

### Before Deployment
- [ ] All secrets in secure storage (not in code)
- [ ] Environment variables validated
- [ ] Rate limiting configured
- [ ] Input sanitization active
- [ ] Security headers set
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Error messages don't expose secrets
- [ ] Audit logging enabled
- [ ] Secret rotation scheduled

### Regular Audits
- [ ] Weekly: Check for exposed secrets in logs
- [ ] Monthly: Review access logs
- [ ] Quarterly: Rotate service account keys
- [ ] Yearly: Full security audit

## 10. Emergency Response

### If Secret is Compromised:
1. **Immediate Actions**
   ```bash
   # Revoke compromised key
   gcloud iam service-accounts keys delete KEY_ID
   
   # Generate new key
   gcloud iam service-accounts keys create new-key.json
   ```

2. **Update All Deployments**
   ```bash
   vercel env rm GOOGLE_SERVICE_ACCOUNT_KEY production
   vercel env add GOOGLE_SERVICE_ACCOUNT_KEY production
   ```

3. **Audit Access**
   - Check Google Sheets access logs
   - Review API access patterns
   - Look for unauthorized data access

4. **Notify**
   - Inform team members
   - Document incident
   - Update security procedures

## Platform-Specific Setup

### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Add secrets
vercel secrets add google-key "$(cat service-account-key.json)"

# Link to environment
vercel env add GOOGLE_SERVICE_ACCOUNT_KEY production
```

### Netlify
```bash
# Via CLI
netlify env:set GOOGLE_SERVICE_ACCOUNT_KEY "value" --context production

# Via UI
# Site Settings → Environment Variables → Add Variable
```

### AWS Amplify
```bash
# Via CLI
amplify update function
# Choose "Secret values"
# Add your secrets
```

## Monitoring & Alerts

### Set Up Monitoring
1. **Failed Authentication Attempts**
   - Alert after 3 failed attempts
   - Block IP after 10 attempts

2. **Unusual Access Patterns**
   - Alert on access from new locations
   - Alert on bulk data exports

3. **Secret Access**
   - Log all secret retrievals
   - Alert on access outside business hours

## Compliance Considerations

### GDPR Compliance
- Encrypt personal data at rest
- Implement right to deletion
- Maintain audit logs

### India Data Protection
- Store data within India when required
- Implement consent mechanisms
- Provide data portability

---

**Remember:** Security is not a one-time setup but an ongoing process. Regular audits and updates are essential.

*Last Updated: December 2024*  
*Next Review: March 2025*