---
title: "Mixing Up the Motion: Per-Route Transitions & Pointer Play"
date: "2026-09-24"
tags: [motion, framer-motion, javascript, ux]
accent: grape
excerpt: "One slide for every page got monotonous. Now each destination has its own entrance — rise, zoom, swing, arc — plus tilting cards, magnetic buttons, and a nav pill that glides. Here's the whole choreography."
---

The [original transition post](/posts/horizontal-page-transitions) shipped a single horizontal slide for every navigation. It looked sharp for a day and then started to feel like a tic — the same move, over and over. So this update does two things: it gives **each destination its own kind of entrance**, and it scatters a handful of **pointer-driven micro-interactions** across the page. Here's all of it.

## 1. Transitions that depend on where you're going

The trick is to stop hardcoding the motion and instead *look up* a transition kind from the destination route:

```ts
type Kind = "slide" | "rise" | "zoom" | "swing" | "diagonal";

function resolveKind(pathname: string): Kind {
  if (pathname === "/") return "slide";
  if (pathname === "/posts") return "slide";
  if (pathname.startsWith("/posts/")) return "rise";     // articles rise up
  if (pathname === "/tags") return "zoom";               // tag index zooms in
  if (pathname.startsWith("/tags/")) return "swing";     // a tag swings in
  if (pathname === "/about") return "diagonal";          // about arcs in
  return "zoom";                                          // 404
}
```

Each kind is just a pair of offsets — where the page *enters from* and *exits to* — still multiplied by the +1 / −1 direction so Back reverses everything:

```ts
const kinds = {
  slide: {
    enter: (d) => ({ x: `${d * 60}%`, y: "0vh", scale: 0.96, rotate: d * 0.6 }),
    exit:  (d) => ({ x: `${d * -60}%`, y: "0vh", scale: 0.96, rotate: d * -0.6 }),
  },
  rise: {
    enter: (d) => ({ x: "0%", y: `${d * 40}vh`, scale: 0.93 }),
    exit:  (d) => ({ x: "0%", y: `${d * -26}vh`, scale: 0.97 }),
  },
  swing: {
    enter: (d) => ({ x: `${d * 34}%`, y: "4vh", scale: 0.9, rotate: d * 7 }),
    exit:  (d) => ({ x: `${d * -34}%`, y: "4vh", scale: 0.9, rotate: d * -7 }),
  },
  // …zoom and diagonal follow the same shape
};
```

> **Why `vh` for vertical, `%` for horizontal?** A CSS `translateY(40%)` is relative to the *element's own height* — fine for a short page, but a 3,000px article would start 1,200px away and lumber in. `vh` is relative to the viewport, so every page rises the same, predictable distance regardless of length. Horizontal `%` stays because page width ≈ viewport width.

### The subtle part: the exiting page must agree

When you leave page A for page B, A is animating **out** while B animates **in**. If A exits with a slide but B enters with a rise, it looks broken. We want *both halves* governed by the destination.

Framer Motion has exactly the hook for this: `AnimatePresence` takes its own `custom` prop, and that value is what exit variants receive — even though the exiting component was rendered with stale props. So we bundle direction **and** kind together and hand the same object to both:

```tsx
const kind = resolveKind(location.pathname);
const custom = { direction: getDirection(), kind };

<AnimatePresence mode="popLayout" custom={custom}>
  <motion.main key={location.pathname} custom={custom} variants={variants}
    initial="enter" animate="center" exit="exit"
    style={{ transformOrigin: kind === "swing" ? "bottom center" : "center" }}
  >
    {outlet}
  </motion.main>
</AnimatePresence>
```

The variants just read the bundle:

```ts
const variants = {
  enter:  (c) => ({ opacity: 0, ...kinds[c.kind].enter(c.direction) }),
  center: { x: "0%", y: "0vh", opacity: 1, scale: 1, rotate: 0 },
  exit:   (c) => ({ opacity: 0, ...kinds[c.kind].exit(c.direction) }),
};
```

Note `swing` even gets a `transform-origin: bottom center` so it pivots like a hanging sign instead of spinning around its middle. Little detail, big difference.

## 2. Cards that tilt toward the pointer

Motion shouldn't only happen *between* pages. Hover any card now and it tilts in 3D toward your cursor. The golden rule is **never re-render React for pointer movement** — so we use Framer *motion values*, which live outside React state:

```ts
export function useTilt(max = 9) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const rx = useSpring(rotateX, { stiffness: 250, damping: 18 });
  const ry = useSpring(rotateY, { stiffness: 250, damping: 18 });

  const onMouseMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1 across
    const py = (e.clientY - r.top) / r.height;   // 0..1 down
    rotateX.set((0.5 - py) * max * 2);           // top tilts back
    rotateY.set((px - 0.5) * max * 2);           // right tilts away
  };
  const onMouseLeave = () => { rotateX.set(0); rotateY.set(0); };

  return {
    style: { rotateX: rx, rotateY: ry, transformPerspective: 900,
             transformStyle: "preserve-3d" },
    onMouseMove, onMouseLeave,
  };
}
```

Wrapping the raw motion value in `useSpring` is what makes the tilt *ease* toward the target instead of snapping — the card feels like it has weight. The inner content gets a `translateZ(35px)` so text floats above the card surface and the parallax reads as real depth.

## 3. Magnetic buttons

The same motion-value pattern, applied to translation instead of rotation, gives buttons a magnetic pull:

```ts
const onMouseMove = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  mx.set((e.clientX - (r.left + r.width / 2)) * 0.4);  // 0.4 = strength
  my.set((e.clientY - (r.top + r.height / 2)) * 0.4);
};
```

The button leans toward the cursor while hovered and springs home on leave. Nesting a second magnetic layer on the *label* makes it drift slightly further than the button shell — a tiny parallax that sells the effect.

## 4. A nav pill that glides between links

The active-page indicator used to just appear under whichever link was active. Now a single pill physically **slides** from the old link to the new one, using Framer's shared-layout magic — `layoutId`:

```tsx
{active && (
  <motion.span
    layoutId="nav-pill"
    className="nav-pill"
    transition={{ type: "spring", stiffness: 420, damping: 34 }}
  />
)}
```

Because only one link is ever active, only one `nav-pill` exists at a time. When it unmounts from link A and mounts under link B, Framer sees the shared `layoutId` and animates the gap between the two positions automatically. Zero manual measuring.

## 5. Copy buttons that spring

Finally, every code block on this page (including the ones you're reading) grows a copy button on hover. It reads the rendered text straight off the DOM and swaps its label with an `AnimatePresence` spring:

```tsx
const copy = async () => {
  await navigator.clipboard.writeText(ref.current.innerText);
  setCopied(true);
  setTimeout(() => setCopied(false), 1400);
};
```

## Still turn-off-able

Every one of these — the varied transitions, the tilt, the magnetism — respects `prefers-reduced-motion` and skips coarse-pointer (touch) devices entirely, exactly as covered in [Motion You Can Turn Off](/posts/respecting-reduced-motion). The pointer hooks literally `return` before doing anything when motion isn't welcome.

The result: navigation that feels *composed* instead of repetitive, and a page that reacts to you the whole time you're on it — without a single unnecessary re-render.
