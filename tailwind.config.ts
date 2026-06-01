import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        marine: {
          50:  '#F0F5FA',
          100: '#E8F0FB',
          200: '#C8D8EC',
          300: '#A0BADC',
          400: '#729CC4',
          500: '#486581',
          600: '#2A4D75',
          700: '#1B3A57',
          800: '#102A43',
          900: '#0A1929',
        },
        cream: '#FAFBFC',
        accent: {
          DEFAULT: '#E31E24',
          hover:   '#B8181D',
          light:   '#FEE5E6',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover:   '#1DA851',
        },
        sold:     '#94A3B8',
        reserved: '#F59E0B',
        gold:     '#B8860B',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',   'system-ui', 'sans-serif'],
        serif:   ['var(--font-fraunces)', 'serif'],
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        inter:   ['var(--font-inter)',   'system-ui', 'sans-serif'],
        fraunces: ['var(--font-fraunces)', 'serif'],
      },
      boxShadow: {
        'marine-xs': '0 1px 2px rgba(16,42,67,0.04)',
        'marine-sm': '0 2px 4px rgba(16,42,67,0.06)',
        'marine-md': '0 4px 12px rgba(16,42,67,0.08)',
        'marine-lg': '0 12px 32px rgba(16,42,67,0.10)',
        'marine-xl': '0 24px 56px rgba(16,42,67,0.14)',
        'accent':    '0 12px 32px rgba(227,30,36,0.15)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
