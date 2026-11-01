import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          DEFAULT: "#1C1530",
          50: "#FBF9FF",
          100: "#F3EEFF",
          200: "#E4DEF2",
          300: "#C9BEDB",
          400: "#62596F",
          500: "#493D5C",
          600: "#2A213D",
          700: "#1C1530",
          800: "#130E22",
          900: "#0B0714",
        },
        magenta: {
          DEFAULT: "#C2185B",
          50: "#FDF2F7",
          100: "#FCE7F0",
          200: "#F9C5DC",
          300: "#F69EC3",
          400: "#F66DA5",
          500: "#C2185B",
          600: "#A3134C",
          700: "#7E0D3A",
          800: "#5A0829",
          900: "#360418",
        },
        marigold: {
          DEFAULT: "#F2A900",
          50: "#FFFDF5",
          100: "#FFF9E6",
          200: "#FFF0BF",
          300: "#FFE494",
          400: "#FCD563",
          500: "#F2A900",
          600: "#C78700",
          700: "#9C6600",
          800: "#704700",
          900: "#452A00",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        heading: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
        hindi: ["Noto Sans Devanagari", "sans-serif"],
        telugu: ["Noto Sans Telugu", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "16px",
        sm: "10px",
        md: "14px",
        lg: "20px",
        xl: "24px",
        "2xl": "32px",
      },
    },
  },
  plugins: [],
};

export default config;
