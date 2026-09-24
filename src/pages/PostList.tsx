import { useEffect } from "react";
import { posts } from "../lib/posts";
import PostCard from "../components/PostCard";

export default function PostList() {
  useEffect(() => {
    document.title = "Writing — slidedeck";
  }, []);

  return (
    <div className="wrap section-pad">
      <div className="section-head">
        <div>
          <h2>The whole archive</h2>
          <p>
            {posts.length} posts — each one dissects a piece of this site's own
            CSS or JavaScript.
          </p>
        </div>
      </div>
      <div className="card-grid">
        {posts.map((p, i) => (
          <PostCard key={p.slug} post={p} index={i} />
        ))}
      </div>
    </div>
  );
}
