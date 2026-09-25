import { describe, expect, it } from "vitest";
import {
  estimateReadingTime,
  getPostsByTag,
  parseFrontmatter,
  parsePostSource,
  posts,
} from "./posts";

describe("frontmatter parsing", () => {
  it("extracts quoted scalars, list values, inline comments, and markdown body", () => {
    const raw = `---
title: "A Tiny Parser"
date: "2026-09-24"
tags: [css, "motion", ux]
accent: coral # kept as metadata only
---

# Hello

Body copy.`;

    const { data, content } = parseFrontmatter(raw);

    expect(data).toEqual({
      title: "A Tiny Parser",
      date: "2026-09-24",
      tags: ["css", "motion", "ux"],
      accent: "coral",
    });
    expect(content).toBe("# Hello\n\nBody copy.");
  });

  it("falls back to the filename slug while preserving the parsed body", () => {
    const post = parsePostSource(
      "../content/my-post.md",
      `---
title: "My Post"
date: "2026-09-24"
tags: [vite]
excerpt: "A sample."
---

Hello world`,
    );

    expect(post.slug).toBe("my-post");
    expect(post.title).toBe("My Post");
    expect(post.tags).toEqual(["vite"]);
    expect(post.body).toBe("Hello world");
  });
});

describe("reading time", () => {
  it("rounds to the nearest 220-word minute with a one-minute floor", () => {
    expect(estimateReadingTime("short post")).toBe(1);
    expect(estimateReadingTime(Array.from({ length: 440 }, () => "word").join(" "))).toBe(2);
  });
});

describe("tag queries", () => {
  it("filters posts by tag case-insensitively", () => {
    const lower = getPostsByTag("css");
    const upper = getPostsByTag("CSS");

    expect(lower.length).toBeGreaterThan(0);
    expect(upper.map((post) => post.slug)).toEqual(lower.map((post) => post.slug));
  });

  it("loads posts newest-first", () => {
    expect(posts.length).toBeGreaterThan(0);
    expect([...posts].sort((a, b) => (a.date < b.date ? 1 : -1)).map((post) => post.slug)).toEqual(
      posts.map((post) => post.slug),
    );
  });
});
