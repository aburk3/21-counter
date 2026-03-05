import styled from "styled-components";

import { GlassSurface } from "@/components/ui/GlassSurface";

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: grid;
  place-items: center;
  z-index: 40;
`;

const Dialog = styled(GlassSurface)`
  width: min(580px, calc(100vw - 16px));
  padding: 24px;
  display: grid;
  gap: 14px;
`;

const Field = styled.label`
  display: grid;
  gap: 8px;
`;

const Input = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: ${({ theme }) => theme.radius.sm};
  background: rgba(255, 255, 255, 0.16);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 12px;

  &::placeholder {
    color: rgba(241, 250, 247, 0.82);
  }
`;

const ResultGrid = styled.div`
  display: grid;
  gap: 8px;
`;

const ResultItem = styled(GlassSurface)`
  padding: 10px;
  display: grid;
  gap: 6px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const Pill = styled.span<{ $tone: "good" | "warn" }>`
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid
    ${({ $tone }) => ($tone === "good" ? "rgba(157, 255, 204, 0.62)" : "rgba(255, 171, 171, 0.62)")};
  background: ${({ $tone }) => ($tone === "good" ? "rgba(80, 195, 130, 0.18)" : "rgba(196, 69, 69, 0.22)")};
  font-size: 11px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 4px 8px;
`;

const Footer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
`;

export { Backdrop, Dialog, Field, Input, ResultGrid, ResultItem, Row, Pill, Footer };
