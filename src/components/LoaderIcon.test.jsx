import React from "react";
import { act, screen } from "@testing-library/react";
import LoaderIcon from "./LoaderIcon";
import renderWithTheme from "../test/renderWithTheme";

describe("LoaderIcon", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the logo loader and advances the progress value over time", () => {
    renderWithTheme(<LoaderIcon />);

    const progressBar = screen.getByRole("progressbar");

    expect(screen.getByAltText("Loading")).toBeInTheDocument();
    expect(progressBar).toHaveAttribute("aria-valuenow", "0");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(Number(progressBar.getAttribute("aria-valuenow"))).toBeGreaterThan(
      0,
    );
  });
});
