import styled, { keyframes } from "styled-components";

const badgeIn = keyframes`
  from {
    opacity: 0.72;
    transform: translateY(2px) scale(0.99);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  background: ${({ theme }) => theme.colors.panel};
  font-weight: 700;
  transition: box-shadow 220ms ease, transform 220ms ease;
  animation: ${badgeIn} 280ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(155, 220, 255, 0.22);
  }
`;

export { Badge };
