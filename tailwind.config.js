/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8b5cf6",
          pink: "#ec4899",
          blue: "#3b82f6",
          green: "#10b981",
          orange: "#f59e0b",
          red: "#ef4444",
        },
        glass: {
          "white-light": "rgba(255, 255, 255, 0.3)",
          "white-medium": "rgba(255, 255, 255, 0.4)",
          "white-strong": "rgba(255, 255, 255, 0.5)",
          "black-light": "rgba(0, 0, 0, 0.3)",
          "dark-light": "rgba(255, 255, 255, 0.05)",
          "dark-medium": "rgba(255, 255, 255, 0.1)",
        },
        border: {
          light: "rgba(255, 255, 255, 0.5)",
          dark: "rgba(255, 255, 255, 0.1)",
          purple: "rgba(139, 92, 246, 0.5)",
          "purple-light": "rgba(196, 144, 254, 0.5)",
          "white-20": "rgba(255, 255, 255, 0.2)",
        },
      },
    },
  },
  plugins: [],
};
