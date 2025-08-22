# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
**ATM Franchise India** - A multi-language business website for ATM franchise opportunities in India, built with React, TypeScript, and direct Google Sheets integration.

## Commands

### Development
```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build with optimizations
npm run preview      # Preview production build
```

### Testing
```bash
npm test             # Run vitest tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Generate coverage report
npm run test:watch   # Watch mode for tests
```

### Code Quality
```bash
npm run lint         # Run ESLint
```

### Translation Management
```bash
npm run translate:all      # Translate all content
npm run translate:check    # Check translation status
npm run translate:cleanup  # Clean up translations
npm run scan:translations  # Find hardcoded text
npm run audit:translations # Comprehensive audit
npm run validate:translations # Validate all translations
npm run fix:translations   # Auto-fix form translations
```

## Architecture

### Tech Stack
- **Framework**: React 18.3.1 with TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1 with SWC for fast compilation
- **Styling**: Tailwind CSS with shadcn/ui components
- **State**: Zustand for global state management
- **Forms**: React Hook Form with Zod validation
- **i18n**: i18next with 13 Indian languages
- **Routing**: React Router v6 with custom language-aware routing

### Project Structure
```
src/
├── pages/          # Page components (Home, AboutUs, ContactUs, etc.)
├── components/     # Reusable UI components
│   ├── ui/        # shadcn/ui base components
│   └── ...        # Business components (Header, Footer, Forms, etc.)
├── hooks/         # Custom React hooks
│   └── useLanguageRouter.tsx  # Language-aware routing
├── lib/           # Utilities and configurations
│   ├── i18n.ts    # i18next configuration
│   └── googleSheetsService.ts # Direct Sheets integration
├── stores/        # Zustand stores
└── types/         # TypeScript definitions

public/
└── locales/       # Translation files (13 languages × 18 namespaces)

scripts/           # Node.js automation scripts for translations
```

### Key Architectural Decisions

1. **No Database Architecture**: Direct Google Sheets integration via service account eliminates database costs (~$500-1000/year savings)

2. **Translation System**: 
   - Uses i18next with namespace-based organization
   - Custom `useLanguageRouter` hook maintains language across navigation
   - 13 supported languages: en, hi, bn, ta, te, mr, gu, ur, kn, or, pa, as, ml

3. **Performance Optimizations**:
   - Code splitting with manual chunks (react, ui, forms, i18n vendors)
   - Lazy loading for language files
   - Compression (gzip + brotli) in production
   - Target load time <3s on 3G

4. **Form Handling**:
   - Progressive multi-step forms with validation
   - Offline support with local storage
   - Direct submission to Google Sheets
   - Rate limiting and sanitization

## Translation System Details

### Current Implementation
- **Coverage**: Target 100% for Hindi, progressive for other languages
- **Key Pattern**: Namespace-based organization (home, about, contact, forms, etc.)
- **Language Persistence**: Custom router maintains selection across navigation

### Adding Translations
```tsx
// Always use useTranslation hook
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation('namespace');
  return <h1>{t('key', 'Fallback text')}</h1>;
};
```

### Language-Aware Navigation
```tsx
// Use custom Link from useLanguageRouter
import { Link } from '@/hooks/useLanguageRouter';
// NOT from 'react-router-dom'
```

## Critical Files

- `src/hooks/useLanguageRouter.tsx` - Maintains language across navigation
- `src/lib/i18n.ts` - i18next configuration with all 13 languages
- `src/lib/googleSheetsService.ts` - Direct Sheets API integration
- `scripts/scan-hardcoded-text.cjs` - Finds untranslated text
- `scripts/comprehensive-translation-audit.cjs` - Full translation audit

## Development Guidelines

1. **Never hardcode text** - Always use t() function for any user-visible text
2. **Use correct imports** - Link from `@/hooks/useLanguageRouter`, not react-router-dom
3. **Test language switching** - Verify persistence across all navigation
4. **Run translation audit** - Before any commit: `npm run scan:translations`
5. **Follow existing patterns** - Check similar components for implementation patterns