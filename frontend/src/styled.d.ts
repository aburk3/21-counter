import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      bg: string;
      bgAlt: string;
      panel: string;
      panelBorder: string;
      text: string;
      textSubtle: string;
      danger: string;
      success: string;
      accent: string;
      chipWhite: string;
      chipRed: string;
      chipGreen: string;
      chipBlack: string;
      textPrimary: string;
      textSecondary: string;
      actionPrimary: string;
      actionSecondary: string;
      actionDestructive: string;
    };
    surface: {
      glass: string;
      glassStrong: string;
    };
    stroke: {
      glass: string;
    };
    blur: {
      1: string;
      2: string;
      3: string;
    };
    shadow: {
      1: string;
      2: string;
      3: string;
    };
    spacing: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    radius: {
      sm: string;
      md: string;
      lg: string;
      panel: string;
      pill: string;
    };
    media: {
      mobile: string;
      tablet: string;
      desktopCompact: string;
      desktop: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      tabletUp: string;
    };
  }
}
