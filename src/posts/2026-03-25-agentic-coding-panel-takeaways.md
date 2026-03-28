---
layout: post.njk
title: "Agentic Coding: Lessons Learned from a Panel of Engineering Leaders"
date: 2026-03-25
author: "Phil Borel"
excerpt: "What engineers from GitHub, Inngest, Signal Advisors, and RIVET Work actually think about agentic development - the wins, the bottlenecks, and what's still unsolved."
permalink: /blog/{{ page.fileSlug }}/
---

*On March 23rd, Detroit Developers hosted a panel in downtown Detroit with engineers and leaders from four software organizations at different stages of their agentic development journey. This is a write-up of what we talked about.*

---

I had the honor of hosting [Dan Farrelly](https://www.linkedin.com/in/djfarrelly/) (CTO, Inngest), [Kunle Oshiyoye](https://www.linkedin.com/in/kunle-oshiyoye-915b22b1/) (GitHub), [Scott Kirschner](https://www.linkedin.com/in/scott-kirschner/) (RIVET Work), and [Ryan Burr](https://www.linkedin.com/in/ryan-burr2/) (Signal Advisors) at our agentic development panel. The conversation ran for over an hour and felt different from most AI discussions I've participated in - less hype, more honesty about what's actually working & what's not.

Here's what stood out.

---

## AI is a productivity tool, not a replacement - and everyone agrees on this

Every panelist described AI as a significant accelerator for individual output. None described it as a path to replacing engineers. This wasn't hedging - it was an accurate description of where the technology is and what it's actually useful for.

The common thread: AI has dramatically compressed the time it takes to produce a first draft of code. What used to take a few hours of focused work now takes 10–20 minutes for a well-scoped task. But the work after that first draft - understanding whether or not it meets the customer's needs, how it will scale, if it will handle the edge cases - still requires an engineer who knows the system.

The framing I keep coming back to: AI compresses the coding portion of development, which was never most of the job. The thinking, the design, the review, the validation - that's still on you.

---

## Code review is the hardest problem AI has created, not solved

This came up across multiple panelists independently, and it's worth sitting with.

AI makes it trivially easy to generate code. It does not make it easier to validate that code. And teams are discovering that the two aren't symmetric - generating is faster, but reviewing is not proportionally faster, and in some cases it's gotten harder.

Why harder? A few reasons:

**Volume.** When one engineer can open three or four PRs in the time it previously took to open one, the review queue grows faster than the team's capacity to clear it.

**Quality signals are noisier.** AI-generated code tends to look clean. It passes linters, it's syntactically correct, it often includes comments. The bugs hide in the logic - in assumptions the model made that don't match your system, in edge cases it didn't consider, in architectural decisions that technically work but compound your tech debt. These are exactly the bugs that look fine on a skim.

**PRs are getting enormous.** Agentic tools don't just help you write code faster - they encourage you to scope tasks larger. Why open five small PRs when the agent can implement the whole feature in one shot? The result is PRs with thousands of lines of changes that are genuinely difficult to review thoroughly. A reviewer can hold a 200-line PR in their head. A 3,000-line PR with changes across a dozen files is a different cognitive exercise entirely - and most reviewers aren't doing it rigorously.

The practical implication: strong engineering fundamentals and rigorous human review aren't optional in an agentic workflow - they're more important than before. Teams that are skipping review because the code "looks fine" are storing up problems.

---

## Context is the bottleneck - and different teams are solving it differently

This was the most technically interesting part of the conversation, and the one where the panelists had the most divergence in approaches.

Ryan Burr described what Signal Advisors built: an MCP (Model Context Protocol) server that loads PRDs and technical specs as context for agents working across multiple code repositories. The agents retrieve exactly the documentation they need for a given task - product requirements, architectural context, API contracts - without any of it having to live in the repositories themselves.

The insight behind this: agents working across a codebase without domain context are essentially guessing. They can read the code, but they can't read the decisions behind the code - why things are structured the way they are, what constraints were in play, what the product is actually trying to do. An MCP server that serves that context on demand is a meaningful step toward agents that behave like informed collaborators rather than pattern-matching engines.

Dan Farrelly echoed the principle from a different angle: "Context is key for agents and for humans - document your code and architecture." The tooling is different; the underlying problem is the same.

This connects to work I've been doing at RIVET on what I call [PILRs - Persistent Indexed Learning Repositories](/blog/context-engineering-pilrs/) - a pattern for building up indexed knowledge bases that agents can reference selectively, without flooding the context window. Signal Advisors' MCP server is a more sophisticated delivery mechanism for the same core idea: give agents the right knowledge, at the right time, in a format they can use.

---

## Task parallelism is real, but the bottleneck is your brain

The conversation around multi-agent workflows was notably measured. Everyone on the panel had experimented with running multiple agents in parallel. Nobody was doing it at the scale the breathless coverage suggests.

The practical challenge isn't the tooling - it's cognitive load. Managing two or three concurrent agentic workflows requires a fundamentally different way of working than managing one. You're not just doing the same thing faster; you're context-switching between threads that are in different states of completion, each with its own open questions & decisions waiting.

The one framing that resonated in the room: **task parallelism works best when the tasks are different in nature.** Running one agent on research while another builds a prototype, then collating the findings and spinning up a third to write an implementation plan - that's more manageable than trying to run two agents both writing features in the same codebase. Different task types mean less cognitive collision.

The human mind is the bottleneck, not the tooling. That's probably partially addressable with practice & better workflows, but it's where we are today.

---

## Budget approval isn't the obstacle anyone

This surprised some people in the room. Every panelist reported that management is largely green-lighting AI tooling spend. The objections that slowed adoption in 2023–2024 - cost concerns, security questions, "we should wait and see" conservatism - have mostly dissolved.

The new obstacle is making good use of the access you have. Teams that have unlimited runway to experiment with Claude Code, Cursor and GitHub Copilot are discovering that the constraint is now on the engineering side: building the context, the review processes and the harness that makes agents reliably useful. Budget isn't the blocker. Engineering investment is.

---

## Background agents are promising - but you have to earn them

The panel's consensus on autonomous background agents (agents working independently on separate branches, outside the main development loop) was consistent: real potential, not production-ready for most teams, and heavily dependent on work you probably haven't done yet.

Dan described it well: background agents require all of the foundational work - clean architecture, documented context, reliable review processes - to already be in place before they can work reliably. Without that foundation, you get more output, but you can't trust it. And output you can't trust isn't velocity.

This matches what I've observed trying to run multiple Claude Code agents at RIVET. When the harness is solid - when the `CLAUDE.md` is well-written, when patterns are documented, when the architecture is clean & consistent - agents can operate with more *agency*. When those things aren't in place, more agents means more noise to filter, not more throughput.

The j-curve is real. You invest in the foundation before you see the payoff. Teams that try to skip to multi-agent workflows before building the foundation are going to be disappointed.

---

## One line that stayed with me

Attendee [Soham Mhatre](https://www.linkedin.com/feed/update/urn:li:activity:7442166665569759232/) wrote this up in a LinkedIn post after the event:

*"AI speeds up coding, but it doesn't replace thinking."*

Simple. Accurate. Worth keeping close.

---

*We'll be going deeper on the RIVET side of this story - harness engineering, context engineering, spec-driven development - at the [April Detroit Developers meetup](/events/agentic-advanced-practitioners-guide/). If this is territory you're navigating, come find us.*
