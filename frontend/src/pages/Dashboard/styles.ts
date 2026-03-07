import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Wrap = styled.main`
  display: grid;
  gap: 16px;
`;

const Hero = styled(GlassSurface)`
  padding: 18px;
  display: grid;
  gap: 14px;
`;

const HeroTop = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const HeroActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  justify-content: end;
  gap: 10px;
  width: min(460px, 100%);
  justify-self: end;

  button {
    min-height: 44px;
  }

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
    justify-content: stretch;
    justify-self: stretch;
    width: 100%;
  }
`;

const HeroMeta = styled.div`
  display: grid;
  gap: 8px;
  min-width: 0;

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.35;
    max-width: 60ch;
  }
`;

const ProgressBlock = styled.div`
  display: grid;
  gap: 8px;
`;

const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.14);
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  width: ${({ $pct }) => Math.max(0, Math.min($pct, 100))}%;
  height: 100%;
  background: linear-gradient(90deg, #93fff2, #7ad4ff);
  transition: width 320ms ease;
`;

const SectionTitle = styled.h2`
  font-size: clamp(18px, 2vw, 22px);
`;

const MetricGrid = styled.section`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const ZoneGrid = styled.section`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media ${({ theme }) => theme.media.desktopCompact} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(GlassSurface)`
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const SkinList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
`;

const SkinItem = styled.button<{ $locked: boolean; $selected: boolean }>`
  border: 1px solid
    ${({ $selected }) => ($selected ? "rgba(133, 255, 236, 0.8)" : "rgba(255, 255, 255, 0.3)")};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 10px;
  color: ${({ theme, $locked }) => ($locked ? theme.colors.textSubtle : theme.colors.text)};
  opacity: ${({ $locked }) => ($locked ? 0.62 : 1)};
  background: ${({ $selected }) => ($selected ? "rgba(101, 245, 223, 0.18)" : "rgba(255, 255, 255, 0.08)")};
  text-align: left;
  cursor: ${({ $locked }) => ($locked ? "not-allowed" : "pointer")};
`;

const SkinItemBody = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const SkinLabel = styled.span`
  font-weight: 600;
  line-height: 1.25;
`;

const SkinPreviewCard = styled.div<{ $skin: string }>`
  ${({ $skin }) => {
    const palette: Record<
      string,
      {
        base: string;
        glyph: string;
      }
    > = {
      classic_red: {
        base: "#ffffff",
        glyph: "#c81f2d",
      },
      ocean_blue: {
        base: "linear-gradient(160deg, rgba(247,252,255,0.98), rgba(231,245,255,0.94))",
        glyph: "#0f65a8",
      },
      obsidian: {
        base: "linear-gradient(160deg, rgba(32,34,40,0.96), rgba(58,62,70,0.9))",
        glyph: "#e8edf3",
      },
      emerald: {
        base: "linear-gradient(160deg, rgba(241,255,247,0.98), rgba(223,249,237,0.94))",
        glyph: "#16845d",
      },
      gold: {
        base: "linear-gradient(160deg, rgba(255,248,219,0.98), rgba(247,228,153,0.92))",
        glyph: "#b7871a",
      },
    };
    const tone = palette[$skin] ?? palette.classic_red;
    return `
      background: ${tone.base};
      color: ${tone.glyph};
    `;
  }}
  width: 42px;
  height: 60px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-size: 12px;
  font-weight: 800;
  display: grid;
  place-items: center;
`;

const PracticeList = styled.div`
  display: grid;
  gap: 8px;
`;

const PracticeRow = styled(GlassSurface)`
  padding: 10px;
  display: grid;
  gap: 4px;
`;

const PracticeMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

const Message = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.success};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
`;

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 14, 11, 0.56);
  display: grid;
  place-items: center;
  z-index: 40;
`;

const ModalCard = styled(GlassSurface)`
  width: min(560px, calc(100vw - 16px));
  padding: 22px;
  display: grid;
  gap: 14px;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export {
  Wrap,
  Hero,
  HeroTop,
  HeroActions,
  HeroMeta,
  ProgressBlock,
  ProgressRow,
  ProgressBar,
  ProgressFill,
  SectionTitle,
  MetricGrid,
  ZoneGrid,
  Panel,
  SkinList,
  SkinItem,
  SkinItemBody,
  SkinLabel,
  SkinPreviewCard,
  PracticeList,
  PracticeRow,
  PracticeMeta,
  Message,
  ErrorText,
  ModalBackdrop,
  ModalCard,
  ModalActions,
};
