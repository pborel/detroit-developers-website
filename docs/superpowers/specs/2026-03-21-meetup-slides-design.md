# Meetup Slides — Design Spec

**Date:** 2026-03-21
**Status:** Approved

---

## Overview

A fullscreen slideshow hosted at `/slides/` on the Detroit Developers website, used for opening and closing remarks at monthly meetup events. The slides match the site's Catppuccin Mocha IDE aesthetic and are accessible from any internet-connected device.

---

## Architecture

**Approach:** Single Nunjucks page (`src/slides.njk`) at `/slides/` using vanilla JavaScript for slide navigation. No external presentation framework. Consistent with the site's no-framework ethos.

**Routing:** The page does NOT use `base.njk` (which would render the IDE sidebar/tabs shell). Instead it uses a minimal layout — or no layout — so slides can be fully fullscreen without the site chrome.

**Assets required:**
- `src/assets/images/phil_headshot.jpeg` — already present
- `src/assets/images/louis_headshot.jpeg` — already present
- RIVET logo fetched from `https://www.rivet.work/wp-content/uploads/2022/07/Rivet_Logo_UnionBlue_NoTagline.png` (external CDN, no download needed)
- QR codes generated at runtime via `https://api.qrserver.com/v1/create-qr-code/` (free, no API key)

---

## Slides

### Slide 1 — Opener

**Purpose:** Generic welcoming slide shown at the start of each meetup.

**Content:**
- Green IDE comment: `// welcome`
- Large title: "Detroit" / "Developers" (white / blue accent)
- Subtitle: "monthly meetup" with blinking cursor
- QR code (bottom-right): links to `https://detroitdevelopers.com`
- Label: `detroitdevelopers.com`

**Decorative elements:**
- Line number gutter (left edge, dark mantle background)
- Blue status bar (bottom): `main · welcome.md · Detroit, MI`

---

### Slide 2 — Thank You Sponsors

**Purpose:** Acknowledge RIVET as event sponsor.

**Content:**
- Green IDE comment: `// thank you to our sponsor`
- RIVET logo centered (external image, with text fallback "RIVET" in blue if image fails)
- Divider line below logo
- Tagline: "Construction Labor Planning for increased Productivity"
- QR code (bottom-right): links to `https://www.rivet.work/careers/`
- Label: `We're hiring → rivet.work/careers`

**Decorative elements:**
- Line number gutter
- Blue status bar: `main · sponsors.md · rivet.work`

---

### Slide 3 — Organizers

**Purpose:** Closing slide introducing the organizers and inviting LinkedIn connections.

**Content:**
- Green IDE comment: `// your organizers`
- Two-person layout side by side:
  - **Phil Borel**: circular headshot, name, "Organizer" role, QR code → `https://philborel.com`, label: `philborel.com`
  - **Louis Gelinas**: circular headshot, name, "Organizer" role, QR code → `https://www.linkedin.com/in/louis-gelinas/`, label: `linkedin.com/in/louis-gelinas`

**Decorative elements:**
- Line number gutter
- Blue status bar: `main · organizers.md · Detroit, MI`

---

## Visual Design

**Color palette:** Catppuccin Mocha (matches site)
- Background: `#1e1e2e` (--base)
- Line gutter: `#181825` (--mantle)
- Primary text: `#cdd6f4` (--text)
- Secondary text: `#a6adc8` (--subtext0)
- Accent blue: `#89b4fa` (--blue) — titles, borders, status bar, cursor
- Accent green: `#a6e3a1` (--green) — `// comments`
- Surfaces: `#313244` (--surface0)

**Typography:**
- JetBrains Mono (Google Fonts) — all text
- All font sizes use `clamp()` for responsive scaling

**Layout:**
- Each slide is `100vw × 100vh`, absolutely positioned
- Line number gutter: ~4% width on left, dark mantle background
- Status bar: ~28px tall, full width, blue, fixed to bottom
- QR codes: bottom-right corner, white background box, label below

---

## Navigation

- **Keyboard:** Left/right arrow keys advance or go back
- **Click/tap:** Clicking anywhere on the slide advances forward; keyboard left arrow is the only way to go back
- **URL hash:** Slide number reflected in URL hash (`#1`, `#2`, `#3`) so direct links work and browser back/forward work
- Slide indicator (e.g. `1 / 3`) shown subtly in the status bar

---

## Implementation Notes

- The page uses a custom minimal layout (not `base.njk`) to avoid site chrome
- Slides are hidden/shown via CSS (`display: none` / `display: flex`) toggled by JS
- The page should be added to Eleventy's passthrough or given its own template — no collection needed
- Add `/slides/` link somewhere accessible on the site (e.g. status bar or about page) for easy access
- `.superpowers/` is already excluded via `.gitignore`
- RIVET logo should be rendered at `max-width: 320px` to prevent overflow on smaller screens
- Role label ("Organizer") on slide 3 uses `--subtext0` color (`#a6adc8`)
- QR codes are runtime-generated via `api.qrserver.com`; if the service is unreachable (e.g. no internet at venue), the QR boxes will render empty. Acceptable failure — the label text (URL) remains visible as fallback

---

## Out of Scope

- Speaker notes
- Slide transitions/animations (beyond cursor blink)
- Editable slide content via CMS
- Auto-advance timer
