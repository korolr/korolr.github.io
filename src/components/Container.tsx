import * as React from "react";
import styled from "styled-components";

import { widths } from "../styles/variables";
import { getEmSize } from "../styles/mixins";

const StyledContainer = styled.div`
  position: relative;
  width: auto;
  max-width: ${getEmSize(widths.md)}em;
`;

interface ContainerProps {
  className?: string;
}

const Container: React.SFC<ContainerProps> = ({ children, className }) => (
  <StyledContainer className={className}>{children}</StyledContainer>
);

export default Container;
