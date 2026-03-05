import styled, { keyframes } from "styled-components";

const chipLift = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-2px); }
`;

const chipSheen = keyframes`
  from { transform: translateX(-120%) rotate(12deg); opacity: 0; }
  35% { opacity: 0.35; }
  to { transform: translateX(180%) rotate(12deg); opacity: 0; }
`;

const Tray = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 2px;
`;

const ChipGroup = styled.div`
  display: grid;
  justify-items: center;
  gap: 8px;
`;

const Chip = styled.div<{ $bg: string }>`
  position: relative;
  overflow: hidden;
  border: 2px solid #fff;
  border-radius: ${({ theme }) => theme.radius.pill};
  width: clamp(52px, 16vw, 66px);
  height: clamp(52px, 16vw, 66px);
  background: ${({ $bg }) => $bg};
  color: ${({ $bg }) => ($bg === "#f7f7f2" ? "#111" : "#fff")};
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
  transition: box-shadow 180ms ease, transform 180ms ease;
  display: grid;
  place-items: center;
  animation: ${chipLift} 180ms ease reverse;

  &::after {
    content: "";
    position: absolute;
    inset: -18px;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 35%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 65%
    );
    pointer-events: none;
    opacity: 0;
  }

  &:hover {
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.2);
  }

  &:hover::after {
    animation: ${chipSheen} 620ms ease;
  }
`;

const ChipValue = styled.span`
  font-weight: 700;
`;

const ChipControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
`;

const ControlButton = styled.button`
  width: 30px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(245, 255, 250, 0.14);
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  font-weight: 700;
  line-height: 1;

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
  }
`;

export { Tray, ChipGroup, Chip, ChipValue, ChipControls, ControlButton };
