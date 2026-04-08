---
layout: post.njk
title: "The Three Layers of Agentic Engineering Maturity"
date: 2026-04-08
author: "Phil Borel"
excerpt: "Prompt engineering, context engineering, and harness engineering are three distinct disciplines with different ceilings — here's how we think about investing across them."
permalink: /blog/agentic-coding-maturity/
draft: true
---

<div style="background: #181825; border: 1px solid #313244; border-radius: 8px; padding: 12px 20px; max-width: 700px; margin-bottom: 16px; display: flex; align-items: center; gap: 12px;">
  <span style="color: #fab387; font-size: 18px;">&#9654;</span>
  <span><a href="/slides/agentic-coding-maturity/#1" style="color: #89b4fa; font-weight: 600;">View the slides</a> <span style="color: #a6adc8;">that accompany this post</span></span>
</div>

*This is a follow-up on our journey developing agentic software engineering practices at RIVET. It builds on the story started in [Advanced Agentic Coding & The Journey Towards 3x Product Development Velocity](https://detroitdevelopers.com/blog/agentic-coding-advanced-guide/).*

---

When engineers talk about "using AI," they're often conflating three distinct engineering disciplines — each with its own investment curve, its own ceiling, and its own compounding dynamics.

At RIVET, we've been bumping into this conflation repeatedly as we invest deeper into agentic development. The language "prompt engineering" gets used to describe everything from a single sentence in a chat window to a full multi-agent harness running in production. That conflation makes it hard to think clearly about where to invest next and why.

So here's the framing we've settled on internally: **prompt engineering, context engineering, and harness engineering**. Three nested disciplines within what we call **agentic software engineering** — the practice of building *with* agents as a core part of your development workflow. And agentic software engineering is itself a subset of something broader: **AI engineering**, the discipline of building agentic systems as products and infrastructure, not just using them as tools.

That distinction matters. AI engineering is the broader discipline — it includes building LLM-powered products, designing retrieval systems, fine-tuning models, building evaluation pipelines, and shipping agent infrastructure at scale. (Chip Huyen's [*AI Engineering*](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) is a fantastic & comprehensive reference on the field.) It's what MLOps became when foundation models arrived. Agentic software engineering is one slice of that: the practice of using agents as collaborators in your own development workflow. Most of this post is about that inner slice — prompt, context, and harness engineering as they apply to writing better software faster. But the outermost layer, harness engineering, starts to blur the line. When you're programming *around* the model, designing autonomous workflows, and shipping agent outputs to production, you're not just using AI to code. You're doing AI engineering.

<svg viewBox="0 0 600 340" style="max-width:600px;width:100%;display:block;margin:1.5em auto;" font-family="'JetBrains Mono',monospace">
  <!-- AI Engineering (outermost) -->
  <rect x="10" y="10" width="580" height="320" rx="12" fill="#b4befe" fill-opacity="0.06" stroke="#b4befe" stroke-width="1.5" stroke-dasharray="6,4"/>
  <text x="300" y="33" text-anchor="middle" fill="#b4befe" font-size="11">AI Engineering</text>
  <!-- Agentic Software Engineering -->
  <rect x="55" y="45" width="490" height="250" rx="10" fill="#cba6f7" fill-opacity="0.06" stroke="#cba6f7" stroke-width="1.5"/>
  <text x="300" y="68" text-anchor="middle" fill="#cba6f7" font-size="11">Agentic Software Engineering</text>
  <!-- Harness Engineering -->
  <rect x="100" y="80" width="400" height="180" rx="8" fill="#fab387" fill-opacity="0.08" stroke="#fab387" stroke-width="2"/>
  <text x="300" y="103" text-anchor="middle" fill="#fab387" font-size="12">Harness Engineering</text>
  <!-- Context Engineering -->
  <rect x="155" y="115" width="290" height="110" rx="6" fill="#89b4fa" fill-opacity="0.1" stroke="#89b4fa" stroke-width="2"/>
  <text x="300" y="138" text-anchor="middle" fill="#89b4fa" font-size="12">Context Engineering</text>
  <!-- Prompt Engineering (innermost) -->
  <rect x="210" y="150" width="180" height="40" rx="4" fill="#a6e3a1" fill-opacity="0.15" stroke="#a6e3a1" stroke-width="2"/>
  <text x="300" y="175" text-anchor="middle" fill="#a6e3a1" font-size="12" font-weight="bold">Prompt Engineering</text>
</svg>

The three layers are a Russian doll. Prompt engineering lives inside context engineering, which lives inside harness engineering. You can't do context engineering well without solid prompting fundamentals. You can't build a harness that works without the context layer feeding it the right knowledge. Each outer layer *contains and depends on* the inner ones.

This means investment compounds in one direction. Getting better at prompt engineering makes your context engineering more effective, which makes your harness engineering more powerful. But it also means skipping layers doesn't work. A team that jumps straight to building agent harnesses without investing in prompt craft and knowledge infrastructure is building on sand.

---

## Prompt Engineering

Prompt engineering is the craft of telling an agent what to do — and doing it precisely enough that it actually does it.

This means writing clear, unambiguous instructions. It means defining rules that encode your team's expectations (what patterns to follow, what to avoid, what "done" looks like). It means building a `CLAUDE.md` that gives the agent reliable orientation at the start of every session. It means building skills that encode your process as reusable commands — `/implement`, `/review-pr`, `/update-project-docs` — so you stop re-explaining your workflow every time.

The feedback loop here is tight and human-scaled. You write a better rule, you see better output in the next session. It compounds, but it compounds within a session or across a few days.

RIVET is deep in this layer. We've invested heavily in our `CLAUDE.md`, our rules files, our skills. We're thoughtful about the balance between over-specification (bloated instructions that crowd out the actual task) and under-specification (vague guidance that the agent ignores). We're continuously iterating.

What we haven't extracted much value from yet: hooks. Hooks — automated triggers that fire on agent events like post-edit or post-tool-use — are technically a prompt engineering feature in most frameworks. But in practice, they start to feel like harness engineering: you're programming *around* the agent rather than *to* it.

In practice, at RIVET, prompt engineering is almost entirely markdown optimization — writing and refining the `CLAUDE.md`, rules files, and skill definitions that shape agent behavior. The medium is text; the feedback loop is "edit a file, run a session, see what changed."

**The ceiling on prompt engineering is real.** You can write perfect instructions and still lose the thread on a complex feature if the agent doesn't have the right knowledge to act on them. That's where context engineering picks up.

---

## Context Engineering

Context engineering is the discipline of managing what knowledge the agent has access to — and when.

A better-prompted agent with bad context will still fail. It'll make decisions that contradict architectural choices made three sprints ago. It'll re-derive patterns your team has already solved. It'll treat every session as day one, perpetually new, never compounding. Context engineering is the infrastructure that prevents that. It's the discipline that makes the agent's knowledge *accumulate* rather than reset.

At RIVET, we do this through [PILRs — Persistent Indexed Learning Repositories](https://detroitdevelopers.com/blog/context-engineering-pilrs/). Three types, each with a different lifecycle:

- <strong style="color: #cba6f7;">Type 1 (Ephemeral):</strong> Per-feature planning docs, test plans, decision notes. They live in `temp/projects/`, scoped to a single PR or sprint. They're working memory, not permanent record.
- <strong style="color: #a6e3a1;">Type 2 (Evergreen):</strong> Architecture docs, system design docs ("Deep Maps"), API contracts. They describe how the system works and why it works that way. These are the map the agent navigates with.
- <strong style="color: #f38ba8;">Type 3 (Cumulative):</strong> Solved problems, incident patterns, cross-system context. Institutional memory. The layer that makes the agent behave less like a generic assistant and more like someone who's worked on your specific product for a year.

We're early-to-mid here. The pattern is right; the infrastructure isn't finished. Our Type 1 docs are solid. Our Type 2 Deep Maps are in progress. Our Type 3 knowledge base is nascent — it's growing, but it's not yet the compound-interest machine it could be. We're also starting to host shared repositories for these learnings to make them team artifacts rather than personal ones.

In practice, context engineering at RIVET is still heavily markdown-based — writing and organizing the PILR documents themselves — but the work extends beyond text. It includes workflow optimization (how and when context gets surfaced to the agent), and we're starting to invest in data infrastructure: databases, indexing systems, and shared hosting that make the knowledge layer a team resource rather than a collection of files on one developer's machine.

**The ceiling on context engineering is higher than prompt engineering** — a well-informed agent is dramatically more capable than a well-instructed one with gaps in its knowledge. But even a perfectly informed agent operating inside a single session, returning results to a human, has a ceiling. That ceiling is where harness engineering lives.

---

## Harness Engineering

Harness engineering is what happens when you stop running the agent interactively and start building systems that run agents *for you*.

This is programming *around* the model. It's designing workflows where agents execute multi-step tasks autonomously, hand off outputs between phases, check their own work, and ship results — with humans reviewing outcomes rather than supervising every step. In practice, harness engineering includes everything from the inner two layers — the markdown, the knowledge infrastructure — plus writing code: building an agentic application using model provider SDKs, adding guardrails and deterministic steps where reasoning isn't needed (running a script is better than asking a model to re-derive the answer every time), and wiring the whole thing into your team's existing systems.

The returns here are categorically different from prompt or context engineering — and not just in magnitude. Prompt and context engineering make *your* work faster. Harness engineering expands what work gets done *at all*.

Every engineering team has a long tail of valuable work — bug fixes, small features, UI polish, minor tweaks — that never makes it to the top of the sprint because higher-priority things keep landing. That work isn't unimportant; it's just unscheduled. A harness can collapse a full ticket — research, implementation, PR — into a flow that runs while you're in meetings, turning that backlog into throughput. The ceiling isn't +1x or even +3x. It's much larger.

RIVET is early in this layer, but we have one real case study: **Odradek**, our customer-reported bug resolution agent.

Odradek is built on the [Claude Code SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/sdk) — a Mac desktop app with a cloud-hosted database for multiplayer support, where multiple engineers can see the queue, claim tickets, and review outputs. When a customer-reported bug comes in, Odradek:

1. **Investigates** the issue — reading relevant source files, checking git history for related changes, consulting our PILR knowledge base for matching past patterns
2. **Fixes** the issue — scoped, surgical edits to the relevant files
3. **Verifies** its own work — regression checks, test runs
4. **Puts up a PR** — with a human-readable description, ready for review

One-shot resolution rate: **60%**. The other 40% are harder issues — often involving config changes outside our codebase (think: fixing permissions on a GCP API token, or changing an environment variable in an external system). Those still require human judgment. But even at 60%, the impact on our bug backlog has been concrete:

- <strong style="color: #f38ba8;">P1s (ship-within-a-week bugs):</strong> We used to sacrifice an engineer every sprint on a round-robin rotation dedicated solely to these. Odradek bought us back roughly half an engineer — the on-rotation dev stays on top of P1s more efficiently and has time left over for sprint work.
- <strong style="color: #fab387;">P2s (fix-within-a-quarter bugs):</strong> These used to stack up for months before anyone could get to them. Now they get addressed as they come in.
- <strong style="color: #a6e3a1;">P3s (nice-to-fix bugs):</strong> These were effectively permanent backlog residents. Some of them are actually getting fixed now — work that would never have happened at our team size.

And Odradek today is still a manually-triggered, engineer-operated tool. We're treating it as the seed of something much more autonomous. Here's where we're taking it:

- **Event-driven triggers** — fire automatically when a bug is opened in HubSpot or GitHub Issues, not manually launched by an engineer
- **Cloud-hosted dashboard** — non-engineers (CS, product) can log in and see fix statuses without pinging a dev
- **MS Teams integration** — ask about a bug status, kick off an investigation, or request a fix directly from chat
- **Parallel issue processing** — right now Odradek works on one issue at a time against a single local copy of the codebase. Git worktrees (or isolated clones) would let it spin up multiple working copies and process several bugs concurrently, collapsing a queue into parallel throughput
- **Ephemeral test environments** — instead of just putting up a PR, Odradek spins up a temporary environment via k8s so CS and product can verify the fix themselves, without a developer deploying to a dev server
- **Model routing** — not every task needs the most capable (and most expensive) model. Investigation and triage might run on a smaller model or an open-source option like Qwen Coder, while the actual fix uses a frontier model. Routing tasks to the right model tier is how you keep API costs sustainable as the harness scales

Each of those steps removes an engineer from the loop on work that doesn't require engineering judgment. The same harness pattern extends to small features, tweaks, and polish items — exactly the long tail we described above. Longer-term, we're starting to explore whether a harness can move beyond fixes and into new feature development — prototyping and building, not just repairing. That's a harder problem with a different workflow, and we're very early, but it's the natural next frontier once bug resolution is reliable.

This doesn't mean engineers have less to do. Complex features, architectural decisions, and novel problem-solving still require human engineers — and always will. What changes is the *mix* of engineering work. Some of the time that used to go to routine feature dev shifts toward building and improving the harness itself. You're still engineering; you're just engineering at a higher leverage point. The goal isn't a faster engineer. It's a larger team.

---

## The Velocity Curves

Here's the intuition made visual. Prompt and context engineering follow logarithmic curves — fast early returns that taper as you approach the ceiling. Harness engineering is different: it follows an S-curve, slow at first but accelerating dramatically in the mid-range before tapering at the top. The ceilings are different, our position on each curve is different, and the shape of the harness curve is why it rewards sustained investment differently than the other two.

<svg viewBox="0 0 600 300" style="max-width:600px;width:100%;display:block;margin:1.5em auto;" font-family="'JetBrains Mono',monospace">
  <!-- Grid -->
  <line x1="70" y1="260" x2="580" y2="260" stroke="#313244" stroke-width="1"/>
  <line x1="70" y1="203.75" x2="580" y2="203.75" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="147.5" x2="580" y2="147.5" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="91.25" x2="580" y2="91.25" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="580" y2="35" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="70" y2="260" stroke="#313244" stroke-width="1"/>
  <!-- Title -->
  <text x="325" y="20" text-anchor="middle" fill="#cdd6f4" font-size="14" font-weight="bold">Prompt Engineering</text>
  <!-- Y-axis labels -->
  <text x="62" y="264" text-anchor="end" fill="#a6adc8" font-size="10">0</text>
  <text x="62" y="207.75" text-anchor="end" fill="#a6adc8" font-size="10">+0.25x</text>
  <text x="62" y="151.5" text-anchor="end" fill="#a6adc8" font-size="10">+0.50x</text>
  <text x="62" y="95.25" text-anchor="end" fill="#a6adc8" font-size="10">+0.75x</text>
  <text x="62" y="39" text-anchor="end" fill="#a6adc8" font-size="10">+1.0x</text>
  <!-- Y-axis title -->
  <text x="16" y="147.5" text-anchor="middle" fill="#a6adc8" font-size="10" transform="rotate(-90,16,147.5)">Velocity Gain</text>
  <!-- X-axis labels -->
  <text x="70" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">0</text>
  <text x="172" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">2</text>
  <text x="274" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">4</text>
  <text x="376" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">6</text>
  <text x="478" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">8</text>
  <text x="580" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">10</text>
  <!-- X-axis title -->
  <text x="325" y="296" text-anchor="middle" fill="#a6adc8" font-size="10">Investment in Tooling</text>
  <!-- Shaded area up to RIVET (x=8) -->
  <path d="M70,260 L121,170 L172,125 L223,98 L274,80 L325,66.5 L376,57.5 L427,50.75 L478,44 L478,260 Z" fill="#a6e3a1" opacity="0.2"/>
  <!-- Full curve -->
  <polyline points="70,260 121,170 172,125 223,98 274,80 325,66.5 376,57.5 427,50.75 478,44 529,39.5 580,35" fill="none" stroke="#a6e3a1" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- RIVET marker -->
  <line x1="478" y1="35" x2="478" y2="260" stroke="#a6e3a1" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
  <circle cx="478" cy="44" r="4" fill="#a6e3a1"/>
  <text x="478" y="30" text-anchor="middle" fill="#a6e3a1" font-size="11" font-weight="bold">RIVET</text>
</svg>

<svg viewBox="0 0 600 300" style="max-width:600px;width:100%;display:block;margin:1.5em auto;" font-family="'JetBrains Mono',monospace">
  <!-- Grid -->
  <line x1="70" y1="260" x2="580" y2="260" stroke="#313244" stroke-width="1"/>
  <line x1="70" y1="203.75" x2="580" y2="203.75" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="147.5" x2="580" y2="147.5" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="91.25" x2="580" y2="91.25" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="580" y2="35" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="70" y2="260" stroke="#313244" stroke-width="1"/>
  <!-- Title -->
  <text x="325" y="20" text-anchor="middle" fill="#cdd6f4" font-size="14" font-weight="bold">Context Engineering</text>
  <!-- Y-axis labels (0 to 3) -->
  <text x="62" y="264" text-anchor="end" fill="#a6adc8" font-size="10">0</text>
  <text x="62" y="207.75" text-anchor="end" fill="#a6adc8" font-size="10">+0.75x</text>
  <text x="62" y="151.5" text-anchor="end" fill="#a6adc8" font-size="10">+1.5x</text>
  <text x="62" y="95.25" text-anchor="end" fill="#a6adc8" font-size="10">+2.25x</text>
  <text x="62" y="39" text-anchor="end" fill="#a6adc8" font-size="10">+3.0x</text>
  <!-- Y-axis title -->
  <text x="16" y="147.5" text-anchor="middle" fill="#a6adc8" font-size="10" transform="rotate(-90,16,147.5)">Velocity Gain</text>
  <!-- X-axis labels (0 to 20) -->
  <text x="70" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">0</text>
  <text x="172" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">4</text>
  <text x="274" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">8</text>
  <text x="376" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">12</text>
  <text x="478" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">16</text>
  <text x="580" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">20</text>
  <!-- X-axis title -->
  <text x="325" y="296" text-anchor="middle" fill="#a6adc8" font-size="10">Investment in Tooling</text>
  <!-- Shaded area up to RIVET (30% = x=6) -->
  <path d="M70,260 L121,196.25 L172,153.5 L223,123.5 L223,260 Z" fill="#89b4fa" opacity="0.2"/>
  <!-- Full curve -->
  <polyline points="70,260 121,196.25 172,153.5 223,123.5 274,101 325,82.25 376,68.75 427,57.5 478,48.5 529,41 580,35" fill="none" stroke="#89b4fa" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- RIVET marker -->
  <line x1="223" y1="35" x2="223" y2="260" stroke="#89b4fa" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
  <circle cx="223" cy="123.5" r="4" fill="#89b4fa"/>
  <text x="223" y="116" text-anchor="middle" fill="#89b4fa" font-size="11" font-weight="bold">RIVET</text>
</svg>

<svg viewBox="0 0 600 300" style="max-width:600px;width:100%;display:block;margin:1.5em auto;" font-family="'JetBrains Mono',monospace">
  <!-- Grid -->
  <line x1="70" y1="260" x2="580" y2="260" stroke="#313244" stroke-width="1"/>
  <line x1="70" y1="215" x2="580" y2="215" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="170" x2="580" y2="170" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="125" x2="580" y2="125" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="80" x2="580" y2="80" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="580" y2="35" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="70" y2="260" stroke="#313244" stroke-width="1"/>
  <!-- Title -->
  <text x="325" y="20" text-anchor="middle" fill="#cdd6f4" font-size="14" font-weight="bold">Harness Engineering</text>
  <!-- Y-axis labels (0 to 10) -->
  <text x="62" y="264" text-anchor="end" fill="#a6adc8" font-size="10">0</text>
  <text x="62" y="219" text-anchor="end" fill="#a6adc8" font-size="10">+2x</text>
  <text x="62" y="174" text-anchor="end" fill="#a6adc8" font-size="10">+4x</text>
  <text x="62" y="129" text-anchor="end" fill="#a6adc8" font-size="10">+6x</text>
  <text x="62" y="84" text-anchor="end" fill="#a6adc8" font-size="10">+8x</text>
  <text x="62" y="39" text-anchor="end" fill="#a6adc8" font-size="10">+10x</text>
  <!-- Y-axis title -->
  <text x="16" y="147.5" text-anchor="middle" fill="#a6adc8" font-size="10" transform="rotate(-90,16,147.5)">Velocity Gain</text>
  <!-- X-axis labels (0 to 40) -->
  <text x="70" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">0</text>
  <text x="172" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">8</text>
  <text x="274" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">16</text>
  <text x="376" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">24</text>
  <text x="478" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">32</text>
  <text x="580" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">40</text>
  <!-- X-axis title -->
  <text x="325" y="296" text-anchor="middle" fill="#a6adc8" font-size="10">Investment in Tooling</text>
  <!-- Shaded area up to RIVET (20% = x=8) -->
  <path d="M70,260 L121,256.6 L172,248.75 L172,260 Z" fill="#fab387" opacity="0.2"/>
  <!-- Full curve (S-curve) -->
  <polyline points="70,260 121,256.6 172,248.75 223,233 274,208.25 325,174.5 376,138.5 427,104.75 478,77.75 529,55.25 580,35" fill="none" stroke="#fab387" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- RIVET marker -->
  <line x1="172" y1="35" x2="172" y2="260" stroke="#fab387" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.7"/>
  <circle cx="172" cy="248.75" r="4" fill="#fab387"/>
  <text x="182" y="242" text-anchor="start" fill="#fab387" font-size="11" font-weight="bold">RIVET</text>
</svg>

<svg viewBox="0 0 600 300" style="max-width:600px;width:100%;display:block;margin:1.5em auto;" font-family="'JetBrains Mono',monospace">
  <!-- Grid -->
  <line x1="70" y1="260" x2="580" y2="260" stroke="#313244" stroke-width="1"/>
  <line x1="70" y1="215" x2="580" y2="215" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="170" x2="580" y2="170" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="125" x2="580" y2="125" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="80" x2="580" y2="80" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="580" y2="35" stroke="#313244" stroke-width="0.5" stroke-dasharray="4"/>
  <line x1="70" y1="35" x2="70" y2="260" stroke="#313244" stroke-width="1"/>
  <!-- Title -->
  <text x="325" y="20" text-anchor="middle" fill="#cdd6f4" font-size="14" font-weight="bold">The Three Ceilings</text>
  <!-- Y-axis labels (0 to 10) -->
  <text x="62" y="264" text-anchor="end" fill="#a6adc8" font-size="10">0</text>
  <text x="62" y="219" text-anchor="end" fill="#a6adc8" font-size="10">+2x</text>
  <text x="62" y="174" text-anchor="end" fill="#a6adc8" font-size="10">+4x</text>
  <text x="62" y="129" text-anchor="end" fill="#a6adc8" font-size="10">+6x</text>
  <text x="62" y="84" text-anchor="end" fill="#a6adc8" font-size="10">+8x</text>
  <text x="62" y="39" text-anchor="end" fill="#a6adc8" font-size="10">+10x</text>
  <!-- Y-axis title -->
  <text x="16" y="147.5" text-anchor="middle" fill="#a6adc8" font-size="10" transform="rotate(-90,16,147.5)">Velocity Gain</text>
  <!-- X-axis labels (0 to 40) -->
  <text x="70" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">0</text>
  <text x="172" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">8</text>
  <text x="274" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">16</text>
  <text x="376" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">24</text>
  <text x="478" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">32</text>
  <text x="580" y="278" text-anchor="middle" fill="#a6adc8" font-size="10">40</text>
  <!-- X-axis title -->
  <text x="325" y="296" text-anchor="middle" fill="#a6adc8" font-size="10">Investment in Tooling</text>
  <!-- Prompt curve (green) — plateaus at 1.0 -->
  <polyline points="70,260 121,248.75 172,242.5 223,239.75 274,238.4 325,238 376,237.7 427,237.5 478,237.5 529,237.5 580,237.5" fill="none" stroke="#a6e3a1" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Context curve (blue) — plateaus at 3.0 -->
  <polyline points="70,260 121,240.9 172,228 223,219 274,212.3 325,206.7 376,202.6 427,199.25 478,196.5 529,194.3 580,192.5" fill="none" stroke="#89b4fa" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Harness curve (peach) — reaches 10.0 -->
  <polyline points="70,260 121,256.6 172,248.75 223,233 274,208.25 325,174.5 376,138.5 427,104.75 478,77.75 529,55.25 580,35" fill="none" stroke="#fab387" stroke-width="2.5" stroke-linejoin="round"/>
  <!-- Legend -->
  <line x1="400" y1="48" x2="420" y2="48" stroke="#a6e3a1" stroke-width="2.5"/>
  <text x="425" y="52" fill="#a6e3a1" font-size="10">Prompt (+1x)</text>
  <line x1="400" y1="63" x2="420" y2="63" stroke="#89b4fa" stroke-width="2.5"/>
  <text x="425" y="67" fill="#89b4fa" font-size="10">Context (+3x)</text>
  <line x1="400" y1="78" x2="420" y2="78" stroke="#fab387" stroke-width="2.5"/>
  <text x="425" y="82" fill="#fab387" font-size="10">Harness (+10x)</text>
</svg>

A few things worth pointing out in these charts:

**The ceilings are the point.** Prompt engineering is real and valuable — we've captured most of what it has to give us, and it's made us meaningfully more effective. But it tops out around +1x additional velocity. Context engineering takes more sustained investment but tops out around +3x. Harness engineering requires the most investment — and the longest runway — but tops out around +10x. These aren't firm numbers; they're directional. The message is that the disciplines aren't interchangeable, and each outer layer demands more work but delivers categorically larger returns.

Crucially, the harness ceiling is higher because it measures something different: not just how fast your team works, but how much of your backlog actually gets addressed.

**We're far along the prompt curve, early-mid on context, and very early on harness.** Even Odradek in its current form — a first-generation agent harness that one-shots 60% of customer bugs — represents early returns from a curve that hasn't yet hit its steepest section. The S-curve shape means the most asymmetric returns are just ahead of us. That's where we're investing.

---

## Where to invest your tokens

If you're early in your agentic journey, prompt engineering is the right starting point. The feedback loop is short, the skills are transferable, and you need a foundation before context or harness work pays off.

If you're mid-stage — comfortable with prompting, starting to feel the limits — context engineering is where the next returns are. Build the knowledge layer. Start with PILRs in the places where your agents are most confused or most repetitive. Index them so the agent can navigate selectively rather than loading everything at once. We wrote a [deep dive on how we build and use PILRs](https://detroitdevelopers.com/blog/context-engineering-pilrs/) if you want a practical starting point.

If you're operating at a scale where prompt and context engineering are solid, and you're watching valuable work pile up in backlogs because your team is at capacity — that's the signal to start engineering a harness. Pick a narrow, repetitive workflow — bug triage, small fixes, polish items. Build around it. Measure the one-shot rate. The question isn't "did it make us faster?" It's "did work get done that wouldn't have happened otherwise?"

We're doing all three simultaneously, which means we're spreading investment across disciplines at different maturities. That's intentional — the layers are interdependent. A harness without good context engineering is just an autonomous agent that makes confident, uninformed decisions. Context without harness is a knowledge base that still requires a human to unlock every time.

The goal is a system where all three layers reinforce each other. And then — like any good compounding investment — you keep building.

---

<div style="background: #181825; border: 1px solid #313244; border-radius: 8px; padding: 20px 24px; max-width: 700px;">
  <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
    <span style="color: #a6e3a1;">&#9670;</span> Detroit Software Developers
  </div>
  <p style="margin: 0 0 12px; color: #a6adc8;">We're a community of professional developers in Detroit. We meet monthly to share knowledge, experiences &amp; good vibes.</p>
  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
    <a href="/events/" style="color: #89b4fa;">Upcoming events →</a>
  </div>
</div>

---

## References

- Chip Huyen, [*AI Engineering*](https://www.oreilly.com/library/view/ai-engineering/9781098166298/) (O'Reilly, 2025) — comprehensive reference on the broader AI engineering discipline
- [Advanced Agentic Coding & The Journey Towards 3x Product Development Velocity](https://detroitdevelopers.com/blog/agentic-coding-advanced-guide/) — my first post on agentic development practices at RIVET
- [Context Engineering with PILRs](https://detroitdevelopers.com/blog/context-engineering-pilrs/) — deep dive on how I've built and used Persistent Indexed Learning Repositories @ RIVET
- [Claude Code SDK](https://docs.anthropic.com/en/docs/agents-and-tools/claude-code/sdk) — the SDK we use to power Odradek