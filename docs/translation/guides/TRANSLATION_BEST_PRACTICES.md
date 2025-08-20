# Translation Best Practices Guide

## Namespace Organization

### Current Namespaces:
- **common**: Shared UI elements (buttons, labels, messages)
- **home**: Homepage specific content
- **forms**: All form labels, placeholders, and validation messages
- **navigation**: Menu items and navigation elements
- **footer**: Footer content
- **errors**: Error messages and alerts

## Key Naming Conventions

### Hierarchical Structure:
```json
{
  "section": {
    "subsection": {
      "element": {
        "property": "value"
      }
    }
  }
}
```

### Examples:
- `home.hero.title` - Homepage hero title
- `forms.fields.email.label` - Email field label
- `forms.fields.email.placeholder` - Email field placeholder
- `forms.validation.emailInvalid` - Email validation error

## Component Implementation

### ✅ Correct Implementation:
```tsx
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation('namespace');
  
  return (
    <div>
      <h1>{t('title', 'Fallback Title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
};
```

### ❌ Common Mistakes:
1. **Hardcoded text in JSX**
2. **Using t() inside loops without unique keys**
3. **String concatenation with translations**
4. **Missing fallback values**

## Performance Optimization

### 1. Lazy Load Translations:
```tsx
// Only load needed namespaces
const { t } = useTranslation(['forms', 'common']);
```

### 2. Memoize Translations:
```tsx
const translatedTitle = useMemo(
  () => t('title'),
  [t, i18n.language]
);
```

### 3. Use Trans Component for Complex HTML:
```tsx
<Trans i18nKey="termsAndConditions">
  I agree to the <Link to="/terms">Terms & Conditions</Link>
</Trans>
```

## Testing Translations

### 1. Run validation script:
```bash
npm run validate:translations
```

### 2. Check coverage:
```bash
npm run audit:translations
```

### 3. Test all languages:
```bash
npm run test:languages
```

## Adding New Translations

### 1. Add to English first:
```bash
# Edit public/locales/en/namespace.json
```

### 2. Run auto-translate:
```bash
npm run translate:all
```

### 3. Validate consistency:
```bash
npm run validate:translations
```

## Debugging

### Check missing translations:
```javascript
// Enable debug mode in i18n.ts
debug: true,
saveMissing: true,
```

### Browser console helpers:
```javascript
// Check current language
i18n.language

// Change language
i18n.changeLanguage('hi')

// Get available languages
i18n.languages
```
