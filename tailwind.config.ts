import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        metricool: {
          dark: "#18131f",
          darker: "#100c16",
          lime: "#ccff00",
          limeHover: "#b8e600",
          coral: "#ff3366",
          pink: "#ec4899",
          purple: "#8b5cf6",
          blue: "#0284c7",
          emerald: "#10b981",
          amber: "#f59e0b",
          lightBg: "#f8f9fc",
          cardBg: "#ffffff",
          border: "#cbd5e1",
        },
      },
      fontSize: {
        // Slightly larger fonts as requested ("little big fonts")
        xs: ["0.8125rem", { lineHeight: "1.25rem" }], // 13px
        sm: ["0.9375rem", { lineHeight: "1.375rem" }], // 15px
        base: ["1.0625rem", { lineHeight: "1.625rem" }], // 17px
        lg: ["1.1875rem", { lineHeight: "1.75rem" }], // 19px
        xl: ["1.375rem", { lineHeight: "1.875rem" }], // 22px
        "2xl": ["1.625rem", { lineHeight: "2rem" }], // 26px
        "3xl": ["2rem", { lineHeight: "2.375rem" }], // 32px
        "4xl": ["2.5rem", { lineHeight: "2.875rem" }], // 40px
        "5xl": ["3.25rem", { lineHeight: "3.5rem" }], // 52px
        "6xl": ["4rem", { lineHeight: "4.25rem" }], // 64px
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
