/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sinhala: ['"Noto Sans Sinhala"', 'sans-serif'],
        display: ['"Yaldevi"', 'sans-serif'],
      },
      colors: {
        primary: {
          50:  '#fdf4ef',
          100: '#fbe6d6',
          200: '#f6c9aa',
          300: '#f0a574',
          400: '#e87a3c',
          500: '#e25f1e',
          600: '#d34614',
          700: '#af3213',
          800: '#8c2916',
          900: '#712515',
          950: '#3d1009',
        },
        forest: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#1a9e4a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        gold: {
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        dark: {
          800: '#1a1a2e',
          900: '#0f0f1a',
        },
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}
