import React from "react";
import { render } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import * as theme from "../theme";

const renderWithTheme = (ui) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

export default renderWithTheme;
