import * as React from "react";
import styled from "styled-components";
import { transparentize } from "polished";
import Link from "gatsby-link";

import { heights, dimensions, colors } from "../styles/variables";
// import { onEvent } from "../styles/mixins";
import Container from "./Container";

const StyledHeader = styled.header`
  height: ${heights.header}px;
  color: ${transparentize(0.5, colors.white)};
  background: ${colors.ui.light};
`;

const HeaderInner = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  border-bottom: 1px solid ${colors.black};
  margin: 0 ${dimensions.containerPadding}rem;
`;

const Links = styled.div`
  a {
    color: ${colors.black};
    padding-left: ${dimensions.gridUnit}px;
  }
`;

const Title = styled.div`
  a {
    color: ${colors.black};
  }
`;

interface HeaderProps {
  title: string;
}

const Header: React.SFC<HeaderProps> = ({ title }) => (
  <StyledHeader>
    <HeaderInner>
      <Title>
        <Link to="/blog/">{title}</Link>
      </Title>
      <Links>
        <Link to="/blog/posts/my-library/">Library</Link>
        <Link to="/blog/articles">Articles</Link>
        <Link to="/blog/portfolio">Portfolio</Link>
        <Link to="/"> Main page</Link>
      </Links>
    </HeaderInner>
  </StyledHeader>
);

export default Header;
