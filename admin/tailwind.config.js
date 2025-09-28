/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Electrolize', 'monospace'],
      },
      colors: {
        'navbar-bg': '#2c3e50',
        'navbar-hover': '#34495e',
        'navbar-active': '#3498db',
        'logout-btn': '#e74c3c',
        'logout-hover': '#c0392b',
        'accent-orange': '#f65516ff', // Orange
        'accent-yellow': '#ce411eff', // Yellow
      },
      animation: {
        'logo-spin': 'spin 20s linear infinite',
      },
    },
  },
  plugins: [],
}