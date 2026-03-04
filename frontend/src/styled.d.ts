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
    };
    radius: {
      panel: string;
      pill: string;
    };
    media: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      tabletUp: string;
    };
  }
}
