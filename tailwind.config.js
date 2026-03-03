/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1b2a4b", // Deep Navy Blue
        "secondary": "#C9A84C", // Soft Gold
        "background-light": "#f6f7f8",
        "background-dark": "#14171e",
        "surface-dark": "#233355", // A slightly lighter navy for surface differentiation
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"],
        "serif": ["Playfair Display", "serif"],
      },
      borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
