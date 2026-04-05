---
layout: post.njk
title: "Agentic Coding: Context Engineering with PILRs"
date: 2026-03-27
author: "Phil Borel"
excerpt: "Your agent can get better at your product over time — like a human developer — but only if you build the infrastructure to make it possible. Here's how."
permalink: /blog/{{ page.fileSlug }}/
draft: true
---

*This post expands on the context engineering section of my [Advanced Practitioner's Guide](/blog/agentic-coding-advanced-guide/) post. If you haven't read that one yet, it's worth checking out for the broader picture.*

---

Agentic tools feel like a superpower on greenfield projects & quick prototypes. Then you bring them to a real codebase and the magic starts to fade. Features that should be straightforward become multi-hour debugging sessions. The agent that was finishing tasks in minutes starts losing the thread halfway through.

Here's what's actually at stake. Think about a new developer joining your team. Day one, they're slow — reading docs, asking questions, getting the lay of the land. By day 90, they're up to speed and starting to move. By the end of year one, they deeply understand multiple systems, can anticipate problems before they happen, and are in a position to lead. That trajectory is the whole point of hiring them.

Your agentic developer can follow the same pattern — but the timelines are completely different. Where a human needs months to accumulate that depth, an agent working with well-structured context can become meaningfully more effective after a single session, after a single PR, after a single project. The knowledge doesn't build up slowly through experience; it builds up through deliberate documentation and indexing. Every time something worth knowing gets captured in your PILRs, your agent gets better at your product — immediately, not eventually.

But only if you build the infrastructure to make it possible. Without it, every session is day one. The agent is perpetually new. Nothing compounds.

That's the main problem with agentic coding at scale, and most teams never think about it because they're too busy fighting a more visible symptom: context rot.

You start work on a new feature. The agent needs the relevant files, architectural context and patterns your codebase follows (all 15 of them). Your agent (let's call her Mattilda - Matti for short) dutifully loads it all into the context window. Halfway through the implementation, Matti starts contradicting herself - forgetting constraints she acknowledged earlier, creating the same bugs after every tweak, producing code that doesn't match the patterns she was following ten messages ago. You haven't changed anything. The context window just filled up, and Matti's effectiveness fell off a cliff.

The context window is a scarce resource, and context rot is real — and worse than most people realize. [Chroma's research](https://www.trychroma.com/research/context-rot) documents it rigorously across 18 major models: performance degrades as context grows, distractors cause non-uniform interference, and models handle structured context differently than fragmented context. Their core finding cuts to the heart of it: *"Whether relevant information is present in a model's context is not all that matters; what matters more is how that information is presented."* Research on [Recursive Language Models](https://arxiv.org/html/2512.24601v2) puts a sharper number on it: on information-dense long-context tasks, GPT-5 scores below 0.1% F1.

The architectural reason is straightforward. Transformer-based models let every token attend to every other token, creating n² pairwise relationships. Longer sequences stretch this attention capacity thin — [Anthropic's applied AI team](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) describes it as an "attention budget" that gets depleted by each additional token, much like human working memory. Technically, this produces a performance *gradient* rather than a hard cliff. But in practice, the gradient is steep enough that the distinction doesn't change your engineering approach — when your agent starts contradicting instructions it acknowledged 20 messages ago, the cause is the same whether you call it a cliff or a steep slope.

This matches what we've observed building Odradek, RIVET's customer-reported bug fixing agent. The agent runs a multi-phase workflow — investigate, fix, verify, ship — and we've found that models perform best when each invocation stays in the ~20-40K token range where attention is concentrated. Push past 100K tokens and the symptoms are predictable: the model starts skipping instructions, conflating step outputs, and hallucinating connections between unrelated context. We call this the "performance window" — the context size where the model reliably follows instructions and produces high-quality output. Beyond it, attention dilutes across irrelevant tokens, and every additional tool result makes the next one slightly less likely to be processed correctly. Context rot isn't gradual — it's a cliff, and the cliff is closer than most people think.

Context rot has a sibling failure mode worth naming: **context anxiety**. Anthropic's engineering team [observed this](https://www.anthropic.com/engineering/harness-design-long-running-apps) while building long-running agent harnesses — some models start wrapping up work prematurely as they approach perceived context limits. This is distinct from context rot. With rot, the model's performance degrades — it loses track of instructions and makes worse decisions. With anxiety, the model's performance is fine but it *chooses to do less* — producing terse, incomplete implementations or rushing to finish rather than doing the work thoroughly. If you've ever watched an agent suddenly start cutting corners mid-task, producing shallow implementations where it was previously thorough, you've likely seen context anxiety rather than context rot. The remediation is different: context rot requires smaller context windows and better retrieval; context anxiety requires architectural changes like phase boundaries or fresh context windows at natural breakpoints.

But context rot is the secondary problem. The primary problem is that without deliberate context engineering, your agent can never accumulate the knowledge that makes a developer valuable. You're not just losing performance mid-session — you're losing the compounding returns that make the investment in agentic tooling worth it.

A natural response to context rot is to wait for better models — and architectural approaches like Recursive Language Models are genuinely tackling the problem, letting models process inputs two orders of magnitude beyond their context windows. But a model that handles longer contexts still doesn't know your product. It still starts from scratch every session. It still can't anticipate the failure modes your team has already solved. Context rot is a solvable infrastructure problem; the compounding knowledge problem requires deliberate engineering regardless of where model capabilities land.

Context engineering is the discipline of managing both. Anthropic's applied AI team [defines the core principle](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) as: *"find the smallest set of high-signal tokens that maximize the likelihood of your desired outcome."* In practice, that means managing not just what you tell the agent in a given prompt, but how you structure & surface information across sessions, across engineers and across the full lifecycle of a project — so the agent always has what it needs, never has more than it can use, and gets meaningfully better at your product over time. Tools like [claude-mem](https://github.com/thedotmack/claude-mem) take this principle seriously at the retrieval layer — its 3-layer progressive disclosure pattern (`search` → `timeline` → `get_observations`) achieves roughly 10x token efficiency compared to dumping full records into context, treating the attention budget as a first-class engineering constraint rather than an afterthought.

PILRs is the pattern I use to build that infrastructure. Here's how it works.

---

## The Foundation: CLAUDE.md

Every repository your team works in needs a `CLAUDE.md` (or `AGENT.md`) - a project-level context document checked into the repo & treated similar to other infrastructure configurations. Note: this file isn't like a helm chart, but it does impact your developer experience & effectiveness when developing with agents.

The instinct is to make it comprehensive. Resist that. A large instruction file actively degrades agent performance: it crowds out the actual task, and when everything is marked "important," agents fall back to local pattern-matching rather than applying your instructions. Anthropic's applied AI team calls this calibration finding the ["right altitude"](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — balancing two failure modes. Over-specification gives you a brittle, bloated file that increases maintenance complexity and burns context on edge cases that rarely apply. Under-specification gives you vague guidance that fails to provide concrete signals, assuming a shared context the agent doesn't have. The sweet spot is roughly 100 lines. Think of it as a **map, not an encyclopedia** — it tells the agent where to look, not everything the agent needs to know.

A good `CLAUDE.md` covers:
- Tech stack and the architectural pattern the codebase follows
- A pointer to deeper documentation for each major area
- Three to five things you wish every new engineer knew before touching the codebase
- Explicit do's and don'ts that aren't obvious from the code itself

It's a team artifact - reviewed in PRs, updated when the architecture changes, owned by the team, not any individual. If it lives in someone's personal settings, it's like storing money in the mattress - it won't pay interest. Though, I do encourage you to keep a personal `CLAUDE.md` for your own preferences & patterns, too.

*A note on rules files with Claude: At the time of this writing, rules are loaded into the context window with the `CLAUDE.md`. They act as a human-friendly way to segment & organize your context. They are not loaded in for a given task or area of the codebase by default. In other words: rules contribute to your `CLAUDE.md` size, so keep them concise.*

### The cold-start problem

`CLAUDE.md` solves the immediate context problem. But it doesn't solve the **cold-start problem**: an agent joining a large, established codebase still has to figure out where everything is, what patterns the team follows, how past problems were solved. The first few sessions on a complex project are expensive - in tokens, in wrong turns, in engineers having to re-explain things they've explained before.

The cold-start problem is also why `CLAUDE.md` files tend to either be too sparse to help or too bloated to be effective. Teams try to stuff everything the agent might need into one document, hit the size constraint and watch performance degrade. You can't document everything upfront. And even if you could, you shouldn't - the context window will never be big enough to hold everything you might need.

The answer is a layer of structured knowledge that sits below `CLAUDE.md` - indexed, persistent, and growing over time. Not just to solve day one, but to enable the progression — so the agent that struggles through its first sessions with your codebase is genuinely more capable by the hundredth.

---

## PILRs: Persistent Indexed Learning Repositories

Each word in the acronym is doing real work:

- **Persistent** - saved somewhere durable: a file, a database record, a separate service. Not a prompt, not a session variable. It survives between agent runs and between engineers.
- **Indexed** - structured so agents can start small and expand as needed. Rather than loading everything at once, an index lets the agent pull the relevant slice for a given task and drill deeper only when it needs to. This is what keeps context windows from overflowing.
- **Learning** - it grows over time. As the project develops, the information about it gets better. Every solved problem, every architectural decision, every pattern documented adds to what the agent knows. The value compounds. This is the mechanism that separates an agent that's perpetually on day one from one that has worked through dozens of features on your codebase — and unlike a human developer, that progression can happen over sessions and PRs, not months.
- **Repositories** - it lives somewhere accessible from multiple projects, or within one project by everyone involved: developers, PMs, designers. Not in one engineer's personal settings. Not in a prompt someone wrote six months ago. Shared, versioned (optional), owned by the team.

A PILR is a structured knowledge base the agent can reference on demand. The key word is *indexed* - in one example, a central `index.json` maps topics to documentation files, so the agent loads what it needs for a given task rather than loading everything every time.

PILRs grow as the agent works. When an engineer solves a novel problem, documents a pattern decision, or writes a per-PR plan, that knowledge accumulates in the PILR. The next agent session - or the next engineer - has access to it. Over time, the agent stops behaving like a generic coding assistant and starts behaving like a specialist who knows how your platform is built. Not after months of ramp-up — after the work itself. Each PR, each solved problem, each documented decision makes the next session more capable than the last.

This is the inverse of the upfront documentation approach. You don't have to document everything before you get value. You document as you go, and the value compounds.

The pattern isn't specific to software development. PILRs are a general framework for any agent that completes tasks in cycles — the same structure applies to a customer support agent that accumulates resolved issue patterns, a sales agent that builds product knowledge over calls, or a personal assistant that learns preferences over time. The core is always the same: persistent storage, optimized retrieval, and a knowledge base that grows with every completed cycle.

[OpenClaw's memory system](https://docs.openclaw.ai/concepts/memory) — built for personal assistant agents — independently arrives at the same architecture: two layers with different lifecycles (append-only daily logs for ephemeral working context, analogous to Type 1; a curated `MEMORY.md` for durable facts and preferences, analogous to Type 2/3), plus an automated mechanism it calls a *silent agentic turn* that flushes important context to disk before compaction. That last part is worth pausing on: it's an automated version of the "information flows upward" process that PILRs treat as a deliberate team habit — when the session approaches its context limit, the agent is prompted to decide what's worth keeping before it's lost. The foundational principle is the same: *"The files are the source of truth; the model only 'remembers' what gets written to disk."*

[claude-mem](https://github.com/thedotmack/claude-mem) — built as a persistent memory plugin for Claude Code — is a third independent convergence on the same architecture, but with a more sophisticated retrieval layer. It hooks into Claude Code's lifecycle events (SessionStart, PostToolUse, SessionEnd) to automatically capture what the agent does during sessions, AI-compresses those observations before storage, and persists them in a dual-storage system: SQLite with FTS5 for structured search and ChromaDB for vector embeddings, enabling both keyword and semantic retrieval. Where OpenClaw uses flat files, claude-mem uses hybrid search across two storage engines — a different implementation of the same "persist what matters, retrieve selectively" principle.

The key difference across all three is scope. Both OpenClaw's and claude-mem's memory systems are private — they capture and serve individual developer sessions, never shared contexts. PILRs are team artifacts; the whole point is that every engineer and every agent session draws from the same accumulated knowledge. Different scope, same mechanism. Automated capture tools like claude-mem are excellent at building individual memory with zero manual effort, but the team-artifact requirement is still a gap that needs deliberate bridging — periodically promoting findings from individual agent memory into shared documentation. This post applies PILRs to software development because that's where I've built and tested them — but the compounding dynamic works wherever an agent repeats a cycle and produces something worth remembering.

### Structure

A minimal PILR looks something like this:

```
docs/
  index.json          <- maps topics to files
  architecture.md     <- how the system is designed
  systems/
    api.md
    error-handling.md
    file-upload.md
    state-management.md
  bug-fixes/
    permissions.md
    file-upload.md
```

The `index.json` is what makes this work at scale. Without it, agents either load too much (context overflow) or too little (missing what they need). The index lets the agent navigate selectively - pulling the auth patterns when working on auth, the state patterns when touching state management. This is the simplest form of a PILR index — a static file you maintain manually. More sophisticated implementations use vector embeddings, BM25 hybrid search, or AST-derived structural maps (covered later). claude-mem takes a different approach entirely: rather than indexing by topic or structure, it uses a temporal/semantic index — a 3-layer progressive disclosure pattern where `search()` returns compact ID-based results (50-100 tokens), `timeline()` provides chronological context around matches, and `get_observations()` fetches full details only for filtered IDs (500-1000 tokens). This is structural indexing for *what the code is* versus temporal indexing for *what the agent did with it* — complementary approaches to the same selective retrieval problem. The mechanism differs; the goal is the same: selective retrieval over full context loading.

---

## Not All PILRs Are the Same

Here's where most teams go wrong: they treat "write the docs" as one undifferentiated task. But knowledge has very different lifecycles depending on what it is, and conflating them leads to PILRs that are either stale, bloated, or both.

There are three distinct types, and they need to be maintained in different ways.

---

### Type 1: Project Execution Docs (Ephemeral)

These exist to serve a specific feature or sprint. They're highly specific, high-signal during implementation, and low-signal afterward.

**What belongs here:**
- Per-PR implementation plans (what needs to change and why)
- Technical design decisions made during a sprint
- Test plans for a specific feature
- Notes on why an approach was chosen or discarded during active development
- Product Specifications scoped to a single deliverable

**Lifecycle:** Create before implementation begins. Reference during implementation. Archive or delete when the feature ships. Do not let these accumulate indefinitely - a planning doc for a feature shipped six months ago is noise, not signal.

**At RIVET**, these live in `temp/projects/` - a deliberate naming choice. "Temp" communicates that this directory is working memory, not permanent record. Each feature gets a subdirectory with a planning doc, a test plan, and any decision notes. When the PR merges, we either archive the relevant decisions into the evergreen layer or do nothing & discard the docs entirely (the folder path is in our `.gitignore`).

The key insight: these documents serve two audiences simultaneously. The human who reviews the plan before implementation starts. And the agent who references the plan while implementing. Writing them well - specific, scoped, with clear acceptance criteria - pays dividends on both sides. We use a skill to help us write these docs based on the System Architecture docs, Tech Spec for the project & Product Spec for the feature.

Anthropic's [harness design research](https://www.anthropic.com/engineering/harness-design-long-running-apps) takes this a step further with what they call **sprint contracts** — explicit agreements between a generator agent and an evaluator agent on deliverables and testable success criteria, negotiated before each sprint and written to files. The contract turns the plan from a guide the agent can drift from into a commitment it can be evaluated against. This is an evolution we haven't yet incorporated into our own workflow. Our `project_plan.md` currently focuses on *how to get the work done* — implementation approach, sequencing, dependencies — and our `pr.md` focuses on *what changed and how a human reviewer can manually test it*. Neither currently functions as a contract with explicit acceptance criteria. Adding a "contractual commitments" section to `project_plan.md` — an explicit scope of work and acceptance criteria definition — would make the plan evaluable: the agent (or a separate evaluator) can check deliverables against stated criteria rather than subjectively assessing "is this done?" That's the next iteration of our planning skill.

---

### Type 2: Tech Specs & Product Documentation (Evergreen)

These describe how the system works and why it works that way. They evolve, but they don't expire.

**What belongs here:**
- Architectural decision records (ADRs)
- System design documents
- API contracts and data schemas
- Product specifications that describe stable features
- Onboarding guides and "things every engineer should know"
- Runbooks for operational processes

**Lifecycle:** Created when systems are designed or decisions are made. Updated when the architecture changes. Never deleted without replacing with something better. These are the documents a new engineer reads to understand why the codebase looks the way it does — and the documents your agent draws on to hit the ground running on every new feature, rather than re-deriving system context from scratch each time.

The distinction from Type 1: a Type 1 doc says "here's what we're going to change for this feature." A Type 2 doc says "here's how this part of the system works." One is a plan; the other is a map.

This is also the layer where **Signal Advisors' MCP server** lives. [Signal Advisors](https://www.signaladvisors.com/) is a Detroit-based B2B SaaS startup that helps wealth management professionals run their business - a domain where the product spans multiple codebases and the documentation that matters most (compliance rules, product specs, API contracts) doesn't belong in any single repo. [Ryan Burr](https://www.linkedin.com/in/ryan-burr2/), a Director of Engineering at Signal Advisors & panelist at our [March agentic coding event](/events/agentic-software-development/), shared how his team solved this: an MCP (Model Context Protocol) server that serves technical docs as context for agents working across their codebase. The agents retrieve exactly the documentation they need for a given task - product requirements, architectural context, API contracts - without any of it living in the repositories themselves. The delivery mechanism is more sophisticated than local files, but the layer is the same: stable, indexed, domain-specific knowledge that doesn't live in the code itself.

At RIVET we utilize "Deep Maps". Deep Maps are markdown files that describe how the system works and why it works that way. They're like architectural decision records (ADRs) but for the entire system. They contain frontmatter with highlights & an index file to help the agent search for what they need. We use a skill to maintain our deep maps which allows us to keep them up to date via a GitHub Action.

---

### Type 3: Knowledge Bases (Cumulative)

These grow continuously with your systems. They're the institutional memory of your engineering team.

**What belongs here:**
- Solved problems & how they were resolved
- Incident post-mortems
- Product evolution history ("why does this work this way now?")
- Patterns for common bugs & their fixes
- Cross-cutting technical context that spans multiple systems

**Lifecycle:** Always growing. Indexed so agents can retrieve selectively rather than loading the whole history. The value compounds: the larger and better-indexed this layer is, the more an agent can recognize patterns from past work instead of reasoning from scratch. This is the deep expertise layer — the difference between an agent that knows how your system works and one that understands *why it evolved this way*, can anticipate the failure modes, and is ready to take on your most complex features. A human developer builds this depth over years. Your agent can build it over projects.

The RIVET support bot demonstrates this clearly. When a customer-reported bug comes in, the agent has access to a persistent directory of previously solved problems with an index. It can identify patterns from past issues, reproduce them, and propose fixes - not by reasoning from scratch, but by recognizing "we've seen this pattern before." The PILRs layer is what makes that recognition possible; without it, every ticket is a fresh problem.

This layer is also the hardest to build upfront - which is exactly why you shouldn't try. Seed it with a handful of known patterns (or don't) and let it grow organically. Every time an agent solves a novel problem, the solution gets documented here. Every post-mortem is indexed and added. Over time, the cumulative layer becomes the most valuable layer you have — the institutional memory of your product, built up not over years of human tenure but over the lifetime of your codebase itself.

claude-mem offers a different approach to this problem: fully automated capture. Rather than relying on engineers to document solutions after the fact, it hooks into Claude Code's lifecycle events — every tool use, every file read, every edit — and automatically compresses those observations using AI before storing them. The knowledge base grows without any manual documentation effort. It includes a circuit breaker that halts after 3 consecutive failures to prevent infinite loops, and `<private>` tags that get stripped at the hook layer before data reaches storage. The trade-off is clear: manual documentation produces higher-signal, team-shared knowledge; automated capture produces comprehensive individual memory with zero friction. Both approaches grow the cumulative layer — they just optimize for different constraints.

---

## Connecting the Three Layers

The three types aren't silos - they interact, and your `CLAUDE.md` can help orchestrate them. Alternatively, use skills to perform specific tasks with instructions to look at the appropriate layer.

A well-written `CLAUDE.md` routes the agent to the right layer for the right task:

```markdown
Before starting any task, check:
- `temp/projects/` for an existing implementation plan for this feature
- `docs/architecture/` for relevant system design context
- `docs/issues/` if this looks like a known problem pattern

When implementing a new feature, create a planning doc in `temp/projects/` first.
When resolving an issue, check `docs/issues/solved-problems.md` before investigating.
```

The `CLAUDE.md` doesn't contain the knowledge - it tells the agent where to find it. This is the map vs. encyclopedia distinction in practice.

**Information flows upward.** Decisions made in a Type 1 doc that turn out to be durable belong in Type 2. Patterns that emerge from multiple solved problems in Type 3 belong documented in Type 2 as well. A healthy PILRs system has a regular review process where valuable knowledge migrates from ephemeral to evergreen. Each time that migration happens, your agent's baseline understanding of your product rises with it — this is what the progression actually looks like in practice.

**Different indexing strategies for different layers.** Your Type 1 (project execution) docs should be indexed by feature and date. Type 2 (evergreen) docs should be indexed by system component and topic. Type 3 (knowledge base) docs should be indexed by problem pattern, symptom, or system area. The `index.json` structure in each layer reflects its lifecycle.

That last point — indexing strategy — is where most implementations quietly fall apart. You can have all three layers in place and still end up with an agent that stumbles. The structure is necessary but not sufficient. The index is what actually makes it navigable.

---

## The Indexing Problem: Why the Index Matters More Than You Think

The common failure mode isn't failing to write documentation - it's writing documentation that agents can't effectively navigate. The index is what makes the difference between a knowledge base and a pile of files. Recall Chroma's finding: what matters isn't whether relevant information is present, but how it's presented. The index is how you control that.

A former colleague and friend of mine, Andy Lawrence, built the Indexer tool (more on that shortly) and published field research to go along with it. His [Advanced Codebase Indexing Strategies for AI Agents](https://github.com/AndyInternet/indexer/blob/main/research.md) draws on the 2025 AI Agent Index, Claude Code telemetry from 12,000+ users, and direct practitioner interviews — and the numbers are hard to ignore:

| Indexing approach | Task completion rate |
|---|---|
| Flat file listing (no index) | 43% |
| Folder structure with descriptions | 61% |
| Semantic tags | 74% |
| Git metadata integration | 72% |
| Dependency graph | 76% |
| Hybrid (structure + semantic + git + deps) | 83% |

The gap between "just have the files" and "have the files well-indexed" is 40 percentage points. That's not a marginal improvement - it's the difference between an agent you can trust and a useless bot.

Token efficiency tells the same story. Agents using hierarchical, just-in-time navigation (load what you need, when you need it) use 60% fewer tokens and complete tasks 54% faster than agents using monolithic context loading. At production scale, that's meaningful economics - the same work at roughly half the API cost.

The underlying reason: **agents don't need the entire codebase context upfront**. They need a high-level map they can navigate, with the ability to load detail on demand. A good index is that map.

### The Four Failure Modes of Poor Indexing

If you've watched agents get confused in a codebase, you've probably seen these:

**The Irrelevant Context Trap.** Searching for "authenticate" returns `test_authenticator.js` - semantically similar, contextually useless. Without metadata distinguishing test fixtures from source files, the agent selects wrong and burns turns recovering. Users with proper file metadata select the right file on the first or second try 76% of the time, versus 43% without it.

**Monolith Blindness.** Seven files named `index.ts` in a monorepo with 40+ packages. The agent asks for `index.ts` and gets an ambiguous result. Namespaced indexing (`services/payment/index.ts`) eliminates this class of error entirely.

**Stale Context.** The agent modifies a function that no longer exists where it expects, because the index hasn't been updated since a recent refactor. About 19% of task failures in production are stale reference errors. Daily or commit-triggered index regeneration eliminates this.

**The Search Explosion.** A broad grep query returns 300+ results. The agent can't meaningfully process them and either gives up or picks at random. Queries returning more than 100 results fail 73% of the time; queries returning fewer than 20 results fail 12% of the time. Scoped search and result ranking are what keep queries in the productive range.

---

## Indexer: Advanced Automated PILR Generation

One of the more interesting tools in this space is [Indexer](https://github.com/AndyInternet/indexer) - an open-source codebase index generator that takes the indexing problem seriously as an engineering problem.

I started building our team's PILR index manually: writing an `index.json`, organizing the docs folder, and updating it periodically. This works at small scale but breaks down as the codebase grows. Indexer approaches this differently: generate the index automatically from the actual code, using structural analysis rather than file listings.

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

10% of the original token cost, with the structural information preserved. Interfaces contain the pertinent information for an agent to decide whether or not to read the full implementation.

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

### The just-in-time tension

It's worth acknowledging a counterpoint here. Anthropic's own context engineering guidance [advocates for "just-in-time" retrieval](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — agents maintaining lightweight identifiers and dynamically loading data at runtime using tools like glob and grep, "bypassing stale indexing and complex syntax issues." That's somewhat skeptical of the pre-computed index approach Indexer takes. And for many codebases, raw just-in-time retrieval is genuinely the right starting point — it's simpler, has no setup cost, and avoids staleness by definition.

But the research tells a different story at scale. The 40-point task completion gap Andy Lawrence documented between flat file listings and hybrid indexing isn't marginal — and the search explosion problem (queries returning 300+ results failing 73% of the time) is exactly what raw grep produces on large codebases. Indexer's approach isn't *opposed* to just-in-time retrieval — it *is* just-in-time retrieval, with a better-structured starting map. The agent still loads what it needs when it needs it. The difference is that `indexer search authenticate` returns the definition with file, line, and signature, while `grep authenticate` returns every mention. The git fingerprinting means the index is never stale. The AST parsing means the results are never noisy. It's the just-in-time principle with the failure modes engineered out.

### Where Indexer Fits in the PILR Stack

Indexer is primarily a solution to the Type 2 and Type 3 cold-start problem. If you're integrating an agent into an existing codebase without documentation, Indexer gives you a useful structural index immediately - you don't have to document every file before the agent can navigate. The PageRank map and skeleton index are derived directly from the code, so they're always current.

The auto-freshness mechanism is worth pausing on in the context of continuous improvement. Because the index regenerates from a git fingerprint on every query, it grows automatically as the codebase grows. New files, new dependencies, new call paths — they're in the index before the next session starts. The structural layer compounds without any additional human effort. That's the same compounding dynamic the manual PILR layers depend on deliberate documentation to achieve, delivered automatically.

The manual PILR layer - architecture decisions, solved problems, product context - still has to be written by humans (with agentic assistance). Indexer doesn't replace that. But it solves the navigation layer automatically, which is often the first obstacle teams hit when they try to deploy agents into real codebases — and it keeps solving it, session after session, as the codebase evolves.

It's worth noting that Indexer and claude-mem are complementary forms of automated PILR generation, covering two different dimensions. Indexer auto-generates *structural* knowledge from code — what exists, how it's connected, which files matter most. claude-mem auto-generates *operational* knowledge from agent behavior — what the agent did, what it learned, what worked. Together they address both sides of the cold-start problem: Indexer gives a new session an immediate map of the codebase; claude-mem gives it memory of what previous sessions discovered while navigating that map. Neither replaces hand-written architectural docs or solved-problem records, but both reduce the manual effort required to keep the knowledge layer growing.

![Indexer GitHub - automated PILR generation via AST parsing and PageRank](/assets/images/PILRs-indexer.png)

---

## Three Implementations

The PILR pattern is consistent across all three — three layers, indexed, persistent, growing over time. What differs is the *delivery mechanism*: how context is stored, surfaced, and made accessible to agents. These three implementations represent three different answers to that problem, and the trade-offs are worth understanding before you choose your approach.

RIVET keeps everything local: docs live in the repo, accessible directly on the filesystem. Superpowers formalizes that same local pattern as an installable plugin with the structure and retrieval mechanics built in. Signal Advisors externalizes the knowledge entirely, serving it over MCP so it's available across repositories and environments without living in any single codebase.

Local files are the simplest starting point. A plugin gives you structure without the setup cost. An MCP server is the right answer when context needs to cross repo boundaries or run in environments where the codebase isn't present. Where you land depends on how your team is organized and how far you've pushed into autonomous, multi-repo, or CI-based agent workflows.

### RIVET: Local PILRs in the repo

At RIVET, the three layers are spread across different homes - and it's not a clean system yet.

**Type 1** lives in `temp/projects/` inside the monorepo. That part works well. Planning docs, test plans, decision notes, a prepared `pr.md` - all local, `.gitignored`, and accessible to the agent during implementation.

**Type 2** is where things get messy. Our product specs & technical specs live in Notion. We like Notion for this - the collaborative features, inline commenting, and the ability to loop in PMs and designers without asking them to touch a code repository works well for us. But it means our agents can't read Type 2 docs directly. The current workflow is copy-paste: when starting a feature, we pull the relevant spec out of Notion and drop it into `temp/projects/` for that task or utilize Notion's MCP server to gather the correct information. It works, but it's manual. We've talked about migrating to Markdown files in the repo or stored with Obsidian, and we probably will eventually - but we haven't solved the collaboration problem that makes Notion worth using in the first place.

The multi-repo situation makes this harder. We have a monorepo as our main codebase, plus separate repos for private packages & additional services. Type 2 docs that span multiple repos don't naturally belong anywhere, which is part of why Notion still wins - it's repo-agnostic.

**Type 3** lives in its own separate repo - the support agent is a standalone project that sits adjacent to our other codebases on our development machines. It can read files across our other repos locally, which is what makes it useful. But that local dependency is a limitation: the agent has to run in an environment where the relevant codebases are accessible. That works fine on a developer's machine. It breaks down as soon as you try to run it in CI or hand it off to a fully autonomous background agent, because the distributed codebase - monorepo, peripheral services, private npm packages - isn't assembled in one place anywhere except a developer's laptop.

This is the honest state of it. The pattern is right; the infrastructure isn't finished. Ryan Burr's MCP server approach is probably the right long-term answer for the Type 2 layer. Andy Lawrence's Indexer is a sophisticated solution to our problems addressing the Type 3 layer. Both provide a centralized context delivery system that's repo-agnostic and environment-independent. We're not there yet.

The screenshot below shows our actual `temp/projects/` directory. Each subdirectory is a feature or ticket — named by ticket number and slug. Smaller features get a flat set of three files: `pr.md` (the PR description, drafted before implementation), `project_plan.md` (implementation plan scoped to that PR), and `test_plan.md`. Larger features that span multiple PRs get a top-level planning doc alongside the per-PR subdirectories — one project, several PRs, each with their own plan. The inconsistency across older vs. newer entries is visible: earlier features have simpler docs, later ones are more structured. That drift reflects how the skill we use to generate these docs has evolved over time — earlier features were created before we standardized the format.
![PILRs at RIVET - temp/projects directory showing feature subdirectories with pr.md, project_plan.md, and test_plan.md files](/assets/images/PILRs-RIVET.png)

**How the support agent actually consumes PILRs at runtime.** The storage side is only half the story. Odradek — our customer-reported bug fixing agent — shows what it looks like when an agent *uses* PILRs under real constraints.

Anthropic's applied AI team [identifies three techniques](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) for long-horizon context management: **compaction** (summarizing conversation contents when approaching limits), **structured note-taking** (persisting state outside the context window), and **sub-agent architectures** (specialized agents with clean context windows returning condensed summaries). Odradek uses all three, and the interplay between them is where the real engineering happens.

The structured note-taking principle is vivid in Anthropic's own work: they describe Claude playing Pokémon, maintaining precise tallies across thousands of game steps — *"for the last 1,234 steps I've been training my Pokémon in Route 1, Pikachu has gained 8 levels toward the target of 10"* — then reading its notes after context resets and continuing multi-hour sequences seamlessly. The principle is the same at production scale, just with different stakes.

The agent runs four phases, each in a fresh context window: investigate, fix, verify, and done. The critical design decision is what happens at the boundaries. Rather than carrying the full investigation conversation (easily 100K+ tokens of file reads, greps, and git output) into the fix phase, the investigate agent compresses its findings into a ~500-byte JSON file: which files to touch, the root cause, the suggested approach, regression classification. The fix agent reads only this structured digest. That's lossy compression — the fix agent can't see the 20 files the investigation read — but it gets exactly what it needs. The loss is intentional.

This is an instance of a broader principle worth naming: **file-mediated agent communication**. Agents exchange information via files rather than continuous conversation — the same pattern Anthropic's [harness design research](https://www.anthropic.com/engineering/harness-design-long-running-apps) uses for their multi-agent application builders, where planner, generator, and evaluator agents communicate through written artifacts rather than conversational context. Files are persistent, structured, and don't consume context window. The pattern scales: Odradek's investigate-to-fix JSON handoff, Anthropic's planner-to-generator spec handoff, and PILRs themselves (engineers write docs, agents read them) are all the same mechanism at different scales.

Within the investigate phase, the agent delegates all source file reading to an isolated subagent — the sub-agent architecture technique in action. The subagent loads architecture docs and, when relevant, checks for a matching deep map by grepping scope frontmatter — selective retrieval from the Type 2 layer, exactly the way the index is designed to work. It reads 5-20 source files, runs regression analysis via git history, and returns a compressed ~1K token report. The orchestrator never sees any of the raw data. This is the "model should synthesize, not accumulate" principle in practice: heavy data gathering happens in an isolated subcontext; the orchestrator gets conclusions.

Two other patterns emerged that apply broadly. First: if information is deterministically fetchable — a PR number, a branch name, the investigation JSON — fetch it in code and inject it into the prompt. Don't spend model tokens on `gh pr list` when three lines of TypeScript can do it before prompt construction. This eliminates 3-5 tool calls per phase. Second: constrain each phase's available tools to only what it needs. The investigate agent doesn't need Edit/Write tool descriptions occupying its context. Fewer tools = fewer irrelevant descriptions = better focus.

These aren't PILR-specific techniques — they're runtime context management patterns that make PILRs effective rather than just available. The knowledge layer gives the agent something worth knowing. The orchestration layer ensures it can actually use that knowledge without drowning in it.

### Superpowers: PILRs as a plugin

The [Superpowers plugin for Claude Code](https://github.com/obra/superpowers) formalizes the PILR structure as a reusable pattern. Plans and specs live in `docs/superpowers/plans` and `docs/superpowers/specs`, organized so the agent can reference them without loading the whole knowledge base. The plugin handles the indexing and retrieval mechanics so your team can focus on the content rather than the infrastructure.

![PILRs in Superpowers - slide from the Advanced Practitioner's Guide](/assets/images/PILRs-superpowers.png)

### Signal Advisors: PILRs via MCP server

Signal Advisors scales the Type 2 layer across multiple repositories via an MCP (Model Context Protocol) server. Their agents retrieve PRDs and technical specs on demand, getting exactly the domain knowledge they need for each task regardless of which codebase they're working in. Same principle as local PILRs; different delivery mechanism suited to a multi-repo organization where the context doesn't belong in any single codebase.

---

## Beyond PILRs: Hooks, Skills & Refactors

PILRs and `CLAUDE.md` are the knowledge layer. Hooks, skills, and refactors are what turn that knowledge layer into a continuously improving system — the mechanisms that make each session feed the next.

**Hooks** close the feedback loop automatically. Running a linter after generation, formatting files after edits, triggering tests after changes — these aren't just quality gates. They're the signal that the system is working as intended, applied mechanically on every invocation without requiring human attention. Over time, hooks are what keep the gap between "what the agent produces" and "what the codebase expects" from widening as the codebase grows.

**Skills** encode your process so it compounds. Complex multi-step workflows — implement a feature from a spec, write and execute a test plan, create a PR with documentation — become a single reusable command. Skills are the point where your investment in context engineering becomes programmable: instead of re-explaining your process every session, you encode it once and every subsequent session gets the full benefit. At RIVET, `/review-pr`, `/implement`, and `/update-project-docs` are the skills we've built so far. The `/implement` skill in particular has expanded the "safe delegation window" — the range of tasks we can hand to an agent with confidence — from 10-20 minute tasks to hour-long feature delivery. Each time a skill improves, every future invocation improves with it.

Skill design follows the same principles Anthropic [recommends for tool design](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): each skill should be self-contained, have a clear intended use, avoid functional overlap, and promote token efficiency. Their key line: *"If a human engineer can't definitively say which tool should be used in a given situation, an AI agent can't be expected to do better."* At RIVET, `/implement` is an orchestrator skill — it calls other skills (including `/review-pr`) as part of a common workflow for implementing features or fixing bugs. The skills don't overlap; they compose. `/implement` doesn't duplicate what `/review-pr` does; it delegates to it at the right moment in the workflow. Clear purpose, no overlap, composable rather than monolithic.

**Refactors** are what make the knowledge layer trustworthy. If your CLAUDE.md and PILRs document one pattern but the codebase contains several competing examples, the agent will pattern-match against the code it sees rather than the guidance you've written. Refactoring to consistency isn't just a code quality concern — it's what makes your context engineering actually apply. A codebase that matches its documentation is one where the agent's understanding can genuinely accumulate rather than constantly being undercut by contradictory examples.

There's a frontier problem that PILRs, hooks, and refactors don't fully solve: **the judgment problem**. Anthropic's [harness design research](https://www.anthropic.com/engineering/harness-design-long-running-apps) found that agents consistently overpraise their own work, especially on subjective tasks where no binary correctness check exists. *"Out-of-the-box Claude performs poorly as QA, identifying issues then rationalizing their insignificance."* Even after iterative prompt tuning, subtle layout problems, unintuitive interactions, and deeply nested feature bugs escaped detection. Their solution: a GAN-inspired architecture that separates generation from evaluation, with a dedicated evaluator agent providing concrete feedback through iterative cycles.

PILRs solve the knowledge problem. Hooks solve the mechanical quality problem. But knowing when work is *good enough* — that remains partially unsolved when the same agent is both author and reviewer. Our `/review-pr` skill currently runs within the generating agent's session, which means it's fighting against a documented bias. Based on Anthropic's findings, the next experiment is splitting the evaluator into an isolated agent with a fresh context window — one that has access to the same PILRs and sprint contract criteria but none of the sunk-cost attachment to the implementation it's reviewing. We haven't built this yet, but the harness design research makes a compelling case that the separation is load-bearing.

---

## The System as a Whole

Context engineering isn't a single thing you add to your workflow. It's a system:

- **CLAUDE.md** gives the agent a reliable starting point in every session, routing it to the right knowledge layer for the task
- **Type 1 PILRs** (ephemeral) give the agent task-specific context for the current feature
- **Type 2 PILRs** (evergreen) give the agent durable system knowledge that accumulates across the team
- **Type 3 PILRs** (cumulative) give the agent institutional memory - patterns from past problems and solutions
- **Automated indexing** (via tools like Indexer) keeps the navigation layer current without manual maintenance
- **Hooks** close the feedback loop automatically — keeping the gap between what the agent produces and what the codebase expects from widening with every session
- **Skills** encode your process so it compounds — every improvement to a skill benefits every future invocation
- **Refactors** align the codebase with its documentation, making the knowledge layer trustworthy rather than constantly undercut by contradictory examples

Each layer makes the others more valuable. `CLAUDE.md` works better when it points to well-indexed PILRs for depth. Skills work better when they can rely on consistent patterns being enforced by pre-existing patterns. And the Type 3 knowledge base becomes more valuable with every problem solved - each solution makes the next agent session smarter.

The goal is an agent that continuously improves at your specific product — not because you wrote a better prompt, but because you built an environment where knowledge accumulates, is enforced, and is accessible on demand. A human developer builds that depth over years of tenure. Your agent can build it over sessions and PRs. The pattern is the same; the pace is different. Each session is a little better than the last. The investment compounds.

That's context engineering. It's slower to set up than writing a good prompt. It pays off at a completely different scale.

One final principle, and it's the most important one for longevity. Anthropic's harness design team [puts it directly](https://www.anthropic.com/engineering/harness-design-long-running-apps): *"Each harness component encodes assumptions about what models cannot do. These warrant continuous stress-testing as capabilities evolve."* They demonstrated this concretely — sprint decomposition was essential for Sonnet 4.5 (which exhibited context anxiety and lost coherence on long tasks) but became unnecessary overhead with Opus 4.6 (which plans more carefully and sustains longer tasks natively). Scaffolding that was load-bearing six months ago became dead weight.

This applies to everything in this post. Your indexing infrastructure, your context window management, your three-layer knowledge base, your multi-phase pipelines with compressed handoffs — all of it encodes assumptions about what models can't do today. Some of those assumptions will become wrong. The natural instinct is to build this infrastructure and leave it. The right instinct is to treat it as living scaffolding: continuously re-examine whether each piece is still earning its keep. Rather than the complexity shrinking as models improve, it moves — better models create space for more ambitious applications, and the skill lies in finding which components remain load-bearing and where new possibilities emerge.

The investment compounds. But only if you keep the scaffolding honest.

---

*We'll be going deep on this at the [April Detroit Developers meetup](/events/agentic-advanced-practitioners-guide/). Come find me there if you want to talk shop.*

---

## References

- [Advanced Agentic Coding & The Journey Towards 3x Product Development Velocity](/blog/agentic-coding-advanced-guide/) — the broader guide this post expands on
- [Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — Anthropic's applied AI team on attention budgets, just-in-time retrieval, and tool design
- [Building Effective Agents for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Anthropic's harness design research on context anxiety, sprint contracts, and multi-agent evaluation
- [Context Rot Research](https://www.trychroma.com/research/context-rot) — Chroma's empirical analysis of performance degradation across 18 models
- [Recursive Language Models](https://arxiv.org/html/2512.24601v2) — research on processing inputs beyond context window limits
- [OpenClaw Memory System](https://docs.openclaw.ai/concepts/memory) — personal assistant agent memory architecture with append-only logs and curated long-term memory
- [Advanced Codebase Indexing Strategies for AI Agents](https://github.com/AndyInternet/indexer/blob/main/research.md) — Andy Lawrence's field research on indexing approaches and task completion rates
- [Indexer](https://github.com/AndyInternet/indexer) — open-source codebase index generator using AST parsing and PageRank
- [Superpowers Plugin for Claude Code](https://github.com/obra/superpowers) — PILRs formalized as a reusable plugin with built-in indexing and retrieval
- [Signal Advisors](https://www.signaladvisors.com/) — Detroit-based B2B SaaS startup serving PILRs via MCP server across multiple repositories
- [Ryan Burr](https://www.linkedin.com/in/ryan-burr2/) — Director of Engineering at Signal Advisors
- [claude-mem](https://github.com/thedotmack/claude-mem) — persistent memory plugin for Claude Code with dual-storage (SQLite FTS5 + ChromaDB) and progressive disclosure retrieval
- [Agentic Software Development — March Detroit Developers Meetup](/events/agentic-software-development/) — panel event referenced in the Signal Advisors section
- [Agentic Software Development: Advanced Practitioner's Guide — April Detroit Developers Meetup](/events/agentic-advanced-practitioners-guide/) — upcoming deep-dive on these topics
