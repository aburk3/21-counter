import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
`;

const Dialog = styled.div`
  width: min(560px, calc(100vw - 16px));
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(12px);
  padding: 24px;
  display: grid;
  gap: 14px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 16px;
    gap: 10px;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const Input = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 12px;

  &::placeholder {
    color: rgba(241, 250, 247, 0.82);
  }
`;

const Result = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  padding: 12px;
  display: grid;
  gap: 6px;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

const Button = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 12px;
  cursor: pointer;
  min-width: 120px;
  min-height: 44px;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export { Backdrop, Dialog, Field, Input, Result, Footer, Button };
