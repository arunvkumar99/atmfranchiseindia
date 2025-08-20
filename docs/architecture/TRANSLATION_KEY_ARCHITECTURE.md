# Translation Key Architecture
## By Priya - Senior Web Architect

### Key Design Principles

1. **Hierarchical Structure**
   - Namespace-based organization
   - Component-specific keys
   - Shared common keys

2. **Naming Convention**
   ```
   namespace.category.context.specific_key
   ```

3. **Namespace Structure**

```javascript
{
  // Common UI elements (shared across all components)
  "common": {
    "buttons": {
      "submit": "Submit",
      "save": "Save",
      "cancel": "Cancel",
      "next": "Next",
      "previous": "Previous",
      "continue": "Continue"
    },
    "status": {
      "loading": "Loading",
      "success": "Success",
      "error": "Error",
      "warning": "Warning"
    },
    "actions": {
      "add": "Add",
      "edit": "Edit",
      "delete": "Delete",
      "search": "Search",
      "filter": "Filter"
    }
  },
  
  // Form-specific translations
  "forms": {
    "fields": {
      // Reusable field labels
    },
    "placeholders": {
      // Reusable placeholder text
    },
    "validation": {
      // Validation messages
    }
  },
  
  // Component-specific namespaces
  "agent": {
    // Agent form specific
  },
  "franchise": {
    // Franchise form specific
  },
  "influencer": {
    // Influencer form specific
  }
}
```

4. **Key Categories**

- **labels**: Field labels and headings
- **placeholders**: Input placeholder text
- **buttons**: Button text and CTAs
- **messages**: Info/success/error messages
- **validation**: Form validation messages
- **options**: Dropdown/select options
- **content**: Static content blocks
- **tooltips**: Helper text and tooltips

5. **Best Practices**

- Use snake_case for keys
- Keep keys descriptive but concise
- Group related translations
- Avoid deep nesting (max 4 levels)
- Use interpolation for dynamic values
- Maintain consistency across languages