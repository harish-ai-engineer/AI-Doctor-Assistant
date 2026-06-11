import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        destructive: "hsl(var(--destructive))",
      },
      borderRadius: { xl: "var(--radius)", "2xl": "calc(var(--radius) + 6px)" },
      boxShadow: {
        glow: "0 0 40px -14px hsl(var(--primary) / .45)",
        card: "0 18px 50px -24px rgb(7 35 31 / .25)",
      },
      animation: {
        "fade-up": "fade-up .45s ease-out both",
        pulse: "pulse 2.2s cubic-bezier(.4,0,.6,1) infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
