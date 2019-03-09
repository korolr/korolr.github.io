import * as React from "react";

import Page from "../components/Page";
import Container from "../components/Container";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors, fonts } from "../styles/variables";
import { graphql } from "gatsby";

interface PortfolioPageProps {
  data: {
    site: {
      siteMetadata: {
        title: string;
        description: string;
        author: {
          name: string;
          url: string;
        };
      };
    };
    allMarkdownRemark: {
      html: string;
      frontmatter: {
        order: number;
        type: string;
        description: string;
        externalUrl: string;
      };
    };
  };
}

// language=GraphQL
export const postQuery = graphql`
  query ProjectQuery {
    site {
      siteMetadata {
        title
        description
        author {
          name
          url
        }
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { type: { eq: "nugget" } } }
      sort: { fields: [frontmatter___order], order: ASC }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            order
            type
            description
            externalUrl
          }
        }
      }
    }
  }
`;

const StyledList = styled.ul`
  padding: 0;
`;

const StyledListWithoutDescriptions = styled.ul`
  padding: 0;
  h4 {
    padding-bottom: 0;
    line-height: 1;
    margin: 0;
  }
`;

const StyledListElement = styled.li`
  list-style: none;
  h4 {
    margin-bottom: 0;
    line-height: 1.5rem;
  }
  h4:hover {
    color: ${colors.linkInk};
  }
  p {
    color: ${colors.ink};
  }
  a:hover {
    text-decoration: none;
  }
`;

const PortfolioPage = ({ data }: PortfolioPageProps) => {
  const projects = data.allMarkdownRemark.edges;

  return (
    <Page>
      <Container>
        <h3>Work</h3>
        <StyledList>
          <StyledListElement>
            <p>To-do</p>
          </StyledListElement>
        </StyledList>

        <h3>Published Articles</h3>
        <StyledList>
          <StyledListElement>
            <a href="https://css-tricks.com/">
              <h4>To-do</h4>
            </a>
          </StyledListElement>
        </StyledList>

        <h3>Projects</h3>
        <StyledList>
          {projects.map(project => (
            <StyledListElement>
              <a href={project.node.frontmatter.externalUrl}>
                <h4>{project.node.frontmatter.title}</h4>
              </a>
              <p>{project.node.frontmatter.description}</p>
            </StyledListElement>
          ))}
        </StyledList>
      </Container>
    </Page>
  );
};

export default PortfolioPage;
