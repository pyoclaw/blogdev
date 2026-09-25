import { motion, useReducedMotion } from "framer-motion";

/* -------------------------------------------------------------------------
   CosmicScene.tsx — the red-cosmic hero backdrop

   Three pure-CSS set pieces inspired by the reference art:
     • Orb        — a glowing celestial planet (radial gradients + rim glow),
                    gently bobbing via a Framer float.
     • NeonGrid   — a synthwave floor receding to a glowing horizon, built with
                    two linear-gradients on a plane tilted in 3D (rotateX) and
                    scrolled with a background-position keyframe.
   Everything sits behind the hero content and is purely decorative.
   ------------------------------------------------------------------------- */

export function Orb() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="hero__deco"
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: prefersReducedMotion ? 0 : 1.1, ease: "easeOut" }}
      aria-hidden="true"
    >
      <motion.div
        className="orb"
        style={{
          width: "clamp(220px, 34vw, 460px)",
          height: "clamp(220px, 34vw, 460px)",
          top: "-8%",
          right: "-4%",
        }}
        animate={prefersReducedMotion ? undefined : { y: [0, -18, 0] }}
        transition={
          prefersReducedMotion ? undefined : { duration: 9, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <span
          className="orb__ring"
          style={{ inset: "-26px", transform: "rotate(-18deg) scaleY(0.32)" }}
        />
      </motion.div>
    </motion.div>
  );
}

export function NeonGrid() {
  return (
    <div className="neon-grid" aria-hidden="true">
      <div className="neon-grid__horizon" />
      <div className="neon-grid__floor" />
    </div>
  );
}
