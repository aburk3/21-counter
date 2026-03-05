const theme = {
  colors: {
    bg: "#072d24",
    bgAlt: "#0e3c31",
    panel: "rgba(232, 244, 240, 0.2)",
    panelBorder: "rgba(255, 255, 255, 0.35)",
    text: "#f7fffb",
    textSubtle: "#d2ebe4",
    danger: "#ff9f9f",
    success: "#9be8bf",
    accent: "#79e8e3",
    chipWhite: "#f7f7f2",
    chipRed: "#c93737",
    chipGreen: "#33a062",
    chipBlack: "#212121",
    textPrimary: "#f7fffb",
    textSecondary: "#d2ebe4",
    actionPrimary: "#73dfd6",
    actionSecondary: "rgba(244, 253, 249, 0.16)",
    actionDestructive: "#ff8888",
  },
  surface: {
    glass: "rgba(240, 250, 247, 0.12)",
    glassStrong: "rgba(245, 254, 250, 0.18)",
  },
  stroke: {
    glass: "rgba(255, 255, 255, 0.38)",
  },
  blur: {
    1: "14px",
    2: "20px",
    3: "28px",
  },
  shadow: {
    1: "0 12px 28px rgba(3, 16, 14, 0.25)",
    2: "0 16px 34px rgba(2, 14, 12, 0.34)",
    3: "0 22px 44px rgba(1, 10, 9, 0.42)",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
    xxl: "32px",
  },
  radius: {
    sm: "12px",
    md: "16px",
    lg: "24px",
    panel: "18px",
    pill: "999px",
  },
  media: {
    sm: "(max-width: 480px)",
    md: "(min-width: 481px) and (max-width: 767px)",
    lg: "(min-width: 768px) and (max-width: 1024px)",
    xl: "(min-width: 1025px)",
    tabletUp: "(min-width: 768px)",
  },
} as const;

export { theme };
