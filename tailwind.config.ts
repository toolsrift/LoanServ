import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * LoanServ — "Ledger" design tokens (single source of truth).
 * Palette, type roles, radii and shadows all derive from here.
 * See /style-guide for a live rendering of these decisions.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1200px" },
    },
    extend: {
      colors: {
        // Ledger palette — mapped to CSS variables so the dark theme can re-point them.
        ink: "var(--ink)",
        evergreen: "var(--evergreen)",
        mint: "var(--mint)",
        saffron: "var(--saffron)",
        paper: "var(--paper)",
        sand: "var(--sand)",
        slate: "var(--slate)",
        // Semantic aliases used by shadcn-style components.
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        ring: "var(--ring)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Intentional modular scale (~1.25 major third), tightened at display sizes.
        "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.4rem, 2.2vw, 1.85rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        // Soft, low-spread only.
        soft: "0 1px 2px rgba(12,35,30,0.04), 0 8px 24px -12px rgba(12,35,30,0.12)",
        lift: "0 2px 6px rgba(12,35,30,0.06), 0 18px 40px -16px rgba(12,35,30,0.20)",
      },
      maxWidth: {
        prose: "68ch",
      },
      spacing: {
        13: "3.25rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
