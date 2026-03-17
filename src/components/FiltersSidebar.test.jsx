import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import FiltersSidebar from "./FiltersSidebar";
import renderWithTheme from "../test/renderWithTheme";

vi.mock("primereact/sidebar", () => ({
  Sidebar: ({ visible, children }) => (visible ? <div>{children}</div> : null),
}));

const baseDraftFilters = {
  apiBase: "",
  order: "desc",
  minimumRatings: "",
  minimumUsersRatingCount: "100",
  filteredSeasons: "",
  status: "",
  genres: "",
  networks: "",
  platforms: "",
  directors: "",
  productionCompanies: "",
  fromDate: "",
  toDate: "",
  limit: "20",
};

const renderSidebar = (overrides = {}, handlers = {}) =>
  renderWithTheme(
    <FiltersSidebar
      visible={true}
      draftFilters={{ ...baseDraftFilters, ...overrides }}
      onHide={handlers.onHide || vi.fn()}
      onChange={handlers.onChange || vi.fn()}
      onApply={handlers.onApply || vi.fn()}
      onReset={handlers.onReset || vi.fn()}
    />,
  );

describe("FiltersSidebar", () => {
  it("renders the flattened filter headings and omits removed sections and fields", () => {
    renderSidebar();

    expect(screen.getByRole("heading", { name: "Order" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Minimum votes" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Seasons" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Genres" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Platforms" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Results per page" }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "Sort" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Episodes" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "TV Shows" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Directors" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Production companies" }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Networks")).not.toBeInTheDocument();
  });

  it("renders the updated results per page options", () => {
    renderSidebar();

    expect(screen.getByRole("option", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "40" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "60" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "80" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "100" })).toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: "12" }),
    ).not.toBeInTheDocument();
  });

  it("toggles the seasons checkbox list with whatson naming", () => {
    const onChange = vi.fn();
    renderSidebar({}, { onChange });

    fireEvent.click(screen.getByRole("checkbox", { name: "5 and more" }));

    expect(onChange).toHaveBeenCalledWith(
      "filteredSeasons",
      "5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30",
    );
  });

  it("toggles genre and platform checkbox filters", () => {
    const onChange = vi.fn();
    renderSidebar({ genres: "Drama", platforms: "" }, { onChange });

    fireEvent.click(screen.getByRole("checkbox", { name: "Crime" }));
    fireEvent.click(screen.getByRole("checkbox", { name: "Netflix" }));

    expect(onChange).toHaveBeenNthCalledWith(1, "genres", "Drama,Crime");
    expect(onChange).toHaveBeenNthCalledWith(2, "platforms", "Netflix");
  });

  it("renders the checkbox-based platform list and keeps networks removed", () => {
    renderSidebar();

    expect(
      screen.getByRole("checkbox", { name: "Netflix" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Prime Video" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "Crunchyroll" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Networks")).not.toBeInTheDocument();
  });
});
