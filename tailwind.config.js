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
      typography: {
        DEFAULT: {
          css: {
            color: '#f3f4f6',
            a: {
              color: '#208dd6',
              '&:hover': {
                color: '#2563eb',
              },
            },
            h1: {
              color: '#208dd6',
            },
            h2: {
              color: '#208dd6',
            },
            h3: {
              color: '#208dd6',
            },
            h4: {
              color: '#208dd6',
            },
            code: {
              color: '#f93283',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              borderRadius: '0.375rem',
              border: '1px solid rgba(32, 141, 214, 0.3)',
            },
            blockquote: {
              borderLeftColor: '#208dd6',
              color: '#d1d5db',
            },
          },
        },
      },
      colors: {
        background: "#05070f",
        "custom-black": "#05070f",
        "custom-blue": "#208dd6",
        "custom-pink": "#f93283",
        "custom-yellow": "#ffcc00",
        "custom-purple": "#ab5ceb",
        "custom-green": "#00cc99",
        "cyber-overlay": "rgba(5, 7, 15, 0.7)",
      },
      fontFamily: {
        orbitron: ["var(--font-orbitron)"],
        play: ["var(--font-play)"],
        "share-tech": ["var(--font-share-tech-mono)"],
      },
    },
  },
  plugins: [typography],
}

export default config
