import styled from "styled-components";

const Wrap = styled.article`
  padding: 14px;
  display: grid;
  gap: 8px;
  align-content: start;
  min-height: 132px;

  @media ${({ theme }) => theme.media.mobile} {
    min-height: auto;
  }
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  line-height: 1.35;
  letter-spacing: 0.03em;
`;

const Value = styled.div`
  font-size: clamp(24px, 6.4vw, 30px);
  font-weight: 700;
  line-height: 1.12;
  overflow-wrap: anywhere;
`;

const Trend = styled.span<{ $trend: "up" | "down" | "neutral" }>`
  width: fit-content;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid
    ${({ $trend }) =>
      $trend === "up"
        ? "rgba(157, 255, 204, 0.62)"
        : $trend === "down"
          ? "rgba(255, 171, 171, 0.62)"
          : "rgba(255, 255, 255, 0.35)"};
  background: ${({ $trend }) =>
    $trend === "up"
      ? "rgba(80, 195, 130, 0.22)"
      : $trend === "down"
        ? "rgba(196, 69, 69, 0.22)"
        : "rgba(255, 255, 255, 0.1)"};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 11px;
  line-height: 1.2;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

export { Wrap, Label, Value, Trend };
