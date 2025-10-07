
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      backgroundImage: {
        'gradient-hero': 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(168,85,247,0.35))'
      }
    },
  },
  plugins: [],
}
