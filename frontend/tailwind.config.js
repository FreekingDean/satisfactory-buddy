/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        satisfactory: {
          primary: '#4CAF50',
          secondary: '#81C784',
          dark: '#1e3c72',
          darker: '#2a5298',
          map: '#2a4a3a',
          mapDark: '#1a2a1a',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}