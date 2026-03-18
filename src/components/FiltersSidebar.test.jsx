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
  minimumUsersRatingCount: "",
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

  it("renders the updated results per page chip options", () => {
    renderSidebar();

    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "40" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "60" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "80" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "100" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "12" }),
    ).not.toBeInTheDocument();
  });

  it("toggles the seasons chip list with whatson naming", () => {
    const onChange = vi.fn();
    renderSidebar({}, { onChange });

    fireEvent.click(screen.getByRole("button", { name: "5 and more" }));

    expect(onChange).toHaveBeenCalledWith(
      "filteredSeasons",
      "5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30",
    );
  });

  it("toggles genre and platform chip filters", () => {
    const onChange = vi.fn();
    renderSidebar({ genres: "Drama", platforms: "" }, { onChange });

    fireEvent.click(screen.getByRole("button", { name: "Crime" }));
    fireEvent.click(screen.getByRole("button", { name: "Netflix" }));

    expect(onChange).toHaveBeenNthCalledWith(1, "genres", "Drama,Crime");
    expect(onChange).toHaveBeenNthCalledWith(2, "platforms", "Netflix");
  });

  it("renders the chip-based platform list and keeps networks removed", () => {
    renderSidebar();

    expect(screen.getByRole("button", { name: "Netflix" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Prime Video" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crunchyroll" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Networks")).not.toBeInTheDocument();
  });

  it("toggles order, status and limit chips", () => {
    const onChange = vi.fn();
    renderSidebar({ order: "desc", status: "", limit: "20" }, { onChange });

    fireEvent.click(screen.getByRole("button", { name: "Lowest rated" }));
    fireEvent.click(screen.getByRole("button", { name: "Ended" }));
    fireEvent.click(screen.getByRole("button", { name: "80" }));

    expect(onChange).toHaveBeenNthCalledWith(1, "order", "asc");
    expect(onChange).toHaveBeenNthCalledWith(2, "status", "ended");
    expect(onChange).toHaveBeenNthCalledWith(3, "limit", "80");
  });

  it("supports multi-select status chips and clearing with All", () => {
    const onChange = vi.fn();
    renderSidebar({ status: "ended" }, { onChange });

    fireEvent.click(screen.getByRole("button", { name: "Ongoing" }));
    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(onChange).toHaveBeenNthCalledWith(1, "status", "ended,ongoing");
    expect(onChange).toHaveBeenNthCalledWith(2, "status", "");
  });
});
