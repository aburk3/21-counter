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

const Chip = styled.button<{ $bg: string }>`
  position: relative;
  overflow: hidden;
  border: 2px solid #fff;
  border-radius: ${({ theme }) => theme.radius.pill};
  width: clamp(52px, 16vw, 66px);
  height: clamp(52px, 16vw, 66px);
  font-weight: 700;
  background: ${({ $bg }) => $bg};
  color: ${({ $bg }) => ($bg === "#f7f7f2" ? "#111" : "#fff")};
  cursor: pointer;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.18);
  transition: box-shadow 180ms ease, transform 180ms ease, filter 180ms ease;

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

  &:not(:disabled):hover {
    animation: ${chipLift} 180ms ease forwards;
    box-shadow: 0 12px 22px rgba(0, 0, 0, 0.24);
  }

  &:not(:disabled):hover::after {
    animation: ${chipSheen} 620ms ease;
  }

  &:disabled {
    opacity: 0.38;
    cursor: not-allowed;
    filter: grayscale(0.65);
    box-shadow: none;
  }
`;

export { Tray, Chip };
