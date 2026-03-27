---
layout: post.njk
title: "Agentic Coding: Context Engineering with PILRs"
date: 2026-03-27
author: "Phil Borel"
excerpt: "The context window is your scarcest resource in agentic coding. Here's how to manage it well enough to actually ship."
permalink: /blog/{{ page.fileSlug }}/
---

*This post expands on the context engineering section of my [Advanced Practitioner's Guide](/blog/2026-03-19-agentic-coding-advanced-guide/) talk. If you haven't read that one, it's worth starting there for the broader picture.*

---

Agentic tools feel like a superpower on greenfield projects & quick prototypes. Then you bring them to a real codebase and the magic starts to fade. Features that should be straightforward become multi-hour debugging sessions. The agent that was finishing tasks in minutes starts losing the thread halfway through.

You start work on a new feature. The agent needs the relevant files, architectural context and patterns your codebase follows (all 15 of them). Your agent (let's call her Mattilda - Matti for short) dutifully loads it all into the context window. Halfway through the implementation, Matti starts contradicting herself - forgetting constraints she acknowledged earlier, creating the same bugs after every tweak, producing code that doesn't match the patterns she was following ten messages ago. You haven't changed anything. The context window just filled up, and Matti's effectiveness fell off a cliff.

This is the core problem with agentic coding at scale: **the context window is a scarce resource.** Before I understood this, I treated context as infinite - dump everything in at the start, hope the agent keeps track - and then wonder why agent performance degrades on complex, multi-session work.

Context engineering is the discipline of managing that scarcity deliberately. Not just what you tell the agent in a given prompt, but how you structure & surface information across sessions, across engineers and across the full lifecycle of a project - so the agent always has what it needs and never has more than it can use.

Here's how to build it.

---

## The Foundation: CLAUDE.md

Every repository your team works in needs a `CLAUDE.md` (or `AGENT.md`) - a project-level context document checked into the repo & treated similar to other infrastructure configurations. Note: this file isn't like a helm chart, but it does impact your developer experience & effectiveness when developing with agents.

The instinct is to make it comprehensive. Resist that. A large instruction file actively degrades agent performance: it crowds out the actual task, and when everything is marked "important," agents fall back to local pattern-matching rather than applying your instructions. Aim for roughly 100 lines. Think of it as a **map, not an encyclopedia** - it tells the agent where to look, not everything the agent needs to know.

A good `CLAUDE.md` covers:
- Tech stack and the architectural pattern the codebase follows
- A pointer to deeper documentation for each major area
- Three to five things you wish every new engineer knew before touching the codebase (this can be in a separate `CLAUDE.md` deeper in the directory structure as it often relates to a given subsystem)
- Explicit do's and don'ts that aren't obvious from the code itself (this can be in a separate `CLAUDE.md` deeper in the directory structure as it often relates to a given subsystem)

It's a team artifact - reviewed in PRs, updated when the architecture changes, owned by the team, not any individual. If it lives in someone's personal settings, it's not doing its job. Though, I do encourage you to keep a personal `CLAUDE.md` for your own preferences & patterns, too.

*A note on rules files: At the time of this writing, rules are loaded into the context window with the `CLAUDE.md`. They act as a human-friendly way to segment & organize your context. They are not loaded in for a given task or area of the codebase by default. In other words: rules contribute to your `CLAUDE.md` size, so keep them concise.*

### The cold-start problem

CLAUDE.md solves the immediate context problem. But it doesn't solve the **cold-start problem**: an agent joining a large, established codebase still has to figure out where everything is, what patterns the team follows, how past problems were solved. The first few sessions on a complex project are expensive - in tokens, in wrong turns, in engineers having to re-explain things they've explained before.

The cold-start problem is also why CLAUDE.md files tend to either be too sparse to help or too bloated to be effective. Teams try to stuff everything the agent might need into one document, hit the size constraint, and watch performance degrade. You can't document everything upfront. And even if you could, you shouldn't put it all in the same place.

The answer is a layer of structured knowledge that sits below CLAUDE.md - indexed, persistent, and growing over time.

---

## PILRs: Persistent Indexed Learning Repositories

Each word in the acronym is doing real work:

- **Persistent** — saved somewhere durable: a file, a database record, a separate service. Not a prompt, not a session variable. It survives between agent runs and between engineers.
- **Indexed** — structured so agents can start small and expand as needed. Rather than loading everything at once, an index lets the agent pull the relevant slice for a given task and drill deeper only when it needs to. This is what keeps context windows from overflowing.
- **Learning** — it grows over time. As the project develops, the information about it gets better. Every solved problem, every architectural decision, every pattern documented adds to what the agent knows. The value compounds.
- **Repositories** — it lives somewhere accessible from multiple projects, or within one project by everyone involved: developers, PMs, designers. Not in one engineer's personal settings. Not in a prompt someone wrote six months ago. Shared, versioned (optional), owned by the team.

A PILR is a structured knowledge base the agent can reference on demand. The key word is *indexed* - a central `index.json` maps topics to documentation files, so the agent loads what it needs for a given task rather than loading everything every time.

PILRs grow as the agent works. When an engineer solves a novel problem, documents a pattern decision, or writes a per-PR plan, that knowledge accumulates in the PILR. The next agent session - or the next engineer - has access to it. Over time, the agent stops behaving like a generic coding assistant and starts behaving like a specialist who knows how your platform is built.

This is the inverse of the upfront documentation approach. You don't have to document everything before you get value. You document as you go, and the value compounds.

### Structure

A minimal PILR looks something like this:

```
docs/
  index.json          <- maps topics to files
  architecture.md     <- how the system is designed
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

## Not All PILRs Are the Same

Here's where most teams go wrong: they treat "write the docs" as one undifferentiated task. But knowledge has very different lifecycles depending on what it is, and conflating them leads to PILRs that are either stale, bloated, or both.

There are three distinct types, and they need to be built and maintained differently.

---

### Type 1: Project Execution Docs (Ephemeral)

These exist to serve a specific feature or sprint. They're highly specific, high-signal during implementation, and low-signal afterward.

**What belongs here:**
- Per-PR implementation plans (what needs to change and why)
- Technical design decisions made during a sprint
- Test plans for a specific feature
- Notes on why an approach was chosen or discarded during active development
- PRDs scoped to a single deliverable

**Lifecycle:** Create before implementation begins. Reference during implementation. Archive or delete when the feature ships. Do not let these accumulate indefinitely - a planning doc for a feature shipped six months ago is noise, not signal.

**At RIVET**, these live in `temp/projects/` - a deliberate naming choice. "Temp" communicates that this directory is working memory, not permanent record. Each feature gets a subdirectory with a planning doc, a test plan, and any decision notes. When the PR merges, we either archive the relevant decisions into the evergreen layer or discard the docs entirely.

The key insight: these documents serve two audiences simultaneously. The human who reviews the plan before implementation starts. And the agent who references the plan while implementing. Writing them well - specific, scoped, with clear acceptance criteria - pays dividends on both sides.

---

### Type 2: Tech Specs & Product Documentation (Evergreen)

These describe how the system works and why. They change, but they don't expire.

**What belongs here:**
- Architectural decision records (ADRs)
- System design documents
- API contracts and data schemas
- Product specifications that describe stable features
- Onboarding guides and "things every engineer should know"
- Runbooks for operational processes

**Lifecycle:** Created when systems are designed or decisions are made. Updated when the architecture changes. Never deleted without replacing with something better. These are the documents a new engineer reads to understand why the codebase looks the way it does.

The distinction from Type 1: a Type 1 doc says "here's what we're going to change for this feature." A Type 2 doc says "here's how this part of the system works." One is a plan; the other is a map.

This is also the layer where **Signal Advisors' MCP server** lives. Their agents retrieve PRDs and technical specs from a purpose-built context delivery system, serving the right documentation to the right agent regardless of which codebase it's working in. The delivery mechanism is more sophisticated than local files, but the layer is the same: stable, indexed, domain-specific knowledge that doesn't live in the code itself.

---

### Type 3: Knowledge Bases (Cumulative)

These grow continuously and never shrink. They're the institutional memory of your engineering team.

**What belongs here:**
- Solved problems and how they were resolved
- Incident post-mortems
- Product evolution history ("why does this work this way now?")
- Patterns for common bugs and their fixes
- Cross-cutting technical context that spans multiple systems

**Lifecycle:** Always growing. Never reset. Indexed so agents can retrieve selectively rather than loading the whole history. The value compounds: the larger and better-indexed this layer is, the more an agent can recognize patterns from past work instead of reasoning from scratch.

The RIVET support bot demonstrates this clearly. When a support ticket comes in, the agent has access to a persistent directory of previously solved problems with an index. It can identify patterns from past tickets, reproduce issues, and propose fixes - not by reasoning from scratch, but by recognizing "we've seen this pattern before."

This layer is also the hardest to build upfront - which is exactly why you shouldn't try. Seed it with a handful of known patterns and let it grow organically. Every time an agent solves a novel problem, the solution gets documented here. Every post-mortem is indexed and added. Over time, the cumulative layer becomes the most valuable layer you have.

---

## Connecting the Three Layers

The three types aren't silos - they interact, and your CLAUDE.md is what orchestrates them.

A well-written CLAUDE.md routes the agent to the right layer for the right task:

```markdown
## Documentation

Before starting any task, check:
- `temp/projects/` for an existing implementation plan for this feature
- `docs/architecture/` for relevant system design context
- `docs/issues/` if this looks like a known problem pattern

When implementing a new feature, create a planning doc in `temp/projects/` first.
When resolving an issue, check `docs/issues/solved-problems.md` before investigating.
```

The CLAUDE.md doesn't contain the knowledge - it tells the agent where to find it. This is the map vs. encyclopedia distinction in practice.

**Information flows upward.** Decisions made in a Type 1 doc that turn out to be durable belong in Type 2. Patterns that emerge from multiple solved problems in Type 3 belong documented in Type 2 as well. A healthy PILR system has a regular review process where valuable knowledge migrates from ephemeral to evergreen.

**Different indexing strategies for different layers.** Your Type 1 (project execution) docs should be indexed by feature and date. Type 2 (evergreen) docs should be indexed by system component and topic. Type 3 (knowledge base) docs should be indexed by problem pattern, symptom, or system area. The `index.json` structure in each layer reflects its lifecycle.

---

## The Indexing Problem: Why the Index Matters More Than You Think

The common failure mode isn't failing to write documentation - it's writing documentation that agents can't effectively navigate. The index is what makes the difference between a knowledge base and a pile of files.

Research on production agentic systems bears this out starkly. Task completion rates vary dramatically based on indexing sophistication:

| Indexing approach | Task completion rate |
|---|---|
| Flat file listing (no index) | 43% |
| Folder structure with descriptions | 61% |
| Semantic tags | 74% |
| Git metadata integration | 72% |
| Dependency graph | 76% |
| Hybrid (structure + semantic + git + deps) | 83% |

The gap between "just have the files" and "have the files well-indexed" is 40 percentage points. That's not a marginal improvement - it's the difference between an agent you can trust and one you can't.

Token efficiency tells the same story. Agents using hierarchical, just-in-time navigation (load what you need, when you need it) use 60% fewer tokens and complete tasks 54% faster than agents using monolithic context loading. At production scale, that's meaningful economics - the same work at roughly half the API cost.

The underlying reason: **agents don't need the entire codebase context upfront**. They need a high-level map they can navigate, with the ability to load detail on demand. A good index is that map.

### The Four Failure Modes of Poor Indexing

If you've watched agents get confused in a codebase, you've probably seen these:

**The Irrelevant Context Trap.** Searching for "authenticate" returns `fake_authenticator.js` - semantically similar, contextually useless. Without metadata distinguishing test fixtures from source files, the agent selects wrong and burns turns recovering. Users with proper file metadata select the right file on the first or second try 76% of the time, versus 43% without it.

**Monolith Blindness.** Seven files named `index.ts` in a monorepo with 40+ packages. The agent asks for `index.ts` and gets an ambiguous result. Namespaced indexing (`services/payment/index.ts`) eliminates this class of error entirely.

**Stale Context.** The agent modifies a function that no longer exists where it expects, because the index hasn't been updated since a recent refactor. About 19% of task failures in production are stale reference errors. Daily or commit-triggered index regeneration eliminates this.

**The Search Explosion.** A broad grep query returns 300+ results. The agent can't meaningfully process them and either gives up or picks at random. Queries returning more than 100 results fail 73% of the time; queries returning fewer than 20 results fail 12% of the time. Scoped search and result ranking are what keep queries in the productive range.

---

## Indexer: What Automated PILR Generation Actually Looks Like

One of the more interesting tools in this space is [Indexer](https://github.com/AndyInternet/indexer) - an open-source codebase index generator that takes the indexing problem seriously as an engineering problem.

Most teams build their PILR index manually: someone writes `index.json`, organizes the docs folder, and updates it periodically. This works at small scale and breaks down as the codebase grows. Indexer approaches this differently: generate the index automatically from the actual code, using structural analysis rather than file listings.

### How It Works

**Tree-sitter AST parsing.** Every source file gets parsed into a concrete syntax tree. This gives the indexer structural understanding rather than text matching - it knows the difference between a function definition, a function call, and a comment mentioning the function name. `indexer search authenticate` returns only the definition with file, line, and signature. `grep authenticate` returns every mention.

**Code skeleton extraction.** Rather than loading full file contents into context, Indexer generates a skeleton that preserves structure while stripping implementation:

```python
# Original: 45 lines, ~400 tokens
class AuthHandler:
    def __init__(self, db: Database, secret: str):
        self._db = db
        self._secret = secret
        self._cache = {}
        self._setup_validators()

    def validate_token(self, token: str) -> bool:
        if not token:
            return False
        try:
            payload = jwt.decode(token, self._secret, algorithms=["HS256"])
            user = self._db.get_user(payload["sub"])
            return user is not None and not user.is_banned
        except jwt.InvalidTokenError:
            return False

# Skeleton: 8 lines, ~50 tokens
class AuthHandler:
    def __init__(self, db: Database, secret: str): ...
    def validate_token(self, token: str) -> bool: ...
    def refresh_session(self, session_id: str) -> Session: ...
    def revoke_token(self, token: str) -> None: ...
```

10% of the original token cost, with the structural information preserved. For understanding a file's interface before deciding whether to read it fully, this is exactly what you want.

**PageRank-ranked repo map.** Indexer builds a directed dependency graph (file A imports from file B = edge A→B) and runs PageRank to identify which files are most architecturally significant. The result is a token-budgeted overview of the codebase, ranked by importance rather than alphabetically:

```bash
indexer map --tokens 2048
```

An agent searching for authentication logic sees the core auth module before test mocks. An agent exploring the database layer sees the schema and query files before utilities. This is the semantic layer the research points to as critical for production-level task completion - delivered automatically from the code's own structure rather than hand-tagged metadata.

**Auto-freshness via git fingerprinting.** Every query checks a stored fingerprint before running. In git repos, the fingerprint is `sha256(HEAD commit + git status --porcelain)` - it captures branch switches, new commits, staged changes, and unstaged edits in a single ~10ms check. If anything changed, an incremental update runs automatically before the query returns. Files are tracked by SHA-256 content hash, so only changed files get re-parsed. The index is always current without manual maintenance.

### The Claude Code Integration

The most interesting part for teams already using Claude Code is how Indexer integrates into the agent workflow.

A `PreToolUse` hook watches for tool calls that look like symbol navigation - grep queries with CamelCase or snake_case patterns, broad glob patterns like `**/*.py` - and injects a reminder to use the index instead. The hook never blocks; it nudges. When the agent reaches for grep to find a class definition, it gets a hint that `indexer search` would return only the definition without the noise.

The `/indexer-setup` command adds comprehensive instructions to your `CLAUDE.md` - default workflow, anti-patterns, exception cases - so the full guidance persists across sessions. Without it, agents still get the hook nudges. With it, they have the complete mental model for when to use which navigation approach.

The practical result is what the research calls "just-in-time navigation." The agent starts with `indexer map` to understand the landscape, uses `indexer skeleton` to survey files before reading them fully, and uses `indexer search` / `indexer callers` for precise symbol navigation. It loads what it needs, when it needs it, rather than trying to process the whole codebase upfront.

### Where Indexer Fits in the PILR Stack

Indexer is primarily a solution to the Type 2 and Type 3 cold-start problem. If you're integrating an agent into an existing codebase without documentation, Indexer gives you a useful structural index immediately - you don't have to document every file before the agent can navigate. The PageRank map and skeleton index are derived directly from the code, so they're always current.

The manual PILR layer - architecture decisions, solved problems, product context - still has to be written by humans. Indexer doesn't replace that. But it solves the navigation layer, which is often the first obstacle teams hit when they try to deploy agents into real codebases.

![Indexer GitHub - automated PILR generation via AST parsing and PageRank](/assets/images/PILRs-indexer.png)

---

## Three Implementations

### RIVET: Local PILRs in the repo

At RIVET, all three layers coexist in the same repo. `temp/projects/` for Type 1 (ephemeral planning docs). `docs/architecture/` for Type 2 (evergreen system context). `docs/issues/` for Type 3 (solved problems, indexed for retrieval). The CLAUDE.md routes agents to the right layer at the start of each task.

The support bot shows the Type 3 layer in practice: persistent solved problems index, CLAUDE.md with routing instructions, and the agent treating past solutions as first-class context rather than reasoning from scratch every time.

![PILRs at RIVET - slide from the Advanced Practitioner's Guide](/assets/images/PILRs-RIVET.png)

### Superpowers: PILRs as a plugin pattern

The [Superpowers plugin for Claude Code](https://github.com/obra/superpowers) formalizes the PILR structure as a reusable pattern. Plans and specs live in `docs/superpowers/plans` and `docs/superpowers/specs`, organized so the agent can reference them without loading the whole knowledge base. The plugin handles the indexing and retrieval mechanics so your team can focus on the content rather than the infrastructure.

![PILRs in Superpowers - slide from the Advanced Practitioner's Guide](/assets/images/PILRs-superpowers.png)

### Signal Advisors: PILRs via MCP server

Signal Advisors scales the Type 2 layer across multiple repositories via an MCP (Model Context Protocol) server. Their agents retrieve PRDs and technical specs on demand, getting exactly the domain knowledge they need for each task regardless of which codebase they're working in. Same principle as local PILRs; different delivery mechanism suited to a multi-repo organization where the context doesn't belong in any single codebase.

---

## Beyond PILRs: Rules, Hooks, and Skills

PILRs and CLAUDE.md are the knowledge layer. The enforcement layer is where context engineering becomes a system rather than a collection of documents.

**Rules** are constraints the agent follows automatically - coding standards, naming patterns, things that should always or never happen. The key insight from OpenAI's harness engineering work: encode these as custom linters with error messages written as remediation instructions. When the agent violates a rule, the linter tells it exactly how to fix the violation. Documentation drifts; lint rules don't.

**Hooks** automate responses to agent behavior - running linters after generation, formatting files after edits, triggering tests after changes. The combination of rules and hooks creates continuous mechanical enforcement: constraints that apply everywhere at once, without human attention.

**Skills** are reusable packaged workflows. Complex multi-step processes - implement a feature from a spec, write and execute a test plan, create a PR with documentation - become a single command that any engineer on the team can invoke. Skills are the point where agent usage becomes programmable, where you stop re-explaining your process every session and start encoding it once.

At RIVET, `/review-pr`, `/implement`, and `/update-project-docs` are the skills we've built so far. The `/implement` skill in particular has expanded the "safe delegation window" - the range of tasks we can hand to an agent with confidence - from 10-20 minute tasks to multi-hour feature delivery.

---

## The System as a Whole

Context engineering isn't a single thing you add to your workflow. It's a system:

- **CLAUDE.md** gives the agent a reliable starting point in every session, routing it to the right knowledge layer for the task
- **Type 1 PILRs** (ephemeral) give the agent task-specific context for the current feature
- **Type 2 PILRs** (evergreen) give the agent durable system knowledge that accumulates across the team
- **Type 3 PILRs** (cumulative) give the agent institutional memory - patterns from past problems and solutions
- **Automated indexing** (via tools like Indexer) keeps the navigation layer current without manual maintenance
- **Rules and linters** enforce patterns mechanically, at scale
- **Hooks** automate the tedious parts of the workflow
- **Skills** make the whole system reusable and programmable

Each layer makes the others more valuable. CLAUDE.md works better when it points to well-indexed PILRs for depth. Rules work better when the agent has PILR context to understand *why* the rules exist. Skills work better when they can rely on consistent patterns being enforced by rules. And the Type 3 knowledge base becomes more valuable with every problem solved - each solution makes the next agent session smarter.

The goal is an agent that behaves like a senior engineer who knows your codebase - not because you wrote an exhaustive prompt, but because you built an environment where that knowledge accumulates, is enforced, and is accessible on demand.

That's context engineering. It's slower to set up than writing a good prompt. It pays off at a completely different scale.

---

*We'll be going deep on this at the [April Detroit Developers meetup](/events/agentic-advanced-practitioners-guide/). Come find me there if you want to dig into any of this.*
