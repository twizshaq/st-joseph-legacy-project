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
        gradient: 'gradient 3s ease infinite',
        'ai-shimmer': 'ai-shimmer 3s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'ai-shimmer': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
      }
    },
  },
    plugins: [
        require('tailwind-scrollbar-hide')
    ],
  }