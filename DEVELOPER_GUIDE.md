# Developer Quick Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone repository
git clone [repository-url]
cd atmfranchiseindia

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

---

## 📁 Project Structure

```
atmfranchiseindia/
├── public/
│   └── locales/          # Translation files (13 languages)
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # Base UI components
│   │   └── ...          # Feature components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configurations
│   │   ├── design-system.ts    # Design tokens
│   │   ├── i18n.ts             # Translation config
│   │   └── utils-consolidated.ts # Utility functions
│   ├── pages/           # Page components
│   ├── styles/          # Global styles
│   └── App.tsx          # Main application component
├── .env                 # Environment variables
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies
```

---

## 🎨 Design System Usage

### Using Design Tokens
```typescript
import { designTokens } from '@/lib/design-system';

// Colors
<div style={{ backgroundColor: designTokens.colors.primary[600] }}>

// Spacing
<div style={{ padding: designTokens.spacing[4] }}>

// Typography
<p style={{ fontSize: designTokens.typography.fontSize.lg.size }}>

// Shadows
<div style={{ boxShadow: designTokens.shadows.md }}>
```

### Using Enhanced Button
```typescript
import { ButtonEnhanced } from '@/components/ui/button-enhanced';

<ButtonEnhanced 
  variant="default"
  size="lg"
  loading={isLoading}
  leftIcon={<Icon />}
  ariaLabel="Submit form"
>
  Submit
</ButtonEnhanced>
```

---

## 🌍 Translation System

### Adding Translations to Components
```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('namespace');
  
  return (
    <h1>{t('key', 'Fallback text')}</h1>
  );
};
```

### Translation File Structure
```json
// public/locales/en/home.json
{
  "hero": {
    "title": "Your ATM - Your Income",
    "subtitle": "Start your franchise today"
  }
}
```

### Generate Translations
```bash
npm run translate:all  # Translates to all 13 languages
```

---

## ♿ Accessibility Features

### Skip Navigation
Already implemented in App.tsx - no additional setup needed.

### ARIA Labels
```typescript
// Always add ARIA labels to interactive elements
<button aria-label="Close dialog">
  <X />
</button>

// Use AccessibleFormField for forms
<AccessibleFormField
  id="email"
  label="Email"
  required
  error={errors.email}
>
  <input type="email" />
</AccessibleFormField>
```

### Keyboard Shortcuts
- **Alt + 1**: Go to home
- **Alt + 2**: Focus main content
- **Alt + 3**: Open search
- **Alt + 4**: Go to footer
- **Escape**: Close modals/dropdowns

---

## 📱 Mobile Optimization

### Responsive Typography
```css
/* Use fluid typography classes */
.text-fluid-base  /* 16px → 18px */
.text-fluid-xl    /* 20px → 24px */
.text-fluid-4xl   /* 36px → 48px */
```

### Mobile-First Utilities
```css
.mobile-only     /* Show only on mobile */
.desktop-only    /* Show only on desktop */
.stack-mobile    /* Stack elements on mobile */
.touch-target    /* Minimum 44x44px */
```

---

## ⚡ Performance Optimization

### Image Optimization
```typescript
import { OptimizedImage } from '@/components/OptimizedImage';

<OptimizedImage
  src="/path/to/image.jpg"
  alt="Description"
  priority={false}  // Lazy load
  aspectRatio="16/9"
/>
```

### Animation Optimization
```typescript
import { AnimateOnScroll } from '@/components/PerformanceOptimizations';

<AnimateOnScroll animation="fadeIn" duration={600}>
  <YourContent />
</AnimateOnScroll>
```

### Code Splitting
Pages are automatically code-split. For components:
```typescript
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
```

---

## 🛠️ Common Tasks

### Adding a New Page
1. Create component in `/src/pages/`
2. Add route in `App.tsx`
3. Add translations in `/public/locales/`
4. Update navigation if needed

### Adding a New Language
1. Create folder: `/public/locales/[lang]/`
2. Add to `SUPPORTED_LANGUAGES` in `i18n.ts`
3. Run `npm run translate:all`

### Testing Accessibility
```bash
# Keyboard navigation
Tab through all elements

# Screen reader
Enable NVDA/JAWS and test

# Color contrast
Visit /design-audit
```

### Building for Production
```bash
npm run build
# Check bundle size in dist/stats.html
```

---

## 📊 Development Tools

### Available Routes (Dev Only)
- `/design-audit` - Design system audit
- `/verify-translations` - Translation verification
- `/test-translations` - Translation testing

### Performance Monitor
Shows FPS, memory, and load time in development mode.

### Translation Validator
Automatically validates translations and shows missing keys.

---

## 🔍 Debugging

### Translation Issues
```typescript
// Enable debug mode
localStorage.setItem('i18nextLng', 'en');
// Check console for missing keys
```

### Performance Issues
```typescript
// Check Performance Monitor (bottom-left in dev)
// Review bundle size: npm run build
// Check Chrome DevTools Performance tab
```

### Accessibility Issues
```typescript
// Use Chrome DevTools Lighthouse
// Test with axe DevTools extension
// Manual keyboard navigation test
```

---

## 📝 Code Standards

### Component Template
```typescript
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { designTokens } from '@/lib/design-system';

interface ComponentProps {
  className?: string;
  ariaLabel?: string;
}

export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ariaLabel, ...props }, ref) => {
    const { t } = useTranslation('namespace');
    
    return (
      <div
        ref={ref}
        className={cn('base-classes', className)}
        aria-label={ariaLabel}
        {...props}
      >
        {/* Content */}
      </div>
    );
  }
);

Component.displayName = 'Component';
```

### Naming Conventions
- Components: PascalCase (`ButtonEnhanced`)
- Files: kebab-case (`button-enhanced.tsx`)
- CSS classes: kebab-case (`touch-target`)
- Constants: UPPER_SNAKE_CASE (`SUPPORTED_LANGUAGES`)
- Functions: camelCase (`formatCurrency`)

---

## 🚨 Important Notes

### Environment Variables
```env
VITE_GOOGLE_TRANSLATE_API_KEY=your-api-key
```

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size per chunk: < 1MB
- Lighthouse score: > 90

---

## 📚 Resources

### Documentation
- [IMPROVEMENTS_DOCUMENTATION.md](./IMPROVEMENTS_DOCUMENTATION.md) - Detailed improvements
- [Design System](./src/lib/design-system.ts) - Design tokens
- [React Docs](https://react.dev) - React documentation
- [Tailwind CSS](https://tailwindcss.com) - Utility classes
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility

### Testing Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Accessibility testing
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance audit
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluation

---

## 💡 Tips & Tricks

1. **Use Design Tokens**: Always use tokens from `design-system.ts` for consistency
2. **Test on Mobile**: Always test on actual mobile devices, not just browser resize
3. **Check Translations**: Run `/verify-translations` after adding new text
4. **Monitor Bundle Size**: Keep an eye on bundle size with `npm run build`
5. **Accessibility First**: Add ARIA labels as you code, not after
6. **Performance**: Use `OptimizedImage` for all images
7. **Animations**: Test with reduced motion preference enabled

---

## 🆘 Troubleshooting

### Development Server Won't Start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Translations Not Working
```bash
# Clear cache and regenerate
npm run translate:cleanup
npm run translate:all
```

### Build Errors
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

### Performance Issues
- Disable browser extensions
- Clear browser cache
- Check for infinite loops in useEffect
- Review Performance Monitor output

---

*Last Updated: 2024*
*Version: 2.0.0*