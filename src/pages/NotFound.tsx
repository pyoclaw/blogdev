import { useEffect } from "react";
import { SlideLink } from "../lib/navigation";

export default function NotFound() {
  useEffect(() => {
    document.title = "Lost — slidedeck";
  }, []);

  return (
    <div className="wrap">
      <div className="empty">
        <div className="empty__code">404</div>
        <h1>This slide doesn't exist</h1>
        <p>
          The page slid clean off the edge of the deck. Let's get you back onto
          the track.
        </p>
        <SlideLink to="/" className="btn btn--coral" direction="back">
          ← Back to home
        </SlideLink>
      </div>
    </div>
  );
}
