export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        mist: "#f5f7fb",
        graphite: "#5e6a7d",
        brand: {
          50: "#eef6ff",
          100: "#d9ecff",
          500: "#2f6fed",
          600: "#255bd3",
          700: "#1d48aa"
        }
      },
      boxShadow: {
        premium: "0 18px 55px rgba(24, 33, 47, 0.12)",
        panel: "0 10px 30px rgba(24, 33, 47, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
