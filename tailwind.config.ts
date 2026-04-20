import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "80rem"
      }
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        matcha: {
          100: "#E8F1E8",
          300: "#A9C9AF",
          500: "#7FAF8B",
          700: "#557460"
        },
        blush: {
          100: "#FAECEB",
          300: "#F0CFCD",
          500: "#E7B8B6",
          700: "#AF7E7C"
        },
        ivory: {
          100: "#F8F5F0",
          200: "#F1EDE6"
        },
        paper: "#FFFDFC"
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        paper: "0 10px 28px -18px rgba(74, 73, 68, 0.18)",
        soft: "0 16px 45px -30px rgba(95, 106, 90, 0.32)",
        lift: "0 20px 42px -32px rgba(47, 45, 42, 0.3)"
      }
    }
  },
  plugins: []
};

export default config;
