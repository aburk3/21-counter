import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Wrap = styled.main`
  display: grid;
  gap: 16px;
`;

const Hero = styled(GlassSurface)`
  padding: 18px;
  display: grid;
  gap: 12px;
`;

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

const Section = styled.section`
  display: grid;
  gap: 10px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(20px, 2.2vw, 24px);
`;

const MetricGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
`;

const FooterGrid = styled.section`
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const Panel = styled(GlassSurface)`
  padding: 14px;
  display: grid;
  gap: 10px;
`;

const PracticeList = styled.div`
  display: grid;
  gap: 8px;
`;

const PracticeRow = styled(GlassSurface)`
  padding: 10px;
  display: grid;
  gap: 4px;
`;

const PracticeMeta = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.danger};
`;

export {
  Wrap,
  Hero,
  HeroTop,
  Section,
  SectionTitle,
  MetricGrid,
  FooterGrid,
  Panel,
  PracticeList,
  PracticeRow,
  PracticeMeta,
  ErrorText,
};
