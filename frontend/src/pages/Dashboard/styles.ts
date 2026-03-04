import styled, { keyframes } from "styled-components";

const panelIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const messageIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Wrap = styled.main`
  padding: 20px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 12px;
  }
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Grid = styled.section`
  margin-top: 18px;
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

  @media ${({ theme }) => theme.media.sm} {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  @media ${({ theme }) => theme.media.lg} {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }
`;

const Actions = styled.div`
  margin-top: 22px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 13px;
  min-height: 44px;
  cursor: pointer;
  transition: background 180ms ease, transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.28);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.16);
  }
`;

const Panel = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(10px);
  padding: 14px;
  display: grid;
  gap: 10px;
  animation: ${panelIn} 220ms ease both;

  @media ${({ theme }) => theme.media.sm} {
    padding: 12px;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  width: ${({ $pct }) => Math.max(0, Math.min($pct, 100))}%;
  height: 100%;
  background: linear-gradient(90deg, #88ddff, #a8ffc6);
  transition: width 420ms ease;
`;

const SkinList = styled.div`
  display: grid;
  gap: 8px;
`;

const SkinItem = styled.button<{ $locked: boolean }>`
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 8px 10px;
  color: ${({ theme, $locked }) => ($locked ? theme.colors.textSubtle : theme.colors.text)};
  opacity: ${({ $locked }) => ($locked ? 0.6 : 1)};
  background: rgba(255, 255, 255, 0.08);
  text-align: left;
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
  transition: transform 180ms ease, background 180ms ease;

  &:not(:disabled):hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.14);
  }
`;

const SkinItemBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SkinLabel = styled.span`
  font-weight: 600;
`;

const SkinPreviewCard = styled.div<{ $skin: string }>`
  ${({ $skin }) => {
    const palette: Record<
      string,
      {
        base: string;
        glyph: string;
        edge: string;
        holo: string;
        sheen: string;
      }
    > = {
      classic_red: {
        base: "#ffffff",
        glyph: "#c81f2d",
        edge: "rgba(200, 31, 45, 0.35)",
        holo: "none",
        sheen: "none",
      },
      ocean_blue: {
        base:
          "linear-gradient(160deg, rgba(247,252,255,0.98), rgba(231,245,255,0.94))",
        glyph: "#0f65a8",
        edge: "rgba(105, 194, 255, 0.6)",
        holo:
          "linear-gradient(125deg, rgba(119,244,255,0.3), rgba(109,151,255,0.25), rgba(255,255,255,0.2))",
        sheen:
          "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(170,236,255,0.62) 50%, rgba(255,255,255,0) 65%)",
      },
      obsidian: {
        base:
          "linear-gradient(160deg, rgba(32,34,40,0.96), rgba(58,62,70,0.9))",
        glyph: "#e8edf3",
        edge: "rgba(220, 229, 240, 0.58)",
        holo:
          "linear-gradient(125deg, rgba(194,226,255,0.2), rgba(255,255,255,0.14), rgba(110,125,162,0.2))",
        sheen:
          "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(246,250,255,0.58) 50%, rgba(255,255,255,0) 65%)",
      },
      emerald: {
        base:
          "linear-gradient(160deg, rgba(241,255,247,0.98), rgba(223,249,237,0.94))",
        glyph: "#16845d",
        edge: "rgba(85, 219, 170, 0.58)",
        holo:
          "linear-gradient(125deg, rgba(131,255,214,0.28), rgba(123,229,187,0.2), rgba(255,255,255,0.2))",
        sheen:
          "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(180,255,221,0.62) 50%, rgba(255,255,255,0) 65%)",
      },
      gold: {
        base:
          "linear-gradient(160deg, rgba(255,248,219,0.98), rgba(247,228,153,0.92))",
        glyph: "#b7871a",
        edge: "rgba(229, 189, 86, 0.65)",
        holo:
          "linear-gradient(125deg, rgba(255,224,133,0.25), rgba(255,255,255,0.24), rgba(232,177,66,0.22))",
        sheen:
          "linear-gradient(115deg, rgba(255,255,255,0) 35%, rgba(255,241,181,0.66) 50%, rgba(255,255,255,0) 65%)",
      },
    };
    const tone = palette[$skin] ?? palette.classic_red;
    return `
      background: ${tone.base};
      color: ${tone.glyph};
      border-color: ${tone.edge};
      --holo-layer: ${tone.holo};
      --sheen-layer: ${tone.sheen};
    `;
  }}
  width: 44px;
  height: 64px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 800;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: ${({ $skin }) => ($skin === "classic_red" ? 0 : 0.32)};
    background: var(--holo-layer);
    mix-blend-mode: screen;
  }

  &::after {
    content: "";
    position: absolute;
    inset: -20px;
    background: var(--sheen-layer);
    pointer-events: none;
    opacity: 0;
    transform: translateX(-130%);
    transition: transform 380ms ease, opacity 220ms ease;
  }

  ${SkinItem}:not(:disabled):hover & {
    transform: translateY(-1px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  ${SkinItem}:not(:disabled):hover &::after {
    opacity: ${({ $skin }) => ($skin === "classic_red" ? 0 : 1)};
    transform: translateX(160%);
  }
`;

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success};
  animation: ${messageIn} 220ms ease;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
`;

const ModalCard = styled.section`
  width: min(420px, calc(100vw - 24px));
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(14px);
  padding: 18px;
  display: grid;
  gap: 12px;
`;

export {
  Wrap,
  TopBar,
  Grid,
  Actions,
  Button,
  Panel,
  ProgressBar,
  ProgressFill,
  SkinList,
  SkinItem,
  SkinItemBody,
  SkinLabel,
  SkinPreviewCard,
  Message,
  ErrorText,
  ModalBackdrop,
  ModalCard,
};
