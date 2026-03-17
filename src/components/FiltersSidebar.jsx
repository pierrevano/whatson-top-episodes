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

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 0.25rem;
`;

const CheckboxRow = styled.label`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.colors.white};
  cursor: pointer;
`;

const Checkbox = styled.input`
  width: 1.1rem;
  height: 1.1rem;
  margin: 0 0.65rem 0 0;
  accent-color: ${(p) => p.theme.colors.green};
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

  & input:not([type="checkbox"]),
  & select {
    font-size: 1rem;
    line-height: 1.5rem;
    color: ${(p) => p.theme.colors.white};
    background: ${(p) => p.theme.colors.grey};
    border: 1px solid ${(p) => p.theme.colors.midGrey};
    border-radius: 0.25rem;
    min-height: 2.75rem;
    padding: 0 0.85rem;
  }

  & select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding-right: 3rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.25L6 6.25L11 1.25' fill='none' stroke='%23FFFFFF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 12px 8px;
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
}) => {
  const selectedSeasons = parseSeasonValues(draftFilters.filteredSeasons);
  const selectedGenres = parseStringValues(draftFilters.genres);
  const selectedPlatforms = parseStringValues(draftFilters.platforms);

  return (
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
        }}
      >
        <CloseButton type="button" onClick={onHide} aria-label="Close filters">
          ×
        </CloseButton>
      </div>

      <Section>
        <Field>
          <FieldTitle>
            <strong>Order</strong>
          </FieldTitle>
          <select
            value={draftFilters.order}
            onChange={(event) => onChange("order", event.target.value)}
          >
            <option value="desc">Top rated</option>
            <option value="asc">Lowest rated</option>
          </select>
        </Field>
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
        <Field>
          <FieldTitle>
            <strong>Seasons</strong>
          </FieldTitle>
          <CheckboxGroup>
            {SEASON_OPTIONS.map((option) => (
              <CheckboxRow key={option.label}>
                <Checkbox
                  type="checkbox"
                  checked={option.values.every((value) =>
                    selectedSeasons.includes(value),
                  )}
                  onChange={() =>
                    onChange(
                      "filteredSeasons",
                      toggleSeasonFilter(
                        draftFilters.filteredSeasons,
                        option.values,
                      ),
                    )
                  }
                />
                <span>{option.label}</span>
              </CheckboxRow>
            ))}
          </CheckboxGroup>
        </Field>
        <Field>
          <FieldTitle>
            <strong>From date</strong>
          </FieldTitle>
          <input
            value={draftFilters.fromDate}
            onChange={(event) => onChange("fromDate", event.target.value)}
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
            type="date"
          />
        </Field>
      </Section>

      <Section>
        <Field>
          <FieldTitle>
            <strong>Status</strong>
          </FieldTitle>
          <select
            value={draftFilters.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="">All</option>
            <option value="ended">Ended</option>
            <option value="ongoing">Ongoing</option>
            <option value="canceled">Canceled</option>
            <option value="pilot">Pilot</option>
            <option value="unknown">Unknown</option>
          </select>
        </Field>
        <Field>
          <FieldTitle>
            <strong>Genres</strong>
          </FieldTitle>
          <CheckboxGroup>
            {GENRE_OPTIONS.map((genre) => (
              <CheckboxRow key={genre}>
                <Checkbox
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() =>
                    onChange(
                      "genres",
                      toggleStringFilter(draftFilters.genres, genre),
                    )
                  }
                />
                <span>{genre}</span>
              </CheckboxRow>
            ))}
          </CheckboxGroup>
        </Field>
        <Field>
          <FieldTitle>
            <strong>Platforms</strong>
          </FieldTitle>
          <CheckboxGroup>
            {PLATFORM_OPTIONS.map((platform) => (
              <CheckboxRow key={platform}>
                <Checkbox
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform)}
                  onChange={() =>
                    onChange(
                      "platforms",
                      toggleStringFilter(draftFilters.platforms, platform),
                    )
                  }
                />
                <span>{platform}</span>
              </CheckboxRow>
            ))}
          </CheckboxGroup>
        </Field>
      </Section>

      <Actions>
        <Section style={{ marginTop: 0, marginBottom: "0.75rem" }}>
          <Field style={{ marginBottom: 0 }}>
            <FieldTitle>
              <strong>Results per page</strong>
            </FieldTitle>
            <select
              value={draftFilters.limit}
              onChange={(event) => onChange("limit", event.target.value)}
            >
              <option value="20">20</option>
              <option value="40">40</option>
              <option value="60">60</option>
              <option value="80">80</option>
              <option value="100">100</option>
            </select>
          </Field>
        </Section>
        <Button type="button" variant="primary" onClick={onApply}>
          Apply filters
        </Button>
        <Button type="button" onClick={onReset}>
          Reset
        </Button>
      </Actions>
    </Sidebar>
  );
};

export default FiltersSidebar;
