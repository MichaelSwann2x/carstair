import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        carstair: {
          black: "#050505",
          dark: "#0a0a0a",
          panel: "#111111",
          border: "#1f1f1f",
          muted: "#888888",
          accent: "#e8e8e8",
        },
      },
    },
  },
  plugins: [],
};
export default config;
