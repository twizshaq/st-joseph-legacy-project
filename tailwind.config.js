// tailwind.config.js
module.exports = {
    // Add this 'content' array if it's missing
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Adjust this path to match your project structure
    ],
    theme: {
      extend: {
        screens: {
          'sus': '903px', // Your custom breakpoint is correct
        },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }
    },
  },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
  }