<p align="center">
  <img src="./logo.png" alt="What's on? logo" width="90" />
</p>

<h1 align="center">What's on? API - Top rated episodes</h1>

Powered by [What's on? API](https://github.com/pierrevano/whatson-api)

---

What's on? API - Top rated episodes is a project built around the `GET /episodes/rated` endpoint from [What's on? API](https://github.com/pierrevano/whatson-api).

It surfaces the highest or lowest rated episodes.

You can also see it live at [whatson-top-episodes.vercel.app](https://whatson-top-episodes.vercel.app/).

## Homepage

The homepage displays top rated episodes by default.

Each card is built from the rated episodes response and shows:

- TV show title
- Episode title
- Season and episode number
- Release date
- IMDb user rating
- IMDb user rating count
- TV show networks
- TV show status

## Filters

The left menu applies directly to `GET /episodes/rated`.

Available filters:

- Order
- Minimum rating
- Minimum votes
- Seasons
- From date
- To date
- Status
- Genres
- Platforms
- Results per page

## Search

The sticky search bar helps you find a show or episode quickly.

As you type, the results update automatically after a short pause.

Search behavior:

- searches across the full rated episodes list
- keeps the current search when you change filters or load more results
- goes back to the default list when the search is cleared
- supports the keyboard shortcut `⌘+K / Ctrl+K` to jump to the search bar quickly
