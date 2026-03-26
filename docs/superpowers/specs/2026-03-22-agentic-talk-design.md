# Talk Design: Agentic Software Development — Advanced Practitioner's Guide
## Option A: Four Themes as Four Acts
### April 16, 2026 · Detroit Developers · 50 minutes · Slides only

---

**Tone:** Honest, in-progress. Working case study, not a success story.
**Audience:** Software engineers already using Claude Code daily.
**CTA:** Explore skills. Plan codebase and process refactors.
**Structure:** ~32 slides. RIVET woven through as evidence, not as the main narrative.

---

## Intro *(5 min · 4 slides)*

**Slide 1 — Title**
- Agentic Software Development: Advanced Practitioner's Guide
- Phil Borel · RIVET · Detroit Developers

**Slide 2 — Honest Framing**
- "A working case study. Not a success story. Yet."
- Who I am, what RIVET is
- Setup: 3x velocity BHAG landed at All Hands, Q1 2027

**Slide 3 — What Does 3x Even Mean?**
- Three honest answers: Vibes / Metrics / Outcomes
- All three matter. None is sufficient alone.
- The risk: 10x some metrics while seeing modest gains on outcomes

**Slide 4 — The Wrong 20%**
- Writing code was always 20% of the work; testing, refining, validating was always 80%
- AI compresses the 20% dramatically — maybe 10x
- 10x on 20% doesn't get you to 3x overall — you have to accelerate the 80% too
- That's a spec quality problem, a review process problem, an architectural discipline problem
- This talk is about the 80%

---

## Act 1: AI Is an Amplifier *(8 min · 6 slides)*

**Slide 5 — The DORA Headline**
- 5,000 professionals, 100+ hours qualitative research
- "AI is an amplifier" — magnifies strengths of high-performing orgs and dysfunctions of struggling ones
- The numbers: 92% of devs using AI monthly, same tools, but outcomes splitting — 50% fewer incidents OR 2x more. Same tools.
- The question isn't "will AI help us?" It's "what is AI about to amplify at our org?"

**Slide 6 — What It Amplifies**
- Good architecture → great architecture
- Bad architecture → messy, sprawling code generated at scale
- Good specs → accurate, testable implementations
- Vague specs → confidently wrong code that passes tests you didn't write
- Clean, consistent code patterns → idiomatic output on the first try
- Three divergent ways of doing the same thing → agent picks whichever it saw last, tech debt at speed

**Slide 7 — The CMU Cautionary Data**
- 807 open-source repos after Cursor adoption
- 281% increase in lines added, month one. Month two: gains gone, back to baseline.
- Static analysis warnings up ~30%, code complexity up ~41% — permanently
- Complexity increase associated with ~65% drop in future velocity
- "Slop creep" — Boris Tane: individually reasonable decisions, collectively destructive
- The velocity gains were temporary. The tech debt was permanent.

**Slide 8 — Taste x Discipline x Leverage**
- CJ Roth's framework. Multiplicative, not additive.
- Taste: when code generation is free, knowing what's worth generating is the scarce skill
- Discipline: specs before prompts, tests before shipping, reviews before merging — teams skipping this are reporting production disasters
- Leverage: small teams with powerful tools, stacked PRs, agent orchestration, design engineers

**Slide 9 — Amazon and Anthropic's Own Website**
- Amazon retail: spike in outages from AI-assisted changes — mandate for senior sign-off
- Anthropic's flagship website shipped a basic regression affecting every paying customer while generating 80%+ with Claude Code
- "I don't think we're even trading this off to move faster. I think we're moving at a normal pace." — OpenCode CEO
- Not fear-mongering: discipline is the difference between teams that sustain and teams that crash

**Slide 10 — The Implication**
- Best practices matter *more* with AI, not less
- Code quality and organization aren't developer aesthetics — they're the foundation the agent builds on
- The engineer who cuts the most corners will look the most productive in the short term
- This is a cultural risk worth naming explicitly

---

## Act 2: Code Quality Is Harness Quality *(10 min · 6 slides)*

**Slide 11 — The Environment Is the Bottleneck**
- OpenAI harness engineering: team of 3 (later 7), ~1M lines, 1,500 PRs, zero hand-written code
- Their operating principle: when the agent fails, ask "what capability is missing, and how do we make it legible and enforceable?"
- Failures are harness problems, not prompt problems
- The bottleneck is the environment, not the model

**Slide 12 — Refactoring Is AI Infrastructure**
- Not cleanup. Not tech debt paydown. Not nice-to-have.
- The same things that help humans navigate code help agents navigate code
- Strict layer boundaries, predictable file organization, consistent contracts between layers
- When every feature follows the same path through the same layers, the agent can reason about where to put new code without guessing
- At RIVET: treating architectural consolidation as a harness engineering investment

**Slide 13 — RIVET: Backend Layered Architecture**
- Three divergent patterns → one: DB → Model → Repository → Service → Controller → Router
- Each layer has a clear responsibility and a clear contract with adjacent layers
- Defense-in-depth permissions at router, controller, and service levels — agent can't accidentally create an unprotected endpoint
- Maps closely to OpenAI's enforced architecture. Not a coincidence.

**Slide 14 — RIVET: Frontend State Migration**
- Legacy: load full application state upfront, apply incremental updates
- Problem: sluggish initial loads, complex global state — difficult for humans and agents alike
- New: fetch data when and where it's needed, with loading states and caching
- Each component more self-contained. Data dependencies explicit. Blast radius of individual changes smaller.
- Serves two goals: better performance for users, and a codebase Claude can work in without breaking adjacent areas

**Slide 15 — Mechanical Enforcement > Documentation**
- OpenAI: encoded architectural rules as custom linters and structural tests, not prose
- Linter error messages written as remediation instructions — every violation teaches the agent how to fix it
- Rules that feel heavy in a human-first workflow become multipliers with agents — once encoded, they apply everywhere at once
- Documentation drifts. Lint rules don't.

**Slide 16 — The Caveat That Took Us Too Long to Learn**
- The agent follows the examples it sees in your codebase
- If you have a rule that says "use pattern X" but your codebase compliance is sparse, the agent won't use pattern X consistently
- You must refactor existing code to be the example of what future code should be
- Rules without refactoring are aspirations, not enforcement

---

## Act 3: Harness Engineering *(18 min · 9 slides)*

*[Bridge: Act 2 covered the WHY — code quality as AI infrastructure. Act 3 is the HOW — the specific tools and systems that make up the harness.]*

**Slide 17 — From Prompting to Context Engineering**
- Prompting: telling an AI what to do in a single interaction
- Context engineering: building the persistent, structured context that makes an AI agent reliably useful over time across a whole team
- CLAUDE.md is where this starts — but the real harness extends into linters, tests, CI gates, observability, and automated maintenance

**Slide 18 — CLAUDE.md: Map, Not Encyclopedia**
- OpenAI finding: a large instruction file actively degrades agent performance
- When everything is "important," agents fall back to local pattern-matching and miss key constraints
- Solution: ~100 lines max, structured as a map with pointers to deeper sources of truth in a docs/ directory
- Checked into the repo. Reviewed in PRs. Evolved alongside the codebase.
- Team artifact, not personal config

**Slide 19 — PILRs: Context That Accumulates**
- Persistent Indexed Learning Repos — structured knowledge bases the agent can reference
- index.json maps topics → documentation files. Agent loads what it needs, not everything.
- Key difference from CLAUDE.md: PILRs grow organically as the agent works — the agent updates them as it learns
- Goal: move from "generic coding assistant" to "specialist who knows how RIVET's platform is built"
- Addresses the cold-start problem — you don't have to document everything upfront
- [Connection: the support bot agent's "persistent directory of previously solved problems" is a PILR in practice — more on that in two slides]

**Slide 20 — Rules and Hooks**
- Rules: constraints the agent follows automatically — coding standards, naming patterns, file organization, always/never instructions
- Hooks: automated actions triggered by agent behavior — linters after code generation, auto-formatting
- Together: continuous mechanical enforcement that applies everywhere at once, without human attention
- Note: slides 15 and here cover similar ground — the distinction is Act 2 was WHY, this is HOW you actually build it
- At RIVET: rules in progress, hooks on the roadmap

**Slide 21 — Skills: Making Agent Usage Programmable**
- Reusable packaged workflows — complex multi-step processes become a single command
- At RIVET: /review-pr, /implement, /update-project-docs, bug-fix skills, PILR builders, commit history rewriter
- Skills are team assets: versioned, shared, improved over time
- This is where the promises of GenAI for coding start to make real sense

**Slide 22 — The /implement Skill**
- Input: PRD + Tech Spec → Project Plan (engineer reviews before code is written)
- Project Plan → Test Plan: automated tests to write + manual testing steps
- Agent writes code, executes test plan using cURL (endpoints) and Claude Chrome Extension (UI)
- Screenshots → gitignored folder → referenced in pr.md
- This is our version of agent observability — the agent sees and interacts with the running application
- Honest: works ~25% of the time on the screenshot/browser piece. Worth it anyway.
- Note for CTA: this is an advanced skill. Start with /review-pr or /commit, not /implement.

**Slide 23 — The Support Bot Agent**
- Concrete win. Separate repo, accesses codebase + CLAUDE.md + PILR of previously solved problems
- Before: ticket → ~20 min understanding + ~20 min finding the code + fix time
- Now: agent triages, reproduces where possible, proposes fix or surfaces what the engineer needs
- Result: support backlog per two-week shift dropped significantly. Engineer on support duty gets half their time back.
- "Re-purchased half a developer."
- What it didn't solve: novel architectural bugs still require a human — the agent is good at "we've seen this pattern before," not at first-principles debugging of new system interactions
- Why it works: the harness came first. Without CLAUDE.md and documented patterns, the agent would just be guessing.

**Slide 24 — Spec-Driven Development**
- Thoughtworks: "one of the most important practices to emerge in 2025"
- Loop: Specify → Plan → Tasks → Implement
- Expanded "safe delegation window from 10–20 minute tasks to multi-hour feature delivery with consistent quality"
- The harness makes the agent reliable. SDD makes the agent's work product predictable.
- Forces the hard thinking to happen before implementation, not during it
- Claude Code's plan mode is built for this workflow

**Slide 25 — 4-Layer Review**
- Architectural review: human, before code is written
- Automated review: /review-pr skill, SonarCloud, Copilot review, linting, tests — all in CI before human review
- Human code review + manual QA: focused on the new feature, based on test steps in the PR
- Full-app UAT/regression: end of every sprint — working toward replacing with Playwright
- The unsolved problem: without ephemeral environments, reviewers contend for shared test servers — and as PR volume increases from agentic development, that contention gets worse. Ephemeral envs are on the roadmap for exactly this reason.

---

## Act 4: Multi-Agent Reality Check *(7 min · 4 slides)*

**Slide 26 — The Promise**
- One agent orchestrates many. Background agents on separate branches in parallel.
- An engineer effectively manages a fleet of AI collaborators.
- Cursor is doing this on their teams. Ramp. Stripe. Large AI-native companies.
- Orchestration platforms emerging: Coder, others — managing agent infrastructure, provisioning environments, coordinating across a codebase.

**Slide 27 — Where We Actually Are**
- GitHub Copilot cloud agents: yes
- Support bot agent: yes, and it's working
- Running 1–3 local tasks at once: sometimes
- "I've read sensational claims from Ramp and Stripe. We don't have things tuned to that level."
- "I haven't figured out how to multiplex my brain yet."
- Not at multi-agent nirvana.

**Slide 28 — What Actually Happened When I Tried**
- Concrete: describe a specific attempt to run parallel agents — what the setup was, where it fell apart
- The context debt problem: you need rich, structured context in place before parallel agents are useful — we weren't there yet
- The review bottleneck: more agents means even more PRs means even worse review pile-up
- The cognitive load: managing multiple agent threads is a fundamentally different skill, not just more of the same
- It's not that the tools don't work. It's that we hadn't earned the right to use them yet.

**Slide 29 — The Honest Summary**
- We're in the j-curve. The dip before the improvement.
- The things that are working are working because of harness investment
- Multi-agent nirvana requires the full harness to be in place first — we're not done building it
- This is a living experiment, not a solved problem
- Anyone who tells you they've fully solved this is either Cursor or not telling the whole story

---

## Close *(5 min · 3 slides)*

**Slide 30 — Monday Morning**
- Write a CLAUDE.md for one repo: tech stack, architecture in two paragraphs, three things you wish every new engineer knew
- Try one skill — start simple: /review-pr or /commit, not /implement. Get one workflow packaged before you tackle a complex one.
- Identify one refactor that would make your codebase more agent-navigable — and put it on the roadmap
- These don't require a BHAG or an executive mandate

**Slide 31 — Resources**
- Blog post (full detail): detroitdevelopers.com
- DORA AI Capabilities Model (2025)
- OpenAI Harness Engineering (Feb 2026)
- Building an Elite AI Engineering Culture — CJ Roth (Feb 2026)
- The Pragmatic Engineer — AI agents slowing us down? (Mar 2026)
- CMU speed/quality study (2026)
- Superpowers plugin for Claude Code

**Slide 32 — Questions**
- detroitdevelopers.com
- QR code

---

## Timing Summary

| Section | Slides | Time | Min/Slide |
|---|---|---|---|
| Intro | 4 | 5 min | 1.25 |
| Act 1: AI Is an Amplifier | 6 | 8 min | 1.3 |
| Act 2: Code Quality Is Harness Quality | 6 | 10 min | 1.7 |
| Act 3: Harness Engineering | 9 | 18 min | 2.0 |
| Act 4: Multi-Agent Reality Check | 4 | 7 min | 1.75 |
| Close | 3 | 5 min | 1.7 |
| **Total** | **32** | **53 min** | |

*Act 3 is budgeted at 2 min/slide — it is dense and should not be rushed. If time is tight, trim Act 1 (the research section) before trimming Act 3 or Act 4.*
