# Detroit Developers Website

Static site for the [Detroit Software Developers](https://www.meetup.com/detroit-software-developers/) meetup — a monthly community of 750+ developers. Built with Eleventy (11ty) and deployed to GitHub Pages at [detroitdevelopers.com](https://detroitdevelopers.com).

## Commands

```bash
npm run dev      # Dev server at localhost:8080 with live reload
npm run build    # Build to _site/
npm run deploy   # Bump version, build, push to gh-pages branch
```

## Project Structure

```
src/
├── _data/           # Global data available to all templates
│   ├── site.json    # Site metadata (title, URLs, social links)
│   ├── buildInfo.json  # Auto-managed build number & timestamp
│   ├── meetup.js    # Fetches upcoming events from Meetup GraphQL API
│   └── upcoming.json   # Fallback if Meetup API fails
├── _includes/       # Layouts
│   ├── base.njk     # Root layout (IDE/VS Code theme)
│   ├── post.njk     # Blog post layout
│   └── event.njk    # Event detail layout
├── assets/css/
│   └── style.css    # Single stylesheet — Catppuccin Mocha dark theme
├── posts/           # Blog posts as Markdown (YYYY-MM-DD-slug.md)
├── events/          # Past event write-ups as Markdown (YYYY-MM-DD-slug.md)
├── index.njk        # Homepage
├── blog.njk         # Blog listing
├── events.njk       # Events listing (upcoming + past)
├── about.njk        # About page
├── feed.njk         # RSS/Atom feed → /feed.xml
└── 404.njk          # 404 page
scripts/
├── bump-version.js  # Increments buildInfo.json
└── deploy.sh        # Full deploy pipeline
```

## Content Conventions

### Blog Posts (`src/posts/`)

Filename: `YYYY-MM-DD-slug.md`

```yaml
---
layout: post.njk
title: Post Title
date: 2026-03-19
author: Author Name
permalink: /blog/{{ page.fileSlug }}/
draft: true    # optional — excludes from index/collections; shows [DRAFT] prefix on post page
---
```

`excerpt` is auto-extracted from the first sentence (up to 160 chars), or set manually via frontmatter.

### Events (`src/events/`)

Filename: `YYYY-MM-DD-slug.md`

```yaml
---
layout: event.njk
title: Event Title
date: 2025-10-15
location: Venue Name, Address
attendees: 45          # optional
meetup_url: https://...
video: https://youtube.com/...   # optional — embeds player
photos:                          # optional — renders gallery
  - https://...
permalink: /events/{{ page.fileSlug }}/
---
```

## Design System

- **Theme**: Catppuccin Mocha (dark)
- **Font**: JetBrains Mono (Google Fonts)
- **UI concept**: Mimics VS Code — sidebar nav, editor tabs, breadcrumb, status bar

Key CSS variables (all defined in `style.css`):

| Variable | Role |
|---|---|
| `--base`, `--mantle`, `--crust` | Background layers |
| `--text`, `--subtext0` | Body text |
| `--green`, `--blue`, `--pink`, `--peach` | Accent colors |

## Eleventy Config (`eleventy.config.js`)

- **Collections**: `posts` and `events` are glob-based (not tag-based) to avoid duplicates
- **Custom filters**: `readingTime`, `excerpt`, `dateFormat`, `timeFormat` (America/Detroit TZ)
- **Plugins**: RSS feed, HTML Base

## Data: Upcoming Events

Templates use `meetup.upcoming or upcoming` — the Meetup.js data file fetches live events from `meetup.com/gql2` and falls back to `src/_data/upcoming.json` on failure.

Each entry in `upcoming.json` supports an optional `internal_url` field pointing to the event's page on this site (e.g. `/events/my-event-slug/`). When set, the upcoming event card links there instead of Meetup; the RSVP button always links to Meetup regardless.

## Deployment

`npm run deploy` runs `scripts/deploy.sh` which:
1. Bumps `buildInfo.json` and commits it
2. Builds to `_site/`
3. Force-pushes `_site/` to the `gh-pages` branch

The `gh-pages` branch is served by GitHub Pages with the custom domain configured via `CNAME`.
