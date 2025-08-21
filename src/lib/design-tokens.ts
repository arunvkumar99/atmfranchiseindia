// Premium Design Tokens for ATM Franchise India
// Business-grade color palette with semantic tokens for financial trust

export const designTokens = {
  // Core Brand Colors - Sophisticated Financial Blue & Gold
  colors: {
    // Primary - Trust Blue (Professional Banking)
    primary: {
      50: 'hsl(214, 100%, 97%)',  // Lightest blue tint
      100: 'hsl(214, 95%, 93%)',
      200: 'hsl(213, 97%, 87%)',
      300: 'hsl(212, 96%, 78%)',
      400: 'hsl(213, 94%, 68%)',
      500: 'hsl(217, 91%, 60%)',  // Main brand blue
      600: 'hsl(221, 83%, 53%)',  // Current primary
      700: 'hsl(224, 76%, 48%)',
      800: 'hsl(226, 71%, 40%)',
      900: 'hsl(224, 64%, 33%)',
      950: 'hsl(226, 57%, 21%)',
    },
    
    // Secondary - Premium Gold (Success & Prosperity)
    gold: {
      50: 'hsl(49, 100%, 96%)',
      100: 'hsl(48, 100%, 88%)',
      200: 'hsl(48, 95%, 76%)',
      300: 'hsl(48, 97%, 64%)',
      400: 'hsl(43, 96%, 56%)',
      500: 'hsl(38, 92%, 50%)',   // Main gold
      600: 'hsl(32, 95%, 44%)',
      700: 'hsl(26, 90%, 37%)',
      800: 'hsl(23, 83%, 31%)',
      900: 'hsl(22, 78%, 26%)',
    },
    
    // Accent - Modern Teal (Growth & Innovation)
    teal: {
      50: 'hsl(166, 76%, 96%)',
      100: 'hsl(167, 85%, 89%)',
      200: 'hsl(168, 83%, 78%)',
      300: 'hsl(171, 77%, 64%)',
      400: 'hsl(172, 66%, 50%)',
      500: 'hsl(173, 80%, 40%)',  // Main teal
      600: 'hsl(175, 84%, 32%)',
      700: 'hsl(175, 77%, 26%)',
      800: 'hsl(176, 69%, 22%)',
      900: 'hsl(176, 61%, 19%)',
    },
    
    // Semantic Colors for Financial Context
    semantic: {
      // Trust & Security
      trust: 'hsl(217, 91%, 60%)',
      security: 'hsl(226, 71%, 40%)',
      verified: 'hsl(173, 80%, 40%)',
      
      // Financial Status
      profit: 'hsl(142, 76%, 36%)',
      growth: 'hsl(173, 80%, 40%)',
      premium: 'hsl(38, 92%, 50%)',
      
      // Risk & Alerts
      caution: 'hsl(38, 92%, 50%)',
      warning: 'hsl(25, 95%, 53%)',
      critical: 'hsl(0, 84%, 60%)',
      
      // Neutral Business Tones
      businessGray: {
        50: 'hsl(210, 40%, 98%)',
        100: 'hsl(210, 40%, 96%)',
        200: 'hsl(214, 32%, 91%)',
        300: 'hsl(213, 27%, 84%)',
        400: 'hsl(215, 20%, 65%)',
        500: 'hsl(215, 16%, 47%)',
        600: 'hsl(215, 19%, 35%)',
        700: 'hsl(215, 25%, 27%)',
        800: 'hsl(217, 33%, 17%)',
        900: 'hsl(222, 47%, 11%)',
        950: 'hsl(229, 84%, 5%)',
      }
    },
    
    // Background Gradients for Premium Feel
    gradients: {
      // Hero gradients
      heroLight: 'linear-gradient(135deg, hsl(214, 100%, 97%) 0%, hsl(213, 97%, 87%) 100%)',
      heroDark: 'linear-gradient(135deg, hsl(226, 57%, 21%) 0%, hsl(229, 84%, 5%) 100%)',
      
      // Premium business gradients
      businessPremium: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(224, 76%, 48%) 50%, hsl(226, 71%, 40%) 100%)',
      goldShimmer: 'linear-gradient(135deg, hsl(43, 96%, 56%) 0%, hsl(38, 92%, 50%) 50%, hsl(32, 95%, 44%) 100%)',
      tealGrowth: 'linear-gradient(135deg, hsl(171, 77%, 64%) 0%, hsl(173, 80%, 40%) 100%)',
      
      // Glass morphism overlays
      glassLight: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      glassDark: 'linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)',
      
      // Mesh gradients for modern backgrounds
      meshBlue: 'radial-gradient(at 40% 20%, hsla(217, 91%, 60%, 0.3) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(173, 80%, 40%, 0.2) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(38, 92%, 50%, 0.2) 0px, transparent 50%)',
      meshGold: 'radial-gradient(at 0% 0%, hsla(38, 92%, 50%, 0.3) 0px, transparent 50%), radial-gradient(at 50% 50%, hsla(43, 96%, 56%, 0.2) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(32, 95%, 44%, 0.2) 0px, transparent 50%)',
    }
  },
  
  // Typography System with Indian Language Support
  typography: {
    // Font families with fallbacks for Indian languages
    fonts: {
      heading: '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif',
      body: '"Inter", "Noto Sans", system-ui, -apple-system, sans-serif',
      mono: '"JetBrains Mono", "Courier New", monospace',
      indian: {
        devanagari: '"Noto Sans Devanagari", "Noto Sans", sans-serif',
        bengali: '"Noto Sans Bengali", "Noto Sans", sans-serif',
        tamil: '"Noto Sans Tamil", "Noto Sans", sans-serif',
        telugu: '"Noto Sans Telugu", "Noto Sans", sans-serif',
        gujarati: '"Noto Sans Gujarati", "Noto Sans", sans-serif',
      }
    },
    
    // Fluid type scale using clamp()
    scale: {
      xs: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
      sm: 'clamp(0.875rem, 0.825rem + 0.25vw, 1rem)',
      base: 'clamp(1rem, 0.95rem + 0.25vw, 1.125rem)',
      lg: 'clamp(1.125rem, 1.05rem + 0.375vw, 1.25rem)',
      xl: 'clamp(1.25rem, 1.15rem + 0.5vw, 1.5rem)',
      '2xl': 'clamp(1.5rem, 1.35rem + 0.75vw, 1.875rem)',
      '3xl': 'clamp(1.875rem, 1.65rem + 1.125vw, 2.25rem)',
      '4xl': 'clamp(2.25rem, 1.95rem + 1.5vw, 3rem)',
      '5xl': 'clamp(3rem, 2.55rem + 2.25vw, 3.75rem)',
      '6xl': 'clamp(3.75rem, 3.15rem + 3vw, 4.5rem)',
      '7xl': 'clamp(4.5rem, 3.75rem + 3.75vw, 6rem)',
    },
    
    // Font weights
    weights: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    // Line heights for readability
    lineHeights: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    
    // Letter spacing
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    }
  },
  
  // Spacing System
  spacing: {
    // Base spacing scale
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  // Shadow System for Depth
  shadows: {
    // Elevation shadows
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
    
    // Colored shadows for branding
    primary: '0 10px 30px -10px hsla(217, 91%, 60%, 0.3)',
    gold: '0 10px 30px -10px hsla(38, 92%, 50%, 0.3)',
    teal: '0 10px 30px -10px hsla(173, 80%, 40%, 0.3)',
    
    // Glow effects
    glow: {
      primary: '0 0 30px hsla(217, 91%, 60%, 0.4)',
      gold: '0 0 30px hsla(38, 92%, 50%, 0.4)',
      teal: '0 0 30px hsla(173, 80%, 40%, 0.4)',
    },
    
    // Inner shadows for depth
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    innerLg: 'inset 0 4px 8px 0 rgba(0, 0, 0, 0.1)',
  },
  
  // Border Radius for Modern Feel
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  
  // Animation Timings
  animation: {
    // Durations
    durations: {
      instant: '75ms',
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '700ms',
      slowest: '1000ms',
    },
    
    // Easings
    easings: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
    }
  },
  
  // Z-index Scale
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    modalBackdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    notification: '1080',
  }
};

// Export individual token groups for easier imports
export const { colors, typography, spacing, shadows, borderRadius, animation, zIndex } = designTokens;