import styled from "styled-components";

const Wrap = styled.div`
  min-height: 100vh;
  padding: 14px;

  @media ${({ theme }) => theme.media.sm} {
    padding: 10px;
  }
`;

const ShellHead = styled.header`
  min-height: 64px;
  border: 1px solid rgba(255, 255, 255, 0.34);
  border-radius: ${({ theme }) => theme.radius.lg};
  background:
    radial-gradient(circle at 0% 0%, rgba(255, 255, 255, 0.2), transparent 44%),
    rgba(241, 252, 246, 0.14);
  transform: translateZ(0);
  display: grid;
  grid-template-columns: minmax(190px, 1fr) auto minmax(220px, 1fr);
  align-items: center;
  gap: 10px;
  padding: 8px 12px;

  @media ${({ theme }) => theme.media.tabletUp} {
    position: sticky;
    top: 12px;
    z-index: 20;
  }

  @media ${({ theme }) => theme.media.sm} {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;

  strong {
    font-size: 18px;
    letter-spacing: 0.01em;
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
  }
`;

const Crumb = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  @media ${({ theme }) => theme.media.sm} {
    text-align: left;
  }
`;

const Right = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

const MenuWrap = styled.div`
  position: relative;

  button {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const MenuCard = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: min(220px, 70vw);
  padding: 10px;
  z-index: 30;
`;

const ShellBody = styled.main`
  margin-top: 14px;
`;

const Body = styled.div`
  display: grid;
  gap: 14px;
`;

export { Wrap, ShellHead, Left, Crumb, Right, MenuWrap, MenuCard, ShellBody, Body };
