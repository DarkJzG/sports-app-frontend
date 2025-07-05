/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
    theme: {
        extend: {
        colors: {
            'blue-900': '#1E3A8A',
            'blue-700': '#2563EB',
            'blue-600': '#3B82F6',
            'blue-500': '#60A5FA',
            'blue-400': '#93C5FD',
            'blue-300': '#BFDBFE',
            'blue-200': '#DBEAFE',
            'blue-100': '#EFF6FF',
        },
        fontFamily: {
            rubik: ['Rubik', 'sans-serif'],
        },
        },
    },
  plugins: [],
}
