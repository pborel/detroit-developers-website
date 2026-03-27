---
layout: event.njk
title: "Agentic Software Development: Panel Discussion"
date: 2026-03-23
location: "The Madison 2nd Floor, 1555 Broadway St, Detroit"
attendees: 32
meetup_url: "https://www.meetup.com/detroit-developers/events/313590185/"
slides: /slides/agentic-coding-panel/
photos:
  - /assets/images/agentic-software-development-0.jpeg
  - /assets/images/agentic-software-development-1.jpeg
  - /assets/images/agentic-software-development-2.jpeg
permalink: /events/{{ page.fileSlug }}/
---

Panel Discussion featuring Engineers from GitHub, RIVET Work, Signal Advisors & Inngest discussing GenAI applications in software development.

**Panelists:** [Dan Farrelly](https://www.linkedin.com/in/djfarrelly/) (CTO, Inngest) · [Kunle Oshiyoye](https://www.linkedin.com/in/kunle-oshiyoye-915b22b1/) (GitHub) · [Scott Kirschner](https://www.linkedin.com/in/scott-kirschner/) (RIVET Work) · [Ryan Burr](https://www.linkedin.com/in/ryan-burr2/) (Signal Advisors)

## Takeaways

**Most teams are using AI heavily for assistance - not as a replacement.** The consensus across all four organizations: AI is accelerating individual developer output, but engineers are still firmly in the loop. Fully autonomous workflows are early and promising, not production-ready.

**Code review is the hardest unsolved problem.** AI helps write code fast, but validating that code is a different game entirely. Teams are seeing sloppier PRs as a side effect of over-reliance on AI-generated text. Strong engineering fundamentals and manual review remain non-negotiable.

**Context is the bottleneck for agents.** Ryan Burr shared that Signal Advisors built an MCP server so agents can retrieve internal product and technical documentation on demand - giving agents the right domain knowledge without it living in any single repo. Dan Farrelly echoed this: "Context is key for agents (and humans) - document your code and architecture."

**Task parallelism works best across different types of work.** Running one agent on research while another builds a prototype is more manageable than trying to multiplex two agents doing the same kind of task. The main constraint is the human mind, not the tooling.

**Background agents are early but promising - and require everything else first.** Budget approval for AI tooling is largely a non-issue; management is green-lighting spend across the board. But getting background agents to work reliably requires solid context, clean architecture, and good review processes to already be in place.

*"AI speeds up coding, but it doesn't replace thinking."* - [Soham Mhatre, attendee](https://www.linkedin.com/feed/update/urn:li:activity:7442166665569759232/)
