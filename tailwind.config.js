/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1e1e1e',
          600: '#2a2a2a',
        },
        primary: '#3b82f6',
      }
    },
  },
  plugins: [],
}
