/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
       fontFamily: {
  heading: ["Sora", "sans-serif"],
  body: ["Sora", "sans-serif"],
}

      },
    },
  },
  plugins: [],
}


