import styled, { css } from "styled-components";

type Elevation = 1 | 2 | 3;

const toneByElevation: Record<Elevation, string> = {
  1: "rgba(240, 250, 247, 0.12)",
  2: "rgba(243, 252, 249, 0.18)",
  3: "rgba(246, 254, 252, 0.24)",
};

const borderByElevation: Record<Elevation, string> = {
  1: "rgba(255, 255, 255, 0.28)",
  2: "rgba(255, 255, 255, 0.38)",
  3: "rgba(255, 255, 255, 0.48)",
};

const GlassSurface = styled.section<{ $elevation?: Elevation; $interactive?: boolean }>`
  ${({ theme, $elevation = 1, $interactive }) => css`
    border: 1px solid ${borderByElevation[$elevation]};
    border-radius: ${theme.radius.lg};
    background:
      radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.18), transparent 42%),
      ${toneByElevation[$elevation]};
    backdrop-filter: blur(${theme.blur[$elevation]}) saturate(145%);
    box-shadow: ${theme.shadow[$elevation]};
    position: relative;
    isolation: isolate;

    &::before {
      content: "";
      position: absolute;
      inset: 1px;
      border-radius: calc(${theme.radius.lg} - 2px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      pointer-events: none;
      z-index: -1;
    }

    ${
      $interactive
        ? css`
            transition: transform 180ms ease, box-shadow 180ms ease;

            &:hover {
              transform: translateY(-1px);
              box-shadow: ${theme.shadow[Math.min($elevation + 1, 3) as Elevation]};
            }
          `
        : ""
    }
  `}
`;

export { GlassSurface };
