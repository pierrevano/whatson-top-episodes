import React from "react";
import styled from "styled-components";
import { Sidebar } from "primereact/sidebar";

const SEASON_OPTIONS = [
  { label: "1", values: [1] },
  { label: "2", values: [2] },
  { label: "3", values: [3] },
  { label: "4", values: [4] },
  {
    label: "5 and more",
    values: Array.from({ length: 26 }, (_, index) => index + 5),
  },
];

const ORDER_OPTIONS = [
  { label: "Top rated", value: "desc" },
  { label: "Lowest rated", value: "asc" },
];

const STATUS_OPTIONS = [
  { label: "Ended", value: "ended" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Canceled", value: "canceled" },
  { label: "Pilot", value: "pilot" },
  { label: "Unknown", value: "unknown" },
];

const LIMIT_OPTIONS = ["20", "40", "60", "80", "100"];

const GENRE_OPTIONS = [
  "Drama",
  "Crime",
  "Mystery",
  "Sci-Fi & Fantasy",
  "Action & Adventure",
  "Comedy",
  "War & Politics",
  "Family",
  "Animation",
  "Western",
  "Soap",
  "Reality",
];

const PLATFORM_OPTIONS = [
  "Canal+ Ciné Séries",
  "Netflix",
  "Prime Video",
  "Max",
  "Disney+",
  "Paramount+",
  "Apple TV+",
  "Canal+",
  "OCS",
  "ADN",
  "Crunchyroll",
];

const parseSeasonValues = (value) =>
  String(value || "")
    .split(",")
    .map((item) => Number.parseInt(item.trim(), 10))
    .filter((item) => !Number.isNaN(item));

const buildSeasonValue = (seasonValues) =>
  [...new Set(seasonValues)].sort((first, second) => first - second).join(",");

const toggleSeasonFilter = (currentValue, optionValues) => {
  const currentValues = new Set(parseSeasonValues(currentValue));
  const optionIsSelected = optionValues.every((value) =>
    currentValues.has(value),
  );

  optionValues.forEach((value) => {
    if (optionIsSelected) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }
  });

  return buildSeasonValue([...currentValues]);
};

const parseStringValues = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildStringValue = (values) => [...new Set(values)].join(",");

const toggleStringFilter = (currentValue, optionValue) => {
  const currentValues = new Set(parseStringValues(currentValue));

  if (currentValues.has(optionValue)) {
    currentValues.delete(optionValue);
  } else {
    currentValues.add(optionValue);
  }

  return buildStringValue([...currentValues]);
};

const includesSeasonFilter = (value, optionValues) => {
  const currentValues = parseSeasonValues(value);
  return optionValues.every((optionValue) =>
    currentValues.includes(optionValue),
  );
};

const includesStringFilter = (value, optionValue) =>
  parseStringValues(value).includes(optionValue);

const CloseButton = styled.button`
  background: none;
  border: none;
  color: currentColor;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.5rem;
  line-height: 1;
`;

const Section = styled.section`
  margin-top: 1.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;
`;

const Chip = styled.button`
  background: ${(p) =>
    p.$active ? p.theme.colors.green : p.theme.colors.grey};
  border: 1px solid
    ${(p) => (p.$active ? p.theme.colors.green : p.theme.colors.midGrey)};
  color: ${(p) => p.theme.colors.white};
  border-radius: 999px;
  padding: ${(p) => (p.$compact ? "0.48rem 0.72rem" : "0.55rem 0.875rem")};
  cursor: pointer;
  line-height: 1.2;
  font-size: ${(p) => (p.$compact ? "0.92rem" : "1rem")};
  white-space: ${(p) => (p.$compact ? "nowrap" : "normal")};
  max-width: 100%;
  text-align: center;
  flex: ${(p) => (p.$fill ? "1 1 0" : "0 1 auto")};

  @media (max-width: 28rem) {
    padding: ${(p) => (p.$compact ? "0.42rem 0.64rem" : "0.5rem 0.78rem")};
    font-size: ${(p) => (p.$compact ? "0.86rem" : "0.95rem")};
  }

  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const LimitChip = styled(Chip)`
  font-size: 0.9rem;
  white-space: nowrap;

  @media (max-width: 28rem) {
    font-size: 0.85rem;
  }
`;

const FieldTitle = styled.h1`
  margin: 0 0 0.6rem;
  line-height: 1.2;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1.35rem;
  margin-bottom: 0.85rem;
  color: ${(p) => p.theme.colors.lightGrey};
  font-size: 1rem;
  line-height: 1.5rem;

  &:first-of-type {
    margin-top: 0;
  }

  & input {
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${(p) => p.theme.colors.white};
    background: ${(p) => p.theme.colors.grey};
    border: 1px solid ${(p) => p.theme.colors.midGrey};
    border-radius: 0.25rem;
    min-height: 2.75rem;
    padding: 0 0.85rem;
  }

  & input::placeholder {
    color: ${(p) => p.theme.colors.lightGrey};
    opacity: 1;
  }
`;

const FieldBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-top: 1.35rem;
  margin-bottom: 1.35rem;
  color: ${(p) => p.theme.colors.lightGrey};
  font-size: 1rem;
  line-height: 1.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: ${(p) =>
    p.variant === "primary" ? p.theme.colors.green : p.theme.colors.grey};
  color: ${(p) => p.theme.colors.white};
  border: 1px solid
    ${(p) =>
      p.variant === "primary" ? p.theme.colors.green : p.theme.colors.midGrey};
  min-height: 2.8rem;
  padding: 0.65rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const FiltersSidebar = ({
  visible,
  draftFilters,
  onHide,
  onChange,
  onApply,
  onReset,
}) => (
  <Sidebar
    visible={visible}
    onHide={onHide}
    position="left"
    showCloseIcon={false}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "0.25rem",
        paddingTop: "1rem",
      }}
    >
      <CloseButton type="button" onClick={onHide} aria-label="Close filters">
        ×
      </CloseButton>
    </div>

    <Section>
      <FieldBlock>
        <FieldTitle>
          <strong>Order</strong>
        </FieldTitle>
        <ChipGroup>
          {ORDER_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              type="button"
              $fill
              $active={draftFilters.order === option.value}
              aria-pressed={draftFilters.order === option.value}
              onClick={() => onChange("order", option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </ChipGroup>
      </FieldBlock>

      <Field>
        <FieldTitle>
          <strong>Minimum rating</strong>
        </FieldTitle>
        <input
          value={draftFilters.minimumRatings}
          onChange={(event) => onChange("minimumRatings", event.target.value)}
          placeholder="8.5"
          type="number"
          min="0"
          max="10"
          step="0.1"
        />
      </Field>

      <Field>
        <FieldTitle>
          <strong>Minimum votes</strong>
        </FieldTitle>
        <input
          value={draftFilters.minimumUsersRatingCount}
          onChange={(event) =>
            onChange("minimumUsersRatingCount", event.target.value)
          }
          placeholder="100"
          type="number"
          min="0"
          step="1"
        />
      </Field>
    </Section>

    <Section>
      <FieldBlock>
        <FieldTitle>
          <strong>Seasons</strong>
        </FieldTitle>
        <ChipGroup>
          {SEASON_OPTIONS.map((option) => (
            <Chip
              key={option.label}
              type="button"
              $compact
              $active={includesSeasonFilter(
                draftFilters.filteredSeasons,
                option.values,
              )}
              aria-pressed={includesSeasonFilter(
                draftFilters.filteredSeasons,
                option.values,
              )}
              onClick={() =>
                onChange(
                  "filteredSeasons",
                  toggleSeasonFilter(
                    draftFilters.filteredSeasons,
                    option.values,
                  ),
                )
              }
            >
              {option.label}
            </Chip>
          ))}
        </ChipGroup>
      </FieldBlock>

      <Field>
        <FieldTitle>
          <strong>From date</strong>
        </FieldTitle>
        <input
          value={draftFilters.fromDate}
          onChange={(event) => onChange("fromDate", event.target.value)}
          placeholder="YYYY-MM-DD"
          type="date"
        />
      </Field>

      <Field>
        <FieldTitle>
          <strong>To date</strong>
        </FieldTitle>
        <input
          value={draftFilters.toDate}
          onChange={(event) => onChange("toDate", event.target.value)}
          placeholder="YYYY-MM-DD"
          type="date"
        />
      </Field>
    </Section>

    <Section>
      <FieldBlock>
        <FieldTitle>
          <strong>Status</strong>
        </FieldTitle>
        <ChipGroup>
          {STATUS_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              type="button"
              $active={includesStringFilter(draftFilters.status, option.value)}
              aria-pressed={includesStringFilter(
                draftFilters.status,
                option.value,
              )}
              onClick={() =>
                onChange(
                  "status",
                  toggleStringFilter(draftFilters.status, option.value),
                )
              }
            >
              {option.label}
            </Chip>
          ))}
        </ChipGroup>
      </FieldBlock>

      <FieldBlock>
        <FieldTitle>
          <strong>Genres</strong>
        </FieldTitle>
        <ChipGroup>
          {GENRE_OPTIONS.map((genre) => (
            <Chip
              key={genre}
              type="button"
              $active={includesStringFilter(draftFilters.genres, genre)}
              aria-pressed={includesStringFilter(draftFilters.genres, genre)}
              onClick={() =>
                onChange(
                  "genres",
                  toggleStringFilter(draftFilters.genres, genre),
                )
              }
            >
              {genre}
            </Chip>
          ))}
        </ChipGroup>
      </FieldBlock>

      <FieldBlock>
        <FieldTitle>
          <strong>Platforms</strong>
        </FieldTitle>
        <ChipGroup>
          {PLATFORM_OPTIONS.map((platform) => (
            <Chip
              key={platform}
              type="button"
              $active={includesStringFilter(draftFilters.platforms, platform)}
              aria-pressed={includesStringFilter(
                draftFilters.platforms,
                platform,
              )}
              onClick={() =>
                onChange(
                  "platforms",
                  toggleStringFilter(draftFilters.platforms, platform),
                )
              }
            >
              {platform}
            </Chip>
          ))}
        </ChipGroup>
      </FieldBlock>
    </Section>

    <Actions>
      <FieldBlock style={{ marginTop: 0, marginBottom: "1.1rem" }}>
        <FieldTitle>
          <strong>Results per page</strong>
        </FieldTitle>
        <ChipGroup>
          {LIMIT_OPTIONS.map((value) => (
            <LimitChip
              key={value}
              type="button"
              $active={draftFilters.limit === value}
              aria-pressed={draftFilters.limit === value}
              onClick={() => onChange("limit", value)}
            >
              {value}
            </LimitChip>
          ))}
        </ChipGroup>
      </FieldBlock>

      <Button type="button" variant="primary" onClick={onApply}>
        Apply filters
      </Button>
      <Button type="button" onClick={onReset}>
        Reset
      </Button>
    </Actions>
  </Sidebar>
);

export default FiltersSidebar;
