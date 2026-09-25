import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { useNavDirection } from "../lib/navigation";

/* -------------------------------------------------------------------------
   Stage.tsx — varied page transitions

   The site no longer uses one slide for everything. Each destination route
   picks a *kind* of motion, so moving around feels choreographed rather than
   repetitive:

     • home / posts list  → horizontal slide
     • a post             → rises up from below
     • tags index         → zooms in
     • a single tag       → swings in like a pendulum
     • about              → arcs in diagonally
     • 404                → zooms

   Direction (+1 forward / -1 back) still flips each motion so Back always
   feels like reversing. The chosen kind is passed through AnimatePresence's
   `custom` prop so the OUTGOING page animates out to match where you're going.
   ------------------------------------------------------------------------- */

type Kind = "slide" | "rise" | "zoom" | "swing" | "diagonal";
interface Custom {
  direction: 1 | -1;
  kind: Kind;
}

function resolveKind(pathname: string): Kind {
  if (pathname === "/") return "slide";
  if (pathname === "/posts") return "slide";
  if (pathname.startsWith("/posts/")) return "rise";
  if (pathname === "/tags") return "zoom";
  if (pathname.startsWith("/tags/")) return "swing";
  if (pathname === "/about") return "diagonal";
  return "zoom";
}

/* Each kind describes where the page starts (enter) and leaves to (exit).
   x is in % (element/viewport width), y in vh so tall articles don't fly. */
const kinds: Record<Kind, { enter: (d: number) => object; exit: (d: number) => object }> = {
  slide: {
    enter: (d) => ({ x: `${d * 60}%`, y: "0vh", scale: 0.96, rotate: d * 0.6 }),
    exit: (d) => ({ x: `${d * -60}%`, y: "0vh", scale: 0.96, rotate: d * -0.6 }),
  },
  rise: {
    enter: (d) => ({ x: "0%", y: `${d * 40}vh`, scale: 0.93, rotate: 0 }),
    exit: (d) => ({ x: "0%", y: `${d * -26}vh`, scale: 0.97, rotate: 0 }),
  },
  zoom: {
    enter: (d) => ({
      x: "0%",
      y: "0vh",
      scale: d > 0 ? 0.62 : 1.18,
      rotate: d > 0 ? -3 : 3,
    }),
    exit: (d) => ({
      x: "0%",
      y: "0vh",
      scale: d > 0 ? 1.18 : 0.62,
      rotate: d > 0 ? 3 : -3,
    }),
  },
  swing: {
    enter: (d) => ({ x: `${d * 34}%`, y: "4vh", scale: 0.9, rotate: d * 7 }),
    exit: (d) => ({ x: `${d * -34}%`, y: "4vh", scale: 0.9, rotate: d * -7 }),
  },
  diagonal: {
    enter: (d) => ({ x: `${d * 44}%`, y: "26vh", scale: 0.9, rotate: 0 }),
    exit: (d) => ({ x: `${d * -44}%`, y: "-20vh", scale: 0.9, rotate: 0 }),
  },
};

const variants: Variants = {
  enter: (c: Custom) => ({ opacity: 0, ...kinds[c.kind].enter(c.direction) }),
  center: { x: "0%", y: "0vh", opacity: 1, scale: 1, rotate: 0 },
  exit: (c: Custom) => ({ opacity: 0, ...kinds[c.kind].exit(c.direction) }),
};

export default function Stage() {
  const location = useLocation();
  const outlet = useOutlet();
  const { getDirection } = useNavDirection();
  const prefersReducedMotion = useReducedMotion();

  const kind = resolveKind(location.pathname);
  const custom: Custom = { direction: getDirection(), kind };

  // Land at the top of every new page (the transition handles the flair).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return (
    <div className="stage">
      <AnimatePresence mode="popLayout" custom={custom} initial={false}>
        <motion.main
          id="main-content"
          tabIndex={-1}
          key={location.pathname + location.search}
          className="page"
          custom={custom}
          variants={prefersReducedMotion ? undefined : variants}
          initial={prefersReducedMotion ? { opacity: 0 } : "enter"}
          animate={prefersReducedMotion ? { opacity: 1 } : "center"}
          exit={prefersReducedMotion ? { opacity: 0 } : "exit"}
          style={{
            transformOrigin: kind === "swing" ? "bottom center" : "center",
          }}
          transition={
            prefersReducedMotion
              ? { opacity: { duration: 0.12, ease: "linear" } }
              : {
                  x: { type: "spring", stiffness: 300, damping: 32, mass: 0.9 },
                  y: { type: "spring", stiffness: 300, damping: 32, mass: 0.9 },
                  scale: { type: "spring", stiffness: 300, damping: 30 },
                  rotate: { type: "spring", stiffness: 220, damping: 26 },
                  opacity: { duration: 0.28, ease: "easeOut" },
                }
          }
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
