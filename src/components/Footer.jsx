import React from "react";
import styled from "styled-components";
import Container from "./Container";
import GithubIcon from "./icons/GithubIcon";

const Wrapper = styled.div`
  padding: 1.5rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Anchor = styled.a`
  display: block;
  text-decoration: none;
  color: ${(p) => p.theme.colors.lightGrey};
  margin: -0.5rem;
  padding: 0.5rem;
  border-radius: 0.125rem;
  font-weight: 500;
  &:hover,
  &:focus {
    color: ${(p) => p.theme.colors.white};
  }
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const Footer = () => (
  <Container>
    <Wrapper>
      <Anchor
        href="https://github.com/pierrevano/whatson-api"
        aria-label="Whatson API repository"
      >
        What&apos;s on? API
      </Anchor>
      <Anchor
        href="https://github.com/pierrevano"
        style={{ padding: "0.375rem" }}
        aria-label="Pierre GitHub profile"
      >
        <GithubIcon />
      </Anchor>
      <Anchor href="https://pierrevano.github.io" aria-label="Pierre's website">
        pierreschelde
      </Anchor>
    </Wrapper>
  </Container>
);

export default Footer;
