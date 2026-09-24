---
title: "Sliding Between Worlds: Horizontal Page Transitions"
date: "2026-09-22"
tags: [motion, framer-motion, react-router, ux]
accent: coral
excerpt: "The signature move of this site: every route change glides the whole page sideways on a spring. Here's the exact AnimatePresence + direction trick that makes it feel intentional instead of dizzy."
---

Click any link on this site and the whole page doesn't just *replace* — it **slides**. The outgoing page leaves stage-left while the incoming one springs in from the right. Hit the browser Back button and the motion reverses. That directional honesty is the difference between "fun" and "nauseating," so let's build it properly.

## The three moving parts

1. **`<AnimatePresence>`** keeps a page mounted long enough to animate *out*.
2. **A pathname key** tells React "this is a different page, swap it."
3. **A direction value** (+1 forward, −1 back) so the slide matches intent.

## Keeping the frame still, sliding only the page

Only the page content slides — the navbar and footer stay put. So the transition wraps React Router's `<Outlet>`, not the whole app:

```tsx
// components/Stage.tsx
const location = useLocation();
const outlet = useOutlet();
const { getDirection } = useNavDirection();

return (
  <div className="stage">
    <AnimatePresence mode="popLayout" custom={getDirection()} initial={false}>
      <motion.main
        key={location.pathname + location.search}
        custom={getDirection()}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          x: { type: "spring", stiffness: 320, damping: 34, mass: 0.9 },
          opacity: { duration: 0.25, ease: "easeOut" },
        }}
      >
        {outlet}
      </motion.main>
    </AnimatePresence>
  </div>
);
```

Two details do the heavy lifting here.

### `mode="popLayout"` prevents the vertical jump

The naive version stacks the two pages *vertically* while both are mounted, so the layout lurches. `popLayout` yanks the **exiting** element out of flow (it becomes `position: absolute`) so the entering page immediately owns the normal document height. No jump. For this to work, the parent needs to establish a positioning context:

```css
.stage {
  position: relative;
  overflow-x: clip; /* the sliding pages never spawn a real scrollbar */
}
```

That `overflow-x: clip` is doing quiet, important work — pages translate up to 62% of their width off-screen, and we don't want that to create a horizontal scrollbar.

### The variants read a `custom` direction

The slide direction is data, not a hardcoded sign. Framer Motion pipes the `custom` prop into every variant function:

```ts
const variants = {
  enter: (dir) => ({ x: `${dir * 62}%`, opacity: 0, scale: 0.96, rotate: dir * 0.6 }),
  center:        { x: "0%",            opacity: 1, scale: 1,    rotate: 0 },
  exit:  (dir) => ({ x: `${dir * -62}%`, opacity: 0, scale: 0.96, rotate: dir * -0.6 }),
};
```

The tiny `scale` and `rotate` are seasoning — a page that shrinks a hair and tilts half a degree feels like a physical card being dealt, not a `div` being teleported. A **spring** on `x` (rather than a fixed-duration tween) means fast links feel snappy and the page settles with a whisper of momentum.

## Where does `dir` come from?

React Router won't tell you whether a navigation is "deeper" or "back," so we keep our own tiny signal in a ref and expose it through context:

```tsx
// lib/navigation.tsx
const dir = useRef<1 | -1>(1);

// A <Link> replacement that records intent before navigating:
export function SlideLink({ direction = "forward", ...props }) {
  const { setDirection } = useNavDirection();
  return <RouterLink {...props} onClick={(e) => {
    setDirection(direction === "back" ? -1 : 1);
    props.onClick?.(e);
  }} />;
}

// And the browser Back/Forward buttons always mean "backward":
window.onpopstate = () => { dir.current = -1; };
```

So a normal link slides forward, a "← back" affordance passes `direction="back"`, and the hardware Back button is handled by `popstate`. Every slide points the way the user is actually going.

> Why a ref and not state? Because the direction must be *read* during the same render that triggers the transition. A ref updates synchronously with no extra re-render — perfect for a value that only the animation cares about.

## Don't forget to land at the top

Horizontal motion handles the *left-right* story; the *up-down* one still needs resetting, or a long article leaves you scrolled halfway down the next page:

```ts
useEffect(() => {
  window.scrollTo({ top: 0, behavior: "auto" });
}, [location.pathname, location.search]);
```

`behavior: "auto"` (instant) is deliberate here — a smooth vertical scroll fighting a horizontal slide is exactly the kind of double-motion that makes people queasy.

## The takeaway

Real page transitions aren't about the flashiest easing curve. They're about **direction that matches intent** and **layout that doesn't jump**. Get `popLayout`, a keyed element, and an honest direction value right, and a spring does the rest.
