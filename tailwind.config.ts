import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orbit: {
          bg: "#0b1020",
          panel: "#121831",
          border: "#1f2a48",
          muted: "#94a3b8",
          accent: "#6366f1",
          accent2: "#22d3ee",
          warm: "#f97316",
          cool: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
