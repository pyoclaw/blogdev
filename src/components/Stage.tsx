import { useEffect } from "react";
import { useLocation, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useNavDirection } from "../lib/navigation";

/* -------------------------------------------------------------------------
   Stage.tsx — the horizontal slide transition

   This is the signature motion of the site. Each route change swaps the
   whole page along the X axis. We render the router's current <Outlet> keyed
   by pathname inside <AnimatePresence mode="popLayout">, which:

     • keeps the outgoing page mounted while it animates out, and
     • pops it to position:absolute so the incoming page owns normal flow
       (no vertical "stacking" jump while both are on screen).

   `custom={direction}` feeds the +1 / -1 from the NavProvider into the
   variants so the slide honours forward vs. back navigation.
   ------------------------------------------------------------------------- */

const variants: Variants = {
  enter: (dir: number) => ({
    x: `${dir * 62}%`,
    opacity: 0,
    scale: 0.96,
    rotate: dir * 0.6,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
    rotate: 0,
  },
  exit: (dir: number) => ({
    x: `${dir * -62}%`,
    opacity: 0,
    scale: 0.96,
    rotate: dir * -0.6,
  }),
};

export default function Stage() {
  const location = useLocation();
  const outlet = useOutlet();
  const { getDirection } = useNavDirection();
  const direction = getDirection();

  // Land at the top of every new page (the slide handles the horizontal flair).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  return (
    <div className="stage">
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <motion.main
          key={location.pathname + location.search}
          className="page"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
            opacity: { duration: 0.25, ease: "easeOut" },
            scale: { type: "spring", stiffness: 320, damping: 34 },
            rotate: { duration: 0.4 },
          }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
