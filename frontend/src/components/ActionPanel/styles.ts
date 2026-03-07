import styled from "styled-components";

const Wrap = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  button {
    min-width: 98px;
    flex: 1 1 110px;
    justify-content: center;
    text-align: center;
  }

  button:not(:disabled):hover {
    box-shadow: none;
    transform: none;
  }

  @media ${({ theme }) => theme.media.mobile} {
    button {
      flex: 1 1 calc(50% - 6px);
    }
  }
`;

export { Wrap };
