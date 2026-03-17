# Detroit Software Developers — Website Design Spec

## Overview

A static website for the Detroit Software Developers meetup group (meetup.com/detroit-developers/). The site serves as a community showcase: the next event is the primary focus, supported by an archive of past events with recordings and photos, and a blog.

## Stack

- **Static site generator:** 11ty (Eleventy) v3+
- **Templating:** Nunjucks
- **Content format:** Markdown with YAML frontmatter
- **Styling:** Custom CSS (no framework), Catppuccin Mocha color palette
- **Client-side JS:** Minimal — mobile nav toggle only
- **Fonts:** JetBrains Mono or Fira Code (monospace, for IDE chrome), system sans-serif stack (body content)
- **RSS:** `@11ty/eleventy-plugin-rss` for blog feed

## Visual Design

### Concept: VS Code / IDE Aesthetic

The entire site is styled to look like a code editor. Navigation is a file explorer sidebar, pages appear as editor tabs, content sections are labeled with code comments, and a status bar runs along the bottom.

### Color Palette (Catppuccin Mocha)

| Role        | Color     | Hex       |
|-------------|-----------|-----------|
| Background  | Base      | `#1e1e2e` |
| Card/surface| Mantle    | `#181825` |
| Deep bg     | Crust     | `#11111b` |
| Border      | Surface0  | `#313244` |
| Muted text  | Subtext0  | `#a6adc8` |
| Body text   | Text      | `#cdd6f4` |
| Green       | Green     | `#a6e3a1` |
| Blue        | Blue      | `#89b4fa` |
| Pink        | Pink      | `#f38ba8` |
| Peach       | Peach     | `#fab387` |
| Yellow      | Yellow    | `#f9e2af` |
| Teal        | Teal      | `#94e2d5` |

**Contrast note:** Overlay0 (`#6c7086`) fails WCAG AA (4.0:1 on Base). Use Subtext0 (`#a6adc8`, 6.6:1) as the minimum for any readable text. Overlay0 may only be used for decorative, non-essential elements (line numbers, activity bar icons) that are also marked `aria-hidden`.

### Typography

- **IDE chrome** (nav, tabs, breadcrumbs, line numbers, section labels): Monospace (JetBrains Mono / Fira Code)
- **Body content** (titles, descriptions, paragraphs): `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Code-style metadata** (dates, counts, key-value pairs): Monospace

### Layout Components

- **Activity bar** (far left): Icon column — decorative only, `aria-hidden="true"`. Search icon is non-functional (decorative).
- **File explorer sidebar** (left): Pages listed as files with colored icons, content files (posts/, events/) nested in folders. Active page highlighted. Uses `<nav role="navigation" aria-label="Site navigation">`.
- **Editor tabs** (top): Tab per open "file" (page), active tab has blue bottom border
- **Breadcrumb** (below tabs): Path like `detroit-devs / src / events.html`
- **Line number gutter**: Decorative line numbers along the left side of content, `aria-hidden="true"`
- **Code comment section headers**: `// NEXT EVENT`, `// UPCOMING`, `// RECENT POSTS` etc.
- **Status bar** (bottom): Branch name (`⑂ main`), problems count, file info — VS Code style, blue background, `aria-hidden="true"`

### Responsive Behavior

- **Desktop (>1024px):** Full IDE layout with sidebar, tabs, gutter
- **Tablet (768-1024px):** Sidebar collapses, accessible via hamburger/toggle
- **Mobile (<768px):** No sidebar, simplified top nav, no line numbers, status bar remains

## Pages

### Home (`/`)

1. **Hero — Next Event**: Upcoming event from data source. Shows title, description, date/time/location as key-value pairs in monospace, RSVP button linking to Meetup. Section header: `// NEXT EVENT`. Falls back to "Check our Meetup page for upcoming events" link when no upcoming event data is available.
2. **About blurb**: Community description in a card styled like a README. Member count, cadence, location as colored dots. Section header: `// README`
3. **Recent blog posts**: 3 most recent posts as linked cards (title, date, read time). Section header: `// RECENT POSTS`

### Events (`/events`)

1. **Upcoming events**: Cards with green left border and "NEXT UP" badge. Sourced from data file. Section header: `// UPCOMING`
2. **Past events archive**: Reverse-chronological list of all past event cards. Each shows title, date, attendee count, and media indicators (🎥 video, 📷 photos). Events with recordings show a thumbnail area. Cards link to individual event detail pages. Section header: `// PAST EVENTS`. No pagination — the group runs ~12 events/year so a single page is sufficient for the foreseeable future. Revisit if the list exceeds ~50 items.

### Event Detail Page (`/events/:slug`)

Individual page per past event showing:
- Event title and metadata
- Embedded YouTube video (if available) via responsive `<iframe>`
- Photo gallery: CSS grid of thumbnails linking to full-size images. No lightbox JS — simple linked images.
- Event recap (Markdown body content)
- Link back to Meetup event page

### Blog (`/blog`)

Post listing page with cards: title (blue link), date, read time, excerpt. Cards link to individual post pages. No pagination initially — revisit if post count exceeds ~50.

### Blog Post (`/blog/:slug`)

Individual post rendered from Markdown. Title, date, author (optional), reading time, body content.

### About (`/about`)

- Community description (expanded version of the README blurb)
- Organizer information
- Links to Meetup group and LinkedIn

### 404 Page

Custom 404 page styled as an IDE "file not found" error. Rendered as `404.html` at the build output root for hosting platform compatibility. Includes navigation back to home.

## Data Strategy

### Upcoming Events — Manual Data File with Scraper Attempt

Meetup.com is a React SPA — a plain `fetch()` of the group page returns an HTML shell without event data. A reliable scraper would require a headless browser, adding significant build complexity.

**Primary approach:** A manual data file at `src/_data/upcoming.json` that organizers update when scheduling events:

```json
[
  {
    "title": "Agentic Software Development",
    "description": "Panel Discussion with GitHub, RIVET Work, Signal Advisors & Inngest",
    "date": "2026-03-23T17:30:00-04:00",
    "location": "The Madison Loft & Auditorium, 1555 Broadway St, Detroit",
    "url": "https://www.meetup.com/detroit-developers/events/306217637/"
  }
]
```

**Optional scraper enhancement:** `src/_data/meetup.js` attempts to fetch event data from Meetup's internal GraphQL endpoint (the same one the browser calls). If it succeeds, this data supplements or replaces `upcoming.json`. If it fails, the build silently falls back to `upcoming.json`. This is best-effort — Meetup can change their internal API at any time.

**Fallback chain:** Scraper data → `upcoming.json` → "Check our Meetup page" link.

Available in templates as `{{ upcoming }}` (from the JSON file) or `{{ meetup.upcoming }}` (from the scraper).

**Rebuild strategy:** Rebuild when a new event is announced or the `upcoming.json` file is updated. Can be automated via hosting platform build hooks or a cron-triggered build.

### Past Events — Markdown Files

Location: `src/events/`

Filename convention: `YYYY-MM-DD-slug.md` (e.g., `2025-10-15-sboms-frontend.md`)

Frontmatter schema:
```yaml
---
title: "SBOMs for Frontend Developers & Code-Level Observability"
date: 2025-10-15
location: "The Madison Loft, Detroit"
attendees: 21
video: "https://youtube.com/watch?v=..."  # optional
photos:                                     # optional
  - /assets/events/2025-10-sboms/01.jpg
  - /assets/events/2025-10-sboms/02.jpg
meetup_url: "https://meetup.com/detroit-developers/events/..."
---

Event recap content in Markdown...
```

### Blog Posts — Markdown Files

Location: `src/posts/`

Filename convention: `YYYY-MM-DD-slug.md`

Frontmatter schema:
```yaml
---
title: "Getting Started with AI Agents in Production"
date: 2026-03-10
author: "Phil"       # optional
excerpt: "A primer on deploying AI agents..."  # optional, auto-generated from first paragraph if omitted
---

Post content in Markdown...
```

## 11ty Configuration

### Collections

Configure in `.eleventy.js`:

- **`collections.posts`**: All files in `src/posts/`, sorted by date descending. Tag: `post`.
- **`collections.events`**: All files in `src/events/`, sorted by date descending. Tag: `event`.

### Permalinks

- Blog posts: `permalink: /blog/{{ page.fileSlug }}/` (set in `post.njk` layout)
- Events: `permalink: /events/{{ page.fileSlug }}/` (set in `event.njk` layout)

### Filters

- **`readingTime`**: Custom filter. Word count / 230 WPM, rounded up, returns string like "5 min read".
- **`excerpt`**: If no `excerpt` in frontmatter, extract first paragraph of content and truncate to ~160 characters.
- **`dateFormat`**: Format dates for display (e.g., "Mar 23, 2026").

### Plugins

- `@11ty/eleventy-plugin-rss` — generates `/feed.xml` for the blog

## Site Metadata

`src/_data/site.json`:
```json
{
  "title": "Detroit Software Developers",
  "description": "Monthly meetups on software development and startups in Detroit",
  "url": "https://detroitsoftwaredevs.com",
  "meetup_url": "https://www.meetup.com/detroit-developers/",
  "linkedin_url": "https://www.linkedin.com/groups/...",
  "language": "en"
}
```

(The `url` value is a placeholder — update once hosting/domain is decided.)

## Meta Tags and Social Sharing

`base.njk` includes dynamic Open Graph and Twitter Card meta tags per page:

- `og:title` / `og:description` — from page frontmatter or site defaults
- `og:image` — page-specific image if available, else a default site image
- `og:url` — canonical URL
- `twitter:card` — `summary_large_image`

## Project Structure

```
detroit-developers-website/
  src/
    _includes/
      base.njk          # HTML shell — IDE chrome, nav, footer, status bar
      post.njk          # Blog post layout (extends base)
      event.njk         # Past event detail layout (extends base)
    _data/
      meetup.js          # Optional build-time scraper (best-effort)
      upcoming.json      # Manual upcoming events data
      site.json          # Site metadata (title, description, URLs)
    posts/               # Blog posts (Markdown)
    events/              # Past events (Markdown)
    assets/
      css/
        style.css        # All styles — Catppuccin theme, IDE layout
      fonts/             # JetBrains Mono or Fira Code (self-hosted)
      images/            # Site images, default OG image, favicon
      events/            # Event photos organized by event
    index.njk            # Home page
    events.njk           # Events listing page
    blog.njk             # Blog listing page
    about.njk            # About page
    404.njk              # Custom 404 page
    feed.njk             # RSS feed template
  .eleventy.js           # 11ty config (collections, filters, plugins, passthrough)
  package.json
  .gitignore
```

## Non-Goals

- No job board
- No sponsor logos
- No speaker resource pages
- No client-side routing or SPA behavior
- No CMS web UI (content managed via Markdown files in git)
- No Meetup API integration (requires paid account upgrade)
- No interactive features beyond mobile nav toggle
- No light mode or theme switching (dark only)
- No client-side search (search icon in activity bar is decorative)
- No pagination (revisit when content exceeds ~50 items per listing)
