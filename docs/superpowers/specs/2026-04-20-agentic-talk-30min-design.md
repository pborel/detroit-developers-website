# Agentic Advanced Practitioner's Guide — 30-Minute Edition

## Goal

Create a 30-minute slide deck for the April 21, 2026 Detroit Developers meetup talk. Focus heavily on the three layers of agentic engineering maturity (technical) with an opening arc on RIVET's 3x journey. The main talk is followed by a live Odradek demo (separate from the deck).

## File plan

- **New:** `src/slides/agentic-advanced-practitioners-guide-30min.njk`
  - permalink: `/slides/agentic-advanced-practitioners-guide-30min/`
  - `draft: true`
  - `slideTotal: 30` (3 default intro slides + 27 content slides)
- **Update:** `src/events/2026-04-21-agentic-advanced-practitioners-guide.md`
  - `slides:` field → `/slides/agentic-advanced-practitioners-guide-30min/`
- **Update:** `src/slides/agentic-advanced-practitioners-guide.njk`
  - Add `draft: true` to frontmatter (preserves the 42-slide long version as a draft)

## Inputs (source material)

- `src/posts/2026-03-19-agentic-coding-advanced-guide.md` — 3x journey, DORA, CMU research, amplifier framing
- `src/posts/2026-04-10-agentic-coding-maturity.md` — three layers, PILRs, Odradek, velocity curves
- `src/slides/agentic-coding-maturity.njk` — 19 slides on the three layers
- `src/slides/agentic-advanced-practitioners-guide.njk` — 42-slide long version
- `src/slides/agentic-advanced-practitioners-guide-20min.njk` — 27-slide compressed version

## Structure (~1 min per slide)

**Opener — RIVET's 3x journey (slides 4-10, ~7 min)**

| # | Slide | Source |
|---|---|---|
| 4 | Title + QR | new |
| 5 | "A working case study. Not a success story. Yet." | 20min S5 |
| 6 | What does 3x mean? (Vibes/Metrics/Outcomes) | long S6 |
| 7 | The wrong 20% — AI compresses 20%, hard part is 80% | long S7 |
| 8 | AI is an amplifier (DORA + CMU combined) | 20min S6 |
| 9 | What AI is about to amplify at your org | long S10 |
| 10 | "Best practices matter *more* with AI, not less." | long S14 |

**Three Layers framework (slides 11-12, ~2 min)**

| # | Slide | Source |
|---|---|---|
| 11 | Act intro: Three Layers of Agentic Maturity | new |
| 12 | Russian doll diagram | maturity S6 |

**Layer 1 — Prompt Engineering (slide 13, ~1 min)**

| # | Slide | Source |
|---|---|---|
| 13 | Prompt Engineering (markdown optimization, ceiling +1x) | maturity S7 |

**Layer 2 — Context Engineering (slides 14-16, ~3 min)**

| # | Slide | Source |
|---|---|---|
| 14 | Context Engineering (PILRs overview, 3 types) | maturity S8 |
| 15 | CLAUDE.md: map, not encyclopedia | long S24 |
| 16 | PILRs in practice (RIVET + Superpowers images) | long S27 |

**Layer 3 — Harness Engineering + Odradek (slides 17-21, ~5 min)**

| # | Slide | Source |
|---|---|---|
| 17 | Harness Engineering (programming around the model, +10x S-curve) | maturity S9 |
| 18 | Harness expands what work gets done *at all* | new |
| 19 | Odradek: Investigate → Fix → Verify → PR (80% one-shot) | maturity S10 (fix 60% → 80%) |
| 20 | Odradek impact (P1/P2/P3) | maturity S10 |
| 21 | Odradek roadmap | maturity S11 |

**Velocity curves + RIVET's position (slides 22-25, ~4 min)**

| # | Slide | Source |
|---|---|---|
| 22 | The Three Ceilings chart | maturity S12 |
| 23 | RIVET on the Prompt curve (near ceiling) | maturity S14 |
| 24 | RIVET on the Context curve (early-mid) | maturity S15 |
| 25 | RIVET on the Harness curve (very early) | maturity S16 |

**Close (slides 26-30, ~4 min)**

| # | Slide | Source |
|---|---|---|
| 26 | Where to invest your tokens | maturity S17 |
| 27 | Unlock Capacity + Capability (takeaway) | maturity S18 |
| 28 | Next week | long S40 (change "Monday morning" → "Next week") |
| 29 | Further reading + blog QR | 20min S27 |
| 30 | Questions + QR | long S42 |

## Editorial decisions

- Blends the two blog posts: 3x amplifier framing from the advanced guide, layered framework + Odradek + velocity curves from the maturity post.
- Use Odradek's **80% one-shot** rate (matches maturity blog post; corrects the 60% in maturity slides).
- No Odradek demo teaser on any slide (live demo follows the talk as a separate segment).
- Cut for time: Spec-Driven Development, 4-layer review, Multi-Agent Reality Check act.
- Minimal act structure: one act intro at slide 11. No "Act 1/2/3/4" headers.
- "Next week" framing instead of "Monday morning" (talk is mid-week).

## Technical/template notes

- Reuse the existing slide layout (`layout: slides-layout.njk`) and `slides-default.njk` include.
- Reuse the click/keyboard navigation script from `agentic-advanced-practitioners-guide-20min.njk` (supports `data-step` strikethrough on slide 15-style stepwise reveals if needed).
- QR codes point to the permalink of this deck and to the maturity blog post.
- All SVG diagrams (Russian doll, velocity curves, three-ceilings chart) are copied verbatim from the maturity deck.
