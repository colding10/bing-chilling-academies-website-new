import typography from "@tailwindcss/typography"

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-black": "#000000",
        "custom-blue": "#208dd6",
        "custom-pink": "#bd1aa2",
        "custom-yellow": "#bfc41d",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        "share-tech": ["var(--font-share-tech-mono)"],
        play: ["var(--font-play)"],
      },
    },
  },
  plugins: [typography],
}

export default config
