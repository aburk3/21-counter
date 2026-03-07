import styled from "styled-components";

const Wrap = styled.div`
  min-height: 100vh;
  padding: 14px;

  @media ${({ theme }) => theme.media.mobile} {
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
  grid-template-areas: "left crumb right";
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  padding: 10px 12px;

  @media ${({ theme }) => theme.media.tabletUp} {
    position: sticky;
    top: 12px;
    z-index: 20;
  }

  @media ${({ theme }) => theme.media.tablet} {
    grid-template-columns: minmax(160px, 1fr) auto;
    grid-template-areas:
      "left right"
      "crumb crumb";
  }

  @media ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
    grid-template-areas:
      "left"
      "crumb"
      "right";
    gap: 10px;
  }
`;

const Left = styled.div`
  grid-area: left;
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;

  strong {
    font-size: 18px;
    line-height: 1.2;
    letter-spacing: 0.01em;
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 14px;
    line-height: 1.3;
  }
`;

const Crumb = styled.div`
  grid-area: crumb;
  min-width: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.25;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media ${({ theme }) => theme.media.mobile} {
    text-align: left;
    white-space: normal;
    overflow: visible;
  }
`;

const Right = styled.div`
  grid-area: right;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;

  @media ${({ theme }) => theme.media.mobile} {
    justify-self: stretch;
    justify-content: space-between;
    width: 100%;
  }
`;

const UserControls = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  min-width: 0;
  flex-wrap: wrap;

  @media ${({ theme }) => theme.media.mobile} {
    justify-content: space-between;
    width: 100%;
  }
`;

const MenuWrap = styled.div`
  position: relative;
  min-width: 0;
  max-width: 100%;

  button {
    width: clamp(160px, 24vw, 320px);
    max-width: 100%;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media ${({ theme }) => theme.media.mobile} {
    width: min(100%, 320px);
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

export { Wrap, ShellHead, Left, Crumb, Right, UserControls, MenuWrap, MenuCard, ShellBody, Body };
