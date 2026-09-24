---
title: "Frontmatter From Scratch (No Dependencies)"
date: "2026-08-21"
tags: [build-tools, markdown, vite, javascript]
accent: grape
excerpt: "This blog's content pipeline is a folder of Markdown files, one 20-line parser, and a single Vite glob import. No CMS, no gray-matter, no runtime cost. Here's the whole thing."
---

Every post you're reading is a `.md` file in `src/content/`. There's no database, no headless CMS, and — deliberately — not even a frontmatter library. The entire content layer is one Vite feature plus a tiny parser. Let's look at all of it.

## Step 1: slurp every Markdown file at build time

Vite's `import.meta.glob` turns a folder into a module map. Ask for the files as raw strings and `eager: true` to inline them straight into the bundle:

```ts
const modules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;
// → { "../content/reading-progress-bar.md": "---\ntitle: ...", ... }
```

Because this happens at build time, there's no network request to read a post and nothing to configure — drop a new `.md` in the folder and it appears on the site.

## Step 2: a frontmatter parser you can read in one sitting

Frontmatter is the `--- ... ---` block at the top of each file. Full YAML is a rabbit hole; we only use strings and simple lists, so we parse *exactly that* and nothing more:

```ts
function parseFrontmatter(raw: string) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(raw);
  if (!match) return { data: {}, content: raw.trim() };

  const data = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();

    // list syntax:  tags: [css, motion, ux]
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value.slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { data, content: raw.slice(match[0].length).trim() };
}
```

The regex `^---\s*\n([\s\S]*?)\n---` captures everything between the two fences (`[\s\S]*?` is the lazy "any character including newlines" idiom, since JS has no dotall-by-default). We split on the first colon only — so a `title:` containing a colon survives — and strip wrapping quotes. That's the whole grammar.

> Is this as robust as `gray-matter`? No. Does it need to be, for content *I* author with a format *I* control? Also no. Knowing when a 20-line function beats a dependency is half of front-end engineering.

## Step 3: assemble typed posts and sort them

Map the raw files into real objects, derive the slug from the filename, and sort newest-first:

```ts
export const posts: Post[] = Object.entries(modules)
  .map(([path, raw], i) => {
    const { data, content } = parseFrontmatter(raw);
    const slug = data.slug || path.split("/").pop().replace(/\.md$/, "");
    return {
      slug,
      title: data.title || slug,
      date: data.date || "1970-01-01",
      tags: data.tags || [],
      excerpt: data.excerpt || "",
      accent: data.accent || ACCENTS[i % ACCENTS.length],
      body: content,
      readingMinutes: estimateReadingTime(content),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));
```

## Step 4: reading time, roughly

No library for this either — average adult reading speed is ~200–250 wpm, so:

```ts
function estimateReadingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
```

It over-counts a little because code blocks read slower than prose, which is honestly the safer direction to be wrong in.

## The tags fall out for free

Because every post already carries a `tags` array, the entire tag system is just grouping over that one field — no separate config:

```ts
export function getAllTags() {
  const counts = new Map();
  for (const p of posts)
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export const getPostsByTag = (tag) =>
  posts.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
```

## Rendering the body

The Markdown itself goes through `react-markdown` with GitHub-flavored Markdown and syntax highlighting — the only two dependencies in the whole pipeline:

```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
>
  {post.body}
</ReactMarkdown>
```

And that's the entire CMS: a folder, a glob, a 20-line parser, and a renderer. It costs nothing at runtime, it's version-controlled with the code, and adding a post is just adding a file.
