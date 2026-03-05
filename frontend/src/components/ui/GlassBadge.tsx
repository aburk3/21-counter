import styled from "styled-components";

const GlassBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid rgba(255, 255, 255, 0.42);
  background: rgba(245, 254, 250, 0.16);
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
`;

export { GlassBadge };
