/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        decision: {
          bg: '#fef3c7',
          border: '#f59e0b',
          text: '#92400e',
        },
        action: {
          bg: '#dbeafe',
          border: '#3b82f6',
          text: '#1e3a8a',
        },
        info: {
          bg: '#f3f4f6',
          border: '#9ca3af',
          text: '#374151',
        },
      },
    },
  },
  plugins: [],
}
