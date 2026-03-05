import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.56);
  display: grid;
  place-items: center;
  z-index: 45;

  @media ${({ theme }) => theme.media.sm} {
    place-items: end center;
  }
`;

const Dialog = styled(GlassSurface)`
  width: min(540px, calc(100vw - 16px));
  padding: 20px;
  display: grid;
  gap: 12px;

  @media ${({ theme }) => theme.media.sm} {
    width: 100%;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Stepper = styled.div`
  min-width: 52px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.1);
  display: grid;
  place-items: center;
  font-size: 20px;
  font-family: "SF Mono", "Menlo", monospace;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export { Backdrop, Dialog, Field, FieldLabel, Stepper, StepperRow, Footer };
