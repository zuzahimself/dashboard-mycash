/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Breakpoints oficiais (regras-figma): md 768, lg 1280, xl 1920
      screens: {
        md: '768px',
        lg: '1280px',
        xl: '1920px',
      },
      // Cores – tokens do Figma (semânticos e primitivos)
      colors: {
        brand: {
          200: '#f3ffb1',
          600: '#d7fe03',
          700: '#c4e703',
        },
        neutral: {
          0: '#ffffff',
          200: '#f3f4f6',
          300: '#e5e7eb',
          400: '#d1d5db',
          600: '#6b7280',
          1100: '#080b12',
        },
        secondary: {
          400: '#414652',
          900: '#070A10',
        },
        surface: {
          500: '#FFFFFF',
        },
        background: {
          300: '#F7F8F9',
        },
        green: {
          100: '#e8f9f2',
          500: '#44cb93',
          600: '#38BB82',
        },
        red: {
          300: '#f5a5ad',
          600: '#D85E6D',
        },
        icon: {
          default: '#171719',
        },
      },
      // Espaçamento (space) – tokens primitivos
      spacing: {
        'space-0': '0',
        'space-2': '2px',
        'space-4': '4px',
        'space-8': '8px',
        'space-12': '12px',
        'space-16': '16px',
        'space-20': '20px',
        'space-24': '24px',
        'space-32': '32px',
        'space-56': '56px',
      },
      // Shape (border-radius)
      borderRadius: {
        'shape-16': '16px',
        'shape-100': '100px',
      },
      // Size (ícones / elementos)
      width: { 'size-24': '24px', 'size-40': '40px' },
      height: { 'size-24': '24px', 'size-40': '40px' },
      minWidth: { 'size-24': '24px', 'size-40': '40px' },
      minHeight: { 'size-24': '24px', 'size-40': '40px' },
      // Sombras
      boxShadow: {
        'shadow-brand-16': '0 0 0 1px #dffe3529',
        'shadow-neutral-4': '0 0 0 1px #1118270a',
      },
      // Tipografia – Inter (Heading, Label, Paragraph)
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'heading-medium': ['28px', { lineHeight: '36px', letterSpacing: '0' }],
        'heading-xsmall': ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        'label-large': ['18px', { lineHeight: '24px', letterSpacing: '0.03em' }],
        'label-medium': ['16px', { lineHeight: '20px', letterSpacing: '0.03em' }],
        'label-small': ['14px', { lineHeight: '16px', letterSpacing: '0.03em' }],
        'label-xsmall': ['12px', { lineHeight: '16px', letterSpacing: '0.03em' }],
        'paragraph-medium': ['16px', { lineHeight: '24px', letterSpacing: '0.03em' }],
        'paragraph-small': ['14px', { lineHeight: '20px', letterSpacing: '0.03em' }],
        'paragraph-xsmall': ['12px', { lineHeight: '20px', letterSpacing: '0.03em' }],
      },
      fontWeight: {
        'label': '600',
        'heading': '700',
      },
    },
  },
  plugins: [],
}
