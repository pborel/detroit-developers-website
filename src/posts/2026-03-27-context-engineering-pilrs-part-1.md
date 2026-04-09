---
layout: post.njk
title: "Context Engineering with PILRs, Part 1: Building Knowledge That Compounds"
date: 2026-03-27
author: "Phil Borel"
excerpt: "Your agent can get better at your product over time — like a human developer — but only if you build the infrastructure to make it possible. Here's what to capture and why it matters."
permalink: /blog/{{ page.fileSlug }}/
draft: true
---

*This is Part 1 of a two-part series on context engineering with PILRs. This post covers the problem, the foundation, and the three types of knowledge your agent needs. [Part 2](/blog/context-engineering-pilrs-part-2/) covers indexing, tooling, implementations, and the full system.*

*This series expands on the context engineering section of my [Advanced Practitioner's Guide](/blog/agentic-coding-advanced-guide/) post. If you haven't read that one yet, it's worth checking out for the broader picture.*

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

The `index.json` is what makes this work at scale. Without it, agents either load too much (context overflow) or too little (missing what they need). The index lets the agent navigate selectively - pulling the auth patterns when working on auth, the state patterns when touching state management. This is the simplest form of a PILR index — a static file you maintain manually. More sophisticated implementations use vector embeddings, BM25 hybrid search, or AST-derived structural maps (covered in Part 2). claude-mem takes a different approach entirely: rather than indexing by topic or structure, it uses a temporal/semantic index — a 3-layer progressive disclosure pattern where `search()` returns compact ID-based results (50-100 tokens), `timeline()` provides chronological context around matches, and `get_observations()` fetches full details only for filtered IDs (500-1000 tokens). This is structural indexing for *what the code is* versus temporal indexing for *what the agent did with it* — complementary approaches to the same selective retrieval problem. The mechanism differs; the goal is the same: selective retrieval over full context loading.

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

In [Part 2](/blog/context-engineering-pilrs-part-2/), we'll dig into why the index matters more than you think, explore tooling that automates it, and look at three real implementations of the full PILRs stack.

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
- [claude-mem](https://github.com/thedotmack/claude-mem) — persistent memory plugin for Claude Code with dual-storage (SQLite FTS5 + ChromaDB) and progressive disclosure retrieval
- [Signal Advisors](https://www.signaladvisors.com/) — Detroit-based B2B SaaS startup serving PILRs via MCP server across multiple repositories
- [Ryan Burr](https://www.linkedin.com/in/ryan-burr2/) — Director of Engineering at Signal Advisors
- [Agentic Software Development — March Detroit Developers Meetup](/events/agentic-software-development/) — panel event referenced in the Signal Advisors section
- [Agentic Software Development: Advanced Practitioner's Guide — April Detroit Developers Meetup](/events/agentic-advanced-practitioners-guide/) — upcoming deep-dive on these topics

<div style="background: #181825; border: 1px solid #313244; border-radius: 8px; padding: 20px 24px; max-width: 700px;">
  <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
    <span style="color: #a6e3a1;">&#9670;</span> Detroit Software Developers
  </div>
  <p style="margin: 0 0 12px; color: #a6adc8;">We're a community of professional developers in Detroit. We meet monthly to share knowledge, experiences &amp; good vibes.</p>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <a href="/events/" style="color: #89b4fa;">Upcoming events →</a>
  </div>
</div>
