/* -------------------------------------------------------------------------
   posts.ts — the content layer

   Every article lives as a Markdown file in ../content with a small block of
   YAML-ish frontmatter at the top. Vite's import.meta.glob pulls them all in
   at build time as raw strings; we parse the frontmatter with a deliberately
   tiny hand-rolled parser (documented in the "Frontmatter from scratch" post)
   so there are no runtime dependencies just to read a title.
   ------------------------------------------------------------------------- */

export interface Post {
  slug: string;
  title: string;
  date: string; // ISO
  tags: string[];
  excerpt: string;
  accent: string; // css var name, e.g. "coral"
  body: string; // markdown
  readingMinutes: number;
}

const ACCENTS = ["coral", "grape", "mint", "sky", "lemon"] as const;

/** Parse a very small subset of frontmatter delimited by --- fences. */
function parseFrontmatter(raw: string): {
  data: Record<string, string | string[]>;
  content: string;
} {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(raw);
  if (!match) return { data: {}, content: raw.trim() };

  const data: Record<string, string | string[]> = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (!key) continue;

    // list syntax: [a, b, c]
    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }
  return { data, content: raw.slice(match[0].length).trim() };
}

/** Rough reading time: ~220 wpm, code counts a little slower but close enough. */
function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

const modules = import.meta.glob("../content/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw], i) => {
    const { data, content } = parseFrontmatter(raw);
    const slug =
      (data.slug as string) ||
      path.split("/").pop()!.replace(/\.md$/, "");
    return {
      slug,
      title: (data.title as string) || slug,
      date: (data.date as string) || "1970-01-01",
      tags: (data.tags as string[]) || [],
      excerpt: (data.excerpt as string) || "",
      accent: (data.accent as string) || ACCENTS[i % ACCENTS.length],
      body: content,
      readingMinutes: estimateReadingTime(content),
    };
  })
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAdjacent(slug: string): { prev?: Post; next?: Post } {
  const i = posts.findIndex((p) => p.slug === slug);
  if (i === -1) return {};
  // posts are newest-first; "next" = older (further right along the strip)
  return {
    prev: i > 0 ? posts[i - 1] : undefined,
    next: i < posts.length - 1 ? posts[i + 1] : undefined,
  };
}

export interface TagInfo {
  tag: string;
  count: number;
}

export function getAllTags(): TagInfo[] {
  const counts = new Map<string, number>();
  for (const p of posts) {
    for (const t of p.tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getPostsByTag(tag: string): Post[] {
  return posts.filter((p) => p.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()));
}

export function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Deterministic accent class for a tag so colors stay stable across pages. */
export function tagAccent(tag: string): string {
  const accents = ["coral", "mint", "grape", "sky", "lemon"];
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  return accents[h % accents.length];
}
