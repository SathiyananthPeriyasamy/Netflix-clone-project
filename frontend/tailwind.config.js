/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          dark: '#141414',
          black: '#000000',
          gray: '#181818',
          lightGray: '#2F2F2F',
        },
      },
    },
  },
  plugins: [],
}
