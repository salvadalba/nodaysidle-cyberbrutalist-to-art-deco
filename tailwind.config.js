/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyber-brutalist colors
        'cyber-black': '#0a0a0a',
        'cyber-neon': '#00ff41',
        'cyber-error': '#ff003c',
        'cyber-warning': '#ffed00',
        // Art Deco colors
        'deco-gold': '#d4af37',
        'deco-cream': '#f5f0e1',
        'deco-charcoal': '#2c2c2c',
        'deco-bronze': '#cd7f32',
      },
      fontFamily: {
        'brutalist': ['Courier New', 'monospace'],
        'deco': ['Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
