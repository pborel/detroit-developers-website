# Conference Talks Section — Design Spec

**Date:** 2026-04-09
**Status:** Approved

## Goal

Add a "conference talks" section to the Detroit Developers website for hosting conference talk engagements — modeled after the existing events feature but focused on external conference appearances rather than meetup events.

## Architecture

Follows the established content pattern: markdown files in a dedicated directory, a layout template, a listing page, a collection in Eleventy config, and sidebar/tab navigation integration.

## 1. Content Directory — `src/talks/`

Markdown files using the `YYYY-MM-DD-slug.md` naming convention.

### Frontmatter Schema

```yaml
---
layout: talk.njk
title: "Talk Title"
date: 2026-06-23              # date of the talk
conference: "Conference Name"  # e.g. GOTO Accelerate Chicago 2026
location: "City, ST"           # e.g. Chicago, IL
session_url: https://...       # link to session on conference site
ticket_url: https://...        # optional — link to buy tickets (upcoming talks)
slides_url: /slides/slug/      # optional — link to slides hosted on this site
video:                         # optional — YouTube URL, added post-conference
permalink: /talks/{{ page.fileSlug }}/
---

Markdown body: abstract, description, key topics, etc.
```

## 2. Layout — `src/_includes/talk.njk`

Extends `base.njk`. Structure mirrors `event.njk`:

1. **Header**: title (h1), conference name, date, location
2. **Video embed**: conditional, uses same YouTube URL transform as `event.njk`
3. **Body**: markdown content rendered in `.prose` div
4. **Action buttons** (conditional, flex row):
   - "Session Details →" → links to `session_url` (new tab)
   - "Get Tickets →" → links to `ticket_url` (new tab), only rendered if set
   - "View Slides →" → links to `slides_url` (same site)

Button styling: `btn-primary` for session details, `btn-secondary` for tickets and slides — consistent with event layout button usage.

## 3. Listing Page — `src/talks.njk`

Permalink: `/talks/`

Two sections, matching events page pattern:

### Upcoming Talks
- Filtered from `collections.talks` using `isUpcoming` filter
- Full cards showing: title, conference name, date, location, ticket link
- Badge: "UPCOMING" (similar to events "NEXT UP" badge)

### Past Talks
- Remaining talks (not upcoming)
- Compact card rows showing: title, conference name, date
- Indicators for available media: video, slides (similar to events showing video/photos indicators)

Empty states: "No upcoming talks." / "No past talks recorded yet."

## 4. Collection — `eleventy.config.js`

```js
eleventyConfig.addCollection("talks", (collectionApi) => {
  return collectionApi.getFilteredByGlob("src/talks/*.md")
    .sort((a, b) => b.date - a.date);
});
```

Added after the existing `events` collection. Glob-based, no tags — consistent with all other collections.

## 5. Navigation — `src/_includes/base.njk`

### Sidebar
- New main item: `talks.html` with pink (`--pink`) icon color, placed after events and before blog
- Subsection listing individual talks with upcoming/past split (same pattern as events sidebar)
- Active state: `page.url.startsWith('/talks')`

### Editor Tabs
- New tab: `talks.html` with pink icon, placed after events tab
- Active state matches sidebar

### Breadcrumb
- Automatically handled by existing breadcrumb logic

## 6. First Content — GOTO Accelerate Chicago

File: `src/talks/2026-06-23-goto-accelerate-chicago.md`

```yaml
---
layout: talk.njk
title: "AI Is an Amplifier: Harness Engineering for 3x Velocity"
date: 2026-06-23
conference: GOTO Accelerate Chicago 2026
location: Chicago, IL
session_url: https://gotochgo.com/accelerate-chicago-2026/sessions/4046/ai-is-an-amplifier-harness-engineering-for-3x-velocity
ticket_url: https://gotochgo.com/accelerate-chicago-2026/cart
slides_url: /slides/agentic-advanced-practitioners-guide-20min/
permalink: /talks/{{ page.fileSlug }}/
---
```

Body content: talk abstract covering the 3x velocity initiative, DORA 2025 and CMU 2026 research, code quality as agent infrastructure, context engineering, and current challenges (context debt, PR review bottlenecks, multi-agent parallelization).

## Files to Create

| File | Purpose |
|---|---|
| `src/talks/2026-06-23-goto-accelerate-chicago.md` | First talk content |
| `src/_includes/talk.njk` | Talk detail layout |
| `src/talks.njk` | Talks listing page |

## Files to Modify

| File | Change |
|---|---|
| `eleventy.config.js` | Add `talks` collection |
| `src/_includes/base.njk` | Add sidebar item, editor tab, sidebar subsection |

## No Changes Needed

- `style.css` — reuses existing card, button, badge, and prose styles
- `feed.njk` — talks are not blog posts, no RSS needed
- `src/_data/` — no external data source needed (unlike meetup events)
