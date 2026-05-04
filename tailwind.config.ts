import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orbit: {
          bg: "#0c1120",
          surface: "#111827",
          panel: "#141d2f",
          card: "#192236",
          border: "#1e2d45",
          muted: "#64748b",
          accent: "#6366f1",
          accent2: "#22d3ee",
          warm: "#f97316",
          cool: "#38bdf8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
      },
      boxShadow: {
        "glow-sm": "0 0 12px -3px rgba(99,102,241,0.25)",
        "glow": "0 0 24px -6px rgba(99,102,241,0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
