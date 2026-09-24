import { useLocation } from "react-router-dom";
import { SlideLink } from "../lib/navigation";

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(to + "/");
}

export default function NavBar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/posts", label: "Writing" },
    { to: "/tags", label: "Tags" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="nav">
      <div className="wrap nav__inner">
        <SlideLink to="/" className="brand" aria-label="slidedeck home">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand__name">
            <b>slide</b>deck
          </span>
        </SlideLink>

        <span className="nav__spacer" />

        <nav className="nav__links" aria-label="Primary">
          {links.map((l) => (
            <SlideLink
              key={l.to}
              to={l.to}
              className={
                "nav-link" + (isActive(pathname, l.to) ? " is-active" : "")
              }
            >
              {l.label}
            </SlideLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
