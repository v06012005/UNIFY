/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");
export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeScale: {
          "20%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "80%": { opacity: "0.8" },
          "10%": { opacity: "0.6" },
        },
        fadeInCenter: {
          '0%': { opacity: '0', transform: 'scale(0.1) translateX(-50%, -50%) translateY(-50%, -50%)' },
          '100%': { opacity: '1', transform: 'scale(1) translateX(-50%, -50%) translateY(-50%, -50%)' },
        },
        fadeOutCenter: {
          '100%': { opacity: '1', transform: 'scale(1) translateX(-50%, -50%) translateY(-50%, -50%)' },
          '0%': { opacity: '0', transform: 'scale(0.1) translateX(-50%, -50%) translateY(-50%, -50%)' },
        },
      },
      animation: {
        fadeScale: "fadeScale 5s ease-in-out",
        fadeOut: "fadeOut 5s ease-in-out",
        fadeInCenter: "fadeInCenter 0.3s ease-in-out",
        fadeOutCenter: "fadeOutCenter 0.3s ease-in-out"
      },
      boxShadow: {
        "right-left": "10px 0px 15px 2px rgba(0, 0, 0, 0.3)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins:[require("tailwindcss-animate"), heroui(), require('tailwind-scrollbar-hide')],
};
