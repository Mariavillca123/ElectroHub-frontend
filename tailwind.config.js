/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0078FF",
        secondary: "#1E293B",
        accent: "#FACC15"
      }
    }
  },
  plugins: []
};
