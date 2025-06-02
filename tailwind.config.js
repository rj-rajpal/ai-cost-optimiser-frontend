/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'soft-navy': '#3E4C59',
  			'sky-gray': '#CBD2D9',
  			'muted-indigo': '#667EEA',
  			'mist-teal': '#A7DADC',
  			'cloud-white': '#F9FAFB',
  			'fog-gray': '#E5E7EB',
  			'charcoal-black': '#1F2933',
  			'slate-gray': '#6B7280',
  			'calm-green': '#A7F3D0',
  			'soft-rose': '#FECACA',
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
  			'primary-original': '#2B84F6',
  			'primary-50': '#EBF5FF',
  			'primary-100': '#DBEAFE',
  			'primary-500': '#3B82F6',
  			'primary-600': '#2563EB',
  			'primary-700': '#1D4ED8',
  			'primary-900': '#1E3A8A',
  			'secondary-original': '#6B7280',
  			'secondary-100': '#F3F4F6',
  			'secondary-200': '#E5E7EB',
  			'secondary-300': '#D1D5DB',
  			'secondary-400': '#9CA3AF',
  			'secondary-600': '#4B5563',
  			'secondary-700': '#374151',
  			'secondary-800': '#1F2937',
  			'secondary-900': '#111827',
  			'accent-original': '#22C55E',
  			'accent-100': '#DCFCE7',
  			'accent-500': '#22C55E',
  			'accent-600': '#16A34A',
  			'background-original': '#0F1117',
  			'background-50': '#F8FAFC',
  			'background-100': '#F1F5F9',
  			'background-800': '#1E293B',
  			'background-900': '#0F172A',
  			surface: '#1F2937',
  			'surface-50': '#F9FAFB',
  			'surface-100': '#F3F4F6',
  			'surface-200': '#E5E7EB',
  			'surface-700': '#374151',
  			'surface-800': '#1F2937',
  			'text-primary': '#F9FAFB',
  			'text-secondary': '#D1D5DB',
  			'text-tertiary': '#9CA3AF',
  			'text-inverse': '#111827',
  			success: '#10B981',
  			'success-100': '#D1FAE5',
  			'success-500': '#10B981',
  			'success-600': '#059669',
  			warning: '#F59E0B',
  			'warning-100': '#FEF3C7',
  			'warning-500': '#F59E0B',
  			'warning-600': '#D97706',
  			error: '#EF4444',
  			'error-100': '#FEE2E2',
  			'error-500': '#EF4444',
  			'error-600': '#DC2626',
  			'border-original': 'rgba(255, 255, 255, 0.1)',
  			'border-active': 'rgba(255, 255, 255, 0.2)',
  			'border-focus': '#2B84F6',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			heading: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			body: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			caption: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Consolas',
  				'Monaco',
  				'monospace'
  			]
  		},
  		fontSize: {
  			xs: [
  				'0.75rem',
  				{
  					lineHeight: '1rem'
  				}
  			],
  			sm: [
  				'0.875rem',
  				{
  					lineHeight: '1.25rem'
  				}
  			],
  			base: [
  				'1rem',
  				{
  					lineHeight: '1.5rem'
  				}
  			],
  			lg: [
  				'1.125rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			xl: [
  				'1.25rem',
  				{
  					lineHeight: '1.75rem'
  				}
  			],
  			'2xl': [
  				'1.5rem',
  				{
  					lineHeight: '2rem'
  				}
  			],
  			'3xl': [
  				'1.875rem',
  				{
  					lineHeight: '2.25rem'
  				}
  			],
  			'4xl': [
  				'2.25rem',
  				{
  					lineHeight: '2.5rem'
  				}
  			],
  			'5xl': [
  				'3rem',
  				{
  					lineHeight: '1'
  				}
  			],
  			'6xl': [
  				'3.75rem',
  				{
  					lineHeight: '1'
  				}
  			]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem'
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  			base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  			elevation: '0 10px 25px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23)',
  			floating: '0 4px 12px rgba(0, 0, 0, 0.15)',
  			mist: '0 4px 16px rgba(62, 76, 89, 0.08), 0 2px 8px rgba(62, 76, 89, 0.04)'
  		},
  		borderRadius: {
  			sm: 'calc(var(--radius) - 4px)',
  			md: 'calc(var(--radius) - 2px)',
  			lg: 'var(--radius)',
  			xl: '1rem',
  			'2xl': '1.5rem'
  		},
  		animation: {
  			shimmer: 'shimmer 2s ease-in-out infinite',
  			'fade-in': 'fadeIn 200ms ease-out',
  			'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
  			'scale-in': 'scaleIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1)'
  		},
  		keyframes: {
  			shimmer: {
  				'0%': {
  					opacity: '0.1'
  				},
  				'50%': {
  					opacity: '0.3'
  				},
  				'100%': {
  					opacity: '0.1'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideIn: {
  				'0%': {
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					transform: 'translateX(0)'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			}
  		},
  		transitionTimingFunction: {
  			smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  		},
  		transitionDuration: {
  			'200': '200ms',
  			'300': '300ms',
  			'500': '500ms'
  		},
  		zIndex: {
  			'60': '60',
  			'70': '70',
  			'80': '80',
  			'90': '90',
  			'100': '100',
  			dropdown: '800',
  			sidebar: '900',
  			header: '1000',
  			notification: '1100'
  		},
  		minHeight: {
  			touch: '44px'
  		},
  		minWidth: {
  			touch: '44px'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}