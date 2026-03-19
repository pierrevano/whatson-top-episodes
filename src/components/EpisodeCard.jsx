import React from "react";
import styled, { css } from "styled-components";
import AspectRatio from "./AspectRatio";
import Text from "./Text";

const Wrapper = styled.div`
  background: none;
  border: none;
  margin: 0;
  flex: 1;
  display: flex;
  position: relative;
  background: ${(p) =>
    p.$loading ? p.theme.colors.midGrey : p.theme.colors.grey};
  border-radius: 0.1875rem;
  cursor: pointer;

  ${(p) =>
    p.$loading &&
    css`
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.08) 50%,
          transparent 100%
        );
        transform: translateX(-100%);
        animation: shimmer 1.6s infinite;
      }
    `}

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
`;

const fill = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Anchor = styled.a`
  appearance: none;
  width: 100%;
  color: currentColor;
  display: block;
  border-radius: 0.1875rem;
  z-index: 1;
  text-decoration: none;
  ${fill}

  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const AbsoluteFill = styled.div`
  ${fill}
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  pointer-events: none;
`;

const OverflowHidden = styled(AbsoluteFill)`
  overflow: hidden;
  border-radius: 0.1875rem;
`;

const Poster = styled.img`
  display: block;
  min-height: 100%;
  width: 100%;
  object-fit: cover;
  transition: 0.2s all;
`;

const NoImage = styled.div`
  ${fill}
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(p) => p.theme.colors.midGrey};
`;

const Overlay = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  background: ${(p) => p.theme.colors.overlay};
  box-shadow: 0 0.25rem 2rem 0 rgba(5, 10, 13, 0.3);
  border-radius: 0 0 0.1875rem 0.1875rem;
  z-index: 1;
`;

const OverlayRatings = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  background: none;
  box-shadow: 0 0.25rem 2rem 0 rgba(5, 10, 13, 0.3);
  border-radius: 0 0 0.1875rem 0.1875rem;

  @media (hover: hover) {
    border-radius: 0.1875rem;
    height: 100%;
    background: none;
    box-shadow: none;
  }

  ${Wrapper}:hover &,
  ${Wrapper}:focus-within & {
    background: none;
    box-shadow: 0 0.25rem 2rem 0 rgba(5, 10, 13, 0.3);
  }

  z-index: 2;
`;

const Info = styled.div`
  color: currentColor;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  padding: 0.75rem;
  overflow: hidden;
  opacity: 1;
`;

const InfoRatings = styled.div`
  color: currentColor;
  position: absolute;
  top: 0;
  background: #181818;
  border-radius: 24px;
  margin: 0.6rem;
  padding: 5px;
  width: 60px;
  text-align: center;
  font-weight: bold;
  z-index: 2;
`;

const Title = styled(Text)`
  font-weight: 500;
  margin-bottom: 0.2rem;
`;

const EpisodeMeta = styled(Text)`
  color: ${(p) => p.theme.colors.lightGrey};
`;

const LoadMore = styled.div`
  text-align: center;
  margin: auto;
  color: ${(p) => p.theme.colors.lightGrey};
  font-weight: 500;
`;

export const formatVotes = (value) =>
  new Intl.NumberFormat("en-US").format(Number(value) || 0);

export const formatReleaseDate = (value) => {
  if (typeof value !== "string" || !value) {
    return "Unknown date";
  }

  const matchedDate = value.match(/\d{4}-\d{2}-\d{2}/);
  return matchedDate ? matchedDate[0] : value;
};

const formatNetworks = (value) => {
  if (!value) {
    return null;
  }

  const limitNetworks = (items) => items.filter(Boolean).slice(0, 3).join(", ");

  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value)) {
    return limitNetworks(
      value.map((item) => {
        if (typeof item === "string") {
          return item;
        }

        if (typeof item?.name === "string") {
          return item.name;
        }

        return null;
      }),
    );
  }

  if (typeof value?.name === "string") {
    return value.name;
  }

  return null;
};

const EpisodeCard = ({
  episode,
  loading = false,
  loadMore = false,
  onLoadMore,
}) => {
  if (loadMore) {
    return (
      <Wrapper
        onClick={onLoadMore}
        role="button"
        tabIndex={0}
        aria-label="Load More"
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onLoadMore?.();
          }
        }}
      >
        <AspectRatio ratio={0.75} />
        <AbsoluteFill>
          <LoadMore>
            Load
            <br />
            More
          </LoadMore>
        </AbsoluteFill>
      </Wrapper>
    );
  }

  if (loading) {
    return (
      <Wrapper $loading>
        <AspectRatio ratio={0.75} />
      </Wrapper>
    );
  }

  const tvshowTitle = episode?.tvshow?.title || "Unknown TV show";
  const episodeTitle = episode?.title || "Untitled episode";
  const image = episode?.tvshow?.image || "";
  const networks = formatNetworks(episode?.tvshow?.networks);
  const seasonEpisode = `S${String(episode?.season || 0).padStart(2, "0")}E${String(
    episode?.episode || 0,
  ).padStart(2, "0")}`;

  return (
    <Wrapper>
      <AspectRatio ratio={0.75} />
      <Anchor
        href={episode?.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`poster for: ${tvshowTitle} ${episodeTitle}`}
      />
      <OverflowHidden>
        {image ? (
          <Poster src={image} alt={`poster for: ${tvshowTitle}`} />
        ) : null}
      </OverflowHidden>
      <AbsoluteFill>
        {!image && (
          <NoImage>
            <span>TV</span>
          </NoImage>
        )}
        <Overlay>
          <Info>
            <Title xs={0}>{tvshowTitle}</Title>
            <EpisodeMeta xs={0}>{episodeTitle}</EpisodeMeta>
            <EpisodeMeta xs={0}>
              {seasonEpisode} · {formatReleaseDate(episode?.release_date)}
            </EpisodeMeta>
            <EpisodeMeta xs={0}>
              {formatVotes(episode?.users_rating_count)} votes ·{" "}
              {networks ? `${networks} · ` : ""}
              {episode?.tvshow?.status || "Unknown"}
            </EpisodeMeta>
          </Info>
          <div />
        </Overlay>
        <OverlayRatings>
          {typeof episode?.users_rating === "number" && (
            <InfoRatings className="rating_details">
              <span style={{ color: "#28A745" }}>★</span>{" "}
              {episode.users_rating.toFixed(1)}
            </InfoRatings>
          )}
        </OverlayRatings>
      </AbsoluteFill>
    </Wrapper>
  );
};

export default EpisodeCard;
