# Translation System Guide

## Overview
This application supports 13 languages including English and 12 Indian regional languages. The translation system is built using **i18next** and **react-i18next**.

## Current Status
- **Translation Coverage**: ~34% (as of last scan)
- **Languages Supported**: 13 (English + 12 Indian languages)
- **Translation Files**: Complete for all languages
- **Rendering Implementation**: In progress

## Architecture

### Translation Structure
```
public/locales/
├── en/           # English (base language)
├── hi/           # Hindi
├── bn/           # Bengali
├── ta/           # Tamil
├── te/           # Telugu
├── mr/           # Marathi
├── gu/           # Gujarati
├── ur/           # Urdu
├── kn/           # Kannada
├── or/           # Odia (Oriya)
├── pa/           # Punjabi
├── as/           # Assamese
└── ml/           # Malayalam
```

### Key Components

1. **Language Router Hook** (`src/hooks/useLanguageRouter.tsx`)
   - Maintains language selection across navigation
   - Provides language-aware Link component
   - Preserves language in URL paths

2. **i18n Configuration** (`src/lib/i18n.ts`)
   - Configures supported languages
   - Sets up namespace loading
   - Handles language detection and persistence

## Implementation Guide

### For New Components

Always use translations instead of hardcoded text:

```tsx
// ❌ WRONG - Hardcoded text
const MyComponent = () => {
  return (
    <div>
      <h1>Welcome to ATM Franchise</h1>
      <button>Submit Application</button>
    </div>
  );
};

// ✅ CORRECT - Using translations
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('namespace');
  
  return (
    <div>
      <h1>{t('welcome.title', 'Welcome to ATM Franchise')}</h1>
      <button>{t('buttons.submit', 'Submit Application')}</button>
    </div>
  );
};
```

### For Navigation Links

Use the language-aware Link component:

```tsx
// ❌ WRONG - Regular Link
import { Link } from 'react-router-dom';

// ✅ CORRECT - Language-aware Link
import { Link } from '@/hooks/useLanguageRouter';
```

### Translation Key Conventions

Follow these naming patterns for consistency:

```javascript
{
  // Page titles
  "title": "Page Title",
  "subtitle": "Page Subtitle",
  
  // Navigation
  "nav": {
    "home": "Home",
    "about": "About Us"
  },
  
  // Buttons
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel",
    "learnMore": "Learn More"
  },
  
  // Form elements
  "forms": {
    "labels": {
      "name": "Full Name",
      "email": "Email Address"
    },
    "placeholders": {
      "name": "Enter your name",
      "email": "your@email.com"
    },
    "validation": {
      "required": "This field is required",
      "invalidEmail": "Invalid email address"
    }
  },
  
  // Messages
  "messages": {
    "success": "Operation successful",
    "error": "An error occurred",
    "loading": "Loading..."
  }
}
```

## Common Issues and Solutions

### Issue 1: Text Not Translating
**Problem**: Text remains in English even after language change
**Solution**: Component is using hardcoded text instead of t() function

```tsx
// Check if component uses translation
const { t } = useTranslation('namespace');

// Replace hardcoded text
<span>Contact Us</span>  // ❌
<span>{t('contact')}</span>  // ✅
```

### Issue 2: Language Resets on Navigation
**Problem**: Language selection doesn't persist across pages
**Solution**: Use language-aware routing

```tsx
import { Link, useNavigate } from '@/hooks/useLanguageRouter';
```

### Issue 3: Missing Translation Keys
**Problem**: Console shows missing translation warnings
**Solution**: Add missing keys to translation JSON files

## Maintenance Scripts

### 1. Scan for Hardcoded Text
```bash
node scripts/scan-hardcoded-text.cjs
```
Identifies components with hardcoded text that needs translation.

### 2. Fix Form Components
```bash
node scripts/fix-form-translations.cjs
```
Automatically adds translation support to form components.

### 3. Comprehensive Translation Audit
```bash
node scripts/comprehensive-translation-audit.cjs
```
Checks actual translation completion percentage.

### 4. Find English Content
```bash
node scripts/find-english-content.cjs
```
Identifies English text in non-English translation files.

## Testing Translations

### Manual Testing
1. Run the development server: `npm run dev`
2. Select different languages from the language dropdown
3. Verify all text changes to the selected language
4. Check that language persists across page navigation

### Automated Verification
```bash
# Run translation verification
node scripts/verify-actual-translations.cjs

# Check translation coverage
node scripts/comprehensive-audit.cjs
```

## Adding New Content

When adding new features or pages:

1. **Create translation keys first**
   ```json
   // public/locales/en/newfeature.json
   {
     "title": "New Feature",
     "description": "Feature description"
   }
   ```

2. **Use translations in component**
   ```tsx
   const { t } = useTranslation('newfeature');
   return <h1>{t('title')}</h1>;
   ```

3. **Translate to other languages**
   - Run translation script: `node scripts/translate-content-fixed.cjs`
   - Or manually add translations to each language file

## Best Practices

1. **Always provide fallback text**: `t('key', 'Fallback Text')`
2. **Group related translations**: Use nested objects for organization
3. **Keep keys descriptive**: Use clear, meaningful key names
4. **Test all languages**: Verify translations work in all supported languages
5. **Use namespaces**: Separate translations by feature/page for better organization

## Supported Languages

| Code | Language | Script | Native Name |
|------|----------|--------|-------------|
| en | English | Latin | English |
| hi | Hindi | Devanagari | हिन्दी |
| bn | Bengali | Bengali | বাংলা |
| ta | Tamil | Tamil | தமிழ் |
| te | Telugu | Telugu | తెలుగు |
| mr | Marathi | Devanagari | मराठी |
| gu | Gujarati | Gujarati | ગુજરાતી |
| ur | Urdu | Arabic | اردو |
| kn | Kannada | Kannada | ಕನ್ನಡ |
| or | Odia | Odia | ଓଡ଼ିଆ |
| pa | Punjabi | Gurmukhi | ਪੰਜਾਬੀ |
| as | Assamese | Bengali | অসমীয়া |
| ml | Malayalam | Malayalam | മലയാളം |

## Contributing

When contributing to the codebase:
1. Never add hardcoded text - always use translations
2. Run `node scripts/scan-hardcoded-text.cjs` before committing
3. Ensure translation coverage remains above 90%
4. Test your changes in at least 3 different languages

## Resources

- [i18next Documentation](https://www.i18next.com/)
- [react-i18next Documentation](https://react.i18next.com/)
- [Google Cloud Translation API](https://cloud.google.com/translate)