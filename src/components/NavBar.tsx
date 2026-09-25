import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
          {links.map((l) => {
            const active = isActive(pathname, l.to);
            return (
              <SlideLink
                key={l.to}
                to={l.to}
                className={"nav-link" + (active ? " is-active" : "")}
                aria-current={active ? "page" : undefined}
              >
                {/* Shared-layout pill: a single element that glides from the
                    old active link to the new one via matching layoutId. */}
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="nav-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="nav-link__label">{l.label}</span>
              </SlideLink>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
