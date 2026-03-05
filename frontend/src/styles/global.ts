import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: "SF Pro Text", "Avenir Next", "Segoe UI", sans-serif;
    color: ${({ theme }) => theme.colors.textPrimary};
    background:
      radial-gradient(1000px 500px at 12% 8%, rgba(91, 208, 188, 0.2) 0%, transparent 58%),
      radial-gradient(1200px 700px at 86% 12%, rgba(112, 236, 255, 0.12) 0%, transparent 56%),
      radial-gradient(800px 600px at 78% 90%, rgba(74, 181, 153, 0.16) 0%, transparent 62%),
      linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.bgAlt} 100%);
    min-height: 100vh;
    letter-spacing: 0.01em;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    position: relative;
  }

  body::before {
    content: "";
    position: fixed;
    inset: 0;
    pointer-events: none;
    opacity: 0.04;
    background-image: radial-gradient(rgba(255, 255, 255, 0.7) 0.35px, transparent 0.35px);
    background-size: 3px 3px;
    z-index: 0;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  h1,
  h2,
  h3,
  h4 {
    margin: 0;
    font-family: "SF Pro Display", "SF Pro Text", "Avenir Next", sans-serif;
    letter-spacing: 0;
  }

  button,
  input,
  select {
    font: inherit;
  }

  code,
  kbd,
  pre {
    font-family: "SF Mono", "Menlo", "Monaco", monospace;
  }
`;

export { GlobalStyle };
