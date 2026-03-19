# Detroit Developers Website

The official website for the [Detroit Software Developers](https://www.meetup.com/detroit-software-developers/) meetup group — a community of 750+ developers meeting monthly in Detroit to talk software, startups, and technology.

**Live site:** [detroitdevelopers.com](https://detroitdevelopers.com)

## About

Detroit Developers is a monthly meetup focused on software development, engineering practices and the local tech startup scene. This repository contains the source code for the community website, which lists upcoming events, blog posts and meetup information.

## Tech Stack

- [Eleventy (11ty)](https://www.11ty.dev/) — static site generator
- Nunjucks — templating
- Markdown — content (posts and events)
- CSS — styling

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Install dependencies

```bash
npm install
```

### Development

Start a local dev server with live reload:

```bash
npm run dev
```

The site will be available at `http://localhost:8080`.

### Build

Build the static site to the `_site/` directory:

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## Community

- Meetup: [meetup.com/detroit-software-developers](https://www.meetup.com/detroit-software-developers/)
- Website: [detroitdevelopers.com](https://detroitdevelopers.com)
