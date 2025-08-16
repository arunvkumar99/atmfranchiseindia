# 🌐 Translation Setup Instructions

## Quick Start (Windows)

### Step 1: Create your .env file
```cmd
copy .env.example .env
```

### Step 2: Edit .env file
Open `.env` in notepad and add your Google API key:
```
GOOGLE_TRANSLATE_API_KEY=AIzaSy...your_actual_key_here
```

### Step 3: Run Translation
**Option A: Use the batch file (Easiest)**
```cmd
translate.bat
```

**Option B: Use npm command**
```cmd
npm run translate:all
```

---

## Troubleshooting

### "API key not set" Error
This means the script can't find your API key. Try these solutions:

#### Solution 1: Check .env file
1. Make sure `.env` file exists (not `.env.example`)
2. Open `.env` and verify your API key is there
3. Make sure there are no spaces around the `=` sign

Correct: `GOOGLE_TRANSLATE_API_KEY=AIzaSy...`
Wrong: `GOOGLE_TRANSLATE_API_KEY = AIzaSy...`

#### Solution 2: Set manually in Command Prompt
```cmd
set GOOGLE_TRANSLATE_API_KEY=your_api_key_here
npm run translate:all
```

#### Solution 3: Use PowerShell
```powershell
$env:GOOGLE_TRANSLATE_API_KEY="your_api_key_here"
npm run translate:all
```

### "Invalid API key" Error
- Check you copied the key correctly
- Wait 5 minutes (new keys take time to activate)
- Verify Cloud Translation API is enabled in Google Console

### "Quota exceeded" Error
- You've hit the daily limit
- Check Google Cloud Console > Quotas
- With free trial, you have $300 credit

---

## Files Created

### Configuration Files:
- `.env` - Your API key (NEVER commit this)
- `.env.example` - Template for others

### Scripts:
- `scripts/translate-content.cjs` - Main translation script
- `translate.bat` - Windows batch file for easy execution

### Translations:
- `public/locales/[language]/` - Translation JSON files

---

## Testing Translations

1. **Start dev server:**
```cmd
npm run dev
```

2. **Test language switching:**
- Open http://localhost:8080
- Click language selector in header
- Select Hindi, Bengali, or Tamil
- Verify content changes

---

## Command Reference

```bash
# Check for missing translations
npm run translate:check

# Translate all content
npm run translate:all

# Generate sample translations (for testing)
node scripts/generate-sample-translations.cjs

# Start development server
npm run dev
```

---

## API Key Security

### DO:
✅ Keep API key in `.env` file
✅ Add `.env` to `.gitignore`
✅ Use environment variables
✅ Restrict key in Google Console

### DON'T:
❌ Commit `.env` to git
❌ Share API key publicly
❌ Hard-code key in scripts

---

## Need Help?

1. Check if `.env` file exists and has your key
2. Try the `translate.bat` file
3. Make sure you're in the project directory
4. Verify Google Translation API is enabled

For Google Cloud issues:
- Console: https://console.cloud.google.com
- Translation API: https://cloud.google.com/translate/docs