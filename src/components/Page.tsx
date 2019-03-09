import * as React from "react";
import styled from "styled-components";

import { dimensions } from "../styles/variables";
import { graphql } from "gatsby";
import IndexLayout from "../layouts/index";

const StyledPage = styled.div`
  display: block;
  flex: 1;
  position: relative;
  padding: ${dimensions.containerPadding}rem;
  margin-bottom: 3rem;
`;

interface PageProps {
  className?: string;
}

const Page: React.SFC<PageProps> = ({ children, className }) => (
  <IndexLayout>
    <StyledPage className={className}>{children}</StyledPage>
  </IndexLayout>
);

export default Page;
