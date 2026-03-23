# Option B: Chronological RIVET Case Study
## Agentic Software Development: Advanced Practitioner's Guide
### Talk Outline — April 16, 2026 · 50 minutes · Slides only

---

**Tone:** Honest, in-progress. Working case study, not a success story.
**Audience:** Software engineers already using Claude Code daily.
**CTA:** Explore skills. Plan codebase and process refactors.

---

## Structure Overview

~30 slides. RIVET is the main narrative thread — the audience follows your journey from a mandate landing at All Hands through to where things stand today, unresolved questions and all. The research appears when it informed a decision or validated what you were seeing, not as a standalone framework section.

**When to prefer B over A:** If you want a warmer, more personal delivery where your credibility comes from lived experience rather than framework presentation. Better fit for a keynote-style slot or a room that skews less technical.

---

## Intro *(3 min · 2 slides)*

**Slide 1 — Title**
- Agentic Software Development: Advanced Practitioner's Guide
- Phil Borel · RIVET · Detroit Developers

**Slide 2 — Framing**
- "A working case study. Not a success story. Yet."
- What this talk is and isn't: no polished retrospective, no benchmarks that went exactly as planned
- Brief: who I am, what RIVET is

---

## Ch. 1: The Moment *(5 min · 3 slides)*

**Slide 3 — The BHAG**
- CEO at All Hands: 3x product development velocity by Q1 2027
- First reaction: "Are they measuring that in story points? Am I getting paid 3x?"
- The BHAG is direction-setting, not end-state defining — which immediately surfaces the harder question

**Slide 4 — What Does 3x Even Mean?**
- Three honest answers: Vibes / Metrics / Outcomes
- All three matter. None is sufficient alone.
- The risk: 10x some metrics (generated code) while seeing modest gains on outcomes

**Slide 5 — The Wrong 20%**
- Craft Docs: writing code was always 20% of the work; testing, refining, validating was always 80%
- AI compresses the 20% dramatically — maybe 10x
- 10x on 20% doesn't get you to 3x overall. You have to accelerate the 80% too.
- That's a spec quality problem, a review process problem, an architectural discipline problem

---

## Ch. 2: What the Research Told Us *(8 min · 5 slides)*

**Slide 6 — AI Is an Amplifier**
- DORA 2025, 5,000 professionals: AI magnifies the strengths of high-performing orgs — and the dysfunctions of struggling ones
- We had to ask: what is AI about to amplify at RIVET?
- Three divergent backend patterns. Legacy frontend state management. Mixed PR discipline.

**Slide 7 — The Diverging Outcomes**
- 92% of developers using AI monthly, ~4 hrs/week saved on average
- But outcomes splitting: high-performing orgs → 50% fewer customer incidents
- Struggling orgs → 2× more incidents. Same tools.
- "AI is moving organizations in different directions." — Laura Tacho, DX

**Slide 8 — Taste × Discipline × Leverage**
- CJ Roth's framework. Multiplicative, not additive.
- Taste: knowing what to build and what quality looks like. When generation is free, knowing what's worth generating is the scarce skill.
- Discipline: specs before prompts, tests before shipping, reviews before merging
- Leverage: small teams, stacked PRs, agent orchestration, design engineers eliminating handoffs

**Slide 9 — The Data We Almost Ignored**
- CMU study of 807 repos after Cursor adoption: 281% increase in lines added, month one
- Month two: velocity gains gone. Back to pre-adoption levels.
- Static analysis warnings up ~30%, code complexity up ~41% — permanently
- "Slop creep" — Boris Tane: individually reasonable, collectively destructive
- The velocity gains were real and temporary. The tech debt was real and permanent.

**Slide 10 — The Decision**
- We could scale output fast, or we could invest in the harness first
- We chose the harness — acknowledging the j-curve: the thing you measure dips before it improves
- Conscious trade-off: developer, designer, PM time goes toward building systems for agentic coding, not normal work, in the near term

---

## Ch. 3: What We Changed — Process *(8 min · 5 slides)*

**Slide 11 — Everyone on Claude Code**
- Goal: every engineer has Claude Code as a primary tool
- Open door experimentation: more skills, more CLAUDE.md files, more prototypes
- Testing: VS Code extension, CLI, Cursor, GitHub cloud agents — converging on the "holy harness"
- Caveat: this will slow velocity and likely decrease quality in the short term. We know. We chose it.

**Slide 12 — Designers and PMs Vibe Coding**
- Deliberately blurring the design/product/engineering line
- Working prototypes to validate ideas, not to ship production code
- Reduces "translation loss" at every handoff
- Honest challenge: local dev environment setup is a blocker for non-engineers

**Slide 13 — AI Coding Guidelines**
- "Agentic Development @ RIVET" internal guide
- When to use AI vs. write by hand
- How to write a good spec
- PR complexity policy: one PR per independently deployable unit of value
- Tiered rigor: prototypes vs. production-critical deserve different levels of review

**Slide 14 — Metrics**
- Quality: test coverage, Change Failure Rate, MTTR
- Speed: Deployment Frequency, Change Lead Time
- Output: PR throughput, story points, features shipped
- Honest: not tracking full DORA yet. These are starting points.
- Watching for regressions as carefully as watching for gains

**Slide 15 — Community & Learning**
- Weekly AI Roundtable: what's new, what's cool, what worked, what failed
- Lunch & Learn: watch conference talks together, discuss over food
- Goal: continuous learning culture, not a one-time rollout
- The tools are changing fast enough that this must be a living practice

---

## Ch. 4: What We Built — The Harness *(12 min · 7 slides)*

**Slide 16 — CLAUDE.md + PILRs**
- CLAUDE.md: map, not encyclopedia — ~100 lines, pointers to deeper truth
- A large instruction file crowds out the actual task. When everything is "important," agents fall back to local pattern-matching.
- Persistent Indexed Learning Repos (PILRs): context that accumulates as the agent works
- index.json maps topics → documentation files. Agent doesn't load everything — loads what it needs.
- Goal: move Claude from "generic coding assistant" to "specialist who knows how RIVET is built"

**Slide 17 — Rules and Hooks**
- Rules: constraints the agent follows automatically — coding standards, naming patterns, file organization
- The OpenAI insight: if a constraint matters enough to document, it matters enough to enforce mechanically
- Aspiration: linter error messages that double as remediation instructions
- Hooks: automated actions triggered by agent behavior (linters post-generation, auto-formatting)
- Hooks are on the roadmap — not fully leveraged yet

**Slide 18 — Skills**
- Reusable packaged workflows: complex multi-step processes → single command
- At RIVET: reviewing code, building PILRs, implementing features, rewriting commit history, fixing specific bug classes
- Skills make agent usage programmable across the team

**Slide 19 — The /implement Skill**
- Input: PRD + Tech Spec → Project Plan (reviewed before code is written)
- Project Plan → Test Plan (automated tests + manual testing steps)
- Agent writes code, executes test plan, uses Claude Chrome Extension for UI testing
- Screenshots → gitignored folder → referenced in pr.md
- This is our version of agent observability
- Works ~25% of the time on the screenshot/browser piece. Worth it.

**Slide 20 — The Support Bot Agent**
- Concrete win. Before: ticket → 20 min understanding + 20 min finding code + fix time
- Now: agent triages, pulls relevant context, reproduces issue, proposes fix or surfaces what the engineer needs
- PILRs: persistent directory of previously solved problems with index
- Result: support ticket throughput measurably improved. Engineer on support duty gets half their time back.
- "Re-purchased half a developer."
- Why it works: the harness came first. Without CLAUDE.md and documented patterns, the agent would just be guessing.

**Slide 21 — Codebase Refactors as AI Infrastructure**
- Three divergent backend patterns → one layered architecture: DB → Model → Repo → Service → Controller → Router
- Defense-in-depth permissions at router, controller, and service levels
- Frontend: moving away from global state load → local, modular, component-level data fetching
- Same things that help humans navigate code help agents navigate code
- This isn't cleanup. It's infrastructure.

**Slide 22 — 4-Layer Review + Ephemeral Environments**
- Architectural review (human, before code written)
- Automated review (CI: /review-pr skill, SonarCloud, Copilot review, linting, tests)
- Human code review + manual QA (during PR, based on test steps)
- Full-app UAT/regression at sprint end — working toward replacing with Playwright
- Ephemeral environments: one per PR is the goal. Today we're contending for shared test servers.

---

## Ch. 5: What's Not Working *(8 min · 5 slides)*

**Slide 23 — Context Debt**
- Writing good CLAUDE.md files and knowledge bases takes real time
- Bootstrapping cost: documenting what lived in engineers' heads, in a format useful to an agent, while shipping product
- We underestimated this significantly
- PILRs are helping — organic accumulation vs. upfront documentation — but we're still early

**Slide 24 — The Review Bottleneck**
- Faros data predicted it: 98% more PRs, 91% more review time
- We still underestimated the cultural friction around small PRs
- Agentic development makes large PRs emotionally rewarding: the agent built an entire feature end-to-end
- Breaking it up feels like overhead. It isn't — but that takes experiencing it to believe.
- This is a habits change, not a tooling change. It takes longer than updating the CLI.

**Slide 25 — Attribution**
- We don't have clean data yet
- PRs per week, support ticket throughput, points per sprint, change failure rate
- Working toward proper DORA metrics
- Honest: some metrics will move fast, some won't move at all, some will initially get worse

**Slide 26 — Multi-Agent: Where We Actually Are**
- The promise: parallel agents on separate branches, fleet of AI collaborators
- What we have: GitHub Copilot cloud agents, support bot, 1–3 local tasks running at once
- "I've read sensational claims from Ramp and Stripe. We're not there."
- "I haven't figured out how to multiplex my brain yet."
- Not at multi-agent nirvana — and that's honest

**Slide 27 — The Honest Summary**
- J-curve is real. We're still in it.
- The things that are working are working because of the harness investment
- The things that aren't working require either more time or a different approach
- This is a living experiment, not a solved problem

---

## Close *(5 min · 3 slides)*

**Slide 28 — Where We Think We're Headed**
- Playwright tests replacing UAT marathon
- Ephemeral environments per PR
- Multi-agent workflows once we figure out the brain-multiplexing problem
- Better attribution data

**Slide 29 — Monday Morning**
- Write a CLAUDE.md for one repo: tech stack, architecture in two paragraphs, three things you wish every new engineer knew
- Try one skill: find a workflow you repeat and package it
- Identify one refactor that would make your codebase more agent-navigable — and put it on the roadmap

**Slide 30 — Questions / Resources**
- Blog post: detroitdevelopers.com
- DORA AI Capabilities Model · OpenAI Harness Engineering · CJ Roth · Pragmatic Engineer · CMU study
- Links to CLAUDE.md template, Superpowers plugin

---

## Key Differences from Option A

| | Option A | Option B |
|---|---|---|
| Structure | Thematic framework | Chronological journey |
| RIVET's role | Evidence woven through sections | The main narrative |
| Research | Dedicated section, full treatment | Introduced when it informed a decision |
| Emotional arc | Insight → insight → honest gut-punch | Journey → honest summary |
| Best for | Practitioners wanting a framework to apply | Audience that connects through story |
| Weakness | Can feel like a framework talk | Can feel like a company retrospective |
