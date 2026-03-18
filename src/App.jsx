import React, { Fragment, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Navbar from "./components/Navbar";
import Searchbar from "./components/Searchbar";
import Container from "./components/Container";
import EpisodeCard from "./components/EpisodeCard";
import FiltersSidebar from "./components/FiltersSidebar";
import Footer from "./components/Footer";
import LoaderIcon from "./components/LoaderIcon";

const STORAGE_KEY = "whatson-top-episodes-preferences";
const SEARCH_KEY = "whatson-top-episodes-search";
const DEFAULT_API_BASE = "https://whatson-api.onrender.com";
const SEARCH_DEBOUNCE_MS = 350;

export const defaultFilters = {
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

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const SearchbarWrap = styled(Searchbar)`
  position: sticky;
  top: 0.875rem;
  z-index: 3;
`;

const CardsGrid = styled.div`
  margin-top: 0;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
  display: grid;
  gap: 1.15rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (min-width: 30rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 48rem) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 62rem) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 80rem) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
`;

const MetaRow = styled.div`
  padding: 0 1rem;
  margin-top: 1.25rem;
  margin-bottom: 1.25rem;
  color: ${(p) => p.theme.colors.lightGrey};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ErrorScreen = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border-radius: 0.25rem;
  background: ${(p) => p.theme.colors.grey};
  color: ${(p) => p.theme.colors.white};
`;

const getStoredJSON = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (_error) {
    return fallback;
  }
};

export const normalizeFilters = (filters) => ({
  ...defaultFilters,
  ...filters,
  apiBase: String(filters?.apiBase || "")
    .trim()
    .replace(/\/+$/, ""),
  minimumUsersRatingCount:
    String(filters?.minimumUsersRatingCount || "").trim() === "100"
      ? ""
      : String(filters?.minimumUsersRatingCount || "").trim(),
});

export const buildQueryString = (filters, page, titleQuery = "") => {
  const params = new URLSearchParams();

  params.set("page", String(page));
  params.set("limit", filters.limit || defaultFilters.limit);
  params.set("order", filters.order || defaultFilters.order);

  if (filters.minimumRatings) {
    params.set("minimum_ratings", filters.minimumRatings);
  }

  if (filters.minimumUsersRatingCount) {
    params.set("minimum_users_rating_count", filters.minimumUsersRatingCount);
  }

  if (filters.filteredSeasons) {
    params.set("filtered_seasons", filters.filteredSeasons);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  if (filters.genres) {
    params.set("genres", filters.genres);
  }

  if (filters.networks) {
    params.set("networks", filters.networks);
  }

  if (filters.platforms) {
    params.set("platforms", filters.platforms);
  }

  if (filters.directors) {
    params.set("directors", filters.directors);
  }

  if (filters.productionCompanies) {
    params.set("production_companies", filters.productionCompanies);
  }

  const dateFilters = [];

  if (filters.fromDate) {
    dateFilters.push(`from:${filters.fromDate}`);
  }

  if (filters.toDate) {
    dateFilters.push(`to:${filters.toDate}`);
  }

  if (dateFilters.length) {
    params.set("release_date", dateFilters.join(","));
  }

  if (String(titleQuery || "").trim()) {
    params.set("title", String(titleQuery).trim());
  }

  return params.toString();
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value) || 0);

const filtersAreEqual = (firstFilters, secondFilters) =>
  JSON.stringify(normalizeFilters(firstFilters)) ===
  JSON.stringify(normalizeFilters(secondFilters));

const App = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [filters, setFilters] = useState(() =>
    normalizeFilters(getStoredJSON(STORAGE_KEY, defaultFilters)),
  );
  const [draftFilters, setDraftFilters] = useState(() =>
    normalizeFilters(getStoredJSON(STORAGE_KEY, defaultFilters)),
  );
  const [search, setSearch] = useState(
    () => window.localStorage.getItem(SEARCH_KEY) || "",
  );
  const [searchQuery, setSearchQuery] = useState(() =>
    (window.localStorage.getItem(SEARCH_KEY) || "").trim(),
  );
  const [episodes, setEpisodes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [apiStatusLoading, setApiStatusLoading] = useState(true);
  const [error, setError] = useState("");
  const requestIdRef = useRef(0);
  const abortControllerRef = useRef(null);
  const searchInputRef = useRef(null);

  const loadEpisodes = async (
    nextFilters,
    nextPage,
    reset = false,
    titleQuery = searchQuery,
  ) => {
    const requestId = ++requestIdRef.current;
    const apiBase = nextFilters.apiBase || DEFAULT_API_BASE;
    const queryString = buildQueryString(nextFilters, nextPage, titleQuery);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiBase}/episodes/rated?${queryString}`, {
        signal: controller.signal,
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || `Request failed with status ${response.status}.`,
        );
      }

      if (requestId !== requestIdRef.current) {
        return;
      }

      setEpisodes((previous) =>
        reset
          ? payload.results || []
          : [...previous, ...(payload.results || [])],
      );
      setPage(Number(payload.page) || nextPage);
      setTotalPages(Number(payload.total_pages) || 0);
      setTotalResults(Number(payload.total_results) || 0);
    } catch (fetchError) {
      if (fetchError.name === "AbortError") {
        return;
      }

      if (requestId === requestIdRef.current) {
        setError(fetchError.message || "Unable to load rated episodes.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const checkAPIStatus = async () => {
      try {
        const response = await fetch(filters.apiBase || DEFAULT_API_BASE);

        if (response.status === 200) {
          setApiStatusLoading(false);
        }
      } catch (_error) {
        setApiStatusLoading(false);
      }
    };

    checkAPIStatus();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (apiStatusLoading) {
      return;
    }

    loadEpisodes(filters, 1, true, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiStatusLoading, searchQuery]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    window.localStorage.setItem(SEARCH_KEY, search);
  }, [search]);

  useEffect(() => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      setSearchQuery("");
      return undefined;
    }

    const timeout = window.setTimeout(() => {
      setSearchQuery(trimmedSearch);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    document.title =
      filters.order === "asc"
        ? "What's on? API - Lowest rated episodes"
        : "What's on? API - Top rated episodes";
  }, [filters.order]);

  useEffect(() => {
    const focusSearchWithShortcut = (event) => {
      const target = event.target;
      const isTypingTarget =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      if (isTypingTarget) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", focusSearchWithShortcut);

    return () => {
      window.removeEventListener("keydown", focusSearchWithShortcut);
    };
  }, []);

  const commitFilters = (nextFilters, { closeSidebar = true } = {}) => {
    const normalizedFilters = normalizeFilters(nextFilters);

    setDraftFilters(normalizedFilters);
    setFilters(normalizedFilters);

    if (closeSidebar) {
      setSidebarVisible(false);
    }

    loadEpisodes(normalizedFilters, 1, true, searchQuery);
  };

  const handleDraftChange = (key, value) => {
    setDraftFilters((previous) => ({
      ...previous,
      [key]:
        key === "apiBase" ? String(value).trim().replace(/\/+$/, "") : value,
    }));
  };

  const applyFilters = () => {
    commitFilters(draftFilters);
  };

  const handleSidebarHide = () => {
    const hasPendingChanges = !filtersAreEqual(filters, draftFilters);

    setSidebarVisible(false);

    if (hasPendingChanges) {
      commitFilters(draftFilters, { closeSidebar: false });
    }
  };

  const resetFilters = () => {
    commitFilters(defaultFilters);
  };

  const loadMore = () => {
    if (loading || page >= totalPages) {
      return;
    }

    loadEpisodes(filters, page + 1, false, searchQuery);
  };

  if (apiStatusLoading) {
    return <LoaderIcon />;
  }

  return (
    <Fragment>
      <Navbar onOpenSidebar={() => setSidebarVisible(true)} />
      <Main>
        <FiltersSidebar
          visible={sidebarVisible}
          draftFilters={draftFilters}
          onHide={handleSidebarHide}
          onChange={handleDraftChange}
          onApply={applyFilters}
          onReset={resetFilters}
        />

        <SearchbarWrap
          inputRef={searchInputRef}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onClear={() => setSearch("")}
        />

        <Container>
          <MetaRow>
            <span>
              {formatNumber(episodes.length)} loaded /{" "}
              {formatNumber(totalResults)} total
            </span>
          </MetaRow>

          {error ? <ErrorScreen>{error}</ErrorScreen> : null}

          <CardsGrid>
            {loading && episodes.length === 0
              ? Array.from({ length: 12 }, (_, index) => (
                  <EpisodeCard key={`loading-${index}`} loading />
                ))
              : episodes.map((episode) => (
                  <EpisodeCard
                    key={`${episode.tvshow?.id}-${episode.season}-${episode.episode}`}
                    episode={episode}
                  />
                ))}

            {!loading && page < totalPages ? (
              <EpisodeCard loadMore onLoadMore={loadMore} />
            ) : null}
          </CardsGrid>
        </Container>
      </Main>
      <Footer />
    </Fragment>
  );
};

export default App;
