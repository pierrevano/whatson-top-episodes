import React from "react";
import { screen } from "@testing-library/react";
import Searchbar from "./Searchbar";
import renderWithTheme from "../test/renderWithTheme";

describe("Searchbar", () => {
  it("shows the discreet keyboard shortcut hint in the placeholder", () => {
    renderWithTheme(
      <Searchbar value="" onChange={() => {}} onClear={() => {}} />,
    );

    expect(
      screen.getByPlaceholderText("Search top rated episodes (⌘+K / Ctrl+K)"),
    ).toBeInTheDocument();
  });
});
