import { motion } from "framer-motion";
import { SlideLink } from "../lib/navigation";
import { useTilt } from "../lib/interactions";
import { formatDate, tagAccent, type Post } from "../lib/posts";

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const HOVER = { y: -6, scale: 1.03 } as const;
const HOVER_SPRING = { type: "spring" as const, stiffness: 300, damping: 20 };

export function FeatureCard({ post, index }: { post: Post; index: number }) {
  const tilt = useTilt(5);
  return (
    <motion.article
      className="card card--feature"
      style={{
        ["--card-accent" as string]: `var(--${post.accent})`,
        ...tilt.style,
      }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01, transition: HOVER_SPRING }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div style={{ transform: "translateZ(40px)" }}>
        <div className="card__meta">
          <span className="card__num" style={{ color: "var(--lemon)" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>· {formatDate(post.date)}</span>
          <span>· {post.readingMinutes} min</span>
        </div>
        <SlideLink to={`/posts/${post.slug}`}>
          <h3 className="card__title">{post.title}</h3>
        </SlideLink>
        <p className="card__excerpt">{post.excerpt}</p>
        <div className="card__tags">
          {post.tags.map((t) => (
            <SlideLink
              key={t}
              to={`/tags/${encodeURIComponent(t)}`}
              className={`tag tag--${tagAccent(t)}`}
            >
              {t}
            </SlideLink>
          ))}
        </div>
        <SlideLink to={`/posts/${post.slug}`} className="card__go">
          Read the write-up <Arrow />
        </SlideLink>
      </div>
      <div className="filmstrip" aria-hidden="true">
        <div className="filmstrip__track">
          {["coral", "lemon", "mint", "sky", "grape", "coral", "lemon", "mint"].map((c, i) => (
            <div key={i} className="filmstrip__cell" style={{ ["--c" as string]: `var(--${c})` }}>
              {String((i % 8) + 1).padStart(2, "0")}
            </div>
          ))}
          {["sky", "grape", "coral", "lemon", "mint", "sky", "grape", "coral"].map((c, i) => (
            <div
              key={"b" + i}
              className="filmstrip__cell"
              style={{ ["--c" as string]: `var(--${c})` }}
            >
              {String((i % 8) + 1).padStart(2, "0")}
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default function PostCard({ post, index }: { post: Post; index: number }) {
  const tilt = useTilt(9);
  return (
    <motion.article
      className="card"
      style={{
        ["--card-accent" as string]: `var(--${post.accent})`,
        ...tilt.style,
      }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ ...HOVER, transition: HOVER_SPRING }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: (index % 3) * 0.06,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <div style={{ transform: "translateZ(35px)" }} className="card__lift">
        <div className="card__meta">
          <span className="card__num">{String(index + 1).padStart(2, "0")}</span>
          <span>· {formatDate(post.date)}</span>
          <span>· {post.readingMinutes} min read</span>
        </div>
        <SlideLink to={`/posts/${post.slug}`}>
          <h3 className="card__title">{post.title}</h3>
        </SlideLink>
        <p className="card__excerpt">{post.excerpt}</p>
        <div className="card__tags">
          {post.tags.map((t) => (
            <SlideLink
              key={t}
              to={`/tags/${encodeURIComponent(t)}`}
              className={`tag tag--${tagAccent(t)}`}
            >
              {t}
            </SlideLink>
          ))}
        </div>
        <SlideLink to={`/posts/${post.slug}`} className="card__go">
          Read <Arrow />
        </SlideLink>
      </div>
    </motion.article>
  );
}
