import { useEffect, useRef } from "react";

/* -------------------------------------------------------------------------
   Spotlight.tsx — a soft blob that trails the cursor

   A tiny micro-interaction. We avoid re-rendering React on every mousemove:
   the listener writes straight to the element's transform via a ref, and a
   requestAnimationFrame loop eases the blob toward the target with simple
   linear interpolation (lerp). mix-blend-mode does the color magic in CSS.
   Pointer-fine devices only — see the media query in global.css.
   ------------------------------------------------------------------------- */

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let x = targetX;
    let y = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const onDown = () => el.style.setProperty("--scale", "0.55");
    const onUp = () => el.style.setProperty("--scale", "1");

    const tick = () => {
      // lerp: ease 18% of the remaining distance each frame
      x += (targetX - x) * 0.18;
      y += (targetY - y) * 0.18;
      const s = el.style.getPropertyValue("--scale") || "1";
      el.style.transform = `translate(${x - 13}px, ${y - 13}px) scale(${s})`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return <div className="spotlight" ref={ref} aria-hidden="true" />;
}
