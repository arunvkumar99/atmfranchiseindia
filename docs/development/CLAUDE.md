# Claude AI Assistant Context

## Project Overview
**ATM Franchise India** - A multi-language website for ATM franchise opportunities in India.

## Technology Stack
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1 with SWC
- **Styling**: Tailwind CSS with shadcn/ui components
- **Internationalization**: i18next with react-i18next
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Routing**: React Router v6 with custom language-aware routing

## Translation System

### Current Status
- **Languages**: 13 (English + 12 Indian regional languages)
- **Translation Coverage**: ~34% (needs improvement)
- **Key Issue**: Components have hardcoded English text instead of using t() functions

### Known Issues
1. **Rendering Issue**: Most pages import useTranslation but don't use it
2. **Form Components**: Have the most hardcoded text (47+ instances in JoinUs.tsx)
3. **Language Persistence**: Fixed with custom useLanguageRouter hook

### Quick Commands
```bash
# Check translation coverage
npm run scan:translations
node scripts/scan-hardcoded-text.cjs

# Fix form translations
node scripts/fix-form-translations.cjs

# Comprehensive audit
node scripts/comprehensive-translation-audit.cjs

# Run dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure
```
src/
├── pages/          # Page components (27 files)
├── components/     # Reusable components (73 files)
├── hooks/          # Custom hooks including useLanguageRouter
├── lib/            # Utilities and configurations
├── stores/         # Zustand state management
└── types/          # TypeScript type definitions

public/locales/     # Translation JSON files (13 languages × 16 files)
scripts/           # Automation scripts for translations
```

## Key Files to Remember
- `src/hooks/useLanguageRouter.tsx` - Language-aware routing
- `src/lib/i18n.ts` - i18next configuration
- `scripts/scan-hardcoded-text.cjs` - Find untranslated text
- `scripts/fix-form-translations.cjs` - Auto-fix form translations
- `TRANSLATION_GUIDE.md` - Complete translation documentation

## Common Tasks

### Adding Translations to a Component
```tsx
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation('namespace');
  return <h1>{t('title', 'Fallback Text')}</h1>;
};
```

### Using Language-Aware Links
```tsx
import { Link } from '@/hooks/useLanguageRouter';
// NOT from 'react-router-dom'
```

### Running Translation Audit
```bash
# Full audit
node scripts/comprehensive-translation-audit.cjs

# Find hardcoded text
node scripts/scan-hardcoded-text.cjs

# Check specific language
node scripts/verify-actual-translations.cjs
```

## Important Notes

### For Code Changes
1. **Never use hardcoded text** - Always use t() function
2. **Import correct Link** - Use `@/hooks/useLanguageRouter`
3. **Test language switching** - Verify persistence across navigation
4. **Run coverage check** - Before committing changes

### Translation Keys Pattern
```json
{
  "title": "Page Title",
  "buttons": {
    "submit": "Submit",
    "cancel": "Cancel"
  },
  "forms": {
    "labels": { "name": "Name" },
    "placeholders": { "name": "Enter name" }
  }
}
```

### Performance Optimizations
- React.memo used in key components
- Lazy loading for language files
- Zustand for efficient state management
- Vite with SWC for fast builds

## Recent Changes
1. Fixed language persistence across navigation
2. Added translation support to 10 form components
3. Fixed OurProducts page to use translations
4. Created comprehensive documentation
5. Built automation scripts for translation management

## Next Priority Tasks
1. Increase translation coverage from 34% to 90%+
2. Fix remaining pages with hardcoded text
3. Implement translation for dynamic content
4. Add language detection based on user location
5. Create unit tests for translation system

## Contact & Resources
- **Documentation**: See TRANSLATION_GUIDE.md
- **Scripts**: Check scripts/ directory
- **Translation Files**: public/locales/
- **Google Translation API**: Used for automated translations

## Quick Debug Commands
```bash
# Check if translations are loading
localStorage.getItem('i18nextLng')

# Force language change
i18n.changeLanguage('hi')

# Check current language
i18n.language

# List available languages
i18n.languages
```

---
Last Updated: Current Session
Translation Coverage: 34% (needs improvement to 90%+)
Priority: Fix hardcoded text in components