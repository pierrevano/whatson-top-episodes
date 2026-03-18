import React from "react";
import { fireEvent, screen } from "@testing-library/react";
import EpisodeCard, { formatReleaseDate, formatVotes } from "./EpisodeCard";
import renderWithTheme from "../test/renderWithTheme";
import { RATING_BADGE_GREEN_BOX_SHADOW } from "../styles/GlobalStyle";

describe("EpisodeCard", () => {
  it("formats release dates as yyyy-mm-dd", () => {
    expect(formatReleaseDate("2024-05-03T12:30:00.000Z")).toBe("2024-05-03");
    expect(formatReleaseDate("")).toBe("Unknown date");
  });

  it("formats vote counts with separators", () => {
    expect(formatVotes(12345)).toBe("12,345");
  });

  it("renders episode metadata with the formatted date", () => {
    renderWithTheme(
      <EpisodeCard
        episode={{
          tvshow: {
            id: 1,
            title: "Alpha",
            status: "Ended",
            image: "",
          },
          title: "Pilot",
          season: 2,
          episode: 3,
          release_date: "2024-05-03T12:30:00.000Z",
          users_rating: 9.5,
          users_rating_count: 12345,
          url: "https://example.com/episode",
        }}
      />,
    );

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Pilot")).toBeInTheDocument();
    expect(screen.getByText("S02E03 · 2024-05-03")).toBeInTheDocument();
    expect(screen.getByText("12,345 votes · Ended")).toBeInTheDocument();
    expect(screen.getByText("9.5")).toBeInTheDocument();
  });

  it("renders up to three network values before the status", () => {
    renderWithTheme(
      <EpisodeCard
        episode={{
          tvshow: {
            id: 1,
            title: "Alpha",
            status: "Ended",
            image: "",
            networks: ["HBO", "Max", "Canal+", "Netflix"],
          },
          title: "Pilot",
          season: 2,
          episode: 3,
          release_date: "2024-05-03T12:30:00.000Z",
          users_rating: 9.5,
          users_rating_count: 12345,
          url: "https://example.com/episode",
        }}
      />,
    );

    expect(
      screen.getByText("12,345 votes · HBO, Max, Canal+ · Ended"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Netflix/)).not.toBeInTheDocument();
  });

  it("renders network names when the API returns network objects", () => {
    renderWithTheme(
      <EpisodeCard
        episode={{
          tvshow: {
            id: 1,
            title: "Alpha",
            status: "Ended",
            image: "",
            networks: [{ name: "HBO" }, { name: "Max" }],
          },
          title: "Pilot",
          season: 2,
          episode: 3,
          release_date: "2024-05-03T12:30:00.000Z",
          users_rating: 9.5,
          users_rating_count: 12345,
          url: "https://example.com/episode",
        }}
      />,
    );

    expect(
      screen.getByText("12,345 votes · HBO, Max · Ended"),
    ).toBeInTheDocument();
  });

  it("fires the load more action from the load more card", () => {
    const onLoadMore = vi.fn();

    renderWithTheme(<EpisodeCard loadMore onLoadMore={onLoadMore} />);

    fireEvent.click(screen.getByRole("button", { name: "Load More" }));

    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it("keeps the green rating badge treatment wired through the card and global styles", () => {
    const { container } = renderWithTheme(
      <EpisodeCard
        episode={{
          tvshow: {
            id: 1,
            title: "Alpha",
            status: "Ended",
            image: "",
          },
          title: "Pilot",
          season: 2,
          episode: 3,
          release_date: "2024-05-03T12:30:00.000Z",
          users_rating: 9.5,
          users_rating_count: 12345,
          url: "https://example.com/episode",
        }}
      />,
    );

    expect(container.querySelector(".rating_details")).toBeInTheDocument();
    expect(RATING_BADGE_GREEN_BOX_SHADOW).toContain("#11481e");
    expect(RATING_BADGE_GREEN_BOX_SHADOW).toContain("#0d3817");
  });
});
