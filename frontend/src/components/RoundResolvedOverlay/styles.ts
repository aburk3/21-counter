import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(8, 16, 20, 0.5);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 25;
`;

const Card = styled.section`
  width: min(460px, calc(100vw - 24px));
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: linear-gradient(
    160deg,
    rgba(233, 243, 246, 0.22),
    rgba(190, 217, 236, 0.12)
  );
  backdrop-filter: blur(14px);
  padding: 22px;
  display: grid;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
`;

const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const Button = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 10px 12px;
  cursor: pointer;
`;

export { Backdrop, Card, Title, Subtitle, Button };
