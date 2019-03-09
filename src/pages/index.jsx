import * as React from "react";
import { useEffect } from "react";

import styled from "styled-components";
import Link from "gatsby-link";
import $ from "jquery";
import rTerm from "../styles/rTerm";

import Page from "../components/Page";
import Container from "../components/Container";
import { dimensions } from "../styles/variables";
import { media } from "../styles/mixins";
import { graphql } from "gatsby";
import IndexLayout from "../layouts";
import logo from "../styles/tumblr.gif";

const StyledHeader = styled.div`
  .gradient {
    background: #000000;
    background: linear-gradient(to bottom, #000, #353f7f);
    height: calc(100vh - 478px);
  }
  .black {
    background: #000000;
  }
  img {
    display: block;
    margin: auto;
  }
  body {
    margin: 0;
    padding: 0;
  }
  html,
  body {
    background: #000000;
    height: 95%;
  }
  h1 {
    text-align: center;
    font-weight: normal;
    font-family: "Catamaran", sans-serif;
    color: #999999;
  }
  a:-webkit-any-link {
    text-decoration: none;
    color: #2d2d82;
    cursor: default;
  }
  .link {
    text-decoration: none;
    color: #2d2d82;
    cursor: default;
  }

  .cursor {
    animation: 1s blinker linear infinite;
    -webkit-animation: 1s blinker linear infinite;
    -moz-animation: 1s blinker linear infinite;

    text-align: center;
    font-size: 14px;
    font-family: monospace, sans-serif;
    color: #999999;
  }

  @-moz-keyframes blinker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes blinker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }

  @keyframes blinker {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 1;
    }
    51% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .rterm {
    display: inline-block;
    width: 750px;
    max-width: 750px;
    font-size: 14px;
    font-family: monospace, sans-serif;
    color: #999999;
  }

  #term {
    position: fixed;

    right: 0;
    left: 0;
    margin-right: auto;
    margin-left: auto;

    min-height: 10em;
    width: 425px;
    text-align: left;
  }
`;

export default () => {
  useEffect(() => {
    $(document).ready(function() {
      var width = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      var height = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );

      // $("#audio").stop("true").delay('5000').queue(function() {
      //     $(this).html('<embed src="static/museum.mp3" loop="true" autostart="true" hidden="true" />');
      // });

      if (height < 800) {
        $("img").remove();
        $("#gradient").css("height", height - 73);
        initTerm();
      } else {
        $("#rterm")
          .delay("5000")
          .queue(function() {
            initTerm();
          });
      }
    });

    function initTerm() {
      new rTerm({
        height: $("#gradient").height() * 0.85,
        username: "korolr",
        file: "./contact.json",
        saveStrings: true
      });
    }
  });
  return (
    <StyledHeader>
      <div className="black">
        <div>
          <h1>Pain, python and javascript</h1>
          <img src={logo} height={340} width={347} />
        </div>
        <br />
        <br />
        <div className="gradient" id="gradient">
          <div className="rterm" id="rterm" />
        </div>
        <div id="audio"> </div>
      </div>
    </StyledHeader>
  );
};
