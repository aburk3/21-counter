import styled from "styled-components";

const Wrap = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 12px;
  }
`;

const Card = styled.section`
  width: min(420px, 100%);
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  backdrop-filter: blur(12px);
  padding: 24px;
  display: grid;
  gap: 12px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 16px;
  }
`;

const FormField = styled.label`
  display: grid;
  gap: 6px;
  font-size: 14px;
`;

const Input = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 12px;
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  margin: 0;
`;

const InfoText = styled.p`
  color: ${({ theme }) => theme.colors.success};
  margin: 0;
`;

const HelpText = styled.p`
  color: ${({ theme }) => theme.colors.textSubtle};
  margin: 0;
  font-size: 12px;
`;

const Submit = styled.button`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.22);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 12px;
  min-height: 44px;
  cursor: pointer;
`;

export { Wrap, Card, FormField, Input, ErrorText, InfoText, HelpText, Submit };
