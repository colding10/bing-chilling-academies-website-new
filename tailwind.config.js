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
        'custom-blue': '#208dd6',
        'custom-pink': '#bd1aa2',
        'custom-yellow': '#bfc41d',
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
