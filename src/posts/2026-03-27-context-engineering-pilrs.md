---
layout: post.njk
title: "Agentic Coding: Context Engineering"
date: 2026-03-27
author: "Phil Borel"
excerpt: "Prompting tells an agent what to do once. Context engineering makes agents reliably useful across a whole team - here's how to build it."
permalink: /blog/{{ page.fileSlug }}/
---

*This post expands on the context engineering section of my [Advanced Practitioner's Guide](/blog/2026-03-19-agentic-coding-advanced-guide/) talk. If you haven't read that one, it's worth starting there for the broader picture.*

---

There's a distinction that took me too long to make clearly in my own head: the difference between **prompting** and **context engineering**.

Prompting is telling an AI what to do in a single interaction. It's how most developers start, and it delivers real value - a well-written prompt gets you dramatically better output than a vague one. But prompting is inherently ephemeral. The next session starts from scratch. The next engineer on your team has to figure out the same things you figured out. And an agent working across a complex codebase without persistent context is basically a very smart contractor on their first day, every day.

Context engineering is different. It's building the persistent, structured environment that makes an agent reliably useful over time - across your team, your codebase, and sessions. The agent accumulates knowledge instead of losing it. Behavior becomes consistent instead of probabilistic.

This is where the real leverage is.

---

## The Foundation: CLAUDE.md

Every repository your team works in needs a `CLAUDE.md` - a project-level context document checked into the repo and treated as seriously as any other infrastructure configuration.

The instinct is to make it comprehensive. Resist that. A large instruction file actively degrades agent performance: it crowds out the actual task, and when everything is marked "important," agents fall back to local pattern-matching rather than applying your instructions. Aim for roughly 100 lines. Think of it as a **map, not an encyclopedia** - it tells the agent where to look, not everything the agent needs to know.

A good CLAUDE.md covers:
- Tech stack and the architectural pattern the codebase follows
- A pointer to deeper documentation for each major area
- Three to five things you wish every new engineer knew before touching the codebase
- Explicit do's and don'ts that aren't obvious from the code itself

It's a team artifact - reviewed in PRs, updated when the architecture changes, owned by the team, not any individual. If it lives in someone's personal settings, it's not doing its job.

---

## The Cold-Start Problem

CLAUDE.md solves the immediate context problem. But it doesn't solve the **cold-start problem**: the fact that documenting everything your agent needs to know upfront is an enormous amount of work, and most teams simply won't do it all before they need the agent to be useful.

The cold-start problem is why a lot of teams end up with CLAUDE.md files that are either too sparse to help or too bloated to be effective. They write them once, don't maintain them, and the agent's behavior drifts as the codebase evolves.

PILRs are the answer.

---

## PILRs: Persistent Indexed Learning Repositories

A PILR is a structured knowledge base the agent can reference on demand. The key word is *indexed* - a central `index.json` maps topics to documentation files, so the agent loads what it needs for a given task rather than loading everything every time.

The other key word is *persistent*. PILRs grow as the agent works. When an engineer solves a novel problem, documents a pattern decision, or writes a per-PR plan, that knowledge accumulates in the PILR. The next agent session - or the next engineer - has access to it. Over time, the agent stops behaving like a generic coding assistant and starts behaving like a specialist who knows how your platform is built.

This is the inverse of the upfront documentation approach. You don't have to document everything before you get value. You document as you go, and the value compounds.

### Structure

A minimal PILR looks something like this:

```
docs/
  index.json          ← maps topics to files
  architecture.md     ← how the system is designed
  patterns/
    api-patterns.md
    state-patterns.md
  decisions/
    2026-02-14-auth-refactor.md
    2026-03-10-state-migration.md
  issues/
    solved-problems.md
```

The `index.json` is what makes this work at scale. Without it, agents either load too much (context overflow) or too little (missing what they need). The index lets the agent navigate selectively - pulling the auth patterns when working on auth, the state patterns when touching state management.

---

## Three Implementations

### RIVET: Local PILRs in the repo

At RIVET, PILRs live inside our repos as a `temp/projects` directory. Each feature or significant PR gets a planning document before code is written (more on spec-driven development in a later post), a per-PR plan, and a test plan. These documents serve two audiences: the human reviewing the plan before implementation begins, and the agent referencing the plan while implementing.

The support bot agent shows this in practice. When a support ticket comes in, the agent has access to our CLAUDE.md, our codebase, and a persistent directory of previously solved problems with an index. The agent can identify patterns from past tickets, reproduce issues, and propose fixes - not by reasoning from scratch, but by recognizing "we've seen this pattern before" and applying the documented solution.

Why it works: the harness came first. Without CLAUDE.md and documented patterns, the agent would be guessing. With them, it's operating with genuine knowledge of the system.

### Superpowers: PILRs as a plugin pattern

The [Superpowers plugin for Claude Code](https://github.com/obra/superpowers) formalizes this structure as a first-class concept. Plans and specs live in `docs/superpowers/plans` and `docs/superpowers/specs`, organized so the agent can reference them without loading the whole knowledge base into the context window.

What's interesting about this implementation is that it treats the PILR structure itself as a reusable pattern - something you install, not something you invent from scratch. The plugin handles the indexing and retrieval mechanics so your team can focus on the content.

### Signal Advisors: PILRs via MCP server

Signal Advisors takes the same concept and scales it across multiple repositories. Their agents retrieve PRDs and technical specs from an MCP (Model Context Protocol) server - meaning the domain knowledge doesn't live in any single repo's files, it lives in a purpose-built context delivery system.

The agents get exactly the documentation they need for the task at hand, regardless of which codebase they're working in. This is a more sophisticated delivery mechanism than local files, but the underlying principle is identical: give agents indexed, on-demand access to the knowledge they need to do their job well, without flooding the context window with everything at once.

### Indexer: automated PILR generation

One of the more interesting tools in this space is [Indexer](https://github.com/AndyInternet/indexer) - an AI-powered codebase index generator that uses Tree-sitter AST parsing, code skeleton extraction, and PageRank-based repo mapping to automatically generate structured context from an existing codebase.

This matters for the cold-start problem. If you're starting from a codebase with no documentation, generating an index manually is a significant investment. Indexer reduces that bootstrapping cost by generating a useful starting point automatically - which you then refine over time as the agent works.

---

## Beyond PILRs: Rules, Hooks, and Skills

PILRs and CLAUDE.md are the knowledge layer. The enforcement layer is where context engineering becomes a system rather than a collection of documents.

**Rules** are constraints the agent follows automatically - coding standards, naming patterns, things that should always or never happen. The key insight from OpenAI's harness engineering work: encode these as custom linters with error messages written as remediation instructions. When the agent violates a rule, the linter tells it exactly how to fix the violation. Documentation drifts; lint rules don't.

**Hooks** automate responses to agent behavior - running linters after generation, formatting files after edits, triggering tests after changes. The combination of rules and hooks creates continuous mechanical enforcement: constraints that apply everywhere at once, without human attention.

**Skills** are reusable packaged workflows. Complex multi-step processes - implement a feature from a spec, write and execute a test plan, create a PR with documentation - become a single command that any engineer on the team can invoke. Skills are the point where agent usage becomes programmable, where you stop re-explaining your process every session and start encoding it once.

At RIVET, `/review-pr`, `/implement`, and `/update-project-docs` are the skills we've built so far. The `/implement` skill in particular has expanded the "safe delegation window" - the range of tasks we can hand to an agent with confidence - from 10–20 minute tasks to multi-hour feature delivery.

---

## The System as a Whole

Context engineering isn't a single thing you add to your workflow. It's a system:

- **CLAUDE.md** gives the agent a reliable starting point in every session
- **PILRs** let knowledge accumulate instead of evaporate
- **Rules and linters** enforce patterns mechanically, at scale
- **Hooks** automate the tedious parts of the workflow
- **Skills** make the whole system reusable and programmable

Each layer makes the others more valuable. CLAUDE.md works better when it can point to PILRs for depth. Rules work better when the agent has PILR context to understand *why* the rules exist. Skills work better when they can rely on consistent patterns being enforced by rules.

The goal is an agent that behaves like a senior engineer who knows your codebase - not because you wrote an exhaustive prompt, but because you built an environment where that knowledge accumulates, is enforced, and is accessible on demand.

That's context engineering. It's slower to set up than writing a good prompt. It pays off at a completely different scale.

---

*We'll be going deep on this at the [April Detroit Developers meetup](/events/2026-04-16-agentic-advanced-practitioners-guide/). Come find me there if you want to dig into any of this.*
