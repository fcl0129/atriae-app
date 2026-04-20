export const atriaeDesignTokens = {
  color: {
    matcha: {
      50: "#f2f7ef",
      100: "#dcead5",
      200: "#c4dcb9",
      500: "#6f8f64",
      700: "#486041"
    },
    blush: {
      50: "#fff5f8",
      100: "#fce3eb",
      200: "#f8cad8",
      500: "#cf8599",
      700: "#8c5665"
    },
    ivory: {
      50: "#fffefb",
      100: "#f8f4eb",
      200: "#f2eadf"
    }
  },
  radius: {
    card: "1rem",
    nav: "1.25rem",
    pill: "9999px"
  },
  spacing: {
    pageY: "clamp(1.5rem, 4vw, 2.25rem)",
    section: "clamp(2rem, 4vw, 3.5rem)",
    card: "clamp(1rem, 2.2vw, 1.5rem)"
  },
  typography: {
    headline: "var(--font-serif)",
    body: "var(--font-sans)",
    tracking: {
      eyebrow: "0.22em"
    }
  }
} as const;

export type AtriaeDesignTokens = typeof atriaeDesignTokens;
