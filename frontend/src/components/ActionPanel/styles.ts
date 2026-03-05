import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  button {
    min-width: 98px;
  }

  button:not(:disabled):hover {
    box-shadow: none;
    transform: none;
  }

  @media ${({ theme }) => theme.media.sm} {
    button {
      flex: 1 1 calc(50% - 6px);
    }
  }
`;

export { Wrap };
