/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f0',
          100: '#ffdddd',
          200: '#ffc0c0',
          300: '#ff9494',
          400: '#ff5757',
          500: '#e2231a',
          600: '#c51d14',
          700: '#a31610',
          800: '#86150f',
          900: '#6e1610',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
