/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D47A1",      // dark blue
        secondary: "#1976D2",    // medium blue
        highlight: "#FFB300",    // amber / accent color
        background: "#F5F5F5",   // light gray background
        text: "#333333",         // dark text for readability
      },
    },
  },
  plugins: [],
};
