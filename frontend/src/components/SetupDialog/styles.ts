import styled from "styled-components";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
`;

const Dialog = styled.div`
  width: min(480px, calc(100vw - 16px));
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(12px);
  padding: 20px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 14px;
  }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 12px;
`;

const ContinueButton = styled.button`
  margin-top: 16px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 12px;
  min-height: 44px;
  cursor: pointer;
`;

export { Backdrop, Dialog, Field, ContinueButton };
