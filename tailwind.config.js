/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      colors: {
        'app-white': {
          '200': '#EFF2F4'
        },
        'app-primary': {
          'dark': '#031C30',
          900: '#053358',
          800: '#074C83',
          700: '#0966AF',
          600: '#0C7FDA',
          500: '#2196F3',
          400: '#48A8F5',
          300: '#6EBBF7',
          200: '#95CDF9',
          100: '#BCDFFB',
          50: '#CFE8FC',
        },
      },
    },
  },
  plugins: [],
};
