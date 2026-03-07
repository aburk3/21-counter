import styled, { css, keyframes } from "styled-components";

const SKIN_TONES: Record<string, string> = {
  classic_red: "rgba(120, 34, 36, 0.26)",
  ocean_blue: "rgba(25, 91, 130, 0.24)",
  obsidian: "rgba(35, 35, 35, 0.36)",
  emerald: "rgba(26, 105, 72, 0.28)",
  gold: "rgba(143, 111, 34, 0.3)",
};

const focusPulse = keyframes`
  from { box-shadow: 0 0 0 0 rgba(121, 232, 227, 0.26); }
  to { box-shadow: 0 0 0 10px rgba(121, 232, 227, 0); }
`;

const TableWrap = styled.section<{ $skin: string }>`
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    radial-gradient(circle at 15% 20%, rgba(255, 255, 255, 0.14), transparent 45%),
    ${({ $skin }) => SKIN_TONES[$skin] ?? "rgba(7, 42, 30, 0.8)"},
    rgba(7, 42, 30, 0.8);
  padding: 20px;
  min-height: 420px;
  display: grid;
  gap: 14px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 12px;
    border-radius: ${({ theme }) => theme.radius.md};
    gap: 10px;
    min-height: 320px;
  }
`;

const Group = styled.section`
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 14px;
  background: rgba(4, 20, 15, 0.22);
  padding: 10px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-family: "SF Mono", "Menlo", monospace;
`;

const HandRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

const Label = styled.div<{ $isPrimary?: boolean }>`
  flex: 0 1 96px;
  font-weight: ${({ $isPrimary }) => ($isPrimary ? 800 : 700)};
  color: ${({ theme, $isPrimary }) =>
    $isPrimary ? theme.colors.accent : theme.colors.textSubtle};
  line-height: 1.25;

  @media ${({ theme }) => theme.media.mobile} {
    flex-basis: auto;
    min-width: 0;
    font-size: 13px;
  }
`;

const Seats = styled.div`
  display: grid;
  gap: 10px;
  width: min(100%, 760px);
`;

const Seat = styled.div<{ $isPrimary?: boolean; $isActive: boolean }>`
  border: 1px solid
    ${({ $isPrimary, $isActive }) =>
      $isActive
        ? "rgba(121, 232, 227, 0.86)"
        : $isPrimary
          ? "rgba(121, 232, 227, 0.42)"
          : "rgba(255, 255, 255, 0.25)"};
  background: ${({ $isPrimary }) =>
    $isPrimary ? "rgba(110, 215, 255, 0.12)" : "rgba(255, 255, 255, 0.08)"};
  border-radius: 14px;
  padding: 10px;
  display: grid;
  gap: 8px;
  opacity: ${({ $isPrimary, $isActive }) => ($isPrimary && !$isActive ? 0.78 : 1)};

  ${({ $isActive }) =>
    $isActive
      ? css`
          animation: ${focusPulse} 1.4s ease infinite;
        `
      : ""}

  @media ${({ theme }) => theme.media.sm} {
    padding: 8px;
    gap: 6px;
  }
`;

const SeatHeader = styled.div`
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
  @media ${({ theme }) => theme.media.sm} {
    font-size: 11px;
  }
`;

const StatusPill = styled.span<{ $kind?: "good" | "bad" | "neutral" }>`
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid
    ${({ $kind }) =>
      $kind === "bad"
        ? "rgba(255, 145, 145, 0.6)"
        : $kind === "good"
          ? "rgba(158, 237, 176, 0.64)"
          : "rgba(255, 255, 255, 0.4)"};
  background:
    ${({ $kind }) =>
      $kind === "bad"
        ? "rgba(148, 34, 34, 0.24)"
        : $kind === "good"
          ? "rgba(48, 141, 69, 0.2)"
          : "rgba(255, 255, 255, 0.14)"};
  color: ${({ theme }) => theme.colors.text};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 2px 8px;
  width: fit-content;
`;

const Cards = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
`;

export {
  TableWrap,
  Group,
  Header,
  HandRow,
  Label,
  Seats,
  Seat,
  SeatHeader,
  StatusPill,
  Cards,
};
