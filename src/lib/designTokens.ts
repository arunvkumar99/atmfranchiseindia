// Design System - Standardized spacing, colors, and tokens
// This ensures consistent design maturity across the application

export const designTokens = {
  // Standardized spacing scale (based on 4px base unit)
  spacing: {
    'xs': '0.25rem',    // 4px
    'sm': '0.5rem',     // 8px
    'base': '0.75rem',  // 12px
    'md': '1rem',       // 16px
    'lg': '1.5rem',     // 24px
    'xl': '2rem',       // 32px
    '2xl': '3rem',      // 48px
    '3xl': '4rem',      // 64px
    '4xl': '6rem',      // 96px
    '5xl': '8rem',      // 128px
  },

  // Consistent border radius scale
  borderRadius: {
    'sm': '0.25rem',
    'base': '0.5rem',
    'md': '0.75rem',
    'lg': '1rem',
    'xl': '1.5rem',
    '2xl': '2rem',
    'full': '9999px',
  },

  // Typography scale
  fontSize: {
    'xs': ['0.75rem', { lineHeight: '1rem' }],
    'sm': ['0.875rem', { lineHeight: '1.25rem' }],
    'base': ['1rem', { lineHeight: '1.5rem' }],
    'lg': ['1.125rem', { lineHeight: '1.75rem' }],
    'xl': ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
  },

  // Enhanced shadows for professional design
  boxShadow: {
    'elegant': '0 4px 20px -4px rgba(0, 0, 0, 0.1)',
    'professional': '0 10px 30px -10px rgba(0, 0, 0, 0.15)',
    'modern': '0 20px 60px -20px rgba(0, 0, 0, 0.25)',
    'subtle': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
    'glow': '0 0 20px rgba(59, 130, 246, 0.15)',
  },

  // Animation timings
  transitionDuration: {
    'fast': '150ms',
    'normal': '300ms',
    'slow': '500ms',
  },

  // Z-index scale
  zIndex: {
    'dropdown': 1000,
    'sticky': 1020,
    'fixed': 1030,
    'modal-backdrop': 1040,
    'modal': 1050,
    'popover': 1060,
    'tooltip': 1070,
  },
} as const;

// Semantic color mappings for better maintainability
export const semanticColors = {
  // Status colors
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))', 
  error: 'hsl(var(--destructive))',
  info: 'hsl(var(--info))',

  // Interactive colors
  interactive: 'hsl(var(--primary))',
  'interactive-hover': 'hsl(var(--primary-hover))',
  'interactive-active': 'hsl(var(--primary-active))',

  // Surface colors
  surface: 'hsl(var(--background))',
  'surface-elevated': 'hsl(var(--card))',
  'surface-overlay': 'hsl(var(--popover))',

  // Text colors
  'text-primary': 'hsl(var(--foreground))',
  'text-secondary': 'hsl(var(--muted-foreground))',
  'text-inverse': 'hsl(var(--primary-foreground))',

  // Border colors
  'border-subtle': 'hsl(var(--border))',
  'border-strong': 'hsl(var(--border-strong))',
} as const;

// Component-specific design patterns
export const componentPatterns = {
  card: {
    base: 'bg-surface-elevated border border-border-subtle rounded-lg shadow-elegant',
    hover: 'hover:shadow-professional transition-shadow duration-normal',
    interactive: 'cursor-pointer hover:scale-[1.02] transition-transform duration-fast',
  },
  
  button: {
    base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors duration-fast',
    sizes: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-4 text-base',
      lg: 'h-12 px-6 text-lg',
    },
  },

  input: {
    base: 'border border-border-subtle rounded-md bg-surface text-text-primary placeholder:text-text-secondary focus:border-interactive focus:ring-2 focus:ring-interactive/20',
    sizes: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3 text-base', 
      lg: 'h-12 px-4 text-lg',
    },
  },

  layout: {
    container: 'mx-auto px-md sm:px-lg lg:px-xl max-w-7xl',
    section: 'py-2xl sm:py-3xl',
    grid: {
      responsive: 'grid gap-lg sm:gap-xl',
      '2-col': 'grid-cols-1 md:grid-cols-2',
      '3-col': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      '4-col': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    },
  },
} as const;

export default designTokens;