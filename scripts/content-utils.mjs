import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(scriptsDir, "..");
export const contentDir = path.join(repoRoot, "src", "content");
export const publicDir = path.join(repoRoot, "public");

export const ACCENTS = new Set(["coral", "grape", "mint", "sky", "lemon"]);

export function readContentFiles() {
  return fs
    .readdirSync(contentDir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((file) => ({
      file,
      path: path.join(contentDir, file),
      raw: fs.readFileSync(path.join(contentDir, file), "utf8"),
    }));
}

function stripInlineComment(value) {
  let quote = null;
  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];
    if ((char === '"' || char === "'") && value[i - 1] !== "\\") {
      quote = quote === char ? null : (quote ?? char);
    }
    if (char === "#" && !quote && /\s/.test(value[i - 1] ?? " ")) {
      return value.slice(0, i).trim();
    }
  }
  return value.trim();
}

export function parseFrontmatter(raw) {
  const match = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(raw);
  if (!match) return { data: {}, content: raw.trim() };

  const data = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = stripInlineComment(line.slice(idx + 1).trim());
    if (!key) continue;

    if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      data[key] = value.replace(/^["']|["']$/g, "");
    }
  }

  return { data, content: raw.slice(match[0].length).trim() };
}

export function estimateReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugFromFile(file) {
  return file.replace(/\.md$/, "");
}

export function toPost({ file, raw }) {
  const { data, content } = parseFrontmatter(raw);
  return {
    file,
    slug: typeof data.slug === "string" && data.slug ? data.slug : slugFromFile(file),
    title: typeof data.title === "string" ? data.title : "",
    date: typeof data.date === "string" ? data.date : "",
    tags: Array.isArray(data.tags) ? data.tags : [],
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    accent: typeof data.accent === "string" ? data.accent : "coral",
    body: content,
    readingMinutes: estimateReadingTime(content),
  };
}

export function getPostsFromDisk() {
  return readContentFiles()
    .map(toPost)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function normalizeBasePath(value = "/") {
  const base = value.trim() || "/";
  if (base === "/") return "/";
  return `/${base.replace(/^\/+|\/+$/g, "")}/`;
}

export function makeSiteUrl(pathname, { siteUrl, basePath = "/" }) {
  const origin = (siteUrl || "https://slidedeck.dev").replace(/\/+$/, "");
  const base = normalizeBasePath(basePath);
  const route = pathname === "/" ? "" : pathname.replace(/^\/+/, "");
  const fullPath = `${base}${route}`.replace(/\/+/g, "/");
  return `${origin}${fullPath === "/" ? "/" : fullPath}`;
}

export function allRoutes(posts) {
  const tags = [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
  return [
    { path: "/", lastmod: posts[0]?.date },
    { path: "/posts", lastmod: posts[0]?.date },
    ...posts.map((post) => ({ path: `/posts/${post.slug}`, lastmod: post.date })),
    { path: "/tags", lastmod: posts[0]?.date },
    ...tags.map((tag) => ({ path: `/tags/${encodeURIComponent(tag)}`, lastmod: posts[0]?.date })),
    { path: "/about", lastmod: posts[0]?.date },
  ];
}
