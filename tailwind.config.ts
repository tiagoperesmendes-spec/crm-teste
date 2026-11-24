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
        brand: {
          primary: "#6C1C37",
          hover: "#B45A69",
          tint: "#E6C5CA",
          accent: "#CDBA7B",
        },
        canvas: {
          bg: "#EDE6DE",
          card: "#FFFFFF",
          surface: "#FBF9F6",
          border: "#E4DDD3",
        },
        content: {
          primary: "#1A1A1A",
          muted: "#6B6B6B",
        },
        status: {
          successBg: "#DDEBDD",
          successText: "#2F6B3A",
          warningBg: "#F7E7BF",
          warningText: "#805B00",
          errorBg: "#F6D9D5",
          errorText: "#A3281E",
          infoBg: "#DCE7F0",
          infoText: "#2C5576",
        },
        data: {
          slateBg: "#DDE6EE",
          slateText: "#2F4A63",
          mossBg: "#DFE7D6",
          mossText: "#3F5A2E",
          amberBg: "#F3E3C3",
          amberText: "#7A4E0F",
          terracottaBg: "#F1D9CE",
          terracottaText: "#8A3E22",
          violetBg: "#E5DEEC",
          violetText: "#5A4378",
          tealBg: "#D5E8E5",
          tealText: "#1F5B57",
          brownBg: "#E8DDD0",
          brownText: "#66482C",
          warmgrayBg: "#E9E5E0",
          warmgrayText: "#5C554E",
        },
      },
      fontFamily: {
        title: ["'Hanken Grotesk'", "sans-serif"],
        sans: ["'DM Sans'", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "22px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.02), 0 2px 6px rgba(0,0,0,0.03)",
        popover: "0 8px 24px -4px rgba(26,26,26,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
