export const landingTokens = {
  colors: {
    background: "#F7F2EA",
    paper: "#FBF7F1",
    ink: "#1F2A24",
    inkMuted: "#425149",
    matcha: "#7E9C7A",
    matchaDeep: "#5D735D",
    pinkDusty: "#D8B6B6",
    blushMuted: "#E6D1CD",
    taupeLine: "#D9D0C5",
    sageWash: "#E8EFE4"
  },
  spacing: {
    sectionDesktop: "120px",
    sectionTablet: "88px",
    sectionMobile: "64px",
    heroTop: "72px",
    contentDesktopX: "48px",
    contentTabletX: "32px",
    contentMobileX: "20px"
  },
  layout: {
    pageMax: "1440px",
    contentMax: "1240px",
    readingMax: "640px",
    ctaMax: "960px"
  },
  typeScale: {
    displayXl: "72px",
    displayLg: "56px",
    headingXl: "40px",
    headingLg: "32px",
    headingMd: "26px",
    bodyLg: "20px",
    bodyMd: "18px",
    bodySm: "16px",
    label: "12px"
  },
  radius: {
    buttonPill: "9999px",
    buttonSoft: "14px",
    panel: "20px"
  },
  shadows: {
    paper: "0 16px 38px -30px rgba(31, 42, 36, 0.35)",
    soft: "0 10px 24px -20px rgba(31, 42, 36, 0.28)"
  },
  breakpoints: {
    mobile: 390,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
    wide: 1440
  }
} as const;

export type LandingTokens = typeof landingTokens;
