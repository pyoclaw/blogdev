---
title: "A Cursor Blob That Lags Just Right"
date: "2026-08-30"
tags: [javascript, animation, css]
accent: lemon
excerpt: "The soft blob trailing your pointer never re-renders React. It's a requestAnimationFrame loop, one lerp, and a mix-blend-mode — plus the good manners to switch itself off where it doesn't belong."
---

On a desktop with a real mouse, a small blob follows your cursor around, easing behind it with a slight lag and multiplying its color into whatever's underneath. It's pure garnish — which means it has to be *cheap* and it has to *know when to stay home*.

## Rule #1: never re-render React for this

Mouse-move fires dozens of times a second. Routing every event through `setState` would re-render the tree constantly for a purely decorative element. So the component renders **once**, grabs a ref, and after that talks straight to the DOM:

```tsx
export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // ... listeners + animation loop, no setState in sight
  }, []);

  return <div className="spotlight" ref={ref} aria-hidden="true" />;
}
```

## Rule #2: separate "where the mouse is" from "where the blob is"

If the blob snapped exactly to the cursor it'd feel rigid. The charm is the lag. So we track two points — the **target** (the real cursor) and the blob's **current** position — and every frame nudge current toward target by a fraction. That fraction *is* the springiness:

```ts
let targetX = innerWidth / 2, targetY = innerHeight / 2;
let x = targetX, y = targetY;

window.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function tick() {
  // linear interpolation — close 18% of the gap each frame
  x += (targetX - x) * 0.18;
  y += (targetY - y) * 0.18;
  el.style.transform = `translate(${x - 13}px, ${y - 13}px)`;
  requestAnimationFrame(tick);
}
requestAnimationFrame(tick);
```

That one line — `x += (target - x) * 0.18` — is a **lerp**, the workhorse of juicy UI motion. A smaller factor (say `0.08`) makes the blob lazier; `1.0` makes it snap instantly. `0.18` is the sweet spot between "responsive" and "has some weight." The `- 13` just centers the 26px blob on the pointer.

Driving it from `requestAnimationFrame` means the movement is smooth and frame-rate-aware, and the cursor listener does nothing but stash two numbers.

## Rule #3: the color trick is one CSS line

No canvas, no blend math in JS. The blob is a plain colored circle; CSS does the compositing:

```css
.spotlight {
  position: fixed;
  width: 26px; height: 26px;
  border-radius: 50%;
  background: var(--coral);
  mix-blend-mode: multiply;  /* ← the whole effect */
  pointer-events: none;      /* never eat clicks */
  z-index: 90;
}
```

`mix-blend-mode: multiply` makes the blob darken-and-tint whatever it floats over instead of just sitting on top, and `pointer-events: none` guarantees it never intercepts a click.

## Rule #4: know when to stay home

This is a mouse toy. On touch, there's no cursor; for people who ask for less motion, it's noise. So it bails out early — twice:

```ts
if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
```

`(hover: hover) and (pointer: fine)` is the canonical "this device has a precise pointer" query — it's `true` for a mouse or trackpad and `false` for touchscreens. Because we `return` before adding any listeners, the whole feature costs literally nothing on a phone.

## Squash on click, for fun

One more touch: shrink the blob while the mouse is down, so clicking feels physical.

```ts
window.addEventListener("mousedown", () => el.style.setProperty("--scale", "0.55"));
window.addEventListener("mouseup",   () => el.style.setProperty("--scale", "1"));
```

The `tick` loop reads `--scale` and folds it into the same `transform`. Total cost of the entire effect: one element, one rAF loop, zero React renders.
