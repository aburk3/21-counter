import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Wrap = styled.main`
  display: grid;
  gap: 12px;
`;

const UtilityBar = styled(GlassSurface)`
  padding: 10px 12px;
  transform: translateZ(0);
  contain: paint;
  isolation: isolate;
  overflow: hidden;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media ${({ theme }) => theme.media.mobile} {
    padding: 10px;
  }
`;

const UtilityMeta = styled.div`
  display: grid;
  gap: 4px;

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
`;

const UtilityActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;

  button {
    flex: 1 1 120px;
  }
`;

const Layout = styled.section`
  display: grid;
  gap: 12px;
  align-items: start;

  @media ${({ theme }) => theme.media.tabletUp} {
    grid-template-columns: 1.9fr 1fr;
  }
`;

const TableRegion = styled.div`
  min-width: 0;
`;

const Dock = styled(GlassSurface)`
  padding: 14px;
  display: grid;
  gap: 12px;
  align-content: start;

  @media ${({ theme }) => theme.media.mobile} {
    position: sticky;
    bottom: 8px;
    z-index: 18;
  }
`;

const DockSection = styled.section`
  display: grid;
  gap: 8px;
`;

const DockRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
`;

const DockLabel = styled.span`
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const HintCard = styled(GlassSurface)`
  padding: 10px;
  font-size: 13px;
`;

const Caption = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 13px;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
`;

const SummaryBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.56);
  display: grid;
  place-items: center;
  z-index: 30;
`;

const SummaryCard = styled(GlassSurface)`
  width: min(620px, calc(100vw - 16px));
  padding: 22px;
  display: grid;
  gap: 14px;
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const SummaryItem = styled(GlassSurface)`
  padding: 10px 12px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export {
  Wrap,
  UtilityBar,
  UtilityMeta,
  UtilityActions,
  Layout,
  TableRegion,
  Dock,
  DockSection,
  DockRow,
  DockLabel,
  HintCard,
  Caption,
  ErrorText,
  SummaryBackdrop,
  SummaryCard,
  SummaryGrid,
  SummaryItem,
  ActionRow,
};
