import { SlideLink } from "../lib/navigation";
import { getAllTags, tagAccent } from "../lib/posts";
import Seo from "../components/Seo";

export default function TagsIndex() {
  const tags = getAllTags();

  return (
    <div className="wrap section-pad">
      <Seo
        title="Tags — slidedeck"
        description="Browse slidedeck posts by technique: CSS, motion, accessibility, markdown, Vite, React Router, and more."
      />

      <div className="section-head">
        <div>
          <h2>Every tag</h2>
          <p>Each technique this site uses, cross-referenced. Pick a thread.</p>
        </div>
      </div>
      <div className="tag-cloud">
        {tags.map((t) => (
          <SlideLink
            key={t.tag}
            to={`/tags/${encodeURIComponent(t.tag)}`}
            className="tag-big"
            style={{ fontSize: `${0.95 + Math.min(t.count, 4) * 0.12}rem` }}
          >
            <span style={{ color: `var(--${tagAccent(t.tag)})` }}>{t.tag}</span>
            <span className="count">{t.count}</span>
          </SlideLink>
        ))}
      </div>
    </div>
  );
}
