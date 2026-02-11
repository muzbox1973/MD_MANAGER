import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sidebar: {
          bg: "#1e1e2e",
          hover: "#313244",
          active: "#45475a",
          text: "#cdd6f4",
          muted: "#a6adc8",
        },
        editor: {
          bg: "#ffffff",
          border: "#e2e8f0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
