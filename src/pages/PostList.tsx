import { posts } from "../lib/posts";
import PostCard from "../components/PostCard";
import Seo from "../components/Seo";

export default function PostList() {
  return (
    <div className="wrap section-pad">
      <Seo
        title="Writing — slidedeck"
        description="Browse every slidedeck article, each dissecting a piece of the site's own CSS, JavaScript, motion, and content pipeline."
      />

      <div className="section-head">
        <div>
          <h2>The whole archive</h2>
          <p>
            {posts.length} posts — each one dissects a piece of this site's own CSS or JavaScript.
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
