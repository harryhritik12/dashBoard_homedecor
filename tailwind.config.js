/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        blinking: {
          '0%, 100%': { backgroundColor: '#ffffff' }, // white
          '50%': { backgroundColor: '#ffeb3b' }, // yellow
        },
      },
      animation: {
        blinking: 'blinking 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}