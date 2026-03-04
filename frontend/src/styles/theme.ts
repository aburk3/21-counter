const theme = {
  colors: {
    bg: "#0f3b2f",
    bgAlt: "#164836",
    panel: "rgba(230, 240, 238, 0.22)",
    panelBorder: "rgba(255, 255, 255, 0.35)",
    text: "#f5faf8",
    textSubtle: "#d6e8e1",
    danger: "#ff8f8f",
    success: "#9be38a",
    accent: "#6ed7ff",
    chipWhite: "#f7f7f2",
    chipRed: "#c93737",
    chipGreen: "#33a062",
    chipBlack: "#212121",
  },
  radius: {
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
