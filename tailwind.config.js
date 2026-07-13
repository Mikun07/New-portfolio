import lineClamp from '@tailwindcss/line-clamp'

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
        },
        surface: {
          light: '#ffffff',
          dark: '#181818',
        },
        card: {
          light: '#f5f5f5',
          dark: '#222222',
        },
        border: {
          light: '#e5e5e5',
          dark: '#2e2e2e',
        },
        text: {
          primary: {
            light: '#111111',
            dark: '#f0f0f0',
          },
          secondary: {
            light: '#555555',
            dark: '#999999',
          },
        },
      },
    },
  },
  plugins: [lineClamp],
}
