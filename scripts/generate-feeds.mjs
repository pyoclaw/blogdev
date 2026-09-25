import fs from "node:fs";
import path from "node:path";
import {
  allRoutes,
  escapeXml,
  getPostsFromDisk,
  makeSiteUrl,
  normalizeBasePath,
  publicDir,
} from "./content-utils.mjs";

const siteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || "https://slidedeck.dev";
const basePath = normalizeBasePath(process.env.VITE_BASE_PATH || process.env.BASE_PATH || "/");
const posts = getPostsFromDisk();
const latestDate = posts[0]?.date || new Date().toISOString().slice(0, 10);

fs.mkdirSync(publicDir, { recursive: true });

function url(pathname) {
  return makeSiteUrl(pathname, { siteUrl, basePath });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes(posts)
  .map(
    (route) => `  <url>
    <loc>${escapeXml(url(route.path))}</loc>
    <lastmod>${escapeXml(route.lastmod || latestDate)}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>slidedeck</title>
    <link>${escapeXml(url("/"))}</link>
    <atom:link href="${escapeXml(url("/rss.xml"))}" rel="self" type="application/rss+xml" />
    <description>A developer blog that documents the CSS and JavaScript techniques powering itself.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${latestDate}T00:00:00Z`).toUTCString()}</lastBuildDate>
${posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url(`/posts/${post.slug}`))}</link>
      <guid isPermaLink="true">${escapeXml(url(`/posts/${post.slug}`))}</guid>
      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt)}</description>
${post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join("\n")}
    </item>`,
  )
  .join("\n")}
  </channel>
</rss>
`;
fs.writeFileSync(path.join(publicDir, "rss.xml"), rss);

const robots = `User-agent: *
Allow: ${basePath}

Sitemap: ${url("/sitemap.xml")}
`;
fs.writeFileSync(path.join(publicDir, "robots.txt"), robots);

console.log(`Generated sitemap.xml, rss.xml, and robots.txt for ${posts.length} posts.`);
