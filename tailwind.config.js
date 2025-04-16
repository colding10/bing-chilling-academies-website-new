/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-black': '#000000',
        'custom-blue': '#00fff9',
        'custom-pink': '#ff00ff',
        'custom-yellow': '#ffff00',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)'],
        'share-tech': ['var(--font-share-tech-mono)'],
        play: ['var(--font-play)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
