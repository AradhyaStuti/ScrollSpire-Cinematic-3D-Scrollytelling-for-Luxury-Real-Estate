/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep indigo inspired by Mughal miniature backgrounds
        ink: '#0A0E1F',
        ink2: '#0F1428',
        ink3: '#14172A',
        // Saffron-leaning gold (warmer than western luxe gold)
        gold: '#D4A24C',
        goldSoft: '#E8C974',
        goldDeep: '#A07828',
        // Sindoor / vermillion accent — heritage heat
        sindoor: '#C94A3A',
        // Deep emerald — Kundan setting
        emerald: '#0E6A55',
        cream: '#F4EEE0',
        parchment: '#E9DEC5'
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: {
        luxe: '0.22em'
      }
    }
  },
  plugins: []
}
