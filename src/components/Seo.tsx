import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE_NAME = "slidedeck";
const DEFAULT_IMAGE = "/og-image.svg";

type Robots = "index,follow" | "noindex,follow";

interface SeoProps {
  title: string;
  description: string;
  type?: "website" | "article";
  image?: string;
  publishedTime?: string;
  tags?: string[];
  robots?: Robots;
}

function normalizeBase(base: string) {
  if (!base || base === "/") return "";
  return `/${base.replace(/^\/+|\/+$/g, "")}`;
}

function absoluteUrl(pathname: string) {
  const siteUrl = (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, "");
  const origin = siteUrl || (typeof window !== "undefined" ? window.location.origin : "");
  const base = normalizeBase(import.meta.env.BASE_URL);
  const route = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${origin}${base}${route === "/" ? "" : route}` || route;
}

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

function upsertLink(rel: string, href: string, attributes: Record<string, string> = {}) {
  const selector = [
    `link[rel="${rel}"]`,
    attributes.type ? `[type="${attributes.type}"]` : "",
  ].join("");
  let element = document.head.querySelector<HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    document.head.append(element);
  }
  element.href = href;
}

export default function Seo({
  title,
  description,
  type = "website",
  image = DEFAULT_IMAGE,
  publishedTime,
  tags = [],
  robots = "index,follow",
}: SeoProps) {
  const location = useLocation();

  useEffect(() => {
    const canonical = absoluteUrl(location.pathname);
    const imageUrl = absoluteUrl(image);

    document.title = title;

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", `${SITE_NAME}: ${description}`);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", imageUrl);

    if (type === "article" && publishedTime) {
      upsertMeta("property", "article:published_time", `${publishedTime}T00:00:00.000Z`);
    } else {
      document.head.querySelector('meta[property="article:published_time"]')?.remove();
    }

    document.head.querySelectorAll('meta[property="article:tag"]').forEach((element) => {
      element.remove();
    });
    for (const tag of tags) {
      const element = document.createElement("meta");
      element.setAttribute("property", "article:tag");
      element.content = tag;
      document.head.append(element);
    }

    upsertLink("canonical", canonical);
    upsertLink("alternate", absoluteUrl("/rss.xml"), {
      type: "application/rss+xml",
      title: "slidedeck RSS feed",
    });
  }, [description, image, location.pathname, publishedTime, robots, tags, title, type]);

  return null;
}
