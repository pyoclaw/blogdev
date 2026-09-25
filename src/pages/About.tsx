import MagneticButton from "../components/MagneticButton";
import Seo from "../components/Seo";

export default function About() {
  return (
    <div className="wrap section-pad">
      <Seo
        title="About — slidedeck"
        description="Learn why slidedeck is a self-documenting developer blog and how React, Framer Motion, Markdown, and hand-written CSS power it."
      />

      <div className="post-hero" style={{ paddingTop: 0 }}>
        <h1 className="post-title">
          This blog is its own <span style={{ color: "var(--coral-deep)" }}>documentation</span>.
        </h1>
        <div className="prose" style={{ marginTop: "1.8rem" }}>
          <p>
            <strong>slidedeck</strong> is a little experiment: a developer blog where the subject
            matter <em>is the blog</em>. Every post takes one piece of the site — the horizontal
            page transitions, the springy hover cards, the reading-progress bar, the from-scratch
            Markdown pipeline — and explains exactly how it's built, with the real code.
          </p>
          <p>
            If something on this page moves, bounces, or slides, there's a post about why and how.
            Read one, then open the corresponding file. They should match.
          </p>

          <h2>The stack</h2>
          <ul>
            <li>
              <strong>React + React Router</strong> for routing and the outlet that the transition
              wraps around.
            </li>
            <li>
              <strong>Framer Motion</strong> for the horizontal slide, spring physics, and
              scroll-reveal cards.
            </li>
            <li>
              <strong>Hand-written CSS</strong> — custom properties, no utility framework — so the
              posts can point at real selectors.
            </li>
            <li>
              <strong>Markdown + a tiny frontmatter parser</strong> for the content, loaded at build
              time with <code>import.meta.glob</code>.
            </li>
          </ul>

          <h2>How to read it</h2>
          <p>
            Start with the archive, or jump straight to the mechanic you're curious about via the
            tags. Each article is short, honest about trade-offs, and copy-pasteable.
          </p>
        </div>

        <div className="hero__cta" style={{ marginTop: "2rem" }}>
          <MagneticButton to="/posts" className="btn--coral">
            Read the posts ↦
          </MagneticButton>
          <MagneticButton to="/tags" className="btn--ghost">
            Browse tags
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
