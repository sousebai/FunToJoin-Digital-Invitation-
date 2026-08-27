/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:    '#FBF6F0',
        ink:      '#3B2A2C',
        burgundy: '#6E2433',
        gold:     '#A98646',
        line:     '#ECD8D2',
        blush:    '#F2DAD4',
        muted:    '#8B7A7B',
        rose:     '#C98A82',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['Montserrat', 'system-ui', 'sans-serif'],
        script:  ['"Great Vibes"', 'cursive'],
      },
      animation: {
        'fade-up':   'fadeUp 0.7s ease forwards',
        'fade-in':   'fadeIn 0.6s ease forwards',
        'envelope':  'envelopeOpen 1.2s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        envelopeOpen: {
          '0%':   { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-180deg)' },
        },
      },
    },
  },
  plugins: [],
}
