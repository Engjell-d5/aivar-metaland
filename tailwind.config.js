/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Figtree', 'ui-sans-serif', 'system-ui'],
        'figtree': ['Figtree', 'sans-serif']
      }
    },
  },
  plugins: [],
} 