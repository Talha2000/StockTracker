/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
theme: {
    extend: {
      colors: {
        white: "white",
        none: "none",
        mainBg: "#030712",
        mainText: "#06b6d4"
      },
      fontFamily: {
        quicksand: ["Quicksand", "sans-serif"],
      },
      borderWidth: {
        1: "1px",
      },
      gridTemplateRows: {
        7: "repeat(7, minmax(0, 2fr))",
        8: "repeat(8, minmax(0, 1fr))",
      },
    },
  },
  plugins: [],
}

