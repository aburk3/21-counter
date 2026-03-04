import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 2px;
`;

const ActionButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.18);
  color: ${({ theme }) => theme.colors.text};
  padding: 11px 16px;
  min-height: 44px;
  cursor: pointer;

  @media ${({ theme }) => theme.media.sm} {
    flex: 1 1 calc(50% - 6px);
  }
`;

export { Wrap, ActionButton };
