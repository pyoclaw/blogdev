import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { SlideLink } from "../lib/navigation";
import { getPostsByTag, getAllTags, tagAccent } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function TagPage() {
  const { tag = "" } = useParams();
  const decoded = decodeURIComponent(tag);
  const matches = getPostsByTag(decoded);
  const allTags = getAllTags();

  useEffect(() => {
    document.title = `#${decoded} — slidedeck`;
  }, [decoded]);

  return (
    <div className="wrap section-pad">
      <div className="section-head">
        <div>
          <h2>
            <span style={{ color: `var(--${tagAccent(decoded)})` }}>#</span>
            {decoded}
          </h2>
          <p>
            {matches.length} {matches.length === 1 ? "post" : "posts"} tagged
            with this technique.
          </p>
        </div>
        <SlideLink to="/tags" className="btn btn--ghost" direction="back">
          ← All tags
        </SlideLink>
      </div>

      {/* quick switcher between tags */}
      <div className="tag-cloud" style={{ marginBottom: "1.8rem" }}>
        {allTags.map((t) => (
          <SlideLink
            key={t.tag}
            to={`/tags/${encodeURIComponent(t.tag)}`}
            className={
              "tag tag--" +
              tagAccent(t.tag) +
              (t.tag.toLowerCase() === decoded.toLowerCase() ? " is-active" : "")
            }
          >
            {t.tag}
          </SlideLink>
        ))}
      </div>

      {matches.length > 0 ? (
        <div className="card-grid">
          {matches.map((p, i) => (
            <PostCard key={p.slug} post={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="empty__code">#?</div>
          <h1>No posts with that tag… yet</h1>
          <p>Try another thread from the list above.</p>
          <SlideLink to="/posts" className="btn btn--coral" direction="back">
            Back to all posts
          </SlideLink>
        </div>
      )}
    </div>
  );
}
