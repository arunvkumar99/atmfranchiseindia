# 🌍 Translation Implementation Strategy

## Current Status
- ✅ i18n system configured and working
- ✅ Language switcher functional
- ⚠️ Only Header and Hero components use translations
- ❌ Most content remains in English

## Architecture Decision

### 1. Translation Hook Pattern
Create a custom hook that wraps useTranslation with our namespace strategy:
```typescript
export const useAppTranslation = (namespace?: string) => {
  const { t, i18n } = useTranslation(namespace || 'common');
  return { t, i18n, isRTL: ['ur', 'ar'].includes(i18n.language) };
};
```

### 2. Component Translation Strategy

#### Static Content
- All static text must use translation keys
- Format: `t('section.subsection.key')`
- Example: `t('hero.title')` instead of "Your ATM – Your Income"

#### Dynamic Content
- Blog posts, product descriptions: Store translations in JSON
- Form labels and validation messages: Use translation keys
- Error messages: Centralize in translation files

### 3. Namespace Organization
```
/locales
  /en
    - common.json      (navigation, buttons, common UI)
    - home.json        (homepage specific)
    - forms.json       (all form fields and validation)
    - products.json    (product descriptions)
    - blog.json        (blog UI, not content)
    - about.json       (about us page)
    - footer.json      (footer content)
```

### 4. Implementation Priority

#### Phase 1: Core Pages (Immediate)
1. Footer component
2. WhyATMFranchiseIndia component
3. TrustSignals component
4. Services component
5. FAQ component

#### Phase 2: Form Pages
1. BecomefranchisePage
2. SubmitLocation
3. ContactUs
4. All form components

#### Phase 3: Content Pages
1. AboutUs
2. OurProducts
3. Blog pages
4. PixellpayAdvantage

### 5. Translation Key Naming Convention
```
{
  "section": {
    "title": "Section Title",
    "subtitle": "Section Subtitle",
    "description": "Section Description",
    "items": {
      "item1": {
        "title": "Item 1 Title",
        "description": "Item 1 Description"
      }
    },
    "cta": {
      "primary": "Primary Button",
      "secondary": "Secondary Button"
    }
  }
}
```

### 6. Performance Considerations
- Lazy load translation namespaces
- Use React.memo for translated components
- Cache translations in localStorage
- Preload next likely language on hover

### 7. Developer Guidelines
1. **Never hardcode text** - Always use translation keys
2. **Use semantic keys** - `footer.contact.title` not `footer.text1`
3. **Provide fallbacks** - `t('key', 'Default Text')`
4. **Group related translations** - Keep related content in same namespace
5. **Comment complex keys** - Add comments for context-dependent translations

### 8. Testing Strategy
- Unit tests for translation hook
- Integration tests for language switching
- Visual regression tests for RTL languages
- Automated key coverage report

### 9. Missing Translation Handling
```typescript
// Development: Log missing keys
// Production: Show fallback text
// Staging: Send to translation service
```

### 10. Implementation Checklist
- [ ] Create useAppTranslation hook
- [ ] Update Footer component
- [ ] Update all Hero sections
- [ ] Update form components
- [ ] Update static pages
- [ ] Add loading states for translation switches
- [ ] Implement translation coverage test
- [ ] Document translation workflow