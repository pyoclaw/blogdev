import {
  useMotionValue,
  useSpring,
  type MotionValue,
  type MotionStyle,
} from "framer-motion";

/* -------------------------------------------------------------------------
   interactions.ts — small, reusable pointer micro-interactions

   Both hooks lean on Framer Motion "motion values": numbers that live outside
   React state, so updating them on every mousemove never triggers a re-render.
   A useSpring wrapper eases the raw value so the motion feels physical, and
   both hooks quietly no-op when the user prefers reduced motion or is on a
   coarse (touch) pointer.
   ------------------------------------------------------------------------- */

function motionAllowed(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

const SPRING = { stiffness: 250, damping: 18, mass: 0.6 };

export interface TiltResult {
  style: MotionStyle;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

/** 3D tilt that follows the pointer across an element. `max` = degrees. */
export function useTilt(max = 9): TiltResult {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rx = useSpring(rotateX, SPRING);
  const ry = useSpring(rotateY, SPRING);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!motionAllowed()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    // top → tilt back (+X), left → tilt right (+Y)
    rotateX.set((0.5 - py) * max * 2);
    rotateY.set((px - 0.5) * max * 2);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return {
    style: {
      rotateX: rx,
      rotateY: ry,
      transformPerspective: 900,
      transformStyle: "preserve-3d",
    },
    onMouseMove,
    onMouseLeave,
  };
}

export interface MagneticResult {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave: () => void;
}

/** Pull an element a little toward the cursor while hovering it. */
export function useMagnetic(strength = 0.35): MagneticResult {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  const onMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!motionAllowed()) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * strength);
    my.set((e.clientY - (r.top + r.height / 2)) * strength);
  };

  const onMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return { x, y, onMouseMove, onMouseLeave };
}
