import MagneticButton from "../components/MagneticButton";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <div className="wrap">
      <Seo
        title="Lost — slidedeck"
        description="This slide does not exist. Return to slidedeck's home page or browse the article archive."
        robots="noindex,follow"
      />

      <div className="empty">
        <div className="empty__code">404</div>
        <h1>This slide doesn't exist</h1>
        <p>The page slid clean off the edge of the deck. Let's get you back onto the track.</p>
        <MagneticButton to="/" className="btn--coral" direction="back">
          ← Back to home
        </MagneticButton>
      </div>
    </div>
  );
}
