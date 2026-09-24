import { SlideLink } from "../lib/navigation";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span className="footer__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <strong>slidedeck</strong>
        </div>
        <div className="footer__note">
          A blog that documents its own CSS &amp; JS. View{" "}
          <SlideLink to="/posts">the source posts</SlideLink> — they describe
          the exact code running this page.
        </div>
        <div className="footer__note">
          Built with React, React&nbsp;Router &amp; Framer&nbsp;Motion · © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
