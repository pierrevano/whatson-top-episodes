import React from "react";
import styled from "styled-components";
import Container from "./Container";
import MenuIcon from "./icons/MenuIcon";
import logo from "../../logo.png";

const StickyContainer = styled(Container)`
  top: 0;
  position: sticky;
  z-index: 2;
  background: ${(p) => p.theme.colors.dark};
  margin: 0.5rem auto;
`;

const Wrapper = styled.div`
  padding: 1.25rem 0 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  margin: -0.75rem;
  padding: 0.75rem;
  border-radius: 2rem;
  user-select: none;
  cursor: pointer;
  line-height: 0;
  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Logo = styled.a`
  text-decoration: none;
  color: currentColor;
  margin: -0.5rem;
  padding: 0.5rem;
  border-radius: 2rem;
  user-select: none;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  height: 40px;
  width: 40px;
`;

const LogoMark = styled.span`
  position: absolute;
  left: 45px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightSpacer = styled.div`
  width: 30px;
  height: 30px;
  margin: -0.75rem;
  padding: 0.75rem;
`;

const NavBar = ({ onOpenSidebar }) => (
  <StickyContainer>
    <Wrapper>
      <IconButton
        type="button"
        onClick={onOpenSidebar}
        aria-label="Open filters"
      >
        <MenuIcon style={{ transform: "translateY(1px)", cursor: "pointer" }} />
      </IconButton>
      <Logo href="/">
        <LogoMark role="img" aria-label="logo">
          <img
            style={{ maxWidth: "24px", display: "block" }}
            src={logo}
            alt="logo"
            width="24"
            height="24"
          />
        </LogoMark>
      </Logo>
      <RightSpacer aria-hidden="true" />
    </Wrapper>
  </StickyContainer>
);

export default NavBar;
