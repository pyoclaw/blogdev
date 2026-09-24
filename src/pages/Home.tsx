import { useEffect } from "react";
import { motion } from "framer-motion";
import { SlideLink } from "../lib/navigation";
import { posts, getAllTags, tagAccent } from "../lib/posts";
import PostCard, { FeatureCard } from "../components/PostCard";

const blobs = [
  { c: "coral", size: 220, top: "8%", left: "72%", d: 0 },
  { c: "mint", size: 150, top: "48%", left: "84%", d: 1.2 },
  { c: "lemon", size: 120, top: "62%", left: "6%", d: 0.6 },
];

export default function Home() {
  useEffect(() => {
    document.title = "slidedeck — a self-documenting dev blog";
  }, []);

  const [featured, ...rest] = posts;
  const tags = getAllTags().slice(0, 8);

  return (
    <div className="page-home">
      <section className="hero wrap">
        <div className="hero__deco" aria-hidden="true">
          {blobs.map((b, i) => (
            <motion.span
              key={i}
              className="blob"
              style={{
                width: b.size,
                height: b.size,
                top: b.top,
                left: b.left,
                background: `var(--${b.c})`,
              }}
              animate={{ y: [0, -22, 0], x: [0, 12, 0] }}
              transition={{
                duration: 7 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: b.d,
              }}
            />
          ))}
        </div>

        <motion.span
          className="hero__eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="dot" /> live &amp; documenting itself
        </motion.span>

        <motion.h1
          className="hero__title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
        >
          A blog that <span className="swipe">slides</span> — and tells you how.
        </motion.h1>

        <motion.p
          className="hero__lede"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
        >
          Every page here glides in horizontally, on a spring. Every post is a
          teardown of the exact CSS &amp; JavaScript that makes this site move —
          copy-pasteable, honestly annotated, faintly ridiculous.
        </motion.p>

        <motion.div
          className="hero__cta"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
        >
          <SlideLink to="/posts" className="btn btn--coral">
            Read the teardown ↦
          </SlideLink>
          <SlideLink to="/tags" className="btn btn--ghost">
            Browse by tag
          </SlideLink>
        </motion.div>
      </section>

      <section className="wrap section-pad">
        <div className="section-head">
          <div>
            <h2>Latest write-up</h2>
            <p>The most recent thing I taught this site to do.</p>
          </div>
        </div>
        {featured && <FeatureCard post={featured} index={0} />}
      </section>

      <section className="wrap section-pad" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>More from the workshop</h2>
            <p>Small techniques, fully explained.</p>
          </div>
          <SlideLink to="/posts" className="btn btn--ghost">
            All posts →
          </SlideLink>
        </div>
        <div className="card-grid">
          {rest.slice(0, 4).map((p, i) => (
            <PostCard key={p.slug} post={p} index={i + 1} />
          ))}
        </div>
      </section>

      <section className="wrap section-pad" style={{ paddingTop: 0 }}>
        <div className="section-head">
          <div>
            <h2>Poke around by tag</h2>
            <p>Filter the archive by the technique you care about.</p>
          </div>
        </div>
        <div className="tag-cloud">
          {tags.map((t) => (
            <SlideLink
              key={t.tag}
              to={`/tags/${encodeURIComponent(t.tag)}`}
              className="tag-big"
            >
              <span style={{ color: `var(--${tagAccent(t.tag)})` }}>
                {t.tag}
              </span>
              <span className="count">{t.count}</span>
            </SlideLink>
          ))}
        </div>
      </section>
    </div>
  );
}
