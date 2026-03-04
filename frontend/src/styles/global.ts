import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "Avenir Next", "SF Pro Display", "Segoe UI", sans-serif;
    color: ${({ theme }) => theme.colors.text};
    background:
      radial-gradient(1200px 600px at 20% 10%, #2f7055 0%, transparent 60%),
      radial-gradient(1000px 500px at 80% 90%, #1f5e47 0%, transparent 60%),
      linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgAlt} 100%);
    min-height: 100vh;
  }

  button,
  input,
  select {
    font: inherit;
  }
`;

export { GlobalStyle };