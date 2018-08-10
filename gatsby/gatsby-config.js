"use strict";

const cssnext = require("postcss-cssnext");

module.exports = {
  siteMetadata: {
    title: "Alexsey Ramzaev",
    description: "Боль, питон и джаваскрипт",
    pathPrefix: `/blog`,
    siteUrl: "https://korolr.github.io/blog/",
    author: {
      name: "Alexsey Ramzaev",
      url: "https://twitter.com/korolr22",
      email: "cyberfunk9@gmail.com",
    },
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "content",
        path: `${__dirname}/src/content`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1rem",
            },
          },
          "gatsby-remark-prismjs",
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 1140,
              quality: 90,
              linkImagesToOriginal: false,
            },
          },
        ],
      },
    },
    "gatsby-transformer-json",
    {
      resolve: "gatsby-plugin-canonical-urls",
      options: {
        siteUrl: "https://gatsby-starter-typescript-plus.netlify.com",
      },
    },
    "gatsby-plugin-styled-components",
    "gatsby-plugin-typescript",
    "gatsby-plugin-react-next",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
  ],
};
