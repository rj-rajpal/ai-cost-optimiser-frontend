/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2B84F6', // Trust-building blue - blue-600
        'primary-50': '#EBF5FF', // Very light blue - blue-50
        'primary-100': '#DBEAFE', // Light blue - blue-100
        'primary-500': '#3B82F6', // Medium blue - blue-500
        'primary-600': '#2563EB', // Primary blue - blue-600
        'primary-700': '#1D4ED8', // Dark blue - blue-700
        'primary-900': '#1E3A8A', // Very dark blue - blue-900

        // Secondary Colors
        'secondary': '#6B7280', // Neutral gray - gray-500
        'secondary-100': '#F3F4F6', // Light gray - gray-100
        'secondary-200': '#E5E7EB', // Light gray - gray-200
        'secondary-300': '#D1D5DB', // Medium light gray - gray-300
        'secondary-400': '#9CA3AF', // Medium gray - gray-400
        'secondary-600': '#4B5563', // Dark gray - gray-600
        'secondary-700': '#374151', // Darker gray - gray-700
        'secondary-800': '#1F2937', // Very dark gray - gray-800
        'secondary-900': '#111827', // Darkest gray - gray-900

        // Accent Colors
        'accent': '#22C55E', // Success green - green-500
        'accent-100': '#DCFCE7', // Light green - green-100
        'accent-500': '#22C55E', // Medium green - green-500
        'accent-600': '#16A34A', // Dark green - green-600

        // Background Colors
        'background': '#0F1117', // Deep charcoal - slate-900
        'background-50': '#F8FAFC', // Very light slate - slate-50
        'background-100': '#F1F5F9', // Light slate - slate-100
        'background-800': '#1E293B', // Dark slate - slate-800
        'background-900': '#0F172A', // Very dark slate - slate-900

        // Surface Colors
        'surface': '#1F2937', // Elevated gray - gray-800
        'surface-50': '#F9FAFB', // Very light surface - gray-50
        'surface-100': '#F3F4F6', // Light surface - gray-100
        'surface-200': '#E5E7EB', // Medium light surface - gray-200
        'surface-700': '#374151', // Dark surface - gray-700
        'surface-800': '#1F2937', // Very dark surface - gray-800

        // Text Colors
        'text-primary': '#F9FAFB', // High-contrast white - gray-50
        'text-secondary': '#D1D5DB', // Muted light gray - gray-300
        'text-tertiary': '#9CA3AF', // Subtle gray - gray-400
        'text-inverse': '#111827', // Dark text for light backgrounds - gray-900

        // Status Colors
        'success': '#10B981', // Vibrant green - emerald-500
        'success-100': '#D1FAE5', // Light success - emerald-100
        'success-500': '#10B981', // Medium success - emerald-500
        'success-600': '#059669', // Dark success - emerald-600

        'warning': '#F59E0B', // Attention-grabbing amber - amber-500
        'warning-100': '#FEF3C7', // Light warning - amber-100
        'warning-500': '#F59E0B', // Medium warning - amber-500
        'warning-600': '#D97706', // Dark warning - amber-600

        'error': '#EF4444', // Clear red - red-500
        'error-100': '#FEE2E2', // Light error - red-100
        'error-500': '#EF4444', // Medium error - red-500
        'error-600': '#DC2626', // Dark error - red-600

        // Border Colors
        'border': 'rgba(255, 255, 255, 0.1)', // Subtle white border
        'border-active': 'rgba(255, 255, 255, 0.2)', // Active border
        'border-focus': '#2B84F6', // Focus border - primary
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'], // Headings font - Inter
        'body': ['Inter', 'system-ui', 'sans-serif'], // Body font - Inter
        'caption': ['Inter', 'system-ui', 'sans-serif'], // Caption font - Inter
        'mono': ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'], // Data/code font - JetBrains Mono
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }], // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }], // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }], // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }], // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }], // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        '5xl': ['3rem', { lineHeight: '1' }], // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }], // 60px
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
        '128': '32rem', // 512px
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'elevation': '0 10px 25px rgba(0, 0, 0, 0.19), 0 6px 10px rgba(0, 0, 0, 0.23)',
        'floating': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'sm': '0.25rem', // 4px
        'md': '0.5rem', // 8px
        'lg': '0.75rem', // 12px
        'xl': '1rem', // 16px
        '2xl': '1.5rem', // 24px
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in': 'slideIn 300ms cubic-bezier(0.4, 0.0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { opacity: '0.1' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0.1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'dropdown': '800',
        'sidebar': '900',
        'header': '1000',
        'notification': '1100',
      },
      minHeight: {
        'touch': '44px', // Minimum touch target size
      },
      minWidth: {
        'touch': '44px', // Minimum touch target size
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}