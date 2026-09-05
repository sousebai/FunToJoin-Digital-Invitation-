/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        script: ['"Great Vibes"', 'cursive']
      },
      colors: {
        champagne: {
          50: '#fdfbf7',
          100: '#faf5ec',
          200: '#f3e8d5',
          300: '#ebd6b6',
          400: '#ddb989',
          500: '#c5a059',
          600: '#b08745',
          700: '#926a37',
          800: '#775430',
          900: '#62452b',
        },
        pearl: '#FAF7F2',
        linen: '#F4EFE6',
        rosedust: {
          light: '#FBF4F2',
          DEFAULT: '#B86B77',
          dark: '#8C434F'
        },
        sage: {
          light: '#F0F5F2',
          DEFAULT: '#52796F',
          dark: '#354F52'
        }
      },
      boxShadow: {
        'soft-luxury': '0 20px 40px -15px rgba(197, 160, 89, 0.12), 0 10px 25px -5px rgba(0, 0, 0, 0.04)',
        'card-soft': '0 10px 30px -5px rgba(43, 39, 35, 0.06), 0 2px 6px -1px rgba(43, 39, 35, 0.04)',
        'wax-seal': '0 12px 24px -6px rgba(184, 107, 119, 0.35), 0 4px 10px rgba(0, 0, 0, 0.1)'
      }
    },
  },
  plugins: [],
}