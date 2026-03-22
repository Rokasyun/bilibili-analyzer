/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../backend/src/services/analyzer.ts"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
