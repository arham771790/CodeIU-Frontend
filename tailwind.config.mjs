import daisyui from "daisyui"

/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '53': 'repeat(53, minmax(0, 1fr))',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "retro", "nord", "dracula", "forest","black" ,"synthwave","abyss"],
  },
}

export default config;