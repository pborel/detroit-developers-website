# Meetup Slides Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fullscreen, keyboard-navigable slideshow at `/slides/` on the Detroit Developers website, matching the site's Catppuccin Mocha IDE aesthetic, with three slides: opener, RIVET sponsor, and organizers.

**Architecture:** A single Nunjucks page (`src/slides.njk`) using a minimal custom layout (no IDE chrome), standalone CSS, and ~30 lines of vanilla JS for keyboard+click navigation with URL hash support. No external presentation framework.

**Tech Stack:** Eleventy 11ty v3.1.2, Nunjucks, vanilla CSS, vanilla JS. QR codes via `api.qrserver.com` at runtime. JetBrains Mono via Google Fonts.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/_includes/slides-layout.njk` | Minimal HTML shell — no IDE chrome, loads slides.css |
| Create | `src/assets/css/slides.css` | All slide styles: layout, colors, typography, animations |
| Create | `src/slides.njk` | Three slides (HTML) + navigation JS, uses slides-layout |
| Modify | `src/_includes/base.njk` | Add `/slides/` link to the site's status bar |

---

## Task 1: Minimal Slides Layout

**Files:**
- Create: `src/_includes/slides-layout.njk`

This layout renders a bare HTML document — no sidebar, tabs, or breadcrumb. The slides page needs to be fullscreen with no site chrome. It loads JetBrains Mono (same CDN call as `base.njk`) and `slides.css`.

- [ ] **Step 1: Create the layout file**

```nunjucks
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} — Detroit Developers</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/slides.css">
</head>
<body>
  {{ content | safe }}
</body>
</html>
```

- [ ] **Step 2: Verify Eleventy picks it up**

Run: `npm run build`

Expected: Build completes with no errors. (The layout won't output anything yet since no page uses it.)

- [ ] **Step 3: Commit**

```bash
git add src/_includes/slides-layout.njk
git commit -m "feat: add minimal slides layout (no IDE chrome)"
```

---

## Task 2: Slides CSS

**Files:**
- Create: `src/assets/css/slides.css`

This file is picked up by the passthrough copy (`eleventyConfig.addPassthroughCopy("src/assets")` in `eleventy.config.js`) and served at `/assets/css/slides.css`. It uses the same Catppuccin Mocha CSS variables as `style.css` but defined locally — slides.css is standalone and does not import style.css.

- [ ] **Step 1: Create the CSS file**

```css
:root {
  --crust:    #11111b;
  --mantle:   #181825;
  --base:     #1e1e2e;
  --surface0: #313244;
  --surface1: #45475a;
  --overlay0: #6c7086;
  --subtext0: #a6adc8;
  --text:     #cdd6f4;
  --green:    #a6e3a1;
  --blue:     #89b4fa;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--base);
  font-family: 'JetBrains Mono', monospace;
  color: var(--text);
}

/* ── Slideshow container ── */
.slideshow {
  position: relative;
  width: 100vw;
  height: 100vh;
}

/* ── Individual slide ── */
.slide {
  position: absolute;
  inset: 0;
  display: none;
  background: var(--base);
}

.slide.active {
  display: block;
}

/* ── Line number gutter (left edge) ── */
.slide-gutter {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 28px;
  width: 48px;
  background: var(--mantle);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 24px;
  gap: 10px;
  font-size: 12px;
  color: var(--surface1);
  user-select: none;
}

/* ── Status bar (bottom) ── */
.slide-status {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: var(--blue);
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 700;
  color: var(--mantle);
  gap: 12px;
}

.slide-status-right {
  margin-left: auto;
  display: flex;
  gap: 16px;
}

/* ── Content area (offset for gutter + status bar) ── */
.slide-content {
  position: absolute;
  left: 48px;
  top: 0;
  right: 0;
  bottom: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── IDE-style section comment (top-left of content area) ── */
.ide-comment {
  position: absolute;
  top: 28px;
  left: 28px;
  font-size: clamp(12px, 1.4vw, 18px);
  color: var(--green);
  opacity: 0.85;
}

/* ── QR block (bottom-right of content area) ── */
.qr-block {
  position: absolute;
  bottom: 32px;
  right: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.qr-block img {
  width: clamp(80px, 9vw, 120px);
  height: clamp(80px, 9vw, 120px);
  background: white;
  border-radius: 4px;
  display: block;
}

.qr-label {
  font-size: clamp(9px, 0.9vw, 12px);
  color: var(--overlay0);
  text-align: center;
  line-height: 1.4;
}

/* ── Slide 1: Opener ── */
.opener-title {
  font-size: clamp(48px, 9vw, 128px);
  font-weight: 700;
  line-height: 1.05;
  text-align: center;
}

.opener-title .accent {
  color: var(--blue);
}

.opener-subtitle {
  font-size: clamp(14px, 1.8vw, 24px);
  color: var(--subtext0);
  margin-top: 20px;
  text-align: center;
}

.cursor {
  display: inline-block;
  width: 0.55em;
  height: 1em;
  background: var(--blue);
  vertical-align: text-bottom;
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* ── Slide 2: Sponsors ── */
.sponsor-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.sponsor-logo {
  max-width: 320px;
  max-height: clamp(60px, 8vw, 100px);
  object-fit: contain;
}

.sponsor-logo-fallback {
  font-size: clamp(28px, 4vw, 56px);
  font-weight: 700;
  color: var(--blue);
  display: none;
}

.sponsor-divider {
  width: 80px;
  height: 1px;
  background: var(--surface1);
}

.sponsor-tagline {
  font-size: clamp(11px, 1.3vw, 17px);
  color: var(--subtext0);
  max-width: 480px;
}

/* ── Slide 3: Organizers ── */
.team-grid {
  display: flex;
  gap: clamp(32px, 6vw, 96px);
  align-items: flex-start;
}

.person {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}

.person-photo {
  width: clamp(80px, 10vw, 140px);
  height: clamp(80px, 10vw, 140px);
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--blue);
}

.person-name {
  font-size: clamp(14px, 1.8vw, 24px);
  font-weight: 700;
}

.person-role {
  font-size: clamp(10px, 1.1vw, 14px);
  color: var(--subtext0);
}

.person-qr {
  width: clamp(64px, 7vw, 96px);
  height: clamp(64px, 7vw, 96px);
  background: white;
  border-radius: 4px;
  overflow: hidden;
}

.person-qr img {
  width: 100%;
  height: 100%;
  display: block;
}

.person-qr-label {
  font-size: clamp(8px, 0.8vw, 10px);
  color: var(--overlay0);
}
```

- [ ] **Step 2: Verify passthrough copy**

Run: `npm run build`

Expected: Build succeeds. Check that `_site/assets/css/slides.css` exists:

```bash
ls _site/assets/css/slides.css
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/css/slides.css
git commit -m "feat: add slides CSS (Catppuccin Mocha, fullscreen layout)"
```

---

## Task 3: Slides Page (HTML + Navigation JS)

**Files:**
- Create: `src/slides.njk`

This is the main deliverable. It uses `slides-layout.njk`, contains all three slides as `<div class="slide">` elements, and includes inline JS (~35 lines) for keyboard/click navigation and URL hash syncing. The first slide has `class="slide active"` — all others start hidden.

Eleventy frontmatter notes:
- `layout: slides-layout.njk` — uses the bare layout from Task 1
- `permalink: /slides/` — explicit permalink to get a clean URL
- No `eleventyExcludeFromCollections` needed; the page has no tags so it won't appear in posts/events

- [ ] **Step 1: Create the slides page**

```nunjucks
---
layout: slides-layout.njk
title: Slides
permalink: /slides/
---

<div class="slideshow" id="slideshow">

  {# ── Slide 1: Opener ── #}
  <div class="slide active" id="slide-1">
    <div class="slide-gutter" aria-hidden="true">
      <span>1</span><span>2</span><span>3</span><span>4</span>
      <span>5</span><span>6</span><span>7</span><span>8</span>
    </div>
    <div class="slide-content">
      <div class="ide-comment">// welcome</div>
      <div style="text-align: center;">
        <div class="opener-title">Detroit<br><span class="accent">Developers</span></div>
        <div class="opener-subtitle">monthly meetup&nbsp;<span class="cursor"></span></div>
      </div>
      <div class="qr-block">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://detroitdevelopers.com"
          alt="detroitdevelopers.com QR code"
          loading="lazy"
        >
        <div class="qr-label">detroitdevelopers.com</div>
      </div>
    </div>
    <div class="slide-status" aria-hidden="true">
      <span>⑂ main</span>
      <span>● welcome.md</span>
      <div class="slide-status-right">
        <span>1 / 3</span>
        <span>Detroit, MI</span>
      </div>
    </div>
  </div>

  {# ── Slide 2: Sponsors ── #}
  <div class="slide" id="slide-2">
    <div class="slide-gutter" aria-hidden="true">
      <span>1</span><span>2</span><span>3</span><span>4</span>
      <span>5</span><span>6</span><span>7</span><span>8</span>
    </div>
    <div class="slide-content">
      <div class="ide-comment">// thank you to our sponsor</div>
      <div class="sponsor-center">
        <img
          class="sponsor-logo"
          src="https://www.rivet.work/wp-content/uploads/2022/07/Rivet_Logo_UnionBlue_NoTagline.png"
          alt="RIVET"
          onerror="this.style.display='none'; this.nextElementSibling.style.display='block'"
        >
        <div class="sponsor-logo-fallback">RIVET</div>
        <div class="sponsor-divider"></div>
        <div class="sponsor-tagline">Construction Labor Planning for increased Productivity</div>
      </div>
      <div class="qr-block">
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://www.rivet.work/careers/"
          alt="RIVET Careers QR code"
          loading="lazy"
        >
        <div class="qr-label">We're hiring →<br>rivet.work/careers</div>
      </div>
    </div>
    <div class="slide-status" aria-hidden="true">
      <span>⑂ main</span>
      <span>● sponsors.md</span>
      <div class="slide-status-right">
        <span>2 / 3</span>
        <span>rivet.work</span>
      </div>
    </div>
  </div>

  {# ── Slide 3: Organizers ── #}
  <div class="slide" id="slide-3">
    <div class="slide-gutter" aria-hidden="true">
      <span>1</span><span>2</span><span>3</span><span>4</span>
      <span>5</span><span>6</span><span>7</span><span>8</span>
    </div>
    <div class="slide-content">
      <div class="ide-comment">// your organizers</div>
      <div class="team-grid">
        <div class="person">
          <img class="person-photo" src="/assets/images/phil_headshot.jpeg" alt="Phil Borel">
          <div class="person-name">Phil Borel</div>
          <div class="person-role">Organizer</div>
          <div class="person-qr">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=https://philborel.com"
              alt="Phil Borel QR code"
              loading="lazy"
            >
          </div>
          <div class="person-qr-label">philborel.com</div>
        </div>
        <div class="person">
          <img class="person-photo" src="/assets/images/louis_headshot.jpeg" alt="Louis Gelinas">
          <div class="person-name">Louis Gelinas</div>
          <div class="person-role">Organizer</div>
          <div class="person-qr">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=https://www.linkedin.com/in/louis-gelinas/"
              alt="Louis Gelinas QR code"
              loading="lazy"
            >
          </div>
          <div class="person-qr-label">linkedin.com/in/louis-gelinas</div>
        </div>
      </div>
    </div>
    <div class="slide-status" aria-hidden="true">
      <span>⑂ main</span>
      <span>● organizers.md</span>
      <div class="slide-status-right">
        <span>3 / 3</span>
        <span>Detroit, MI</span>
      </div>
    </div>
  </div>

</div>

<script>
(function () {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const total = slides.length;
  let current = 0;

  function getHashIndex() {
    const n = parseInt(window.location.hash.replace('#', ''), 10);
    return (!isNaN(n) && n >= 1 && n <= total) ? n - 1 : 0;
  }

  function showSlide(index) {
    slides[current].classList.remove('active');
    current = Math.max(0, Math.min(total - 1, index));
    slides[current].classList.add('active');
    history.replaceState(null, '', '#' + (current + 1));
  }

  // Init from URL hash (supports direct links like /slides/#2)
  showSlide(getHashIndex());

  // Keyboard: right/down = next, left/up = prev
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (current < total - 1) showSlide(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (current > 0) showSlide(current - 1);
    }
  });

  // Click anywhere to advance
  document.getElementById('slideshow').addEventListener('click', function () {
    if (current < total - 1) showSlide(current + 1);
  });
})();
</script>
```

- [ ] **Step 2: Build and verify output exists**

Run: `npm run build`

Expected: Build succeeds. Then verify:

```bash
ls _site/slides/index.html
```

Expected: File exists.

- [ ] **Step 3: Spot-check the built HTML**

```bash
grep -c 'class="slide' _site/slides/index.html
```

Expected: `3` (three slides rendered)

```bash
grep 'slides.css' _site/slides/index.html
```

Expected: A line containing `/assets/css/slides.css`

- [ ] **Step 4: Run dev server and open in browser**

```bash
npm run dev
```

Open `http://localhost:8080/slides/` in a browser. Verify:
- Slide 1 is visible (dark background, "Detroit / Developers" title, QR code bottom-right)
- Right arrow key advances to slide 2 (RIVET sponsor slide)
- Right arrow advances to slide 3 (organizers with headshots)
- Left arrow goes back
- Clicking anywhere advances the slide
- URL hash updates to `#1`, `#2`, `#3` as you navigate
- Opening `http://localhost:8080/slides/#2` directly shows slide 2

- [ ] **Step 5: Commit**

```bash
git add src/slides.njk
git commit -m "feat: add meetup slides page at /slides/ (opener, sponsor, organizers)"
```

---

## Task 4: Add Slides Link to Site Navigation

**Files:**
- Modify: `src/_includes/base.njk` (lines 112–123)

Add a `/slides/` link to the site's status bar so the page is reachable from anywhere on the site. The status bar is the blue bar at the bottom of every page. Add the link to the left group, next to the existing git branch indicator.

- [ ] **Step 1: Open `src/_includes/base.njk` and locate the status bar**

The status bar is near the bottom of the file (around line 113):

```html
<div class="status-bar" aria-hidden="true">
  <div class="status-bar-group">
    <span>⑂ main</span>
    <span>✓ 0 problems</span>
  </div>
  <div class="status-bar-group">
    <span>detroit-devs</span>
    <span>UTF-8</span>
    <span>Nunjucks</span>
  </div>
</div>
```

- [ ] **Step 2: Add the slides link**

Replace the status bar block with:

```html
<div class="status-bar" aria-hidden="true">
  <div class="status-bar-group">
    <span>⑂ main</span>
    <span>✓ 0 problems</span>
  </div>
  <div class="status-bar-group">
    <a href="/slides/" style="color: inherit; text-decoration: none;">⬡ slides</a>
    <span>detroit-devs</span>
    <span>UTF-8</span>
    <span>Nunjucks</span>
  </div>
</div>
```

- [ ] **Step 3: Build and verify**

Run: `npm run build`

Expected: Build succeeds with no errors.

Run `npm run dev`, open `http://localhost:8080/` and confirm the "⬡ slides" link appears in the blue status bar and clicking it navigates to `/slides/`.

- [ ] **Step 4: Commit**

```bash
git add src/_includes/base.njk
git commit -m "feat: add slides link to site status bar"
```

---

## Task 5: Final Check

- [ ] **Step 1: Full build from clean state**

```bash
rm -rf _site && npm run build
```

Expected: Build succeeds, no errors or warnings.

- [ ] **Step 2: Verify all output files**

```bash
ls _site/slides/index.html
ls _site/assets/css/slides.css
```

Both should exist.

- [ ] **Step 3: Manual end-to-end test**

Run `npm run dev`, open `http://localhost:8080/slides/` and run through:

| Check | Expected |
|-------|----------|
| Slide 1 shows by default | "Detroit / Developers" + QR |
| QR label reads "detroitdevelopers.com" | ✓ |
| Right arrow → slide 2 | RIVET logo + tagline + careers QR |
| RIVET tagline is "Construction Labor Planning for increased Productivity" | ✓ |
| Right arrow → slide 3 | Phil + Louis headshots, names, QR codes |
| Phil QR label: "philborel.com" | ✓ |
| Louis QR label: "linkedin.com/in/louis-gelinas" | ✓ |
| Left arrow goes back | ✓ |
| Click anywhere advances | ✓ |
| Hash updates in URL bar | `#1`, `#2`, `#3` |
| Navigate to `/slides/#3` directly | Opens slide 3 |
| "⬡ slides" in status bar on home page | ✓ |
| Status bar link navigates to `/slides/` | ✓ |
