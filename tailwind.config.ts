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
          50:  '#F5F5F6',
          100: '#EBEBEC',
          200: '#D0D0D2',
          300: '#ADADB0',
          400: '#88888C',
          500: '#5A5A5E',
          600: '#2D2D30',
          700: '#1E1E21',
          800: '#141416',
          900: '#0D0D0F',
        },
        metal: {
          50:  '#F7F7F8',
          100: '#EEEFF1',
          200: '#DEDFE3',
          300: '#BBBEC6',
          400: '#999DAA',
          500: '#787D8B',
          600: '#606472',
          700: '#3F4146',
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
        display: ['var(--font-oswald)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)',  'system-ui', 'sans-serif'],
        serif:   ['var(--font-oswald)', 'system-ui', 'sans-serif'],
        oswald:  ['var(--font-oswald)', 'system-ui', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        inter:   ['var(--font-inter)',   'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'marine-xs': '0 1px 2px rgba(13,13,15,0.04)',
        'marine-sm': '0 2px 4px rgba(13,13,15,0.06)',
        'marine-md': '0 4px 12px rgba(13,13,15,0.08)',
        'marine-lg': '0 12px 32px rgba(13,13,15,0.10)',
        'marine-xl': '0 24px 56px rgba(13,13,15,0.14)',
        'accent':    '0 12px 32px rgba(227,30,36,0.25)',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
