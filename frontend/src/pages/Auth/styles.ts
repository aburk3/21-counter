import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Wrap = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
`;

const Shell = styled(GlassSurface)`
  width: min(980px, 100%);
  min-height: min(620px, 90vh);
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  overflow: hidden;

  @media ${({ theme }) => theme.media.lg} {
    grid-template-columns: 1fr;
  }

  @media ${({ theme }) => theme.media.sm} {
    border-radius: ${({ theme }) => theme.radius.md};
  }
`;

const BrandPanel = styled.section`
  padding: 32px;
  background:
    radial-gradient(circle at 8% 0%, rgba(177, 246, 227, 0.3), transparent 46%),
    linear-gradient(180deg, rgba(7, 46, 37, 0.42), rgba(7, 46, 37, 0.14));
  display: grid;
  align-content: space-between;
  gap: 22px;

  p {
    margin: 0;
    max-width: 30ch;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  @media ${({ theme }) => theme.media.lg} {
    padding: 20px 20px 10px;
  }
`;

const BrandTag = styled.span`
  width: fit-content;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(245, 254, 250, 0.14);
  padding: 6px 10px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const AuthPanel = styled.section`
  padding: 28px;
  display: grid;
  gap: 12px;
  align-content: center;

  @media ${({ theme }) => theme.media.sm} {
    padding: 14px;
  }
`;

const FormField = styled.label`
  display: grid;
  gap: 6px;
  font-size: 14px;
`;

const Input = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(255, 255, 255, 0.16);
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

const VerifyHint = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

const RequirementList = styled.ul`
  list-style: none;
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
`;

const Requirement = styled.li<{ $ok: boolean }>`
  font-size: 12px;
  color: ${({ theme, $ok }) => ($ok ? theme.colors.success : theme.colors.textSecondary)};
`;

const TertiaryAction = styled.button`
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: left;
  padding: 0;
  cursor: pointer;
`;

export {
  Wrap,
  Shell,
  BrandPanel,
  BrandTag,
  AuthPanel,
  FormField,
  Input,
  ErrorText,
  InfoText,
  HelpText,
  VerifyHint,
  RequirementList,
  Requirement,
  TertiaryAction,
};
