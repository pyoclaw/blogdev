# slidedeck

A playful, motion-first **developer blog whose posts document the blog itself** —
the horizontal page transitions, the springy cards, the reading-progress bar, the
cursor blob, and the from-scratch Markdown pipeline are each explained in an
article, with the real code that runs the site.

## Features

- **Horizontal page transitions** — every route change slides the page sideways
  on a spring, with direction (forward / back) that matches the user's intent.
  Built with Framer Motion's `AnimatePresence` (`mode="popLayout"`).
- **Playful "hard-shadow" theme** — hand-written CSS, custom properties, one
  overshooting easing curve, no utility framework.
- **Post list + individual post pages** — Markdown content with GFM and syntax
  highlighting, reading-time estimates, prev/next navigation, and a scroll-driven
  reading-progress bar.
- **Tags** — an auto-generated tag index and per-tag filtered pages, derived
  entirely from each post's frontmatter.
- **Accessible motion** — everything honors `prefers-reduced-motion`.

## Stack

- React + React Router (`createBrowserRouter`)
- Framer Motion for transitions & scroll reveals
- `react-markdown` + `remark-gfm` + `rehype-highlight`
- Vite + TypeScript
- A ~20-line frontmatter parser and `import.meta.glob` for the content layer

## Content

Posts live in `src/content/*.md`. Each file has a small frontmatter block:

```md
---
title: "Post title"
date: "2026-09-22"
tags: [css, motion, ux]
accent: coral   # coral | grape | mint | sky | lemon
excerpt: "One-line summary shown on cards."
---

Markdown body…
```

Drop a new `.md` file in that folder and it shows up on the site automatically —
newest first.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

## Project layout

```
src/
  components/   NavBar, Footer, Stage (transition), PostCard, Spotlight, Layout
  content/      the Markdown posts (the blog is about this code)
  lib/          posts.ts (content layer), navigation.tsx (slide direction)
  pages/        Home, PostList, PostPage, TagsIndex, TagPage, About, NotFound
  styles/       global.css (the whole playful design system)
```
