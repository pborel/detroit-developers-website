---
layout: talk.njk
title: "AI Is an Amplifier: Harness Engineering for 3x Velocity"
date: 2026-06-23
conference: GOTO Accelerate Chicago 2026
location: Chicago, IL
session_url: https://gotochgo.com/accelerate-chicago-2026/sessions/4046/ai-is-an-amplifier-harness-engineering-for-3x-velocity
ticket_url: https://gotochgo.com/accelerate-chicago-2026/cart
permalink: /talks/{{ page.fileSlug }}/
---

Our CEO set a 3x velocity goal. We went all-in on AI coding agents. Eight months in, here's what actually matters - and it's not the model.

The DORA 2025 data across 5,000 professionals confirms what we learned the hard way: AI amplifies whatever's already in your codebase. Good architecture becomes great. Three divergent patterns become three divergent patterns generated at scale. A Carnegie Mellon study of 807 repos puts numbers on the failure mode: 281% more code in month one, velocity back to baseline by month two, code complexity up 41% - permanently.

This is the story of what we built to avoid that outcome - and what we're still working on.

Code quality as agent infrastructure. We had three backend patterns. The agent reproduced whichever it found first. We consolidated into a strict layered architecture with defense-in-depth permissions enforced at every boundary. The same patterns that make code navigable for new engineers make it navigable for agents.

Context engineering that compounds. AI coding agents work best when they have structured, persistent context about your system - not a single prompt, but an evolving knowledge base the whole team maintains. We built indexed documentation the agent loads on-demand, custom skills that turn multi-step workflows into single commands, and mechanical enforcement that catches violations automatically. Documentation drifts. Lint rules don't.

What's not working yet. Multi-agent parallelization requires a level of maturity we haven't earned. Context debt is real - documenting what lived in engineers' heads takes time we underestimated. And the review bottleneck from increased PR volume is stickier than any tooling fix.

You'll leave with concrete steps you can start Monday: the first files to add to your repo, the first skill to try, and how to identify the refactor that will make your codebase agent-navigable.

### Related Reading

- [Advanced Agentic Coding & The Journey Towards 3x Product Development Velocity](/blog/agentic-coding-advanced-guide/)
- [The Three Layers of Agentic Engineering Maturity](/blog/agentic-coding-maturity/)
