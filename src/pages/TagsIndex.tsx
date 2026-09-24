import { useEffect } from "react";
import { SlideLink } from "../lib/navigation";
import { getAllTags, tagAccent } from "../lib/posts";

export default function TagsIndex() {
  useEffect(() => {
    document.title = "Tags — slidedeck";
  }, []);

  const tags = getAllTags();

  return (
    <div className="wrap section-pad">
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
