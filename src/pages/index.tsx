import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";

import Page from "../components/Page";
import Container from "../components/Container";
import { dimensions } from "../styles/variables";
import { media } from "../styles/mixins";
import { graphql } from "gatsby";
import IndexLayout from "../layouts";

const StyledHeader = styled.div`
  h1,
  h2 {
    display: inline;
    line-height: ${dimensions.lineHeight.hero};
  }
`;

const StyledContent = styled.div`
  margin-top: 100px;
`;

export default () => (
  <Page>
    <Container>
      <StyledHeader>
        <h1>Hi There.</h1> <h2>I'm Alexsey Ramzaev. Frontend developer.</h2>
      </StyledHeader>
      <StyledContent>
        <h3>Work</h3>
        <p>Search 🎯</p>

        <h3>Extra Curricular</h3>
        <p>
          On my own time, I contribute to open-source projects like{" "}
          <a href="https://github.com/go-martini/martini">Martini</a>{" "}
        </p>
      </StyledContent>
    </Container>
  </Page>
);
