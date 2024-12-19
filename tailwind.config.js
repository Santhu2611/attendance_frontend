/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "#2D2F62",
        primary2: "#C3C5FF",
        secondary: "#E4E4FF",
        secondary2: "#969696",
        primary3: "#F1F1F1",

        text_color1: "#2F3172",
        text_color2: "#363CF2",
      },
      screens: {
        md: "1000px",
        lg: "1900px",
        // => @media (min-width: 1440px) { ... }
      },
    },
  },
  plugins: [],
}