import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Wrap = styled.main`
  display: grid;
  gap: 14px;
`;

const Hero = styled(GlassSurface)`
  display: grid;
  gap: 10px;
  padding: 18px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
`;

const HeroActions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const FieldLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const StepperRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Stepper = styled.div`
  min-width: 56px;
  min-height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid rgba(255, 255, 255, 0.38);
  background: rgba(255, 255, 255, 0.12);
  display: grid;
  place-items: center;
  font-size: 20px;
  font-family: "SF Mono", "Menlo", monospace;
  line-height: 1;
`;

const Board = styled(GlassSurface)`
  padding: 18px;
  display: grid;
  gap: 12px;
`;

const BoardMeta = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const DeckArea = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: ${({ theme }) => theme.radius.lg};
  background: rgba(255, 255, 255, 0.08);
  padding: 18px;
  display: grid;
  place-items: center;
  min-height: 220px;
  cursor: pointer;

  @media ${({ theme }) => theme.media.mobile} {
    min-height: 190px;
    padding: 14px;
  }
`;

const Placeholder = styled.div`
  width: clamp(64px, 18vw, 92px);
  height: clamp(94px, 26vw, 130px);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.45);
  display: grid;
  place-items: center;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSubtle};
`;

const SubmitRow = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr auto;

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(255, 255, 255, 0.16);
  color: ${({ theme }) => theme.colors.text};
  padding: 12px;
`;

const ResultBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 14, 11, 0.56);
  display: grid;
  place-items: center;
  z-index: 40;
`;

const ResultCard = styled(GlassSurface)`
  width: min(620px, calc(100vw - 16px));
  padding: 20px;
  display: grid;
  gap: 12px;
`;

const HiddenCards = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
`;

const SettingsBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(2, 14, 11, 0.56);
  display: grid;
  place-items: center;
  z-index: 40;
`;

const SettingsCard = styled(GlassSurface)`
  width: min(620px, calc(100vw - 16px));
  padding: 20px;
  display: grid;
  gap: 12px;
`;

const SettingsGrid = styled.div`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const SettingsActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export {
  Wrap,
  Hero,
  TopRow,
  HeroActions,
  Field,
  FieldLabel,
  StepperRow,
  Stepper,
  Board,
  BoardMeta,
  DeckArea,
  Placeholder,
  SubmitRow,
  Input,
  ResultBackdrop,
  ResultCard,
  HiddenCards,
  ErrorText,
  SettingsBackdrop,
  SettingsCard,
  SettingsGrid,
  SettingsActions,
};
