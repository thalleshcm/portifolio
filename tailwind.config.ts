import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-barlow)", "sans-serif"],
      },
      colors: {
        bg: {
          base: "#06060E",
          card: "#0C0C1A",
          elevated: "#121224",
        },
        border: {
          DEFAULT: "#1A1A32",
          muted: "#131326",
        },
        text: {
          primary: "#EEEAF5",
          secondary: "#8884A8",
          muted: "#4C4A65",
        },
        accent: {
          DEFAULT: "#CBFF47",
          hover: "#D8FF66",
          muted: "#CBFF4720",
          dim: "#8FAF2F",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
