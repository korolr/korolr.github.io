import * as React from "react";

import Page from "../components/Page";
import Container from "../components/Container";
import styled from "styled-components";
import { fonts } from "../styles/variables";

interface PageTemplateProps {
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
    markdownRemark: {
      html: string;
      excerpt: string;
      frontmatter: {
        title: string;
      };
    };
  };
}

const PageTemplate: React.SFC<PageTemplateProps> = ({ data }) => (
  <Page>
    <Container>
      <SyntaxHighlighting>
        <h2>{data.markdownRemark.frontmatter.title}</h2>
        <div dangerouslySetInnerHTML={{ __html: data.markdownRemark.html }} />
      </SyntaxHighlighting>
    </Container>
  </Page>
);

export default PageTemplate;

export const query = graphql`
  query PageTemplateQuery($slug: String!) {
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
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      excerpt
      frontmatter {
        title
      }
    }
  }
`;

const SyntaxHighlighting = styled.div`
  // Syntax:
  .gatsby-highlight {
    margin: 8px 0;
  }

  code[class*="language-"],
  pre[class*="language-"] {
    padding: 10px;
    color: #f8f8f2;
    background: transparent;
    text-shadow: 0 1px rgba(0, 0, 0, 0.3);
    font-family: ${fonts.monospace};
    font-size: 14px;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
  }

  /* Code blocks */
  pre[class*="language-"] {
    padding: 1em;
    margin: 0.5em 0;
    overflow: auto;
    border-radius: 0.3em;
  }

  :not(pre) > code[class*="language-"],
  pre[class*="language-"] {
    background: #272822;
  }

  :not(pre) > code {
    background: lighten(black, 70%);
    font-size: 14px;
    padding: 0.1em;
    border-radius: 0.3em;
    white-space: normal;
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: lighten(black, 50%);
  }

  .token.class-name {
    color: #ff8080;
  }

  .token.punctuation {
    color: #f8f8f2;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: #f92672;
  }

  .token.boolean,
  .token.number {
    color: #efc090;
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted,
  .token.variable {
    color: #dc78dc;
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string {
    color: #f8f8f2;
  }

  .token.atrule,
  .token.attr-value,
  .token.function {
    color: #bed6ff;
  }

  .token.keyword {
    color: #00d0d0;
  }

  .token.regex,
  .token.important {
    color: #ccdf32;
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;
