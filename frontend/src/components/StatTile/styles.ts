import styled from "styled-components";

const Tile = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.panelBorder};
  border-radius: ${({ theme }) => theme.radius.panel};
  background: ${({ theme }) => theme.colors.panel};
  padding: 14px;
`;

const Label = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 12px;
`;

const Value = styled.div`
  margin-top: 8px;
  font-size: 24px;
  font-weight: 700;
`;

export { Tile, Label, Value };