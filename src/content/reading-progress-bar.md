---
title: "A Reading Progress Bar That Doesn't Jank"
date: "2026-09-08"
tags: [javascript, css, ux]
accent: sky
excerpt: "That gradient bar creeping across the top of every post is ~15 lines of code. The trick is animating transform, not width, and letting a passive scroll listener do almost nothing."
---

Scroll down any article here and a coral-to-mint gradient bar fills across the top. It's a cheap way to answer "how much is left?" — and if you build it wrong, it's also a cheap way to make scrolling stutter. Let's build it right.

## The math

Progress is just how far you've scrolled divided by how far you *can* scroll:

```ts
function useReadingProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0);
    };
    onScroll(); // set the initial value
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return p; // 0 → 1
}
```

`scrollHeight - clientHeight` is the maximum scrollable distance. Guarding `max > 0` avoids a divide-by-zero on short pages, and `Math.min(1, …)` clamps the rubber-band overscroll you get on iOS.

## The part that keeps it smooth: animate `transform`

Here's the mistake almost every tutorial makes — animating `width`:

```css
/* ❌ triggers layout on every single scroll event */
.progress { width: calc(var(--p) * 100%); }
```

Changing `width` forces the browser to **re-run layout**, every frame, while you're scrolling. Instead, render a full-width bar and squash it with `transform: scaleX()`, which the compositor can handle on the GPU without touching layout:

```css
.progress {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 5px;
  z-index: 60;
  background: linear-gradient(90deg, var(--coral), var(--lemon), var(--mint));
  transform-origin: 0 50%;      /* grow from the left edge */
  transform: scaleX(var(--p, 0));
}
```

`transform-origin: 0 50%` pins the growth to the left so it fills rightward. The React side just pipes the hook's value into the custom property:

```tsx
const progress = useReadingProgress();
return <div className="progress" style={{ ["--p"]: progress }} />;
```

## `{ passive: true }` — the other free win

```ts
window.addEventListener("scroll", onScroll, { passive: true });
```

Marking the listener **passive** promises the browser you won't call `preventDefault()`, so it can start scrolling immediately instead of waiting to see what your handler does. On a scroll listener that's essentially mandatory — it's the difference between buttery and gluey on touch devices.

## Why not `requestAnimationFrame`?

You *could* throttle `setP` with `rAF`, and on a heavier handler you should. Here the handler does two reads and one `setState`, and React batches the render — so the scroll event itself stays cheap and the extra machinery isn't worth it. Measure before you optimize; this one didn't need it.

## Bonus: it respects reduced motion for free

Because the bar's only "animation" is following your actual scroll position, there's nothing to disable for motion-sensitive users — it never moves on its own. That's the nicest kind of accessible: correct by construction.
