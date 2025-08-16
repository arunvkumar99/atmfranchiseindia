import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
				'display': ['Inter', 'system-ui', 'sans-serif'],
				'body': ['Inter', 'system-ui', 'sans-serif'],
				'heading': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			spacing: {
				'xs': '0.25rem',
				'sm': '0.5rem', 
				'base': '0.75rem',
				'md': '1rem',
				'lg': '1.5rem',
				'xl': '2rem',
				'2xl': '3rem',
				'3xl': '4rem',
				'4xl': '6rem',
				'5xl': '8rem',
			},
			backgroundImage: {
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-success': 'var(--gradient-success)',
				'gradient-card': 'var(--gradient-card)',
				'gradient-modern-hero': 'var(--gradient-modern-hero)',
				'gradient-modern-light': 'var(--gradient-modern-light)',
				'gradient-section-dark': 'var(--gradient-section-dark)',
				'gradient-section-light': 'var(--gradient-section-light)',
				'gradient-glass': 'var(--gradient-glass)',
				'gradient-accent-red': 'var(--gradient-accent-red)',
				'gradient-accent-light-red': 'var(--gradient-accent-light-red)',
				'gradient-accent-crimson': 'var(--gradient-accent-crimson)',
				'gradient-accent-warm': 'var(--gradient-accent-warm)',
			},
			boxShadow: {
				'professional': 'var(--shadow-professional)',
				'modern': 'var(--shadow-modern)',
				'glass': 'var(--shadow-glass)',
				'soft': 'var(--shadow-soft)',
				'success': 'var(--shadow-success)',
				'glow-modern': 'var(--shadow-glow-modern)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'count-up': {
					'0%': { transform: 'translateY(20px) rotateX(-10deg)', opacity: '0' },
					'100%': { transform: 'translateY(0) rotateX(0deg)', opacity: '1' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 20px hsl(var(--brand-red) / 0.3)' },
					'50%': { boxShadow: '0 0 40px hsl(var(--brand-red) / 0.6)' }
				},
				'float-3d': {
					'0%, 100%': { transform: 'translateY(0px) rotateY(0deg)' },
					'50%': { transform: 'translateY(-10px) rotateY(5deg)' }
				},
				'pulse-3d': {
					'0%, 100%': { 
						transform: 'scale(1) rotateX(0deg)',
						textShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
					},
					'50%': { 
						transform: 'scale(1.05) rotateX(2deg)',
						textShadow: '0 0 40px rgba(255, 255, 255, 0.8)'
					}
				},
				'shimmer': {
					'0%': { backgroundPosition: '-1000px 0' },
					'100%': { backgroundPosition: '1000px 0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'count-up': 'count-up 0.8s ease-out 0.3s both',
				'glow': 'glow 2s ease-in-out infinite',
				'float-3d': 'float-3d 3s ease-in-out infinite',
				'pulse-3d': 'pulse-3d 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
