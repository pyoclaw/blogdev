import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { SlideLink } from "../lib/navigation";
import { posts, getAllTags, tagAccent } from "../lib/posts";
import PostCard, { FeatureCard } from "../components/PostCard";
import MagneticButton from "../components/MagneticButton";
import { Orb, NeonGrid } from "../components/CosmicScene";

/* Word-by-word reveal for the headline. */
const titleWords = [
  { t: "A" },
  { t: "blog" },
  { t: "that" },
  { t: "slides", swipe: true },
  { t: "—" },
  { t: "and" },
  { t: "tells" },
  { t: "you" },
  { t: "how." },
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};
const word: Variants = {
  hidden: { opacity: 0, y: "0.6em", rotate: -4 },
  show: {
    opacity: 1,
    y: "0em",
    rotate: 0,
    transition: { type: "spring", stiffness: 420, damping: 26 },
  },
};

export default function Home() {
  useEffect(() => {
    document.title = "slidedeck — a self-documenting dev blog";
  }, []);

  const [featured, ...rest] = posts;
  const tags = getAllTags().slice(0, 8);

  return (
    <div className="page-home">
      <section className="hero wrap">
        <Orb />
        <NeonGrid />
        <span className="hero__ghost" aria-hidden="true">
          赤
        </span>

        <motion.div
          className="hero__kana"
          aria-hidden="true"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          スライドデッキ
          <span className="rising" />
        </motion.div>

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
          variants={container}
          initial="hidden"
          animate="show"
        >
          {titleWords.map((w, i) => (
            <span className="word" key={i}>
              <motion.span
                className={"word__inner" + (w.swipe ? " swipe" : "")}
                variants={word}
              >
                {w.t}
              </motion.span>
              {i < titleWords.length - 1 ? " " : ""}
            </span>
          ))}
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
          <MagneticButton to="/posts" className="btn--coral">
            Read the teardown ↦
          </MagneticButton>
          <MagneticButton to="/tags" className="btn--ghost">
            Browse by tag
          </MagneticButton>
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
