import { ACCENTS, getPostsFromDisk, readContentFiles, parseFrontmatter } from "./content-utils.mjs";

const files = readContentFiles();
const posts = getPostsFromDisk();
const errors = [];
const slugToFile = new Map();
const tags = new Set();

for (const { file, raw } of files) {
  const { data } = parseFrontmatter(raw);
  const post = posts.find((item) => item.file === file);

  if (!raw.startsWith("---\n")) {
    errors.push(`${file}: missing frontmatter fence`);
  }

  if (!post?.title) errors.push(`${file}: missing required frontmatter field "title"`);
  if (!post?.date) errors.push(`${file}: missing required frontmatter field "date"`);
  if (post?.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
    errors.push(`${file}: date must be YYYY-MM-DD (got "${post.date}")`);
  }
  if (post?.date && Number.isNaN(Date.parse(`${post.date}T00:00:00Z`))) {
    errors.push(`${file}: date is not parseable (got "${post.date}")`);
  }
  if (!Array.isArray(data.tags)) {
    errors.push(`${file}: tags must use list syntax, e.g. [css, motion]`);
  }
  if (!post?.excerpt) errors.push(`${file}: missing recommended field "excerpt"`);
  if (post?.accent && !ACCENTS.has(post.accent)) {
    errors.push(`${file}: unknown accent "${post.accent}"`);
  }
  if (post?.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug)) {
    errors.push(`${file}: slug must be kebab-case (got "${post.slug}")`);
  }

  if (post) {
    if (slugToFile.has(post.slug)) {
      errors.push(
        `${file}: duplicate slug "${post.slug}" also used by ${slugToFile.get(post.slug)}`,
      );
    }
    slugToFile.set(post.slug, file);
    for (const tag of post.tags) tags.add(tag.toLowerCase());
  }
}

const linkPattern = /\[[^\]]*\]\((\/[^)\s#?]+)(?:[#?][^)]*)?\)/g;
for (const { file, raw } of files) {
  for (const match of raw.matchAll(linkPattern)) {
    const route = match[1].replace(/\/+$/, "") || "/";
    if (route === "/" || route === "/posts" || route === "/tags" || route === "/about") continue;

    if (route.startsWith("/posts/")) {
      const slug = decodeURIComponent(route.slice("/posts/".length));
      if (!slugToFile.has(slug)) errors.push(`${file}: broken internal post link "${route}"`);
      continue;
    }

    if (route.startsWith("/tags/")) {
      const tag = decodeURIComponent(route.slice("/tags/".length)).toLowerCase();
      if (!tags.has(tag)) errors.push(`${file}: broken internal tag link "${route}"`);
      continue;
    }

    errors.push(`${file}: unknown internal link "${route}"`);
  }
}

if (errors.length > 0) {
  console.error("Content validation failed:\n");
  for (const error of errors) console.error(`  • ${error}`);
  process.exit(1);
}

console.log(`Content validation passed for ${posts.length} posts.`);
