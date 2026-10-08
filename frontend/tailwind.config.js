/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: { DEFAULT: '#0b0b0c', soft: '#131316', card: '#17171a', line: '#26262b' },
        gold: { DEFAULT: '#d4af37', soft: '#e8c96a', deep: '#9a7b1e' },
        brasao: { DEFAULT: '#e63946', deep: '#a91e2a' },
        cream: '#f5efe3',
        smoke: '#a7a7b0'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      letterSpacing: { lux: '0.35em' },
      boxShadow: {
        lux: '0 30px 80px -20px rgba(212,175,55,0.35)',
        ember: '0 20px 60px -15px rgba(230,57,70,0.45)'
      }
    }
  },
  plugins: []
};
