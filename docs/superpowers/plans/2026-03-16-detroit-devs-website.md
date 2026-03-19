# Detroit Software Developers Website — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static website for the Detroit Software Developers meetup group using 11ty with a VS Code / IDE aesthetic.

**Architecture:** 11ty v3 static site with Nunjucks templates, Markdown content (blog posts + past events), and a manual JSON data file for upcoming events. The site is styled to look like a code editor — sidebar file explorer for navigation, editor tabs, line number gutters, code comment section headers, and a status bar. Catppuccin Mocha color palette.

**Tech Stack:** 11ty v3, Nunjucks, Markdown, CSS (no framework), JetBrains Mono font, `@11ty/eleventy-plugin-rss`

**Spec:** `docs/superpowers/specs/2026-03-16-detroit-devs-website-design.md`

---

## Chunk 1: Project Scaffolding & Base Layout

### Task 1: Initialize 11ty Project

**Files:**
- Create: `package.json`
- Create: `eleventy.config.js`
- Create: `.gitignore`
- Create: `src/_data/site.json`

- [ ] **Step 1: Initialize npm project and install dependencies**

```bash
cd /Users/phil/code/detroit-developers-website
npm init -y
npm install @11ty/eleventy @11ty/eleventy-plugin-rss
```

- [ ] **Step 2: Create `.gitignore`**

```
node_modules/
_site/
.DS_Store
.superpowers/
```

- [ ] **Step 3: Create `eleventy.config.js` config**

Note: 11ty v3 uses ESM by default. We use `eleventy.config.js` with `import`/`export default`.

```js
import pluginRss from "@11ty/eleventy-plugin-rss";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);

  // Passthrough copy
  eleventyConfig.addPassthroughCopy("src/assets");

  // Custom filters
  eleventyConfig.addFilter("readingTime", (content) => {
    if (!content) return "1 min read";
    const text = content.replace(/<[^>]+>/g, "");
    const words = text.split(/\s+/).filter((w) => w.length > 0).length;
    const minutes = Math.ceil(words / 230);
    return `${minutes} min read`;
  });

  eleventyConfig.addFilter("excerpt", (content) => {
    if (!content) return "";
    // Match first <p>...</p> and extract text, or fall back to stripping all tags
    const pMatch = content.match(/<p>(.*?)<\/p>/s);
    const text = pMatch ? pMatch[1].replace(/<[^>]+>/g, "") : content.replace(/<[^>]+>/g, "").trim();
    const firstSentences = text.split(/\.\s/)[0] + ".";
    return firstSentences.length > 160
      ? firstSentences.substring(0, 157) + "..."
      : firstSentences;
  });

  eleventyConfig.addFilter("dateFormat", (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("timeFormat", (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  });

  // Collections (glob-based — do NOT also add tags in frontmatter to avoid duplicates)
  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  eleventyConfig.addCollection("events", (collectionApi) => {
    return collectionApi.getFilteredByGlob("src/events/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
}
```

- [ ] **Step 4: Create `src/_data/site.json`**

```json
{
  "title": "Detroit Software Developers",
  "description": "Monthly meetups on software development and startups in Detroit",
  "url": "https://detroitsoftwaredevs.com",
  "meetup_url": "https://www.meetup.com/detroit-developers/",
  "linkedin_url": "https://www.linkedin.com/groups/",
  "language": "en"
}
```

- [ ] **Step 5: Create a minimal `src/index.njk` to verify build**

```njk
---
layout: base.njk
title: Home
---
<p>Hello, Detroit Devs!</p>
```

- [ ] **Step 6: Create a minimal `src/_includes/base.njk` to verify build**

```html
<!DOCTYPE html>
<html lang="{{ site.language }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} — {{ site.title }}</title>
</head>
<body>
  {{ content | safe }}
</body>
</html>
```

- [ ] **Step 7: Add build scripts and ESM type to `package.json`**

Add `"type": "module"` at the top level and update the `"scripts"` section:
```json
{
  "type": "module",
  "scripts": {
    "build": "eleventy",
    "dev": "eleventy --serve --watch"
  }
}
```

- [ ] **Step 8: Run build to verify**

```bash
npm run build
```

Expected: Build succeeds, `_site/index.html` is created containing "Hello, Detroit Devs!"

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json .gitignore eleventy.config.js src/_data/site.json src/index.njk src/_includes/base.njk
git commit -m "feat: initialize 11ty project with base config and minimal homepage"
```

---

### Task 2: Base Layout — IDE Chrome

**Files:**
- Create: `src/assets/css/style.css`
- Modify: `src/_includes/base.njk`

This is the core layout that every page inherits. It includes the activity bar, file explorer sidebar, editor tabs, breadcrumb, content area with line number gutter, and status bar. All CSS for the Catppuccin Mocha theme lives in `style.css`.

- [ ] **Step 1: Create `src/assets/css/style.css` with CSS custom properties and reset**

```css
/* ============================================
   Detroit Software Developers — IDE Theme
   Catppuccin Mocha color palette
   ============================================ */

/* --- Reset & Base --- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* Catppuccin Mocha */
  --crust: #11111b;
  --mantle: #181825;
  --base: #1e1e2e;
  --surface0: #313244;
  --surface1: #45475a;
  --overlay0: #6c7086;
  --subtext0: #a6adc8;
  --text: #cdd6f4;
  --green: #a6e3a1;
  --blue: #89b4fa;
  --pink: #f38ba8;
  --peach: #fab387;
  --yellow: #f9e2af;
  --teal: #94e2d5;

  /* Typography */
  --font-mono: "JetBrains Mono", "Fira Code", "SF Mono", "Cascadia Code", monospace;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Layout */
  --activity-bar-width: 48px;
  --sidebar-width: 220px;
  --status-bar-height: 28px;
  --tab-height: 40px;
  --breadcrumb-height: 28px;
}

html {
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

body {
  background: var(--base);
  color: var(--text);
  font-family: var(--font-sans);
  line-height: 1.6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

a {
  color: var(--blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* --- IDE Shell --- */
.ide-layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

/* --- Activity Bar --- */
.activity-bar {
  width: var(--activity-bar-width);
  background: var(--crust);
  border-right: 1px solid var(--surface0);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 12px;
  gap: 4px;
  flex-shrink: 0;
}

.activity-bar-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--overlay0);
  font-size: 18px;
  cursor: default;
}

.activity-bar-icon.active {
  background: var(--surface0);
  color: var(--text);
}

/* --- Sidebar --- */
.sidebar {
  width: var(--sidebar-width);
  background: var(--mantle);
  border-right: 1px solid var(--surface0);
  overflow-y: auto;
  flex-shrink: 0;
}

.sidebar-header {
  color: var(--subtext0);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  padding: 12px 16px 8px;
  font-family: var(--font-sans);
  font-weight: 600;
}

.sidebar-section {
  color: var(--subtext0);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 8px 16px 6px;
  font-family: var(--font-sans);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 16px 5px 24px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--subtext0);
  text-decoration: none;
  transition: background 0.1s;
}

.sidebar-item:hover {
  background: var(--surface0);
  text-decoration: none;
}

.sidebar-item.active {
  background: var(--surface0);
  color: var(--blue);
}

.sidebar-item .icon {
  font-size: 14px;
  flex-shrink: 0;
}

.sidebar-divider {
  margin: 8px 16px;
  border-top: 1px solid var(--surface0);
}

/* --- Editor Area --- */
.editor-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* --- Tabs --- */
.editor-tabs {
  display: flex;
  background: var(--crust);
  border-bottom: 1px solid var(--surface0);
  overflow-x: auto;
  flex-shrink: 0;
  height: var(--tab-height);
}

.editor-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--subtext0);
  border-right: 1px solid var(--surface0);
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
}

.editor-tab:hover {
  text-decoration: none;
  color: var(--text);
}

.editor-tab.active {
  background: var(--base);
  color: var(--text);
  border-bottom: 2px solid var(--blue);
}

.editor-tab .icon {
  font-size: 14px;
}

/* --- Breadcrumb --- */
.breadcrumb {
  padding: 0 20px;
  background: var(--base);
  border-bottom: 1px solid var(--surface0);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--subtext0);
  line-height: var(--breadcrumb-height);
  flex-shrink: 0;
}

.breadcrumb-separator {
  color: var(--surface1);
  margin: 0 4px;
}

.breadcrumb-current {
  color: var(--text);
}

/* --- Content Area --- */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
}

.content-section {
  display: flex;
  padding: 0 24px 0 0;
  margin-bottom: 40px;
}

/* --- Line Number Gutter --- */
.line-gutter {
  width: 50px;
  text-align: right;
  padding-right: 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--overlay0);
  line-height: 2;
  user-select: none;
  flex-shrink: 0;
}

.section-content {
  flex: 1;
  border-left: 1px solid var(--surface0);
  padding-left: 24px;
  min-width: 0;
}

/* --- Section Comment Headers --- */
.section-comment {
  font-family: var(--font-mono);
  color: var(--green);
  font-size: 12px;
  line-height: 2;
  margin-bottom: 12px;
}

/* --- Status Bar --- */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  background: var(--blue);
  color: var(--base);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  height: var(--status-bar-height);
  flex-shrink: 0;
}

.status-bar-group {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* --- Cards --- */
.card {
  background: var(--mantle);
  border: 1px solid var(--surface0);
  border-radius: 6px;
  padding: 20px;
  transition: border-color 0.15s;
}

.card:hover {
  border-color: var(--surface1);
}

.card a {
  text-decoration: none;
}

.card-title {
  color: var(--blue);
  font-size: 16px;
  font-weight: 500;
  font-family: var(--font-sans);
}

.card-meta {
  color: var(--subtext0);
  font-family: var(--font-mono);
  font-size: 12px;
  margin-top: 6px;
}

/* --- Event Cards --- */
.event-card {
  background: var(--mantle);
  border: 1px solid var(--surface0);
  border-radius: 6px;
  padding: 24px;
}

.event-card--upcoming {
  border-left: 3px solid var(--green);
  border-radius: 0 6px 6px 0;
}

.event-badge {
  display: inline-block;
  background: var(--green);
  color: var(--base);
  padding: 4px 10px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  color: var(--subtext0);
  font-family: var(--font-mono);
  font-size: 12px;
}

/* --- Buttons --- */
.btn-primary {
  display: inline-block;
  padding: 10px 24px;
  background: var(--blue);
  color: var(--base);
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  font-family: var(--font-sans);
  text-decoration: none;
  transition: opacity 0.15s;
}

.btn-primary:hover {
  opacity: 0.9;
  text-decoration: none;
}

/* --- About Card (README style) --- */
.readme-card {
  background: var(--mantle);
  border: 1px solid var(--surface0);
  border-radius: 6px;
  padding: 24px;
  max-width: 700px;
}

.readme-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
}

.readme-card p {
  color: var(--subtext0);
  line-height: 1.7;
}

.readme-stats {
  display: flex;
  gap: 20px;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 12px;
}

/* --- Key-Value Metadata --- */
.kv-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--subtext0);
}

.kv-meta .key {
  color: var(--blue);
}

.kv-meta .value {
  color: var(--green);
}

/* --- Blog Post Content --- */
.prose {
  max-width: 700px;
  line-height: 1.8;
}

.prose h1,
.prose h2,
.prose h3 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.prose h1 { font-size: 28px; }
.prose h2 { font-size: 22px; }
.prose h3 { font-size: 18px; }

.prose p {
  margin-bottom: 1em;
}

.prose code {
  background: var(--mantle);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 0.9em;
}

.prose pre {
  background: var(--mantle);
  border: 1px solid var(--surface0);
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  margin-bottom: 1em;
}

.prose pre code {
  background: none;
  padding: 0;
}

.prose ul,
.prose ol {
  padding-left: 24px;
  margin-bottom: 1em;
}

.prose img {
  max-width: 100%;
  border-radius: 6px;
}

/* --- Photo Gallery --- */
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.photo-gallery a {
  display: block;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid var(--surface0);
}

.photo-gallery img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  display: block;
  transition: opacity 0.15s;
}

.photo-gallery img:hover {
  opacity: 0.85;
}

/* --- Video Embed --- */
.video-embed {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin: 16px 0;
  border-radius: 6px;
  border: 1px solid var(--surface0);
}

.video-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

/* --- Mobile Nav Toggle --- */
.mobile-nav-toggle {
  display: none;
  background: none;
  border: none;
  color: var(--text);
  font-size: 24px;
  cursor: pointer;
  padding: 8px;
}

/* --- Responsive --- */
@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: var(--activity-bar-width);
    bottom: var(--status-bar-height);
    z-index: 100;
    transform: translateX(-100%);
    transition: transform 0.2s ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .mobile-nav-toggle {
    display: block;
  }
}

@media (max-width: 768px) {
  .activity-bar {
    display: none;
  }

  .sidebar {
    left: 0;
  }

  .line-gutter {
    display: none;
  }

  .section-content {
    border-left: none;
    padding-left: 16px;
  }

  .content-section {
    padding-right: 16px;
  }

  .editor-tabs {
    display: none;
  }

  .breadcrumb {
    display: none;
  }

  /* Mobile top nav */
  .mobile-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--crust);
    border-bottom: 1px solid var(--surface0);
  }

  .mobile-nav .logo {
    font-family: var(--font-mono);
    color: var(--blue);
    font-weight: 700;
    font-size: 16px;
  }
}

@media (min-width: 769px) {
  .mobile-nav {
    display: none;
  }
}
```

- [ ] **Step 2: Update `src/_includes/base.njk` with full IDE chrome layout**

```html
<!DOCTYPE html>
<html lang="{{ site.language }}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} — {{ site.title }}</title>
  <meta name="description" content="{{ description or site.description }}">

  <!-- Open Graph -->
  <meta property="og:title" content="{{ title }} — {{ site.title }}">
  <meta property="og:description" content="{{ description or site.description }}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="{{ site.url }}{{ page.url }}">
  <meta property="og:image" content="{{ ogImage or site.url + '/assets/images/og-default.png' }}">
  <meta name="twitter:card" content="summary_large_image">

  <!-- Fonts (Google Fonts CDN for simplicity — can self-host later if needed) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="alternate" type="application/rss+xml" title="{{ site.title }}" href="/feed.xml">
</head>
<body>

  <!-- Mobile Nav (visible < 769px) -->
  <div class="mobile-nav">
    <a href="/" class="logo">detroit<span style="color: var(--subtext0);">.</span><span style="color: var(--green);">devs</span></a>
    <button class="mobile-nav-toggle" aria-label="Toggle navigation" onclick="document.querySelector('.sidebar').classList.toggle('open')">☰</button>
  </div>

  <div class="ide-layout">

    <!-- Activity Bar -->
    <div class="activity-bar" aria-hidden="true">
      <div class="activity-bar-icon active" title="Explorer">📁</div>
      <div class="activity-bar-icon" title="Search">🔍</div>
      <div class="activity-bar-icon" title="Source Control">⑂</div>
    </div>

    <!-- Sidebar -->
    <nav class="sidebar" role="navigation" aria-label="Site navigation">
      <div class="sidebar-header">Explorer</div>
      <div class="sidebar-section">▾ detroit-devs</div>

      <a href="/" class="sidebar-item{% if page.url == '/' %} active{% endif %}">
        <span class="icon" style="color: var(--peach);">⬡</span> index.html
      </a>
      <a href="/events/" class="sidebar-item{% if page.url.startsWith('/events') %} active{% endif %}">
        <span class="icon" style="color: var(--green);">⬡</span> events.html
      </a>
      <a href="/blog/" class="sidebar-item{% if page.url.startsWith('/blog') %} active{% endif %}">
        <span class="icon" style="color: var(--blue);">⬡</span> blog.html
      </a>
      <a href="/about/" class="sidebar-item{% if page.url == '/about/' %} active{% endif %}">
        <span class="icon" style="color: var(--yellow);">⬡</span> about.html
      </a>

      {% if collections.posts.length %}
      <div class="sidebar-divider"></div>
      <div class="sidebar-section">▾ posts/</div>
      {% for post in collections.posts %}
      <a href="{{ post.url }}" class="sidebar-item{% if page.url == post.url %} active{% endif %}">
        <span class="icon" style="color: var(--teal);">◇</span>
        <span style="font-size: 12px;">{{ post.data.title | truncate(20) }}</span>
      </a>
      {% endfor %}
      {% endif %}

      {% if collections.events.length %}
      <div class="sidebar-divider"></div>
      <div class="sidebar-section">▾ events/</div>
      {% for event in collections.events %}
      <a href="{{ event.url }}" class="sidebar-item{% if page.url == event.url %} active{% endif %}">
        <span class="icon" style="color: var(--teal);">◇</span>
        <span style="font-size: 12px;">{{ event.data.title | truncate(20) }}</span>
      </a>
      {% endfor %}
      {% endif %}
    </nav>

    <!-- Editor Area -->
    <div class="editor-area">

      <!-- Editor Tabs -->
      <div class="editor-tabs">
        <a href="/" class="editor-tab{% if page.url == '/' %} active{% endif %}">
          <span class="icon" style="color: var(--peach);">⬡</span> index.html
        </a>
        <a href="/events/" class="editor-tab{% if page.url.startsWith('/events') %} active{% endif %}">
          <span class="icon" style="color: var(--green);">⬡</span> events.html
        </a>
        <a href="/blog/" class="editor-tab{% if page.url.startsWith('/blog') %} active{% endif %}">
          <span class="icon" style="color: var(--blue);">⬡</span> blog.html
        </a>
        <a href="/about/" class="editor-tab{% if page.url == '/about/' %} active{% endif %}">
          <span class="icon" style="color: var(--yellow);">⬡</span> about.html
        </a>
      </div>

      <!-- Breadcrumb -->
      <div class="breadcrumb">
        detroit-devs
        <span class="breadcrumb-separator">/</span>
        src
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ breadcrumb or "index.html" }}</span>
      </div>

      <!-- Page Content -->
      <div class="content-area">
        {{ content | safe }}
      </div>

    </div>
  </div>

  <!-- Status Bar -->
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

</body>
</html>
```

- [ ] **Step 3: Run build and verify in browser**

```bash
npm run dev
```

Open `http://localhost:8080` in browser. Verify:
- Dark background with Catppuccin Mocha colors
- Activity bar on far left with icons
- File explorer sidebar with page links
- Editor tabs along top
- Breadcrumb below tabs
- "Hello, Detroit Devs!" in the content area
- Blue status bar at bottom
- On mobile width: sidebar hidden, mobile nav visible with hamburger toggle

- [ ] **Step 4: Commit**

```bash
git add src/assets/css/style.css src/_includes/base.njk
git commit -m "feat: add IDE chrome base layout with Catppuccin Mocha theme"
```

---

## Chunk 2: Data Layer & Homepage

### Task 3: Upcoming Events Data

**Files:**
- Create: `src/_data/upcoming.json`
- Create: `src/_data/meetup.js`

- [ ] **Step 1: Create `src/_data/upcoming.json` with current event data**

```json
[
  {
    "title": "Agentic Software Development",
    "description": "Panel Discussion featuring Engineers from GitHub, RIVET Work, Signal Advisors & Inngest discussing GenAI applications in software development.",
    "date": "2026-03-23T17:30:00-04:00",
    "location": "The Madison 2nd Floor, 1555 Broadway St, Detroit",
    "url": "https://www.meetup.com/detroit-developers/events/306217637/"
  }
]
```

- [ ] **Step 2: Create `src/_data/meetup.js` best-effort scraper**

```js
export default async function () {
  // Best-effort scraper for Meetup's internal API.
  // Falls back to upcoming.json (loaded separately by 11ty) on any failure.
  // Meetup is a React SPA — this targets their GraphQL endpoint, which can
  // change without notice.
  try {
    const response = await fetch(
      "https://www.meetup.com/gql2",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operationName: "getGroupUpcomingEvents",
          variables: {
            urlname: "detroit-developers",
            first: 3,
          },
          query: `query getGroupUpcomingEvents($urlname: String!, $first: Int) {
            groupByUrlname(urlname: $urlname) {
              upcomingEvents(input: { first: $first }) {
                edges {
                  node {
                    title
                    description
                    dateTime
                    eventUrl
                    venue {
                      name
                      address
                      city
                      state
                    }
                    going
                  }
                }
              }
            }
          }`,
        }),
      }
    );

    if (!response.ok) {
      console.log("[meetup.js] Fetch failed, using upcoming.json fallback");
      return { upcoming: null };
    }

    const data = await response.json();
    const edges = data?.data?.groupByUrlname?.upcomingEvents?.edges;

    if (!edges || edges.length === 0) {
      return { upcoming: null };
    }

    const upcoming = edges.map((edge) => {
      const node = edge.node;
      const venue = node.venue;
      return {
        title: node.title,
        description: node.description?.replace(/<[^>]*>/g, "").substring(0, 200),
        date: node.dateTime,
        location: venue
          ? `${venue.name}, ${venue.address}, ${venue.city}`
          : "TBD",
        url: node.eventUrl,
        attendeeCount: node.going,
      };
    });

    console.log(`[meetup.js] Fetched ${upcoming.length} upcoming events`);
    return { upcoming };
  } catch (err) {
    console.log(`[meetup.js] Error: ${err.message}, using upcoming.json fallback`);
    return { upcoming: null };
  }
};
```

- [ ] **Step 3: Run build to verify data loads**

```bash
npm run build
```

Expected: Build succeeds. Console may show either the scraper succeeding or falling back. Either is fine — the template will handle both.

- [ ] **Step 4: Commit**

```bash
git add src/_data/upcoming.json src/_data/meetup.js
git commit -m "feat: add upcoming events data layer with Meetup scraper fallback"
```

---

### Task 4: Homepage

**Files:**
- Modify: `src/index.njk`

- [ ] **Step 1: Build the homepage template**

Replace the contents of `src/index.njk`:

```njk
---
layout: base.njk
title: Home
breadcrumb: index.html
---

{# Resolve upcoming events: prefer scraper data, fall back to JSON file #}
{% set events = meetup.upcoming or upcoming %}

{# --- NEXT EVENT --- #}
<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4<br>5<br>6<br>7</div>
  <div class="section-content">
    <div class="section-comment">// NEXT EVENT</div>

    {% if events and events.length %}
      {% set event = events[0] %}
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px; line-height: 1.3;">{{ event.title }}</h1>
      <p style="color: var(--subtext0); margin-bottom: 16px;">{{ event.description }}</p>
      <div class="kv-meta" style="margin-bottom: 24px;">
        <span><span class="key">date</span>=<span class="value">"{{ event.date | dateFormat }}"</span></span>
        <span><span class="key">time</span>=<span class="value">"{{ event.date | timeFormat }}"</span></span>
        <span><span class="key">loc</span>=<span class="value">"{{ event.location }}"</span></span>
      </div>
      <a href="{{ event.url }}" class="btn-primary" target="_blank" rel="noopener">RSVP on Meetup →</a>
    {% else %}
      <p style="color: var(--subtext0);">No upcoming events scheduled. <a href="{{ site.meetup_url }}" target="_blank" rel="noopener">Check our Meetup page</a> for updates.</p>
    {% endif %}
  </div>
</div>

{# --- README --- #}
<div class="content-section">
  <div class="line-gutter" aria-hidden="true">9<br>10<br>11<br>12</div>
  <div class="section-content">
    <div class="section-comment">// README</div>
    <div class="readme-card">
      <h3>Detroit Software Developers</h3>
      <p>Get "hooked" into the Detroit Software Developer community! Whether you're a curious beginner or a seasoned developer, designer or product manager — this community is welcome to all who are interested in Software Development &amp; Software Startups in Detroit.</p>
      <div class="readme-stats">
        <span style="color: var(--green);">● 748 members</span>
        <span style="color: var(--blue);">● monthly meetups</span>
        <span style="color: var(--pink);">● downtown detroit</span>
      </div>
    </div>
  </div>
</div>

{# --- RECENT POSTS --- #}
<div class="content-section">
  <div class="line-gutter" aria-hidden="true">14<br>15<br>16<br>17</div>
  <div class="section-content">
    <div class="section-comment">// RECENT POSTS</div>

    {% if collections.posts.length %}
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 700px;">
        {% for post in collections.posts.slice(0, 3) %}
          <a href="{{ post.url }}" class="card" style="display: flex; justify-content: space-between; align-items: center; text-decoration: none;">
            <div>
              <div class="card-title">{{ post.data.title }}</div>
              <div class="card-meta">{{ post.date | dateFormat }} · {{ post.content | readingTime }}</div>
            </div>
            <span style="color: var(--subtext0); font-size: 18px;">→</span>
          </a>
        {% endfor %}
      </div>
    {% else %}
      <p style="color: var(--subtext0);">No blog posts yet. Check back soon!</p>
    {% endif %}
  </div>
</div>
```

Note: `collections.posts` is already sorted newest-first by the config. `.slice(0, 3)` gives us the 3 most recent.

- [ ] **Step 2: Run dev server and verify in browser**

```bash
npm run dev
```

Open `http://localhost:8080`. Verify:
- Next event section shows the Agentic Software Development event with RSVP button
- README card shows community description with colored stats
- Recent posts section shows "No blog posts yet" (we haven't added any posts)
- All sections have code comment headers (`// NEXT EVENT`, etc.)
- Line number gutter visible on desktop

- [ ] **Step 3: Commit**

```bash
git add src/index.njk
git commit -m "feat: build homepage with next event hero, README blurb, and recent posts"
```

---

## Chunk 3: Events Pages

### Task 5: Events Listing Page

**Files:**
- Create: `src/events.njk`

- [ ] **Step 1: Create the events listing template**

```njk
---
layout: base.njk
title: Events
breadcrumb: events.html
permalink: /events/
---

{# Resolve upcoming events: prefer scraper data, fall back to JSON file #}
{% set upcomingEvents = meetup.upcoming or upcoming %}

{# --- UPCOMING --- #}
<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4</div>
  <div class="section-content">
    <div class="section-comment">// UPCOMING</div>

    {% if upcomingEvents and upcomingEvents.length %}
      <div style="display: flex; flex-direction: column; gap: 16px; max-width: 700px;">
        {% for event in upcomingEvents %}
          <div class="event-card event-card--upcoming">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
              <div style="flex: 1; min-width: 200px;">
                <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 8px;">{{ event.title }}</h2>
                <p style="color: var(--subtext0); font-size: 14px; margin-bottom: 12px;">{{ event.description }}</p>
              </div>
              <span class="event-badge">NEXT UP</span>
            </div>
            <div class="event-meta" style="margin-bottom: 16px;">
              <span>📅 {{ event.date | dateFormat }}</span>
              <span>📍 {{ event.location }}</span>
              {% if event.attendeeCount %}
                <span>👥 {{ event.attendeeCount }} attending</span>
              {% endif %}
            </div>
            <a href="{{ event.url }}" class="btn-primary" target="_blank" rel="noopener">RSVP on Meetup →</a>
          </div>
        {% endfor %}
      </div>
    {% else %}
      <p style="color: var(--subtext0);">No upcoming events. <a href="{{ site.meetup_url }}" target="_blank" rel="noopener">Check our Meetup page</a> for updates.</p>
    {% endif %}
  </div>
</div>

{# --- PAST EVENTS --- #}
<div class="content-section">
  <div class="line-gutter" aria-hidden="true">6<br>7<br>8<br>9<br>10<br>11<br>12</div>
  <div class="section-content">
    <div class="section-comment">// PAST EVENTS</div>

    {% if collections.events.length %}
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 700px;">
        {% for event in collections.events %}
          <a href="{{ event.url }}" class="card" style="text-decoration: none;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <div class="card-title" style="color: var(--text); font-weight: 500;">{{ event.data.title }}</div>
                <div class="card-meta" style="display: flex; gap: 16px; flex-wrap: wrap;">
                  <span>{{ event.date | dateFormat }}</span>
                  {% if event.data.attendees %}
                    <span>{{ event.data.attendees }} attended</span>
                  {% endif %}
                  {% if event.data.video %}
                    <span style="color: var(--blue);">🎥 video</span>
                  {% endif %}
                  {% if event.data.photos %}
                    <span style="color: var(--yellow);">📷 photos</span>
                  {% endif %}
                </div>
              </div>
              <span style="color: var(--subtext0); font-size: 18px; flex-shrink: 0;">→</span>
            </div>
          </a>
        {% endfor %}
      </div>
    {% else %}
      <p style="color: var(--subtext0);">No past events recorded yet.</p>
    {% endif %}
  </div>
</div>
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Open `http://localhost:8080/events/`. Verify:
- Upcoming section shows event with green left border and NEXT UP badge
- Past events section shows "No past events recorded yet" (none added yet)

- [ ] **Step 3: Commit**

```bash
git add src/events.njk
git commit -m "feat: add events listing page with upcoming and past events sections"
```

---

### Task 6: Event Detail Layout & Sample Event

**Files:**
- Create: `src/_includes/event.njk`
- Create: `src/events/2025-10-15-sboms-frontend.md`

- [ ] **Step 1: Create the event detail layout**

Create `src/_includes/event.njk`:

```njk
---
layout: base.njk
breadcrumb: events / {{ title | slug }}.md
---

<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4<br>5</div>
  <div class="section-content">
    <div class="section-comment">// EVENT DETAILS</div>

    <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">{{ title }}</h1>
    <div class="event-meta" style="margin-bottom: 24px;">
      <span>📅 {{ date | dateFormat }}</span>
      <span>📍 {{ location }}</span>
      {% if attendees %}
        <span>👥 {{ attendees }} attended</span>
      {% endif %}
    </div>

    {% if video %}
      <div class="video-embed">
        <iframe
          src="{{ video | replace('watch?v=', 'embed/') | replace('youtu.be/', 'youtube.com/embed/') }}"
          title="{{ title }} — Video Recording"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    {% endif %}

    {% if photos %}
      <h3 style="margin-top: 24px; margin-bottom: 12px; font-size: 16px;">Photos</h3>
      <div class="photo-gallery">
        {% for photo in photos %}
          <a href="{{ photo }}" target="_blank">
            <img src="{{ photo }}" alt="Photo from {{ title }}" loading="lazy">
          </a>
        {% endfor %}
      </div>
    {% endif %}

    {% if content | trim %}
      <div class="prose" style="margin-top: 24px;">
        {{ content | safe }}
      </div>
    {% endif %}

    {% if meetup_url %}
      <a href="{{ meetup_url }}" class="btn-primary" style="margin-top: 24px;" target="_blank" rel="noopener">View on Meetup →</a>
    {% endif %}
  </div>
</div>
```

- [ ] **Step 2: Create a sample past event**

Create `src/events/2025-10-15-sboms-frontend.md`:

```markdown
---
layout: event.njk
title: "SBOMs for Frontend Developers & Code-Level Observability"
date: 2025-10-15
location: "The Madison Loft, Detroit"
attendees: 21
video: "https://youtube.com/watch?v=dQw4w9WgXcQ"
photos:
meetup_url: "https://www.meetup.com/detroit-developers/events/"
permalink: /events/{{ page.fileSlug }}/
---

A deep dive into Software Bill of Materials (SBOMs) and why they matter for frontend developers, followed by an exploration of code-level observability tools.
```

- [ ] **Step 3: Run dev server and verify**

```bash
npm run dev
```

Verify:
- `/events/` now lists the SBOM event under Past Events with video indicator
- `/events/2025-10-15-sboms-frontend/` shows the detail page with video embed, metadata, and recap text
- Sidebar shows the event file under events/

- [ ] **Step 4: Commit**

```bash
git add src/_includes/event.njk src/events/2025-10-15-sboms-frontend.md
git commit -m "feat: add event detail layout and sample past event"
```

---

## Chunk 4: Blog & Remaining Pages

### Task 7: Blog Listing & Post Layout

**Files:**
- Create: `src/blog.njk`
- Create: `src/_includes/post.njk`
- Create: `src/posts/2026-03-10-getting-started-ai-agents.md`

- [ ] **Step 1: Create blog listing page**

Create `src/blog.njk`:

```njk
---
layout: base.njk
title: Blog
breadcrumb: blog.html
permalink: /blog/
---

<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4<br>5</div>
  <div class="section-content">
    <div class="section-comment">// ALL POSTS</div>

    {% if collections.posts.length %}
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 700px;">
        {% for post in collections.posts %}
          <a href="{{ post.url }}" class="card" style="display: flex; justify-content: space-between; align-items: center; text-decoration: none;">
            <div>
              <div class="card-title">{{ post.data.title }}</div>
              <div class="card-meta">
                {{ post.date | dateFormat }}
                {% if post.data.author %} · {{ post.data.author }}{% endif %}
                · {{ post.content | readingTime }}
              </div>
              {% if post.data.excerpt %}
                <p style="color: var(--subtext0); font-size: 14px; margin-top: 8px;">{{ post.data.excerpt }}</p>
              {% else %}
                <p style="color: var(--subtext0); font-size: 14px; margin-top: 8px;">{{ post.content | excerpt }}</p>
              {% endif %}
            </div>
            <span style="color: var(--subtext0); font-size: 18px; flex-shrink: 0; margin-left: 16px;">→</span>
          </a>
        {% endfor %}
      </div>
    {% else %}
      <p style="color: var(--subtext0);">No blog posts yet. Check back soon!</p>
    {% endif %}
  </div>
</div>
```

- [ ] **Step 2: Create blog post layout**

Create `src/_includes/post.njk`:

```njk
---
layout: base.njk
breadcrumb: posts / {{ title | slug }}.md
---

<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4</div>
  <div class="section-content">
    <div class="section-comment">// {{ title | upper }}</div>

    <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">{{ title }}</h1>
    <div class="card-meta" style="margin-bottom: 32px;">
      {{ date | dateFormat }}
      {% if author %} · {{ author }}{% endif %}
      · {{ content | readingTime }}
    </div>

    <div class="prose">
      {{ content | safe }}
    </div>
  </div>
</div>
```

- [ ] **Step 3: Create a sample blog post**

Create `src/posts/2026-03-10-getting-started-ai-agents.md`:

```markdown
---
layout: post.njk
title: "Getting Started with AI Agents in Production"
date: 2026-03-10
author: "Phil"
excerpt: "A primer on deploying AI agents in real-world applications."
permalink: /blog/{{ page.fileSlug }}/
---

AI agents are transforming how we build software. In this post, we'll explore the fundamentals of deploying AI agents in production environments.

## What Are AI Agents?

AI agents are autonomous systems that can perceive their environment, make decisions, and take actions to achieve specific goals. Unlike traditional chatbots, agents can use tools, maintain state across interactions, and handle multi-step workflows.

## Key Considerations

When deploying AI agents in production, there are several important factors to keep in mind:

- **Reliability** — Agents need fallback strategies when tool calls fail
- **Observability** — You need to see what decisions the agent is making and why
- **Cost management** — Token usage can scale quickly with complex agent workflows
- **Safety** — Guardrails and human-in-the-loop patterns are essential

## Getting Started

The simplest way to start is with a single-purpose agent that handles one well-defined task. From there, you can expand to multi-agent architectures as your confidence grows.

Stay tuned for our upcoming panel discussion on Agentic Software Development on March 23rd!
```

- [ ] **Step 4: Run dev server and verify**

```bash
npm run dev
```

Verify:
- `/blog/` shows the blog listing with the sample post card (title, date, author, reading time, excerpt)
- `/blog/2026-03-10-getting-started-ai-agents/` shows the full post with prose styling
- Homepage now shows the post under "RECENT POSTS"
- Sidebar shows the post under posts/

- [ ] **Step 5: Commit**

```bash
git add src/blog.njk src/_includes/post.njk src/posts/2026-03-10-getting-started-ai-agents.md
git commit -m "feat: add blog listing, post layout, and sample blog post"
```

---

### Task 8: About Page

**Files:**
- Create: `src/about.njk`

- [ ] **Step 1: Create the about page**

```njk
---
layout: base.njk
title: About
breadcrumb: about.html
---

<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4<br>5<br>6</div>
  <div class="section-content">
    <div class="section-comment">// ABOUT</div>

    <div class="prose" style="max-width: 700px;">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 16px;">Detroit Software Developers</h1>

      <p>Get "hooked" into the Detroit Software Developer community! Whether you're a curious beginner or a seasoned developer, designer or product manager — this community is welcome to all who are interested in Software Development &amp; Software Startups in Detroit.</p>

      <p>Each month we either host a meetup featuring a speaker or workshop on a technical or startup-related topic, or have a happy hour in downtown Detroit.</p>

      <h2>Our Story</h2>
      <p>What started as a React-focused meetup has grown into a broader community covering all aspects of software development — from frontend frameworks and cloud infrastructure to product management and AI.</p>

      <h2>Organizers</h2>
      <p>Detroit Software Developers is organized by community volunteers passionate about building the Detroit tech scene.</p>

      <h2>Connect</h2>
      <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
        <a href="{{ site.meetup_url }}" target="_blank" rel="noopener">→ Join us on Meetup</a>
        <a href="{{ site.linkedin_url }}" target="_blank" rel="noopener">→ Follow on LinkedIn</a>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Run dev server and verify**

```bash
npm run dev
```

Open `/about/`. Verify content renders with prose styling, links work.

- [ ] **Step 3: Commit**

```bash
git add src/about.njk
git commit -m "feat: add about page"
```

---

### Task 9: 404 Page

**Files:**
- Create: `src/404.njk`

- [ ] **Step 1: Create the 404 page**

```njk
---
layout: base.njk
title: "404"
breadcrumb: "404.html"
permalink: /404.html
---

<div class="content-section">
  <div class="line-gutter" aria-hidden="true">1<br>2<br>3<br>4</div>
  <div class="section-content">
    <div class="section-comment" style="color: var(--pink);">// ERROR: FILE NOT FOUND</div>

    <div style="max-width: 500px;">
      <h1 style="font-size: 48px; font-weight: 700; color: var(--pink); margin-bottom: 8px; font-family: var(--font-mono);">404</h1>
      <p style="color: var(--subtext0); font-family: var(--font-mono); font-size: 14px; margin-bottom: 24px;">
        <span style="color: var(--pink);">Error:</span> The requested file could not be found in the workspace.
      </p>
      <div style="background: var(--mantle); border: 1px solid var(--surface0); border-radius: 6px; padding: 16px; font-family: var(--font-mono); font-size: 13px; color: var(--subtext0); margin-bottom: 24px;">
        <div><span style="color: var(--blue);">path</span>=<span style="color: var(--green);">"{{ page.url }}"</span></div>
        <div><span style="color: var(--blue);">status</span>=<span style="color: var(--pink);">404</span></div>
      </div>
      <a href="/" class="btn-primary">← Back to index.html</a>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Run build and verify `_site/404.html` exists**

```bash
npm run build && ls _site/404.html
```

Expected: File exists.

- [ ] **Step 3: Commit**

```bash
git add src/404.njk
git commit -m "feat: add custom 404 page with IDE error styling"
```

---

### Task 10: RSS Feed

**Files:**
- Create: `src/feed.njk`

- [ ] **Step 1: Create RSS feed template**

```njk
---json
{
  "permalink": "/feed.xml",
  "eleventyExcludeFromCollections": true
}
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>{{ site.title }}</title>
  <subtitle>{{ site.description }}</subtitle>
  <link href="{{ site.url }}/feed.xml" rel="self"/>
  <link href="{{ site.url }}/"/>
  <updated>{{ collections.posts | getNewestCollectionItemDate | dateToRfc3339 }}</updated>
  <id>{{ site.url }}/</id>
  {%- for post in collections.posts %}
  <entry>
    <title>{{ post.data.title }}</title>
    <link href="{{ site.url }}{{ post.url }}"/>
    <updated>{{ post.date | dateToRfc3339 }}</updated>
    <id>{{ site.url }}{{ post.url }}</id>
    <content type="html">{{ post.content | htmlToAbsoluteUrls(site.url + post.url) }}</content>
  </entry>
  {%- endfor %}
</feed>
```

- [ ] **Step 2: Run build and verify**

```bash
npm run build && cat _site/feed.xml | head -20
```

Expected: Valid XML with the sample blog post as an entry.

- [ ] **Step 3: Commit**

```bash
git add src/feed.njk
git commit -m "feat: add RSS/Atom feed for blog posts"
```

---

## Chunk 5: Polish & Verification

### Task 11: Add More Sample Content

**Files:**
- Create: `src/events/2025-09-18-pm-talk.md`
- Create: `src/events/2025-08-20-ai-k8s.md`

Adding more sample events to verify the listing page looks correct with multiple items.

- [ ] **Step 1: Create second sample event**

Create `src/events/2025-09-18-pm-talk.md`:

```markdown
---
layout: event.njk
title: "Keep Projects on Track — PMing Software Products"
date: 2025-09-18
location: "The Madison Loft, Detroit"
attendees: 10
meetup_url: "https://www.meetup.com/detroit-developers/events/"
permalink: /events/{{ page.fileSlug }}/
---

A talk on product management practices for software teams, covering roadmapping, stakeholder communication, and agile methodologies.
```

- [ ] **Step 2: Create third sample event**

Create `src/events/2025-08-20-ai-k8s.md`:

```markdown
---
layout: event.njk
title: "AI Agents for Kubernetes & Building On-chain with Alchemy"
date: 2025-08-20
location: "The Madison Loft, Detroit"
attendees: 29
video: "https://youtube.com/watch?v=dQw4w9WgXcQ"
meetup_url: "https://www.meetup.com/detroit-developers/events/"
permalink: /events/{{ page.fileSlug }}/
---

A double-header featuring AI-powered Kubernetes management and Web3 development with Alchemy's platform.
```

- [ ] **Step 3: Run dev server and verify all pages**

```bash
npm run dev
```

Walk through every page:
- **`/`** — Hero with upcoming event, README card, recent posts list
- **`/events/`** — Upcoming event with badge, 3 past events with correct indicators
- **`/events/2025-10-15-sboms-frontend/`** — Detail page with video embed
- **`/events/2025-09-18-pm-talk/`** — Detail page without video
- **`/events/2025-08-20-ai-k8s/`** — Detail page with video
- **`/blog/`** — Blog listing with sample post
- **`/blog/2026-03-10-getting-started-ai-agents/`** — Full blog post
- **`/about/`** — About page with links
- **Sidebar** — All pages, posts, and events listed correctly
- **Responsive** — Resize to mobile: sidebar hidden, hamburger works, no line numbers

- [ ] **Step 4: Commit**

```bash
git add src/events/
git commit -m "feat: add sample past events for events listing"
```

---

### Task 12: Final Build Verification

- [ ] **Step 1: Clean build**

```bash
rm -rf _site && npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify output structure**

```bash
find _site -type f | sort
```

Expected files:
```
_site/404.html
_site/about/index.html
_site/assets/css/style.css
_site/blog/2026-03-10-getting-started-ai-agents/index.html
_site/blog/index.html
_site/events/2025-08-20-ai-k8s/index.html
_site/events/2025-09-18-pm-talk/index.html
_site/events/2025-10-15-sboms-frontend/index.html
_site/events/index.html
_site/feed.xml
_site/index.html
```

- [ ] **Step 3: Commit any final adjustments**

```bash
git status
```

If there are any uncommitted changes, stage and commit them.

- [ ] **Step 4: Final commit — mark project as ready**

```bash
git log --oneline
```

Verify commit history is clean and each commit represents a logical unit of work.
