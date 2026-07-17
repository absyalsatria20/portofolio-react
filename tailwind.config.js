/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Memasukkan font Outfit sebagai font utama (sans)
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      // Warna identitasmu sekalian kita pastikan sama persis
      colors: {
        dark: '#0a0a0a',
        darker: '#050505',
        accent: '#6366f1',
        accentHover: '#4f46e5'
      }
    },
  },
  plugins: [],
}