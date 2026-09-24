import { useEffect } from "react";
import MagneticButton from "../components/MagneticButton";

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
        <MagneticButton to="/" className="btn--coral" direction="back">
          ← Back to home
        </MagneticButton>
      </div>
    </div>
  );
}
