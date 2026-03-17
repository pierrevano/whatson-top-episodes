import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html,
  body {
    font-family: ${({ theme }) => theme.fonts.default};
    font-size: ${({ theme }) => theme.typography[0].fontSize};
    line-height: ${({ theme }) => theme.typography[0].lineHeight};
    letter-spacing: ${({ theme }) => theme.typography[0].letterSpacing};
    background: ${({ theme }) => theme.colors.dark};
    color: ${({ theme }) => theme.colors.white};
    text-rendering: optimizeLegibility;
    font-smooth: antialised;
    font-smoothing: antialised;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    min-height: 100%;
  }

  body {
    min-height: 100vh;
  }

  ::selection {
    color: ${({ theme }) => theme.colors.dark};
    background: ${({ theme }) => theme.colors.white};
  }

  #root {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  a {
    color: inherit;
  }

  button {
    text-align: left;
    outline: none;
    border-radius: 0.125rem;
  }

  button,
  input,
  select,
  textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    letter-spacing: inherit;
    text-rendering: inherit;
  }

  .rating_details {
    z-index: 1 !important;
    box-shadow: 0px 0px 0px 1px #11481e, 0px 1px 0px 2px #0d3817,
      0px 3px 3px 1px #0003 !important;
  }

  .rating_value span:first-child {
    color: ${({ theme }) => theme.colors.green} !important;
  }

  .rating_value span:not(:first-child) {
    color: rgba(255, 255, 255, 0.4) !important;
  }

  .p-overlaypanel {
    border-color: rgba(255, 255, 255, 0.4) !important;
  }

  .p-overlaypanel:before,
  .p-overlaypanel:after {
    border-width: 0 !important;
  }

  .p-overlaypanel-flipped {
    border-color: rgba(255, 255, 255, 0.4) !important;
    margin-top: -10px !important;
  }

  .p-overlaypanel-flipped:before {
    border-bottom-color: transparent !important;
    border-top-color: rgba(255, 255, 255, 0.4) !important;
  }

  .p-overlaypanel-logo {
    border: 1px solid rgba(255, 255, 255, 0.4) !important;
    border-radius: 6px !important;
    width: 32px !important;
    height: 32px !important;
  }

  .p-datatable-tbody a,
  .imdb-link {
    color: rgba(255, 255, 255, 0.87) !important;
    text-decoration: none !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.4) !important;
  }

  .p-sidebar {
    background: ${({ theme }) => theme.colors.dark} !important;
    color: ${({ theme }) => theme.colors.white} !important;
    box-shadow: 0.25rem 0 2rem rgba(0, 0, 0, 0.45) !important;
  }

  .p-sidebar .p-sidebar-header {
    display: none !important;
  }

  .p-sidebar .p-sidebar-content {
    padding: 0.75rem 1.25rem 1.25rem !important;
  }

  .p-sidebar-content h1,
  .p-sidebar-content h2,
  .p-sidebar-content button {
    color: #fff !important;
  }

  .p-sidebar-content h1 {
    font-size: 1.5em !important;
  }

  .p-sidebar-content h2 {
    font-size: 1.5em !important;
  }

  .p-sidebar-mask {
    background-color: rgba(0, 0, 0, 0.45) !important;
  }

  .p-sidebar-mask + .p-dialog-mask.p-component-overlay-enter {
    background-color: rgba(0, 0, 0, 0.4) !important;
  }

  .p-dialog-mask.p-component-overlay-enter {
    animation: unset !important;
    background-color: rgba(0, 0, 0, 0.95) !important;
  }
`;

export default GlobalStyle;
