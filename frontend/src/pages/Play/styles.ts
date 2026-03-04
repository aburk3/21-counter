import styled from "styled-components";

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

const TopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Layout = styled.section`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  @media ${({ theme }) => theme.media.tabletUp} {
    grid-template-columns: 2fr 1fr;
  }
`;

const SidePanel = styled.aside`
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(12px);
  padding: 18px;
  display: grid;
  gap: 16px;
  align-content: start;

  @media ${({ theme }) => theme.media.sm} {
    padding: 14px;
    gap: 14px;
  }
`;

const Section = styled.div`
  display: grid;
  gap: 10px;
`;

const Caption = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 13px;
`;

const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const ExitButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 13px;
  min-height: 44px;
  cursor: pointer;
`;

const SettingsButton = styled.button`
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: transform 180ms ease, background 180ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.28);
  }
`;

const ContinueCountButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 13px;
  min-height: 44px;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.28);
  }
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

const SummaryCard = styled.section`
  width: min(560px, calc(100vw - 16px));
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(12px);
  padding: 22px;
  display: grid;
  gap: 14px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 16px;
    gap: 10px;
  }
`;

const SummaryGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const SummaryItem = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.08);
  padding: 10px 12px;
`;

export {
  Wrap,
  TopBar,
  TopActions,
  Layout,
  SidePanel,
  Section,
  Caption,
  ActionRow,
  ExitButton,
  SettingsButton,
  ContinueCountButton,
  ErrorText,
  SummaryBackdrop,
  SummaryCard,
  SummaryGrid,
  SummaryItem,
};
