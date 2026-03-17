import React from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "styled-components";
import "minireset.css";
import "typeface-roboto";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-dark-teal/theme.css";
import App from "./App";
import GlobalStyle from "./styles/GlobalStyle";
import * as theme from "./theme";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element '#root' not found");
}

createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
