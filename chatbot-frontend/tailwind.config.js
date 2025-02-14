/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        'chat-area': 'calc(100vw - 72px)', // Custom width for the chat area
      },
      margin: {
        72: '72px', // Ensure 72px margin is available
      },
      colors: {
        'sidebar-bg': '#2D2D2D', // Custom background color for sidebar
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
