---
layout: post.njk
title: "Advanced Agentic Coding & The Journey Towards 3x Product Development Velocity"
date: 2026-03-19
author: "Phil Borel"
excerpt: "Advanced practitioner's guide to agentic coding"
permalink: /blog/{{ page.fileSlug }}/
---

*A working case study - what the research says, what we're doing, and what's not working… yet.*

---

At the start of 2026, our CEO stood up at All Hands and announced our company's #1 annual goal: **3x product development velocity by Q1 2027.**

Maybe you've had a version of this moment. A number drops from leadership into Engineering, and the first reaction is somewhere between "are they going to measure that in story points?" and "am I going to get paid 3x?" It's a BHAG - Big Hairy Audacious Goal. More direction-setting than end-state defining. This BHAG certainly lives up to the "audacious" portion of the acronym. And like any good BHAG, it immediately surfaces a harder question than the number itself: *What does 3x even mean?*

This post is a working case study, not a success story (yet). We're in the middle of it. I'm writing this because the research behind our decisions is useful regardless of whether you have a BHAG - and because the things that are harder than expected are probably more useful to you than a polished retrospective.

---

# Why Now

Over the 2025 holiday break, something shifted. Engineers who had been skeptical of AI coding tools - the ones who tried Copilot in 2022, found it didn't meet the bar, and moved on - had time to try the new tools & many were surprised by how far these tools had come.

The models got better. Specifically, they got better at the things that matter for software development: maintaining context across a codebase, following complex instructions, catching their own mistakes, and completing non-trivial multi-file tasks without losing the thread.

Claude Sonnet 4.x, Codex 5.x, etc - these aren't the same models that generated the AI coding skepticism of 2022–2024. And the tooling built around them (Claude Code, Cursor, Windsurf, GitHub Copilot Workspace) has matured to the level required for professional Engineers to integrate them into real workflows without fighting the tools every step of the way.

This is the moment. Not because of hype - but because the reality finally caught up to (some of) the marketing.

---

# A Brief History of Agentic Development

Let's do a quick review of agentic development's history to better understand the context we're operating in today.

**Autocomplete (2021):** GitHub Copilot arrives. Smart tab-completion for boilerplate code. Useful, but not world-changing.

**Chatbot + Copy/Paste (2022–2023):** ChatGPT 3.5 is released in 2022 & quickly goes viral. The workflow is: describe a problem in chat, copy the output, paste into your editor, repeat until it works. I remember discussing ChatGPT's public release with a couple of friends at a Bitcoin meetup I frequented in Detroit around this time. It was a group of marketers who were absolutely convinced that the robots would be doing my job in a couple of months. While I found the conversation amusing, I didn't tell them that this version of ChatGPT actually accelerated many tasks for me - especially debugging. I couldn't let the marketing folks know they were onto something. In some ways they had no idea what they were talking about & in many ways they ended being right.

**Hosted Full-Stack Dev Environments (2023–2024):** v0, Lovable, Bolt, Replit Agents. Input your idea and out pops a scaffolded, full-stack application inside of a hosted environment. Incredible for prototyping. High friction for production code at a company with an existing codebase - and not a great fit for building complex applications over the long haul. I used these tools to help me collaborate with coworkers by creating quick prototypes. I also leveraged them on side projects - again during the prototyping stage.

**IDE Agents (2024):** Cursor and Windsurf bring the agent into your editor with full codebase awareness. This is where things get real for professional software developers. The bot now has context, can edit across multiple files simultaneously, run commands, and see the result of its own changes. GitHub Copilot Workspace follows. A meaningful portion of Engineering teams cross over from "this is neat" to "this is how I work now." I first picked up Windsurf in June 2025. I immediately started using Windsurf as my default editor at my day job & on side projects. I eventually migrate over to Cursor just to try something new, but never forget the ergonomics of Windsurf.

**CLI Agents (2025):** Claude Code, OpenAI Codex CLI. The agent lives in your terminal. It reads your files, runs your tests, executes commands, and iterates. Minimal friction coupled with maximum extensibility. This is where the power users coalesce. Not only is the UX of the CLI great, the models are getting much better. This quickly enables the next step: Harness Engineering.

**Harness Engineering (2025–present):** You stop just *using* the agent and start *engineering for it.* CLAUDE.md files that give the agent project-level context. Knowledge bases are built with index files to maintain that sweet, sweet balance between providing the bot with just enough context & not overflowing the context window. Hooks trigger automated actions - speeding up common workflows. Skills encapsulate reusable capabilities - making the usage of the agent *programmable*. Companies start to focus once again on code quality - refactoring for optimal AI navigation, pattern reuse & extensibility. This is where the promises of GenAI for coding start to make sense.

**Multi-Agent Systems (emerging):** One agent orchestrates many. Background agents working on separate branches (or git trees) in parallel. An Engineer effectively manages a fleet of AI collaborators. Cursor is doing this on their teams. Large AI-native companies are experimenting with it. Orchestration platforms like Coder are emerging to manage agent infrastructure - provisioning environments, managing credentials, and coordinating multiple agents across a codebase. The tools are evolving, the workflows are becoming more firm. I'm struggling to multiplex my brain & am not able to make the leap to "multi-agent nirvana."

Each of these stages still coexists. Most teams operate across several at once - autocompleting boilerplate in one tab, running a CLI agent in another, and planning a harness engineering investment on the whiteboard. The history matters because the lessons from each stage inform the next one. With that context, here's what the research says about making all of this actually work.

---

# What the Research Actually Says

Five pieces of work are worth reading carefully before you commit to any particular AI development strategy.

## DORA AI Capabilities Model (Google, 2025)

Based on 5,000 technology professionals and 100+ hours of qualitative research, the DORA 2025 AI Capabilities Model landed on a headline that sounds simple but has significant implications: **AI is an amplifier.**

Specifically: AI magnifies the strengths of high-performing organizations - and the dysfunctions of struggling ones.

The research identifies seven foundational capabilities that are proven to amplify the positive impact of AI on performance. They span both technical and cultural domains: a clear and communicated AI stance, a healthy data ecosystem, AI-accessible internal data, strong version control practices, working in small batches, a user-centric focus, and quality internal platforms.

One that stands out to me: *working in small batches.* This discipline counteracts a specific risk that AI introduces - generating large, unstable changes that are hard to review and risky to merge. More on this shortly.

The practical implication: if your organization has weak version control practices, unclear ownership, poor internal documentation, or a track record of shipping big-bang changes - AI will make all of that worse, faster. It's not neutral. It amplifies whatever direction you're already moving.

Fresh data from DX (presented by Laura Tacho at The Pragmatic Summit in February 2026) puts numbers on this: 92% of developers now use AI coding assistants at least monthly, with self-reported savings averaging ~4 hours per week. But the outcomes are diverging sharply. Organizations with healthy engineering systems are seeing 50% fewer customer-facing incidents. Dysfunctional organizations are seeing twice as many. As Tacho put it: "AI is an accelerator, it's a multiplier, and it is moving organizations in different directions."

## Building an Elite AI Engineering Culture (CJ Roth, February 2026)

This post synthesizes recent data from across the industry on what separates teams that are thriving with AI from teams that are struggling with it.

Faros AI studied 10,000+ developers across 1,255 teams and found that high-AI-adoption teams completed 21% more tasks and merged 98% more PRs. But PR review time increased 91%. The teams generated more code - and immediately hit a human bottleneck at the review stage. This is a version of Amdahl's Law: a system moves only as fast as its slowest link.

Opsera studied 250,000+ developers and found that senior Engineers realize nearly **five times** the productivity gains of junior Engineers from AI tools. The mechanism is straightforward: deep fundamentals - system design, security patterns, performance tradeoffs - let you evaluate and correct AI output effectively.

Addy Osmani calls this the "knowledge paradox": AI is analogous to having a very eager junior developer on your team - she can write code quickly, but she needs constant supervision and correction. Seniors use AI to accelerate what they already know how to do; juniors try to use it to learn what to do. The results differ dramatically. Without the mental models to evaluate output, less experienced developers end up with what Osmani calls "house of cards code" - it looks complete but collapses under real-world pressure. His observation of a related "70% problem" captures it well: non-engineers and junior developers can get 70% of the way there surprisingly quickly, but the final 30% - the part that makes software production-ready, maintainable, and robust - still requires real engineering knowledge.

Roth proposes a formula: **Taste × Discipline × Leverage.** These are multiplicative, not additive.

*Taste* is knowing what to build, what quality looks like, and when to say no. When code generation is nearly free, knowing what's worth generating becomes the scarce skill. I really dislike the word "taste" to define anything other than the tones my tongue perceives. But it is what the talking heads are converging on so maybe it has value in communicating "gut feeling from experience."

*Discipline* is specs before prompts, tests before shipping, reviews before merging. Teams that skip this step are reporting production disasters - the Cortex 2026 Benchmark found incidents per PR up 23.5% and change failure rates up ~30% on AI-heavy teams without discipline.

*Leverage* is small teams with powerful tools, stacked PRs eliminating review bottlenecks, agent orchestration multiplying individual output, and Design Engineers eliminating handoffs between design and frontend code. I'll note that stacked PRs have always felt like an unstable Jenga tower to me. That said, I have leaned into them more as I've adopted agentic development practices. This feels more like a risk than a solution.

The summary: "AI accelerates high-performing orgs and unravels struggling ones."

## Harness Engineering (OpenAI, February 2026)

OpenAI's report on "harness engineering" is the most detailed public case study of agent-first development at scale. A team of three Engineers (later seven) built and shipped an internal product over five months - roughly a million lines of code across 1,500 pull requests - with zero lines of hand-written code.

3.5 PRs per Engineer per day, with throughput *increasing* as the team grew. This is impressive but not the main takeaway. The main takeaway is what they learned about *why* agents succeed or fail at scale.

**The bottleneck is the environment, not the model.** When agents struggled, the fix was almost never "try harder" or "write a better prompt." The team's operating principle: when the agent fails, ask "what capability is missing, and how do we make it both legible and enforceable for the agent?" Then feed that back into the repository. Failures are harness problems, not prompt problems. Lint rules are high-leverage here.

**AGENTS.md as a table of contents, not an encyclopedia.** One of the first things that broke was a large instruction file. A giant AGENTS.md crowds out the actual task and code in the context window - when everything is "important," agents fall back to local pattern-matching and miss key constraints. Their solution: a short AGENTS.md (~100 lines) that serves as a map, with pointers to deeper sources of truth in a structured `docs/` directory - design documentation, architecture maps, execution plans, quality grades - all versioned and maintained in the repository.

**Mechanical enforcement over documentation.** The team enforced architectural rules with custom linters and structural tests, not just prose. The clever part: linter error messages were written as remediation instructions, so every violation teaches the agent how to fix it. In their words, rules that feel heavy in a human-first workflow become *multipliers* with agents - once encoded, they apply everywhere at once. They enforced a rigid layered architecture (Types → Config → Repo → Service → Runtime → UI) with dependency direction validated at the CI level. Honestly, I do not understand this cascading, layered architecture as well as I'd like, but I do have thoughts on a version of how full-stack SaaS applications should implement layered architecture (more on this later in the post).

**Garbage collection for code quality.** Agents faithfully reproduce whatever patterns exist in the codebase - including bad ones. The team called this "AI slop": suboptimal patterns that proliferate because they're present in the codebase's effective training distribution. Initially, Engineers spent every Friday - 20% of the week - cleaning this up manually. That didn't scale. They built automated "garbage collection": background agents that scan for deviations from golden principles, update quality grades, and open targeted refactoring PRs. Technical debt treated as a high-interest loan, paid down continuously in small increments. My team sacrifices one Engineer per sprint as the "support Engineer" to respond to urgent customer-facing issues. We also charge our Staff Engineers with a separate "Tech Debt" backlog that they sink an untracked quantity of focus into. It's not a perfect system, but it is working for us at the moment.

**Agent observability.** The OpenAI team wired Chrome DevTools Protocol into the agent runtime so agents could take DOM snapshots, capture screenshots, navigate the UI, reproduce bugs, and validate fixes - giving agents the ability to self-verify their work against the running application. I've had mild success doing this & can say it was worth the minutes of effort. I wrote a skill for my team that is called the `/implement` skill. It does many things, but one of those things is writing a _manual_ test plan & then executing it using the browser (shoutout claude chrome extension). It then places the screenshots into a folder for my review & attaching to a PR (this portion works... 25% of the time).

The practical implication for the rest of us: harness engineering is the distinction between *prompting* (telling an AI what to do in a single interaction) and *context engineering* (building the persistent, structured context that makes an AI agent reliably useful over time across a whole team). CLAUDE.md / AGENTS.md files are where this starts - checked into the repository, reviewed in PRs, evolved alongside the codebase - but the real harness extends into linters, tests, CI gates, observability, and automated maintenance & security (shoutout to Vanta).

## The Cautionary Data (Pragmatic Engineer, March 2026)

The research above tells you what to do. This piece tells you what happens when you don't.

Gergely Orosz's reporting in The Pragmatic Engineer synthesizes a growing body of evidence that AI agents - adopted without discipline - are actively degrading software quality and, in some cases, slowing teams down.

The alarming data comes from a Carnegie Mellon study of 807 open-source repositories that adopted Cursor. The findings are sobering: projects saw a roughly 281% increase in lines added during the first month. By month two, velocity gains had disappeared entirely and code activity was back to pre-adoption levels. Meanwhile, static analysis warnings rose ~30% and code complexity increased ~41% - permanently. The researchers found a self-reinforcing negative cycle: accumulated tech debt from AI-generated code significantly reduced future development velocity. Doubling code complexity was associated with a ~65% drop in new lines added going forward.

In other words: the velocity gains were real but temporary. The tech debt was real & permanent. Tech debt eventually ate the velocity gains.

This isn't a theoretical risk. Amazon's retail organization experienced a spike in outages tied to AI-assisted changes, prompting a mandate that junior and mid-level engineers get senior sign-off on AI-generated code changes. Anthropic's own flagship website shipped a bug affecting every paying customer - the kind of basic regression that manual testing would have caught - while generating 80%+ of production code with Claude Code.

Boris Tane, a former Cloudflare Engineer, coined the term "slop creep" for what he's seeing: "the slow, invisible enshittification of a codebase through an accumulation of individually reasonable but collectively destructive decisions, each one too small to flag, too numerous to track, and too deeply buried to unwind by the time you notice." He found that with coding agents, his side project reached crisis point in days rather than months.

The OpenCode CEO warned his own team that AI agents are lowering the bar for what ships, discouraging refactoring, and _not actually improving velocity_: "I don't think we're even trading all this off to move faster. I think we're moving at a normal pace."

Craft Docs founder Balint Orosz offered the framing that ties it together: writing code was always 20% of the work; testing and refining was always 80%. AI compresses the 20% dramatically. The hard part is optimizing the 80% as well.

This is the data that validates everything else in this post. Harness engineering, SDD (and TDD), small-batch PRs, architectural enforcement - these aren't optional add-ons for teams that want to be extra careful. They're what separates the teams that sustain velocity gains from the teams whose gains evaporate in a matter of months.

## Spec-Driven Development

The associated development workflow - Spec-Driven Development (SDD) - has been called "one of the most important practices to emerge in 2025" by Thoughtworks. The basic loop is: Specify → Plan → Tasks → Implement. Thoughtworks reports it expanded the "safe delegation window from 10–20 minute tasks to multi-hour feature delivery with consistent quality." This is the workflow layer that sits on top of harness engineering - the harness makes the agent reliable, SDD makes the agent's work product predictable. This is what my `/implement` skill is all about - taking a product spec, transforming it into an engineering execution plan, building tests ahead of time & then executing it. Note: I've found this only works for changes of a certain size. Once the change set is large/complex enough, I have to split it into multiple execution plans. It's hard for me to quantity this size/scale difference, so I'll just call it "taste."

---

# The Hard Parts

This is where the hype usually stops and the real work begins.

## What Does 3x Actually Mean?

There are three honest answers to this question, and they're all partially right.

**Vibes:** Execs feel like we shipped 3x the value. This sounds hand-wavy, but it's not. Executives are human. If they feel good about velocity, quality and outcomes - that's a real signal. They won't feel good about it if it isn't real. Sustained vibes require sustained substance.

**Metrics:** We prove it with DORA numbers, PR throughput, features shipped & points delivered. The honest risk here: we'll probably 10x some metrics (generated code?) while seeing more modest gains on others (outcome-level impact on users). We need to be careful what we're measuring.

**Outcomes:** Users get more value more quickly. This is the hardest metric to measure & the most important. It's also where much of the common misconception around agentic coding lives: **3x code speed ≠ 3x outcomes.** Salespeople speaking at 3x speed do not close 3x revenue. They need to be saying the right things in the right conversations with a legitimate prospect. Calls made, demos booked - leading indicators that help project outcomes but they aren't the outcomes themselves. PRs merged is a great leading indicator, but building the wrong things doesn't produce happy customers.

There's a useful framing from Craft Docs founder Balint Orosz: writing code was always 20% of the work; testing, refining, and validating was always 80%. AI compresses the 20% dramatically - maybe 10x. But 10x on 20% of the work doesn't get you to 3x on the whole. You have to accelerate the 80% too, and that's a fundamentally different problem than code generation. It's a spec quality problem, a review process problem, and an architectural discipline problem. That's where most of our investment is going.

Our actual answer: all three matter. We're going to track whatever is helpful in achieving our goals. And we need to be honest with ourselves when a metric is moving in the wrong direction rather than explaining it away.

## Pressure Shifts Downstream

Engineering accelerating is great - but it doesn't happen in isolation. When Engineers execute faster, the bottlenecks move.

**Product and Design become rate-limiters.** If engineering can implement a spec in a day, the quality of that spec matters more, not less. Vague requirements don't produce better outcomes faster - they produce the wrong things at speed. Good thing these models are great at generating English, too!

**PR review becomes a traffic jam.** Per the Faros AI data (cited in Roth's post above - their study of 10,000+ developers across 1,255 teams): 98% more PRs merged, 91% more review time. If we don't address review tooling and PR size, we'll create a pile-up.

**PR size is a real policy question.** Agentic coding makes it easy to produce work in large batches. Large PRs are slow to review & high risk to merge (the are _area of impact_ is large). The DORA research identifies working in small batches as one of seven foundational capabilities for AI-amplified performance. The Carnegie Mellon study quantifies the cost of ignoring this: the code complexity generated by large AI-assisted changes was associated with a ~65% drop in future development velocity. Working in small batches is not just a nice habit - it's a prerequisite for getting the benefits of AI-accelerated development without the destabilization.

## AI Is an Amplifier of More Than Output

This is the thread that connects the DORA research, the Roth framework, and our own experience. AI amplifies whatever's already there:

- Good architecture → great architecture
- Bad architecture → messy, sprawling code generated at scale
- Good specs → accurate, testable implementations
- Vague specs → confidently wrong code that passes tests you didn't write
- Clean, consistent code patterns → an agent that produces idiomatic code on the first try
- Three divergent ways of doing the same thing → an agent that picks whichever pattern it saw last & increases tech debt along the way

This means best practices matter *more* with AI, not less. Code quality and organization aren't just developer aesthetics - they're the foundation the agent builds upon. OpenAI calls this "AI slop": agents faithfully reproduce whatever patterns exist in the codebase, including the suboptimal ones, and those patterns proliferate at agent-speed. We're seeing this firsthand - which is why one of our biggest harness engineering investments is consolidating our backend and frontend architectures into clean, consistent patterns the agent can reliably build on (more on this in the harness engineering section below). This isn't cleanup for cleanup's sake. It's infrastructure for agentic development - and it's a prerequisite for the kind of reliability the OpenAI team achieved only after investing heavily in architectural enforcement.

The engineer who cuts the most corners will look the most "productive" in the short term. This is a cultural risk worth naming explicitly, and addressing with policies and norms rather than hoping people figure it out themselves. Boris Tane calls this phenomenon "slop creep" - individually reasonable decisions that are collectively destructive, each one too small to flag but too numerous to track. The Carnegie Mellon data backs this up: the velocity gains from undisciplined AI adoption disappeared within two months, while the accumulated tech debt permanently reduced future development speed.

At RIVET we're tracking PRs / week as a metric for increased velocity. We're also recognizing that this isn't the full story. As a result, we are also tracking quality metrics such as "defect rate." It's not the final iteration, but where we're at _today_.

## Not Everything Needs the Full Harness

Everything above is true - for production systems at scale. But not everything is a production system, and knowing the difference is itself a form of engineering judgment.

The 70% problem is real when you're building software that needs to handle edge cases, survive production traffic, and be maintained by a team over years. But there's a large category of work where 70% is 100% of what you need. Prototypes. Internal tools. Simple sites. Things that don't require scale, infinite maintainability or that you're going to throw away. Osmani nails this distinction: AI tools are exceptional as "prototyping accelerators" and "MVP generators for validating ideas quickly." The problem only arises when people mistake the prototype for the product.

At RIVET, we've built several working prototypes with Claude Code where we didn't review the underlying code. The point isn't production quality. These prototypes help us validate an idea & collaborate with with something tangible.

One example: I built an async messaging prototype to help my team have a concrete discussion about formatting & UX for different email styles in our product. Instead of debating layouts in a Notion doc with screenshots, I spun up a working prototype that allowed the team to actually see & interact with the different approaches. It focused the conversation, surfaced disagreements early and gave us a shared artifact to react to - all in a fraction of the time a spec'd-out implementation would have taken. I literally used a cloud agent to build it on my way to work via the Claude app on my phone. Fired off a couple of messages with Figma screenshots before my commute, iterated a bit after parking, and had something to share once I reached the office.

I also built [detroitdevelopers.com](https://detroitdevelopers.com) - the blog site for a professional developer meetup where I'm posting this very article - using Claude Code and the [Superpowers](https://github.com/obra/superpowers) plugin. I essentially one-shot the initial site, then iterated on a few features and bug fixes over time. I barely understand the underlying code. And that's fine. It's not a large-scale or complicated system. It doesn't need defense-in-depth authorization or a clean layered architecture. It needs to display blog posts and event information, and it does that well. The repo is [open source](https://github.com/philwindle/detroitdevelopers) if you want to see what "good enough for this use case" looks like.

The discipline this post advocates for isn't "apply maximum rigor to everything." It's "match rigor to stakes." A prototype that helps your PM validate an idea before you write a spec? Let the agent rip & skip the code review. A feature that will handle customer payments in production? Spec-Driven Development, small-batch PRs, layered review. It's about knowing when discipline is required & when it's overhead.

---

# What RIVET Is Doing

Here's the concrete picture of our current investments & near-term plans, organized into two buckets: the process changes that create the conditions for AI-accelerated development, and the harness engineering work that makes the agent itself more capable.

## 1. Process Changes

### Leadership with Actual Skin in the Game

The lesson here isn't "get exec buy-in" - that's generic advice. The specific lesson is that AI adoption that happens by decree dies; adoption that happens because leaders are doing it alongside their teams sticks.

At RIVET, leadership isn't just sponsoring this initiative - they're coding in it. Founders and product leadership jumped back into codebases. This matters because it generates real institutional knowledge rather than secondhand enthusiasm, and it signals to skeptical Engineers that this isn't a cost-cutting exercise dressed up as a productivity initiative.

The pattern worth stealing: when rolling out AI tooling, the most useful thing leadership can do is use it publicly and share what's hard about it - not just the wins.

Note: At RIVET, we're privileged to have founders with backgrounds in engineering. One of our founders (Louis Gelinas), wrote the initial React/Express/Node/TypeScript application that became RIVET. If your founding team isn't able to jump into the code don't sweat it - you can get your Product & Engineering leadership in there. The point is that leadership is living the experience too, not just monitoring it based off of dashboards showing PRs / week & tokens used / contributor.

### Everyone is using Claude Code

Goal: every Engineer at RIVET has Claude Code as a primary tool. We're testing multiple setups - VS Code extension, CLI, Cursor, GitHub cloud-based agents - and converging toward what I call the "holy harness": Claude Code CLI or the Claude Code IDE extension, configured with project-specific context.

Policy: **open door experimentation.** More skills, more CLAUDE.md files, more prototypes, more experiments with agent architectures - all of this is encouraged. We want a high-volume learning environment, not a slow-roll adoption process.

Caveat: this will slow down development velocity & likely decrease quality in the short-term. No one at RIVET (or in the known universe) has lived through an agentic coding revolution before. At RIVET we often talk about "j-curves" - the thing you measure dips before it starts to improve. We made a concious trade-off understanding that focusing Developer, Designer & PM time on building processes & systems to support agentic coding will distract them from their "normal work" - albeit for the near-term. I think about this like an investment in the future - we are investing RIVET's funds in our team's learning & building the systems that will help us produce better outcomes in the future.

### Designers and PMs Vibe Coding Prototypes

We're deliberately blurring the line between design, product, and engineering. Designers and Product Managers are building working prototypes with Claude Code - not to ship production code, but to validate ideas faster, build shared understanding with engineering, and reduce the "translation loss" in every handoff.

This mirrors what the best companies in the industry are doing. Linear has no "handoff to dev." Vercel has Design Engineers who sketch and ship alone. Stripe has Engineers participate in user interviews & design decisions. The traditional separation is becoming a competitive disadvantage.

One honest challenge: we've had difficulty making it easy for Designers and PMs to set up their local dev environments & deploy prototypes to hosted environments for collaboration. This is directly tied to our environment strategy work below.

### AI Coding Guidelines

We're building an internal guide - "Agentic Development @ RIVET" - that covers:

- When to use AI vs. write by hand
- How to write a good spec
- PR complexity policy (one PR per independently deployable unit of value)
- Tiered rigor: prototypes vs. production-critical code deserve different levels of review
- How to write an effective CLAUDE.md

The goal is to make the right habits the default habits - not rely on individual judgment calls under time pressure.

### Metrics

We're tracking this across three dimensions:

**Quality:** test coverage percentage, Change Failure Rate, Mean Time to Recovery

**Speed:** Deployment Frequency, Change Lead Time

**Output:** PR throughput (PRs shipped per week & # of business days PRs are in "Review" status), story points, features shipped

We're not tracking full DORA metrics yet. Right now, our leading indicators are PRs per week, projects per quarter, points per sprint, test coverage and Change Failure Rate. We also track support ticket count - we're closing them significantly faster now, which shows up as a lower backlog maintained per two-week support shift. These aren't optimal measures, but they're a starting place. We used the DORA AI Report's cluster analysis to help identify where to start improving our systems to get the most out of agentic coding, and we plan to move toward proper DORA metrics over time.

Honest expectation: some metrics will move fast, some will take longer, some may not move at all, and some may initially get worse as we adjust to new workflows. We're watching for regressions as carefully as we're watching for gains. AI shouldn't slow us down anywhere - if it does, that's a signal to fix the workflow, not abandon the tool.

### Community & Learning

Technical investment only goes so far without cultural investment alongside it.

We're running a weekly **AI Roundtable** meeting - a time to share what's new, what's cool, what's working, what failed. And a **Lunch & Learn** series focused on watching conference talks together & discussing them over food.

The goal is a continuous learning culture around AI development, not a one-time rollout. The tools are changing fast enough that this needs to be a living practice, not a training event.

## 2. Platform Engineering

### The Push for Playwright Tests

We're investing in end-to-end test coverage with Playwright. We've tried this before but it never took root. Now, more than ever, it is important to have through, high-quality tests. When the agent can generate & run tests as part of its workflow, automated E2E coverage becomes both more achievable and more valuable. It's a key piece of making the agent self-verifying, and it's what will eventually let us replace full-app manual regression testing on every release.

We're early here. But it's a priority, not a nice-to-have. E2E tests ~~accelerates~~ unlocks codebase-wide architectural refactors - without the automated tests, we'd have to manual test everything to a level of specificity we just won't be able to guarantee in a reasonable amount of time.

### Codebase Architecture: Making Code Agent-Navigable

Context engineering isn't just documentation - the code itself is context. If the codebase has three different ways of doing the same thing, the agent will pick whichever pattern it encounters first, and you'll spend your review time catching inconsistencies instead of evaluating business logic. This is why we're treating architectural consolidation as a harness engineering investment, not a cleanup project.

**Backend: Clean Layered Architecture.** We're consolidating three divergent patterns into a single, consistent layered architecture: Database → Model → Repository → Service → Controller → Router. Each layer has a clear responsibility and a clear contract with the layers adjacent to it. The repository layer abstracts data access. The service layer contains business logic. The controller layer handles request/response orchestration. The router layer defines endpoints and groups them.

Permissions follow a defense-in-depth pattern across three levels: at the router level (authorizing access to a group of endpoints), at the controller level (authorizing a specific endpoint), and at the service level (authorizing a specific action & scoping all actions to a particular tenant based on the user generating the request). This layered authorization means the agent can't accidentally create an unprotected endpoint - the pattern enforces security at every boundary.

If this architecture sounds familiar, it should. It maps remarkably closely to the layered architecture OpenAI enforced in their harness engineering experiment (Types → Config → Repo → Service → Runtime → UI). That's not a coincidence - it turns out the same architectural patterns that make code navigable for new Engineers make it navigable for agents. Strict layer boundaries, predictable file organization, and consistent contracts between layers give the agent a reliable "mental"S model of the system. When every feature follows the same path through the same layers, the agent can reason about where to put new code without guessing & code review becomes simpler, too.

**Frontend: From Batch-Load to Performant Data Fetching.** On the frontend, we're migrating away from a legacy pattern that loaded the full application state upfront and then applied smaller incremental updates - a pattern that made sense when the application was smaller but now creates sluggish initial loads & complex state management. We're moving toward a more performant approach: fetching data when it's needed, where it's needed, with proper loading states and caching.

This isn't just a performance play. The legacy pattern was difficult for humans to reason about - and it's the same for agents. When state management requires understanding a global loading sequence and a web of incremental update paths, the agent has to hold an enormous amount of implicit context to make safe changes. The new pattern is modular & local: each component is more self-contained, data dependencies are explicit, and the blast radius of any individual change is smaller. That makes it dramatically easier for the agent to work in one area of the frontend without inadvertently breaking another.

Both of these refactors serve dual goals: a more responsive application for our users, and a codebase that gives Claude Code a solid, consistent foundation to build on. The first goal would justify the work on its own. The second makes it urgent.

### Environment Strategy

We're investing in two related problems: making it trivially easy for non-engineers to set up local dev environments, and standing up ephemeral environments for every PR.

On the local dev side, a significant blocker to Designers and PMs vibe coding is the friction of environment setup. If it takes half a day and three Teams (yeah - MS Teams...) threads to get a local environment running, the "just prototype it" promise falls apart. We're streamlining this so that anyone with access to the repo can be running the app locally in minutes.

On the infrastructure side, we're moving toward ephemeral environments - one per PR is the goal. This removes a major coordination cost. Today, PRs contend for a limited set of shared test servers. With ephemeral environments, every PR can be reviewed, tested, and demo'd independently. This is especially important as PR volume increases - and it's a prerequisite for getting meaningful feedback from PMs, Designers, and customers before code hits the release branch.

## 3. Harness Engineering

If the process changes create the conditions, harness engineering is the actual multiplier. This is where platform & infrastructure work produces leverage for every Engineer on the team - because you're not just improving human workflows, you're improving what the agent can do.

### Context Engineering: CLAUDE.md & Persistent Indexed Learning Repositories (PILRs)

**CLAUDE.md**: Every RIVET repository is getting a CLAUDE.md file - a structured project-level context document that gives Claude Code reliable direction on tech stack, an index to other files containing in-depth architecture literature, naming conventions, and some lite do's & don'ts. These are team artifacts - reviewed in PRs, evolved alongside the codebase, treated as seriously as any other infrastructure configuration.

**Persistent Indexed Learning Repositories (PILRs):** Following the OpenAI team's finding that a large instruction file actively degrades agent performance, we're treating CLAUDE.md as a map - not an encyclopedia. The real depth lives in knowledge bases and knowledge indices: structured documentation that agents can reference when working in the disparate domains of our system. The goal is to move Claude from "generic coding assistant" to "specialist who knows how RIVET's platform is built," without bloating the context window with information irrelevant to the current task.

We've setup a couple of Claude Skills to help us build out these "Learning Repositories." The idea is that we have an index file (read "json file") that categorizes types of knowledge & systems in a central location. This index file then references additional material (markdown files) in "Learning Repositories" (directories full of information on a specific system). This allows the Engineer to guide the agent to the right information for working with a specific sub-system. During the course of the work, the agent will learn more about the system - or even change the system. This results in an update to documentation.

### Rules and Hooks

Rules, and eventually hooks, are how you move from "the agent sometimes does what I want" to "the agent consistently follows our process." They're the mechanical enforcement layer of the harness.

**Rules** are constraints and conventions that the agent follows automatically - coding standards, naming patterns, file organization, things the agent should always or never do. These live alongside the CLAUDE.md and evolve with the codebase. Note: these are loaded into context by the agent at session start. Rules are a "human-level" abstraction. The agent reads all of the rules & mashes the stuff together into a big context window. Frontmatter can help negate this, but PILRs are the real way to get the information to the agent without bloating its context window.

This is where the OpenAI harness engineering findings hit closest to home. Their key insight: if an architectural constraint matters enough to document, it matters enough to enforce mechanically. Documentation that isn't enforced will drift - especially when agents are generating code at high volume. We're moving in this direction, encoding our conventions as rules rather than relying on engineers to remember and the agent to infer. The aspiration is what OpenAI demonstrated: linter error messages that double as remediation instructions, so every violation guides the agent towards a solution.

**Hooks** trigger automated actions based on agent behavior - for example, running linters after code generation, or auto-formatting files. We haven't fully leveraged hooks yet, but they're on the roadmap as the next layer of automation. Combined with rules, hooks are how you build the kind of continuous mechanical enforcement that the OpenAI team credits as a key multiplier - constraints that apply everywhere at once, without human attention.

**Caveat:** The agent follows the examples it sees in your codebase. If you have a Rule that instructs the agent to use a specific pattern but your code base compliance to that pattern is sparse, the agent won't use the pattern consistently. You must refactor your existing code to be the example of what your future code should be.

### Skills

Skills are reusable capabilities you give the agent - packaged workflows that can turn complex, multi-step workflows into a single command. At RIVET we are prolific skill builders. We have skills for reviewing code, building PILRs, fixing specific types of bugs, implementing fullstack features, rewriting the commit history on a branch for human-readability, and many more usecases. One of my favorites is the **`/implement` skill**, which builds a small feature using a Spec-Driven Development workflow, saves information about the specific implementation plan in an ephemeral (gitignored) directory, creates a **test plan**, writes the code for the feature & then runs automated & manual tests. It _sometimes_ also successfully takes screenshots of the UI during testing & references those screenshots in the PR. Here's how it works:

We already have PRDs (written by PMs) and Tech Specs (written by Engineers) for any non-trivial feature work. The `/implement` skill utilizes these & creates a **Project Plan** - a breakdown of the work to be done based on the current codebase and the desired outcome laid out in the PRD & Tech Spec. Engineers review the **project plan** before moving on. The **project plan** includes a step-by-step breakdown that maps directly to the commits for the PR.

Engineers are expected to break work down to PR-sized chunks. Giving the agent work that's too complex results in poor outcomes and slows everything down. The `/implement` skill is not a silver bullet for one-shotting entire system re-writes. That said, I frequently start with a feature that is too large for the `/implement` skill, hit a wall & then break the work down into smaller chunks for the agent to work on.

A **Test Plan** augments the **project plan**. Also written by the agent, it details both the new automated tests to be written and the manual testing steps. After the agent writes the code, it leverages the **test plan** to perform manual testing - using cURL for endpoints & the Claude Chrome Extension for UI testing. The agent takes screenshots and adds them to a gitignored folder to help build the PR. This is our version of what the OpenAI team calls agent observability - giving the agent the ability to see and interact with the running application, not just the code. OpenAI wired Chrome DevTools Protocol into their agent runtime for the same reason: any validation that requires a human to inspect the running application is a bottleneck.

Finally, the `/implement` skill writes a `pr.md`, fills it out based on a template, and references the screenshots for the Engineer to use when opening the PR.

Claude Code's plan mode is built for this workflow. SDD dramatically improves output quality, but more importantly, it forces the hard thinking to happen before implementation rather than during it.

_Note: I find myself updating the **project plan**, test plan & pr.md frequently while working on a specific PR. To help with this, we also have a `/update-project-docs` skill!_

### The Support Bot Agent

One of our most concrete wins so far is the **support bot agent** - a separate repo that we use across our repositories for solving support issues: customer-reported bugs, CS-escalated problems, and production issues that come in through our ticketing system.

The problem it solves is straightforward. Support tickets are a constant stream of small, context-heavy tasks. An Engineer picks up a ticket, spends twenty minutes understanding the bug report, another twenty finding the relevant code, and then some amount of time actually fixing it. The understanding & finding phases are where most of the time goes - and they're exactly the kind of work an agent with good context can compress dramatically.

The support bot agent has access to our codebase, our CLAUDE.md context, and the patterns we've documented for common issue categories. When a support ticket comes in, the agent can triage it - identify the likely affected area of the codebase, pull up relevant context, reproduce the issue where possible, and either propose a fix or surface the information an Engineer needs to fix it quickly.

The real unlock is a PILRs - we have a persistent directory in the support bot repo of previously solved problems with an index file that the agent can reference. This allows the agent to quickly identify patterns and solutions that have worked in the past, and apply them to new problems. It also allows us to build a knowledge base of common issues and solutions that can be used to train new agents.

The result: our support ticket throughput has measurably improved. We run two-week support shifts, and the backlog maintained per shift has dropped significantly. Engineers on support duty spend less time on the investigation phase and more time on the judgment calls that actually require a human - is this the right fix? Does this need a deeper architectural change? We've "re-purchased" half a developer because the Support Engineer gets half of their time back to work on feature development or lower priority bugs that wouldn't have been fixed until we did an "all hands on deck bug bash" (which happens about twice a year for 1 sprint).

This is also a good example of the "amplifier" dynamic in practice. The support bot works well *because* we invested in the context layer first. Without good CLAUDE.md files and documented patterns, the agent would just be guessing. With them, it's operating with genuine knowledge of our system.

### Automated Code Review

Our review process has four layers:

**Architectural review** (human, before code is written). More complex systems go through a written tech spec process; less complex features get by with a lighter-weight conversation and bullet-point list of key architectural decisions.

**Automated review** (CI, during PR). `/review-pr` skill, SonarCloud analysis, GitHub Copilot code review, linting, and our test suite - all running through GitHub Actions. We get these checks to pass before asking a human for review.

**Human code review & manual QA** (during PR). Focused on the new feature, based on the test steps in the PR. One challenge: without ephemeral deploys, reviewers are contending for shared test servers. With AI, we can get through code and prototype features so quickly that we need an environment per PR. Sometimes you want feedback from people working in different functions (Product, CS, Marketing, Sales) - or from customers - before releasing.

**Full application UAT/regression testing** (on the release branch). At the end of every sprint, all Engineers, Designers & PMs run through a half-day UAT marathon on the release branch. We log bugs, prioritize them & fix them in the first week of the next sprint. The quantity of bugs we're finding during this process is reducing every sprint - a testament to the effectiveness of the first three layers of review. We're working toward replacing this with automated Playwright tests.

---

# What's Not Working… Yet

## The context debt problem

Writing good CLAUDE.md files and knowledge bases takes real time. There's a bootstrapping cost - you have to document things that lived only in Engineers' heads, in a format useful to an agent, while also shipping product. We underestimated this significantly.

Our emerging solution: **Persistent Indexed Learning Repos (PILRs)**. These are files that the agent updates as it develops a deeper understanding of the system - indexed via something like an `index.json` that maps topics to specific documentation files. The idea is to balance context window efficiency (the agent doesn't need to load everything) with maximum access to the most relevant information when it's needed most. Instead of requiring Engineers to write all the context documentation upfront, PILRs let the context accumulate organically as the agent works in the codebase.

This is the same architecture OpenAI converged on independently. They found that a single large instruction file actively degrades agent performance - it crowds out the task-relevant context. Their solution was a short AGENTS.md (~100 lines) that points to deeper sources of truth in a structured directory, with background agents scanning for stale documentation and opening cleanup PRs. PILRs are our version of this pattern, with the added benefit that the agent itself builds the knowledge base over time rather than requiring Engineers to write it all upfront. It's still early, but it's the most promising approach we've found to the cold-start problem.

## The review bottleneck is stickier than expected

The Faros data predicted this. We still underestimated the cultural friction around smaller PRs.

Part of the issue is that agentic development makes it much easier - and more emotionally rewarding - to create large PRs. You feel like you're getting a lot done. The agent just built an entire feature end-to-end. The overhead of breaking up the PRs feels like it's not worth it.

But there's also a deeper cultural issue: Engineers who are used to shipping large, self-contained chunks of work often don't yet see the value of single-unit work streams. The argument is straightforward once you've experienced it - decreased friction means greater unit velocity, easier-to-review and easier-to-test PRs mean better quality, and smaller blast radius means fewer side effects - but it's a habits change, not a tooling change. It takes longer than updating the Claude CLI when a new model drops.

## We don't have clean attribution data yet

We're tracking PRs per week, projects per quarter, points per sprint, and support ticket throughput... but not all in perfect ways. We're working on getting better at this & seeing a lot of improvement, but it's not there yet. We're planning to move toward proper DORA metrics to get a clearer picture of what's working and what's not.

## Multi-agent Parallelization

We have some of this going on using GitHub Copilot, the Support Bot Agent and running 1-3  tasks locally at any given time. I’ve read some pretty sensational claims from companies like Ramp & Stripe. We don’t have things tuned to the level that these companies purport & I haven’t figured out how to multiplex my brain, yet. We’re not operating in the “multi-agent nirvana” future.

---

# What You Can Do This Week

If you're reading this and wondering where to start, here's a practical first week:

**Read the docs.** Start with the [Claude Code documentation](https://docs.anthropic.com/en/docs/claude-code). Understand what's possible before you start building on top of it.

**Write a CLAUDE.md** for one of your repositories. Start with your tech stack, your architecture in two paragraphs, and three things you wish every new Engineer knew before touching the codebase. It will force you to articulate things that have never been written down. That discipline pays off whether or not the AI ever reads it - and it's the first step from individual AI productivity to team AI productivity.

**Start experimenting with rules and skills.** Once the CLAUDE.md is in place, try adding a rule or two - coding conventions, file organization patterns, things the agent should always or never do. Then try writing a simple skill for a workflow you repeat regularly.

**Download and use the Claude Chrome Extension.** Use the agent to see & interact with your running application. It's a meaningful step up from terminal-only interaction. It's what makes the self-testing workflow in our `/implement` skill possible.

**Try the [Superpowers plugin](https://github.com/obra/superpowers).** This Claude Code plugin gives the agent the ability to read and interact with web pages, take screenshots, and validate its own work in the browser. I used it to build [detroitdevelopers.com](https://detroitdevelopers.com) - the site hosting this very post - largely in a single session. It's a force multiplier for anything with a visual component.

None of this requires a BHAG or an executive mandate. It requires a week of focused experimentation - and the willingness to be bad at something new before you get good at it.

---

*Phil works at [RIVET](https://rivet.work/), building software to ensure the right people are on the right job at the right time. This post reflects lessons from an experiment still in progress.*

*References: [DORA AI Capabilities Model (2025)](https://services.google.com/fh/files/misc/2025_dora_ai_capabilities_model.pdf) · [Building an Elite AI Engineering Culture (CJ Roth, Feb 2026)](https://www.cjroth.com/blog/2026-02-18-building-an-elite-engineering-culture) · [Harness Engineering (OpenAI, Feb 2026)](https://openai.com/index/harness-engineering/) · [Spec-Driven Development (Thoughtworks)](https://www.thoughtworks.com/radar/techniques/spec-driven-development) · [Are AI Agents Actually Slowing Us Down? (Pragmatic Engineer, Mar 2026)](https://newsletter.pragmaticengineer.com/p/are-ai-agents-actually-slowing-us) · [Speed at the Cost of Quality (Carnegie Mellon, 2026)](https://arxiv.org/abs/2511.04427) · [The 70% Problem (Addy Osmani, Dec 2024)](https://addyo.substack.com/p/the-70-problem-hard-truths-about) · [The Future of Software Engineering with AI (Pragmatic Engineer, Feb 2026)](https://newsletter.pragmaticengineer.com/p/the-future-of-software-engineering-with-ai)*
