import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#F8F7F4",
        foreground: "#111110",

        primary: "#111110",
        accent: "#1C6B4A",
        muted: "#6B6B6B",

        card: "#FCFCF8",
        borderSoft: "rgba(0,0,0,0.06)",
      },

      fontFamily: {
        heading: ["var(--font-cormorant)"],
        body: ["var(--font-outfit)"],
        mono: ["var(--font-mono)"],
      },

      borderRadius: {
        luxury: "28px",
        card: "32px",
      },

      boxShadow: {
        soft: "0 20px 60px rgba(0,0,0,0.04)",
        premium: "0 30px 80px rgba(0,0,0,0.08)",
      },

      animation: {
        fadeIn: "fadeIn 0.8s ease forwards",
        bgMove: "bgMove 12s ease-in-out infinite alternate",
      },

      keyframes: {
        fadeIn: {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        bgMove: {
          "0%": {
            transform: "scale(1) translate(0, 0)",
          },
          "50%": {
            transform: "scale(1.12) translate(20px, -10px)",
          },
          "100%": {
            transform: "scale(1) translate(0, 0)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;