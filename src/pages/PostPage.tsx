import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import { SlideLink } from "../lib/navigation";
import { getPost, getAdjacent, formatDate, tagAccent } from "../lib/posts";
import CodeBlock from "../components/CodeBlock";
import Seo from "../components/Seo";
import NotFound from "./NotFound";

const HIGHLIGHT_LANGUAGES = {
  css,
  js: javascript,
  javascript,
  jsx: javascript,
  ts: typescript,
  tsx: typescript,
  typescript,
};

function useReadingProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

export default function PostPage() {
  const { slug } = useParams();
  const post = slug ? getPost(slug) : undefined;
  const progress = useReadingProgress();

  if (!post) return <NotFound />;

  const { prev, next } = getAdjacent(post.slug);

  return (
    <>
      <Seo
        title={`${post.title} — slidedeck`}
        description={post.excerpt}
        type="article"
        publishedTime={post.date}
        tags={post.tags}
      />
      <div className="progress" style={{ ["--p" as string]: progress }} />

      <article className="wrap post-hero">
        <SlideLink to="/posts" className="post-back" direction="back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M11 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          all posts
        </SlideLink>

        <motion.h1
          className="post-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{
            textDecorationColor: `var(--${post.accent})`,
          }}
        >
          {post.title}
        </motion.h1>

        <div className="post-meta">
          <span>{formatDate(post.date)}</span>
          <span>· {post.readingMinutes} min read</span>
          <span style={{ display: "inline-flex", gap: "0.4rem", flexWrap: "wrap" }}>
            {post.tags.map((t) => (
              <SlideLink
                key={t}
                to={`/tags/${encodeURIComponent(t)}`}
                className={`tag tag--${tagAccent(t)}`}
              >
                {t}
              </SlideLink>
            ))}
          </span>
        </div>

        <motion.div
          className="prose"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              [
                rehypeHighlight,
                { detect: false, ignoreMissing: true, languages: HIGHLIGHT_LANGUAGES },
              ],
            ]}
            components={{ pre: CodeBlock }}
          >
            {post.body}
          </ReactMarkdown>
        </motion.div>

        <nav className="post-nav" aria-label="More posts">
          {prev ? (
            <SlideLink to={`/posts/${prev.slug}`} className="prev" direction="back">
              <span className="dir">← Newer</span>
              <span className="t">{prev.title}</span>
            </SlideLink>
          ) : (
            <span />
          )}
          {next ? (
            <SlideLink to={`/posts/${next.slug}`} className="next">
              <span className="dir">Older →</span>
              <span className="t">{next.title}</span>
            </SlideLink>
          ) : (
            <span />
          )}
        </nav>
      </article>
    </>
  );
}
