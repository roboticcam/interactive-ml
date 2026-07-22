/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Mirrors the "snow" palette from the SlideSmith deck system.
        ink: "#0f172a",
        muted: "#475569",
        faint: "#94a3b8",
        accent: "#4f46e5",
        panel: "#f8fafc",
        line: "#e2e8f0",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
};
