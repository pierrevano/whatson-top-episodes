import React from "react";
import styled from "styled-components";
import Container from "./Container";

const Wrapper = styled.label`
  background: ${(p) => p.theme.colors.white};
  color: ${(p) => p.theme.colors.lightGrey};
  display: flex;
  align-items: center;
  border-radius: 0.25rem;
  position: relative;
  box-shadow: 0 0 4rem 0.125rem ${(p) => p.theme.colors.dark};
  padding: 0.5rem 0.625rem;

  @media (min-width: 30rem) {
    padding: 0.75rem;
  }

  &:focus-within::before {
    content: "";
    border-radius: 0.25rem;
    position: absolute;
    inset: 0;
    ${(p) => p.theme.focusShadow}
  }
`;

const Input = styled.input`
  color: ${(p) => p.theme.colors.dark};
  border: none;
  background: none;
  outline: none;
  flex: 1;
  ${(p) => p.theme.typography[0]};
  margin-left: 0.375rem;

  @media (min-width: 30rem) {
    margin-left: 0.5rem;
  }

  &::placeholder {
    color: ${(p) => p.theme.colors.lightGrey};
  }

  &::selection {
    background: ${(p) => p.theme.colors.lightGrey};
    color: ${(p) => p.theme.colors.white};
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: ${(p) => p.theme.colors.lightGrey};
  cursor: pointer;
  z-index: 2;
  padding: 0.125rem 0 0.125rem 0.5rem;
`;

const Loupe = () => (
  <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 14.5l-3.72-3.72" />
      <circle cx="6.67" cy="6.67" r="5.33" />
    </g>
  </svg>
);

const Searchbar = ({ value, onChange, onClear, inputRef, ...props }) => (
  <Container {...props}>
    <Wrapper>
      <Loupe />
      <Input
        ref={inputRef}
        placeholder="Search top rated episodes (⌘+K / Ctrl+K)"
        value={value}
        onChange={onChange}
      />
      {value && (
        <ClearButton type="button" onClick={onClear} aria-label="Clear search">
          <i className="pi pi-times-circle" />
        </ClearButton>
      )}
    </Wrapper>
  </Container>
);

export default Searchbar;
