/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include React files
  ],
  theme: {
    extend: {
      colors: {
        'brown': {
          800: '#5C4033',
          900: '#3C2A21',
        },
        'wood': '#8B4513',
      },
    },
  },
  plugins: [],
};
