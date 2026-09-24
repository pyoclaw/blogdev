---
title: "Motion You Can Turn Off"
date: "2026-08-12"
tags: [accessibility, css, motion]
accent: coral
excerpt: "A site this bouncy owes people an exit. Here's how one media query, a couple of early returns, and honest defaults keep the motion delightful for most and harmless for the rest."
---

The entire pitch of this blog is *motion* — sliding pages, springing cards, a trailing cursor. For some people that same motion causes real discomfort: nausea, dizziness, migraines. Vestibular disorders are common, and the OS-level "Reduce Motion" toggle is how those users ask you to calm down. Honoring it isn't a nice-to-have; it's the price of shipping animation.

## The one query that does most of the work

`prefers-reduced-motion` mirrors that OS setting. The safest, broadest move is to neutralize *all* transitions and animations globally, then let specific opt-ins layer back if truly needed:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

Why `0.001ms` instead of `0`? Setting the duration to a hair above zero lets any `animationend` / `transitionend` listeners still fire, so JavaScript that waits on "animation finished" doesn't hang. The state changes still happen — they just happen *instantly*. Cards still reveal, pages still swap; nothing slides or springs.

## JavaScript animations need the same check

CSS is covered by that block, but hand-rolled JS animations have to ask on their own. The cursor blob bails out before it ever attaches a listener:

```ts
if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
```

One line, placed *before* any `requestAnimationFrame` loop or event binding, means the effect simply doesn't exist for users who opted out — not "runs and gets hidden," genuinely never starts.

## Design the still version to be good, not broken

The real test: does the site still make sense with the motion removed? A few choices make sure it does.

- **The page transition degrades to an instant swap.** With transitions zeroed, `AnimatePresence` still mounts the right page — you just get a cut instead of a slide. Fully functional.
- **The reading-progress bar was never a problem.** It only ever tracks your real scroll position, so it has no self-driven motion to suppress.
- **Scroll-reveal cards default to visible.** This is the subtle one. If an element starts at `opacity: 0` and relies on an animation to become visible, killing the animation leaves it *invisible forever*. So content must be readable at rest and motion should only ever *enhance* it.

> The golden rule: never hide content behind an animation you might disable. Animate from a valid state to another valid state.

## Test it in 5 seconds

You don't need a device setting to check your work — DevTools can force the query. In Chrome: **Rendering** panel → *Emulate CSS media feature `prefers-reduced-motion`* → `reduce`. Or from the console:

```js
matchMedia("(prefers-reduced-motion: reduce)").matches; // what your JS sees
```

Flip it on and click around. If the site is still fully usable — every page reachable, every card readable, nothing stuck mid-fade — you've done it right.

## The payoff

Respecting reduced motion made this codebase *better*, not blander. It forced every animation to be an enhancement over an already-correct static state. The playful version is the reward for good behavior; the calm version is the guarantee. Everyone gets a site that works.
