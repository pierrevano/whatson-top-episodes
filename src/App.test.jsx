import React from "react";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import App, { buildQueryString, normalizeFilters } from "./App";
import renderWithTheme from "./test/renderWithTheme";

vi.mock("./components/Navbar", () => ({
  default: ({ onOpenSidebar }) => (
    <button type="button" onClick={onOpenSidebar}>
      Open sidebar
    </button>
  ),
}));

vi.mock("./components/Searchbar", () => ({
  default: ({ value, onChange, onClear, inputRef }) => (
    <div>
      <input
        ref={inputRef}
        aria-label="Search episodes"
        placeholder="Search top rated episodes (⌘+K / Ctrl+K)"
        value={value}
        onChange={onChange}
      />
      <button type="button" onClick={onClear}>
        Clear search
      </button>
    </div>
  ),
}));

vi.mock("./components/FiltersSidebar", () => ({
  default: ({ visible, draftFilters, onHide, onChange, onApply, onReset }) =>
    visible ? (
      <div>
        <label>
          Order
          <select
            aria-label="Order"
            value={draftFilters.order}
            onChange={(event) => onChange("order", event.target.value)}
          >
            <option value="desc">Top rated</option>
            <option value="asc">Lowest rated</option>
          </select>
        </label>
        <label>
          Status
          <select
            aria-label="Status"
            value={draftFilters.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="">All</option>
            <option value="ended">Ended</option>
          </select>
        </label>
        <button type="button" onClick={onHide}>
          Hide filters
        </button>
        <button type="button" onClick={onApply}>
          Apply filters
        </button>
        <button type="button" onClick={onReset}>
          Reset filters
        </button>
      </div>
    ) : null,
}));

vi.mock("./components/EpisodeCard", () => ({
  default: ({ episode, loading, loadMore, onLoadMore }) => {
    if (loading) {
      return <div>Loading card</div>;
    }

    if (loadMore) {
      return (
        <button type="button" onClick={onLoadMore}>
          Load More
        </button>
      );
    }

    return (
      <div>{`${episode.tvshow?.title} - ${episode.title} - ${episode.tvshow?.status}`}</div>
    );
  },
}));

vi.mock("./components/Footer", () => ({
  default: () => <div>Footer</div>,
}));

vi.mock("./components/LoaderIcon", () => ({
  default: () => <div>Loader icon</div>,
}));

const createResponse = (payload, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: vi.fn().mockResolvedValue(payload),
});

const episode = ({
  tvshowId,
  showTitle,
  status = "ended",
  title,
  season = 1,
  number = 1,
}) => ({
  tvshow: {
    id: tvshowId,
    title: showTitle,
    status,
  },
  title,
  season,
  episode: number,
  release_date: "2024-01-01",
  users_rating: 9.1,
  users_rating_count: 1234,
  url: `https://example.com/${tvshowId}-${season}-${number}`,
});

describe("App", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("normalizes filter values and trims the api base", () => {
    expect(
      normalizeFilters({ apiBase: "https://example.com///" }).apiBase,
    ).toBe("https://example.com");
  });

  it("builds the rated episodes query string from filters", () => {
    const query = buildQueryString(
      {
        order: "asc",
        limit: "40",
        minimumRatings: "8.5",
        minimumUsersRatingCount: "500",
        filteredSeasons: "1,2",
        status: "ended",
        genres: "Drama",
        networks: "HBO",
        platforms: "Netflix",
        directors: "Jane Doe",
        productionCompanies: "Company",
        fromDate: "2024-01-01",
        toDate: "2024-12-31",
      },
      3,
      "pilot",
    );

    expect(query).toBe(
      "page=3&limit=40&order=asc&minimum_ratings=8.5&minimum_users_rating_count=500&filtered_seasons=1%2C2&status=ended&genres=Drama&networks=HBO&platforms=Netflix&directors=Jane+Doe&production_companies=Company&release_date=from%3A2024-01-01%2Cto%3A2024-12-31&title=pilot",
    );
  });

  it("shows the startup loader until the API status check succeeds, then loads the first page", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
          ],
        }),
      );

    renderWithTheme(<App />);

    expect(screen.getByText("Loader icon")).toBeInTheDocument();

    await screen.findByText("Alpha - Pilot - ended");

    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://whatson-api.onrender.com",
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://whatson-api.onrender.com/episodes/rated?page=1&limit=20&order=desc&minimum_users_rating_count=100",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(
      screen.getByText("1 loaded / 1 total", { exact: false }),
    ).toBeInTheDocument();
  });

  it("uses the API title search with a debounce and no minimum length gate", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 2,
          total_results: 3,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      );

    renderWithTheme(<App />);

    await screen.findByText("Alpha - Pilot - ended");
    expect(global.fetch).toHaveBeenCalledTimes(2);

    vi.useFakeTimers();

    fireEvent.change(screen.getByLabelText("Search episodes"), {
      target: { value: "f" },
    });

    act(() => {
      vi.advanceTimersByTime(349);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    vi.useRealTimers();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      "https://whatson-api.onrender.com/episodes/rated?page=1&limit=20&order=desc&minimum_users_rating_count=100&title=f",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    expect(screen.queryByText("Alpha - Pilot - ended")).not.toBeInTheDocument();
    expect(screen.getByText("Beta - Finale - ended")).toBeInTheDocument();
    expect(
      screen.getByText("1 loaded / 1 total", { exact: false }),
    ).toBeInTheDocument();
  });

  it("only sends the latest debounced search request when typing quickly", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 2,
          total_results: 3,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
          ],
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      );

    renderWithTheme(<App />);

    await screen.findByText("Alpha - Pilot - ended");

    vi.useFakeTimers();

    const searchInput = screen.getByLabelText("Search episodes");

    fireEvent.change(searchInput, { target: { value: "f" } });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.change(searchInput, { target: { value: "fi" } });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    fireEvent.change(searchInput, { target: { value: "fin" } });

    act(() => {
      vi.advanceTimersByTime(349);
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    vi.useRealTimers();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      "https://whatson-api.onrender.com/episodes/rated?page=1&limit=20&order=desc&minimum_users_rating_count=100&title=fin",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("resets to the unfiltered API results when the search is cleared", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 2,
          total_results: 3,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 2,
          total_results: 3,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      );

    renderWithTheme(<App />);

    await screen.findByText("Alpha - Pilot - ended");

    vi.useFakeTimers();

    fireEvent.change(screen.getByLabelText("Search episodes"), {
      target: { value: "f" },
    });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(350);
    });

    vi.useRealTimers();

    await screen.findByText("Beta - Finale - ended");

    fireEvent.click(screen.getByText("Clear search"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(4);
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      "https://whatson-api.onrender.com/episodes/rated?page=1&limit=20&order=desc&minimum_users_rating_count=100",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("focuses the search bar with ctrl+k and meta+k", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
          ],
        }),
      );

    renderWithTheme(<App />);

    await screen.findByText("Alpha - Pilot - ended");

    const searchInput = screen.getByLabelText("Search episodes");

    expect(searchInput).not.toHaveFocus();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(searchInput).toHaveFocus();

    searchInput.blur();
    expect(searchInput).not.toHaveFocus();

    fireEvent.keyDown(window, { key: "k", metaKey: true });
    expect(searchInput).toHaveFocus();
  });

  it("commits draft filters when the sidebar closes and refetches with the new params", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
          ],
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 1,
          total_results: 1,
          results: [
            episode({
              tvshowId: 2,
              showTitle: "Gamma",
              title: "Finale",
              status: "ended",
            }),
          ],
        }),
      );

    renderWithTheme(<App />);

    await screen.findByText("Alpha - Pilot - ended");

    fireEvent.click(screen.getByText("Open sidebar"));
    fireEvent.change(screen.getByLabelText("Order"), {
      target: { value: "asc" },
    });
    fireEvent.change(screen.getByLabelText("Status"), {
      target: { value: "ended" },
    });
    fireEvent.click(screen.getByText("Hide filters"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    expect(global.fetch).toHaveBeenLastCalledWith(
      "https://whatson-api.onrender.com/episodes/rated?page=1&limit=20&order=asc&minimum_users_rating_count=100&status=ended",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });

  it("loads the next page and appends the new episodes", async () => {
    global.fetch
      .mockResolvedValueOnce(createResponse({}, 200))
      .mockResolvedValueOnce(
        createResponse({
          page: 1,
          total_pages: 2,
          total_results: 2,
          results: [
            episode({ tvshowId: 1, showTitle: "Alpha", title: "Pilot" }),
          ],
        }),
      )
      .mockResolvedValueOnce(
        createResponse({
          page: 2,
          total_pages: 2,
          total_results: 2,
          results: [
            episode({ tvshowId: 2, showTitle: "Beta", title: "Finale" }),
          ],
        }),
      );

    renderWithTheme(<App />);

    await screen.findByText("Alpha - Pilot - ended");

    fireEvent.click(screen.getByText("Load More"));

    await screen.findByText("Beta - Finale - ended");

    expect(global.fetch).toHaveBeenLastCalledWith(
      "https://whatson-api.onrender.com/episodes/rated?page=2&limit=20&order=desc&minimum_users_rating_count=100",
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
  });
});
