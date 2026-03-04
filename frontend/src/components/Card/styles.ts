import styled from "styled-components";

const CardFace = styled.div<{ $red: boolean }>`
  width: clamp(48px, 14vw, 72px);
  height: clamp(68px, 20vw, 102px);
  border-radius: 10px;
  border: 1px solid #d8d8d8;
  background: #fff;
  color: ${({ $red }) => ($red ? "#c81f2d" : "#111")};
  padding: clamp(5px, 1.5vw, 8px);
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  font-weight: 700;
  transform: translateY(0);
  transition:
    transform 170ms ease,
    box-shadow 170ms ease;
  will-change: transform;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 10px 16px rgba(0, 0, 0, 0.24);
  }
`;

const Center = styled.div`
  font-size: clamp(16px, 4vw, 22px);
  text-align: center;
`;

export { CardFace, Center };
