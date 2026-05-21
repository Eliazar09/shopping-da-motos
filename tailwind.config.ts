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
        bg: {
          primary: '#0A1628',
          secondary: '#122038',
          tertiary: '#1A2B47',
        },
        accent: {
          red: '#E50914',
          'red-dark': '#B00610',
          blue: '#4A90E2',
          gold: '#C9A961',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0BEC5',
          muted: '#607D8B',
        },
        whatsapp: '#25D366',
      },
      fontFamily: {
        anton: ['var(--font-anton)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.15em',
      },
      screens: {
        xs: '375px',
      },
    },
  },
  plugins: [],
}

export default config
