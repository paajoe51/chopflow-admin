/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          slate: '#0F172A',
          'slate-light': '#1E293B',
          'slate-border': '#E2E8F0',
        },
        papaye: {
          DEFAULT: '#EA580C',
          light: '#F97316',
          bg: '#FFF7ED',
          border: '#FFEDD5',
        },
        customer: {
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          'teal-bg': '#F0FDFA',
          'teal-border': '#CCFBF1',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
