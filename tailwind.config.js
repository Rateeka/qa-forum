/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          300: "#a78bfa",
          400: "#8b5cf6",
          500: "#6366f1",
          600: "#4f46e5",
          800: "#3730a3",
          900: "#312e81",
        },
        surface: {
          700: "#374151",
          800: "#1f2937",
          850: "#172033",
          900: "#111827",
          950: "#0b0f19",
        },
      },
      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
