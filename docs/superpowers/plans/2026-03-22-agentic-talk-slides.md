# Agentic Talk Slides — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the 35-slide presentation for Phil's April 16 talk "Agentic Software Development: Advanced Practitioner's Guide" as a Nunjucks slides page.

**Architecture:** One new file (`src/slides-agentic-advanced-practitioners-guide.njk`) that includes the 3 shared default slides via `{% include "slides-default.njk" %}` then adds 32 talk-specific slides. The event page frontmatter gets a `slides:` field pointing to the new URL. All slide CSS already exists in `src/assets/css/slides.css`.

**Tech Stack:** Eleventy 11ty, Nunjucks, existing `slides-layout.njk` layout, existing CSS classes (`.question-slide`, `.question-text`, `.question-text--large`, `.question-bullets`, `.question-bullets li.sub-note`).

---

## Reference: Slide Numbering

| Slides | Source |
|---|---|
| 1–3 | `{% include "slides-default.njk" %}` (welcome, sponsors, organizers) |
| 4–7 | Intro |
| 8–13 | Act 1: AI Is an Amplifier |
| 14–19 | Act 2: Code Quality Is Harness Quality |
| 20–28 | Act 3: Harness Engineering |
| 29–32 | Act 4: Multi-Agent Reality Check |
| 33–35 | Close |

`slideTotal = 35`

## Reference: Reusable Slide Shell

Every slide follows this structure. Copy it and fill in `N`, `ide-comment text`, `filename.md`, and `.slide-content` children:

```html
<div class="slide" id="slide-N">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// SECTION</div>
    <!-- content here -->
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● filename.md</span>
    <div class="slide-status-right">
      <span>N / 35</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

## Reference: Content Patterns

**Large solo question (no bullets):**
```html
<div class="question-slide">
  <div class="question-text question-text--large">The question or statement text.</div>
</div>
```

**Question + bullets:**
```html
<div class="question-slide">
  <div class="question-text">Heading text</div>
  <ul class="question-bullets">
    <li>Bullet one</li>
    <li>Bullet two</li>
    <li class="sub-note">Italic note item</li>
  </ul>
</div>
```

---

## Files

- **Create:** `src/slides-agentic-advanced-practitioners-guide.njk`
- **Modify:** `src/events/2026-04-16-agentic-advanced-practitioners-guide.md` (add `slides:` frontmatter)

---

## Task 1: Scaffold the file

- [ ] Create `src/slides-agentic-advanced-practitioners-guide.njk` with this exact content:

```njk
---
layout: slides-layout.njk
title: Agentic Software Development: Advanced Practitioner's Guide — Slides
permalink: /slides/agentic-advanced-practitioners-guide/
---

{% set slideTotal = 35 %}

<div class="slideshow" id="slideshow">
  {% include "slides-default.njk" %}

  {# ── Intro ── #}

  {# ── Act 1: AI Is an Amplifier ── #}

  {# ── Act 2: Code Quality Is Harness Quality ── #}

  {# ── Act 3: Harness Engineering ── #}

  {# ── Act 4: Multi-Agent Reality Check ── #}

  {# ── Close ── #}

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

  showSlide(getHashIndex());

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      if (current < total - 1) showSlide(current + 1);
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      if (current > 0) showSlide(current - 1);
    }
  });

  document.getElementById('slideshow').addEventListener('click', function () {
    if (current < total - 1) showSlide(current + 1);
  });
})();
</script>
```

- [ ] Run `npm run dev` and confirm `/slides/agentic-advanced-practitioners-guide/` loads (shows default 3 slides)
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: scaffold agentic advanced talk slides"`

---

## Task 2: Intro slides (4–7)

Replace `{# ── Intro ── #}` with:

- [ ] Add slide 4 — Title

```html
{# ── Slide 4: Title ── #}
<div class="slide" id="slide-4">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// intro</div>
    <div>
      <div class="opener-title" style="font-size: clamp(32px, 5vw, 72px);">Agentic Software<br><span class="accent">Development</span></div>
      <div class="opener-subtitle">Advanced Practitioner's Guide&nbsp;<span class="cursor"></span></div>
      <div class="opener-subtitle" style="margin-top: 8px; font-size: clamp(11px, 1.2vw, 16px);">Phil Borel · RIVET · Detroit Developers · April 2026</div>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● title.md</span>
    <div class="slide-status-right">
      <span>4 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 5 — Honest Framing

```html
{# ── Slide 5: Honest Framing ── #}
<div class="slide" id="slide-5">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// intro</div>
    <div class="question-slide">
      <div class="question-text question-text--large">"A working case study.<br>Not a success story.<br><span style="color: var(--subtext0);">Yet.</span>"</div>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● framing.md</span>
    <div class="slide-status-right">
      <span>5 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 6 — What Does 3x Even Mean?

```html
{# ── Slide 6: What Does 3x Mean? ── #}
<div class="slide" id="slide-6">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// intro</div>
    <div class="question-slide">
      <div class="question-text">What does 3x even mean?</div>
      <ul class="question-bullets">
        <li><strong style="color: var(--blue);">Vibes</strong> — execs feel like we shipped 3x the value</li>
        <li><strong style="color: var(--green);">Metrics</strong> — DORA numbers (Velocity balanced by Quality), PR throughput, features shipped</li>
        <li><strong style="color: var(--pink);">Outcomes</strong> — users get more value more quickly</li>
        <li class="sub-note">All three matter. None is sufficient alone.</li>
        <li class="sub-note">Risk: 10x some metrics while seeing modest gains on outcomes</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● what-is-3x.md</span>
    <div class="slide-status-right">
      <span>6 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 7 — The Wrong 20%

```html
{# ── Slide 7: The Wrong 20% ── #}
<div class="slide" id="slide-7">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// intro</div>
    <div class="question-slide">
      <div class="question-text">AI compresses the 20%. The hard part is the 80%.</div>
      <ul class="question-bullets">
        <li>Writing code was always 20% of the work</li>
        <li>Testing, refining, validating — always 80%</li>
        <li>10x on 20% doesn't get you to 3x overall</li>
        <li class="sub-note">This talk is about the 80%: spec quality, review process, architectural discipline</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● the-20-percent.md</span>
    <div class="slide-status-right">
      <span>7 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Verify slides 4–7 render correctly in browser
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: add intro slides 4-7"`

---

## Task 3: Act 1 — AI Is an Amplifier (slides 8–13)

Replace `{# ── Act 1: AI Is an Amplifier ── #}` with:

- [ ] Add slide 8 — DORA Headline

```html
{# ── Slide 8: DORA Headline ── #}
<div class="slide" id="slide-8">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-1: ai is an amplifier</div>
    <div class="question-slide">
      <div class="question-text">AI is an amplifier.</div>
      <ul class="question-bullets">
        <li>DORA 2025 — 5,000 professionals, 100+ hours qualitative research</li>
        <li>Magnifies the strengths of high-performing orgs</li>
        <li>Magnifies the dysfunctions of struggling ones</li>
        <li>92% of devs use AI monthly — but outcomes are splitting</li>
        <li class="sub-note">High-performing orgs: 50% fewer customer incidents. Struggling orgs: 2× more. Same tools.</li>
        <li class="sub-note">"AI is moving organizations in different directions." — Laura Tacho, DX</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● dora.md</span>
    <div class="slide-status-right">
      <span>8 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 9 — What It Amplifies

```html
{# ── Slide 9: What It Amplifies ── #}
<div class="slide" id="slide-9">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-1: ai is an amplifier</div>
    <div class="question-slide">
      <div class="question-text">What is AI about to amplify at your org?</div>
      <ul class="question-bullets">
        <li><span style="color: var(--green);">Good architecture</span> → great architecture</li>
        <li><span style="color: var(--pink);">Bad architecture</span> → messy, sprawling code generated at scale</li>
        <li><span style="color: var(--green);">Good specs</span> → accurate, testable implementations</li>
        <li><span style="color: var(--pink);">Vague specs</span> → confidently wrong code that passes tests you didn't write</li>
        <li><span style="color: var(--green);">Consistent patterns</span> → idiomatic output on the first try</li>
        <li><span style="color: var(--pink);">Three divergent patterns</span> → agent picks whichever it saw last, tech debt at speed</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● amplifier.md</span>
    <div class="slide-status-right">
      <span>9 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 10 — CMU Cautionary Data

```html
{# ── Slide 10: CMU Cautionary Data ── #}
<div class="slide" id="slide-10">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-1: ai is an amplifier</div>
    <div class="question-slide">
      <div class="question-text">The velocity gains were real and temporary. The tech debt was real and permanent.</div>
      <ul class="question-bullets">
        <li>CMU — 807 repos after Cursor adoption</li>
        <li>281% increase in lines added, month one</li>
        <li>Month two: velocity gains gone, back to baseline</li>
        <li>Static analysis warnings +30%, code complexity +41% — permanently</li>
        <li>Complexity increase → ~65% drop in future velocity</li>
        <li class="sub-note">"Slop creep" — Boris Tane: individually reasonable, collectively destructive</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● cautionary-data.md</span>
    <div class="slide-status-right">
      <span>10 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 11 — Taste × Discipline × Leverage

```html
{# ── Slide 11: Taste x Discipline x Leverage ── #}
<div class="slide" id="slide-11">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-1: ai is an amplifier</div>
    <div class="question-slide">
      <div class="question-text">Taste × Discipline × Leverage <span style="font-weight: 400; font-size: 0.6em; color: var(--subtext0);">— multiplicative, not additive</span></div>
      <ul class="question-bullets">
        <li><strong style="color: var(--blue);">Taste</strong> — when generation is free, knowing what's worth generating is the scarce skill</li>
        <li><strong style="color: var(--green);">Discipline</strong> — specs before prompts, tests before shipping, reviews before merging</li>
        <li class="sub-note">Teams skipping discipline are reporting production disasters — Cortex 2026: incidents/PR up 23.5%</li>
        <li><strong style="color: var(--pink);">Leverage</strong> — small teams, stacked PRs, agent orchestration, design engineers eliminating handoffs</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● framework.md</span>
    <div class="slide-status-right">
      <span>11 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 12 — Amazon and Anthropic

```html
{# ── Slide 12: Amazon and Anthropic ── #}
<div class="slide" id="slide-12">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-1: ai is an amplifier</div>
    <div class="question-slide">
      <div class="question-text">This isn't theoretical.</div>
      <ul class="question-bullets">
        <li>Amazon retail: spike in outages from AI-assisted changes → senior sign-off mandate for junior/mid engineers</li>
        <li>Anthropic's own website shipped a basic regression affecting every paying customer — 80%+ generated with Claude Code</li>
        <li>"I don't think we're even trading this off to move faster. I think we're moving at a normal pace." — OpenCode CEO</li>
        <li class="sub-note">Discipline is what separates teams that sustain from teams that crash</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● reality-check.md</span>
    <div class="slide-status-right">
      <span>12 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 13 — The Implication

```html
{# ── Slide 13: The Implication ── #}
<div class="slide" id="slide-13">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-1: ai is an amplifier</div>
    <div class="question-slide">
      <div class="question-text question-text--large">Best practices matter <em>more</em> with AI, not less.</div>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● implication.md</span>
    <div class="slide-status-right">
      <span>13 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Verify slides 8–13 render correctly
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: add act 1 slides 8-13"`

---

## Task 4: Act 2 — Code Quality Is Harness Quality (slides 14–19)

Replace `{# ── Act 2: Code Quality Is Harness Quality ── #}` with:

- [ ] Add slide 14 — Environment Is the Bottleneck

```html
{# ── Slide 14: Environment Is the Bottleneck ── #}
<div class="slide" id="slide-14">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-2: code quality is harness quality</div>
    <div class="question-slide">
      <div class="question-text">The bottleneck is the environment, not the model.</div>
      <ul class="question-bullets">
        <li>OpenAI harness engineering: 3 engineers (later 7), ~1M lines, 1,500 PRs, zero hand-written code</li>
        <li>When the agent fails: "what capability is missing, and how do we make it legible and enforceable?"</li>
        <li>Failures are harness problems, not prompt problems</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● environment.md</span>
    <div class="slide-status-right">
      <span>14 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 15 — Refactoring Is AI Infrastructure

```html
{# ── Slide 15: Refactoring Is AI Infrastructure ── #}
<div class="slide" id="slide-15">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-2: code quality is harness quality</div>
    <div class="question-slide">
      <div class="question-text question-text--large">Refactoring is AI infrastructure — not cleanup.</div>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● refactoring.md</span>
    <div class="slide-status-right">
      <span>15 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 16 — RIVET Backend

```html
{# ── Slide 16: RIVET Backend ── #}
<div class="slide" id="slide-16">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-2: code quality is harness quality</div>
    <div class="question-slide">
      <div class="question-text">RIVET: backend layered architecture</div>
      <ul class="question-bullets">
        <li>Three divergent patterns → one: <span style="color: var(--blue);">DB → Model → Repository → Service → Controller → Router</span></li>
        <li>Each layer: one clear responsibility, one clear contract with adjacent layers</li>
        <li>Defense-in-depth permissions at router, controller, and service levels</li>
        <li class="sub-note">Agent can't accidentally create an unprotected endpoint — the pattern enforces security</li>
        <li class="sub-note">Maps closely to OpenAI's enforced architecture. Not a coincidence.</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● backend.md</span>
    <div class="slide-status-right">
      <span>16 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 17 — RIVET Frontend

```html
{# ── Slide 17: RIVET Frontend ── #}
<div class="slide" id="slide-17">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-2: code quality is harness quality</div>
    <div class="question-slide">
      <div class="question-text">RIVET: frontend state migration</div>
      <ul class="question-bullets">
        <li>Legacy: load full app state upfront, apply incremental updates</li>
        <li>Problem: sluggish loads, global state — hard for humans <em>and</em> agents</li>
        <li>New: fetch data when and where needed, local component state, explicit dependencies</li>
        <li>Smaller blast radius per change — agent can work in one area without breaking adjacent ones</li>
        <li class="sub-note">Two goals: better UX for users + a codebase Claude can work in safely</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● frontend.md</span>
    <div class="slide-status-right">
      <span>17 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 18 — Mechanical Enforcement

```html
{# ── Slide 18: Mechanical Enforcement ── #}
<div class="slide" id="slide-18">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-2: code quality is harness quality</div>
    <div class="question-slide">
      <div class="question-text">Mechanical enforcement &gt; documentation</div>
      <ul class="question-bullets">
        <li>OpenAI: encoded architectural rules as custom linters, not prose</li>
        <li>Linter error messages written as remediation instructions — every violation teaches the agent how to fix it</li>
        <li>Rules that feel heavy in human-first workflows become multipliers with agents — apply everywhere at once</li>
        <li class="sub-note">Documentation drifts. Lint rules don't.</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● enforcement.md</span>
    <div class="slide-status-right">
      <span>18 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 19 — The Caveat

```html
{# ── Slide 19: The Caveat ── #}
<div class="slide" id="slide-19">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-2: code quality is harness quality</div>
    <div class="question-slide">
      <div class="question-text question-text--large">Rules without refactoring are aspirations, not enforcement.</div>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● caveat.md</span>
    <div class="slide-status-right">
      <span>19 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Verify slides 14–19 render correctly
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: add act 2 slides 14-19"`

---

## Task 5: Act 3 — Harness Engineering (slides 20–28)

Replace `{# ── Act 3: Harness Engineering ── #}` with:

- [ ] Add slide 20 — From Prompting to Context Engineering

```html
{# ── Slide 20: From Prompting to Context Engineering ── #}
<div class="slide" id="slide-20">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">From prompting to context engineering</div>
      <ul class="question-bullets">
        <li><strong style="color: var(--subtext0);">Prompting</strong> — telling an AI what to do in a single interaction</li>
        <li><strong style="color: var(--blue);">Context engineering</strong> — building the persistent, structured context that makes an agent reliably useful over time, across a whole team</li>
        <li class="sub-note">CLAUDE.md is where this starts — but the real harness extends into linters, tests, CI gates, observability, and automated maintenance</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● context-engineering.md</span>
    <div class="slide-status-right">
      <span>20 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 21 — CLAUDE.md

```html
{# ── Slide 21: CLAUDE.md ── #}
<div class="slide" id="slide-21">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">CLAUDE.md: map, not encyclopedia</div>
      <ul class="question-bullets">
        <li>A large instruction file actively degrades agent performance — crowds out the task</li>
        <li>When everything is "important," agents fall back to local pattern-matching</li>
        <li>~100 lines max — structured as a map with pointers to deeper sources of truth</li>
        <li>Checked into the repo. Reviewed in PRs. Evolved alongside the codebase.</li>
        <li class="sub-note">Team artifact, not personal config</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● claude-md.md</span>
    <div class="slide-status-right">
      <span>21 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 22 — PILRs

```html
{# ── Slide 22: PILRs ── #}
<div class="slide" id="slide-22">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">PILRs: context that accumulates</div>
      <ul class="question-bullets">
        <li><strong style="color: var(--blue);">Persistent Indexed Learning Repos</strong> — structured knowledge bases the agent can reference</li>
        <li>index.json maps topics → documentation files. Agent loads what it needs, not everything.</li>
        <li>PILRs grow as the agent works — organic accumulation vs. upfront documentation</li>
        <li>Goal: "generic coding assistant" → "specialist who knows how our platform is built"</li>
        <li class="sub-note">Addresses the cold-start problem. You don't have to document everything upfront.</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● pilrs.md</span>
    <div class="slide-status-right">
      <span>22 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 23 — Rules and Hooks

```html
{# ── Slide 23: Rules and Hooks ── #}
<div class="slide" id="slide-23">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">Rules and hooks</div>
      <ul class="question-bullets">
        <li><strong style="color: var(--blue);">Rules</strong> — constraints the agent follows automatically: coding standards, naming patterns, always/never</li>
        <li><strong style="color: var(--green);">Hooks</strong> — automated actions triggered by agent behavior: linters after generation, auto-formatting</li>
        <li>Together: continuous mechanical enforcement, everywhere at once, without human attention</li>
        <li class="sub-note">At RIVET: rules in progress, hooks on the roadmap</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● rules-hooks.md</span>
    <div class="slide-status-right">
      <span>23 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 24 — Skills

```html
{# ── Slide 24: Skills ── #}
<div class="slide" id="slide-24">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">Skills: making agent usage programmable</div>
      <ul class="question-bullets">
        <li>Reusable packaged workflows — complex multi-step processes become a single command</li>
        <li>At RIVET: /review-pr, /implement, /update-project-docs, bug-fix skills, PILR builders, commit rewriter</li>
        <li>Skills are team assets: versioned, shared, improved over time</li>
        <li class="sub-note">This is where the promises of GenAI for coding start to make real sense</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● skills.md</span>
    <div class="slide-status-right">
      <span>24 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 25 — The /implement Skill

```html
{# ── Slide 25: /implement ── #}
<div class="slide" id="slide-25">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">The /implement skill</div>
      <ul class="question-bullets">
        <li>PRD + Tech Spec → Project Plan (reviewed before code is written)</li>
        <li>Project Plan → Test Plan: automated tests + manual testing steps</li>
        <li>Agent writes code, executes test plan via cURL + Claude Chrome Extension</li>
        <li>Screenshots → gitignored folder → referenced in pr.md</li>
        <li class="sub-note">Honest: ~25% success rate on screenshots. Worth it anyway.</li>
        <li class="sub-note">Start with /review-pr or /commit — not /implement</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● implement-skill.md</span>
    <div class="slide-status-right">
      <span>25 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 26 — Support Bot Agent

```html
{# ── Slide 26: Support Bot Agent ── #}
<div class="slide" id="slide-26">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">The support bot agent: "re-purchased half a developer"</div>
      <ul class="question-bullets">
        <li>Before: ticket → ~20 min understanding + ~20 min finding the code + fix time</li>
        <li>Now: agent triages, reproduces, proposes fix or surfaces what the engineer needs</li>
        <li>Uses a PILR — persistent directory of previously solved problems + index</li>
        <li>Result: support backlog per two-week shift dropped significantly</li>
        <li class="sub-note">Doesn't solve novel architectural bugs — good at "we've seen this pattern before"</li>
        <li class="sub-note">Why it works: the harness came first. Without CLAUDE.md, the agent just guesses.</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● support-bot.md</span>
    <div class="slide-status-right">
      <span>26 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 27 — Spec-Driven Development

```html
{# ── Slide 27: Spec-Driven Development ── #}
<div class="slide" id="slide-27">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">Spec-Driven Development</div>
      <ul class="question-bullets">
        <li>Specify → Plan → Tasks → Implement</li>
        <li>Expanded the "safe delegation window" from 10–20 minute tasks to multi-hour feature delivery</li>
        <li>The harness makes the agent <em>reliable</em>. SDD makes the work product <em>predictable</em>.</li>
        <li>Forces hard thinking to happen before implementation, not during it</li>
        <li class="sub-note">Claude Code's plan mode is built for this workflow</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● sdd.md</span>
    <div class="slide-status-right">
      <span>27 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 28 — 4-Layer Review

```html
{# ── Slide 28: 4-Layer Review ── #}
<div class="slide" id="slide-28">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-3: harness engineering</div>
    <div class="question-slide">
      <div class="question-text">4-layer review</div>
      <ul class="question-bullets">
        <li><strong style="color: var(--blue);">1. Architectural review</strong> — human, before code is written</li>
        <li><strong style="color: var(--green);">2. Automated review</strong> — /review-pr skill, SonarCloud, Copilot review, linting, tests (all in CI)</li>
        <li><strong style="color: var(--peach);">3. Human code review + manual QA</strong> — focused on the feature, based on test steps in the PR</li>
        <li><strong style="color: var(--pink);">4. Full-app UAT/regression</strong> — end of every sprint (working toward replacing with Playwright)</li>
        <li class="sub-note">Unsolved: without ephemeral envs, reviewers contend for shared test servers — gets worse as PR volume increases</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● review.md</span>
    <div class="slide-status-right">
      <span>28 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Verify slides 20–28 render correctly
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: add act 3 slides 20-28"`

---

## Task 6: Act 4 — Multi-Agent Reality Check (slides 29–32)

Replace `{# ── Act 4: Multi-Agent Reality Check ── #}` with:

- [ ] Add slide 29 — The Promise

```html
{# ── Slide 29: The Promise ── #}
<div class="slide" id="slide-29">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-4: multi-agent reality check</div>
    <div class="question-slide">
      <div class="question-text">The promise: a fleet of AI collaborators</div>
      <ul class="question-bullets">
        <li>One agent orchestrates many — background agents on separate branches in parallel</li>
        <li>An engineer manages a fleet, not a single assistant</li>
        <li>Cursor is doing this. Ramp. Stripe. Large AI-native companies.</li>
        <li>Orchestration platforms emerging: Coder and others — provisioning environments, coordinating agents across a codebase</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● the-promise.md</span>
    <div class="slide-status-right">
      <span>29 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 30 — Where We Actually Are

```html
{# ── Slide 30: Where We Actually Are ── #}
<div class="slide" id="slide-30">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-4: multi-agent reality check</div>
    <div class="question-slide">
      <div class="question-text">Where we actually are</div>
      <ul class="question-bullets">
        <li><span style="color: var(--green);">✓</span> GitHub Copilot cloud agents</li>
        <li><span style="color: var(--green);">✓</span> Support bot agent — and it's working</li>
        <li><span style="color: var(--subtext0);">~ </span> Running 1–3 local tasks at once — sometimes</li>
        <li>"I've read sensational claims from Ramp and Stripe. We don't have things tuned to that level."</li>
        <li class="sub-note">"I haven't figured out how to multiplex my brain yet."</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● where-we-are.md</span>
    <div class="slide-status-right">
      <span>30 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 31 — What Actually Happened (PLACEHOLDER — Phil fills in)

```html
{# ── Slide 31: What Actually Happened When I Tried ── #}
<div class="slide" id="slide-31">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-4: multi-agent reality check</div>
    <div class="question-slide">
      <div class="question-text">What actually happened when I tried</div>
      <ul class="question-bullets">
        <li><!-- PHIL: describe a specific parallel-agent attempt and where it fell apart --></li>
        <li>Context debt: you need rich structured context in place — we weren't there yet</li>
        <li>Review bottleneck: more agents = more PRs = worse pile-up</li>
        <li>Cognitive load: managing multiple agent threads is a different skill, not just more of the same</li>
        <li class="sub-note">Not that the tools don't work — we hadn't earned the right to use them yet</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● what-happened.md</span>
    <div class="slide-status-right">
      <span>31 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 32 — Honest Summary

```html
{# ── Slide 32: Honest Summary ── #}
<div class="slide" id="slide-32">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// act-4: multi-agent reality check</div>
    <div class="question-slide">
      <div class="question-text">We're in the j-curve. The dip before the improvement.</div>
      <ul class="question-bullets">
        <li>The things that are working are working because of harness investment</li>
        <li>Multi-agent nirvana requires the full harness first — we're not done building it</li>
        <li>This is a living experiment, not a solved problem</li>
        <li class="sub-note">Anyone who tells you they've fully solved this is either Cursor or not telling the whole story</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● honest-summary.md</span>
    <div class="slide-status-right">
      <span>32 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Verify slides 29–32 render correctly
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: add act 4 slides 29-32"`

---

## Task 7: Close (slides 33–35)

Replace `{# ── Close ── #}` with:

- [ ] Add slide 33 — Monday Morning

```html
{# ── Slide 33: Monday Morning ── #}
<div class="slide" id="slide-33">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// close</div>
    <div class="question-slide">
      <div class="question-text">Monday morning</div>
      <ul class="question-bullets">
        <li><strong style="color: var(--blue);">Write a CLAUDE.md</strong> for one repo: tech stack, architecture in two paragraphs, three things you wish every new engineer knew</li>
        <li><strong style="color: var(--green);">Try one skill</strong> — start simple: /review-pr or /commit, not /implement</li>
        <li><strong style="color: var(--pink);">Identify one refactor</strong> that would make your codebase more agent-navigable — put it on the roadmap</li>
        <li class="sub-note">None of this requires a BHAG or an executive mandate</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● monday.md</span>
    <div class="slide-status-right">
      <span>33 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 34 — Resources

```html
{# ── Slide 34: Resources ── #}
<div class="slide" id="slide-34">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// close</div>
    <div class="question-slide">
      <div class="question-text">Further reading</div>
      <ul class="question-bullets">
        <li>DORA AI Capabilities Model (2025) — google.com</li>
        <li>Harness Engineering — OpenAI (Feb 2026)</li>
        <li>Building an Elite AI Engineering Culture — CJ Roth (Feb 2026)</li>
        <li>Are AI Agents Actually Slowing Us Down? — Pragmatic Engineer (Mar 2026)</li>
        <li>Speed at the Cost of Quality — Carnegie Mellon (2026)</li>
        <li class="sub-note">Full blog post with all references: detroitdevelopers.com</li>
        <li class="sub-note">Superpowers plugin for Claude Code: github.com/obra/superpowers</li>
      </ul>
    </div>
  </div>
  <div class="slide-status" aria-hidden="true">
    <span>⑂ main</span>
    <span>● resources.md</span>
    <div class="slide-status-right">
      <span>34 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Add slide 35 — Questions

```html
{# ── Slide 35: Questions ── #}
<div class="slide" id="slide-35">
  <div class="slide-gutter" aria-hidden="true">
    <span>1</span><span>2</span><span>3</span><span>4</span>
    <span>5</span><span>6</span><span>7</span><span>8</span>
  </div>
  <div class="slide-content">
    <div class="ide-comment">// close</div>
    <div>
      <div class="opener-title" style="font-size: clamp(32px, 5vw, 72px);">Questions<span class="cursor"></span></div>
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
    <span>● questions.md</span>
    <div class="slide-status-right">
      <span>35 / {{ slideTotal }}</span>
      <span>Detroit, MI</span>
    </div>
  </div>
</div>
```

- [ ] Verify slides 33–35 render correctly. Navigate through all 35 slides and confirm count is correct.
- [ ] Commit: `git add src/slides-agentic-advanced-practitioners-guide.njk && git commit -m "feat: add close slides 33-35"`

---

## Task 8: Wire up the event page

- [ ] Add `slides:` field to `src/events/2026-04-16-agentic-advanced-practitioners-guide.md` frontmatter:

```yaml
slides: /slides/agentic-advanced-practitioners-guide/
```

- [ ] Navigate to `/events/2026-04-16-agentic-advanced-practitioners-guide/` and confirm the status bar "⬡ slides" link points to `/slides/agentic-advanced-practitioners-guide/`
- [ ] Commit: `git add src/events/2026-04-16-agentic-advanced-practitioners-guide.md && git commit -m "feat: link event page to talk slides"`

---

## Notes

- **Slide 31** has a `<!-- PHIL: ... -->` comment — fill in the concrete parallel-agent failure anecdote before the talk
- All 35 slides use `{{ slideTotal }}` for the denominator in status bars, which resolves from the `{% set slideTotal = 35 %}` at the top of the file
- The `peach` CSS variable is used on slide 28 — verify it exists in `slides.css` (check `:root` block); if not, substitute `var(--blue)`
