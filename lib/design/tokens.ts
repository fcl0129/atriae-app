export const atriaeDesignTokens = {
  color: {
    matcha: {
      100: "#E8F1E8",
      300: "#A9C9AF",
      500: "#7FAF8B"
    },
    blush: {
      100: "#FAECEB",
      300: "#F0CFCD",
      500: "#E7B8B6"
    },
    neutral: {
      ivory: "#F8F5F0",
      paper: "#FFFDFC",
      text: "#2F2D2A",
      muted: "#7D776F",
      border: "#E7E1D8"
    }
  },
  radius: {
    card: "1.125rem",
    nav: "1.4rem",
    pill: "9999px"
  },
  spacing: {
    pageY: "clamp(1.2rem, 3.2vw, 2.2rem)",
    section: "clamp(1.5rem, 4vw, 3rem)",
    card: "clamp(1rem, 1.8vw, 1.4rem)"
  },
  typography: {
    headline: "var(--font-serif)",
    body: "var(--font-sans)",
    tracking: {
      eyebrow: "0.17em"
    }
  }
} as const;

export type AtriaeDesignTokens = typeof atriaeDesignTokens;
